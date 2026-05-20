// Crypto utility functions for encryption and decryption
// All crypto operations use a module-scoped key derived from the user's password
import { db } from '../db/db';

const VERIFICATION_PLAINTEXT = 'MONEYVAULT_VERIFY_v1';

// Module-scoped key — never persisted, only held in memory during session
let _sessionKey = null;

/**
 * Get the current session key (must be set via setSessionKey first)
 */
export function getSessionKey() {
  return _sessionKey;
}

/**
 * Set the session key
 */
export function setSessionKey(key) {
  _sessionKey = key;
}

/**
 * Clear the session key from memory
 */
export function clearSessionKey() {
  _sessionKey = null;
}

/**
 * Derive a key from a password using PBKDF2
 */
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
    false, // non-extractable
    ['encrypt', 'decrypt']
  );

  return derivedKey;
}

/**
 * Encrypt data using AES-GCM
 */
export async function encryptData(data, key, iv) {
  const encodedData = new TextEncoder().encode(data);
  return await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    encodedData
  );
}

/**
 * Decrypt data using AES-GCM
 */
export async function decryptData(data, key, iv) {
  const decryptedData = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    data
  );
  return new TextDecoder().decode(decryptedData);
}

/**
 * Generate a random salt
 */
export function generateSalt(length = 16) {
  return window.crypto.getRandomValues(new Uint8Array(length));
}

/**
 * Generate a random IV
 */
export function generateIV(length = 12) {
  return window.crypto.getRandomValues(new Uint8Array(length));
}

/**
 * Create a verification token for password checking.
 * Encrypts a known plaintext with the derived key.
 */
export async function createVerificationToken(key) {
  const iv = generateIV();
  const encrypted = await encryptData(VERIFICATION_PLAINTEXT, key, iv);
  return {
    iv: Array.from(iv),
    ciphertext: Array.from(new Uint8Array(encrypted))
  };
}

/**
 * Verify a password by attempting to decrypt the verification token.
 * Returns true if the password is correct, false otherwise.
 */
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

/**
 * Encrypt a single transaction for storage
 */
export async function encryptTransactionForStorage(transaction, key) {
  const iv = generateIV();
  const jsonString = JSON.stringify(transaction);
  const encrypted = await encryptData(jsonString, key, iv);
  return {
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(encrypted))
  };
}

/**
 * Decrypt a single transaction from storage.
 * Handles both new encrypted format {iv, data} and legacy plaintext format.
 */
export async function decryptTransactionFromStorage(encryptedTransaction, key) {
  // Legacy plaintext transaction (no iv/data fields)
  if (!encryptedTransaction.iv || !encryptedTransaction.data) {
    return { ...encryptedTransaction };
  }
  const iv = new Uint8Array(encryptedTransaction.iv);
  const data = new Uint8Array(encryptedTransaction.data);
  const jsonString = await decryptData(data, key, iv);
  return JSON.parse(jsonString);
}

/**
 * Create an encrypted backup of all transactions
 */
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

/**
 * Restore from an encrypted backup
 */
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

/**
 * Re-encrypt all transactions with a new key.
 * Returns encrypted transactions array.
 */
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
