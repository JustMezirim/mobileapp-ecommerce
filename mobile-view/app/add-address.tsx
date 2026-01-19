import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { showToast } from '@/utils/toast';
import { useAddAddress, useUserProfile } from '@/hooks/useApi';
import { useUser } from '@clerk/clerk-expo';

export default function AddAddressScreen() {
  const router = useRouter();
  const addAddressMutation = useAddAddress();
  const { user } = useUser();
  const { data: profile } = useUserProfile();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [label, setLabel] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    if (user?.fullName) setFullName(user.fullName);
    if (profile?.phoneNumber) setPhoneNumber(profile.phoneNumber);
  }, [user, profile]);

  const handleSave = async () => {
    if (!fullName || !phoneNumber || !label || !streetAddress || !city || !state || !zipCode) {
      showToast.error('Error', 'Please fill in all fields');
      return;
    }
    try {
      await addAddressMutation.mutateAsync({
        fullName,
        phoneNumber,
        label,
        streetAddress,
        city,
        state,
        zipCode,
        isDefault,
      });
      showToast.success('Address Added', 'New address has been added');
      router.back();
    } catch (error) {
      showToast.error('Error', 'Failed to add address');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2D3436" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Address</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <View style={styles.labelIcon}>
                <Ionicons name="person" size={16} color="#6C5CE7" />
              </View>
              <Text style={styles.label}>Full Name</Text>
            </View>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter full name"
              placeholderTextColor="#95A5A6"
            />
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
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              placeholderTextColor="#95A5A6"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <View style={styles.labelIcon}>
                <Ionicons name="pricetag" size={16} color="#6C5CE7" />
              </View>
              <Text style={styles.label}>Label</Text>
            </View>
            <TextInput
              style={styles.input}
              value={label}
              onChangeText={setLabel}
              placeholder="e.g., Home, Office"
              placeholderTextColor="#95A5A6"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <View style={styles.labelIcon}>
                <Ionicons name="home" size={16} color="#6C5CE7" />
              </View>
              <Text style={styles.label}>Street Address</Text>
            </View>
            <TextInput
              style={styles.input}
              value={streetAddress}
              onChangeText={setStreetAddress}
              placeholder="Enter street address"
              placeholderTextColor="#95A5A6"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <View style={styles.labelIcon}>
                <Ionicons name="business" size={16} color="#6C5CE7" />
              </View>
              <Text style={styles.label}>City</Text>
            </View>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="Enter city"
              placeholderTextColor="#95A5A6"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <View style={styles.labelIcon}>
                <Ionicons name="map" size={16} color="#6C5CE7" />
              </View>
              <Text style={styles.label}>State</Text>
            </View>
            <TextInput
              style={styles.input}
              value={state}
              onChangeText={setState}
              placeholder="Enter state"
              placeholderTextColor="#95A5A6"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <View style={styles.labelIcon}>
                <Ionicons name="mail" size={16} color="#6C5CE7" />
              </View>
              <Text style={styles.label}>Zip Code</Text>
            </View>
            <TextInput
              style={styles.input}
              value={zipCode}
              onChangeText={setZipCode}
              placeholder="Enter zip code"
              keyboardType="numeric"
              placeholderTextColor="#95A5A6"
            />
          </View>

          <TouchableOpacity 
            style={styles.defaultOption}
            onPress={() => setIsDefault(!isDefault)}
          >
            <View style={[styles.checkbox, isDefault && styles.checkboxActive]}>
              {isDefault && <Ionicons name="checkmark" size={18} color="#fff" />}
            </View>
            <Text style={styles.defaultText}>Set as default address</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <View style={styles.saveButtonContent}>
            <Text style={styles.saveButtonText}>Save Address</Text>
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
  form: {
    paddingHorizontal: 20,
    paddingTop: 20,
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
  defaultOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginTop: 8,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxActive: {
    backgroundColor: '#6C5CE7',
  },
  defaultText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#2D3436',
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
