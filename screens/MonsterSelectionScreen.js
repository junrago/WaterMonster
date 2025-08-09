import React, { useState, useContext } from 'react';
import { View, FlatList, Image, Text, Pressable, StyleSheet, SafeAreaView, Dimensions, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import commonStyles from '../styles/common';
import colors from '../styles/colors';
import { useMonster } from '../context/MonsterContext';
import { WaterContext } from '../context/WaterContext';
import { getMonsterLevel } from '../utils/monsterLevel';
import { getMonsterImageByLevel } from '../assets/evolutionImages';
import { useItems } from '../context/ItemsContext';
import { useMonsterUnlock } from '../context/MonsterUnlockContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CARD_WIDTH = screenWidth * 0.25;
const CARD_HEIGHT = screenHeight * 0.19;
const ACTIONS_HEIGHT = screenHeight * 0.06;
const ITEM_CONTAINER_HEIGHT = CARD_HEIGHT + ACTIONS_HEIGHT + screenHeight * 0.035;

const monsterData = [
  { id: 'monster1', name: 'ウォータードラゴン', image: require('../assets/images/monster1.png') },
  { id: 'monster2', name: 'ウォーターデビル', image: require('../assets/images/monster2.png') },
  { id: 'monster3', name: 'ウォーターエンジェル', image: require('../assets/images/monster3.png') },
  { id: 'monster4', name: 'ウォーターバード', image: require('../assets/images/monster4.png') },
  { id: 'monster5', name: 'ウォーターポセイドン', image: require('../assets/images/monster5.png') },
  { id: 'monster6', name: 'ウォーターホエール', image: require('../assets/images/monster6.png') },
];

export default function MonsterSelectionScreen({ navigation }) { // ← navigationをpropsから受け取る
  const [selectedId, setSelectedId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [unlockTarget, setUnlockTarget] = useState(null);

  const { currentMonsterId, setCurrentMonsterId } = useMonster();
  const { monsterDrank } = useContext(WaterContext);
  const { crystalCount, removeCrystal } = useItems();
  const { isUnlocked, unlockMonster } = useMonsterUnlock();

  // アンロックモーダル表示
  const openUnlockModal = (id) => {
    setUnlockTarget(id);
    setModalVisible(true);
  };

  // アンロック実行
  const handleUnlock = () => {
    if (crystalCount >= 5 && unlockTarget) {
      unlockMonster(unlockTarget);
      removeCrystal(5);
      setCurrentMonsterId(unlockTarget);
    }
    setModalVisible(false);
    setUnlockTarget(null);
  };

  const handleGrow = (id) => {
    if (!isUnlocked(id)) {
      openUnlockModal(id);
    } else {
      setCurrentMonsterId(id);
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = item.id === selectedId;
    const isGrown = item.id === currentMonsterId;
    const drank = monsterDrank[item.id] || 0;
    const level = getMonsterLevel(drank);
    const isHighLevel = level >= 15;

    // 進化画像を優先
    let imageSource = item.image;
    const evolutionImg = getMonsterImageByLevel(item.id, level);
    if (evolutionImg && evolutionImg.on) imageSource = evolutionImg.on;
    else if (evolutionImg) imageSource = evolutionImg;

    const badgeColors = isHighLevel
      ? ['#9be7ff', '#3499ff', '#e0f7fa']
      : ['#ffffffff', '#ECF1FF', '#0088FF'];

    const badgeInnerStyle = [
      styles.levelBadgeInner,
      isHighLevel && styles.levelBadgeInnerHigh
    ];
    const badgeTextStyle = [
      styles.levelText,
      isHighLevel && styles.levelTextHigh
    ];

    return (
      <View style={styles.itemContainer}>
        <Pressable
          style={[styles.cardPressable, (isSelected || isGrown) && styles.cardSelected]}
          onPress={() => setSelectedId(isSelected ? null : item.id)}
        >
          <Image source={imageSource} style={styles.image} />
          {!isUnlocked(item.id) && <View style={styles.lockOverlay} />}
        </Pressable>

        <LinearGradient
          colors={badgeColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.levelBadgeOuter}
        >
          <View style={badgeInnerStyle}>
            <Text style={badgeTextStyle}>
              {level >= 20 ? '最大レベル' : `Lv.${level}`}
            </Text>
          </View>
        </LinearGradient>

        {isGrown && (
          <View style={styles.badge}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: screenWidth * 0.045 }}>✓</Text>
          </View>
        )}

        {isSelected && (
          <View style={styles.cardActions}>
            <Pressable
              onPress={() => handleGrow(item.id)}
              style={({ pressed }) => [styles.shadowWrap, pressed && { opacity: 0.85 }]}
            >
              <LinearGradient
                colors={colors.gradients.maingrad}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradientButton}
              >
                <Text style={commonStyles.buttonTextmini}>
                  {isUnlocked(item.id) ? '育てる' : 'アンロック'}
                </Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate('MonsterDetail', { monsterId: item.id })} // ← 詳細へ
              style={({ pressed }) => [styles.shadowWrap, pressed && { opacity: 0.85 }]}
            >
              <LinearGradient
                colors={colors.gradients.secgrad}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradientButton}
              >
                <Text style={[commonStyles.buttonTextminib, { color: colors.text }]}>詳細</Text>
              </LinearGradient>
            </Pressable>
          </View>
        )}
      </View>
    );
  };

  return (
    <LinearGradient colors={['#f0f6ff', '#eef4ff']} style={styles.container}>
      <SafeAreaView style={styles.inner}>
        <FlatList
          data={monsterData}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          numColumns={3}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          removeClippedSubviews={false}
          extraData={[monsterDrank, currentMonsterId, selectedId, crystalCount]}
        />
      </SafeAreaView>

      {/* アンロックモーダル */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>アンロック確認</Text>
            <Text style={styles.modalText}>
              すいしょう5個を消費してアンロックしますか？{"\n"}
              （現在 {crystalCount}個所持）
            </Text>
            <View style={styles.modalBtnRow}>
              <Pressable style={styles.modalBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalBtnTextCancel}>いいえ</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: crystalCount >= 5 ? colors.primary : '#ccc' }]}
                onPress={crystalCount >= 5 ? handleUnlock : null}
                disabled={crystalCount < 5}
              >
                <Text style={styles.modalBtnText}>はい</Text>
              </Pressable>
            </View>
            {crystalCount < 5 && <Text style={styles.modalWarn}>すいしょうが足りません</Text>}
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, paddingTop: screenHeight * 0.09 },
  list: { paddingHorizontal: screenWidth * 0.06, paddingTop: screenHeight * 0.028 },
  row: { justifyContent: 'space-between', marginBottom: screenHeight * 0.045 },

  itemContainer: {
    width: CARD_WIDTH,
    height: ITEM_CONTAINER_HEIGHT,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginHorizontal: screenWidth * 0.004,
    overflow: 'visible',
  },
  cardPressable: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: screenWidth * 0.032,
    backgroundColor: '#fff',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(180,180,180,0.42)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  image: {
    width: '200%',
    height: '200%',
    resizeMode: 'contain',
  },

  levelBadgeOuter: {
    borderRadius: screenWidth * 0.04,
    padding: screenWidth * 0.005,
    marginTop: screenHeight * 0.008,
    marginBottom: screenHeight * 0.003,
    alignSelf: 'center',
  },
  levelBadgeInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: screenWidth * 0.034,
    paddingHorizontal: screenWidth * 0.03,
    paddingVertical: screenHeight * 0.008,
    minWidth: screenWidth * 0.14,
  },
  levelText: {
    fontSize: screenWidth * 0.035,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
  },
  levelBadgeInnerHigh: {
    backgroundColor: colors.background,
    borderRadius: screenWidth * 0.034,
  },
  levelTextHigh: {
    color: '#3499ff',
    fontWeight: 'bold',
    fontSize: screenWidth * 0.035,
    textShadowColor: '#fff',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  badge: {
    position: 'absolute',
    top: -screenWidth * 0.015,
    right: -screenWidth * 0.015,
    width: screenWidth * 0.065,
    height: screenWidth * 0.065,
    borderRadius: screenWidth * 0.032,
    backgroundColor: colors.primary,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardActions: {
    position: 'absolute',
    bottom: -screenHeight * 0.012,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: CARD_WIDTH,
    height: ACTIONS_HEIGHT,
  },
  shadowWrap: {
    borderRadius: screenWidth * 0.10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginHorizontal: screenWidth * 0.005,
  },
  gradientButton: {
    borderRadius: screenWidth * 0.09,
    paddingVertical: screenHeight * 0.01,
    paddingHorizontal: screenWidth * 0.026,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: screenWidth * 0.005,
    borderColor: colors.white,
  },

  // モーダル
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: screenWidth * 0.8,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: screenWidth * 0.05,
    color: colors.text,
    fontFamily: 'MPLUSRounded1c-Bold',
    marginBottom: 12,
  },
  modalText: {
    fontSize: screenWidth * 0.04,
    marginBottom: 14,
    color: colors.text,
    fontFamily: 'MPLUSRounded1c-Bold',
    textAlign: 'center',
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  modalBtn: {
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 26,
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  modalBtnText: {
    fontSize: screenWidth * 0.042,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalBtnTextCancel: {
    fontSize: screenWidth * 0.042,
    color: '#555',
    fontWeight: 'bold',
  },
  modalWarn: {
    color: '#f66',
    marginTop: 8,
    fontWeight: 'bold',
  },
});
