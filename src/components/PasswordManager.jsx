import React, { useState } from 'react';
import { deriveKey, generateSalt } from '../crypto/crypto';
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

    // Validate passwords
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    // Validate new password strength
    if (newPassword.length < 4) {
      setError('New password must be at least 4 characters long');
      return;
    }

    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    if (!hasLetter || !hasNumber) {
      setError('New password must contain at least one letter and one number');
      return;
    }

    try {
      setIsLoading(true);

      // Verify current password
      const salt = await db.settings.get('salt');
      if (!salt) {
        setError('No password has been set yet');
        return;
      }

      const saltArray = new Uint8Array(Object.values(salt.value));
      try {
        await deriveKey(currentPassword, saltArray);
      } catch (error) {
        setError('Current password is incorrect');
        setIsLoading(false);
        return;
      }

      // Update password
      const newSalt = generateSalt();
      await db.settings.put({ key: 'salt', value: Array.from(newSalt) });

      // Update password status
      await db.settings.put({ key: 'passwordSet', value: true });

      setSuccess('Password changed successfully');
      setIsLoading(false);

      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError('Failed to change password: ' + error.message);
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