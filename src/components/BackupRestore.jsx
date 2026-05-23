import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import ConfirmDialog from './ConfirmDialog';

const BackupRestore = ({ onBackup, onSecureBackup, onRestore, onSecureRestore }) => {
  const [mode, setMode] = useState(null); // null, 'secureBackup', 'secureRestore', 'legacyRestore'
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingBackup, setPendingBackup] = useState(null);
  const [restoreMeta, setRestoreMeta] = useState(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const cooldownRef = useRef(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (cooldown > 0) {
      cooldownRef.current = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) { clearInterval(cooldownRef.current); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (cooldownRef.current) clearInterval(cooldownRef.current); };
  }, [cooldown]);

  const resetForm = () => {
    setMode(null);
    setPassword('');
    setConfirmPassword('');
    setError('');
    setStatus('');
    setPendingBackup(null);
    setRestoreMeta(null);
  };

  const handleQuickBackup = async () => {
    setIsLoading(true);
    setStatus(t('backup.creating'));
    setError('');
    try {
      await onBackup();
      setStatus(t('backup.success'));
    } catch (err) {
      setError(t('backup.failedPrefix') + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecureBackupClick = () => {
    resetForm();
    setMode('secureBackup');
  };

  const handleSecureBackupSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password || password.length < 4) {
      setError(t('backup.passwordTooShort'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('backup.passwordMismatch'));
      return;
    }

    setIsLoading(true);
    setStatus(t('backup.creating'));
    try {
      await onSecureBackup(password);
      setStatus(t('backup.success'));
      setMode(null);
    } catch (err) {
      setError(t('backup.failedPrefix') + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmRestore = async () => {
    setShowConfirm(false);
    setIsLoading(true);
    setStatus(t('backup.restoreStarted'));
    setError('');

    try {
      const result = await onRestore();

      if (result.format === 'secure' || result.format === 'legacy') {
        // Need password — show password form
        setPendingBackup(result.backup);
        setRestoreMeta(result.meta || null);
        setMode('secureRestore');
        setStatus('');
      } else if (result.format === 'quick') {
        setStatus(t('backup.restoreSuccess', { count: result.count }));
      }
    } catch (err) {
      setError(t('backup.failedRestorePrefix') + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecureRestoreSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password || password.length < 4) {
      setError(t('backup.passwordTooShort'));
      return;
    }

    if (cooldown > 0) {
      setError(t('backup.cooldown', { seconds: cooldown }));
      return;
    }

    setIsLoading(true);
    setStatus(t('backup.restoring'));
    try {
      const count = await onSecureRestore(pendingBackup, password);
      setStatus(t('backup.restoreSuccess', { count }));
      resetForm();
    } catch (err) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= 3) {
        setCooldown(30);
        setFailedAttempts(0);
      }
      setError(t('backup.failedRestorePrefix') + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Password form for secure backup or restore
  if (mode === 'secureBackup' || mode === 'secureRestore') {
    const isBackup = mode === 'secureBackup';
    return (
      <div className="backup-restore">
        <h2>{isBackup ? t('backup.secureBackupTitle') : t('backup.secureRestoreTitle')}</h2>

        {restoreMeta?.accountName && (
          <div className="backup-meta">
            <span className="backup-meta-label">{t('backup.accountName')}:</span>
            <span className="backup-meta-value">{restoreMeta.accountName}</span>
          </div>
        )}
        {restoreMeta?.timestamp && (
          <div className="backup-meta">
            <span className="backup-meta-label">{t('backup.backupDate')}:</span>
            <span className="backup-meta-value">{new Date(restoreMeta.timestamp).toLocaleDateString()}</span>
          </div>
        )}

        <form onSubmit={isBackup ? handleSecureBackupSubmit : handleSecureRestoreSubmit} className="backup-password-form">
          <div className="backup-password-field">
            <label>{t('backup.enterPassword')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('backup.passwordPlaceholder')}
              disabled={isLoading}
              autoComplete="off"
              autoFocus
            />
          </div>

          {isBackup && (
            <div className="backup-password-field">
              <label>{t('backup.confirmPassword')}</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('backup.confirmPlaceholder')}
                disabled={isLoading}
                autoComplete="off"
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
          {status && <div className="status-message">{status}</div>}

          <div className="backup-form-actions">
            <button type="submit" className="backup-button" disabled={isLoading || cooldown > 0}>
              {isLoading ? t('backup.processing') : (isBackup ? t('backup.createBtn') : t('backup.restoreBtn'))}
            </button>
            <button type="button" className="backup-cancel-btn" onClick={resetForm} disabled={isLoading}>
              {t('accounts.cancel')}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Default: two backup buttons + restore
  return (
    <div className="backup-restore">
      <h2>{t('backup.title')}</h2>
      <div className="backup-restore-buttons">
        <button
          onClick={handleQuickBackup}
          disabled={isLoading}
          className="backup-button"
        >
          {isLoading && !mode ? t('backup.backupBtnLoading') : t('backup.backupBtn')}
        </button>
        <button
          onClick={handleSecureBackupClick}
          disabled={isLoading}
          className="backup-button secure"
        >
          {t('backup.secureBackupBtn')}
        </button>
        <button
          onClick={handleRestoreClick}
          disabled={isLoading}
          className="restore-button"
        >
          {isLoading && !mode ? t('backup.restoreBtnLoading') : t('backup.restoreBtn')}
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      {status && <div className="status-message">{status}</div>}

      {showConfirm && (
        <ConfirmDialog
          title={t('confirm.restore')}
          message={t('confirm.restoreMessage')}
          onConfirm={handleConfirmRestore}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

export default BackupRestore;
