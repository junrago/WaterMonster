import React, { createContext, useState, useCallback, useEffect } from 'react';

export const WaterContext = createContext();

export function WaterProvider({ children }) {
  // モンスターごとの累積飲水量
  const [monsterDrank, setMonsterDrank] = useState({
    monster1: 0,
    monster2: 0,
    monster3: 0,
    monster4: 0,
    monster5: 0,
    monster6: 0,
  });

  // ボトルの残量（グローバル管理）
  const [bottleAmount, setBottleAmount] = useState({
    1000: 1000,
    2000: 2000,
    500: 500,
    550: 550,
    600: 600,
  });

  // 前回の記録時点の残量
  const [prevBottleAmount, setPrevBottleAmount] = useState({
    1000: 1000,
    2000: 2000,
    500: 500,
    550: 550,
    600: 600,
  });

  // カスタムボトルサイズ配列
  const [customSizes, setCustomSizes] = useState([]);

  // 最後に選んだボトルサイズ
  const [lastBottleSize, setLastBottleSize] = useState(2000);

  // 飲水履歴
  const [history, setHistory] = useState([]);

  // 合計飲水量
  const [totalDrank, setTotalDrank] = useState(0);

  // 1日の目標（デフォルト2000）
  const [todayGoal, setTodayGoal] = useState(2000);

  // 合計飲水量を自動計算
  useEffect(() => {
    const total = history.reduce((sum, h) => sum + (h.amount || 0), 0);
    setTotalDrank(total);
  }, [history]);

  // 飲水履歴追加
  const addHistory = (amount, bottleSize) => {
    setHistory(prev => [
      ...prev,
      {
        date: new Date().toISOString(),
        amount,
        bottleSize,
      }
    ]);
  };

  // モンスターへの加算
  const addDrank = (amount, monsterId) => {
    setMonsterDrank(prev => ({
      ...prev,
      [monsterId]: (prev[monsterId] || 0) + amount,
    }));
  };

  // 現在のボトル残量
  const getCurrentAmount = useCallback(
    (bottleSize) => bottleAmount[bottleSize] ?? bottleSize,
    [bottleAmount]
  );

  // ボトル残量を変更
  const changeCurrentAmount = (bottleSize, value) => {
    setBottleAmount(prev => ({
      ...prev,
      [bottleSize]: value,
    }));
  };

  // ボトルを満タンにリセット
  const resetBottle = (bottleSize) => {
    setBottleAmount(prev => ({
      ...prev,
      [bottleSize]: bottleSize,
    }));
  };

  return (
    <WaterContext.Provider value={{
      monsterDrank,
      addDrank,
      bottleAmount,
      changeCurrentAmount,
      getCurrentAmount,
      resetBottle,
      prevBottleAmount,
      setPrevBottleAmount,
      customSizes,
      setCustomSizes,
      lastBottleSize,
      setLastBottleSize,
      history,
      setHistory,
      addHistory,
      totalDrank,
      todayGoal,
      setTodayGoal,
    }}>
      {children}
    </WaterContext.Provider>
  );
}
