import { useState, useRef, useEffect } from 'react';
import { deriveKey, generateSalt, createVerificationToken, verifyPassword, setSessionKey } from '../crypto/crypto';
import { db } from '../db/db';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from './LanguageToggle';

const LockScreen = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const passwordInputRef = useRef(null);
  const intervalRef = useRef(null);
  const { t } = useLanguage();

  const checkIfPasswordSet = async () => {
    try {
      const setting = await db.settings.get('passwordSet');
      return !!setting;
    } catch (error) {
      return false;
    }
  };

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
      } catch {}
    };

    checkLockoutStatus();
  }, []);

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
      setError(t('lock.errors.locked'));
      return;
    }

    if (!password) {
      setError(t('lock.errors.emptyPassword'));
      return;
    }

    if (password.length < 4) {
      setError(t('lock.errors.tooShort'));
      return;
    }

    try {
      const passwordSet = await checkIfPasswordSet();

      if (passwordSet) {
        const salt = await db.settings.get('salt');
        if (!salt) {
          setError(t('lock.errors.corrupted'));
          return;
        }

        const saltArray = new Uint8Array(Object.values(salt.value));
        const key = await deriveKey(password, saltArray);

        let token = await db.settings.get('verificationToken');
        if (!token) {
          const newToken = await createVerificationToken(key);
          await db.settings.put({ key: 'verificationToken', value: newToken });
          token = { value: newToken };
        }

        const isValid = await verifyPassword(key, token.value);

        if (isValid) {
          setFailedAttempts(0);
          await db.settings.delete('lockoutData').catch(() => {});
          setSessionKey(key);
          setPassword('');
          setIsUnlocking(true);
          setTimeout(() => onUnlock(), 800);
        } else {
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
            setError(t('lock.errors.tooManyAttempts'));
          } else {
            setError(t('lock.errors.invalid'));
            await db.settings.put({
              key: 'lockoutData',
              value: { endTime: 0, failedAttempts: newFailedAttempts }
            }).catch(() => {});
          }
          setPassword('');
        }
      } else {
        const salt = generateSalt();
        await db.settings.put({ key: 'salt', value: Array.from(salt) });

        const key = await deriveKey(password, salt);
        const token = await createVerificationToken(key);
        await db.settings.put({ key: 'verificationToken', value: token });
        await db.settings.put({ key: 'passwordSet', value: true });

        setSessionKey(key);
        setPassword('');
        setIsUnlocking(true);
        setTimeout(() => onUnlock(), 800);
      }
    } catch (error) {
      setError(t('lock.errors.unlockFailed'));
      setPassword('');
    }
  };

  return (
    <div className={`lock-screen ${isUnlocking ? 'unlocking' : ''}`}>
      <div className="lock-screen-container">
        <div className="lock-screen-toggle">
          <LanguageToggle />
        </div>
        <h1>{t('lock.title')}</h1>
        <h2>{t('lock.subtitle')}</h2>

        <form onSubmit={handleUnlock} className="lock-screen-form">
          <div className="password-input-container">
            <label htmlFor="password">{t('lock.enterPassword')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              ref={passwordInputRef}
              placeholder={t('lock.passwordPlaceholder')}
              disabled={isLockedOut}
              autoComplete="current-password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          {isLockedOut && (
            <div className="lockout-timer">
              {t('lock.lockoutTimer', { seconds: Math.ceil((lockoutEndTime - new Date().getTime()) / 1000) })}
            </div>
          )}

          <button type="submit" className="unlock-button" disabled={isLockedOut}>
            {t('lock.unlock')}
          </button>
        </form>

        <div className="app-info">
          <p>{t('lock.info.encrypted')}</p>
          <p>{t('lock.info.noServer')}</p>
        </div>
      </div>
    </div>
  );
};

export default LockScreen;
