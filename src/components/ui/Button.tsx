import React, { forwardRef } from 'react';
import { Loader } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}, ref) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 text-white shadow-sm disabled:bg-purple-400';
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 text-white shadow-sm disabled:bg-gray-400';
      case 'outline':
        return 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-purple-500 text-gray-700 dark:text-gray-300 shadow-sm';
      case 'ghost':
        return 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-purple-500 text-gray-700 dark:text-gray-300';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white shadow-sm disabled:bg-red-400';
      default:
        return 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 text-white shadow-sm disabled:bg-purple-400';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-6 py-3 text-base';
      case 'xl':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-60
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <Loader className="w-4 h-4 animate-spin mr-2" aria-hidden="true" />
      )}
      
      {!loading && leftIcon && (
        <span className="mr-2" aria-hidden="true">
          {leftIcon}
        </span>
      )}
      
      <span>{children}</span>
      
      {!loading && rightIcon && (
        <span className="ml-2" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon: React.ReactNode;
  label: string; // For accessibility
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
  variant = 'ghost',
  size = 'md',
  loading = false,
  icon,
  label,
  className = '',
  disabled,
  ...props
}, ref) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 text-white shadow-sm disabled:bg-purple-400';
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 text-white shadow-sm disabled:bg-gray-400';
      case 'outline':
        return 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-purple-500 text-gray-700 dark:text-gray-300 shadow-sm';
      case 'ghost':
        return 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-purple-500 text-gray-700 dark:text-gray-300';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white shadow-sm disabled:bg-red-400';
      default:
        return 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-purple-500 text-gray-700 dark:text-gray-300';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'p-1.5';
      case 'md':
        return 'p-2';
      case 'lg':
        return 'p-3';
      default:
        return 'p-2';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'md':
        return 'w-5 h-5';
      case 'lg':
        return 'w-6 h-6';
      default:
        return 'w-5 h-5';
    }
  };

  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      aria-label={label}
      title={label}
      className={`
        inline-flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-60
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <Loader className={`animate-spin ${getIconSize()}`} aria-hidden="true" />
      ) : (
        <span className={getIconSize()} aria-hidden="true">
          {icon}
        </span>
      )}
    </button>
  );
});

IconButton.displayName = 'IconButton';