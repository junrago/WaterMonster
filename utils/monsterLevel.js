//monsterLevel.js
// シンプルな進化レベルロジック（初期レベルを1に変更）
export const getMonsterLevel = (totalDrank) => {
  // 各レベルで必要な累積量（Lv1開始点は0、以降は+500ずつ、その後+3000ずつ）
  const levelThresholds = [
    0,    // Lv1
    500,  // Lv2
    1500, // Lv3
    3000, // Lv4
    5000, // Lv5
    7500, // Lv6
    10500, // Lv7
  ];
  // 8レベル以降は+3000ずつ
  for (let lv = 7; lv <= 20; lv++) {
    levelThresholds[lv] = levelThresholds[lv - 1] + 3000;
  }
  for (let lv = levelThresholds.length - 1; lv >= 1; lv--) {
    if (totalDrank >= levelThresholds[lv]) {
      return Math.min(lv + 1, 20);
    }
  }
  return 1;
};



// より詳細な進化データを返すロジック（初期レベルを1に設定）
export function getMonsterEvolutionData(totalDrank) {
  // レベルアップの閾値リスト
  const thresholds = [
    500,   // 1→2
    1000,   // 2→3
    1500,   // 3→4
    2000,   // 4→5
    2500,   // 5→6
    3000,   // 6→7
    // 7→8以降は+3000
  ];
  for (let i = 6; i < 19; i++) thresholds[i] = 3000; // 7→8〜19→20

  let level = 1;
  let remaining = totalDrank;
  let maxVolume = thresholds[0];

  for (let i = 0; i < thresholds.length; i++) {
    if (remaining < thresholds[i]) {
      maxVolume = thresholds[i];
      break;
    }
    remaining -= thresholds[i];
    level++;
  }

  // 20レベルでカンスト
  if (level > 20) {
    level = 20;
    remaining = thresholds[thresholds.length - 1];
    maxVolume = thresholds[thresholds.length - 1];
  }

  return {
    level,
    progress: Math.min(remaining, maxVolume),
    maxVolume,
    remainingToNextEvolution: level === 20 ? 0 : maxVolume - remaining,
    progressRate: level === 20 ? 1 : remaining / maxVolume,
    isJustEvolved: remaining === 0 && level !== 1,
  };
}


