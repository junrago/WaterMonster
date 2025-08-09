import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Modal,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ProgressBar from '../components/ProgressBar';
import { WaterContext } from '../context/WaterContext';
import { getMonsterEvolutionData } from '../utils/monsterLevel';
import commonStyles from '../styles/common';
import colors from '../styles/colors';
import BottomSheet from '../components/BottomSheet';
import StageItem from '../components/StageItem';
import { levelDescriptions } from '../assets/levelDescriptions';
import { getMonsterImageByLevel } from '../assets/evolutionImages';
import { monster1Images } from '../assets/monsters/monster1/images';
import { monster2Images } from '../assets/monsters/monster2/images';
import { monster3Images } from '../assets/monsters/monster3/images';
import { monster4Images } from '../assets/monsters/monster4/images';
import { monster5Images } from '../assets/monsters/monster5/images';
import { monster6Images } from '../assets/monsters/monster6/images';
import { useMonster } from '../context/MonsterContext';
import { useItems } from '../context/ItemsContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// モンスター画像サイズ
const monsterImageWidth = screenWidth * 1.0;
const monsterImageHeight = monsterImageWidth;
const clipHeight = monsterImageHeight * 0.855;
const cardMonsterWidth = screenWidth * 0.92;
const cardMonsterHeight = screenHeight * 0.26;

// アイテムバッジサイズ
const badgeIconSize = Math.round(screenWidth * 0.05);

