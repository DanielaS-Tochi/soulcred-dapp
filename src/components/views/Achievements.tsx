import React, { useState } from 'react';
import { Search, Filter, Award, Calendar, Star, CheckCircle } from 'lucide-react';
import { mockCredentials } from '../../data/mockData';
import CredentialCard from '../ui/CredentialCard';

const Achievements: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'endorsements' | 'title'>('date');

  const categories = ['all', 'Programming', 'Blockchain', 'Leadership', 'Design', 'Security'];

  const filteredCredentials = mockCredentials
    .filter(credential => {
      const matchesSearch = credential.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           credential.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           credential.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || credential.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.dateEarned).getTime() - new Date(a.dateEarned).getTime();
        case 'endorsements':
          return b.endorsements - a.endorsements;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const totalCredentials = mockCredentials.length;
  const totalEndorsements = mockCredentials.reduce((sum, cred) => sum + cred.endorsements, 0);
  const totalLearningHours = mockCredentials.reduce((sum, cred) => sum + cred.impactMetrics.learningHours, 0);
  const categoryCounts = mockCredentials.reduce((acc, cred) => {
    acc[cred.category] = (acc[cred.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleEndorse = (credentialId: string) => {
    console.log('Endorsing credential:', credentialId);
    // In a real app, this would make an API call
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Achievements
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Your complete collection of learning credentials and accomplishments.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Total Credentials
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalCredentials}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Total Endorsements
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalEndorsements}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Learning Hours
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalLearningHours}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Verified
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockCredentials.filter(c => c.verified).length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Achievement Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Object.entries(categoryCounts).map(([category, count]) => (
            <div key={category} className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold text-lg">{count}</span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{category}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search credentials, skills, or descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400" size={20} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="date">Sort by Date</option>
              <option value="endorsements">Sort by Endorsements</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      {filteredCredentials.length === 0 ? (
        <div className="text-center py-12">
          <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No credentials found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Try adjusting your search or filters, or create your first credential.
          </p>
          <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
            Mint Your First Credential
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCredentials.map((credential) => (
            <CredentialCard
              key={credential.id}
              credential={credential}
              onEndorse={handleEndorse}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Achievements;