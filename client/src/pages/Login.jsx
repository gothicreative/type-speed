import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    console.log('Logging in with data:', loginForm);
    const result = await login(loginForm);
    console.log('Login result:', result);
    if (!result.success) {
      setAuthError(result.message);
    } else {
      setLoginForm({ email: '', password: '' });
      navigate('/');
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <h2 className="text-2xl font-bold high-contrast-text mb-6 text-center">Login to Your Account</h2>

      {authError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {authError}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block high-contrast-text text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 form-input leading-tight focus:outline-none focus:shadow-outline"
            value={loginForm.email}
            onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
            required
            autoComplete="email"
          />
        </div>

        <div className="mb-6">
          <label className="block high-contrast-text text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 form-input leading-tight focus:outline-none focus:shadow-outline"
            value={loginForm.password}
            onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
            required
            autoComplete="current-password"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="high-contrast-button font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => navigate('/register')}
            className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800"
          >
            Don't have an account? Register
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/')}
          className="high-contrast-button-secondary px-4 py-2 rounded"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Login;