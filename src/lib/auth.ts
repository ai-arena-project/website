import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
  sendEmailVerification,
  User,
  UserCredential,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { auth } from './firebase';

// Register a new user with email and password
export const registerUser = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Send email verification
    if (userCredential.user) {
      await sendEmailVerification(userCredential.user);
    }
    return userCredential;
  } catch (error) {
    throw error;
  }
};

// Login with email and password
export const loginUser = async (email: string, password: string, rememberMe: boolean = false): Promise<UserCredential> => {
  try {
    // Set persistence based on rememberMe option
    // Firebase Web SDK handles persistence automatically
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw error;
  }
};

// Logout the current user
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Send password reset email
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};

// Update user email
export const updateUserEmail = async (user: User, newEmail: string): Promise<void> => {
  try {
    await updateEmail(user, newEmail);
  } catch (error) {
    throw error;
  }
};

// Update user password
export const updateUserPassword = async (user: User, newPassword: string): Promise<void> => {
  try {
    await updatePassword(user, newPassword);
  } catch (error) {
    throw error;
  }
};

// Reauthenticate user (required for sensitive operations like changing email or password)
export const reauthenticateUser = async (user: User, password: string): Promise<void> => {
  try {
    const credential = EmailAuthProvider.credential(user.email!, password);
    await reauthenticateWithCredential(user, credential);
  } catch (error) {
    throw error;
  }
};

// Send email verification
export const sendVerificationEmail = async (user: User): Promise<void> => {
  try {
    await sendEmailVerification(user);
  } catch (error) {
    throw error;
  }
};