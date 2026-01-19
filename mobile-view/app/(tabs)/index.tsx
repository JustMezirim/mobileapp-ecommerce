import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useProducts } from '@/hooks/useApi';
import { Ionicons } from '@expo/vector-icons';
import { useRefresh } from '@/hooks/useRefresh';
import { formatCurrency } from '@/utils/currency';
import { useUser } from '@clerk/clerk-expo';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorState from '@/components/ErrorState';

interface Product {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  category: string;
}

export default function HomeScreen() {
  const { data: response, isLoading, error, refetch } = useProducts();
  const { user } = useUser();
  const router = useRouter();
  const { refreshing, onRefresh } = useRefresh(refetch);

  const products = response?.products || [];
  const featuredProducts = products.slice(0, 6);
  const categories = [...new Set(products.map((p: Product) => p.category))] as string[];

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorState type="network" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  if (!products || products.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>No products available</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6C5CE7']} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello 👋</Text>
            <Text style={styles.title}>{user?.firstName || 'Welcome'}</Text>
          </View>
          <TouchableOpacity style={styles.searchButton} onPress={() => router.push('/(tabs)/products')}>
            <Ionicons name="search" size={20} color="#6C5CE7" />
          </TouchableOpacity>
        </View>

        {/* Banner */}
        <View style={styles.bannerContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} pagingEnabled>
            <View style={styles.banner}>
              <View style={styles.bannerContent}>
                <View style={styles.bannerBadge}>
                  <Text style={styles.bannerBadgeText}>LIMITED TIME</Text>
                </View>
                <Text style={styles.bannerTitle}>Special Offer</Text>
                <Text style={styles.bannerSubtitle}>Get 20% off on all items</Text>
                <TouchableOpacity style={styles.bannerButton} onPress={() => router.push('/(tabs)/products')}>
                  <Text style={styles.bannerButtonText}>Shop Now</Text>
                  <Ionicons name="arrow-forward" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
              <View style={styles.bannerImageContainer}>
                <Ionicons name="gift" size={80} color="rgba(255,255,255,0.2)" />
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shop by Category</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categories.map((category, index) => (
              <TouchableOpacity key={index} style={styles.categoryCard}>
                <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(index) }]}>
                  <Ionicons name={getCategoryIcon(index)} size={24} color="#fff" />
                </View>
                <Text style={styles.categoryText}>{String(category)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Featured Products</Text>
              <Text style={styles.sectionSubtitle}>Handpicked for you</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/products')}>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.productsGrid}>
            {featuredProducts.map((product: Product) => (
              <TouchableOpacity 
                key={product._id} 
                style={styles.productCard}
                onPress={() => router.push(`/product-details?id=${product._id}`)}
              >
                <View style={styles.productImageContainer}>
                  {product.images?.[0] ? (
                    <Image source={{ uri: product.images[0] }} style={styles.productImage} />
                  ) : (
                    <View style={styles.placeholderImage}>
                      <Ionicons name="image-outline" size={32} color="#ccc" />
                    </View>
                  )}
                  <View style={styles.favoriteButton}>
                    <Ionicons name="heart-outline" size={18} color="#666" />
                  </View>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                  <View style={styles.productFooter}>
                    <View>
                      <Text style={styles.productPrice}>{formatCurrency(product.price)}</Text>
                    </View>
                    <TouchableOpacity style={styles.addButton}>
                      <Ionicons name="add" size={18} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getCategoryColor = (index: number) => {
  const colors = ['#6C5CE7', '#00B894', '#FDCB6E', '#E17055', '#74B9FF', '#A29BFE'];
  return colors[index % colors.length];
};

const getCategoryIcon = (index: number) => {
  const icons = ['shirt', 'watch', 'phone-portrait', 'headset', 'laptop', 'camera'];
  return icons[index % icons.length] as any;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 10,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#F5F6FA',
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  greeting: {
    fontSize: 14,
    color: '#95A5A6',
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3436',
    marginTop: 4,
  },
  bannerContainer: {
    marginVertical: 16,
  },
  banner: {
    marginHorizontal: 20,
    width: 350,
    height: 180,
    borderRadius: 20,
    padding: 24,
    backgroundColor: '#6C5CE7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  bannerContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bannerBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  bannerBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  bannerImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  bannerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'flex-start',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bannerButtonText: {
    color: '#6C5CE7',
    fontWeight: 'bold',
    fontSize: 14,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#95A5A6',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  seeAll: {
    fontSize: 14,
    color: '#6C5CE7',
    fontWeight: '600',
  },
  categoriesScroll: {
    paddingLeft: 20,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 20,
    width: 75,
  },
  categoryIcon: {
    width: 70,
    height: 70,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryText: {
    fontSize: 12,
    color: '#2D3436',
    fontWeight: '600',
    textAlign: 'center',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  productCard: {
    width: '47%',
    backgroundColor: '#fff',
    margin: '1.5%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  productImageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 180,
  },
  placeholderImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#F5F6FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productInfo: {
    padding: 14,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 10,
    minHeight: 36,
    lineHeight: 18,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});