import React, { createContext, useContext, useState } from 'react';
const RewardContext = createContext();

export const RewardProvider = ({ children }) => {
  const [claimedLevels, setClaimedLevels] = useState({});

  const claimLevels = (monsterId, levels) => {
    setClaimedLevels(prev => ({
      ...prev,
      [monsterId]: [...new Set([...(prev[monsterId] || []), ...levels])]
    }));
  };

  return (
    <RewardContext.Provider value={{ claimedLevels, claimLevels }}>
      {children}
    </RewardContext.Provider>
  );
};

export const useReward = () => useContext(RewardContext);
