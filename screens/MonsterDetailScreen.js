import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProgressBar from '../components/ProgressBar';
import { WaterContext } from '../context/WaterContext';
import { getMonsterEvolutionData } from '../utils/monsterLevel';
import commonStyles from '../styles/common';
import colors from '../styles/colors';
import { levelDescriptions } from '../assets/levelDescriptions';
import { getMonsterImageByLevel } from '../assets/evolutionImages';
import { monsterDisplayNames } from '../assets/monsterDisplayNames';

import { monster1Images } from '../assets/monsters/monster1/images';
import { monster2Images } from '../assets/monsters/monster2/images';
import { monster3Images } from '../assets/monsters/monster3/images';
import { monster4Images } from '../assets/monsters/monster4/images';
import { monster5Images } from '../assets/monsters/monster5/images';
import { monster6Images } from '../assets/monsters/monster6/images';
import { useMonster } from '../context/MonsterContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// 画像カードサイズ
const cardMonsterWidth = screenWidth * 0.92;
const cardMonsterHeight = screenHeight * 0.26;
const monsterImageWidth = screenWidth * 1.0;
const monsterImageHeight = monsterImageWidth;
const clipHeight = monsterImageHeight * 0.855;

// 過去カードで表示する固定レベル
const SHOW_PAST_LEVELS = [1, 2, 4, 7, 15];

// 比率用（再利用しやすいようにまとめ）
const R = {
  backBtnPadV: screenHeight * 0.01,     // 1% 高さ
  backBtnPadH: screenWidth  * 0.03,     // 3% 幅
  backBtnTop:  screenHeight * 0.06,
  backBtnLeft: screenWidth  * 0.05,
  backBtnRadius: screenWidth * 0.05,
  backIconSize: Math.round(screenWidth * 0.055),
  backTextSize: Math.round(screenWidth * 0.04),
  backTextGap:  screenWidth * 0.01,

  containerTop: screenHeight * 0.12,
  containerPadH: screenWidth * 0.06,

  cardRadius: screenWidth * 0.05,
  cardPadTop: screenHeight * 0.0125,

  progressTop: cardMonsterHeight * 0.85,
  progressRadius: screenWidth * 0.04,
  progressPadV: screenHeight * 0.0025,
  progressPadH: screenWidth * 0.05,
  progressWidth: 0.9, // 親に対して%

  nameLevelMarginTop: screenHeight * 0.04,

  sectionMarginTop: screenHeight * 0.01,
  sectionMarginBottom: screenHeight * 0.01,
  sectionTitleSize: Math.round(screenWidth * 0.055),
  sectionSubSize:   Math.round(screenWidth * 0.036),

  emptyTextTop: screenHeight * 0.01,
  emptyTextSize: Math.round(screenWidth * 0.04),

  pastScrollPadV: screenHeight * 0.008,
  pastScrollPadH: screenWidth * 0.01,

  pastCardW: screenWidth * 0.34,
  pastCardH: screenHeight * 0.3,
  pastCardRadius: screenWidth * 0.04,
  pastCardMarginRight: screenWidth * 0.03,
  pastCardPadV: screenHeight * 0.012,
  pastCardPadH: screenWidth * 0.028,
  pastThumbH: screenHeight * 0.16,
  pastLevelSize: Math.round(screenWidth * 0.042),
  pastDescSize:  Math.round(screenWidth * 0.032),
};

export default function MonsterDetailScreen({ route, navigation }) {
  const { currentMonsterId } = useMonster();
  const monsterId = route?.params?.monsterId || currentMonsterId;

  const { monsterDrank } = useContext(WaterContext);
  const totalDrank = monsterDrank[monsterId] || 0;

  // 現在のレベル情報
  const { level, progress, remainingToNextEvolution, maxVolume } =
    getMonsterEvolutionData(totalDrank);
  const isMaxLevel = level >= 20;

  // 現在のモンスター画像
  const currentImgObj = getMonsterImageByLevel(monsterId, level);
  const currentMonsterImage =
    currentImgObj && currentImgObj.on ? currentImgObj.on : currentImgObj;

  // モンスター画像マップ
  const monsterImagesMap = {
    monster1: monster1Images,
    monster2: monster2Images,
    monster3: monster3Images,
    monster4: monster4Images,
    monster5: monster5Images,
    monster6: monster6Images,
  };
  const imagesForThisMonster = monsterImagesMap[monsterId] || monster1Images;

  // 過去の姿：固定レベルのうち、現在Lvより低く、画像があるものだけ
  const pastLevels = SHOW_PAST_LEVELS
    .filter((lv) => lv < level && imagesForThisMonster[lv])
    .sort((a, b) => a - b);

  return (
    <LinearGradient
      colors={colors.gradients.maingrad}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        {/* 戻るボタン（アイコン＋テキスト） */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={R.backIconSize} color={colors.white} />
          <Text style={styles.backButtonText}>戻る</Text>
        </TouchableOpacity>

        <View style={styles.container}>
          {/* 現在の姿カード */}
          <View style={styles.cardMonster}>
            <View style={styles.monsterImageClip}>
              <Image
                source={currentMonsterImage}
                style={styles.monsterImage}
                resizeMode="contain"
              />
            </View>

            <View style={styles.cardProgress}>
              <Text style={styles.progressText}>
                {isMaxLevel ? '最大レベル' : `${progress}mL / ${maxVolume}mL`}
              </Text>
              <ProgressBar
                progress={isMaxLevel ? maxVolume : progress}
                maxVolume={maxVolume}
                isMaxLevel={isMaxLevel}
              />
            </View>
          </View>

          {/* 名前 & レベル（「レベルアップまであと」の上） */}
          <Text style={styles.nameLevelText}>
            {monsterDisplayNames[monsterId] || 'モンスター'} Lv.{level}
          </Text>

          {/* 残り */}
          {!isMaxLevel && (
            <Text style={commonStyles.remainingTextb}>
              <Text style={commonStyles.highlightText}>レベルアップ</Text>
              <Text style={commonStyles.mlText}>まであと</Text>
              <Text style={commonStyles.highlightText}>
                {remainingToNextEvolution}
              </Text>
              <Text style={commonStyles.mlText}>mL</Text>
            </Text>
          )}

          {/* 過去の姿（表示文言は 1 〜 現在-1 のまま） */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>過去の姿</Text>
            <Text style={styles.sectionSub}>
              レベル1 〜 レベル{Math.max(level - 1, 1)}
            </Text>
          </View>

          {pastLevels.length === 0 ? (
            <Text style={styles.emptyText}>過去の姿はまだありません</Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pastScroll}
            >
              {pastLevels.map((lv) => {
                const imgObj = getMonsterImageByLevel(monsterId, lv);
                const img = imgObj && imgObj.on ? imgObj.on : imgObj;

                return (
                  <View key={lv} style={styles.pastCard}>
                    <View style={styles.pastThumbWrap}>
                      <Image
                        source={img}
                        style={styles.pastThumb}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={styles.pastLevelText}>Lv.{lv}</Text>
                    {!!levelDescriptions[lv] && (
                      <Text style={styles.pastDesc} numberOfLines={2}>
                        {levelDescriptions[lv]}
                      </Text>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  overlay: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.2)' },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: R.backBtnPadV,
    paddingHorizontal: R.backBtnPadH,
    position: 'absolute',
    top: R.backBtnTop,
    left: R.backBtnLeft,
    zIndex: 100,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: R.backBtnRadius,
  },
  backButtonText: {
    fontSize: R.backTextSize,
    color: colors.white,
    marginLeft: R.backTextGap,
    fontFamily: 'MPLUSRounded1c-Bold',
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: R.containerTop,
    paddingHorizontal: R.containerPadH,
  },

  cardMonster: {
    backgroundColor: '#fff',
    borderRadius: R.cardRadius,
    width: cardMonsterWidth,
    height: cardMonsterHeight,
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
    paddingTop: R.cardPadTop,
  },
  monsterImageClip: {
    width: monsterImageWidth,
    height: clipHeight,
    overflow: 'hidden',
    position: 'absolute',
    top: -monsterImageWidth * 0.22,
    zIndex: 5,
    alignSelf: 'center',
  },
  monsterImage: { width: monsterImageWidth, height: monsterImageHeight },

  cardProgress: {
    top: R.progressTop,
    backgroundColor: colors.background,
    borderRadius: R.progressRadius,
    paddingVertical: R.progressPadV,
    paddingHorizontal: R.progressPadH,
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
    marginTop: screenHeight * 0.003, // 比率に変更
    fontSize: Math.round(screenWidth * 0.045),
    fontWeight: 'bold',
    color: '#003569',
    marginBottom: -screenHeight * 0.006, // 比率に変更
  },

  nameLevelText: {
    fontSize: Math.round(screenWidth * 0.06),
    fontWeight: 'bold',
    color: colors.white,
    marginTop: R.nameLevelMarginTop,
    marginBottom: 0,
  },

  sectionHeader: {
    width: '100%',
    marginTop: R.sectionMarginTop,
    marginBottom: R.sectionMarginBottom,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: R.sectionTitleSize,
    color: colors.text,
    fontFamily: 'MPLUSRounded1c-Bold',
  },
  sectionSub: {
    fontSize: R.sectionSubSize,
    color: '#3b6ea8',
    fontFamily: 'MPLUSRounded1c-Bold',
  },

  emptyText: {
    marginTop: R.emptyTextTop,
    color: '#5c6b7a',
    fontSize: R.emptyTextSize,
    fontFamily: 'MPLUSRounded1c-Bold',
  },

  pastScroll: {
    paddingVertical: R.pastScrollPadV,
    paddingHorizontal: R.pastScrollPadH,
  },
  pastCard: {
    width: R.pastCardW,
    height: R.pastCardH,
    borderRadius: R.pastCardRadius,
    backgroundColor: '#fff',
    marginRight: R.pastCardMarginRight,
    paddingVertical: R.pastCardPadV,
    paddingHorizontal: R.pastCardPadH,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  pastThumbWrap: {
    width: '100%',
    height: R.pastThumbH,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pastThumb: { width: '160%', height: '160%' },
  pastLevelText: {
    marginTop: screenHeight * 0.007,
    fontSize: R.pastLevelSize,
    color: colors.primary,
    fontFamily: 'MPLUSRounded1c-Bold',
    textAlign: 'center',
  },
  pastDesc: {
    marginTop: screenHeight * 0.003,
    fontSize: R.pastDescSize,
    color: colors.text,
    textAlign: 'center',
    lineHeight: Math.round(screenWidth * 0.044),
    fontFamily: 'MPLUSRounded1c-Bold',
  },
});
