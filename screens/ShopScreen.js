import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Image, ScrollView, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../styles/colors';
import commonStyles from '../styles/common';
import { useItems } from '../context/ItemsContext';
import ItemBadgeBar from '../components/ItemBadgeBar';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const BADGE_TOP = Math.round(screenHeight * 0.05);
const BADGE_RIGHT = Math.round(screenWidth * 0.06);

export default function ShopScreen() {
  // addXCrystalも呼べるように取得
  const { addBottle, addCrystal, addXCrystal, removeCrystal, crystalCount } = useItems();

  // モーダルの表示状態・種類
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState(null); // '5bottle' | 'video' | null

  // クイック購入用カード
  const quickShopItems = [
    {
      title: 'すいしょう×5',
      price: '￥240',
      onPress: () => addXCrystal(5), // 5個まとめて増やす
      icon: require('../assets/images/crystal_icon.png'),
    },
    {
      title: 'すいしょう×10',
      price: '￥420',
      onPress: () => addXCrystal(10), // 10個まとめて増やす
      icon: require('../assets/images/crystal_icon.png'),
    },
    {
      title: 'すいしょう×15',
      price: '￥600',
      onPress: () => addXCrystal(15), // 15個まとめて増やす
      icon: require('../assets/images/crystal_icon.png'),
    },
  ];

  // 5ボトル購入確定処理
  const handleBuy5Bottle = () => {
    if (crystalCount >= 1) {
      removeCrystal();
      for (let i = 0; i < 5; i++) {
        addBottle();
      }
      setModalVisible(false);
      setModalMode(null);
    }
  };

  // 動画報酬処理
  const handleGetBottleByVideo = () => {
    addBottle();
    setModalVisible(false);
    setModalMode(null);
  };

  // モーダル内容の分岐
  let modalText = '';
  let modalIcon = null;
  let modalAmount = '';
  let modalWarn = null;
  let handleYes = () => {};
  let yesText = 'はい';

  if (modalMode === '5bottle') {
    modalText = 'すいしょう×1消費して\nボトル×5購入しますか？';
    modalIcon = <Image source={require('../assets/images/crystal_icon.png')} style={modalStyles.crystalIcon} />;
    modalAmount = '×1';
    handleYes = handleBuy5Bottle;
    if (crystalCount < 1) {
      modalWarn = <Text style={modalStyles.warnText}>すいしょうが足りません</Text>;
    }
  } else if (modalMode === 'video') {
    modalText = '動画をみてボトル×1\nをもらいますか？';
    handleYes = handleGetBottleByVideo;
  }

  return (
    <View style={styles.container}>
      {/* バッジバー */}
      <View style={styles.badgeBar}>
        <ItemBadgeBar />
      </View>

      <Text style={styles.title}>ショップ</Text>

      {/* クイック購入 */}
      <View style={styles.quickRow}>
        {quickShopItems.map((item, idx) => (
          <View key={idx} style={styles.quickCard}>
            <Image source={item.icon} style={styles.quickIcon} resizeMode="contain" />
            <Text style={styles.quickTitle}>{item.title}</Text>
            <Pressable
              style={styles.quickBuyBtn}
              onPress={item.onPress}
              disabled={item.price === 'COMING SOON'}
            >
              <Text style={commonStyles.buttonTextmini}>{item.price}</Text>
            </Pressable>
          </View>
        ))}
      </View>

      {/* 横長カード：5ボトル & 1ボトルを個別で記述 */}
      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {/* 5ボトル */}
        <Pressable
          onPress={() => { setModalVisible(true); setModalMode('5bottle'); }}
          style={{ width: '100%' }}
        >
          <View style={wideStyles.card}>
            <View style={wideStyles.textCol}>
              <Text style={wideStyles.title}>5ボトル</Text>
              <View style={wideStyles.priceBadge}>
                <Image
                  source={require('../assets/images/crystal_icon.png')}
                  style={wideStyles.icon}
                />
                <Text style={wideStyles.priceText}>1</Text>
              </View>
            </View>
            <Image
              source={require('../assets/images/bottle_icon.png')}
              style={wideStyles.bottleImg}
              resizeMode="contain"
            />
          </View>
        </Pressable>

        {/* 1ボトル（動画報酬） */}
        <Pressable
          onPress={() => { setModalVisible(true); setModalMode('video'); }}
          style={{ width: '100%' }}
        >
          <LinearGradient
            colors={colors.gradients.maingrad}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[wideStyles.card, { overflow: 'hidden' }]}
          >
            <View style={wideStyles.textCol}>
              <Text style={[wideStyles.title, commonStyles.boldText, { color: colors.white}]}>1ボトル</Text>
              <Pressable style={wideStyles.videoBtn} onPress={() => { setModalVisible(true); setModalMode('video'); }}>
                <Text style={[commonStyles.buttonTextmini, { color: colors.textw }, wideStyles.videoBtnText]}>
                  動画を見て入手
                </Text>
              </Pressable>
            </View>
            <Image
              source={require('../assets/images/bottle_icon.png')}
              style={wideStyles.bottleImg}
              resizeMode="contain"
            />
          </LinearGradient>
        </Pressable>
      </ScrollView>

      {/* 共通モーダル */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => { setModalVisible(false); setModalMode(null); }}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.dialog}>
            <Text style={modalStyles.dialogText}>{modalText}</Text>
            <View style={modalStyles.iconRow}>
              {modalIcon}
              <Text style={modalStyles.crystalCount}>{modalAmount}</Text>
            </View>
            <View style={modalStyles.buttonRow}>
              <Pressable
                onPress={() => { setModalVisible(false); setModalMode(null); }}
                style={({ pressed }) => [
                  modalStyles.button,
                  { backgroundColor: pressed ? colors.pressednotrue : colors.pressednofalse },
                ]}
              >
                <Text style={modalStyles.cancelText}>いいえ</Text>
              </Pressable>
              <Pressable
                onPress={modalMode === '5bottle' && crystalCount < 1 ? undefined : handleYes}
                style={({ pressed }) => [
                  modalStyles.button,
                  {
                    backgroundColor: pressed ? colors.pressedystrue : colors.pressedysfalse,
                  },
                ]}
              >
                <Text style={modalStyles.okText}>{yesText}</Text>
              </Pressable>
            </View>
            {modalWarn}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// スタイル
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: screenWidth * 0.06,
    paddingTop: screenHeight * 0.08,
  },
  badgeBar: {
    position: 'absolute',
    right: BADGE_RIGHT,
    top: BADGE_TOP,
    zIndex: 100,
  },
  title: {
    fontSize: screenWidth * 0.08,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: screenHeight * 0.04,
    letterSpacing: 1,
    ...commonStyles.boldText,
  },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: screenHeight * 0.04,
    gap: screenWidth * 0.022,
  },
  quickCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 6,
    marginHorizontal: 2,
    elevation: 2,
    shadowColor: '#0056b3',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 1, height: 2 },
    overflow: 'visible',
  },
  quickIcon: {
    width: screenWidth * 0.19,
    height: screenWidth * 0.19,
    marginBottom: 6,
  },
  quickTitle: {
    fontWeight: 'bold',
    color: colors.primary,
    fontSize: screenWidth * 0.034,
    marginBottom: 3,
    ...commonStyles.textshop,
  },
  quickBuyBtn: {
    marginTop: 4,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1.2,
    borderColor: colors.primary,
  },
  listContainer: {
    gap: 22,
    paddingBottom: 24,
  },
});

const wideStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingVertical: 2,
    paddingHorizontal: 24,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#0056b3',
    shadowOpacity: 0.09,
    shadowRadius: 8,
    shadowOffset: { width: 1, height: 2 },
    overflow: 'visible',
  },
  textCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#21558a',
    fontSize: 19,
    marginBottom: 10,
    ...commonStyles.boldText,
  },
  priceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ddeeffff',
    borderRadius: 11,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 4,
  },
  icon: {
    width: 22,
    height: 22,
    marginRight: 6,
  },
  priceText: {
    color: '#2976b9',
    fontWeight: 'bold',
    fontSize: 17,
  },
  bottleImg: {
    width: 150,
    height: 150,
    marginLeft: 18,
    marginTop: 8,
    marginBottom: 2,
    transform: [{ rotate: "-0deg" }],
  },
  videoBtn: {
    marginTop: 7,
    backgroundColor: colors.highlight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  videoBtnText: {
    ...commonStyles.buttonTextmini,
    letterSpacing: 0.5,
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    width: screenWidth * 0.82,
    backgroundColor: colors.white,
    borderRadius: 18,
    alignItems: 'center',
    paddingVertical: screenHeight * 0.045,
    paddingHorizontal: screenWidth * 0.07,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 11,
    elevation: 10,
  },
  dialogText: {
    fontSize: screenWidth * 0.05,
    marginBottom: screenHeight * 0.012,
    textAlign: 'center',
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: 'MPLUSRounded1c-Bold',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  crystalIcon: {
    width: 27,
    height: 27,
    marginRight: 7,
  },
  crystalCount: {
    fontSize: 19,
    color: colors.text,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: screenWidth * 0.07,
    marginTop: screenHeight * 0.02,
    marginBottom: 0,
  },
  button: {
    minWidth: screenWidth * 0.22,
    minHeight: screenHeight * 0.052,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: screenHeight * 0.012,
    paddingHorizontal: screenWidth * 0.04,
    marginHorizontal: screenWidth * 0.01,
  },
  cancelText: {
    fontSize: screenWidth * 0.04,
    color: colors.cancelText,
    fontWeight: 'bold',
    letterSpacing: 1,
    ...commonStyles.buttonTextminib,
  },
  okText: {
    fontSize: screenWidth * 0.04,
    color: colors.okText,
    fontWeight: 'bold',
    letterSpacing: 1,
    ...commonStyles.buttonTextminib,
  },
  warnText: {
    color: '#c00',
    marginTop: 8,
    fontSize: screenWidth * 0.035,
    fontWeight: 'bold',
  },
});
