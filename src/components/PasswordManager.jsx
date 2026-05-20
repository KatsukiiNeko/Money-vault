import React, { useState } from 'react';
import { deriveKey, generateSalt, getSessionKey, setSessionKey, createVerificationToken, verifyPassword, encryptTransactionForStorage, decryptTransactionFromStorage } from '../crypto/crypto';
import { db } from '../db/db';

const PasswordManager = ({ onPasswordChange }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 4) {
      setError('New password must be at least 4 characters');
      return;
    }

    try {
      setIsLoading(true);

      // Verify current password
      const salt = await db.settings.get('salt');
      const token = await db.settings.get('verificationToken');
      if (!salt || !token) {
        setError('No password has been set yet');
        setIsLoading(false);
        return;
      }

      const saltArray = new Uint8Array(Object.values(salt.value));
      const oldKey = await deriveKey(currentPassword, saltArray);
      const isValid = await verifyPassword(oldKey, token.value);

      if (!isValid) {
        setError('Current password is incorrect');
        setIsLoading(false);
        return;
      }

      // Get all encrypted transactions with old key
      const allEncrypted = await db.transactions.toArray();

      // Decrypt all transactions with old key
      const decryptedTransactions = [];
      for (const enc of allEncrypted) {
        try {
          const tx = await decryptTransactionFromStorage(enc, oldKey);
          decryptedTransactions.push(tx);
        } catch {
          setError('Failed to decrypt some transactions. Aborting password change.');
          setIsLoading(false);
          return;
        }
      }

      // Generate new salt and derive new key
      const newSalt = generateSalt();
      const newKey = await deriveKey(newPassword, newSalt);

      // Re-encrypt all transactions with new key
      await db.transactions.clear();
      for (const tx of decryptedTransactions) {
        const encrypted = await encryptTransactionForStorage(tx, newKey);
        await db.transactions.add(encrypted);
      }

      // Store new salt and verification token
      await db.settings.put({ key: 'salt', value: Array.from(newSalt) });
      const newToken = await createVerificationToken(newKey);
      await db.settings.put({ key: 'verificationToken', value: newToken });

      // Update session key
      setSessionKey(newKey);

      setSuccess('Password changed successfully. All data re-encrypted.');
      setIsLoading(false);

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('Failed to change password: ' + err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="password-manager">
      <h2>Change Password</h2>
      <form onSubmit={handleChangePassword}>
        <div className="form-group">
          <label htmlFor="currentPassword">Current Password:</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          className="change-password-button"
          disabled={isLoading}
        >
          {isLoading ? 'Changing...' : 'Change Password'}
        </button>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </form>
    </div>
  );
};

export default PasswordManager;
