import React, { createContext, useContext, useState } from 'react';

const MonsterUnlockContext = createContext();

export const MonsterUnlockProvider = ({ children }) => {
  const [unlocked, setUnlocked] = useState({ monster1: true });

  const unlockMonster = (id) => {
    setUnlocked(prev => ({ ...prev, [id]: true }));
  };

  const isUnlocked = (id) => !!unlocked[id];

  return (
    <MonsterUnlockContext.Provider value={{ unlocked, unlockMonster, isUnlocked }}>
      {children}
    </MonsterUnlockContext.Provider>
  );
};

export const useMonsterUnlock = () => useContext(MonsterUnlockContext);
