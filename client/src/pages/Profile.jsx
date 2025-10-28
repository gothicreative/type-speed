import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, stats } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold high-contrast-text mb-6 text-center">Your Profile</h2>
      
      <div className="max-w-4xl mx-auto">
        {/* User Info Card */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-4 md:mb-0 md:mr-6">
              <div className="bg-white/20 rounded-full w-24 h-24 flex items-center justify-center text-4xl">
                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold high-contrast-text">{user?.username || 'User'}</h3>
              <p className="text-lg high-contrast-text opacity-90">{user?.email || 'user@example.com'}</p>
              <div className="mt-2 inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                {user?.subscription?.charAt(0)?.toUpperCase() + user?.subscription?.slice(1) || 'Free'} Plan
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
            <div className="text-3xl font-bold text-blue-600">{stats?.user?.wpm || 0}</div>
            <div className="text-gray-600 mt-2">Best WPM</div>
          </div>
          <div className="bg-green-50 p-6 rounded-xl border border-green-200">
            <div className="text-3xl font-bold text-green-600">{Math.round(stats?.user?.accuracy) || 0}%</div>
            <div className="text-gray-600 mt-2">Avg. Accuracy</div>
          </div>
          <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
            <div className="text-3xl font-bold text-purple-600">{stats?.user?.testsTaken || 0}</div>
            <div className="text-gray-600 mt-2">Tests Taken</div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">

          <h3 className="text-xl font-bold text-black mb-4">Your Progress</h3>
          
          {stats?.recentTests?.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between font-medium text-black opacity-90 border-b pb-2">
                <div>Date</div>
                <div>WPM</div>
                <div>Accuracy</div>
                <div>Progress</div>
              </div>
              {stats.recentTests.slice(0, 5).map((test, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-gray-600">{new Date(test.timestamp).toLocaleDateString()}</div>
                  <div className="font-medium text-blue-600">{test.wpm}</div>
                  <div className="font-medium text-green-600">{Math.round(test.accuracy)}%</div>
                  <div className="font-medium text-purple-600">{Math.round(test.progress)}%</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-black opacity-70">
              <p>No test results yet. Start a typing challenge to see your progress!</p>
            </div>
          )}
        </div>

        {/* Subscription Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-black mb-4">Subscription Details</h3>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="font-medium text-black">{user?.subscription?.charAt(0)?.toUpperCase() + user?.subscription?.slice(1) || 'Free'} Plan</p>
              <p className="text-black opacity-90 text-sm mt-1">
                {user?.subscription === 'free' && 'Basic features with flying animation'}
                {user?.subscription === 'pro' && 'All features with progress tracking'}
                {user?.subscription === 'trainer' && 'All features with guided lessons'}
              </p>
            </div>
            {user?.subscription === 'free' && (
              <button 
                onClick={() => navigate('/')}
                className="px-4 py-2 high-contrast-button rounded-lg transition duration-300"
              >
                Upgrade Plan
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 high-contrast-button-secondary rounded-lg transition duration-300"
        >
          Back to Home
        </button>
        <button
          onClick={() => navigate('/leaderboard')}
          className="px-6 py-3 high-contrast-button rounded-lg transition duration-300 ml-4"
        >
          View Leaderboard
        </button>
      </div>
    </div>
  );
};

export default Profile;