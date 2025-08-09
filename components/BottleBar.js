// components/BottleBar.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

const BottleBar = ({ amount, maxAmount }) => {
  const fillHeight = `${(amount / maxAmount) * 100}%`;

  return (
    <View style={styles.container}>
      {/* キャップ */}
      <View style={styles.cap} />

      {/* ボトル本体 */}
      <View style={styles.bottle}>
        <View style={[styles.fill, { height: fillHeight }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  cap: {
    width: 40,
    height: 10,
    backgroundColor: '#0288d1',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginBottom: 5,
  },
  bottle: {
    width: 100,
    height: 260,
    borderColor: '#0288d1',
    borderWidth: 3,
    borderRadius: 30,
    backgroundColor: '#fff',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  fill: {
    backgroundColor: '#4fc3f7',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
});

export default BottleBar;
