import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user, stats } = useAuth();
  const navigate = useNavigate();

  const startGame = () => {
    navigate('/game');
  };

  return (
    <div className="text-center py-8">
      <div className="mb-8 flex justify-center">
        <div className="text-8xl rocket-animation">
          🚀
        </div>
      </div>

      <h2 className="text-2xl font-semibold high-contrast-text mb-4">Ready to improve your typing speed?</h2>
      <p className="high-contrast-text opacity-90 mb-8 max-w-2xl mx-auto">Type the text as fast and accurately as you can. Your plane will fly faster when you type correctly and will fall when you make mistakes or pause.</p>

      {/* Subscription info */}
      {user && (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg max-w-2xl mx-auto">
          <p className="font-medium high-contrast-text mb-2" style={{color:'black'}}>Your Subscription: <span className="capitalize font-bold">{user.subscription}</span></p>
          {user.subscription === 'free' && (
            <p className="text-sm high-contrast-text opacity-90" style={{color:'black'}}>Upgrade to Pro for longer texts and progress tracking!</p>
          )}
          {stats && (
            <div className="mt-3 flex justify-center space-x-6">
              <div>
                <p className="text-lg font-bold text-blue-600">{stats.user.wpm || 0}</p>
                <p className="text-xs text-gray-600">Best WPM</p>
              </div>
              <div>
                <p className="text-lg font-bold text-green-600">{Math.round(stats.user.accuracy) || 0}%</p>
                <p className="text-xs text-gray-600">Avg. Accuracy</p>
              </div>
              <div>
                <p className="text-lg font-bold text-purple-600">{stats.user.testsTaken || 0}</p>
                <p className="text-xs text-gray-600">Tests Taken</p>
              </div>
            </div>
          )}
        </div>
      )}

      <button
        onClick={startGame}
        className="high-contrast-button font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105"
      >
        Start Typing Challenge
      </button>

      {/* Subscription plans */}
      {!user && (
        <div className="mt-12 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-white-800 mb-6">Subscription Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free Plan */}
            <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 transition duration-300">
              <h4 className="text-xl font-bold text-white-800 mb-2">Free</h4>
              <p className="text-3xl font-bold text-blue-600 mb-4">$0<span className="text-lg text-gray-600">/month</span></p>
              <ul className="high-contrast-text opacity-90 mb-6 space-y-2">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Basic typing challenges
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Flying plane animation
                </li>
                <li className="flex items-center text-gray-400">
                  <span className="mr-2">✗</span>
                  Progress tracking
                </li>
                <li className="flex items-center text-gray-400">
                  <span className="mr-2">✗</span>
                  Longer texts
                </li>
              </ul>
              <button
                onClick={() => navigate('/register')}
                className="w-full high-contrast-button-secondary font-medium py-2 px-4 rounded-lg transition duration-300"
              >
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="border-2 border-blue-500 rounded-xl p-6 bg-blue-50 relative">
              <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
                POPULAR
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">Pro</h4>
              <p className="text-3xl font-bold text-blue-600 mb-4">$2<span className="text-lg text-gray-600">/month</span></p>
              <ul className="text-black opacity-90 mb-6 space-y-2">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  All Free features
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Progress tracking
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Longer texts
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Stats dashboard
                </li>
              </ul>
              <button
                onClick={() => navigate('/register')}
                className="w-full high-contrast-button font-medium py-2 px-4 rounded-lg transition duration-300"
              >
                Get Pro Plan
              </button>
            </div>

            {/* Trainer Plan */}
            <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-purple-300 transition duration-300">
              <h4 className="text-xl font-bold text-white-800 mb-2">Trainer</h4>
              <p className="text-3xl font-bold text-purple-600 mb-4">$9<span className="text-lg text-gray-600">/month</span></p>
              <ul className="high-contrast-text opacity-90 mb-6 space-y-2">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  All Pro features
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Guided lessons
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Advanced analytics
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Personalized training
                </li>
              </ul>
              <button
                onClick={() => navigate('/register')}
                className="w-full high-contrast-button-secondary font-medium py-2 px-4 rounded-lg transition duration-300"
              >
                Get Trainer Plan
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Leaderboard Preview */}
      <div className="mt-12 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white-800">Top Performers</h3>
          <button 
            onClick={() => navigate('/leaderboard')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View Full Leaderboard →
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 text-center mb-4">See how you rank against other typists!</p>
          <div className="flex justify-center">
            <button 
              onClick={() => navigate('/leaderboard')}
              className="high-contrast-button px-6 py-2 rounded-lg transition duration-300"
            >
              Check Leaderboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;