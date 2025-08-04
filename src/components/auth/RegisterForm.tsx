'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { RegisterFormData } from '@/types/auth';
import { isValidEmail, getPasswordStrength, isStrongPassword } from '@/lib/utils';

const RegisterForm: React.FC = () => {
  const { register: registerUser, loading, error, clearError } = useAuth();
  const [password, setPassword] = useState('');
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Watch password for strength indicator
  const watchPassword = watch('password');
  const passwordStrength = getPasswordStrength(watchPassword);

  // Update password state for strength indicator
  React.useEffect(() => {
    setPassword(watchPassword || '');
  }, [watchPassword]);

  const onSubmit = async (data: RegisterFormData) => {
    clearError();
    await registerUser(data.email, data.password);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Create an Account
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
                validate: (value) => {
                  const result = isStrongPassword(value);
                  return result.isValid || result.message;
                },
              })}
            />
            
            {/* Password strength indicator */}
            {password && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Password strength: {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${
                      passwordStrength.label === 'Weak'
                        ? 'bg-red-500'
                        : passwordStrength.label === 'Medium'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${(passwordStrength.strength / 6) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <Input
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
              error={errors.confirmPassword?.message}
              showPasswordToggle
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === watch('password') || 'The passwords do not match',
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
              Sign Up
            </Button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
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

export default RegisterForm;