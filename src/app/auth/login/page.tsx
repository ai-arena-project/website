import React from 'react';
import { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';
import Header from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'Sign In | Firebase Auth Demo',
  description: 'Sign in to your account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <LoginForm />
      </main>
    </div>
  );
}