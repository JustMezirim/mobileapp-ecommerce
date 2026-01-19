import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser, useClerk } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { showToast } from '@/utils/toast';
import { useRefresh } from '@/hooks/useRefresh';
import { useQueryClient } from '@tanstack/react-query';

interface ProfileOption {
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  color?: string;
}

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const { refreshing, onRefresh } = useRefresh();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await signOut();
    queryClient.clear();
    showToast.success('Logged Out', 'See you soon!');
    router.replace('/login');
  };

  const profileOptions: ProfileOption[] = [
    {
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      icon: 'person-outline',
      onPress: () => router.push('/edit-profile'),
    },
    {
      title: 'Order History',
      subtitle: 'View your past orders',
      icon: 'receipt-outline',
      onPress: () => showToast.info('Coming Soon', 'This feature is under development'),
    },
    {
      title: 'Addresses',
      subtitle: 'Manage delivery addresses',
      icon: 'location-outline',
      onPress: () => router.push('/addresses'),
    },
    {
      title: 'Wishlist',
      subtitle: 'View saved items',
      icon: 'heart-outline',
      onPress: () => showToast.info('Coming Soon', 'This feature is under development'),
    },
    {
      title: 'Payment Methods',
      subtitle: 'Manage payment options',
      icon: 'card-outline',
      onPress: () => showToast.info('Coming Soon', 'This feature is under development'),
    },
    {
      title: 'Notifications',
      subtitle: 'Manage notification preferences',
      icon: 'notifications-outline',
      onPress: () => showToast.info('Coming Soon', 'This feature is under development'),
    },
    {
      title: 'Help & Support',
      subtitle: 'Get help or contact support',
      icon: 'help-circle-outline',
      onPress: () => showToast.info('Coming Soon', 'This feature is under development'),
    },
    {
      title: 'About',
      subtitle: 'App version and information',
      icon: 'information-circle-outline',
      onPress: () => showToast.info('Version 1.0.0', 'E-commerce Mobile App'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6C5CE7']} />
        }
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {user?.imageUrl ? (
              <Image source={{ uri: user.imageUrl }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatar}>
                <Ionicons name="person" size={48} color="#fff" />
              </View>
            )}
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.fullName || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.primaryEmailAddress?.emailAddress || 'user@example.com'}</Text>
        </View>

        {/* Profile Options */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <Ionicons name="person" size={18} color="#6C5CE7" />
            </View>
            <Text style={styles.sectionTitle}>Account</Text>
          </View>
          <View style={styles.optionsContainer}>
            {profileOptions.slice(0, 4).map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.optionItem, index === 3 && styles.lastOption]}
                onPress={option.onPress}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name={option.icon} size={22} color="#6C5CE7" />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  {option.subtitle && (
                    <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color="#95A5A6" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <Ionicons name="settings" size={18} color="#6C5CE7" />
            </View>
            <Text style={styles.sectionTitle}>Settings</Text>
          </View>
          <View style={styles.optionsContainer}>
            {profileOptions.slice(4).map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.optionItem, index === 3 && styles.lastOption]}
                onPress={option.onPress}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name={option.icon} size={22} color="#6C5CE7" />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  {option.subtitle && (
                    <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color="#95A5A6" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <View style={styles.logoutContent}>
            <View style={styles.logoutIconContainer}>
              <Ionicons name="log-out" size={22} color="#E74C3C" />
            </View>
            <Text style={styles.logoutText}>Logout</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#E74C3C" />
        </TouchableOpacity>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileHeader: {
    backgroundColor: '#6C5CE7',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  avatarImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: '#fff',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#00B894',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#6C5CE7',
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  userEmail: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  sectionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0EDFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  optionsContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F6FA',
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0EDFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 3,
  },
  optionSubtitle: {
    fontSize: 13,
    color: '#95A5A6',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 24,
    padding: 18,
    borderRadius: 20,
    shadowColor: '#E74C3C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  logoutIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E74C3C',
  },
  versionContainer: {
    alignItems: 'center',
    padding: 24,
    marginTop: 8,
  },
  versionText: {
    fontSize: 13,
    color: '#95A5A6',
  },
});