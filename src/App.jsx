import React, { useState } from 'react';
import LockScreen from './components/LockScreen';
import Dashboard from './components/Dashboard';
import { clearSessionKey } from './crypto/crypto';

function App() {
  const [isLocked, setIsLocked] = useState(true);

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
        <span>&copy; Katsukii Neko. All rights reserved.</span>
      </footer>
    </div>
  );
}

export default App;
