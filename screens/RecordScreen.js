import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import BottleBarSvg from '../components/BottleBarSvg';
import BottleBar1000Svg from '../components/BottleBar1000Svg';
import BottleBar500Svg from '../components/BottleBar500Svg';
import BottleBar550Svg from '../components/BottleBar550Svg';
import BottleBar600Svg from '../components/BottleBar600Svg';
import BottleBarCSvg from '../components/BottleBarCSvg';
import { WaterContext } from '../context/WaterContext';
import commonStyles from '../styles/common';
import { getMonsterEvolutionData } from '../utils/monsterLevel';
import { useMonster } from '../context/MonsterContext';
import colors from '../styles/colors';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const RecordScreen = ({ navigation }) => {
  const {
    monsterDrank,
    addDrank,
    getCurrentAmount,
    changeCurrentAmount,
    prevBottleAmount,
    setPrevBottleAmount,
    bottleAmount,
    customSizes,
    setCustomSizes,
    lastBottleSize,
    setLastBottleSize,
    addHistory, 
  } = useContext(WaterContext);

  const { currentMonsterId } = useMonster();

  const [customInput, setCustomInput] = useState('');
  const [customError, setCustomError] = useState('');

  const [scrollX, setScrollX] = useState(0);
  const [contentWidth, setContentWidth] = useState(1);
  const [containerWidth, setContainerWidth] = useState(1);

  // 初期値をlastBottleSizeに
  const [bottleSize, setBottleSize] = useState(lastBottleSize || 2000);
  const [currentAmount, setCurrentAmount] = useState(() => getCurrentAmount(lastBottleSize || 2000));

  // lastBottleSizeが変更された時にstateも変更
  useEffect(() => {
    setBottleSize(lastBottleSize || 2000);
    setCurrentAmount(getCurrentAmount(lastBottleSize || 2000));
    // eslint-disable-next-line
  }, [lastBottleSize]);

  useEffect(() => {
    setCurrentAmount(getCurrentAmount(bottleSize));
    // eslint-disable-next-line
  }, [bottleSize]);

  const handleSliderChange = (value) => {
    setCurrentAmount(value);
    changeCurrentAmount(bottleSize, value);
  };

  const prevAmount = prevBottleAmount[bottleSize] ?? bottleSize;
  const drankAmount = Math.max(0, prevAmount - currentAmount);

  const totalDrank = monsterDrank[currentMonsterId] || 0;
  const willTotalDrank = totalDrank + drankAmount;

  const currentEvo = getMonsterEvolutionData(totalDrank);
  const nextEvo = getMonsterEvolutionData(willTotalDrank);
  const shouldEvolve = nextEvo.level > currentEvo.level;

  const handleRecord = () => {
    if (drankAmount > 0) {
      addDrank(drankAmount, currentMonsterId);
      addHistory(drankAmount, bottleSize);
    }
    setPrevBottleAmount(prev => ({
      ...prev,
      [bottleSize]: currentAmount,
    }));

    if (currentAmount === 0) {
      setCurrentAmount(bottleSize);
      changeCurrentAmount(bottleSize, bottleSize);
      setPrevBottleAmount(prev => ({
        ...prev,
        [bottleSize]: bottleSize,
      }));
    }

    if (shouldEvolve) {
      navigation.replace('Evo', { level: nextEvo.level });
    } else {
      navigation.navigate('Home');
    }
  };


  const handleBottleChange = (value) => {
    if (bottleAmount[value] === undefined) {
      changeCurrentAmount(value, value);
      setPrevBottleAmount(prev => ({
        ...prev,
        [value]: value,
      }));
    }
    setBottleSize(value);
    setLastBottleSize(value);
    setCurrentAmount(getCurrentAmount(value));
  };

  const handleCustomSize = () => {
    const value = Number(customInput);
    if (isNaN(value) || value < 100 || value > 3000 || value % 10 !== 0) {
      setCustomError('100〜3000の数字(10の倍数)で入力してください');
      return;
    }
    if (!customSizes.includes(value)) {
      setCustomSizes(prev => [...prev, value]);
    }
    setBottleSize(value);
    setLastBottleSize(value); 
    setCustomInput('');
    setCustomError('');
  };

  const handleRemoveCustomSize = (value) => {
    setCustomSizes(prev => prev.filter(v => v !== value));
    if (bottleSize === value) {
      setBottleSize(2000);
      setLastBottleSize(2000); 
    }
  };

  const handleResetBottle = () => {
    setCurrentAmount(bottleSize);
    changeCurrentAmount(bottleSize, bottleSize);
    setPrevBottleAmount(prev => ({
      ...prev,
      [bottleSize]: bottleSize,
    }));
  };

  const baseOptions = [
    { label: '500ml', value: 500 },
    { label: '550ml', value: 550 },
    { label: '600ml', value: 600 },
    { label: '1000ml', value: 1000 },
    { label: '2000ml', value: 2000 },
  ];
  const options = [
    ...baseOptions,
    ...customSizes.map(v => ({ label: `${v}ml`, value: v })),
  ];

  const barBaseWidth = screenWidth * 0.9;
  const barWidth = Math.max(100, (containerWidth / contentWidth) * barBaseWidth) - (screenWidth * 0.18);
  const barLeft = (scrollX / (contentWidth - containerWidth)) * (barBaseWidth - barWidth) || 0;

  // SVG切り替え
  let BottleSvg;
  if (bottleSize === 1000) {
    BottleSvg = <BottleBar1000Svg fillRatio={currentAmount / 1000} />;
  } else if (bottleSize === 500) {
    BottleSvg = <BottleBar500Svg fillRatio={currentAmount / 500} />;
  } else if (bottleSize === 550) {
    BottleSvg = <BottleBar550Svg fillRatio={currentAmount / 550} />;
  } else if (bottleSize === 600) {
    BottleSvg = <BottleBar600Svg fillRatio={currentAmount / 600} />;
  } else if (customSizes.includes(bottleSize)) {
    BottleSvg = <BottleBarCSvg fillRatio={currentAmount / bottleSize} maxVolume={bottleSize} />;
  } else {
    BottleSvg = <BottleBarSvg fillRatio={currentAmount / 2000} />;
  }

  return (
    <View style={styles.container}>
      {/* 🟦 画面一番上に選択中のボトルを表示 */}
      <Text
        style={{
          fontSize: screenWidth * 0.05,
          color: colors.primary,
          marginTop: screenHeight * 0.01,
          marginBottom: screenHeight * 0.015,
          alignSelf: 'center',
          textAlign: 'center',
          width: screenWidth * 0.7,
          fontFamily: 'MPLUSRounded1c-Bold',
        }}
      >
        選択中のボトル：{bottleSize}ml
      </Text>

      {/* 容量切り替えUI（横スクロール＋下部バー） */}
      <View style={{ width: '100%', alignItems: 'center', position: 'relative', marginBottom: screenHeight * 0.025 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ maxHeight: screenHeight * 0.058, width: screenWidth * 0.9 }}
          contentContainerStyle={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: screenWidth * 0.03,
          }}
          onScroll={e => setScrollX(e.nativeEvent.contentOffset.x)}
          scrollEventThrottle={16}
          onContentSizeChange={w => setContentWidth(w)}
          onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}
        >
          {/* 既存ボトル */}
          {baseOptions.map(opt => (
            <Pressable
              key={opt.value}
              onPress={() => handleBottleChange(opt.value)}
              style={{
                backgroundColor: bottleSize === opt.value ? colors.primary : '#fff',
                borderRadius: 16,
                paddingHorizontal: screenWidth * 0.045,
                paddingVertical: screenHeight * 0.01,
                marginHorizontal: screenWidth * 0.012,
                borderWidth: 1,
                borderColor: colors.primary,
              }}>
              <Text style={{
                color: bottleSize === opt.value ? '#fff' : colors.primary,
                fontWeight: 'bold',
                fontSize: screenWidth * 0.04,
              }}>{opt.label}</Text>
            </Pressable>
          ))}
          {/* カスタムサイズは削除ボタン付き */}
          {customSizes.map(v => (
            <View
              key={v}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: bottleSize === v ? colors.primary : '#fff',
                borderRadius: 16,
                paddingHorizontal: screenWidth * 0.03,
                paddingVertical: screenHeight * 0.01,
                marginHorizontal: screenWidth * 0.012,
                borderWidth: 1,
                borderColor: colors.primary,
              }}>
              <Pressable onPress={() => handleBottleChange(v)}>
                <Text style={{
                  color: bottleSize === v ? '#fff' : colors.primary,
                  fontWeight: 'bold',
                  fontSize: screenWidth * 0.04,
                }}>{v}ml</Text>
              </Pressable>
              <Pressable onPress={() => handleRemoveCustomSize(v)} style={{ marginLeft: screenWidth * 0.015, padding: 2 }}>
                <Text style={{
                  color: bottleSize === v ? '#fff' : colors.primary,
                  fontWeight: 'bold',
                  fontSize: screenWidth * 0.045,
                }}>×</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
        {/* 下のインジケータ：中央寄せ修正版 */}
        <View style={{
          width: barBaseWidth,
          height: screenHeight * 0.006,
          backgroundColor: '#d0d0d0',
          borderRadius: screenHeight * 0.003,
          opacity: 0.3,
          marginTop: 6,
          overflow: 'hidden',
        }}>
          <Animated.View style={{
            position: 'absolute',
            left: barLeft,
            width: barWidth,
            height: screenHeight * 0.006,
            backgroundColor: '#568dff',
            borderRadius: screenHeight * 0.003,
            opacity: 0.7,
          }} />
        </View>
      </View>
      {/* カスタムサイズ入力 */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: screenHeight * 0.01 }}>
        <TextInput
          placeholder="例:350"
          value={customInput}
          onChangeText={setCustomInput}
          keyboardType="numeric"
          style={{
            width: screenWidth * 0.25,
            borderBottomWidth: 1,
            marginRight: screenWidth * 0.01,
            textAlign: 'center',
            fontSize: screenWidth * 0.045,
            fontFamily: 'MPLUSRounded1c-Bold',
          }}
          maxLength={4}
        />
        <Text style={{ fontSize: screenWidth * 0.038, color: '#555', marginRight: screenWidth * 0.025 }}>mL</Text>
        <Pressable onPress={handleCustomSize}
          style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            paddingHorizontal: screenWidth * 0.025,
            paddingVertical: screenHeight * 0.008,
            borderWidth: 1,
            borderColor: colors.primary,
          }}
        >
          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: screenWidth * 0.04 }}>サイズを追加</Text>
        </Pressable>
      </View>

      {/* ---- 飲みかけリセットボタン＋ボトルSVG ---- */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: screenHeight * 0.01 }}>
        <View style={{
          position: 'relative',
          justifyContent: 'center',
          alignItems: 'center',
          width: screenWidth * 0.23,
          height: screenHeight * 0.38,
        }}>
          {/* 左上にリセットボタン */}
          <Pressable
            onPress={handleResetBottle}
            style={{
              position: 'absolute',
              left: -screenWidth * 0.07,
              top: screenHeight * 0.022,
              zIndex: 3,
              backgroundColor: '#fff',
              borderRadius: 18,
              width: screenWidth * 0.065,
              height: screenWidth * 0.065,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: colors.primary,
            }}
            android_ripple={{ color: colors.primary + '22', borderless: true }}
          >
            <Ionicons name="refresh" size={screenWidth * 0.045} color={colors.primary} />
          </Pressable>
          {/* ボトルSVG */}
          {BottleSvg}
        </View>
        {/* スライダー */}
        <View style={{
          width: screenWidth * 0.10,
          height: screenHeight * 0.38,
          marginLeft: screenWidth * 0.05,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Slider
            style={{
              width: screenHeight * 0.38,
              height: 40,
              transform: [{ rotate: '-90deg' }]
            }}
            minimumValue={0}
            maximumValue={bottleSize}
            value={currentAmount}
            onValueChange={handleSliderChange}
            step={50}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.primary}
            thumbTintColor={colors.primary}
          />
        </View>
      </View>
      {/* エラー表示 */}
      {customError ? (
        <Text style={{
          color: 'red',
          marginBottom: screenHeight * 0.007,
          textAlign: 'center',
          fontSize: screenWidth * 0.03,
          fontFamily: 'MPLUSRounded1c-Bold',
        }}>
          {customError}
        </Text>
      ) : null}

      <Text style={[commonStyles.boldText, { marginBottom: screenHeight * 0.02 }]}>
        {`${drankAmount}ml 飲みました`}
      </Text>

      {/* 記録ボタン */}
      <Pressable onPress={handleRecord} style={({ pressed }) => [styles.shadowWrap,  { marginTop: screenHeight * 0.001 },
        pressed && { opacity: 0.85 }]}>
        <LinearGradient
          colors={colors.gradients.maingrad}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradientButton}
        >
          <Text style={commonStyles.buttonText}>記録する</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: screenWidth * 0.25,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.background,
  },
  shadowWrap: {
    borderRadius: 30,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginTop: screenHeight * 1,
  },
  gradientButton: {
    borderRadius: 30,
    paddingVertical: screenHeight * 0.01,
    paddingHorizontal: screenWidth * 0.08,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
});

export default RecordScreen;
