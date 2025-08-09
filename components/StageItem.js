import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions  } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../styles/colors';

export default function StageItem({
  label,
  description,
  imageActive,
  imageInactive,
  active = false,
  isFirst = false,
  isLast = false,
  isCurrent = false,
}) {
  const imgSource = active ? imageActive : imageInactive;
  const gradientColors = isCurrent
    ? colors.gradients.maingrad
    : colors.gradients.background;

  // labelとdescriptionの型安全ラップ
  const safeLabel = typeof label === 'string' ? label : String(label ?? '');
  const safeDescription =
    description == null
      ? ''
      : typeof description === 'string'
      ? description
      : String(description);

  return (
    <View style={[styles.row, isLast && styles.lastRow]}>
      <View style={styles.timeline}>
        {/* ベースライン */}
        <View
          style={[
            styles.lineBase,
            isFirst && styles.lineBaseFirst,
            isLast && styles.lineBaseLast,
          ]}
        />
        {/* 上部オーバーレイ */}
        {!isFirst &&
          (isCurrent ? (
            <LinearGradient
              colors={colors.gradients.maingrad}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.halfOverlayTop}
            />
          ) : (
            <View style={[styles.halfOverlayTop, active && styles.lineActive]} />
          ))}

        {/* 円 */}
        {isCurrent ? (
          <View style={styles.circleShadowWrapper}>
            <View style={[styles.circle, styles.circleCurrent]} />
          </View>
        ) : (
          <View
            style={[
              styles.circle,
              active ? styles.circleActive : styles.circleInactive,
            ]}
          />
        )}

        {/* 下部オーバーレイ */}
        {!isLast && !isCurrent && (
          <View style={[styles.halfOverlayBottom, active && styles.lineActive]} />
        )}
      </View>

      {/* カード本体（背景はグラデーション） */}
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={[
          styles.card,
          styles.cardRow,
          isCurrent && styles.cardCurrentShadow,
        ]}
      >
        {imgSource && (
          <Image source={imgSource} style={styles.image} resizeMode="contain" />
        )}
        <View style={styles.textContainer}>
          <Text style={[styles.label, active && styles.labelActive, isCurrent && styles.labelCurrent]}>
            {safeLabel}
          </Text>
          {!!safeDescription && (
            <Text style={[
              styles.description,
              isCurrent ? styles.descriptionCurrent : active ? styles.descriptionActive : null
            ]}>
              {safeDescription}
            </Text>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

const CIRCLE_SIZE = 16;
const LINE_WIDTH = 2;
const CARD_BORDER_RADIUS = 12;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  lastRow: {
    marginBottom: 0,
  },
  timeline: {
    width: 40,
    position: 'relative',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineBase: {
    position: 'absolute',
    top: -5,
    bottom: -15,
    width: LINE_WIDTH,
    left: '50%',
    marginLeft: -LINE_WIDTH / 2,
    backgroundColor: colors.borderColor,
  },
  lineBaseFirst: {
    top: '50%',
  },
  lineBaseLast: {
    bottom: '50%',
  },
  halfOverlayTop: {
    position: 'absolute',
    top: -15,
    bottom: '50%',
    width: LINE_WIDTH,
    left: '50%',
    marginLeft: -LINE_WIDTH / 2,
  },
  halfOverlayBottom: {
    position: 'absolute',
    top: '50%',
    bottom: -10,
    width: LINE_WIDTH,
    left: '50%',
    marginLeft: -LINE_WIDTH / 2,
  },
  lineActive: {
    backgroundColor: colors.primary,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: colors.white,
    borderWidth: 2,
    zIndex: 1,
  },
  circleInactive: {
    borderColor: colors.borderColor,
  },
  circleActive: {
    borderColor: colors.primary,
    width: CIRCLE_SIZE + 4,
    height: CIRCLE_SIZE + 4,
    borderRadius: (CIRCLE_SIZE + 4) / 2,
  },
  circleCurrent: {
    borderColor: colors.primary,
    width: CIRCLE_SIZE + 8,
    height: CIRCLE_SIZE + 8,
    borderRadius: (CIRCLE_SIZE + 8) / 2,
  },
  circleShadowWrapper: {
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1.0,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    borderRadius: CARD_BORDER_RADIUS,
    padding: 16,
    marginLeft: 8,
    minHeight: 60,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardCurrentShadow: {
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1.0,
    shadowRadius: 4,
    elevation: 4,
  },
  textContainer: {
    flex: 1,
  },
  description: {
    fontSize: 12,
    color: colors.subwhite2,
    marginTop: 4,
    fontFamily: 'MPLUSRounded1c-Bold'
  },
  descriptionActive: {
    color: colors.subwhite,
    fontFamily: 'MPLUSRounded1c-Bold'
  },
  descriptionCurrent: {
    color: colors.descriptionCurrent,
    fontWeight: '600',
    fontFamily: 'MPLUSRounded1c-Bold'
  },
  image: {
    width: 64,
    height: 64,
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    color: colors.subwhite,
    fontFamily: 'MPLUSRounded1c-Bold'
  },
  labelActive: {
    color: colors.text,
    fontWeight: '600',
    fontFamily: 'MPLUSRounded1c-Bold'
  },
  labelCurrent: {
    color: colors.white,
    fontWeight: '700',
    fontFamily: 'MPLUSRounded1c-Bold'
  },
});