function ItemBadgeBar({ onBottlePress }) {
  const { bottleCount, crystalCount } = useItems();
  return (
    <View style={badgeStyles.container}>
      <Pressable onPress={onBottlePress} style={badgeStyles.itemWrap}>
        <Image
          source={require('../assets/images/bottle_icon.png')}
          style={[badgeStyles.icon, { width: badgeIconSize, height: badgeIconSize }]}
        />
        <View style={badgeStyles.countBubble}>
          <Text style={badgeStyles.countText}>{bottleCount}</Text>
        </View>
      </Pressable>
      <View style={badgeStyles.itemWrap}>
        <Image
          source={require('../assets/images/crystal_icon.png')}
          style={[badgeStyles.icon, { width: badgeIconSize, height: badgeIconSize }]}
        />
        <View style={badgeStyles.countBubble}>
          <Text style={badgeStyles.countText}>{crystalCount}</Text>
        </View>
      </View>
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const { monsterDrank, addDrank } = useContext(WaterContext);
  const { currentMonsterId } = useMonster();
  const { bottleCount, removeBottle } = useItems();

  const [showBottleModal, setShowBottleModal] = useState(false);

  const totalDrank = monsterDrank[currentMonsterId] || 0;
  const {
    level,
    progress,
    remainingToNextEvolution,
    maxVolume,
  } = getMonsterEvolutionData(totalDrank);

  const isMaxLevel = level >= 20;

  const monsterImgObj = getMonsterImageByLevel(currentMonsterId, level);
  const monsterImageSource = monsterImgObj && monsterImgObj.on ? monsterImgObj.on : monsterImgObj;

  const monsterImagesMap = {
    monster1: monster1Images,
    monster2: monster2Images,
    monster3: monster3Images,
    monster4: monster4Images,
    monster5: monster5Images,
    monster6: monster6Images,
  };
  const currentMonsterImages = monsterImagesMap[currentMonsterId] || monster1Images;

  const stages = Object.entries(currentMonsterImages).map(
    ([lvlStr, { on, off }]) => {
      const lvl = Number(lvlStr);
      const maxLevel = Object.keys(currentMonsterImages).length;
      return {
        label:         `レベル${lvl}`,
        description:   levelDescriptions[lvl] || '',
        imageActive:   on,
        imageInactive: off,
        active:        lvl <= level,
        isCurrent:     lvl === level,
        isFirst:       lvl === 1,
        isLast:        lvl === maxLevel,
      };
    }
  );

  function handleBottleUse() {
    if (bottleCount > 0) {
      addDrank(1000, currentMonsterId);
      removeBottle();
      setShowBottleModal(false);
    }
  }

  return (
    <>
      <LinearGradient
        colors={colors.gradients.maingrad}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.background}
      >
        <View style={styles.overlay}>
          <ItemBadgeBar onBottlePress={() => setShowBottleModal(true)} />
          <View style={styles.container}>
            <View style={styles.cardMonster}>
              <View style={styles.monsterImageClip}>
                <Image
                  source={monsterImageSource}
                  style={styles.monsterImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.cardProgress}>
                <Text style={styles.progressText}>
                  {isMaxLevel
                    ? '最大レベル'
                    : `${progress}mL / ${maxVolume}mL`
                  }
                </Text>
                <ProgressBar
                  progress={isMaxLevel ? maxVolume : progress}
                  maxVolume={maxVolume}
                  isMaxLevel={isMaxLevel}
                />
              </View>
            </View>
            {!isMaxLevel && (
              <Text style={commonStyles.remainingText}>
                <Text style={commonStyles.highlightText}>レベルアップ</Text>
                <Text style={commonStyles.mlText}>まであと</Text>
                <Text style={commonStyles.highlightText}>
                  {remainingToNextEvolution}
                </Text>
                <Text style={commonStyles.mlText}>mL</Text>
              </Text>
            )}
          </View>
        </View>
      </LinearGradient>

      {/* モーダル（オーバーレイが画面全体＆中央配置） */}
      <Modal
        visible={showBottleModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBottleModal(false)}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.dialog}>
            <Text style={modalStyles.dialogText}>
              ボトルを使って1000mL分{'\n'}成長させますか？
            </Text>
            <View style={modalStyles.buttonRow}>
              <Pressable
                onPress={() => setShowBottleModal(false)}
                style={({ pressed }) => [
                  modalStyles.button,
                  { backgroundColor: pressed ? '#eee' : '#f7f7f7' },
                ]}
              >
                <Text style={modalStyles.cancelText}>いいえ</Text>
              </Pressable>
              <Pressable
                onPress={handleBottleUse}
                disabled={bottleCount === 0}
                style={({ pressed }) => [
                  modalStyles.button,
                  {
                    backgroundColor: pressed ? '#e3f1ff' : '#eef7ff',
                    opacity: bottleCount === 0 ? 0.5 : 1,
                  },
                ]}
              >
                <Text style={modalStyles.okText}>はい</Text>
              </Pressable>
            </View>
            {bottleCount === 0 && (
              <Text style={modalStyles.noBottleText}>ボトルがありません</Text>
            )}
          </View>
        </View>
      </Modal>

      {!showBottleModal && (
        <BottomSheet>
          {stages.map((props, idx) => (
            <StageItem key={idx} {...props} />
          ))}
        </BottomSheet>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: screenHeight * 0.123,
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
  cardProgress: {
    top: cardMonsterHeight * 0.85,
    backgroundColor: colors.background,
    borderRadius: 15,
    paddingVertical: 2,
    paddingHorizontal: 20,
    width: '90%',
    alignItems: 'center',
    position: 'absolute',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 15,
  },
  progressText: {
    marginTop: 3,
    fontSize: Math.round(screenWidth * 0.045),
    fontWeight: 'bold',
    color: '#003569',
    marginBottom: -5,
  },
  shadowWrap: {
    borderRadius: 30,
    shadowColor: '#000000ff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 20,
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

// アイテムバッジのstyle
const badgeStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: Math.round(screenWidth * 0.06),
    top: Math.round(screenHeight * 0.05),
    flexDirection: 'row',
    zIndex: 100,
    gap: Math.round(screenWidth * 0.02),
  },
  itemWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: Math.round(screenWidth * 0.015),
    paddingVertical: Math.round(screenWidth * 0.008),
    marginLeft: Math.round(screenWidth * 0.01),
    shadowColor: colors.primary,
    shadowOpacity: 0.12,
    shadowOffset: { width: 1, height: 1 },
    elevation: 4,
  },
  icon: {
    marginRight: Math.round(screenWidth * 0.007),
  },
  countBubble: {
    backgroundColor: colors.white,
    borderRadius: 8,
    minWidth: Math.round(screenWidth * 0.045),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Math.round(screenWidth * 0.012),
    marginLeft: 1,
  },
  countText: {
    color: '#069',
    fontWeight: 'bold',
    fontSize: Math.round(screenWidth * 0.035),
  },
});

// モーダル用スタイル
const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    width: screenWidth * 0.92,
    minHeight: screenHeight * 0.2,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: screenHeight * 0.04,
    paddingHorizontal: screenWidth * 0.05,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 10,
  },
  dialogText: {
    fontSize: screenWidth * 0.045,
    marginBottom: screenHeight * 0.015,
    textAlign: 'center',
    fontFamily: 'MPLUSRounded1c-Bold',
    color:colors.text,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: screenWidth * 0.06,
    marginTop: screenHeight * 0.01,
  },
  button: {
    minWidth: screenWidth * 0.22,
    minHeight: screenHeight * 0.052,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: screenHeight * 0.012,
    paddingHorizontal: screenWidth * 0.04,
    marginHorizontal: screenWidth * 0.01,
  },
  cancelText: {
    fontSize: screenWidth * 0.04,
    color: '#888',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  okText: {
    fontSize: screenWidth * 0.04,
    color: colors.primary,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  noBottleText: {
    color: colors.noBottleText,
    marginTop: screenHeight * 0.008,
    fontSize: screenWidth * 0.032,
    fontFamily: 'MPLUSRounded1c-Bold',
  },
});
