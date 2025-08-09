import React from 'react';
import { StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import colors from '../styles/colors';

const ScrollSlider = ({ value, onValueChange, max }) => (
  <Slider
    style={styles.slider}
    minimumValue={0}
    maximumValue={max}
    value={value}
    onValueChange={onValueChange}
    step={50}
    minimumTrackTintColor="#4dabf7"
    maximumTrackTintColor="#ccc"
    thumbTintColor="#4dabf7"
    thumbTouchSize={{ width: 100, height: 40 }}
  />
);

const styles = StyleSheet.create({
  slider: {
    // 横長サイズを回転させて縦向きに
    width: 300,
    height: 40,
    transform: [{ rotate: '-90deg' }],
  },
});

export default ScrollSlider;