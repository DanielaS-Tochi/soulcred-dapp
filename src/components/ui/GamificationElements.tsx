import React, { useState, useEffect } from 'react';
import { Trophy, Star, Flame, Target, Award, Zap } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Streak {
  current: number;
  longest: number;
  lastActivity: string;
}

const GamificationElements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-credential',
      title: 'First Steps',
      description: 'Mint your first credential',
      icon: Award,
      progress: 0,
      maxProgress: 1,
      unlocked: false,
      rarity: 'common'
    },
    {
      id: 'community-helper',
      title: 'Community Helper',
      description: 'Endorse 10 credentials',
      icon: Star,
      progress: 0,
      maxProgress: 10,
      unlocked: false,
      rarity: 'rare'
    },
    {
      id: 'learning-streak',
      title: 'Learning Streak',
      description: 'Maintain a 7-day learning streak',
      icon: Flame,
      progress: 0,
      maxProgress: 7,
      unlocked: false,
      rarity: 'epic'
    },
    {
      id: 'skill-master',
      title: 'Skill Master',
      description: 'Earn credentials in 5 different categories',
      icon: Target,
      progress: 0,
      maxProgress: 5,
      unlocked: false,
      rarity: 'legendary'
    }
  ]);

  const [streak, setStreak] = useState<Streak>({
    current: 3,
    longest: 7,
    lastActivity: new Date().toISOString()
  });

  const [level, setLevel] = useState(5);
  const [xp, setXp] = useState(1250);
  const [xpToNextLevel] = useState(1500);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 dark:text-gray-400';
      case 'rare': return 'text-blue-600 dark:text-blue-400';
      case 'epic': return 'text-purple-600 dark:text-purple-400';
      case 'legendary': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 dark:bg-gray-800';
      case 'rare': return 'bg-blue-100 dark:bg-blue-900/30';
      case 'epic': return 'bg-purple-100 dark:bg-purple-900/30';
      case 'legendary': return 'bg-yellow-100 dark:bg-yellow-900/30';
      default: return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Level & XP */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Level {level}</h3>
              <p className="text-white/80 text-sm">Learning Champion</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{xp.toLocaleString()}</div>
            <div className="text-white/80 text-sm">XP</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to Level {level + 1}</span>
            <span>{xp}/{xpToNextLevel}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${(xp / xpToNextLevel) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Learning Streak */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Learning Streak
          </h3>
          <Flame className="w-6 h-6 text-orange-500" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500 mb-1">
              {streak.current}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Current Streak
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {streak.longest}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Longest Streak
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <p className="text-sm text-orange-700 dark:text-orange-300 text-center">
            🔥 Keep it up! You're on fire with your learning journey!
          </p>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Achievements
          </h3>
          <Trophy className="w-6 h-6 text-yellow-500" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;
            
            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.unlocked
                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${getRarityBg(achievement.rarity)}`}>
                    <Icon className={`w-5 h-5 ${getRarityColor(achievement.rarity)}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {achievement.title}
                      </h4>
                      {achievement.unlocked && (
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {achievement.description}
                    </p>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                        <span className={`font-medium ${getRarityColor(achievement.rarity)}`}>
                          {achievement.rarity.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            achievement.unlocked
                              ? 'bg-green-500'
                              : 'bg-purple-500'
                          }`}
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Challenges */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Daily Challenges
          </h3>
          <Target className="w-6 h-6 text-blue-500" />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                Endorse 3 Credentials
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Help your community by endorsing quality work
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                1/3
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                +50 XP
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                Connect with 2 New Users
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Expand your learning network
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-gray-600 dark:text-gray-400">
                0/2
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                +75 XP
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamificationElements;