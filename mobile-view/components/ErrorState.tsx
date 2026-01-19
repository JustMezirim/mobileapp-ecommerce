import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ErrorStateProps {
  type?: 'network' | 'notFound' | 'general';
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
}

export default function ErrorState({
  type = 'general',
  title,
  message,
  onRetry,
  retryText = 'Try Again',
}: ErrorStateProps) {
  const getIcon = () => {
    switch (type) {
      case 'network':
        return 'cloud-offline';
      case 'notFound':
        return 'search';
      default:
        return 'alert-circle';
    }
  };

  const getTitle = () => {
    if (title) return title;
    switch (type) {
      case 'network':
        return 'Connection Error';
      case 'notFound':
        return 'Not Found';
      default:
        return 'Something Went Wrong';
    }
  };

  const getMessage = () => {
    if (message) return message;
    switch (type) {
      case 'network':
        return 'Please check your internet connection and try again.';
      case 'notFound':
        return 'The item you are looking for could not be found.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={getIcon()} size={64} color="#E74C3C" />
      </View>
      <Text style={styles.title}>{getTitle()}</Text>
      <Text style={styles.message}>{getMessage()}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Ionicons name="refresh" size={20} color="#fff" />
          <Text style={styles.retryText}>{retryText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F5F6FA',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#95A5A6',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
