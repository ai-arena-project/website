'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import { useAuth } from '@/context/AuthContext';
import Loading from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
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
          <Loading size="lg" text="Loading dashboard..." />
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
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
            
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-md mb-6">
              <p className="text-indigo-700 dark:text-indigo-300">
                Welcome to your protected dashboard, {user.email}!
              </p>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Account Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                  <p className="mt-1 text-gray-900 dark:text-white">{user.email}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Verified</p>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {user.emailVerified ? (
                      <span className="text-green-600 dark:text-green-400">Verified</span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400">Not Verified</span>
                    )}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">User ID</p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white break-all">{user.uid}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => router.push('/profile')}
                variant="outline"
                className="flex-1"
              >
                Manage Profile
              </Button>
              <Button
                onClick={() => logout()}
                variant="destructive"
                className="flex-1"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}