import React, { createContext, useContext, useState, useEffect } from 'react';

const SpinContext = createContext();

export const useSpin = () => {
  const context = useContext(SpinContext);
  if (!context) {
    throw new Error('useSpin must be used within a SpinProvider');
  }
  return context;
};

export const SpinProvider = ({ children }) => {
  const [showSpin, setShowSpin] = useState(false);

  useEffect(() => {
    const handleOpenSpin = () => {
      setShowSpin(true);
    };

    window.addEventListener('openSpin', handleOpenSpin);
    return () => window.removeEventListener('openSpin', handleOpenSpin);
  }, []);

  const openSpin = () => setShowSpin(true);
  const closeSpin = () => setShowSpin(false);

  return (
    <SpinContext.Provider value={{
      showSpin,
      openSpin,
      closeSpin
    }}>
      {children}
    </SpinContext.Provider>
  );
};

export default SpinContext;