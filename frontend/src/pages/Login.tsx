import React, { useState } from 'react';
import { useAuth } from '@/auth/AuthProvider';

const Login = () => {
  const { logIn, logInWithGoogle, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const { error } = await logIn(email, password);
      if (error) setError(error.message);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = () => {
    logInWithGoogle();
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <form className="flex flex-col space-y-4" onSubmit={handleLogin}>
            <h2 className="text-3xl font-extrabold text-center">Log In</h2>

            <div className="flex flex-col space-y-1">
                <label className="font-medium text-left">Email</label>
                <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex flex-col space-y-1">
                <label className="font-medium text-left">Password</label>
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className={`flex items-center justify-center rounded-md text-white font-medium text-sm py-2.5 px-6 self-center transition-all
                ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
                {isLoading ? 'Loading...' : 'Log In'}
            </button>

          {error && (
            <p className="text-red-500 text-center py-2">{error}</p>
          )}

          <p className="italic text-center py-2 text-gray-600">or</p>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2.5 px-4 bg-white hover:bg-gray-50 transition-all"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google logo"
              className="w-5 h-5"
            />
            <span className="text-gray-700 font-medium text-sm">
              Continue with Google
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
