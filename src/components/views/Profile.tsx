import React, { useState } from 'react';
import { Camera, MapPin, Calendar, Award, Star, CreditCard as Edit2, Save, X, LogOut, Copy, Check } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAuth } from '../../contexts/AuthContext';
import { databaseService } from '../../services/database';
import { useToast } from '../ui/Toast';

const Profile: React.FC = () => {
  const { user, disconnectWallet } = useAuth();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    skills: user?.skills || [],
  });
  const [newSkill, setNewSkill] = useState('');

  if (!user) return null;

  const handleSave = async () => {
    if (!user?.address) return;

    setSaving(true);
    try {
      const updates = {
        display_name: editForm.name,
        bio: editForm.bio,
        location: editForm.location,
        skills: editForm.skills,
      };

      await databaseService.updateUserProfile(user.address, updates);

      await databaseService.createActivity({
        user_address: user.address,
        activity_type: 'profile_updated',
        title: 'Updated profile',
        description: 'Profile information has been updated',
      });

      showToast('Profile updated successfully!', 'success');
      setIsEditing(false);

      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Error saving profile:', error);
      showToast('Failed to update profile. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: user.name,
      bio: user.bio,
      location: user.location,
      skills: user.skills,
    });
    setIsEditing(false);
  };

  const addSkill = () => {
    if (newSkill.trim() && !editForm.skills.includes(newSkill.trim())) {
      setEditForm(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setEditForm(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove),
    }));
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(user.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to disconnect your wallet and log out?')) {
      disconnectWallet();
    }
  };

  const achievements = [
    { label: 'Credentials Earned', value: user.totalCredentials, color: 'purple' },
    { label: 'Endorsements Received', value: user.endorsements, color: 'yellow' },
    { label: 'Reputation Score', value: user.reputation, color: 'green' },
    { label: 'Days Active', value: Math.floor((new Date().getTime() - new Date(user.joinedDate).getTime()) / (1000 * 60 * 60 * 24)), color: 'blue' },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
      green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    };
    return colors[color as keyof typeof colors] || colors.purple;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your profile information and track your learning journey.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600"></div>
        
        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-16 mb-6">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                  <Camera size={16} />
                </button>
              )}
            </div>
            
            <div className="flex-1 sm:ml-6 mt-4 sm:mt-0">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="text-2xl font-bold bg-transparent border-b-2 border-purple-500 focus:outline-none text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                    className="bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none text-gray-600 dark:text-gray-300"
                    placeholder="Location"
                  />
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {user.name}
                  </h2>
                  <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                    <MapPin size={16} className="mr-1" />
                    <span>{user.location}</span>
                  </div>
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <Calendar size={16} className="mr-1" />
                    <span>Joined {new Date(user.joinedDate).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-2 mt-4 sm:mt-0">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <Save size={16} />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <Edit2 size={16} />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">About</h3>
            {isEditing ? (
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-gray-600 dark:text-gray-300">{user.bio}</p>
            )}
          </div>

          {/* Skills */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Skills</h3>
            {isEditing ? (
              <div>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <button
                    onClick={addSkill}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editForm.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Achievements Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {achievements.map((achievement, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {achievement.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {achievement.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${getColorClasses(achievement.color)}`}>
                {achievement.color === 'purple' && <Award className="w-6 h-6" />}
                {achievement.color === 'yellow' && <Star className="w-6 h-6" />}
                {achievement.color === 'green' && <Award className="w-6 h-6" />}
                {achievement.color === 'blue' && <Calendar className="w-6 h-6" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Account Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Account Settings
        </h3>
        
        <div className="space-y-6">
          {/* Wallet Information */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white mb-1">Wallet Address</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono break-all">
                  {user.address}
                </p>
              </div>
              <button
                onClick={copyAddress}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            {/* RainbowKit Account Modal */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white mb-1">Wallet Management</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  View wallet details, switch accounts, or change networks
                </p>
              </div>
              <ConnectButton.Custom>
                {({ openAccountModal }) => (
                  <button
                    onClick={openAccountModal}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    Manage Wallet
                  </button>
                )}
              </ConnectButton.Custom>
            </div>
          </div>

          {/* Logout Section */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white mb-1">Disconnect Wallet</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This will log you out of SoulCred and disconnect your wallet
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                <LogOut size={16} />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;