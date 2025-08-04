import { NextRequest, NextResponse } from 'next/server';
import { createSessionCookie, verifySessionCookie } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

// Create a session cookie
export async function POST(request: NextRequest) {
  try {
    // Get the ID token from the request body
    const { idToken } = await request.json();
    
    if (!idToken) {
      return NextResponse.json(
        { error: 'ID token is required' },
        { status: 400 }
      );
    }
    
    // Set session expiration to 5 days
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    
    // Create the session cookie
    const { success, sessionCookie } = await createSessionCookie(idToken, expiresIn);
    
    if (!success || !sessionCookie) {
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 401 }
      );
    }
    
    // Set the session cookie
    const cookieStore = await cookies();
    await cookieStore.set({
      name: '__session',
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresIn / 1000, // Convert to seconds
      path: '/',
      sameSite: 'lax',
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Clear the session cookie
export async function DELETE() {
  try {
    // Clear the session cookie
    const cookieStore = await cookies();
    await cookieStore.delete('__session');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Verify the session cookie
export async function GET() {
  try {
    // Get the session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('__session')?.value;
    
    if (!sessionCookie) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }
    
    // Verify the session cookie
    const { valid, decodedClaims } = await verifySessionCookie(sessionCookie);
    
    if (!valid || !decodedClaims) {
      // Clear the invalid cookie
      await cookieStore.delete('__session');
      
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      authenticated: true,
      user: {
        uid: decodedClaims.uid,
        email: decodedClaims.email,
        emailVerified: decodedClaims.email_verified,
      },
    });
  } catch (error) {
    console.error('Error verifying session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}