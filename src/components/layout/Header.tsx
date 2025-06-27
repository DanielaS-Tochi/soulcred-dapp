import React from 'react';
import { User, Settings, Moon, Sun, LogOut } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import SoulCredLogo from '../ui/SoulCredLogo';
import LanguageSelector from '../ui/LanguageSelector';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const { isAuthenticated, user, disconnectWallet } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' },
    { id: 'community', label: 'Community', icon: '👥' },
    { id: 'mint', label: 'Mint Credential', icon: '⚡' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <SoulCredLogo variant="icon" size="md" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">SoulCred</span>
          </div>

          {/* Navigation - Hidden on mobile */}
          {isAuthenticated && (
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  data-nav={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                    currentView === item.id
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  aria-label={`Navigate to ${item.label}`}
                >
                  <span className="mr-2" aria-hidden="true">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <LanguageSelector />

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Wallet Connection */}
            {!isAuthenticated ? (
              <div className="flex items-center">
                <ConnectButton.Custom>
                  {({ openConnectModal, connectModalOpen }) => (
                    <button
                      onClick={openConnectModal}
                      disabled={connectModalOpen}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                      aria-label="Connect wallet to SoulCred"
                    >
                      <span className="hidden sm:inline">
                        {connectModalOpen ? 'Connecting...' : 'Connect Wallet'}
                      </span>
                      <span className="sm:hidden">Connect</span>
                    </button>
                  )}
                </ConnectButton.Custom>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {/* User Profile */}
                <div className="flex items-center space-x-2">
                  <img
                    src={user?.avatar}
                    alt={`${user?.name} profile picture`}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.name}
                    </p>
                    <ConnectButton.Custom>
                      {({ account }) => (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {account?.displayName}
                        </p>
                      )}
                    </ConnectButton.Custom>
                  </div>
                </div>

                {/* Profile/Settings */}
                <button
                  onClick={() => onViewChange('profile')}
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  aria-label="Open profile settings"
                >
                  <Settings size={16} />
                </button>

                {/* Logout Button */}
                <button
                  onClick={disconnectWallet}
                  className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  aria-label="Disconnect wallet and logout"
                  title="Disconnect Wallet"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isAuthenticated && (
          <div className="md:hidden pb-3 pt-2">
            <div className="flex space-x-1 overflow-x-auto">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  data-nav={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                    currentView === item.id
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  aria-label={`Navigate to ${item.label}`}
                >
                  <span className="mr-1" aria-hidden="true">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;