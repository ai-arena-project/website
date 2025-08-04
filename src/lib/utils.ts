import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Combine clsx and tailwind-merge for handling class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength validation
export const isStrongPassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character' };
  }
  
  return { isValid: true, message: 'Password is strong' };
};

// Password strength indicator
export const getPasswordStrength = (password: string): { strength: number; label: string } => {
  if (!password) return { strength: 0, label: 'None' };
  
  let strength = 0;
  
  // Length check
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  
  // Character type checks
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  
  // Map strength score to label
  let label = '';
  if (strength <= 2) label = 'Weak';
  else if (strength <= 4) label = 'Medium';
  else label = 'Strong';
  
  return { strength, label };
};

// Format Firebase error messages for user-friendly display
export const formatFirebaseError = (error: unknown): string => {
  // Check if the error is a FirebaseError
  if (typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string') {
    const errorCode = error.code;
    
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please use a different email or try logging in.';
      case 'auth/invalid-email':
        return 'The email address is not valid.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/user-not-found':
        return 'No account found with this email. Please check your email or register.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again or reset your password.';
      case 'auth/too-many-requests':
        return 'Too many unsuccessful login attempts. Please try again later or reset your password.';
      case 'auth/weak-password':
        return 'The password is too weak. Please use a stronger password.';
      case 'auth/requires-recent-login':
        return 'This operation requires recent authentication. Please log in again before retrying.';
      default:
        return 'message' in error && typeof error.message === 'string' 
          ? error.message 
          : 'An error occurred. Please try again.';
    }
  }
  
  // If it's not a FirebaseError, try to get a meaningful message
  if (error instanceof Error) {
    return error.message;
  }
  
  // Fallback for completely unknown errors
  return 'An error occurred. Please try again.';
};