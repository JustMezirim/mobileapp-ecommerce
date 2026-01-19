import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '@/store/cartStore';
import { showToast } from '@/utils/toast';
import { useUserProfile, useAddresses, useCreateOrder } from '@/hooks/useApi';
import { formatCurrency } from '@/utils/currency';

export default function CheckoutScreen() {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.cartItems);
  const clearCart = useCartStore((state) => state.clearCart);
  const { data: profile } = useUserProfile();
  const { data: addressesData } = useAddresses();
  const createOrderMutation = useCreateOrder();
  
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const defaultAddress = addressesData?.addresses?.find((addr: any) => addr.isDefault) || addressesData?.addresses?.[0];
  const name = profile?.name || '';
  const phone = profile?.phoneNumber || '';
  const address = defaultAddress ? `${defaultAddress.streetAddress}, ${defaultAddress.city}, ${defaultAddress.state} ${defaultAddress.zipCode}` : '';

  const handlePlaceOrder = async () => {
    if (!name || !phone || !address) {
      showToast.error('Missing Information', 'Please complete your profile and add a delivery address');
      return;
    }
    try {
      await createOrderMutation.mutateAsync({
        orderItems: cartItems.map(item => ({
          productId: item._id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: name,
          phoneNumber: phone,
          streetAddress: defaultAddress?.streetAddress || '',
          city: defaultAddress?.city || '',
          state: defaultAddress?.state || '',
          zipCode: defaultAddress?.zipCode || '',
        },
      });
      clearCart();
      showToast.success('Order Placed!', 'Your order has been placed successfully');
      router.push('/(tabs)/orders');
    } catch (error) {
      showToast.error('Error', 'Failed to place order');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2D3436" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Delivery Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="location" size={20} color="#6C5CE7" />
              </View>
              <Text style={styles.sectionTitle}>Delivery Address</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/edit-profile')} style={styles.editButton}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Ionicons name="person" size={20} color="#6C5CE7" />
              <Text style={styles.infoText}>{name || 'Not set'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Ionicons name="call" size={20} color="#6C5CE7" />
              <Text style={styles.infoText}>{phone || 'Not set'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Ionicons name="home" size={20} color="#6C5CE7" />
              <Text style={styles.infoText}>{address || 'No address added'}</Text>
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="cart" size={20} color="#6C5CE7" />
              </View>
              <Text style={styles.sectionTitle}>Order Summary</Text>
            </View>
            <View style={styles.itemsBadge}>
              <Text style={styles.itemsBadgeText}>{cartItems.length}</Text>
            </View>
          </View>
          <View style={styles.card}>
            {cartItems.map((item, index) => (
              <View key={item._id}>
                {index > 0 && <View style={styles.divider} />}
                <View style={styles.orderItem}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                  </View>
                  <Text style={styles.itemPrice}>{formatCurrency(item.price * item.quantity)}</Text>
                </View>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatCurrency(totalPrice)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.freeText}>FREE</Text>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="wallet" size={20} color="#6C5CE7" />
              </View>
              <Text style={styles.sectionTitle}>Payment Method</Text>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.paymentOption}>
              <View style={styles.paymentLeft}>
                <View style={styles.cashIcon}>
                  <Ionicons name="cash" size={24} color="#6C5CE7" />
                </View>
                <Text style={styles.paymentText}>Cash on Delivery</Text>
              </View>
              <View style={styles.checkIcon}>
                <Ionicons name="checkmark" size={20} color="#fff" />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalPrice}>{formatCurrency(totalPrice)}</Text>
        </View>
        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <View style={styles.buttonContent}>
            <Text style={styles.placeOrderButtonText}>Place Order</Text>
            <View style={styles.buttonIcon}>
              <Ionicons name="arrow-forward" size={20} color="#6C5CE7" />
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
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0EDFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F0EDFF',
  },
  editLink: {
    fontSize: 14,
    color: '#6C5CE7',
    fontWeight: '600',
  },
  itemsBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemsBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 18,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  divider: {
    height: 1,
    backgroundColor: '#F5F6FA',
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    color: '#2D3436',
    lineHeight: 22,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 13,
    color: '#95A5A6',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#95A5A6',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3436',
  },
  freeText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#00B894',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  cashIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0EDFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
  },
  checkIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
  },
  totalCard: {
    backgroundColor: '#F5F6FA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 15,
    color: '#95A5A6',
  },
  totalPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  placeOrderButton: {
    backgroundColor: '#6C5CE7',
    borderRadius: 20,
    padding: 4,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  placeOrderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
