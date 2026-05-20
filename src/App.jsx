import React, { useState, useEffect } from 'react';
import LockScreen from './components/LockScreen';
import Dashboard from './components/Dashboard';
import { db } from './db/db';

function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState('');

  // Check if there's already a password set
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Try to check if a password is already set
        await db.settings.toArray();
        // If we get here without error, we're just checking status
        // We'll implement this properly in a real app
      } catch (error) {
        console.log("Error checking auth status:", error);
      }
    };

    checkAuthStatus();
  }, []);

  const handleUnlock = (userPassword) => {
    setIsLocked(false);
    setPassword(userPassword);
  };

  const handleLogout = () => {
    setIsLocked(true);
    setPassword('');
  };

  return (
    <div className="app">
      {isLocked ? (
        <LockScreen onUnlock={handleUnlock} />
      ) : (
        <Dashboard onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;