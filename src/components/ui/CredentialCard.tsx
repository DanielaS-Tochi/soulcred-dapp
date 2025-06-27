import React from 'react';
import { Calendar, Users, CheckCircle, Award, TrendingUp } from 'lucide-react';
import { Credential } from '../../types';

interface CredentialCardProps {
  credential: Credential;
  showActions?: boolean;
  onEndorse?: (credentialId: string) => void;
}

const CredentialCard: React.FC<CredentialCardProps> = ({ 
  credential, 
  showActions = true, 
  onEndorse 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Programming': 'bg-blue-500',
      'Blockchain': 'bg-purple-500',
      'Leadership': 'bg-green-500',
      'Design': 'bg-pink-500',
      'Security': 'bg-red-500',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Image Header */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={credential.imageUrl}
          alt={credential.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor(credential.category)}`}>
            {credential.category}
          </span>
        </div>

        {/* Verification Badge */}
        {credential.verified && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center space-x-1 bg-green-500 text-white px-2 py-1 rounded-full">
              <CheckCircle size={12} />
              <span className="text-xs font-medium">Verified</span>
            </div>
          </div>
        )}

        {/* Title Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-bold text-lg mb-1">{credential.title}</h3>
          <p className="text-gray-200 text-sm">Issued by {credential.issuer}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {credential.description}
        </p>

        {/* Skills */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {credential.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md"
              >
                {skill}
              </span>
            ))}
            {credential.skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-md">
                +{credential.skills.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-purple-600 dark:text-purple-400">
              <TrendingUp size={14} />
              <span className="text-lg font-bold">{credential.impactMetrics.learningHours}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Learning Hours</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-green-600 dark:text-green-400">
              <Users size={14} />
              <span className="text-lg font-bold">{credential.impactMetrics.peersHelped}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Peers Helped</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Calendar size={14} />
            <span>{formatDate(credential.dateEarned)}</span>
          </div>

          {showActions && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                <Award size={14} />
                <span>{credential.endorsements}</span>
              </div>
              
              {onEndorse && (
                <button
                  onClick={() => onEndorse(credential.id)}
                  className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-md text-xs font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                >
                  Endorse
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CredentialCard;