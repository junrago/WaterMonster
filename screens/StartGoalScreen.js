import React, { useRef, useState, useContext } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions, TextInput } from 'react-native';
import colors from '../styles/colors';
import commonStyles from '../styles/common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WaterContext } from '../context/WaterContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const onboardingPages = [
  {
    key: '1',
    image: require('../assets/images/monster1.png'),
    title: 'ようこそ！',
    desc: '飲んだ水の量を記録して\nさまざまなウォーターモンスター\nを育てよう',
  },
  {
    key: '2',
    image: require('../assets/images/monsterstart.png'),
    title: 'モンスター進化',
    desc: '水を飲むほどモンスターが進化！\n楽しく健康習慣をサポート',
  },
  {
    key: '3',
    image: require('../assets/images/check.png'),
    title: '目標を決めよう',
    desc: 'まずは一日の目標を決めて\n今日から水分管理をはじめよう！',
  },
];

export default function StartGoalScreen({ navigation }) {
  const { setTodayGoal } = useContext(WaterContext);

  const [page, setPage] = useState(0);
  const flatListRef = useRef();
  const [goal, setGoal] = useState('');
  const [error, setError] = useState('');

  const handleScroll = e => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
    setPage(idx);
  };

  const handleGoalInput = (text) => {
    const num = text.replace(/[^0-9]/g, '');
    setGoal(num);
    setError('');
  };

  const isGoalValid = Number(goal) >= 1500 && Number(goal) <= 2500;

  const scrollToNext = async () => {
    if (page < onboardingPages.length - 1) {
      flatListRef.current.scrollToIndex({ index: page + 1 });
    } else {
      if (!isGoalValid) {
        setError('目標は1500〜2500mlの間で入力してください');
        return;
      }
      await AsyncStorage.setItem('goalSet', 'true');
      await AsyncStorage.setItem('todayGoal', goal);
      setTodayGoal(Number(goal));
      navigation.replace('Main');
    }
  };

  const scrollToPrev = () => {
    if (page > 0) {
      flatListRef.current.scrollToIndex({ index: page - 1 });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={onboardingPages}
        keyExtractor={item => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => (
          <View style={styles.page}>
            <View style={styles.card}>
              <Image source={item.image} style={styles.image} resizeMode="contain" />
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc}>{item.desc}</Text>
              {index === 2 && (
                <>
                  <View style={styles.inputRow}>
                    <TextInput
                      style={styles.input}
                      value={goal}
                      keyboardType="numeric"
                      maxLength={4}
                      onChangeText={handleGoalInput}
                      placeholder="例：2000"
                      placeholderTextColor="#B7C3D2"
                    />
                    <Text style={styles.inputLabel}>ml</Text>
                  </View>
                  {!isGoalValid && goal.length > 0 && (
                    <Text style={styles.error}>
                      健康のため、1日の目標は
                      <Text style={{ color: '#2089F9', fontWeight: 'bold' }}> 1500〜2500ml </Text>
                      の間で設定することをおすすめします。
                    </Text>
                  )}
                  {error ? <Text style={styles.error}>{error}</Text> : null}
                </>
              )}
            </View>
          </View>
        )}
      />
      <View style={styles.dots}>
        {onboardingPages.map((_, idx) => (
          <View key={idx} style={[styles.dot, page === idx && styles.dotActive]} />
        ))}
      </View>
      {page > 0 && (
        <TouchableOpacity style={styles.prevButton} onPress={scrollToPrev}>
          <Text style={commonStyles.buttonText}>もどる</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[
          styles.nextButton,
          (page === 2 && !isGoalValid) && { opacity: 0.5 }
        ]}
        onPress={scrollToNext}
        disabled={page === 2 && !isGoalValid}
      >
        <Text style={commonStyles.buttonText}>
          {page === onboardingPages.length - 1 ? 'はじめる' : 'つぎへ'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// サイズ計算
const CARD_W = screenWidth * 0.96;
const CARD_H = screenHeight * 0.75;
const IMG_W = CARD_W * 0.62;
const IMG_H = CARD_H * 0.42;
const DOT_SIZE = screenWidth * 0.032;
const BUTTON_W = screenWidth * 0.56;
const BUTTON_H = screenHeight * 0.066;
const BUTTON_RADIUS = BUTTON_H * 0.5;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  page: {
    width: screenWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: CARD_W,
    height: CARD_H,
    backgroundColor: colors.white,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0,
    paddingVertical: screenHeight * 0.15,
    paddingHorizontal: screenWidth * 0.06,
    shadowColor: '#2089F9',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 6,
  },
  image: {
    width: IMG_W,
    height: IMG_H,
    marginBottom: screenHeight * 0.001,
  },
  title: {
    ...commonStyles.boldText,
    color: colors.primary,
    fontSize: screenWidth * 0.074,
    marginBottom: screenHeight * 0.022,
    marginTop: screenHeight * 0.012,
  },
  desc: {
    ...commonStyles.text,
    fontSize: screenWidth * 0.048,
    textAlign: 'center',
    lineHeight: screenWidth * 0.069,
    color: '#333',
    marginHorizontal: screenWidth * 0.025,
    marginTop: 0,
    marginBottom: 0,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: screenHeight * 0.034,
    marginBottom: 0,
  },
  input: {
    width: CARD_W * 0.5,
    height: screenHeight * 0.063,
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 14,
    backgroundColor: '#F6F8FA',
    fontSize: screenWidth * 0.062,
    color: colors.text,
    textAlign: 'center',
    fontFamily: 'MPLUSRounded1c-Bold',
    letterSpacing: 1,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  inputLabel: {
    fontSize: screenWidth * 0.045,
    color: colors.primary,
    fontFamily: 'MPLUSRounded1c-Bold',
    marginLeft: 10, 
    marginTop: 2,   
  },
  error: {
    color: '#F47A7A',
    fontSize: screenWidth * 0.035,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  dots: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: screenHeight * 0.06, 
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.secondary,
    marginHorizontal: screenWidth * 0.017,
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
  nextButton: {
    position: 'absolute',
    bottom: screenHeight * 0.17,
    right: screenWidth * 0.07,
    backgroundColor: colors.primary,
    borderRadius: BUTTON_RADIUS,
    paddingVertical: BUTTON_H * 0.26,
    paddingHorizontal: BUTTON_W * 0.23,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevButton: {
    position: 'absolute',
    bottom: screenHeight * 0.17,
    left: screenWidth * 0.07,
    backgroundColor: colors.primary,
    borderRadius: BUTTON_RADIUS,
    paddingVertical: BUTTON_H * 0.26,
    paddingHorizontal: BUTTON_W * 0.23,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
