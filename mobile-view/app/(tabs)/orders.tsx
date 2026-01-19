import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUserOrders } from '@/hooks/useApi';
import { useRouter } from 'expo-router';
import { useRefresh } from '@/hooks/useRefresh';
import { getStatusColor, getStatusIcon, getStatusLabel } from '@/utils/orderStatus';
import { formatCurrency } from '@/utils/currency';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorState from '@/components/ErrorState';

export default function OrdersScreen() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useUserOrders();
  const { refreshing, onRefresh } = useRefresh(refetch);
  const orders = data?.orders || [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        {orders.length > 0 && (
          <View style={styles.orderCountBadge}>
            <Text style={styles.orderCountText}>{orders.length}</Text>
          </View>
        )}
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6C5CE7']} />
        }
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorState type="network" onRetry={refetch} />
        ) : orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="receipt-outline" size={80} color="#6C5CE7" />
            </View>
            <Text style={styles.emptyText}>No orders yet</Text>
            <Text style={styles.emptySubtext}>Start shopping to see your orders here</Text>
            <TouchableOpacity style={styles.shopButton} onPress={() => router.push('/(tabs)/products')}>
              <Text style={styles.shopButtonText}>Browse Products</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.ordersList}>
            {orders.map((order: any) => (
              <TouchableOpacity 
                key={order._id} 
                style={styles.orderCard}
                onPress={() => router.push(`/order-tracking?id=${order._id}`)}
              >
                <View style={styles.orderHeader}>
                  <View style={styles.orderInfo}>
                    <View style={styles.orderIdRow}>
                      <View style={styles.orderIconContainer}>
                        <Ionicons name="receipt" size={18} color="#6C5CE7" />
                      </View>
                      <Text style={styles.orderId}>#{order._id.slice(-8)}</Text>
                    </View>
                    <Text style={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.orderStatus) + '20' }]}>
                    <Ionicons name={getStatusIcon(order.orderStatus)} size={16} color={getStatusColor(order.orderStatus)} />
                    <Text style={[styles.statusText, { color: getStatusColor(order.orderStatus) }]}>
                      {getStatusLabel(order.orderStatus)}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.orderDetails}>
                  <View style={styles.detailRow}>
                    <View style={styles.detailIcon}>
                      <Ionicons name="cube" size={16} color="#6C5CE7" />
                    </View>
                    <Text style={styles.detailText}>{order.orderItems.length} items</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <View style={styles.detailIcon}>
                      <Ionicons name="wallet" size={16} color="#6C5CE7" />
                    </View>
                    <Text style={styles.detailPrice}>{formatCurrency(order.totalPrice)}</Text>
                  </View>
                </View>

                <View style={styles.trackButton}>
                  <Text style={styles.trackButtonText}>Track Order</Text>
                  <Ionicons name="arrow-forward" size={18} color="#6C5CE7" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  orderCountBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  orderCountText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
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
    textAlign: 'center',
    marginBottom: 32,
  },
  shopButton: {
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
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ordersList: {
    padding: 16,
    gap: 14,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  orderIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0EDFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  orderDate: {
    fontSize: 13,
    color: '#95A5A6',
    marginLeft: 40,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F5F6FA',
    marginVertical: 14,
  },
  orderDetails: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F0EDFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#2D3436',
    fontWeight: '500',
  },
  detailPrice: {
    fontSize: 16,
    color: '#6C5CE7',
    fontWeight: 'bold',
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0EDFF',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  trackButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6C5CE7',
  },
});
