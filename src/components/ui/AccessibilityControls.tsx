import React, { useState } from 'react';
import { Type, Eye, Keyboard, Volume2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const AccessibilityControls: React.FC = () => {
  const { theme } = useTheme();
  const [fontSize, setFontSize] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    const root = document.documentElement;
    
    switch (size) {
      case 'small':
        root.style.fontSize = '14px';
        break;
      case 'large':
        root.style.fontSize = '18px';
        break;
      case 'xl':
        root.style.fontSize = '20px';
        break;
      default:
        root.style.fontSize = '16px';
    }
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    document.documentElement.classList.toggle('high-contrast', !highContrast);
  };

  const toggleReducedMotion = () => {
    setReducedMotion(!reducedMotion);
    document.documentElement.classList.toggle('reduce-motion', !reducedMotion);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <Eye size={16} />
          <span>Accessibility</span>
        </h3>
        
        {/* Font Size */}
        <div>
          <label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">
            Font Size
          </label>
          <div className="flex space-x-1">
            {['small', 'normal', 'large', 'xl'].map((size) => (
              <button
                key={size}
                onClick={() => handleFontSizeChange(size)}
                className={`px-2 py-1 text-xs rounded ${
                  fontSize === size
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {size === 'xl' ? 'XL' : size.charAt(0).toUpperCase() + size.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* High Contrast */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600 dark:text-gray-400">High Contrast</span>
          <button
            onClick={toggleHighContrast}
            className={`w-8 h-4 rounded-full transition-colors ${
              highContrast ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <div
              className={`w-3 h-3 bg-white rounded-full transition-transform ${
                highContrast ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Reduced Motion */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600 dark:text-gray-400">Reduce Motion</span>
          <button
            onClick={toggleReducedMotion}
            className={`w-8 h-4 rounded-full transition-colors ${
              reducedMotion ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <div
              className={`w-3 h-3 bg-white rounded-full transition-transform ${
                reducedMotion ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityControls;