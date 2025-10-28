import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getLeaderboard } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        setLeaderboard(data.users);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getSubscriptionBadge = (subscription) => {
    switch (subscription) {
      case 'pro':
        return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">Pro</span>;
      case 'trainer':
        return <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded">Trainer</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">Free</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold high-contrast-text mb-6 text-center">Leaderboard</h2>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
            <h3 className="text-xl font-bold text-white">Top Typists</h3>
            <p className="text-blue-100">See how you rank against other players</p>
          </div>
          
          <div className="p-4">
            {leaderboard.length > 0 ? (
              <div className="space-y-4">
                {leaderboard.map((player, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      user && player.username === user.username 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-amber-100 text-amber-800' :
                        'bg-white text-gray-800'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900">{player.username}</span>
                          <span className="ml-2">{getSubscriptionBadge(player.subscription)}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {player.testsTaken} tests taken
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-lg text-blue-600">{player.wpm} WPM</div>
                      <div className="text-sm text-gray-500">{player.accuracy}% accuracy</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No leaderboard data available yet.</p>
                <p className="text-gray-500 mt-2">Start typing to appear on the leaderboard!</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/game')}
            className="high-contrast-button px-6 py-3 rounded-lg transition duration-300"
          >
            Start Typing Challenge
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;