import React, { createContext, useState, useContext } from 'react';

const MonsterContext = createContext();

export const MonsterProvider = ({ children }) => {
  const [currentMonsterId, setCurrentMonsterId] = useState('monster1');

  return (
    <MonsterContext.Provider value={{ currentMonsterId, setCurrentMonsterId }}>
      {children}
    </MonsterContext.Provider>
  );
};

export const useMonster = () => useContext(MonsterContext);
