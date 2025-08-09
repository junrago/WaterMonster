import React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  ScrollView,
  Text,
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
} from 'react-native-reanimated';

import { useMonster } from '../context/MonsterContext';
import { WaterContext } from '../context/WaterContext';
import { getMonsterEvolutionData } from '../utils/monsterLevel';
import { monsterDisplayNames } from '../assets/monsterDisplayNames';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SNAP_CLOSED = SCREEN_HEIGHT * 0.49;
const SNAP_OPEN   = 150;

const AnimatedHandle = Animated.createAnimatedComponent(View);

export default function BottomSheet({ children }) {
  const translateY = useSharedValue(SNAP_CLOSED);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startY = translateY.value;
    },
    onActive: (e, ctx) => {
      translateY.value = Math.min(
        Math.max(ctx.startY + e.translationY, SNAP_OPEN),
        SNAP_CLOSED
      );
    },
    onEnd: (e) => {
      const mid = (SNAP_OPEN + SNAP_CLOSED) / 2;
      if (e.velocityY < -500 || translateY.value < mid) {
        translateY.value = withSpring(SNAP_OPEN, { damping: 50 });
      } else {
        translateY.value = withSpring(SNAP_CLOSED, { damping: 50 });
      }
    },
  });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const { currentMonsterId } = useMonster();
  const { monsterDrank } = React.useContext(WaterContext);
  const totalDrank = monsterDrank?.[currentMonsterId] || 0;
  const { level } = getMonsterEvolutionData(totalDrank);
  const monsterName = monsterDisplayNames[currentMonsterId] || currentMonsterId;

  return (
    <Animated.View style={[styles.sheet, sheetStyle]}>
      <PanGestureHandler
        hitSlop={{ top: 20, bottom: 20, left: 0, right: 0 }}
        onGestureEvent={gestureHandler}
      >
        <AnimatedHandle style={styles.handle} />
      </PanGestureHandler>

      {/* ★ モンスター名＋レベル表示部分 */}
      <View style={styles.monsterInfo}>
        <Text style={styles.monsterInfoText}>
          {monsterName} <Text style={styles.levelText}>Lv.{level}</Text>
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    top:    0,
    left:   0,
    right:  0,
    height: SCREEN_HEIGHT,
    backgroundColor:     '#f5f8ff',
    borderTopLeftRadius:  20,
    borderTopRightRadius: 20,
    shadowColor:   '#000',
    shadowOpacity: 0.1,
    shadowRadius:  10,
    elevation:     10,
  },
  handle: {
    width:           40,
    height:           5,
    borderRadius:     2.5,
    backgroundColor: '#ccc',
    alignSelf:        'center',
    marginVertical:   8,
  },
  
  monsterInfo: {
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 6,
  },
  monsterInfoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003569',
    letterSpacing: 1,
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003569',
    marginLeft: 6,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding:       16,
    paddingBottom: 700,
  },
});
