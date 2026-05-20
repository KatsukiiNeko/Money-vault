import { db } from '../db/db';

const VERIFICATION_PLAINTEXT = 'MONEYVAULT_VERIFY_v1';

let _sessionKey = null;

export function getSessionKey() {
  return _sessionKey;
}

export function setSessionKey(key) {
  _sessionKey = key;
}

export function clearSessionKey() {
  _sessionKey = null;
}

export async function deriveKey(password, salt, iterations = 200000) {
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
  createVerificationToken,
  verifyPassword,
  encryptTransactionForStorage,
  decryptTransactionFromStorage,
  createBackup,
  restoreBackup,
  reEncryptTransactions
};
