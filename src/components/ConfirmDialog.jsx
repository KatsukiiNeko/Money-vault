import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const ConfirmDialog = ({ title, message, confirmLabel, cancelLabel, onConfirm, onCancel }) => {
  const { t } = useLanguage();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onCancel]);

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-dialog-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirm-dialog-actions">
          <button className="confirm-cancel" onClick={onCancel}>
            {cancelLabel || t('accounts.cancel')}
          </button>
          <button className="confirm-ok" onClick={onConfirm}>
            {confirmLabel || t('confirm.continue')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
