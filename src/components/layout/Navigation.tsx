'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface NavigationProps {
  mobile?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ mobile = false }) => {
  const pathname = usePathname();
  const { user } = useAuth();

  // Navigation items based on authentication status
  const navItems = [
    { name: 'Home', href: '/', protected: false },
    { name: 'Dashboard', href: '/dashboard', protected: true },
  ];

  // Filter items based on auth status
  const filteredItems = navItems.filter(item => !item.protected || (item.protected && user));

  // Styles for navigation items
  const baseStyles = 'block px-3 py-2 rounded-md text-base font-medium';
  const activeStyles = 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white';
  const inactiveStyles = 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700';

  // Mobile specific styles
  const mobileBaseStyles = 'block px-4 py-2 text-base font-medium';
  const mobileActiveStyles = 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white';
  const mobileInactiveStyles = 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700';

  return (
    <nav className={mobile ? 'space-y-1 px-2' : 'flex space-x-4'}>
      {filteredItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            mobile ? mobileBaseStyles : baseStyles,
            pathname === item.href
              ? mobile ? mobileActiveStyles : activeStyles
              : mobile ? mobileInactiveStyles : inactiveStyles
          )}
          aria-current={pathname === item.href ? 'page' : undefined}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;