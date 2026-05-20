import React, { useState } from 'react';

const BackupRestore = ({ onBackup, onRestore }) => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [status, setStatus] = useState('');

  const handleBackup = async () => {
    setIsBackingUp(true);
    setStatus('Creating backup...');
    try {
      await onBackup();
      setStatus('Backup created successfully!');
    } catch (error) {
      setStatus('Backup failed: ' + error.message);
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = async () => {
    if (!window.confirm('Restoring will replace all current data. Continue?')) {
      return;
    }

    setIsRestoring(true);
    setStatus('Restore started...');
    try {
      await onRestore();
      setStatus('Restore completed successfully!');
    } catch (error) {
      setStatus('Restore failed: ' + error.message);
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="backup-restore">
      <h2>Backup & Restore</h2>
      <div className="backup-restore-buttons">
        <button
          onClick={handleBackup}
          disabled={isBackingUp}
          className="backup-button"
        >
          {isBackingUp ? 'Backing up...' : 'Backup Data'}
        </button>
        <button
          onClick={handleRestore}
          disabled={isRestoring}
          className="restore-button"
        >
          {isRestoring ? 'Restoring...' : 'Restore Data'}
        </button>
      </div>
      {status && <div className="status-message">{status}</div>}
    </div>
  );
};

export default BackupRestore;
