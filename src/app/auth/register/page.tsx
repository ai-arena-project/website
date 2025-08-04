import React from 'react';
import { Metadata } from 'next';
import RegisterForm from '@/components/auth/RegisterForm';
import Header from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'Sign Up | Firebase Auth Demo',
  description: 'Create a new account',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <RegisterForm />
      </main>
    </div>
  );
}