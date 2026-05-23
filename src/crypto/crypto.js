import { db } from '../db/db';

const VERIFICATION_PLAINTEXT = 'MONEYVAULT_VERIFY_v1';
export const PBKDF2_ITERATIONS = 600000;

const _sessionKeys = {};
let _activeAccountId = null;

export function getSessionKey(accountId) {
  const id = accountId || _activeAccountId;
  return id ? _sessionKeys[id] || null : null;
}

export function setSessionKey(key, accountId) {
  const id = accountId || _activeAccountId;
  if (id) {
    _sessionKeys[id] = key;
    _activeAccountId = id;
  }
}

export function clearSessionKey() {
  if (_activeAccountId) {
    delete _sessionKeys[_activeAccountId];
  }
}

export function clearAllSessionKeys() {
  for (const key of Object.keys(_sessionKeys)) {
    delete _sessionKeys[key];
  }
  _activeAccountId = null;
}

export function getActiveAccountId() {
  return _activeAccountId;
}

export function setActiveAccountId(id) {
  _activeAccountId = id;
}

export async function deriveKey(password, salt, iterations = PBKDF2_ITERATIONS) {
  const enc = new TextEncoder();
  const passwordBuffer = enc.encode(password);

  const baseKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveKey']
  );

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: iterations,
      hash: 'SHA-384'
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );

  return derivedKey;
}

export async function encryptData(data, key, iv) {
  const encodedData = new TextEncoder().encode(data);
  return await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    encodedData
  );
}

export async function decryptData(data, key, iv) {
  const decryptedData = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    data
  );
  return new TextDecoder().decode(decryptedData);
}

export function generateSalt(length = 16) {
  return window.crypto.getRandomValues(new Uint8Array(length));
}

export function generateIV(length = 12) {
  return window.crypto.getRandomValues(new Uint8Array(length));
}

export async function createVerificationToken(key) {
  const iv = generateIV();
  const encrypted = await encryptData(VERIFICATION_PLAINTEXT, key, iv);
  return {
    iv: Array.from(iv),
    ciphertext: Array.from(new Uint8Array(encrypted))
  };
}

export async function verifyPassword(key, token) {
  try {
    const iv = new Uint8Array(token.iv);
    const ciphertext = new Uint8Array(token.ciphertext);
    const decrypted = await decryptData(ciphertext, key, iv);
    return decrypted === VERIFICATION_PLAINTEXT;
  } catch {
    return false;
  }
}

export async function encryptTransactionForStorage(transaction, key) {
  const iv = generateIV();
  const jsonString = JSON.stringify(transaction);
  const encrypted = await encryptData(jsonString, key, iv);
  return {
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(encrypted))
  };
}

export async function decryptTransactionFromStorage(encryptedTransaction, key) {
  if (!encryptedTransaction.iv || !encryptedTransaction.data) {
    return { ...encryptedTransaction };
  }
  const iv = new Uint8Array(encryptedTransaction.iv);
  const data = new Uint8Array(encryptedTransaction.data);
  const jsonString = await decryptData(data, key, iv);
  return JSON.parse(jsonString);
}

export async function createBackup(password) {
  const transactions = await db.transactions.toArray();

  const salt = generateSalt();
  const iv = generateIV();
  const key = await deriveKey(password, salt);

  const transactionsString = JSON.stringify(transactions);
  const encryptedTransactions = await encryptData(transactionsString, key, iv);

  return {
    salt: Array.from(salt),
    iv: Array.from(iv),
    ciphertext: Array.from(new Uint8Array(encryptedTransactions)),
    version: 1,
    algorithm: 'AES-GCM-256'
  };
}

export async function restoreBackup(backup, password) {
  if (!backup || !backup.salt || !backup.iv || !backup.ciphertext) {
    throw new Error('Invalid backup format: missing required fields');
  }

  const salt = new Uint8Array(backup.salt);
  const iv = new Uint8Array(backup.iv);
  const key = await deriveKey(password, salt);

  const encryptedData = new Uint8Array(backup.ciphertext);
  const decryptedData = await decryptData(encryptedData, key, iv);

  const parsed = JSON.parse(decryptedData);
  if (!Array.isArray(parsed)) {
    throw new Error('Invalid backup data: expected array of transactions');
  }

  return parsed;
}

export function validateTransactionData(tx) {
  if (!tx || typeof tx !== 'object') return false;
  if (!tx.date || typeof tx.date !== 'string') return false;
  if (tx.type !== 'income' && tx.type !== 'expense') return false;
  if (tx.amount === undefined || typeof tx.amount !== 'number' || !isFinite(tx.amount) || tx.amount <= 0 || tx.amount > 999999999999) return false;
  if (!tx.category || typeof tx.category !== 'string') return false;
  if (tx.note && typeof tx.note === 'string' && tx.note.length > 500) return false;
  return true;
}

