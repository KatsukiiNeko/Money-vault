import React, { useState, useRef, useEffect } from 'react';
import { deriveKey, generateSalt } from '../crypto/crypto';
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
      console.error('Error checking password status:', error);
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
            // Clear expired lockout
            await db.settings.delete('lockoutData');
          }
        }
      } catch (error) {
        console.log('No existing lockout data');
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
          // Clear lockout data
          db.settings.delete('lockoutData').catch(e => console.log('Error clearing lockout data:', e));
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

    // Validate password strength
    if (password.length < 4) {
      setError('Password must be at least 4 characters long');
      return;
    }

    // Check for password complexity (at least one letter and one number)
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (!hasLetter || !hasNumber) {
      setError('Password must contain at least one letter and one number');
      return;
    }

    try {
      // Check if password is already set
      const passwordSet = await checkIfPasswordSet();

      if (passwordSet) {
        // Try to unlock with the provided password
        const salt = await db.settings.get('salt');
        if (!salt) {
          setError('No password has been set yet');
          return;
        }

        try {
          // Try to derive key to verify password
          const saltArray = new Uint8Array(Object.values(salt.value));
          await deriveKey(password, saltArray);
          // If we get here, the password is correct
          // Reset failed attempts on successful login
          setFailedAttempts(0);
          await db.settings.delete('lockoutData').catch(e => console.log('Error clearing lockout data:', e));
          onUnlock(password);
        } catch (error) {
          // Increment failed attempts
          const newFailedAttempts = failedAttempts + 1;
          setFailedAttempts(newFailedAttempts);

          // Lockout after 3 failed attempts for 30 seconds
          if (newFailedAttempts >= 3) {
            const lockoutEndTime = new Date().getTime() + 30000; // 30 seconds
            setIsLockedOut(true);
            setLockoutEndTime(lockoutEndTime);

            // Store lockout data
            await db.settings.put({
              key: 'lockoutData',
              value: {
                endTime: lockoutEndTime,
                failedAttempts: newFailedAttempts
              }
            }).catch(e => console.log('Error storing lockout data:', e));

            setError('Too many failed attempts. Account locked for 30 seconds.');
          } else {
            setError('Invalid password');
            // Store failed attempts
            await db.settings.put({
              key: 'lockoutData',
              value: {
                endTime: 0,
                failedAttempts: newFailedAttempts
              }
            }).catch(e => console.log('Error storing attempt data:', e));
          }
        }
      } else {
        // Setting up a new password
        setIsSettingUp(true);
        const salt = generateSalt();

        // Store the salt for future password verification
        await db.settings.put({ key: 'salt', value: Array.from(salt) });

        // Mark that a password has been set
        await db.settings.put({ key: 'passwordSet', value: true });

        // Derive the key and store it
        await deriveKey(password, salt);

        onUnlock(password);
      }
    } catch (error) {
      console.error('Error unlocking:', error);
      setError('Failed to unlock. Please try again.');
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
              placeholder="Enter your password"
              disabled={isLockedOut}
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