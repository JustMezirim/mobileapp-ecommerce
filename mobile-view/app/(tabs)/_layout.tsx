import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Platform } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
// import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCartStore } from '@/store/cartStore';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const cartItems = useCartStore((state) => state.cartItems);
  const cartCount = cartItems.length;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.5)',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: '#6C5CE7',
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 15,
          paddingTop: 10,
          paddingHorizontal: 20,
          marginHorizontal: 16,
          marginBottom: Platform.OS === 'ios' ? 20 : 16,
          borderRadius: 24,
          shadowColor: '#6C5CE7',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
          elevation: 10,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={24} name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={24} name={focused ? 'grid' : 'grid-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, focused }) => (
            <View>
              <Ionicons size={24} name={focused ? 'cart' : 'cart-outline'} color={color} />
              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={24} name={focused ? 'receipt' : 'receipt-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={24} name={focused ? 'person' : 'person-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -8,
    top: -4,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