export async function createSecureBackup(password, accountId) {
  if (!password || password.length < 4) {
    throw new Error('Password must be at least 4 characters');
  }

  const key = getSessionKey(accountId);
  if (!key) throw new Error('Session expired');

  const allEncrypted = await db.transactions.where('accountId').equals(accountId).toArray();
  const saltSetting = await db.settings.get('salt:' + accountId);
  const tokenSetting = await db.settings.get('verificationToken:' + accountId);
  const account = await db.accounts.get(accountId);

  const rawTransactions = [];
  for (const enc of allEncrypted) {
    try {
      const plain = await decryptTransactionFromStorage(enc, key);
      if (validateTransactionData(plain)) {
        rawTransactions.push(plain);
      }
    } catch { }
  }

  if (rawTransactions.length === 0 && allEncrypted.length > 0) {
    throw new Error('Failed to decrypt transactions');
  }

  const backupPayload = {
    transactions: rawTransactions,
    accountSalt: saltSetting ? saltSetting.value : null,
    verificationToken: tokenSetting ? tokenSetting.value : null,
    version: 3
  };

  const backupSalt = generateSalt();
  const backupIV = generateIV();
  const backupKey = await deriveKey(password, backupSalt, PBKDF2_ITERATIONS);

  const jsonString = JSON.stringify(backupPayload);
  const encrypted = await encryptData(jsonString, backupKey, backupIV);

  return {
    salt: Array.from(backupSalt),
    iv: Array.from(backupIV),
    ciphertext: Array.from(new Uint8Array(encrypted)),
    version: 3,
    algorithm: 'AES-GCM-256',
    iterations: PBKDF2_ITERATIONS,
    accountName: account ? account.name : 'Unknown',
    timestamp: new Date().toISOString()
  };
}

export async function parseSecureBackup(backup) {
  if (!backup || !backup.salt || !backup.iv || !backup.ciphertext) {
    throw new Error('Invalid backup format');
  }
  return {
    version: backup.version || 1,
    iterations: backup.iterations || PBKDF2_ITERATIONS,
    accountName: backup.accountName || null,
    timestamp: backup.timestamp || null
  };
}

export async function restoreSecureBackup(backup, password, accountId, overrideIterations) {
  if (!backup || !backup.salt || !backup.iv || !backup.ciphertext) {
    throw new Error('Invalid backup format: missing required fields');
  }
  if (!password || password.length < 4) {
    throw new Error('Password must be at least 4 characters');
  }

  const salt = new Uint8Array(backup.salt);
  const iv = new Uint8Array(backup.iv);
  const iterations = overrideIterations || backup.iterations || PBKDF2_ITERATIONS;
  const key = await deriveKey(password, salt, iterations);

  let decrypted;
  try {
    const encryptedData = new Uint8Array(backup.ciphertext);
    decrypted = await decryptData(encryptedData, key, iv);
  } catch {
    throw new Error('Wrong password or corrupted backup');
  }

  let backupPayload;
  try {
    backupPayload = JSON.parse(decrypted);
  } catch {
    throw new Error('Invalid backup data');
  }

  if (!backupPayload.transactions || !Array.isArray(backupPayload.transactions)) {
    throw new Error('Invalid backup data: missing transactions');
  }

  const validTransactions = [];
  for (const tx of backupPayload.transactions) {
    if (validateTransactionData(tx)) {
      validTransactions.push(tx);
    }
  }

  if (validTransactions.length === 0) {
    throw new Error('No valid transactions in backup');
  }

  const sessionKey = getSessionKey(accountId);
  if (!sessionKey) throw new Error('Session expired');

  const reEncrypted = [];
  for (const tx of validTransactions) {
    const encrypted = await encryptTransactionForStorage(tx, sessionKey);
    encrypted.accountId = accountId;
    reEncrypted.push(encrypted);
  }

  await db.transaction('rw', db.transactions, db.settings, async () => {
    await db.transactions.where('accountId').equals(accountId).delete();
    await db.transactions.bulkAdd(reEncrypted);

    if (backupPayload.accountSalt) {
      const existingSalt = await db.settings.get('salt:' + accountId);
      if (!existingSalt) {
        await db.settings.put({ key: 'salt:' + accountId, value: backupPayload.accountSalt });
      }
    }
    if (backupPayload.verificationToken) {
      const existingToken = await db.settings.get('verificationToken:' + accountId);
      if (!existingToken) {
        await db.settings.put({ key: 'verificationToken:' + accountId, value: backupPayload.verificationToken });
        await db.settings.put({ key: 'passwordSet:' + accountId, value: true });
      }
    }
  });

  return validTransactions.length;
}

export async function reEncryptTransactions(transactions, oldKey, newKey) {
  const reEncrypted = [];
  for (const tx of transactions) {
    const plain = await decryptTransactionFromStorage(tx, oldKey);
    const encrypted = await encryptTransactionForStorage(plain, newKey);
    reEncrypted.push(encrypted);
  }
  return reEncrypted;
}

export default {
  deriveKey,
  encryptData,
  decryptData,
  generateSalt,
  generateIV,
  getSessionKey,
  setSessionKey,
  clearSessionKey,
  clearAllSessionKeys,
  getActiveAccountId,
  setActiveAccountId,
  createVerificationToken,
  verifyPassword,
  encryptTransactionForStorage,
  decryptTransactionFromStorage,
  createBackup,
  restoreBackup,
  createSecureBackup,
  parseSecureBackup,
  restoreSecureBackup,
  validateTransactionData,
  reEncryptTransactions
};
