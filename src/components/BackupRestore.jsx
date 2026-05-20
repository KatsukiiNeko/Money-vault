import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const BackupRestore = ({ onBackup, onRestore }) => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [status, setStatus] = useState('');
  const { t } = useLanguage();

  const handleBackup = async () => {
    setIsBackingUp(true);
    setStatus(t('backup.creating'));
    try {
      await onBackup();
      setStatus(t('backup.success'));
    } catch (error) {
      setStatus(t('backup.failedPrefix') + error.message);
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = async () => {
    if (!window.confirm(t('backup.confirmRestore'))) {
      return;
    }

    setIsRestoring(true);
    setStatus(t('backup.restoreStarted'));
    try {
      await onRestore();
      setStatus(t('backup.restoreSuccess'));
    } catch (error) {
      setStatus(t('backup.failedRestorePrefix') + error.message);
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="backup-restore">
      <h2>{t('backup.title')}</h2>
      <div className="backup-restore-buttons">
        <button
          onClick={handleBackup}
          disabled={isBackingUp}
          className="backup-button"
        >
          {isBackingUp ? t('backup.backupBtnLoading') : t('backup.backupBtn')}
        </button>
        <button
          onClick={handleRestore}
          disabled={isRestoring}
          className="restore-button"
        >
          {isRestoring ? t('backup.restoreBtnLoading') : t('backup.restoreBtn')}
        </button>
      </div>
      {status && <div className="status-message">{status}</div>}
    </div>
  );
};

export default BackupRestore;
