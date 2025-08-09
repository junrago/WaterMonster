import 'react-native-gesture-handler';
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { Shadow } from 'react-native-shadow-2';

import { WaterProvider } from './context/WaterContext';
import HomeScreen from './screens/HomeScreen';
import RecordScreen from './screens/RecordScreen';
import EvoScreen from './screens/EvoScreen';
import MonsterSelectionScreen from './screens/MonsterSelectionScreen';
import HistoryScreen from './screens/HistoryScreen';
import ShopScreen from './screens/ShopScreen';
import StartGoalScreen from './screens/StartGoalScreen';
import MonsterDetailScreen from './screens/MonsterDetailScreen'; // ★ 追加
import colors from './styles/colors';

import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import { TouchableOpacity } from 'react-native';

import { MonsterProvider } from './context/MonsterContext';
import { ItemsProvider } from './context/ItemsContext';
import { RewardProvider } from './context/RewardContext';
import { MonsterUnlockProvider } from './context/MonsterUnlockContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function GradientIcon({ name, size }) {
  return (
    <MaskedView
      style={{ width: size, height: size }}
      maskElement={
        <Ionicons name={name} size={size} color="black" style={{ backgroundColor: 'transparent' }} />
      }
    >
      <LinearGradient
        colors={colors.gradients.maingrad}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      />
    </MaskedView>
  );
}

function CustomTabBarButton({ children, onPress }) {
  return (
    <TouchableOpacity
      style={styles.customButtonContainer}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Shadow
        distance={10}
        startColor="rgba(107,161,255,0.25)"
        offset={[0, 6]}
        radius={35}
      >
        <LinearGradient
          colors={colors.gradients.maingrad}
          style={styles.customButton}
        >
          {children}
        </LinearGradient>
      </Shadow>
    </TouchableOpacity>
  );
}

function SimpleTabButton({ children, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      {children}
    </TouchableOpacity>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          width: 360,
          alignSelf: 'center',
          marginHorizontal: (Dimensions.get('window').width - 360) / 2,
          backgroundColor: colors.background,
          borderRadius: 35,
          height: 70,
          shadowColor: 'rgba(0,0,0,0.1)',
          shadowOpacity: 0.06,
          shadowRadius: 10,
          elevation: 10,
        },
      }}
      safeAreaInsets={{ bottom: 0 }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarButton: (props) => <SimpleTabButton {...props} />,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <GradientIcon name="home" size={28} />
            ) : (
              <Ionicons name="home-outline" size={28} color={colors.secondary} />
            ),
        }}
      />
      <Tab.Screen
        name="Shop"
        component={ShopScreen}
        options={{
          tabBarButton: (props) => <SimpleTabButton {...props} />,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <GradientIcon name="cart" size={28} />
            ) : (
              <Ionicons name="cart-outline" size={28} color={colors.secondary} />
            ),
        }}
      />
      <Tab.Screen
        name="Record"
        component={RecordScreen}
        options={{
          tabBarIcon: () => (
            <Ionicons name="water" size={32} color={colors.white} />
          ),
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />
      <Tab.Screen
        name="MonsterSelection"
        component={MonsterSelectionScreen}
        options={{
          tabBarButton: (props) => <SimpleTabButton {...props} />,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <GradientIcon name="book" size={28} />
            ) : (
              <Ionicons name="book-outline" size={28} color={colors.secondary} />
            ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarButton: (props) => <SimpleTabButton {...props} />,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <GradientIcon name="time" size={28} />
            ) : (
              <Ionicons name="time-outline" size={28} color={colors.secondary} />
            ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = Font.useFonts({
    'MPLUSRounded1c-Regular': require('./assets/fonts/MPLUSRounded1c-Regular.ttf'),
    'MPLUSRounded1c-Bold': require('./assets/fonts/MPLUSRounded1c-Bold.ttf'),
    'MPLUSRounded1c-ExtraBold': require('./assets/fonts/MPLUSRounded1c-ExtraBold.ttf'),
  });

  if (!fontsLoaded) return <AppLoading />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MonsterUnlockProvider>
        <RewardProvider>
          <MonsterProvider>
            <WaterProvider>
              <ItemsProvider>
                <NavigationContainer>
                  <Stack.Navigator
                    screenOptions={{ headerShown: false }}
                    initialRouteName="StartGoal"
                  >
                    <Stack.Screen name="StartGoal" component={StartGoalScreen} />
                    <Stack.Screen name="Main" component={MainTabs} />
                    <Stack.Screen name="Evo" component={EvoScreen} />
                    <Stack.Screen name="MonsterDetail" component={MonsterDetailScreen} />
                  </Stack.Navigator>
                </NavigationContainer>
              </ItemsProvider>
            </WaterProvider>
          </MonsterProvider>
        </RewardProvider>
      </MonsterUnlockProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  customButtonContainer: {
    top: -30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
