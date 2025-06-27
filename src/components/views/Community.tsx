import React, { useState } from 'react';
import { Search, Filter, Star, MessageCircle, Users, Award, TrendingUp, Heart, ExternalLink } from 'lucide-react';
import { mockUsers, mockAchievements } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

const Community: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState<'feed' | 'users' | 'leaderboard'>('feed');
  const [endorsedItems, setEndorsedItems] = useState<Set<string>>(new Set());
  const [messagedUsers, setMessagedUsers] = useState<Set<string>>(new Set());

  const categories = ['all', 'Programming', 'Blockchain', 'Leadership', 'Design', 'Security'];

  const filteredAchievements = mockAchievements.filter(achievement => {
    const matchesSearch = achievement.credential.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         achievement.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || achievement.credential.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredUsers = mockUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const handleEndorse = (credentialId: string) => {
    setEndorsedItems(prev => new Set([...prev, credentialId]));
    console.log('Endorsed credential:', credentialId);
    // In a real app, this would make an API call
  };

  const handleMessage = (userId: string) => {
    setMessagedUsers(prev => new Set([...prev, userId]));
    console.log('Messaging user:', userId);
    // In a real app, this would open messaging interface
  };

  const handleConnect = (userId: string) => {
    console.log('Connecting with user:', userId);
    // In a real app, this would send a connection request
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Community Hub
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Connect with learners, discover achievements, and celebrate the community's growth.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search achievements, users, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex items-center space-x-3">
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
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {[
            { id: 'feed', label: 'Achievement Feed', icon: '📢' },
            { id: 'users', label: 'Discover Users', icon: '👥' },
            { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-purple-700 dark:text-purple-300 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'feed' && (
        <div className="space-y-6">
          {filteredAchievements.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No achievements found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            filteredAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={achievement.user.avatar}
                    alt={achievement.user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {achievement.user.name}
                      </h3>
                      <span className="text-gray-500 dark:text-gray-400">earned</span>
                      <span className="font-medium text-purple-600 dark:text-purple-400">
                        {achievement.credential.title}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                      {achievement.credential.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {achievement.credential.skills.slice(0, 4).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                      {achievement.credential.skills.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-md">
                          +{achievement.credential.skills.length - 4} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{formatDate(achievement.timestamp)}</span>
                        <div className="flex items-center space-x-1">
                          <Star size={14} />
                          <span>{achievement.credential.endorsements} endorsements</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {achievement.user.id !== user?.id && (
                          <>
                            <button
                              onClick={() => handleEndorse(achievement.credential.id)}
                              disabled={endorsedItems.has(achievement.credential.id)}
                              className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                endorsedItems.has(achievement.credential.id)
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                  : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50'
                              }`}
                            >
                              {endorsedItems.has(achievement.credential.id) ? (
                                <>
                                  <Heart size={14} className="fill-current" />
                                  <span>Endorsed</span>
                                </>
                              ) : (
                                <>
                                  <Star size={14} />
                                  <span>Endorse</span>
                                </>
                              )}
                            </button>
                            
                            <button
                              onClick={() => handleMessage(achievement.user.id)}
                              className="flex items-center space-x-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                              <MessageCircle size={14} />
                              <span>Message</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((communityUser) => (
            <div
              key={communityUser.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={communityUser.avatar}
                  alt={communityUser.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white truncate">
                    {communityUser.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {communityUser.location}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Award className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {communityUser.totalCredentials} credentials
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                {communityUser.bio}
              </p>

              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {communityUser.skills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                  {communityUser.skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-md">
                      +{communityUser.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                  <TrendingUp size={14} />
                  <span>{communityUser.reputation} reputation</span>
                </div>

                {communityUser.id !== user?.id && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleMessage(communityUser.id)}
                      disabled={messagedUsers.has(communityUser.id)}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        messagedUsers.has(communityUser.id)
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <MessageCircle size={14} />
                      <span>{messagedUsers.has(communityUser.id) ? 'Sent' : 'Message'}</span>
                    </button>
                    
                    <button
                      onClick={() => handleConnect(communityUser.id)}
                      className="flex items-center space-x-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium transition-colors"
                    >
                      <Users size={14} />
                      <span>Connect</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Top Contributors
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Community members making the biggest impact
            </p>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {mockUsers
              .sort((a, b) => b.reputation - a.reputation)
              .map((leaderUser, index) => (
                <div key={leaderUser.id} className="p-6 flex items-center space-x-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      index === 1 ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                      index === 2 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                      'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      #{index + 1}
                    </div>
                  </div>

                  <img
                    src={leaderUser.avatar}
                    alt={leaderUser.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {leaderUser.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {leaderUser.location}
                    </p>
                  </div>

                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <p className="font-bold text-gray-900 dark:text-white">
                        {leaderUser.totalCredentials}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">Credentials</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-gray-900 dark:text-white">
                        {leaderUser.endorsements}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">Endorsements</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-purple-600 dark:text-purple-400">
                        {leaderUser.reputation}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">Reputation</p>
                    </div>
                  </div>

                  {leaderUser.id !== user?.id && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleMessage(leaderUser.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        title="Send message"
                      >
                        <MessageCircle size={16} />
                      </button>
                      <button
                        onClick={() => handleConnect(leaderUser.id)}
                        className="p-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                        title="Connect"
                      >
                        <ExternalLink size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;