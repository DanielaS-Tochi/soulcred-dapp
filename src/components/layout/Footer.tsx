import React from 'react';
import { Github, Linkedin, Heart, Code, ExternalLink, Award, Sparkles } from 'lucide-react';
import SoulCredLogo from '../ui/SoulCredLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Brand Section */}
          <div className="space-y-3 sm:space-y-4 col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-4">
              <SoulCredLogo variant="icon" size="xl" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">SoulCred</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-w-sm">
              Empowering learners through decentralized credentials. Create permanent, 
              verifiable achievements on the blockchain.
            </p>
            
            {/* Social Links - Mobile */}
            <div className="flex items-center space-x-4 sm:hidden">
              <a
                href="https://linkedin.com/in/daniela-silvana-tochi"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/danielas-tochi"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://bolt.new/?rid=os72mi"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                aria-label="Built with Bolt.new"
              >
                <img
                  src="https://storage.bolt.army/black_circle_360x360.png"
                  alt="Bolt.new"
                  className="w-5 h-5 rounded-full"
                />
              </a>
            </div>
          </div>

          {/* Developer Section */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Developer
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">
                  Daniela Silvana Tochi
                </span>
              </div>
              
              {/* Social Links - Desktop */}
              <div className="hidden sm:flex flex-col space-y-2">
                <a
                  href="https://linkedin.com/in/daniela-silvana-tochi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group w-fit"
                >
                  <Linkedin className="w-4 h-4" />
                  <span className="text-sm">LinkedIn Profile</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a
                  href="https://github.com/danielas-tochi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group w-fit"
                >
                  <Github className="w-4 h-4" />
                  <span className="text-sm">GitHub Profile</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>
          </div>

          {/* Built With Section */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Built With
            </h3>
            <div className="space-y-3">
              <a
                href="https://bolt.new/?rid=os72mi"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center space-x-3 group p-2 -m-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
              >
                <img
                  src="https://storage.bolt.army/black_circle_360x360.png"
                  alt="Bolt.new"
                  className="w-10 h-10 rounded-full shadow-sm group-hover:shadow-md transition-shadow"
                />
                <div className="flex-1">
                  <div className="text-gray-900 dark:text-white font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors text-sm">
                    Bolt.new
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    AI-powered development
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
              </a>
              
              {/* Tech Stack */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tech Stack:
                </div>
                <div className="flex flex-wrap gap-2">
                  {['React', 'TypeScript', 'Tailwind CSS', 'Web3', 'Wagmi', 'RainbowKit'].map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
            {/* Enhanced Copyright Section */}
            <div className="flex flex-col space-y-3 sm:space-y-0">
              {/* Main Copyright Line */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                  <span className="text-sm font-medium">© 2025 SoulCred</span>
                  <span className="text-gray-400 dark:text-gray-500">•</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm">Made with</span>
                    <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
                    <span className="text-sm">for the Web3 community</span>
                  </div>
                </div>
              </div>
              
              {/* Hackathon Badge */}
              <div className="flex items-center space-x-2 text-xs">
                <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full">
                  <Award className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  <span className="text-purple-700 dark:text-purple-300 font-medium">Hackathon Submission</span>
                </div>
                <div className="flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <Sparkles className="w-3 h-3 text-yellow-500" />
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Bolt.new 2025</span>
                </div>
              </div>
            </div>
            
            {/* Links */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-500 dark:text-gray-400">
              <a 
                href="#" 
                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
              >
                Privacy
              </a>
              <a 
                href="#" 
                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
              >
                Terms
              </a>
              <a 
                href="#" 
                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
              >
                Docs
              </a>
              <a
                href="https://github.com/danielas-tochi/soulcred"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium group"
              >
                <span>Source</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};