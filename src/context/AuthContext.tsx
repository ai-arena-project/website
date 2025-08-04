'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, getIdToken } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  resetPassword as resetPasswordFn,
  updateUserEmail,
  updateUserPassword,
  reauthenticateUser,
  sendVerificationEmail as sendVerificationEmailFn
} from '@/lib/auth';
import { formatFirebaseError } from '@/lib/utils';
import { AuthContextType, User } from '@/types/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  register: async () => {},
  login: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  updateEmail: async () => {},
  updatePassword: async () => {},
  sendVerificationEmail: async () => {},
  clearError: () => {},
});

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Clear error
  const clearError = () => {
    setError(null);
  };
  
  // Create session cookie
  const createSession = async (user: User) => {
    try {
      // Get the ID token
      const idToken = await getIdToken(user, true);
      
      // Create session cookie via API
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create session');
      }
      
      return true;
    } catch (error) {
      console.error('Error creating session:', error);
      return false;
    }
  };
  
  // Clear session cookie
  const clearSession = async () => {
    try {
      // Clear session cookie via API
      const response = await fetch('/api/auth/session', {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to clear session');
      }
      
      return true;
    } catch (error) {
      console.error('Error clearing session:', error);
      return false;
    }
  };

  // Register user
  const register = async (email: string, password: string) => {
    try {
      setLoading(true);
      clearError();
      await registerUser(email, password);
      toast.success('Registration successful! Please verify your email.');
      router.push('/auth/login');
    } catch (error: any) {
      const errorMessage = formatFirebaseError(error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      setLoading(true);
      clearError();
      
      // Login with Firebase
      const userCredential = await loginUser(email, password, rememberMe);
      
      // Create session cookie
      if (userCredential.user) {
        const sessionCreated = await createSession(userCredential.user as User);
        
        if (!sessionCreated) {
          throw new Error('Failed to create session');
        }
      }
      
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error: any) {
      const errorMessage = formatFirebaseError(error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      setLoading(true);
      clearError();
      
      // Clear session cookie first
      await clearSession();
      
      // Then logout from Firebase
      await logoutUser();
      
      toast.success('Logout successful!');
      router.push('/');
    } catch (error: any) {
      const errorMessage = formatFirebaseError(error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      clearError();
      await resetPasswordFn(email);
      toast.success('Password reset email sent!');
      router.push('/auth/login');
    } catch (error: any) {
      const errorMessage = formatFirebaseError(error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update email
  const updateEmail = async (newEmail: string, password: string) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      setLoading(true);
      clearError();
      
      // Reauthenticate user first
      await reauthenticateUser(user, password);
      
      // Update email
      await updateUserEmail(user, newEmail);
      
      toast.success('Email updated successfully!');
    } catch (error: any) {
      const errorMessage = formatFirebaseError(error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      setLoading(true);
      clearError();
      
      // Reauthenticate user first
      await reauthenticateUser(user, currentPassword);
      
      // Update password
      await updateUserPassword(user, newPassword);
      
      toast.success('Password updated successfully!');
    } catch (error: any) {
      const errorMessage = formatFirebaseError(error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Send verification email
  const sendVerificationEmail = async () => {
    try {
      if (!user) throw new Error('No user logged in');
      
      setLoading(true);
      clearError();
      
      await sendVerificationEmailFn(user);
      
      toast.success('Verification email sent!');
    } catch (error: any) {
      const errorMessage = formatFirebaseError(error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user as User | null);
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Context value
  const value: AuthContextType = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    sendVerificationEmail,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;