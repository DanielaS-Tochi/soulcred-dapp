import React from 'react';
import { Award, Users, TrendingUp, Calendar, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockCredentials, mockAchievements } from '../../data/mockData';
import CredentialCard from '../ui/CredentialCard';
import { 
  LearningProgressChart, 
  SkillsDistributionChart, 
  AchievementTimelineChart,
  ImpactMetricsChart 
} from '../ui/Charts';

const EnhancedDashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const recentCredentials = mockCredentials.slice(0, 3);

  const stats = [
    {
      label: 'Total Credentials',
      value: user.totalCredentials,
      icon: Award,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      label: 'Endorsements',
      value: user.endorsements,
      icon: Star,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
    {
      label: 'Reputation Score',
      value: user.reputation,
      icon: TrendingUp,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      label: 'Community Rank',
      value: '#42',
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
  ];

  // Mock data for charts
  const learningProgressData = [
    { month: 'Jan', hours: 45 },
    { month: 'Feb', hours: 62 },
    { month: 'Mar', hours: 78 },
    { month: 'Apr', hours: 95 },
    { month: 'May', hours: 120 },
    { month: 'Jun', hours: 140 },
  ];

  const skillsData = [
    { name: 'Programming', value: 35 },
    { name: 'Blockchain', value: 25 },
    { name: 'Leadership', value: 20 },
    { name: 'Design', value: 15 },
    { name: 'Security', value: 5 },
  ];

  const achievementTimelineData = [
    { date: 'Jan', credentials: 2 },
    { date: 'Feb', credentials: 5 },
    { date: 'Mar', credentials: 8 },
    { date: 'Apr', credentials: 10 },
    { date: 'May', credentials: 12 },
    { date: 'Jun', credentials: 12 },
  ];

  const impactMetricsData = [
    { metric: 'Learning Hours', value: 450 },
    { metric: 'Projects', value: 15 },
    { metric: 'Peers Helped', value: 89 },
    { metric: 'Contributions', value: 34 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Here's your learning journey and community impact overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Learning Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Learning Progress
          </h2>
          <LearningProgressChart data={learningProgressData} />
        </div>

        {/* Skills Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Skills Distribution
          </h2>
          <SkillsDistributionChart data={skillsData} />
        </div>

        {/* Achievement Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Achievement Timeline
          </h2>
          <AchievementTimelineChart data={achievementTimelineData} />
        </div>

        {/* Impact Metrics */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Impact Metrics
          </h2>
          <ImpactMetricsChart data={impactMetricsData} />
        </div>
      </div>

      {/* Featured Credentials */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Your Top Credentials
          </h2>
          <button className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
            View All Credentials
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentCredentials.map((credential) => (
            <CredentialCard
              key={credential.id}
              credential={credential}
              showActions={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;