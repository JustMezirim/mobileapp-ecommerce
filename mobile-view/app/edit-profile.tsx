import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import { showToast } from '@/utils/toast';
import { useUserProfile, useUpdateProfile } from '@/hooks/useApi';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { data: profile, isLoading } = useUserProfile();
  const updateProfile = useUpdateProfile();
  const [name, setName] = useState(profile?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber || '');
  const [email] = useState(user?.primaryEmailAddress?.emailAddress || '');
  
  const isGoogleUser = user?.externalAccounts?.some((account: any) => account.provider === 'google');

  const handleSave = async () => {
    const updates: { name?: string; phoneNumber?: string } = {};
    
    if (name && name !== profile?.name) {
      updates.name = name;
    }
    if (phoneNumber !== profile?.phoneNumber) {
      updates.phoneNumber = phoneNumber;
    }

    if (Object.keys(updates).length === 0) {
      showToast.info('No Changes', 'No changes to save');
      return;
    }

    try {
      await updateProfile.mutateAsync(updates);
      showToast.success('Profile Updated', 'Your profile has been updated successfully');
      router.back();
    } catch (error) {
      showToast.error('Error', 'Failed to update profile');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#2D3436" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={styles.placeholder} />
        </View>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2D3436" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {user?.imageUrl ? (
              <Image source={{ uri: user.imageUrl }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatar}>
                <Ionicons name="person" size={56} color="#fff" />
              </View>
            )}
            <TouchableOpacity style={styles.cameraButton}>
              <Ionicons name="camera" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.avatarLabel}>Profile Picture</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <View style={styles.labelIcon}>
                <Ionicons name="person" size={16} color="#6C5CE7" />
              </View>
              <Text style={styles.label}>Full Name</Text>
            </View>
            <View style={isGoogleUser ? styles.disabledInputContainer : undefined}>
              <TextInput
                style={[styles.input, isGoogleUser && styles.disabledInput]}
                value={name || profile?.name || user?.fullName || ''}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="#95A5A6"
                editable={!isGoogleUser}
              />
              {isGoogleUser && (
                <View style={styles.lockIcon}>
                  <Ionicons name="lock-closed" size={16} color="#95A5A6" />
                </View>
              )}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <View style={styles.labelIcon}>
                <Ionicons name="mail" size={16} color="#6C5CE7" />
              </View>
              <Text style={styles.label}>Email</Text>
            </View>
            <View style={styles.disabledInputContainer}>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={email}
                editable={false}
                placeholderTextColor="#95A5A6"
              />
              <View style={styles.lockIcon}>
                <Ionicons name="lock-closed" size={16} color="#95A5A6" />
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <View style={styles.labelIcon}>
                <Ionicons name="call" size={16} color="#6C5CE7" />
              </View>
              <Text style={styles.label}>Phone Number</Text>
            </View>
            <TextInput
              style={styles.input}
              value={phoneNumber || profile?.phoneNumber || ''}
              onChangeText={setPhoneNumber}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              placeholderTextColor="#95A5A6"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <View style={styles.saveButtonContent}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
            <View style={styles.saveIcon}>
              <Ionicons name="checkmark" size={20} color="#6C5CE7" />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  placeholder: {
    width: 44,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#fff',
    marginBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#F0EDFF',
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#F0EDFF',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00B894',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarLabel: {
    fontSize: 14,
    color: '#95A5A6',
  },
  form: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  labelIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F0EDFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3436',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    color: '#2D3436',
    borderWidth: 2,
    borderColor: '#F5F6FA',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  disabledInputContainer: {
    position: 'relative',
  },
  disabledInput: {
    backgroundColor: '#F5F6FA',
    color: '#95A5A6',
    borderColor: '#F5F6FA',
  },
  lockIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  footer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
  },
  saveButton: {
    backgroundColor: '#6C5CE7',
    borderRadius: 20,
    padding: 4,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  saveButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
