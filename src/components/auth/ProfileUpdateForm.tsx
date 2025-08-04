'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UpdateProfileFormData, UpdatePasswordFormData } from '@/types/auth';
import { isValidEmail, isStrongPassword, getPasswordStrength } from '@/lib/utils';

const ProfileUpdateForm: React.FC = () => {
  const { user, updateEmail, updatePassword, sendVerificationEmail, loading, error, clearError } = useAuth();
  const [activeTab, setActiveTab] = useState<'email' | 'password'>('email');
  const [emailUpdateSuccess, setEmailUpdateSuccess] = useState(false);
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);
  const [verificationEmailSent, setVerificationEmailSent] = useState(false);
  
  // Email update form
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
    reset: resetEmailForm,
  } = useForm<UpdateProfileFormData>({
    defaultValues: {
      email: user?.email || '',
      currentPassword: '',
    },
  });

  // Password update form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch: watchPassword,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<UpdatePasswordFormData>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  // Watch password for strength indicator
  const newPassword = watchPassword('newPassword');
  const passwordStrength = getPasswordStrength(newPassword || '');

  // Handle email update
  const onEmailUpdate = async (data: UpdateProfileFormData) => {
    clearError();
    setEmailUpdateSuccess(false);
    
    try {
      await updateEmail(data.email, data.currentPassword);
      setEmailUpdateSuccess(true);
      resetEmailForm({ email: data.email, currentPassword: '' });
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  // Handle password update
  const onPasswordUpdate = async (data: UpdatePasswordFormData) => {
    clearError();
    setPasswordUpdateSuccess(false);
    
    try {
      await updatePassword(data.currentPassword, data.newPassword);
      setPasswordUpdateSuccess(true);
      resetPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  // Handle sending verification email
  const handleSendVerificationEmail = async () => {
    clearError();
    setVerificationEmailSent(false);
    
    try {
      await sendVerificationEmail();
      setVerificationEmailSent(true);
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Profile Settings
        </h2>
        
        {/* Email verification status */}
        {user && !user.emailVerified && (
          <div className="mb-6">
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-md text-sm mb-2">
              Your email is not verified. Please verify your email to access all features.
            </div>
            <Button
              onClick={handleSendVerificationEmail}
              variant="outline"
              size="sm"
              isLoading={loading && !error && !emailUpdateSuccess && !passwordUpdateSuccess}
              disabled={verificationEmailSent}
              className="w-full"
            >
              {verificationEmailSent ? 'Verification Email Sent' : 'Send Verification Email'}
            </Button>
          </div>
        )}
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === 'email'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('email')}
          >
            Update Email
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === 'password'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('password')}
          >
            Update Password
          </button>
        </div>
        
        {/* Success messages */}
        {emailUpdateSuccess && activeTab === 'email' && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md text-sm">
            Email updated successfully!
          </div>
        )}
        
        {passwordUpdateSuccess && activeTab === 'password' && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md text-sm">
            Password updated successfully!
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-md text-sm">
            {error}
          </div>
        )}
        
        {/* Email update form */}
        {activeTab === 'email' && (
          <form onSubmit={handleSubmitEmail(onEmailUpdate)} className="space-y-6">
            <div>
              <Input
                id="email"
                type="email"
                label="New Email Address"
                placeholder="you@example.com"
                icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
                error={emailErrors.email?.message}
                {...registerEmail('email', {
                  required: 'Email is required',
                  validate: (value) => isValidEmail(value) || 'Please enter a valid email address',
                })}
              />
            </div>
            
            <div>
              <Input
                id="currentPassword"
                type="password"
                label="Current Password"
                placeholder="••••••••"
                icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
                error={emailErrors.currentPassword?.message}
                showPasswordToggle
                {...registerEmail('currentPassword', {
                  required: 'Current password is required to update email',
                })}
              />
            </div>
            
            <div>
              <Button
                type="submit"
                fullWidth
                isLoading={loading && !passwordUpdateSuccess}
                className="bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
              >
                Update Email
              </Button>
            </div>
          </form>
        )}
        
        {/* Password update form */}
        {activeTab === 'password' && (
          <form onSubmit={handleSubmitPassword(onPasswordUpdate)} className="space-y-6">
            <div>
              <Input
                id="currentPassword"
                type="password"
                label="Current Password"
                placeholder="••••••••"
                icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
                error={passwordErrors.currentPassword?.message}
                showPasswordToggle
                {...registerPassword('currentPassword', {
                  required: 'Current password is required',
                })}
              />
            </div>
            
            <div>
              <Input
                id="newPassword"
                type="password"
                label="New Password"
                placeholder="••••••••"
                icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
                error={passwordErrors.newPassword?.message}
                showPasswordToggle
                {...registerPassword('newPassword', {
                  required: 'New password is required',
                  validate: (value) => {
                    const result = isStrongPassword(value);
                    return result.isValid || result.message;
                  },
                })}
              />
              
              {/* Password strength indicator */}
              {newPassword && (
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
                id="confirmNewPassword"
                type="password"
                label="Confirm New Password"
                placeholder="••••••••"
                icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
                error={passwordErrors.confirmNewPassword?.message}
                showPasswordToggle
                {...registerPassword('confirmNewPassword', {
                  required: 'Please confirm your new password',
                  validate: (value) =>
                    value === watchPassword('newPassword') || 'The passwords do not match',
                })}
              />
            </div>
            
            <div>
              <Button
                type="submit"
                fullWidth
                isLoading={loading && !emailUpdateSuccess}
                className="bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
              >
                Update Password
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfileUpdateForm;