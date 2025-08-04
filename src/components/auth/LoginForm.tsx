'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoginFormData } from '@/types/auth';
import { isValidEmail } from '@/lib/utils';

const LoginForm: React.FC = () => {
  const { login, loading, error, clearError } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    await login(data.email, data.password, data.rememberMe);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Sign In
        </h2>
        
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
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
              error={errors.password?.message}
              showPasswordToggle
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                {...register('rememberMe')}
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Remember me
              </label>
            </div>
            
            <div className="text-sm">
              <Link
                href="/auth/reset-password"
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Forgot your password?
              </Link>
            </div>
          </div>
          
          <div>
            <Button
              type="submit"
              fullWidth
              isLoading={loading}
              className="bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
            >
              Sign In
            </Button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/register"
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;