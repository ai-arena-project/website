import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = ['/dashboard', '/profile'];

// Auth routes (redirect to dashboard if already authenticated)
const authRoutes = ['/auth/login', '/auth/register', '/auth/reset-password'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the route is protected or an auth route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Get the Firebase auth session cookie
  const sessionCookie = request.cookies.get('__session')?.value;
  
  // Check authentication status by calling the session verification API
  let isAuthenticated = false;
  
  if (sessionCookie) {
    try {
      // Call the session verification API
      const response = await fetch(new URL('/api/auth/session', request.url), {
        headers: {
          Cookie: `__session=${sessionCookie}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        isAuthenticated = data.authenticated;
      }
    } catch (error) {
      console.error('Error verifying session in middleware:', error);
      // If there's an error, assume not authenticated
      isAuthenticated = false;
    }
  }

  // If trying to access a protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    // Redirect to login page
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }

  // If trying to access an auth route while already authenticated
  if (isAuthRoute && isAuthenticated) {
    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    // Protected routes
    '/dashboard/:path*',
    '/profile/:path*',
    // Auth routes
    '/auth/:path*',
  ],
};