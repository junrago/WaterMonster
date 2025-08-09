import React, { createContext, useState, useContext } from 'react';

const ItemsContext = createContext();

export const ItemsProvider = ({ children }) => {
  const [bottleCount, setBottleCount] = useState(0);
  const [crystalCount, setCrystalCount] = useState(0);

  const addBottle = () => setBottleCount(prev => prev + 1);
  const addCrystal = () => setCrystalCount(prev => prev + 1);
  const removeBottle = () => setBottleCount(prev => Math.max(0, prev - 1));
  const removeCrystal = (count = 1) => setCrystalCount(prev => Math.max(0, prev - count));
  const addXCrystal = (count) => setCrystalCount(prev => prev + count);

  return (
    <ItemsContext.Provider value={{
      bottleCount,
      crystalCount,
      addBottle,
      addCrystal,
      removeBottle,
      removeCrystal,
      addXCrystal,
    }}>
      {children}
    </ItemsContext.Provider>
  );
};

// カスタムフック
export const useItems = () => useContext(ItemsContext);
