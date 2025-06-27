import React from 'react';

interface SoulCredLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  variant?: 'icon' | 'full' | 'text';
  className?: string;
}

const SoulCredLogo: React.FC<SoulCredLogoProps> = ({ 
  size = 'md', 
  variant = 'icon',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    xxl: 'w-32 h-32',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
    xxl: 'text-4xl',
  };

  // SVG Icon Component
  const IconSVG = () => (
    <svg
      viewBox="0 0 100 100"
      className={`${sizeClasses[size]} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Circle with Gradient */}
      <defs>
        <linearGradient id="soulcred-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="inner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8" />
        </linearGradient>
        
        {/* Enhanced Glow Effect */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Text Shadow for better contrast */}
        <filter id="textShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.8"/>
        </filter>
      </defs>
      
      {/* Outer Circle */}
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="url(#soulcred-gradient)"
        filter="url(#glow)"
      />
      
      {/* Inner Design - Soul/Credential Symbol */}
      {/* Central Diamond (representing a credential/badge) */}
      <path
        d="M50 20 L70 35 L65 50 L70 65 L50 80 L30 65 L35 50 L30 35 Z"
        fill="url(#inner-gradient)"
        stroke="rgba(255,255,255,0.9)"
        strokeWidth="2.5"
      />
      
      {/* Inner Soul Symbol */}
      <circle
        cx="50"
        cy="50"
        r="12"
        fill="none"
        stroke="rgba(139, 92, 246, 0.9)"
        strokeWidth="3"
      />
      
      {/* Connection Lines (representing blockchain/network) */}
      <path
        d="M38 50 L50 38 L62 50 L50 62 Z"
        fill="none"
        stroke="rgba(59, 130, 246, 0.7)"
        strokeWidth="2.5"
      />
      
      {/* Small dots representing achievements */}
      <circle cx="50" cy="30" r="3" fill="rgba(255,255,255,0.95)" />
      <circle cx="70" cy="50" r="3" fill="rgba(255,255,255,0.95)" />
      <circle cx="50" cy="70" r="3" fill="rgba(255,255,255,0.95)" />
      <circle cx="30" cy="50" r="3" fill="rgba(255,255,255,0.95)" />
      
      {/* Enhanced SC Letters with better contrast */}
      <text
        x="50"
        y="58"
        textAnchor="middle"
        className="fill-white font-black"
        style={{ 
          fontSize: '20px', 
          fontFamily: 'system-ui, sans-serif',
          fontWeight: '900'
        }}
        filter="url(#textShadow)"
      >
        SC
      </text>
      
      {/* Additional text outline for maximum contrast */}
      <text
        x="50"
        y="58"
        textAnchor="middle"
        className="fill-none stroke-black"
        style={{ 
          fontSize: '20px', 
          fontFamily: 'system-ui, sans-serif',
          fontWeight: '900',
          strokeWidth: '1px'
        }}
      >
        SC
      </text>
    </svg>
  );

  // Enhanced Simple Icon Version (for smaller sizes)
  const SimpleIcon = () => (
    <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-purple-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg border-2 border-white/20`}>
      <span 
        className="text-white font-black"
        style={{ 
          textShadow: '0 2px 4px rgba(0,0,0,0.6), 0 1px 2px rgba(0,0,0,0.8)',
          fontSize: size === 'sm' ? '0.75rem' : size === 'md' ? '1rem' : '1.25rem'
        }}
      >
        SC
      </span>
    </div>
  );

  if (variant === 'icon') {
    return size === 'sm' ? <SimpleIcon /> : <IconSVG />;
  }

  if (variant === 'text') {
    return (
      <span className={`${textSizes[size]} font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent ${className}`}>
        SoulCred
      </span>
    );
  }

  // Full logo with icon and text
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {size === 'sm' ? <SimpleIcon /> : <IconSVG />}
      <span className={`${textSizes[size]} font-bold text-gray-900 dark:text-white`}>
        SoulCred
      </span>
    </div>
  );
};

export default SoulCredLogo;