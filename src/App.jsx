import { useState, useEffect, useRef, useCallback } from 'react';
import AccountSelector from './components/AccountSelector';
import LockScreen from './components/LockScreen';
import Dashboard from './components/Dashboard';
import { clearSessionKey } from './crypto/crypto';
import { useLanguage } from './context/LanguageContext';

const SESSION_TIMEOUT = 15 * 60 * 1000;

function App() {
  const [accountId, setAccountId] = useState(null);
  const [isLocked, setIsLocked] = useState(true);
  const { t } = useLanguage();
  const timeoutRef = useRef(null);

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (!isLocked && accountId) {
      timeoutRef.current = setTimeout(() => {
        clearSessionKey();
        setIsLocked(true);
      }, SESSION_TIMEOUT);
    }
  }, [isLocked, accountId]);

  useEffect(() => {
    if (isLocked) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    const events = ['mousemove', 'keydown', 'touchstart', 'click'];
    events.forEach((event) => window.addEventListener(event, resetTimeout));
    resetTimeout();

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimeout));
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isLocked, resetTimeout]);

  const handleAccountSelected = (id) => {
    setAccountId(id);
    setIsLocked(true);
  };

  const handleUnlock = () => {
    setIsLocked(false);
  };

  const handleLogout = () => {
    clearSessionKey();
    setIsLocked(true);
  };

  const handleSwitchAccount = () => {
    clearSessionKey();
    setAccountId(null);
    setIsLocked(true);
  };

  if (!accountId) {
    return (
      <div className="app">
        <AccountSelector onAccountSelected={handleAccountSelected} />
        <footer className="footer">
          <span>&copy; {t('app.copyright')}</span>
        </footer>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="app">
        <LockScreen accountId={accountId} onUnlock={handleUnlock} onBack={handleSwitchAccount} />
        <footer className="footer">
          <span>&copy; {t('app.copyright')}</span>
        </footer>
      </div>
    );
  }

  return (
    <div className="app">
      <Dashboard onLogout={handleLogout} onSwitchAccount={handleSwitchAccount} />
      <footer className="footer">
        <span>&copy; {t('app.copyright')}</span>
      </footer>
    </div>
  );
}

export default App;
