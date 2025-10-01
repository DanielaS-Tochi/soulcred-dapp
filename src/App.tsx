import { useState, lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './components/ui/Toast';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import Header from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import WelcomeScreen from './components/WelcomeScreen';
import AccessibilityControls from './components/ui/AccessibilityControls';
import KeyboardNavigation from './components/ui/KeyboardNavigation';
import ScreenReaderAnnouncements from './components/ui/ScreenReaderAnnouncements';
import { LoadingSpinner } from './components/ui/LoadingStates';

const EnhancedDashboard = lazy(() => import('./components/views/EnhancedDashboard'));
const Profile = lazy(() => import('./components/views/Profile'));
const EnhancedMintCredential = lazy(() => import('./components/views/EnhancedMintCredential'));
const Community = lazy(() => import('./components/views/Community'));
const Achievements = lazy(() => import('./components/views/Achievements'));

type View = 'dashboard' | 'profile' | 'mint' | 'community' | 'achievements';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const handleViewChange = (view: string) => {
    setCurrentView(view as View);
    
    // Announce navigation to screen readers
    const viewNames = {
      dashboard: 'Dashboard',
      profile: 'Profile',
      mint: 'Mint Credential',
      community: 'Community',
      achievements: 'Achievements'
    };
    
    const viewName = viewNames[view as View] || view;
    window.dispatchEvent(new CustomEvent('soulcred:announce', {
      detail: { message: `Navigated to ${viewName}`, priority: 'polite' }
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <WelcomeScreen />
        <Footer />
        <ScreenReaderAnnouncements />
        <KeyboardNavigation />
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <EnhancedDashboard />;
      case 'profile':
        return <Profile />;
      case 'mint':
        return <EnhancedMintCredential />;
      case 'community':
        return <Community />;
      case 'achievements':
        return <Achievements />;
      default:
        return <EnhancedDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex flex-col">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header currentView={currentView} onViewChange={handleViewChange} />
      <main id="main-content" className="flex-1" role="main" tabIndex={-1}>
        <ErrorBoundary>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <LoadingSpinner size="lg" />
            </div>
          }>
            {renderCurrentView()}
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <AccessibilityControls />
      <ScreenReaderAnnouncements />
      <KeyboardNavigation />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;