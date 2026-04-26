import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../theme/colors';

// Screens
import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import UsersScreen from '../screens/UsersScreen';
import UserFormScreen from '../screens/UserFormScreen';
import BukuFormScreen from '../screens/BukuFormScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// --- BOTTOM TAB NAVIGATOR ---
const MainTabs = ({ navigation }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const insets = useSafeAreaInsets();

  const checkRole = async () => {
    try {
      const savedRole = await AsyncStorage.getItem('userRole');
      // Pastikan perbandingan case-insensitive
      setIsAdmin(savedRole?.toLowerCase() === 'admin');
    } catch (e) {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    // Jalankan pengecekan saat pertama kali render
    checkRole();

    // SINKRONISASI ROLE: Periksa ulang role setiap kali MainTabs mendapatkan fokus
    // Ini penting jika user baru saja login/ganti akun
    const unsubscribe = navigation.addListener('focus', () => {
      checkRole();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '900', marginBottom: 5 },
        tabBarStyle: {
          height: 65 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 10,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          position: 'absolute',
          elevation: 25,
          backgroundColor: COLORS.white,
          borderTopWidth: 0,
          // Shadow untuk iOS
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 15,
          shadowOffset: { width: 0, height: -4 },
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === 'Katalog') iconName = focused ? 'book-open-variant' : 'book-outline';
          else if (route.name === 'Users') iconName = focused ? 'account-group' : 'account-group-outline';
          else if (route.name === 'Profil') iconName = focused ? 'account-circle' : 'account-circle-outline';

          return <MaterialCommunityIcons name={iconName} size={size + 4} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Katalog"
        component={DashboardScreen}
        options={{ title: 'KATALOG' }}
      />

      {/* Tab ini hanya akan dirender jika user adalah admin */}
      {isAdmin && (
        <Tab.Screen
          name="Users"
          component={UsersScreen}
          options={{ title: 'PENGGUNA' }}
        />
      )}

      <Tab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{ title: 'PROFIL' }}
      />
    </Tab.Navigator>
  );
};

// --- ROOT STACK NAVIGATOR ---
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{
          headerShown: false,
          // Efek transisi slide standar untuk aplikasi modern
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* MainApp berisi Bottom Tabs */}
        <Stack.Screen name="MainApp" component={MainTabs} />

        {/* Screen yang berada di luar tab bar (Full Screen) */}
        <Stack.Screen
          name="BukuForm"
          component={BukuFormScreen}
          options={{ gestureEnabled: true }}
        />
        <Stack.Screen
          name="UserForm"
          component={UserFormScreen}
          options={{ gestureEnabled: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;