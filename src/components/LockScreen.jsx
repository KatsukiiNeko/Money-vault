import React, { useState, useRef, useEffect } from 'react';
import { deriveKey, generateSalt, createVerificationToken, verifyPassword, setSessionKey } from '../crypto/crypto';
import { db } from '../db/db';

const LockScreen = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState(null);
  const passwordInputRef = useRef(null);
  const intervalRef = useRef(null);

  // Check if a password has been set
  const checkIfPasswordSet = async () => {
    try {
      const setting = await db.settings.get('passwordSet');
      return !!setting;
    } catch (error) {
      return false;
    }
  };

  // Check for existing lockout
  useEffect(() => {
    const checkLockoutStatus = async () => {
      try {
        const lockoutData = await db.settings.get('lockoutData');
        if (lockoutData && lockoutData.value) {
          const { endTime, failedAttempts } = lockoutData.value;
          const now = new Date().getTime();
          if (endTime > now) {
            setIsLockedOut(true);
            setLockoutEndTime(endTime);
            setFailedAttempts(failedAttempts || 0);
          } else {
            await db.settings.delete('lockoutData');
          }
        }
      } catch {
        // No lockout data
      }
    };

    checkLockoutStatus();
  }, []);

  // Update lockout timer display
  useEffect(() => {
    if (isLockedOut && lockoutEndTime) {
      intervalRef.current = setInterval(() => {
        const now = new Date().getTime();
        if (now >= lockoutEndTime) {
          setIsLockedOut(false);
          setLockoutEndTime(null);
          db.settings.delete('lockoutData').catch(() => {});
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLockedOut, lockoutEndTime]);

  const handleUnlock = async (e) => {
    e.preventDefault();

    if (isLockedOut) {
      setError('Account is temporarily locked. Please try again later.');
      return;
    }

    if (!password) {
      setError('Please enter a password');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    try {
      const passwordSet = await checkIfPasswordSet();

      if (passwordSet) {
        // Unlock flow: verify password against stored token
        const salt = await db.settings.get('salt');
        if (!salt) {
          setError('Corrupted data. Please reset the app.');
          return;
        }

        const saltArray = new Uint8Array(Object.values(salt.value));
        const key = await deriveKey(password, saltArray);

        let token = await db.settings.get('verificationToken');
        if (!token) {
          // Migration: old data has no verification token — create one now
          const newToken = await createVerificationToken(key);
          await db.settings.put({ key: 'verificationToken', value: newToken });
          token = { value: newToken };
        }

        const isValid = await verifyPassword(key, token.value);

        if (isValid) {
          setFailedAttempts(0);
          await db.settings.delete('lockoutData').catch(() => {});
          setSessionKey(key);
          setPassword(''); // Clear password from state immediately
          onUnlock();
        } else {
          // Wrong password
          const newFailedAttempts = failedAttempts + 1;
          setFailedAttempts(newFailedAttempts);

          if (newFailedAttempts >= 5) {
            const endTime = new Date().getTime() + 30000;
            setIsLockedOut(true);
            setLockoutEndTime(endTime);
            await db.settings.put({
              key: 'lockoutData',
              value: { endTime, failedAttempts: newFailedAttempts }
            }).catch(() => {});
            setError('Too many failed attempts. Locked for 30 seconds.');
          } else {
            setError('Invalid password');
            await db.settings.put({
              key: 'lockoutData',
              value: { endTime: 0, failedAttempts: newFailedAttempts }
            }).catch(() => {});
          }
          setPassword('');
        }
      } else {
        // First-time setup
        const salt = generateSalt();
        await db.settings.put({ key: 'salt', value: Array.from(salt) });

        const key = await deriveKey(password, salt);
        const token = await createVerificationToken(key);
        await db.settings.put({ key: 'verificationToken', value: token });
        await db.settings.put({ key: 'passwordSet', value: true });

        setSessionKey(key);
        setPassword(''); // Clear password from state immediately
        onUnlock();
      }
    } catch (error) {
      setError('Failed to unlock. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="lock-screen">
      <div className="lock-screen-container">
        <h1>Money Vault</h1>
        <h2>Secure Personal Finance Tracker</h2>

        <form onSubmit={handleUnlock} className="lock-screen-form">
          <div className="password-input-container">
            <label htmlFor="password">Enter Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              ref={passwordInputRef}
              placeholder="Enter your PIN or password"
              disabled={isLockedOut}
              autoComplete="current-password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          {isLockedOut && (
            <div className="lockout-timer">
              Account locked. Try again in: {Math.ceil((lockoutEndTime - new Date().getTime()) / 1000)}s
            </div>
          )}

          <button type="submit" className="unlock-button" disabled={isLockedOut}>
            {isSettingUp ? 'Set Password' : 'Unlock'}
          </button>
        </form>

        <div className="app-info">
          <p>Your financial data is encrypted and stored locally on your device.</p>
          <p>No data is sent to any server.</p>
        </div>
      </div>
    </div>
  );
};

export default LockScreen;
