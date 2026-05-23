import { useRef, useEffect } from 'react';
import PasswordManager from './PasswordManager';
import BackupRestore from './BackupRestore';
import CurrencyToggle from './CurrencyToggle';
import { useLanguage } from '../context/LanguageContext';

const SettingsPanel = ({ isOpen, onClose, onBackup, onSecureBackup, onRestore, onSecureRestore }) => {
  const { t } = useLanguage();
  const panelRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" ref={panelRef} onClick={(e) => e.stopPropagation()}>
        <div className="settings-panel-header">
          <h2>{t('settings.title')}</h2>
          <button className="settings-close-btn" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">{t('settings.appearance')}</div>
          <div className="settings-toggle-row">
            <span className="settings-toggle-label">{t('settings.currency')}</span>
            <CurrencyToggle />
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">{t('settings.security')}</div>
          <div className="settings-item">
            <PasswordManager />
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">{t('settings.data')}</div>
          <div className="settings-item">
            <BackupRestore
              onBackup={onBackup}
              onSecureBackup={onSecureBackup}
              onRestore={onRestore}
              onSecureRestore={onSecureRestore}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
