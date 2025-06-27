import React, { useState, useEffect } from 'react';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  className?: string;
  animate?: boolean;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ 
  size = 'lg', 
  className = '',
  animate = true 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(animate);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
    xxl: 'w-40 h-40',
  };

  // Stop animation after 10 seconds
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setShouldAnimate(false);
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [animate]);

  return (
    <div
      className={`${sizeClasses[size]} ${className} cursor-pointer`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Enhanced Gradients */}
          <linearGradient id="main-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6">
              <animate 
                attributeName="stop-color" 
                values="#8b5cf6;#3b82f6;#06b6d4;#8b5cf6" 
                dur="4s" 
                repeatCount={shouldAnimate ? "indefinite" : "0"}
                begin={shouldAnimate ? "0s" : "never"}
              />
            </stop>
            <stop offset="50%" stopColor="#3b82f6">
              <animate 
                attributeName="stop-color" 
                values="#3b82f6;#06b6d4;#8b5cf6;#3b82f6" 
                dur="4s" 
                repeatCount={shouldAnimate ? "indefinite" : "0"}
                begin={shouldAnimate ? "0s" : "never"}
              />
            </stop>
            <stop offset="100%" stopColor="#06b6d4">
              <animate 
                attributeName="stop-color" 
                values="#06b6d4;#8b5cf6;#3b82f6;#06b6d4" 
                dur="4s" 
                repeatCount={shouldAnimate ? "indefinite" : "0"}
                begin={shouldAnimate ? "0s" : "never"}
              />
            </stop>
          </linearGradient>
          
          <radialGradient id="inner-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
            <stop offset="70%" stopColor="rgba(255,255,255,0.5)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
          </radialGradient>
          
          {/* Enhanced Glow Filter */}
          <filter id="enhanced-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Pulse Animation */}
          <filter id="pulse-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
            <animate 
              attributeName="stdDeviation" 
              values="2;6;2" 
              dur="2s" 
              repeatCount={isHovered && shouldAnimate ? "indefinite" : "0"}
              begin={isHovered && shouldAnimate ? "0s" : "never"}
            />
          </filter>

          {/* Text Shadow for better contrast */}
          <filter id="textShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.8"/>
          </filter>
        </defs>
        
        {/* Outer Ring */}
        <circle
          cx="60"
          cy="60"
          r="55"
          fill="url(#main-gradient)"
          filter="url(#enhanced-glow)"
          transform-origin="60 60"
        >
          {shouldAnimate && (
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              from="0 60 60"
              to="360 60 60"
              dur="20s"
              repeatCount="indefinite"
            />
          )}
        </circle>
        
        {/* Inner Circle */}
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="url(#inner-glow)"
          opacity="0.9"
        />
        
        {/* Central Credential Badge */}
        <g transform="translate(60, 60)" filter={isHovered ? "url(#pulse-glow)" : "none"}>
          {/* Badge Shape */}
          <path
            d="M0 -25 L18 -12 L25 0 L18 12 L0 25 L-18 12 L-25 0 L-18 -12 Z"
            fill="rgba(255,255,255,0.98)"
            stroke="rgba(139, 92, 246, 0.9)"
            strokeWidth="3"
          >
            {shouldAnimate && (
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from="0"
                to="-360"
                dur="15s"
                repeatCount="indefinite"
              />
            )}
          </path>
          
          {/* Inner Soul Symbol */}
          <circle
            cx="0"
            cy="0"
            r="15"
            fill="none"
            stroke="rgba(59, 130, 246, 0.8)"
            strokeWidth="3"
            strokeDasharray="4 2"
          >
            {shouldAnimate && (
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from="0"
                to="360"
                dur="8s"
                repeatCount="indefinite"
              />
            )}
          </circle>
          
          {/* Connection Network */}
          <g stroke="rgba(6, 182, 212, 0.7)" strokeWidth="2.5" fill="none">
            <path d="M-10 -10 L10 10 M10 -10 L-10 10" opacity="0.8">
              {shouldAnimate && (
                <animate
                  attributeName="opacity"
                  values="0.4;0.9;0.4"
                  dur="3s"
                  repeatCount="indefinite"
                />
              )}
            </path>
          </g>
          
          {/* Achievement Dots */}
          <g fill="rgba(255,255,255,0.95)">
            <circle cx="0" cy="-20" r="3">
              {shouldAnimate && (
                <animate
                  attributeName="r"
                  values="3;4;3"
                  dur="2s"
                  repeatCount="indefinite"
                  begin="0s"
                />
              )}
            </circle>
            <circle cx="14" cy="-14" r="3">
              {shouldAnimate && (
                <animate
                  attributeName="r"
                  values="3;4;3"
                  dur="2s"
                  repeatCount="indefinite"
                  begin="0.5s"
                />
              )}
            </circle>
            <circle cx="20" cy="0" r="3">
              {shouldAnimate && (
                <animate
                  attributeName="r"
                  values="3;4;3"
                  dur="2s"
                  repeatCount="indefinite"
                  begin="1s"
                />
              )}
            </circle>
            <circle cx="14" cy="14" r="3">
              {shouldAnimate && (
                <animate
                  attributeName="r"
                  values="3;4;3"
                  dur="2s"
                  repeatCount="indefinite"
                  begin="1.5s"
                />
              )}
            </circle>
          </g>
        </g>
        
        {/* Enhanced SC Text with better contrast */}
        <text
          x="60"
          y="74"
          textAnchor="middle"
          className="fill-white font-black"
          style={{ 
            fontSize: '26px', 
            fontFamily: 'system-ui, sans-serif',
            fontWeight: '900'
          }}
          filter="url(#textShadow)"
        >
          SC
        </text>
        
        {/* Additional text outline for maximum contrast */}
        <text
          x="60"
          y="74"
          textAnchor="middle"
          className="fill-none stroke-black"
          style={{ 
            fontSize: '26px', 
            fontFamily: 'system-ui, sans-serif',
            fontWeight: '900',
            strokeWidth: '1.5px'
          }}
        >
          SC
        </text>
        
        {/* Orbital Elements */}
        {shouldAnimate && (
          <g>
            <circle cx="60" cy="60" r="35" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="2 4">
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from="0 60 60"
                to="360 60 60"
                dur="12s"
                repeatCount="indefinite"
              />
            </circle>
            
            <circle cx="95" cy="60" r="3.5" fill="rgba(255,255,255,0.9)">
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from="0 60 60"
                to="360 60 60"
                dur="12s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        )}
      </svg>
    </div>
  );
};

export default AnimatedLogo;