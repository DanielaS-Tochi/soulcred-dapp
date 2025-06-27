import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  success,
  hint,
  leftIcon,
  rightIcon,
  variant = 'default',
  className = '',
  type = 'text',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const getVariantClasses = () => {
    switch (variant) {
      case 'filled':
        return 'bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white dark:focus:bg-gray-800 focus:border-purple-500';
      case 'outlined':
        return 'bg-transparent border-2 border-gray-300 dark:border-gray-600 focus:border-purple-500';
      default:
        return 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:border-purple-500';
    }
  };

  const getStatusClasses = () => {
    if (error) return 'border-red-500 focus:border-red-500 focus:ring-red-500';
    if (success) return 'border-green-500 focus:border-green-500 focus:ring-green-500';
    return '';
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          className={`
            w-full px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon || isPassword ? 'pr-10' : ''}
            ${getVariantClasses()}
            ${getStatusClasses()}
            ${className}
          `}
          {...props}
        />
        
        {(rightIcon || isPassword) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isPassword ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            ) : (
              rightIcon
            )}
          </div>
        )}
      </div>
      
      {(error || success || hint) && (
        <div className="flex items-start space-x-1 text-sm">
          {error && (
            <>
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-red-600 dark:text-red-400">{error}</span>
            </>
          )}
          {success && (
            <>
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-green-600 dark:text-green-400">{success}</span>
            </>
          )}
          {hint && !error && !success && (
            <>
              <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <span className="text-gray-500 dark:text-gray-400">{hint}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  variant?: 'default' | 'filled' | 'outlined';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  success,
  hint,
  variant = 'default',
  className = '',
  ...props
}, ref) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'filled':
        return 'bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white dark:focus:bg-gray-800 focus:border-purple-500';
      case 'outlined':
        return 'bg-transparent border-2 border-gray-300 dark:border-gray-600 focus:border-purple-500';
      default:
        return 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:border-purple-500';
    }
  };

  const getStatusClasses = () => {
    if (error) return 'border-red-500 focus:border-red-500 focus:ring-red-500';
    if (success) return 'border-green-500 focus:border-green-500 focus:ring-green-500';
    return '';
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        className={`
          w-full px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 resize-vertical
          ${getVariantClasses()}
          ${getStatusClasses()}
          ${className}
        `}
        {...props}
      />
      
      {(error || success || hint) && (
        <div className="flex items-start space-x-1 text-sm">
          {error && (
            <>
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-red-600 dark:text-red-400">{error}</span>
            </>
          )}
          {success && (
            <>
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-green-600 dark:text-green-400">{success}</span>
            </>
          )}
          {hint && !error && !success && (
            <>
              <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <span className="text-gray-500 dark:text-gray-400">{hint}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
  variant?: 'default' | 'filled' | 'outlined';
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  success,
  hint,
  options,
  placeholder,
  variant = 'default',
  className = '',
  ...props
}, ref) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'filled':
        return 'bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white dark:focus:bg-gray-800 focus:border-purple-500';
      case 'outlined':
        return 'bg-transparent border-2 border-gray-300 dark:border-gray-600 focus:border-purple-500';
      default:
        return 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:border-purple-500';
    }
  };

  const getStatusClasses = () => {
    if (error) return 'border-red-500 focus:border-red-500 focus:ring-red-500';
    if (success) return 'border-green-500 focus:border-green-500 focus:ring-green-500';
    return '';
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        ref={ref}
        className={`
          w-full px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
          ${getVariantClasses()}
          ${getStatusClasses()}
          ${className}
        `}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {(error || success || hint) && (
        <div className="flex items-start space-x-1 text-sm">
          {error && (
            <>
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-red-600 dark:text-red-400">{error}</span>
            </>
          )}
          {success && (
            <>
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-green-600 dark:text-green-400">{success}</span>
            </>
          )}
          {hint && !error && !success && (
            <>
              <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <span className="text-gray-500 dark:text-gray-400">{hint}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
});

Select.displayName = 'Select';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  description,
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="space-y-1">
      <div className="flex items-start space-x-3">
        <input
          ref={ref}
          type="checkbox"
          className={`
            w-4 h-4 text-purple-600 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500 focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        
        {(label || description) && (
          <div className="flex-1">
            {label && (
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
                {props.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
      
      {error && (
        <div className="flex items-start space-x-1 text-sm">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <span className="text-red-600 dark:text-red-400">{error}</span>
        </div>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';