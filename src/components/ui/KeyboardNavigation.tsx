import React, { useEffect } from 'react';

const KeyboardNavigation: React.FC = () => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip navigation if user is typing in an input
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case 'h':
          // Navigate to home/dashboard
          if (event.altKey) {
            event.preventDefault();
            const dashboardButton = document.querySelector('[data-nav="dashboard"]') as HTMLElement;
            dashboardButton?.click();
          }
          break;
        
        case 'c':
          // Navigate to community
          if (event.altKey) {
            event.preventDefault();
            const communityButton = document.querySelector('[data-nav="community"]') as HTMLElement;
            communityButton?.click();
          }
          break;
        
        case 'm':
          // Navigate to mint credential
          if (event.altKey) {
            event.preventDefault();
            const mintButton = document.querySelector('[data-nav="mint"]') as HTMLElement;
            mintButton?.click();
          }
          break;
        
        case 'a':
          // Navigate to achievements
          if (event.altKey) {
            event.preventDefault();
            const achievementsButton = document.querySelector('[data-nav="achievements"]') as HTMLElement;
            achievementsButton?.click();
          }
          break;
        
        case '/':
          // Focus search
          event.preventDefault();
          const searchInput = document.querySelector('input[type="text"][placeholder*="search" i]') as HTMLElement;
          searchInput?.focus();
          break;
        
        case 'Escape':
          // Close modals or clear focus
          const activeElement = document.activeElement as HTMLElement;
          activeElement?.blur();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return null; // This component only handles keyboard events
};

export default KeyboardNavigation;