import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  illustration?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  illustration,
  className = '',
}) => {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      {/* Illustration or Icon */}
      <div className="mb-6">
        {illustration ? (
          <img
            src={illustration}
            alt=""
            className="w-32 h-32 mx-auto opacity-50"
          />
        ) : Icon ? (
          <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <Icon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
        ) : (
          <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        
        {description && (
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {description}
          </p>
        )}

        {/* Action */}
        {action && (
          <button
            onClick={action.onClick}
            className={`
              inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900
              ${action.variant === 'secondary'
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500'
                : 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500'
              }
            `}
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
};

interface NoResultsProps {
  searchQuery?: string;
  onClearSearch?: () => void;
  suggestions?: string[];
}

export const NoResults: React.FC<NoResultsProps> = ({
  searchQuery,
  onClearSearch,
  suggestions = [],
}) => {
  return (
    <EmptyState
      title={searchQuery ? `No results for "${searchQuery}"` : 'No results found'}
      description={
        searchQuery
          ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
          : 'There are no items to display at the moment.'
      }
      action={
        onClearSearch
          ? {
              label: 'Clear search',
              onClick: onClearSearch,
              variant: 'secondary',
            }
          : undefined
      }
    >
      {suggestions.length > 0 && (
        <div className="mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Try searching for:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </EmptyState>
  );
};