import React, { useState } from 'react';
import { useAuth } from '@/auth/AuthProvider';
import './Login.css';

const SignUp = () => {
  const { signUp, signUpWithGoogle, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const { error } = await signUp(email, email, password);
      if (error) setError(error.message);
      else setSuccess(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignUp = () => {
    signUpWithGoogle();
  };

  return (
    <div className="login-page">
      <div className="card">
        <form className="login-form" onSubmit={handleSignUp}>
          <h2>Sign Up</h2>
          <br />
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="login-button" type="submit" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>

          {error && (
            <p style={{ color: 'red', textAlign: 'center', padding: '10px' }}>
              {error}
            </p>
          )}
          {success && (
            <p style={{ color: 'green', textAlign: 'center', padding: '10px' }}>
              Check your email for a confirmation link!
            </p>
          )}

          <p
            style={{
              fontStyle: 'italic',
              textAlign: 'center',
              padding: '10px',
            }}
          >
            or
          </p>

          <button
            type="button"
            className="google-btn"
            onClick={handleGoogleSignUp}
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google logo"
              style={{ height: '20px', width: '20px', marginRight: '8px' }}
            />
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
