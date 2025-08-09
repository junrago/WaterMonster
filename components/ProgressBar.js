import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../styles/colors';

const ProgressBar = ({ progress, maxVolume }) => {
  const widthAnim = useRef(new Animated.Value(0)).current;
  const widthPercent = (progress / maxVolume) * 100;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: widthPercent,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [widthPercent]);

  return (
    <View
      style={{
        width: '80%',
        height: 12,
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: 'hidden',
        marginVertical: 10,
        borderWidth: 2,                
        borderColor: colors.secondary, 
      }}
    >
      <Animated.View
        style={{
          width: widthAnim.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
          }),
          height: '100%',
        }}
      >
        <LinearGradient
          colors={[colors.primary, colors.highlight]} 
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
};

export default ProgressBar;
