import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router";
import { useAuth } from '@/auth/AuthProvider';

const Login = () => {
  const { logIn, logInWithGoogle, isLoading, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/create');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const { error } = await logIn(email, password);
      if (error) { 
        setError(error.message);
      } else {
        navigate('/create');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    await logInWithGoogle();
    navigate('/create');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <form className="flex flex-col" onSubmit={handleLogin}>
          <h2 className="text-3xl font-extrabold text-center mb-4">Log In</h2>

          <div className="mb-4">
            <label className="block font-medium mb-1 text-left">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1 text-left">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`flex items-center justify-center w-auto self-center bg-blue-600 text-white font-medium text-sm py-2.5 px-6 rounded-md transition duration-200 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Loading...' : 'Log In'}
          </button>

          {error && (
            <p className="text-red-600 text-center py-2">{error}</p>
          )}

          <p className="italic text-center py-2 text-gray-600">or</p>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 rounded-md font-medium text-sm py-2.5 px-4 w-full transition duration-200 hover:bg-gray-100"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google logo"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{' '}
            <a
              href="/signup"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
