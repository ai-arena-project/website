'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ResetPasswordFormData } from '@/types/auth';
import { isValidEmail } from '@/lib/utils';

const ResetPasswordForm: React.FC = () => {
  const { resetPassword, loading, error, clearError } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    clearError();
    try {
      await resetPassword(data.email);
      setIsSubmitted(true);
    } catch {
      // Error is handled by the auth context
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
            Check Your Email
          </h2>
          
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md text-sm">
            We&apos;ve sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
          </div>
          
          <div className="text-center">
            <Link href="/auth/login">
              <Button variant="outline" fullWidth>
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Reset Password
        </h2>
        
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400 text-center">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Input
              id="email"
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                validate: (value) => isValidEmail(value) || 'Please enter a valid email address',
              })}
            />
          </div>
          
          <div>
            <Button
              type="submit"
              fullWidth
              isLoading={loading}
              className="bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
            >
              Send Reset Link
            </Button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Remember your password?{' '}
              <Link
                href="/auth/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;