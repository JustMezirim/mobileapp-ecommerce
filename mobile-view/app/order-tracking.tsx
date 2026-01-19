import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTrackOrder } from '@/hooks/useApi';
import { useRefresh } from '@/hooks/useRefresh';
import { formatCurrency } from '@/utils/currency';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function OrderTrackingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { data, isLoading, refetch } = useTrackOrder(id as string);
  const { refreshing, onRefresh } = useRefresh(refetch);

  const getTimelineSteps = () => {
    const status = data?.status || 'placed';
    
    if (status === 'cancelled') {
      return [
        { key: 'placed', label: 'Order Placed', icon: 'checkmark-circle', timestamp: data?.placedAt, completed: true, active: false, cancelled: false },
        { key: 'cancelled', label: 'Order Cancelled', icon: 'close-circle', timestamp: data?.cancelledAt, completed: true, active: false, cancelled: true },
      ];
    }

    const steps = [
      { key: 'placed', label: 'Order Placed', icon: 'checkmark-circle', timestamp: data?.placedAt },
      { key: 'pending', label: 'Pending', icon: 'time', timestamp: data?.pendingAt },
      { key: 'processing', label: 'Processing', icon: 'sync', timestamp: data?.processingAt },
      { key: 'shipped', label: 'Shipped', icon: 'airplane', timestamp: data?.shippedAt },
      { key: 'in_transit', label: 'In Transit', icon: 'car', timestamp: data?.inTransitAt },
      { key: 'delivered', label: 'Delivered', icon: 'checkmark-done-circle', timestamp: data?.deliveredAt },
    ];

    const statusOrder = ['placed', 'pending', 'processing', 'shipped', 'in_transit', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
      cancelled: false,
    }));
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#2D3436" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Track Order</Text>
          <View style={styles.placeholder} />
        </View>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  const timelineSteps = getTimelineSteps();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2D3436" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Order</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6C5CE7']} />
        }
      >
        {/* Order Info */}
        <View style={styles.section}>
          <View style={styles.orderInfoCard}>
            <View style={styles.orderIdRow}>
              <View style={styles.orderIconContainer}>
                <Ionicons name="receipt" size={20} color="#6C5CE7" />
              </View>
              <View style={styles.orderIdInfo}>
                <Text style={styles.orderId}>#{data?.orderId?.slice(-8)}</Text>
                <Text style={styles.orderDate}>
                  {new Date(data?.orderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </Text>
              </View>
            </View>
            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>{formatCurrency(data?.totalPrice || 0)}</Text>
            </View>
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <Ionicons name="time" size={20} color="#6C5CE7" />
            </View>
            <Text style={styles.sectionTitle}>Order Status</Text>
          </View>
          <View style={styles.card}>
            {timelineSteps.map((step, index) => (
              <View key={step.key}>
                <View style={styles.timelineItem}>
                  <View style={styles.timelineIconContainer}>
                    <View
                      style={[
                        styles.timelineIcon,
                        step.completed && styles.timelineIconCompleted,
                        step.active && styles.timelineIconActive,
                        step.cancelled && styles.timelineIconCancelled,
                      ]}
                    >
                      <Ionicons
                        name={step.icon as any}
                        size={22}
                        color={step.completed ? '#fff' : '#95A5A6'}
                      />
                    </View>
                    {index < timelineSteps.length - 1 && (
                      <View
                        style={[
                          styles.timelineLine,
                          step.completed && styles.timelineLineCompleted,
                          step.cancelled && styles.timelineLineCancelled,
                        ]}
                      />
                    )}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text
                      style={[
                        styles.timelineLabel,
                        step.completed && styles.timelineLabelCompleted,
                      ]}
                    >
                      {step.label}
                    </Text>
                    {step.timestamp && (
                      <Text style={styles.timelineTimestamp}>
                        {new Date(step.timestamp).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })} at {new Date(step.timestamp).toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit',
                          hour12: true 
                        })}
                      </Text>
                    )}
                    {step.active && !step.timestamp && (
                      <View style={styles.progressBadge}>
                        <Text style={styles.progressText}>In progress</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <Ionicons name="cart" size={20} color="#6C5CE7" />
            </View>
            <Text style={styles.sectionTitle}>Order Items</Text>
          </View>
          <View style={styles.card}>
            {data?.items?.map((item: any, index: number) => (
              <View key={index}>
                {index > 0 && <View style={styles.divider} />}
                <View style={styles.orderItem}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName} numberOfLines={1}>{item.product?.name || 'Product'}</Text>
                    <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                  </View>
                  <Text style={styles.itemPrice}>{formatCurrency(item.price * item.quantity)}</Text>
                </View>
              </View>
            ))}
          </View>
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
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  sectionIconContainer: {
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
  orderInfoCard: {
    backgroundColor: '#6C5CE7',
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  orderIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  orderIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderIdInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  orderDate: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  totalCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  divider: {
    height: 1,
    backgroundColor: '#F5F6FA',
    marginVertical: 14,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 28,
  },
  timelineIconContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F6FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineIconCompleted: {
    backgroundColor: '#00B894',
  },
  timelineIconActive: {
    backgroundColor: '#6C5CE7',
  },
  timelineIconCancelled: {
    backgroundColor: '#dc3545',
  },
  timelineLine: {
    width: 3,
    flex: 1,
    backgroundColor: '#F5F6FA',
    marginTop: 8,
  },
  timelineLineCompleted: {
    backgroundColor: '#00B894',
  },
  timelineLineCancelled: {
    backgroundColor: '#dc3545',
  },
  timelineContent: {
    flex: 1,
    paddingTop: 10,
  },
  timelineLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#95A5A6',
  },
  timelineLabelCompleted: {
    color: '#2D3436',
    fontWeight: 'bold',
  },
  progressBadge: {
    backgroundColor: '#F0EDFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  progressText: {
    fontSize: 12,
    color: '#6C5CE7',
    fontWeight: '600',
  },
  timelineTimestamp: {
    fontSize: 13,
    color: '#95A5A6',
    marginTop: 4,
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
});
