import React from 'react';
import { useUser, useSignIn, useSignUp, useClerk } from '@clerk/clerk-expo';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = (): AuthContextType => {
  const { user: clerkUser, isLoaded } = useUser();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const { signOut } = useClerk();

  const user: User | null = clerkUser ? {
    _id: clerkUser.id,
    name: clerkUser.fullName || clerkUser.firstName || 'User',
    email: clerkUser.primaryEmailAddress?.emailAddress || ''
  } : null;

  const login = async (email: string, password: string) => {
    try {
      await signIn?.create({
        identifier: email,
        password,
      });
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await signUp?.create({
        emailAddress: email,
        password,
        firstName: name,
      });
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const logout = async () => {
    try {
      await signOut?.();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return {
    user,
    isLoading: !isLoaded,
    login,
    register,
    logout,
  };
};