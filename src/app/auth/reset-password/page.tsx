import React from 'react';
import { Metadata } from 'next';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import Header from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'Reset Password | Firebase Auth Demo',
  description: 'Reset your password',
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <ResetPasswordForm />
      </main>
    </div>
  );
}