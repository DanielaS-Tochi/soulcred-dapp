import React, { useState } from 'react';
import { Wallet, Award, Users, Shield, ArrowRight, AlertCircle, RefreshCw, ExternalLink, X, Download, CheckCircle } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getConfigurationStatus } from '../config/blockchain';
import AnimatedLogo from './ui/AnimatedLogo';
import UserProfileCard from './ui/UserProfileCard';
import { mockUsers } from '../data/mockData';

const WelcomeScreen: React.FC = () => {
  const { isConnecting, connectionError, clearError, connectWallet, isAuthenticated, user } = useAuth();
  const { theme } = useTheme();
  const [showWalletHelp, setShowWalletHelp] = useState(false);
  const [showConfigStatus, setShowConfigStatus] = useState(false);

  const configStatus = getConfigurationStatus();

  const features = [
    {
      icon: Award,
      title: 'Soulbound Credentials',
      description: 'Create permanent, non-transferable tokens that represent your learning achievements and skills.',
    },
    {
      icon: Users,
      title: 'Community Verification',
      description: 'Get your achievements endorsed by peers and build a reputation based on community trust.',
    },
    {
      icon: Shield,
      title: 'Decentralized & Secure',
      description: 'Your credentials are stored on-chain, ensuring they cannot be forged or lost.',
    },
  ];

  const walletOptions = [
    {
      name: 'MetaMask',
      description: 'Most popular Ethereum wallet',
      downloadUrl: 'https://metamask.io/download/',
      color: 'orange',
      icon: '🦊'
    },
    {
      name: 'Rainbow',
      description: 'Beautiful and user-friendly',
      downloadUrl: 'https://rainbow.me/',
      color: 'blue',
      icon: '🌈'
    },
    {
      name: 'Coinbase Wallet',
      description: 'From the trusted exchange',
      downloadUrl: 'https://www.coinbase.com/wallet',
      color: 'blue',
      icon: '🔵'
    },
    {
      name: 'WalletConnect',
      description: 'Connect any mobile wallet',
      downloadUrl: 'https://walletconnect.com/',
      color: 'purple',
      icon: '📱'
    }
  ];

  const handleMessage = (userId: string) => {
    console.log('Messaging user:', userId);
  };

  const handleConnect = (userId: string) => {
    console.log('Connecting with user:', userId);
  };

  const getColorClasses = (color: string) => {
    const colors = {
      orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 hover:bg-orange-200 dark:hover:bg-orange-900/50 border-orange-200 dark:border-orange-800',
      blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-900/50 border-blue-200 dark:border-blue-800',
      purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-900/50 border-purple-200 dark:border-purple-800'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  // Enhanced connect function with better UX
  const handleConnectWallet = () => {
    console.log('🚀 Connect wallet clicked');
    clearError();
    connectWallet();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <AnimatedLogo size="xxl" animate={true} />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to{' '}
            <span className="gradient-text">
              SoulCred
            </span>
          </h1>
          
          <p className="text-xl text-gray-700 dark:text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            The decentralized platform for issuing and managing Soulbound Tokens that represent 
            your learning achievements, skills, and community contributions.
          </p>

          {/* System Status */}
          <div className="mb-8">
            <button
              onClick={() => setShowConfigStatus(!showConfigStatus)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              <span>System Status</span>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </button>

            {showConfigStatus && (
              <div className="mt-4 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">System Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Blockchain RPC</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Wallet Support</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>IPFS Storage</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Security</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Environment: {configStatus.environment} | 
                    {configStatus.production ? ' Production' : ' Development'} |
                    All systems operational
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Connection Section */}
          <div className="flex flex-col items-center space-y-6 mb-8">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Connect Your Wallet
              </h3>
              <p className="text-gray-700 dark:text-gray-200 mb-6 text-sm leading-relaxed">
                Choose your preferred wallet to get started with SoulCred
              </p>
              
              {/* Enhanced Connect Button - Using our working solution */}
              <div className="space-y-4">
                {!isAuthenticated ? (
                  <button
                    onClick={handleConnectWallet}
                    disabled={isConnecting}
                    className="flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-purple-400 disabled:to-blue-400 text-white rounded-xl font-semibold text-lg transition-all transform hover:scale-105 disabled:scale-100 shadow-lg w-full disabled:cursor-not-allowed focus:ring-4 focus:ring-purple-500/50"
                  >
                    {isConnecting ? (
                      <>
                        <RefreshCw size={20} className="animate-spin" />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <Wallet size={20} />
                        <span>Connect Wallet</span>
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium shadow-md">
                      <CheckCircle size={20} />
                      <span>Connected: {user?.name}</span>
                    </div>
                    
                    {/* Account Management via RainbowKit */}
                    <ConnectButton.Custom>
                      {({ openAccountModal, openChainModal, chain }) => (
                        <div className="flex space-x-2">
                          <button
                            onClick={openAccountModal}
                            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            Manage Account
                          </button>
                          {chain && (
                            <button
                              onClick={openChainModal}
                              className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                              {chain.name}
                            </button>
                          )}
                        </div>
                      )}
                    </ConnectButton.Custom>
                  </div>
                )}
              </div>

              {/* New to Ethereum Wallets Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
                <div className="text-center mb-3">
                  <p className="text-sm text-gray-700 dark:text-gray-200 font-medium mb-2">
                    New to Ethereum wallets?
                  </p>
                  <button
                    onClick={() => setShowWalletHelp(!showWalletHelp)}
                    className="inline-flex items-center space-x-1 text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100 text-sm font-semibold transition-colors focus:ring-2 focus:ring-purple-500/50 rounded px-3 py-1 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  >
                    <span>Learn More</span>
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>

              {/* Connection Error */}
              {connectionError && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-red-800 dark:text-red-200 text-sm font-medium">{connectionError}</p>
                      <button
                        onClick={clearError}
                        className="mt-2 text-xs text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100 underline font-medium"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Wallet Help Modal */}
        {showWalletHelp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    What is an Ethereum Wallet?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                    Your gateway to the decentralized web
                  </p>
                </div>
                <button
                  onClick={() => setShowWalletHelp(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Explanation */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    🔐 Wallets are your digital identity
                  </h3>
                  <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                    Think of a wallet as your secure digital ID that lets you safely interact with blockchain applications. 
                    It stores your credentials and lets you prove ownership of your achievements.
                  </p>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 text-sm mb-1">
                      ✅ You own your data
                    </h4>
                    <p className="text-green-800 dark:text-green-200 text-xs">
                      No company can delete or modify your credentials
                    </p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100 text-sm mb-1">
                      🔒 Secure by design
                    </h4>
                    <p className="text-purple-800 dark:text-purple-200 text-xs">
                      Military-grade encryption protects your identity
                    </p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-900 dark:text-orange-100 text-sm mb-1">
                      🌍 Universal access
                    </h4>
                    <p className="text-orange-800 dark:text-orange-200 text-xs">
                      Use your credentials anywhere in Web3
                    </p>
                  </div>
                  <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4">
                    <h4 className="font-semibold text-teal-900 dark:text-teal-100 text-sm mb-1">
                      ⚡ Instant verification
                    </h4>
                    <p className="text-teal-800 dark:text-teal-200 text-xs">
                      Prove your skills instantly to anyone
                    </p>
                  </div>
                </div>

                {/* Wallet Options */}
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                    Choose Your Wallet
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {walletOptions.map((wallet) => (
                      <a
                        key={wallet.name}
                        href={wallet.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center space-x-3 p-4 rounded-xl border transition-all hover:scale-105 focus:ring-2 focus:ring-purple-500/50 ${getColorClasses(wallet.color)}`}
                      >
                        <span className="text-2xl">{wallet.icon}</span>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{wallet.name}</h4>
                          <p className="text-xs opacity-80">{wallet.description}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download size={16} />
                          <ExternalLink size={12} />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Safety Tips */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
                  <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                    🛡️ Safety First
                  </h3>
                  <ul className="text-yellow-800 dark:text-yellow-200 text-sm space-y-1">
                    <li>• Never share your seed phrase with anyone</li>
                    <li>• Only download wallets from official websites</li>
                    <li>• Always verify URLs before entering sensitive information</li>
                    <li>• Keep your wallet software updated</li>
                  </ul>
                </div>

                {/* Learn More Link */}
                <div className="text-center">
                  <a
                    href="https://ethereum.org/en/wallets/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100 font-semibold transition-colors"
                  >
                    <span>Learn more about wallets on Ethereum.org</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Profile Cards Showcase */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              See How Your Profile Will Look
            </h2>
            <p className="text-gray-700 dark:text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Once you connect your wallet and create credentials, your profile will showcase 
              your achievements, skills, and community reputation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Featured Profile */}
            <div className="md:col-span-2 lg:col-span-1">
              <UserProfileCard
                user={mockUsers[0]}
                variant="featured"
                onMessage={handleMessage}
                onConnect={handleConnect}
              />
            </div>

            {/* Regular Profiles */}
            <div className="space-y-6">
              <UserProfileCard
                user={mockUsers[1]}
                variant="default"
                onMessage={handleMessage}
                onConnect={handleConnect}
              />
              <UserProfileCard
                user={mockUsers[2]}
                variant="compact"
                showActions={false}
              />
            </div>

            {/* Additional Profile */}
            <div className="hidden lg:block">
              <UserProfileCard
                user={mockUsers[2]}
                variant="default"
                onMessage={handleMessage}
                onConnect={handleConnect}
              />
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm font-semibold">
              <Award className="w-4 h-4" />
              <span>Your profile will be automatically generated when you connect</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all card-hover"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* How it Works */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-gray-200/50 dark:border-gray-700/50 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            How SoulCred Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Connect Wallet',
                description: 'Link your Web3 wallet to start your credentialing journey',
              },
              {
                step: '02',
                title: 'Complete Learning',
                description: 'Finish courses, projects, or contribute to communities',
              },
              {
                step: '03',
                title: 'Mint Credentials',
                description: 'Create permanent SBTs that prove your achievements',
              },
              {
                step: '04',
                title: 'Build Reputation',
                description: 'Get endorsed by peers and showcase your verified skills',
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">{step.step}</span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              10,000+
            </div>
            <div className="text-gray-700 dark:text-gray-200 font-medium">
              Credentials Issued
            </div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              5,000+
            </div>
            <div className="text-gray-700 dark:text-gray-200 font-medium">
              Active Learners
            </div>
          </div>
          <div>
            <div className="text-4xl font-bold text-teal-600 dark:text-teal-400 mb-2">
              500+
            </div>
            <div className="text-gray-700 dark:text-gray-200 font-medium">
              Learning Organizations
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;