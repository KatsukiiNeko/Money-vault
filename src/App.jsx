import React, { useState } from 'react';
import LockScreen from './components/LockScreen';
import Dashboard from './components/Dashboard';
import { clearSessionKey } from './crypto/crypto';
import { useLanguage } from './context/LanguageContext';

function App() {
  const [isLocked, setIsLocked] = useState(true);
  const { t } = useLanguage();

  const handleUnlock = () => {
    setIsLocked(false);
  };

  const handleLogout = () => {
    clearSessionKey();
    setIsLocked(true);
  };

  return (
    <div className="app">
      {isLocked ? (
        <LockScreen onUnlock={handleUnlock} />
      ) : (
        <Dashboard onLogout={handleLogout} />
      )}
      <footer className="footer">
        <span>&copy; {t('app.copyright')}</span>
      </footer>
    </div>
  );
}

export default App;
