import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, TextInput, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProducts } from '@/hooks/useApi';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRefresh } from '@/hooks/useRefresh';
import { formatCurrency } from '@/utils/currency';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorState from '@/components/ErrorState';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images?: string[];
  category: string;
  stock: number;
}

export default function ProductsScreen() {
  const { data: response, isLoading, error, refetch } = useProducts();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { refreshing, onRefresh } = useRefresh(refetch);

  const products = response?.products || [];
  const categories = [...new Set(products.map((p: Product) => p.category))] as string[];
  
  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Products</Text>
        
        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#999"
          />
        </View>
        
        {/* Categories Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          <TouchableOpacity
            style={[styles.categoryButton, !selectedCategory && styles.categoryButtonActive]}
            onPress={() => setSelectedCategory('')}
          >
            <Text style={[styles.categoryButtonText, !selectedCategory && styles.categoryButtonTextActive]}>All</Text>
          </TouchableOpacity>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.categoryButton, selectedCategory === category && styles.categoryButtonActive]}
              onPress={() => setSelectedCategory(category as string)}
            >
              <Text style={[styles.categoryButtonText, selectedCategory === category && styles.categoryButtonTextActive]}>
                {String(category)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6C5CE7']} />
        }
      >
        <View style={styles.productsGrid}>
          {filteredProducts.map((product: Product) => (
            <TouchableOpacity 
              key={product._id} 
              style={styles.productCard}
              onPress={() => router.push(`/product-details?id=${product._id}`)}
            >
              {product.images?.[0] ? (
                <Image source={{ uri: product.images[0] }} style={styles.productImage} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderText}>No Image</Text>
                </View>
              )}
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                <View style={styles.productFooter}>
                  <Text style={styles.productPrice}>{formatCurrency(product.price)}</Text>
                  <View style={styles.stockBadge}>
                    <Text style={styles.productStock}>{product.stock}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        {filteredProducts.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
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
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  header: {
    backgroundColor: '#F5F6FA',
    padding: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
    color: '#6C5CE7',
  },
  searchInput: {
    flex: 1,
    padding: 14,
    fontSize: 15,
    color: '#2D3436',
  },
  categoriesContainer: {
    marginBottom: 4,
  },
  categoryButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryButtonActive: {
    backgroundColor: '#6C5CE7',
    shadowColor: '#6C5CE7',
    shadowOpacity: 0.3,
  },
  categoryButtonText: {
    color: '#95A5A6',
    fontWeight: '600',
    fontSize: 14,
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    paddingBottom: 100,
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
  placeholderText: {
    color: '#95A5A6',
    fontSize: 14,
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
  stockBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  productStock: {
    fontSize: 11,
    color: '#00B894',
    fontWeight: '700',
  },
  emptyState: {
    padding: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});