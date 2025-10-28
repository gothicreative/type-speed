import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { register, login } = useAuth();
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    // Simple validation
    if (!registerForm.username || !registerForm.email || !registerForm.password) {
      setAuthError('All fields are required');
      return;
    }

    console.log('Registering user with data:', registerForm);
    const result = await register(registerForm);
    console.log('Registration result:', result);
    if (!result.success) {
      setAuthError(result.message);
    } else {
      // Auto-login after registration
      const loginResult = await login({
        email: registerForm.email,
        password: registerForm.password
      });
      console.log('Login result:', loginResult);
      if (!loginResult.success) {
        setAuthError(loginResult.message);
      } else {
        setRegisterForm({ username: '', email: '', password: '' });
        navigate('/');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <h2 className="text-2xl font-bold high-contrast-text mb-6 text-center">Create an Account</h2>

      {authError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {authError}
        </div>
      )}

      <form onSubmit={handleRegister}>
        <div className="mb-4">
          <label className="block high-contrast-text text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 form-input leading-tight focus:outline-none focus:shadow-outline"
            value={registerForm.username}
            onChange={(e) => setRegisterForm(prev => ({ ...prev, username: e.target.value }))}
            required
            autoComplete="username"
          />
        </div>

        <div className="mb-4">
          <label className="block high-contrast-text text-sm font-bold mb-2" htmlFor="reg-email">
            Email
          </label>
          <input
            id="reg-email"
            type="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 form-input leading-tight focus:outline-none focus:shadow-outline"
            value={registerForm.email}
            onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
            required
            autoComplete="email"
          />
        </div>

        <div className="mb-6">
          <label className="block high-contrast-text text-sm font-bold mb-2" htmlFor="reg-password">
            Password
          </label>
          <input
            id="reg-password"
            type="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 form-input leading-tight focus:outline-none focus:shadow-outline"
            value={registerForm.password}
            onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
            required
            autoComplete="new-password"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="high-contrast-button font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Register
          </button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800"
          >
            Already have an account? Login
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

export default Register;