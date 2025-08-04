'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileUpdateForm from '@/components/auth/ProfileUpdateForm';
import Header from '@/components/layout/Header';
import { useAuth } from '@/context/AuthContext';
import Loading from '@/components/ui/Loading';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loading size="lg" text="Loading profile..." />
        </main>
      </div>
    );
  }

  // If not authenticated and not loading, don't render the page content
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Manage your account settings
            </p>
          </div>
          <ProfileUpdateForm />
        </div>
      </main>
    </div>
  );
}