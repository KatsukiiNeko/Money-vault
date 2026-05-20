// Crypto utility functions for encryption and decryption
import { db } from '../db/db';

/**
 * Derive a key from a password using PBKDF2
 * @param {string} password - The user's password
 * @param {Uint8Array} salt - The salt for key derivation
 * @param {number} iterations - Number of iterations for PBKDF2
 * @returns {Promise<CryptoKey>} The derived key
 */
export async function deriveKey(password, salt, iterations = 200000) {
  // Convert password to ArrayBuffer
  const enc = new TextEncoder();
  const passwordBuffer = enc.encode(password);

  // Import the password as a crypto key
  const baseKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveKey']
  );

  // Derive the key using PBKDF2
  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: iterations,
      hash: 'SHA-256'
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  return derivedKey;
}

/**
 * Encrypt data using AES-GCM
 * @param {string} data - The data to encrypt
 * @param {CryptoKey} key - The encryption key
 * @param {Uint8Array} iv - The initialization vector
 * @returns {Promise<ArrayBuffer>} The encrypted data
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
 * @param {ArrayBuffer} data - The encrypted data
 * @param {CryptoKey} key - The decryption key
 * @param {Uint8Array} iv - The initialization vector
 * @returns {Promise<string>} The decrypted data as string
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
 * @param {number} length - Length of the salt in bytes
 * @returns {Uint8Array} The generated salt
 */
export function generateSalt(length = 16) {
  return window.crypto.getRandomValues(new Uint8Array(length));
}

/**
 * Generate a random IV
 * @param {number} length - Length of the IV in bytes
 * @returns {Uint8Array} The generated IV
 */
export function generateIV(length = 12) {
  return window.crypto.getRandomValues(new Uint8Array(length));
}

/**
 * Encrypt a transaction object
 * @param {Object} transaction - The transaction object to encrypt
 * @param {CryptoKey} key - The encryption key
 * @param {Uint8Array} iv - The initialization vector
 * @returns {Promise<ArrayBuffer>} The encrypted transaction
 */
export async function encryptTransaction(transaction, key, iv) {
  const transactionString = JSON.stringify(transaction);
  return await encryptData(transactionString, key, iv);
}

/**
 * Decrypt a transaction object
 * @param {ArrayBuffer} encryptedData - The encrypted transaction data
 * @param {CryptoKey} key - The decryption key
 * @param {Uint8Array} iv - The initialization vector
 * @returns {Promise<Object>} The decrypted transaction object
 */
export async function decryptTransaction(encryptedData, key, iv) {
  const decryptedString = await decryptData(encryptedData, key, iv);
  return JSON.parse(decryptedString);
}

/**
 * Create an encrypted backup of all transactions
 * @param {string} password - The user's password
 * @returns {Promise<Object>} The backup object with salt, iv, and ciphertext
 */
export async function createBackup(password) {
  // Get all transactions from the database
  const transactions = await db.transactions.toArray();

  // Generate salt and IV
  const salt = generateSalt();
  const iv = generateIV();

  // Derive key from password
  const key = await deriveKey(password, salt);

  // Encrypt all transactions
  const transactionsString = JSON.stringify(transactions);
  const encryptedTransactions = await encryptData(transactionsString, key, iv);

  // Create backup object
  return {
    salt: Array.from(salt),
    iv: Array.from(iv),
    ciphertext: Array.from(new Uint8Array(encryptedTransactions)),
    algorithm: 'AES-GCM'
  };
}

/**
 * Restore from an encrypted backup
 * @param {Object} backup - The backup object
 * @param {string} password - The user's password
 * @returns {Promise<Array>} The restored transactions
 */
export async function restoreBackup(backup, password) {
  // Convert arrays back to Uint8Arrays
  const salt = new Uint8Array(backup.salt);
  const iv = new Uint8Array(backup.iv);

  // Derive key from password
  const key = await deriveKey(password, salt);

  // Decrypt the backup
  const encryptedData = new Uint8Array(backup.ciphertext);
  const decryptedData = await decryptData(encryptedData, key, iv);

  // Parse the decrypted data
  return JSON.parse(decryptedData);
}

export default {
  deriveKey,
  encryptData,
  decryptData,
  generateSalt,
  generateIV,
  encryptTransaction,
  decryptTransaction,
  createBackup,
  restoreBackup
};