import { useState, useRef, useEffect } from 'react';
import { deriveKey, generateSalt, createVerificationToken, verifyPassword, setSessionKey } from '../crypto/crypto';
import { db } from '../db/db';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from './LanguageToggle';

const LockScreen = ({ accountId, onUnlock, onBack }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [tokenMissing, setTokenMissing] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const passwordInputRef = useRef(null);
  const intervalRef = useRef(null);
  const { t } = useLanguage();

  useEffect(() => {
    const checkLockoutStatus = async () => {
      try {
        const lockoutData = await db.settings.get('lockoutData:' + accountId);
        if (lockoutData && lockoutData.value) {
          const { endTime, failedAttempts } = lockoutData.value;
          const now = Date.now();
          if (endTime > now) {
            setIsLockedOut(true);
            setLockoutEndTime(endTime);
            setFailedAttempts(failedAttempts || 0);
          } else {
            setFailedAttempts(failedAttempts || 0);
            await db.settings.put({
              key: 'lockoutData:' + accountId,
              value: { endTime: 0, failedAttempts: failedAttempts || 0 }
            });
          }
        }
      } catch { /* lockout check failed */ }
    };

    checkLockoutStatus();
  }, [accountId]);

  useEffect(() => {
    if (isLockedOut && lockoutEndTime) {
      intervalRef.current = setInterval(() => {
        const currentTime = Date.now();
        setNow(currentTime);
        if (currentTime >= lockoutEndTime) {
          setIsLockedOut(false);
          setLockoutEndTime(null);
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
      const passwordSet = await db.settings.get('passwordSet:' + accountId);

      if (passwordSet) {
        const salt = await db.settings.get('salt:' + accountId);
        if (!salt) {
          setError(t('lock.errors.corrupted'));
          return;
        }

        const saltArray = new Uint8Array(Object.values(salt.value));
        const key = await deriveKey(password, saltArray);

        const token = await db.settings.get('verificationToken:' + accountId);
        if (!token) {
          setTokenMissing(true);
          setError(t('lock.errors.tokenMissing'));
          return;
        }

        const isValid = await verifyPassword(key, token.value);

        if (isValid) {
          setFailedAttempts(0);
          await db.settings.put({
            key: 'lockoutData:' + accountId,
            value: { endTime: 0, failedAttempts: 0 }
          }).catch(() => {});
          setSessionKey(key, accountId);
          setPassword('');
          setIsUnlocking(true);
          setTimeout(() => onUnlock(), 800);
        } else {
          const newFailedAttempts = failedAttempts + 1;
          setFailedAttempts(newFailedAttempts);

          const lockoutValue = {
            endTime: newFailedAttempts >= 5 ? Date.now() + 30000 : 0,
            failedAttempts: newFailedAttempts
          };
          await db.settings.put({
            key: 'lockoutData:' + accountId,
            value: lockoutValue
          }).catch(() => {});

          if (newFailedAttempts >= 5) {
            setIsLockedOut(true);
            setLockoutEndTime(lockoutValue.endTime);
            setError(t('lock.errors.tooManyAttempts'));
          } else {
            setError(t('lock.errors.invalid'));
          }
          setPassword('');
        }
      } else {
        const salt = generateSalt();
        await db.settings.put({ key: 'salt:' + accountId, value: Array.from(salt) });

        const key = await deriveKey(password, salt);
        const token = await createVerificationToken(key);
        await db.settings.put({ key: 'verificationToken:' + accountId, value: token });
        await db.settings.put({ key: 'passwordSet:' + accountId, value: true });

        setSessionKey(key, accountId);
        setPassword('');
        setIsUnlocking(true);
        setTimeout(() => onUnlock(), 800);
      }
    } catch {
      setError(t('lock.errors.unlockFailed'));
      setPassword('');
    }
  };

  const handleResetAccount = async () => {
    if (!window.confirm(t('lock.resetConfirm'))) return;

    try {
      await db.transactions.where('accountId').equals(accountId).delete();
      await db.settings.delete('salt:' + accountId);
      await db.settings.delete('verificationToken:' + accountId);
      await db.settings.delete('passwordSet:' + accountId);
      await db.settings.delete('lockoutData:' + accountId);
      setTokenMissing(false);
      setError('');
      setFailedAttempts(0);
      setIsLockedOut(false);
      setPassword('');
    } catch {
      setError(t('lock.errors.unlockFailed'));
    }
  };

  return (
    <div className={`lock-screen ${isUnlocking ? 'unlocking' : ''}`}>
      <div className="lock-screen-container">
        <div className="lock-screen-top-bar">
          <button className="lock-back-button" onClick={onBack}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
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
              {t('lock.lockoutTimer', { seconds: Math.ceil((lockoutEndTime - now) / 1000) })}
            </div>
          )}

          <button type="submit" className="unlock-button" disabled={isLockedOut || tokenMissing}>
            {t('lock.unlock')}
          </button>
        </form>

        {tokenMissing && (
          <button className="reset-account-btn" onClick={handleResetAccount}>
            {t('lock.resetAccount')}
          </button>
        )}

        <div className="app-info">
          <p>{t('lock.info.encrypted')}</p>
          <p>{t('lock.info.noServer')}</p>
        </div>
      </div>
    </div>
  );
};

export default LockScreen;
