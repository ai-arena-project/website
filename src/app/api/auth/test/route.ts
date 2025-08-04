import { NextResponse } from 'next/server';
import { verifySessionCookie } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

/**
 * This is a test endpoint to verify that the Firebase Admin SDK is working correctly.
 * It attempts to verify the session cookie and returns the result.
 * This endpoint should only be used for testing and should be removed in production.
 */
export async function GET() {
  try {
    // Get the session cookie
    const sessionCookie = cookies().get('__session')?.value;
    
    if (!sessionCookie) {
      return NextResponse.json({
        status: 'unauthenticated',
        message: 'No session cookie found',
      });
    }
    
    // Verify the session cookie
    const { valid, decodedClaims } = await verifySessionCookie(sessionCookie);
    
    if (!valid || !decodedClaims) {
      return NextResponse.json({
        status: 'invalid',
        message: 'Session cookie is invalid',
      });
    }
    
    // Return the decoded claims
    return NextResponse.json({
      status: 'authenticated',
      message: 'Session cookie is valid',
      user: {
        uid: decodedClaims.uid,
        email: decodedClaims.email,
        emailVerified: decodedClaims.email_verified,
      },
    });
  } catch (error) {
    console.error('Error in test endpoint:', error);
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred while verifying the session cookie',
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}