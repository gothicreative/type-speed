import { useAuth } from './contexts/AuthContext'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Game from './pages/Game'
import Leaderboard from './pages/Leaderboard'
import './App.css'

function App() {
  const { user, logout, stats, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  if (loading) {
    return (
      <div className="cool-gradient-bg min-h-screen flex items-center justify-center">
        <div className="high-contrast-text text-2xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="cool-gradient-bg min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white/90 rounded-2xl shadow-xl p-6 md:p-8">
        {/* Navigation */}
        <nav className="mb-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold high-contrast-text">SpeedType Trainer</h1>
              <p className="high-contrast-text opacity-90">Improve your typing speed with a flying plane!</p>
            </div>

            {/* Navigation links */}
            <div className="flex flex-wrap gap-2">
              {user && (
                <>
                  <button 
                    onClick={() => navigate('/')}
                    className={`px-4 py-2 rounded-lg font-medium ${location.pathname === '/' ? 'high-contrast-button' : 'high-contrast-button-secondary'}`}
                  >
                    Home
                  </button>
                  <button 
                    onClick={() => navigate('/profile')}
                    className={`px-4 py-2 rounded-lg font-medium ${location.pathname === '/profile' ? 'high-contrast-button' : 'high-contrast-button-secondary'}`}
                  >
                    Profile
                  </button>
                  <button 
                    onClick={() => navigate('/game')}
                    className={`px-4 py-2 rounded-lg font-medium ${location.pathname === '/game' ? 'high-contrast-button' : 'high-contrast-button-secondary'}`}
                  >
                    Play
                  </button>
                  <button 
                    onClick={() => navigate('/leaderboard')}
                    className={`px-4 py-2 rounded-lg font-medium ${location.pathname === '/leaderboard' ? 'high-contrast-button' : 'high-contrast-button-secondary'}`}
                  >
                    Leaderboard
                  </button>
                </>
              )}
              
              {/* User info */}
              <div className="text-right">
                {user ? (
                  <div>
                    <p className="font-semibold text-white-800">{user.username}</p>
                    <p className="text-sm text-white-600 capitalize">{user.subscription} Plan</p>
                    <button
                      onClick={logout}
                      className="text-xs high-contrast-button-secondary hover:high-contrast-button mt-1"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigate('/login')}
                      className="high-contrast-button px-3 py-1 rounded-lg font-medium"
                    >
                      Login
                    </button>
                    <button 
                      onClick={() => navigate('/register')}
                      className="high-contrast-button px-3 py-1 rounded-lg font-medium"
                    >
                      Register
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/game" element={<Game />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>

        

        

        

        

        
      </div>

      <div className="mt-8 text-center high-contrast-text">
        <p>SpeedType Trainer - Improve your typing speed with fun animations!</p>
      </div>
    </div>
  )
}

export default App