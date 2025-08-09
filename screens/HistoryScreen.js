import React, { useContext } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { WaterContext } from '../context/WaterContext';
import { useMonsterUnlock } from '../context/MonsterUnlockContext';
import colors from '../styles/colors';
import commonStyles from '../styles/common';
import WaveBackground from '../components/WaveBackground';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function HomeDashboard() {
  const { history, totalDrank, todayGoal } = useContext(WaterContext);
  const { unlocked } = useMonsterUnlock();

  // 記録回数
  const recordCount = history.length;

  // 今日の摂取量と目標
  const todayAmount = history.reduce((sum, h) => sum + h.amount, 0);
  const goal = todayGoal || 2000;
  const todayPercent = Math.min(100, Math.floor((todayAmount / goal) * 100)); // ←ここで100%超え防止

  // アンロックしたモンスター数
  const unlockedCount = Object.values(unlocked).filter(Boolean).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topSpace} />
      <View style={styles.row}>
        <View style={styles.longCardWrapper}>
          <View style={[styles.card, styles.longCard]}>
            {/* 波アニメ背景 */}
            <WaveBackground
              width={SCREEN_WIDTH * 0.92}
              height={SCREEN_HEIGHT * 0.08}
              color1={colors.gradients.maingrad[0]}
              color2={colors.gradients.maingrad[1]}
            />
            <View style={{ position: 'relative', zIndex: 2, width: '100%', alignItems: 'center' }}>
              <Text style={styles.title}>今まで飲んだ水の量</Text>
              <Text style={styles.totalDrankText}>{totalDrank} mL</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.centerArea}>
        <View style={styles.gridRow}>
          <View style={[styles.card, styles.squareCard, styles.highlightCard, { marginRight: CARD_MARGIN }]}>
            <Text style={styles.subb}>今日の目標{'\n'}{todayAmount}mL/{goal}mL</Text>
            <Text style={styles.percent}>{todayPercent}%</Text>
          </View>
          <View style={[styles.card, styles.squareCard, { marginRight: 0 }]}>
            <Text style={styles.sub}>記録した回数</Text>
            <Text style={styles.bigNum}>{recordCount}回</Text>
          </View>
        </View>
        <View style={styles.gridRow}>
          <View style={[styles.card, styles.squareCard, { marginRight: CARD_MARGIN }]}>
            <Text style={styles.sub}>アンロックした{'\n'}モンスターの数</Text>
            <Text style={styles.bigNum}>{unlockedCount}匹</Text>
          </View>
          <View style={[styles.card, styles.squareCard, { marginRight: 0 }]} />
        </View>
      </View>
      {/* 
      <TouchableOpacity style={styles.googleBtn}>
        <Text style={styles.googleText}>Googleアカウントでログイン</Text>
      </TouchableOpacity>
      */}
    </View>
  );
}

const CARD_MARGIN = SCREEN_WIDTH * 0.04;
const ROW_MARGIN = SCREEN_HEIGHT * 0.018;
const CENTER_AREA_HEIGHT = SCREEN_HEIGHT * 0.27;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  topSpace: {
    height: SCREEN_HEIGHT * 0.1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: SCREEN_WIDTH * 0.92,
    marginBottom: ROW_MARGIN,
  },
  longCardWrapper: {
    width: SCREEN_WIDTH * 0.92,
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: SCREEN_WIDTH * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.highlight,
    shadowOpacity: 0.09,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  longCard: {
    height: SCREEN_HEIGHT * 0.13,
    marginBottom: ROW_MARGIN,
    paddingVertical: SCREEN_WIDTH * 0.025,
    justifyContent: 'center',
    alignItems: 'center',
  },
  squareCard: {
    flex: 1,
    height: SCREEN_HEIGHT * 0.13,
    marginBottom: 0,
    padding: SCREEN_WIDTH * 0.02,
  },
  highlightCard: {
    backgroundColor: colors.highlight,
  },
  title: {
    ...commonStyles.boldText,
    fontSize: SCREEN_WIDTH * 0.048,
    textAlign: 'center',
  },
  totalDrankText: {
    ...commonStyles.textw,
    marginTop: 8,
    color: colors.white,
    fontSize: SCREEN_WIDTH * 0.055,
    textAlign: 'center',
  },
  sub: {
    ...commonStyles.text,
    fontSize: SCREEN_WIDTH * 0.037,
    marginBottom: 2,
    textAlign: 'center',
  },
  subb: {
    ...commonStyles.textw,
    fontSize: SCREEN_WIDTH * 0.037,
    marginBottom: 2,
    textAlign: 'center',
  },
  percent: {
    fontSize: SCREEN_WIDTH * 0.10,
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bigNum: {
    fontSize: SCREEN_WIDTH * 0.088,
    color: colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  centerArea: {
    height: CENTER_AREA_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  gridRow: {
    flexDirection: 'row',
    width: SCREEN_WIDTH * 0.92,
    justifyContent: 'center',
    marginBottom: ROW_MARGIN,
  },
  googleBtn: {
    marginTop: SCREEN_HEIGHT * 0.035,
    width: SCREEN_WIDTH * 0.92,
    borderRadius: SCREEN_WIDTH * 0.04,
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingVertical: SCREEN_HEIGHT * 0.02,
    shadowColor: colors.white,
    shadowOpacity: 0.06,
    elevation: 1,
  },
  googleText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: SCREEN_WIDTH * 0.045,
  },
});
