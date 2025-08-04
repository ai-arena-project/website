import { User as FirebaseUser } from 'firebase/auth';

// Firebase Error interface
export interface FirebaseError {
  code: string;
  message: string;
}

// User type extending Firebase User
// This is a placeholder for future extensions to the User type
// We're using a type alias instead of an interface to avoid the empty interface warning
export type User = FirebaseUser;

// Auth state type
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Auth context type
export interface AuthContextType extends AuthState {
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateEmail: (newEmail: string, password: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  clearError: () => void;
}

// Login form data
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

// Register form data
export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

// Reset password form data
export interface ResetPasswordFormData {
  email: string;
}

// Update profile form data
export interface UpdateProfileFormData {
  email: string;
  currentPassword: string;
}

// Update password form data
export interface UpdatePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}