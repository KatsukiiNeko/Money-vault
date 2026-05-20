import { useState } from 'react';
import { deriveKey, generateSalt, getSessionKey, setSessionKey, createVerificationToken, verifyPassword, encryptTransactionForStorage, decryptTransactionFromStorage } from '../crypto/crypto';
import { db } from '../db/db';
import { useLanguage } from '../context/LanguageContext';

const PasswordManager = ({ onPasswordChange }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useLanguage();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError(t('password.errors.required'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t('password.errors.mismatch'));
      return;
    }

    if (newPassword.length < 4) {
      setError(t('password.errors.tooShort'));
      return;
    }

    try {
      setIsLoading(true);

      const salt = await db.settings.get('salt');
      const token = await db.settings.get('verificationToken');
      if (!salt || !token) {
        setError(t('password.errors.notSet'));
        setIsLoading(false);
        return;
      }

      const saltArray = new Uint8Array(Object.values(salt.value));
      const oldKey = await deriveKey(currentPassword, saltArray);
      const isValid = await verifyPassword(oldKey, token.value);

      if (!isValid) {
        setError(t('password.errors.incorrect'));
        setIsLoading(false);
        return;
      }

      const allEncrypted = await db.transactions.toArray();

      const decryptedTransactions = [];
      for (const enc of allEncrypted) {
        try {
          const tx = await decryptTransactionFromStorage(enc, oldKey);
          decryptedTransactions.push(tx);
        } catch {
          setError(t('password.errors.decryptFailed'));
          setIsLoading(false);
          return;
        }
      }

      const newSalt = generateSalt();
      const newKey = await deriveKey(newPassword, newSalt);

      await db.transactions.clear();
      for (const tx of decryptedTransactions) {
        const encrypted = await encryptTransactionForStorage(tx, newKey);
        await db.transactions.add(encrypted);
      }

      await db.settings.put({ key: 'salt', value: Array.from(newSalt) });
      const newToken = await createVerificationToken(newKey);
      await db.settings.put({ key: 'verificationToken', value: newToken });

      setSessionKey(newKey);

      setSuccess(t('password.success.changed'));
      setIsLoading(false);

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(t('password.errors.changeFailed') + err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="password-manager">
      <button
        className="password-manager-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="toggle-content">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span>{t('password.toggleLabel')}</span>
        </div>
        <svg
          className={`chevron ${isExpanded ? 'expanded' : ''}`}
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {isExpanded && (
        <form onSubmit={handleChangePassword} className="password-form">
          <div className="password-field">
            <label htmlFor="currentPassword">{t('password.currentLabel')}</label>
            <div className="input-wrapper">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder={t('password.currentPlaceholder')}
              />
            </div>
          </div>

          <div className="password-field">
            <label htmlFor="newPassword">{t('password.newLabel')}</label>
            <div className="input-wrapper">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder={t('password.newPlaceholder')}
              />
            </div>
          </div>

          <div className="password-field">
            <label htmlFor="confirmPassword">{t('password.confirmLabel')}</label>
            <div className="input-wrapper">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder={t('password.confirmPlaceholder')}
              />
            </div>
          </div>

          <button
            type="submit"
            className="password-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
                {t('password.reEncrypting')}
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {t('password.update')}
              </>
            )}
          </button>

          {error && (
            <div className="password-alert error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className="password-alert success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              {success}
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default PasswordManager;
