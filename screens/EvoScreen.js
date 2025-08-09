import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import commonStyles from '../styles/common';
import colors from '../styles/colors';

import { useMonster } from '../context/MonsterContext';
import { useItems } from '../context/ItemsContext';
import { useReward } from '../context/RewardContext';
import { getMonsterImageByLevel } from '../assets/evolutionImages';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// --- ここを追加！ ---
const monsterImageWidth = screenWidth * 1.0;
const monsterImageHeight = monsterImageWidth;
const clipHeight = monsterImageHeight * 0.855;
const cardMonsterWidth = screenWidth * 0.92;
const cardMonsterHeight = screenHeight * 0.26;
// ------------------

// 報酬レベル設定
const EVOLUTION_LEVELS = [2, 4, 7, 15];
const CRYSTAL_LEVELS = [3, 6, 10, 14, 20];
const BOTTLE_LEVELS = [5, 8, 9, 11, 12, 13, 16, 17, 18, 19];

export default function EvoScreen({ route, navigation }) {
  const { level } = route.params || { level: 1 };
  const { currentMonsterId } = useMonster();
  const { addBottle, addCrystal } = useItems();
  const { claimedLevels, claimLevels } = useReward();

  // 現在のモンスター画像（HomeScreenと同じロジック）
  const monsterImgObj = getMonsterImageByLevel(currentMonsterId, level);
  const monsterImageSource = monsterImgObj && monsterImgObj.on ? monsterImgObj.on : monsterImgObj;

  // 報酬判定
  const claimed = claimedLevels[currentMonsterId] || [];
  const toClaim = [];
  for(let lv=1; lv<=level; lv++){
    if(!claimed.includes(lv)){
      toClaim.push(lv);
    }
  }
  // 報酬内容
  const rewardSummary = { bottle: 0, crystal: 0, evolution: false };
  toClaim.forEach(lv=>{
    if (EVOLUTION_LEVELS.includes(lv)) rewardSummary.evolution = true;
    else if (CRYSTAL_LEVELS.includes(lv)) rewardSummary.crystal++;
    else if (BOTTLE_LEVELS.includes(lv)) rewardSummary.bottle++;
  });

  // 表示テキスト
  let titleText = '';
  if(rewardSummary.evolution){
    titleText = "モンスターが進化した！";
  } else if(rewardSummary.crystal){
    titleText = `レベルアップ！\nすいしょう ×${rewardSummary.crystal} を入手`;
  } else if(rewardSummary.bottle){
    titleText = `レベルアップ！\nボトル ×${rewardSummary.bottle} を入手`;
  }

  // 報酬ボタン
  const handleReward = () => {
    toClaim.forEach(lv=>{
      if (EVOLUTION_LEVELS.includes(lv)) {
        // 進化
      }
      else if (CRYSTAL_LEVELS.includes(lv)) {
        addCrystal();
      }
      else if (BOTTLE_LEVELS.includes(lv)) {
        addBottle();
      }
    });
    claimLevels(currentMonsterId, toClaim);
    navigation.navigate('Main', { screen: 'Home' });
  };

  return (
    <View style={styles.bg}>
      {/* タイトル */}
      <Text style={[commonStyles.text, styles.title]}>
        {titleText}
      </Text>

      {/* --- モンスター画像部分 --- */}
      <View style={styles.cardMonster}>
        <View style={styles.monsterImageClip}>
          <Image
            source={monsterImageSource}
            style={styles.monsterImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* 報酬アイコン */}
      <View style={styles.rewardIconRow}>
        {rewardSummary.crystal > 0 && (
          <>
            <Image source={require('../assets/images/crystal_icon.png')} style={styles.rewardIcon} />
            <Text style={styles.rewardNum}>×{rewardSummary.crystal}</Text>
          </>
        )}
        {rewardSummary.bottle > 0 && (
          <>
            <Image source={require('../assets/images/bottle_icon.png')} style={styles.rewardIcon} />
            <Text style={styles.rewardNum}>×{rewardSummary.bottle}</Text>
          </>
        )}
      </View>

      {/* ボタン */}
      <Pressable
        onPress={handleReward}
        style={({ pressed }) => [
          styles.shadowWrap,
          pressed && { opacity: 0.85 },
        ]}
      >
        <LinearGradient
          colors={['#0088FF', '#6BA1FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradientButton}
        >
          <Text style={commonStyles.buttonText}>ホームにもどる</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: screenWidth * 0.06,
    paddingTop: screenHeight * 0.05,
  },
  title: {
    textAlign: 'center',
    fontSize: screenWidth * 0.055,
    marginTop: screenHeight * 0.05,
    marginBottom:0,
  },
  cardMonster: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: cardMonsterWidth,
    height: cardMonsterHeight,
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
    paddingTop: 10,
    marginBottom: screenHeight * 0.03,
    marginTop: screenHeight * 0.15,
  },
  monsterImageClip: {
    width: monsterImageWidth,
    height: clipHeight,
    overflow: 'hidden',
    position: 'absolute',
    top: -monsterImageWidth * 0.275,
    zIndex: 5,
    alignSelf: 'center',
  },
  monsterImage: {
    width: monsterImageWidth,
    height: monsterImageHeight,
  },
  rewardIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: screenHeight * 0.035,
    minHeight: 48,
  },
  rewardIcon: {
    width: 44,
    height: 44,
    marginHorizontal: 6,
  },
  rewardNum: {
    fontSize: 26,
    color: colors.primary,
    fontWeight: 'bold',
    marginRight: 14,
  },
  shadowWrap: {
    borderRadius: 30,
    shadowColor: '#000000ff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 16,
  },
  gradientButton: {
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
});

