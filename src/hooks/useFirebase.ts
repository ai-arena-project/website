'use client';

import { useEffect, useState } from 'react';
import { 
  User,
  onAuthStateChanged,
  sendEmailVerification,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface UseFirebaseReturn {
  currentUser: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  sendVerificationEmail: () => Promise<void>;
  reauthenticate: (password: string) => Promise<boolean>;
}

/**
 * Custom hook for Firebase authentication
 * Provides access to the current user, loading state, and authentication status
 */
export const useFirebase = (): UseFirebaseReturn => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Send verification email
  const sendVerificationEmail = async (): Promise<void> => {
    if (currentUser && !currentUser.emailVerified) {
      await sendEmailVerification(currentUser);
    }
  };

  // Reauthenticate user
  const reauthenticate = async (password: string): Promise<boolean> => {
    try {
      if (!currentUser || !currentUser.email) return false;
      
      const credential = EmailAuthProvider.credential(currentUser.email, password);
      await reauthenticateWithCredential(currentUser, credential);
      return true;
    } catch {
      return false;
    }
  };

  return {
    currentUser,
    isLoading,
    isAuthenticated: !!currentUser,
    isEmailVerified: currentUser?.emailVerified ?? false,
    sendVerificationEmail,
    reauthenticate
  };
};

export default useFirebase;