import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSignIn, useOAuth } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [isLoading, setIsLoading] = useState(false);
  // const { signIn, setActive, isLoaded } = useSignIn();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  // const handleLogin = async () => {
  //   if (!isLoaded) return;
  //   
  //   if (!email || !password) {
  //     Alert.alert('Error', 'Please fill in all fields');
  //     return;
  //   }

  //   setIsLoading(true);
  //   try {
  //     const result = await signIn.create({
  //       identifier: email,
  //       password,
  //     });

  //     if (result.status === 'complete') {
  //       await setActive({ session: result.createdSessionId });
  //     }
  //   } catch (error: any) {
  //     Alert.alert('Error', error.errors?.[0]?.message || 'Login failed');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleGoogleSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();
      
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      }
    } catch (error: any) {
      Alert.alert('Error', 'Google sign in failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Ionicons name="cart" size={70} color="#fff" />
          </View>
          <Text style={styles.appName}>ShopEase</Text>
          <Text style={styles.tagline}>Your Shopping Companion</Text>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue shopping</Text>
          </View>

          <View style={styles.form}>
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleSignIn}
            >
              <View style={styles.googleIconContainer}>
                <Image 
                  source={require('@/assets/images/google_icon.png')} 
                  style={styles.googleIcon}
                />
              </View>
              <Text style={styles.googleButtonText}>Continue with Google</Text>
              <View style={styles.arrowIcon}>
                <Ionicons name="arrow-forward" size={20} color="#6C5CE7" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>By continuing, you agree to our</Text>
          <View style={styles.footerLinks}>
            <Text style={styles.link}>Terms of Service</Text>
            <Text style={styles.footerText}> and </Text>
            <Text style={styles.link}>Privacy Policy</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 15,
    color: '#95A5A6',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#95A5A6',
  },
  form: {
    gap: 16,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  googleIconContainer: {
    paddingLeft: 16,
  },
  googleIcon: {
    width: 28,
    height: 28,
  },
  googleButtonText: {
    flex: 1,
    color: '#2D3436',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  arrowIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0EDFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 13,
    color: '#95A5A6',
  },
  footerLinks: {
    flexDirection: 'row',
    marginTop: 6,
  },
  link: {
    fontSize: 13,
    color: '#6C5CE7',
    fontWeight: '600',
  },
});