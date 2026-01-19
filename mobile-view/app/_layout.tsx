import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider, SignedIn, SignedOut, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { View, Text, TouchableOpacity, StyleSheet, LogBox } from 'react-native';
import { Link } from 'expo-router';
import Toast from 'react-native-toast-message';
import 'react-native-reanimated';
import { useEffect } from 'react';
import { setAuthToken } from '@/api/client';

import { useColorScheme } from '@/hooks/use-color-scheme';

LogBox.ignoreAllLogs(false);

const originalLog = console.log;
console.log = (...args) => {
  originalLog('[LOG]', ...args);
};

const originalError = console.error;
console.error = (...args) => {
  originalError('[ERROR]', ...args);
};

const originalWarn = console.warn;
console.warn = (...args) => {
  originalWarn('[WARN]', ...args);
};

if (__DEV__) {
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    console.error('Global Error:', error, 'isFatal:', isFatal);
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error: any) => {
        console.error('[MUTATION ERROR]', error?.response?.status, error?.response?.data || error?.message);
        console.error('[MUTATION ERROR URL]', error?.config?.url);
      },
      onSuccess: (data: any) => console.log('[MUTATION SUCCESS]', data),
    },
  },
});
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

function AuthScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Please sign in to continue</Text>
      
      <View style={styles.buttonContainer}>
        <Link href="/login" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Sign In with Google</Text>
          </TouchableOpacity>
        </Link>
        
        {/* <Link href="/register" asChild>
          <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Sign Up</Text>
          </TouchableOpacity>
        </Link> */}
      </View>
    </View>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { getToken } = useAuth();

  useEffect(() => {
    setAuthToken(getToken);
  }, [getToken]);

  return (
    <>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <SignedIn>
          <Stack screenOptions={{ 
            headerShown: false,
            animation: 'slide_from_right',
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
        </SignedIn>
        <SignedOut>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
          </Stack>
        </SignedOut>
      </ThemeProvider>
      <StatusBar style="dark" backgroundColor="#f8f9fa" />
    </>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        <RootLayoutNav />
        <Toast 
            position="top" 
            topOffset={50}
            config={{
              success: (props) => (
                <View style={toastStyles.container}>
                  <View style={[toastStyles.toast, toastStyles.success]}>
                    <Text style={toastStyles.text1}>{props.text1}</Text>
                    {props.text2 && <Text style={toastStyles.text2}>{props.text2}</Text>}
                  </View>
                </View>
              ),
              info: (props) => (
                <View style={toastStyles.container}>
                  <View style={[toastStyles.toast, toastStyles.info]}>
                    <Text style={toastStyles.text1}>{props.text1}</Text>
                    {props.text2 && <Text style={toastStyles.text2}>{props.text2}</Text>}
                  </View>
                </View>
              ),
              error: (props) => (
                <View style={toastStyles.container}>
                  <View style={[toastStyles.toast, toastStyles.error]}>
                    <Text style={toastStyles.text1}>{props.text1}</Text>
                    {props.text2 && <Text style={toastStyles.text2}>{props.text2}</Text>}
                  </View>
                </View>
              ),
            }}
          />
      </QueryClientProvider>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#007AFF',
  },
});

const toastStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'flex-end',
  },
  toast: {
    padding: 16,
    borderRadius: 8,
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  success: {
    backgroundColor: '#28a745',
  },
  info: {
    backgroundColor: '#007AFF',
  },
  error: {
    backgroundColor: '#dc3545',
  },
  text1: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  text2: {
    fontSize: 13,
    color: '#fff',
    marginTop: 3,
    opacity: 0.95,
  },
});
