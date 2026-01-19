import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { showToast } from '@/utils/toast';
import { useAddresses, useDeleteAddress } from '@/hooks/useApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import ConfirmModal from '@/components/ConfirmModal';

interface Address {
  _id: string;
  label: string;
  fullName: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export default function AddressesScreen() {
  const router = useRouter();
  const { data: addressesData, isLoading } = useAddresses();
  const deleteAddressMutation = useDeleteAddress();
  const addresses = addressesData?.addresses || [];
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAddressMutation.mutateAsync(deleteId);
      showToast.info('Address Deleted', 'Address removed successfully');
      setDeleteId(null);
    } catch (error) {
      showToast.error('Error', 'Failed to delete address');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#2D3436" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Addresses</Text>
          <TouchableOpacity onPress={() => router.push('/add-address')} style={styles.addButton}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
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
        <Text style={styles.headerTitle}>My Addresses</Text>
        <TouchableOpacity onPress={() => router.push('/add-address')} style={styles.addButton}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {addresses.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="location" size={80} color="#6C5CE7" />
            </View>
            <Text style={styles.emptyText}>No addresses yet</Text>
            <Text style={styles.emptySubtext}>Add your delivery address</Text>
            <TouchableOpacity style={styles.addAddressButton} onPress={() => router.push('/add-address')}>
              <Text style={styles.addAddressText}>Add Address</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.addressList}>
            {addresses.map((address: Address) => (
              <View key={address._id} style={styles.addressCard}>
                <View style={styles.addressHeader}>
                  <View style={styles.labelContainer}>
                    <View style={styles.labelIcon}>
                      <Ionicons name="location" size={18} color="#6C5CE7" />
                    </View>
                    <Text style={styles.addressName}>{address.label}</Text>
                  </View>
                  {address.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Ionicons name="checkmark-circle" size={14} color="#00B894" />
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                </View>
                <View style={styles.addressDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="person" size={16} color="#95A5A6" />
                    <Text style={styles.addressPhone}>{address.fullName}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="call" size={16} color="#95A5A6" />
                    <Text style={styles.addressPhone}>{address.phoneNumber}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="home" size={16} color="#95A5A6" />
                    <Text style={styles.addressText}>
                      {address.streetAddress}, {address.city}, {address.state} {address.zipCode}
                    </Text>
                  </View>
                </View>
                <View style={styles.addressActions}>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => router.push(`/edit-address?id=${address._id}`)}
                  >
                    <Ionicons name="pencil" size={18} color="#6C5CE7" />
                    <Text style={styles.editText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => setDeleteId(address._id)}
                  >
                    <Ionicons name="trash" size={18} color="#E74C3C" />
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <ConfirmModal
        visible={deleteId !== null}
        title="Delete Address"
        message="Are you sure you want to delete this address? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        type="danger"
      />
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
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 60,
  },
  emptyIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#95A5A6',
    marginBottom: 32,
  },
  addAddressButton: {
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addAddressText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addressList: {
    padding: 16,
  },
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  labelIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0EDFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F8F5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  defaultText: {
    fontSize: 12,
    color: '#00B894',
    fontWeight: '600',
  },
  addressDetails: {
    gap: 10,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addressPhone: {
    fontSize: 14,
    color: '#2D3436',
    flex: 1,
  },
  addressText: {
    fontSize: 14,
    color: '#2D3436',
    lineHeight: 20,
    flex: 1,
  },
  addressActions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F5F6FA',
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F0EDFF',
    paddingVertical: 12,
    borderRadius: 12,
  },
  editText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6C5CE7',
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFEBEE',
    paddingVertical: 12,
    borderRadius: 12,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E74C3C',
  },
});
