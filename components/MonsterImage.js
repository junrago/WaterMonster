import React from 'react';
import { Image } from 'react-native';

const MonsterImage = ({ images, level, style }) => {
  const key = String(level);
  const image = images && images[key] ? images[key].on : null;
  if (!image) return null;


  return (
    <Image
      source={image}
      style={[{ width: 200, height: 200, resizeMode: 'contain' }, style]}
    />
  );
};

export default MonsterImage;
