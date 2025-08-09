import React, { useState, useEffect, useRef } from 'react';
import Svg, { Defs, LinearGradient, Stop, Path, Rect, G } from 'react-native-svg';
import colors from '../styles/colors';

const BottleBar600Svg = ({ fillRatio = 0.5 }) => {
  // 基本ボトル座標
  const bodyLeftX = 25;
  const bodyRightX = 115;
  const bodyTopY = 60;
  const bodyBotY = 280;
  const strokeWidth = 5;
  const centerX = (bodyLeftX + bodyRightX) / 2;
  const neckWidth = 32;
  const neckLeftX = centerX - neckWidth / 2;
  const neckRightX = centerX + neckWidth / 2;
  const capTopY = 6;
  const capHeight = 12;

  // くびれ（凹み）
  const dentY = (bodyTopY + bodyBotY) / 2;
  const dentHeight = 10;
  const dentInset = 4;
  const dentTopY = dentY - dentHeight / 2;
  const dentBottomY = dentY + dentHeight / 2;

  // ラベル
  const labelWidth = 51;
  const labelHeight = 44;
  const labelX = centerX - labelWidth / 2;
  const labelY = bodyTopY + 35;

  // 下部の横線
  const lineWidth = 41;
  const lineHeight = 6;
  const lineSpacing = 8;
  const firstLineY = labelY + labelHeight + 20 + 30 + 25;
  const lineX = centerX - lineWidth / 2;

  // ★ラベル直下の横線
  const lineWidth2 = 41;
  const lineHeight2 = 6;
  const lineSpacing2 = 8;
  const firstLineY2 = labelHeight + 30; // ラベル直下に4本線
  const lineX2 = centerX - lineWidth2 / 2;

  // 水エリア
  const margin = strokeWidth / 2 + 2;
  const waterLeftX = bodyLeftX + margin;
  const waterRightX = bodyRightX - margin;
  const narrowLeft = bodyLeftX + dentInset + margin;
  const narrowRight = bodyRightX - dentInset - margin;
  const waterBotY = bodyBotY - margin;
  const totalHeight = waterBotY - (bodyTopY + margin) - 7;
  const fillHeight = totalHeight * fillRatio;
  const waterY = waterBotY - fillHeight;

  // 波アニメ
  const [phase, setPhase] = useState(0);
  const [bounce, setBounce] = useState(0);
  const prevFill = useRef(fillRatio);

  const baseAmp = 1;
  const bounceAmp = 8;
  const waveFreq = 0.7;
  const N = 24;

  useEffect(() => {
    let running = true;
    const animate = () => {
      if (!running) return;
      setPhase(p => p + 0.05);
      setBounce(b => b > 0 ? Math.max(0, b - 0.06) : 0);
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    return () => { running = false; };
  }, []);

  useEffect(() => {
    if (prevFill.current !== fillRatio) {
      setBounce(1);
      prevFill.current = fillRatio;
    }
  }, [fillRatio]);

  const waveAmp = baseAmp + (bounceAmp - baseAmp) * bounce;

  // 水面の幅
  let leftX, rightX;
  if (waterY < dentTopY) {
    leftX = waterLeftX;
    rightX = waterRightX;
  } else if (waterY < dentBottomY) {
    leftX = narrowLeft;
    rightX = narrowRight;
  } else {
    leftX = waterLeftX;
    rightX = waterRightX;
  }

  // 波のパス
  let wavePoints = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const x = leftX + (rightX - leftX) * t;
    const y = waterY + waveAmp * Math.sin(2 * Math.PI * t * waveFreq + phase);
    wavePoints.push([x, y]);
  }

  // --- 水パス ---
  let waterPath = '';
  if (fillRatio > 0) {
    waterPath = `M ${wavePoints[0][0]},${wavePoints[0][1]}`;
    for (let i = 1; i < wavePoints.length; i++) {
      waterPath += ` L ${wavePoints[i][0]},${wavePoints[i][1]}`;
    }

    if (waterY < dentTopY) {
      // 水面がくびれより上（ダンベル型）
      waterPath += `
        L ${waterRightX},${dentTopY}
        L ${narrowRight},${dentTopY}
        L ${narrowRight},${dentBottomY}
        L ${waterRightX},${dentBottomY}
        L ${waterRightX},${waterBotY}
        Q ${waterRightX},${bodyBotY} ${centerX},${bodyBotY}
        Q ${waterLeftX},${bodyBotY} ${waterLeftX},${waterBotY}
        L ${waterLeftX},${dentBottomY}
        L ${narrowLeft},${dentBottomY}
        L ${narrowLeft},${dentTopY}
        L ${waterLeftX},${dentTopY}
        Z
      `;
    } else if (waterY < dentBottomY) {
      // くびれ区間の中（ダンベル細）
      waterPath += `
        L ${narrowRight},${dentBottomY}
        L ${waterRightX},${dentBottomY}
        L ${waterRightX},${waterBotY}
        Q ${waterRightX},${bodyBotY} ${centerX},${bodyBotY}
        Q ${waterLeftX},${bodyBotY} ${waterLeftX},${waterBotY}
        L ${waterLeftX},${dentBottomY}
        L ${narrowLeft},${dentBottomY}
        Z
      `;
    } else {
      // くびれ区間より下（長方形のみ）
      waterPath += `
        L ${waterRightX},${waterBotY}
        Q ${waterRightX},${bodyBotY} ${centerX},${bodyBotY}
        Q ${waterLeftX},${bodyBotY} ${waterLeftX},${waterBotY}
        Z
      `;
    }
  }

  return (
    <Svg width={140} height={320} viewBox="0 0 140 320">
      {/* グラデーション定義 */}
      <Defs>
        <LinearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={colors.gradients.maingrad[0]} stopOpacity="1.0" />
          <Stop offset="100%" stopColor={colors.gradients.maingrad[1]} stopOpacity="1.0" />
        </LinearGradient>
      </Defs>

      <G>
        {/* 水部分 */}
        {fillRatio > 0 && (
          <Path
            d={waterPath}
            fill="url(#waterGradient)"
            opacity="0.7"
          />
        )}

        {/* ラベル */}
        <Rect
          x={labelX}
          y={labelY}
          width={labelWidth}
          height={labelHeight}
          rx="10"
          fill="#e0e0e0"
          opacity="0.0"
        />

        {/* 下部の4本線 */}
        {[0, 1, 2, 3].map(i => (
          <Rect
            key={'low'+i}
            x={lineX}
            y={firstLineY + i * (lineHeight + lineSpacing)-12}
            width={lineWidth}
            height={lineHeight}
            rx="3"
            fill="#e0e0e0"
            opacity="0.6"
          />
        ))}

        {/* ラベル直下の4本線 */}
        {[0, 1, 2, 3].map(i => (
          <Rect
            key={'top'+i}
            x={lineX2}
            y={firstLineY2 + i * (lineHeight2 + lineSpacing2)+12}
            width={lineWidth2}
            height={lineHeight2}
            rx="3"
            fill="#e0e0e0"
            opacity="0.6"
          />
        ))}

        {/* 首 */}
        <Rect
          x={centerX - neckWidth / 2}
          y={capTopY + capHeight }
          width={neckWidth}
          height="18"
          rx="6"
          fill="#0288d1"
        />

        {/* ボトル輪郭 */}
        <Path
          d={`M ${bodyLeftX},${bodyBotY - 10}
            Q ${bodyLeftX},${bodyBotY} ${centerX},${bodyBotY}
            Q ${bodyRightX},${bodyBotY} ${bodyRightX},${bodyBotY - 10}
            L ${bodyRightX},${dentY + dentHeight / 2}
            L ${bodyRightX - dentInset},${dentY + dentHeight / 2}
            L ${bodyRightX - dentInset},${dentY - dentHeight / 2}
            L ${bodyRightX},${dentY - dentHeight / 2}
            L ${bodyRightX},${bodyTopY + 12}
            L ${neckRightX},${bodyTopY-12-6-2}
            L ${neckLeftX},${bodyTopY-12-6-2}
            L ${bodyLeftX},${bodyTopY + 12}
            L ${bodyLeftX},${dentY - dentHeight / 2}
            L ${bodyLeftX + dentInset},${dentY - dentHeight / 2}
            L ${bodyLeftX + dentInset},${dentY + dentHeight / 2}
            L ${bodyLeftX},${dentY + dentHeight / 2}
            Z`}
          fill="none"
          stroke="#3c5d8f"
          strokeWidth={strokeWidth}
        />
      </G>
    </Svg>
  );
};

export default BottleBar600Svg;
