import React, { useState } from 'react';
import { useAuth } from '@/auth/AuthProvider';
import { useNavigate } from "react-router";
import { motion } from 'framer-motion';

const SignUp = () => {
  const { signUp, signUpWithGoogle, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const { error } = await signUp(email, email, password);
      if (error) setError(error.message);
      else setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignUp = () => {
    signUpWithGoogle();
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
      {/* Top-left logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-4 left-5 flex items-center"
      >
        <motion.h1
          className="text-2xl font-extrabold tracking-tight cursor-pointer select-none"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          onClick={() => navigate('/')}
        >
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Inter
          </span>
          <motion.span
            animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-[length:200%_200%] bg-clip-text text-transparent"
          >
            Review
          </motion.span>
        </motion.h1>
      </motion.div>

      {/* Sign Up card */}
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mt-10">
        <form className="flex flex-col" onSubmit={handleSignUp}>
          <h2 className="text-3xl font-extrabold text-center mb-4">Sign Up</h2>

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
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>

          {error && <p className="text-red-600 text-center py-2">{error}</p>}
          {success && (
            <p className="text-green-600 text-center py-2">
              Check your email for a confirmation link!
            </p>
          )}

          <p className="italic text-center py-2 text-gray-600">or</p>

          <button
            type="button"
            onClick={handleGoogleSignUp}
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
            Already have an account?{' '}
            <a
              href="/login"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Log in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
