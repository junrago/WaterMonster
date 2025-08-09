import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useItems } from '../context/ItemsContext';

const screenWidth = Dimensions.get('window').width;
const badgeIconSize = Math.round(screenWidth * 0.05);

export default function ItemBadgeBar({ onBottlePress }) {
  const { bottleCount, crystalCount } = useItems();

  return (
    <View style={styles.container}>
      <Pressable onPress={onBottlePress} style={styles.itemWrap}>
        <Image
          source={require('../assets/images/bottle_icon.png')}
          style={[styles.icon, { width: badgeIconSize, height: badgeIconSize }]}
        />
        <View style={styles.countBubble}>
          <Text style={styles.countText}>{bottleCount}</Text>
        </View>
      </Pressable>
      <View style={styles.itemWrap}>
        <Image
          source={require('../assets/images/crystal_icon.png')}
          style={[styles.icon, { width: badgeIconSize, height: badgeIconSize }]}
        />
        <View style={styles.countBubble}>
          <Text style={styles.countText}>{crystalCount}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', zIndex: 100, gap: 8 },
  itemWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 6, paddingVertical: 4 },
  icon: { marginRight: 4 },
  countBubble: { backgroundColor: '#fff', borderRadius: 8, minWidth: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4, marginLeft: 1 },
  countText: { color: '#069', fontWeight: 'bold', fontSize: 14 },
});
