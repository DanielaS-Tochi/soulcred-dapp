import React, { useState } from 'react';
import SoulCredLogo from './SoulCredLogo';
import AnimatedLogo from './AnimatedLogo';

const LogoShowcase: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState<'icon' | 'full' | 'text'>('icon');
  const [selectedSize, setSelectedSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          SoulCred Logo Showcase
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Professional logo designs for the SoulCred platform
        </p>
      </div>

      {/* Animated Hero Logo */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-12 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Animated Hero Logo
        </h2>
        <div className="flex justify-center">
          <AnimatedLogo size="xl" animate={true} />
        </div>
      </div>

      {/* Logo Variants */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Logo Variants
        </h2>
        
        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Variant:</span>
            {(['icon', 'full', 'text'] as const).map((variant) => (
              <button
                key={variant}
                onClick={() => setSelectedVariant(variant)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  selectedVariant === variant
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Size:</span>
            {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  selectedSize === size
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {size.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Logo Display */}
        <div className="flex justify-center items-center min-h-32 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <SoulCredLogo variant={selectedVariant} size={selectedSize} />
        </div>
      </div>

      {/* Usage Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Header Example */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Header Usage
          </h3>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <SoulCredLogo variant="icon" size="md" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">SoulCred</span>
            </div>
          </div>
        </div>

        {/* Card Example */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Card Usage
          </h3>
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 text-center">
            <SoulCredLogo variant="icon" size="lg" className="mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 dark:text-white">Welcome to SoulCred</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Decentralized Credentials</p>
          </div>
        </div>

        {/* Button Example */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Button Usage
          </h3>
          <div className="space-y-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
              <SoulCredLogo variant="icon" size="sm" />
              <span>Connect with SoulCred</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <SoulCredLogo variant="icon" size="sm" />
              <span>Powered by SoulCred</span>
            </button>
          </div>
        </div>

        {/* Text Logo Example */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Text Logo Usage
          </h3>
          <div className="space-y-4">
            <div className="text-center">
              <SoulCredLogo variant="text" size="xl" />
            </div>
            <div className="text-center">
              <SoulCredLogo variant="text" size="lg" />
            </div>
            <div className="text-center">
              <SoulCredLogo variant="text" size="md" />
            </div>
          </div>
        </div>
      </div>

      {/* Color Variations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Background Variations
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Light Background */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
            <SoulCredLogo variant="icon" size="lg" className="mx-auto mb-2" />
            <p className="text-xs text-gray-600">Light</p>
          </div>
          
          {/* Dark Background */}
          <div className="bg-gray-900 p-6 rounded-lg text-center">
            <SoulCredLogo variant="icon" size="lg" className="mx-auto mb-2" />
            <p className="text-xs text-gray-300">Dark</p>
          </div>
          
          {/* Colored Background */}
          <div className="bg-purple-600 p-6 rounded-lg text-center">
            <SoulCredLogo variant="icon" size="lg" className="mx-auto mb-2" />
            <p className="text-xs text-white">Purple</p>
          </div>
          
          {/* Gradient Background */}
          <div className="bg-gradient-to-br from-blue-500 to-teal-500 p-6 rounded-lg text-center">
            <SoulCredLogo variant="icon" size="lg" className="mx-auto mb-2" />
            <p className="text-xs text-white">Gradient</p>
          </div>
        </div>
      </div>

      {/* Implementation Code */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Implementation
        </h2>
        <div className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
          <pre className="text-green-400 text-sm">
{`// Import the logo component
import SoulCredLogo from './components/ui/SoulCredLogo';

// Basic usage
<SoulCredLogo variant="icon" size="md" />

// Full logo with text
<SoulCredLogo variant="full" size="lg" />

// Text only
<SoulCredLogo variant="text" size="xl" />

// Animated version
import AnimatedLogo from './components/ui/AnimatedLogo';
<AnimatedLogo size="xl" animate={true} />`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default LogoShowcase;