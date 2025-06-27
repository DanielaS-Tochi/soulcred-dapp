import React, { useEffect, useState } from 'react';

interface Announcement {
  id: string;
  message: string;
  priority: 'polite' | 'assertive';
}

const ScreenReaderAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    // Listen for custom announcement events
    const handleAnnouncement = (event: CustomEvent) => {
      const { message, priority = 'polite' } = event.detail;
      const id = Date.now().toString();
      
      setAnnouncements(prev => [...prev, { id, message, priority }]);
      
      // Remove announcement after it's been read
      setTimeout(() => {
        setAnnouncements(prev => prev.filter(a => a.id !== id));
      }, 3000);
    };

    window.addEventListener('soulcred:announce', handleAnnouncement as EventListener);
    
    return () => {
      window.removeEventListener('soulcred:announce', handleAnnouncement as EventListener);
    };
  }, []);

  return (
    <div className="sr-only">
      {announcements.map((announcement) => (
        <div
          key={announcement.id}
          aria-live={announcement.priority}
          aria-atomic="true"
        >
          {announcement.message}
        </div>
      ))}
    </div>
  );
};

// Helper function to trigger announcements
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  window.dispatchEvent(new CustomEvent('soulcred:announce', {
    detail: { message, priority }
  }));
};

export default ScreenReaderAnnouncements;