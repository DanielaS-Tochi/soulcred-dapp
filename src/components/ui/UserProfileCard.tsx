import React from 'react';
import { MapPin, Award, Star, Users, Calendar, ExternalLink, MessageCircle } from 'lucide-react';
import { User } from '../../types';

interface UserProfileCardProps {
  user: User;
  variant?: 'default' | 'compact' | 'featured';
  showActions?: boolean;
  onMessage?: (userId: string) => void;
  onConnect?: (userId: string) => void;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  user,
  variant = 'default',
  showActions = true,
  onMessage,
  onConnect,
}) => {
  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  if (variant === 'compact') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
        <div className="flex items-center space-x-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {user.name}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <MapPin size={12} />
              <span className="truncate">{user.location}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
              {user.totalCredentials}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">credentials</div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-700/50 hover:shadow-xl transition-all">
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-white dark:border-gray-700 shadow-lg"
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-4 mb-1">
            {user.name}
          </h3>
          <div className="flex items-center justify-center space-x-1 text-gray-600 dark:text-gray-300 mb-3">
            <MapPin size={14} />
            <span className="text-sm">{user.location}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {user.bio}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {user.totalCredentials}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Credentials</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {user.endorsements}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Endorsements</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {user.reputation}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Reputation</div>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-1 justify-center">
            {user.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-white/70 dark:bg-gray-700/70 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium"
              >
                {skill}
              </span>
            ))}
            {user.skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full text-xs">
                +{user.skills.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex space-x-2">
            <button
              onClick={() => onMessage?.(user.id)}
              className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-white/70 dark:bg-gray-700/70 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-white dark:hover:bg-gray-700 transition-colors"
            >
              <MessageCircle size={14} />
              <span>Message</span>
            </button>
            <button
              onClick={() => onConnect?.(user.id)}
              className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Users size={14} />
              <span>Connect</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
      <div className="flex items-start space-x-4 mb-4">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            {user.name}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
            <div className="flex items-center space-x-1">
              <MapPin size={14} />
              <span>{user.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>Joined {formatJoinDate(user.joinedDate)}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {user.bio}
          </p>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {user.skills.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-md text-xs font-medium"
            >
              {skill}
            </span>
          ))}
          {user.skills.length > 4 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md text-xs">
              +{user.skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-purple-600 dark:text-purple-400">
            <Award size={16} />
            <span className="text-lg font-bold">{user.totalCredentials}</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Credentials</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-yellow-600 dark:text-yellow-400">
            <Star size={16} />
            <span className="text-lg font-bold">{user.endorsements}</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Endorsements</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-green-600 dark:text-green-400">
            <Users size={16} />
            <span className="text-lg font-bold">{user.reputation}</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Reputation</p>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex space-x-3">
          <button
            onClick={() => onMessage?.(user.id)}
            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <MessageCircle size={14} />
            <span>Message</span>
          </button>
          <button
            onClick={() => onConnect?.(user.id)}
            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <ExternalLink size={14} />
            <span>Connect</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfileCard;