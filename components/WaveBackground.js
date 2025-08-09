// components/WaveBackground.js
import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import colors from '../styles/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const WaveBackground = ({
  width = SCREEN_WIDTH * 0.92,
  height = SCREEN_HEIGHT * 0.08,
  color1 = colors.highlight,
  color2 = colors.primary,
  style,
}) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    let running = true;
    const animate = () => {
      if (!running) return;
      setPhase((p) => p + 0.03);
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    return () => { running = false; };
  }, []);

 
  const amplitudeRatio = 0.15;
  const waveBaseY = height * 0.2;

  const A = height * amplitudeRatio;
  const N = 32;

  let path = `M 0 ${waveBaseY}`;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const x = width * t;
    const y = waveBaseY + A * Math.sin(2 * Math.PI * t + phase);
    path += ` L ${x} ${y}`;
  }
  path += ` L ${width} ${height} L 0 ${height} Z`;

  return (
    <Svg width={width} height={height} style={[{ position: 'absolute', left: 0, right: 0, bottom: 0 }, style]}>
      <Defs>
        <LinearGradient id="waveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={color1} />
          <Stop offset="100%" stopColor={color2} />
        </LinearGradient>
      </Defs>
      <Path d={path} fill="url(#waveGrad)" opacity={0.7} />
    </Svg>
  );
};

export default WaveBackground;
