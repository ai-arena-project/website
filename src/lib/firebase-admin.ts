import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin SDK
const initializeFirebaseAdmin = () => {
  const apps = getApps();
  
  if (!apps.length) {
    // Check if running in production or if service account is provided
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      try {
        // Initialize with service account
        const serviceAccount = JSON.parse(
          Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString()
        );
        
        initializeApp({
          credential: cert(serviceAccount),
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });
      } catch (error) {
        console.error('Error initializing Firebase Admin SDK:', error);
        throw new Error('Failed to initialize Firebase Admin SDK');
      }
    } else {
      // Initialize with application default credentials
      // This works with Google Cloud and Firebase hosting environments
      initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    }
  }
  
  return getAuth();
};

// Export the auth instance
export const adminAuth = initializeFirebaseAdmin();

// Verify session cookie
export const verifySessionCookie = async (sessionCookie: string) => {
  try {
    // Verify the session cookie and get the decoded claims
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    return { valid: true, decodedClaims };
  } catch (error) {
    console.error('Error verifying session cookie:', error);
    return { valid: false, decodedClaims: null };
  }
};

// Create session cookie
export const createSessionCookie = async (idToken: string, expiresIn: number = 60 * 60 * 24 * 5 * 1000) => {
  try {
    // Create a session cookie from the Firebase ID token
    // expiresIn is in milliseconds, default is 5 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    return { success: true, sessionCookie };
  } catch (error) {
    console.error('Error creating session cookie:', error);
    return { success: false, sessionCookie: null };
  }
};

// Revoke all user sessions
export const revokeAllSessions = async (uid: string) => {
  try {
    // Revoke all refresh tokens for a user
    await adminAuth.revokeRefreshTokens(uid);
    return { success: true };
  } catch (error) {
    console.error('Error revoking sessions:', error);
    return { success: false };
  }
};