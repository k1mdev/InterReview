/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { createClient, type AuthResponse, AuthError, type UserResponse, type Session } from '@supabase/supabase-js';

// Define your user state type
type AuthState = { email: string; username?: string } | null | undefined;

interface AuthContextType {
  user: AuthState;
  isLoading: boolean;
  isLoggedIn: boolean;
  isLoggedOut: boolean;
  signUp: (email: string, username: string, password: string) => Promise<AuthResponse>;
  signUpWithGoogle: () => void;
  logIn: (email: string, password: string) => Promise<AuthResponse>;
  logInWithGoogle: () => void;
  logOut: () => Promise<void>;
  sendPasswordResetEmail: (
    email: string
  ) => Promise<{ data: object; error: null } | { data: null; error: AuthError }>;
  resetPassword: (password: string) => Promise<UserResponse>;
  getSession: () => Promise<{ data: { session: Session | null }; error: AuthError | null }>;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string | undefined;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('VITE_SUPABASE_URL and VITE_SUPABASE_KEY must be set in the environment');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthState>(undefined);

  const isLoading = user === undefined;
  const isLoggedIn = user !== null && user !== undefined;
  const isLoggedOut = user === null;

  useEffect(() => {
    const loadSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUser({
          email: session.user.email,
          username: session.user.identities?.[0]?.identity_data?.['username'],
        });
      } else {
        setUser(null);
      }
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.email) {
        setUser({
          email: session.user.email,
          username: session.user.identities?.[0]?.identity_data?.['username'],
        });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, username: string, password: string): Promise<AuthResponse> => {
    return supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });
  };

  const signUpWithGoogle = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
  };

  const logIn = async (email: string, password: string): Promise<AuthResponse> => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const logInWithGoogle = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + "/create"},
    });
  };

  const logOut = async (): Promise<void> => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const sendPasswordResetEmail = async (
    email: string
  ): Promise<{ data: object; error: null } | { data: null; error: AuthError }> => {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  };

  const resetPassword = async (password: string): Promise<UserResponse> => {
    return supabase.auth.updateUser({ password });
  };

  const getSession = async (): Promise<{ data: { session: Session | null }; error: AuthError | null }> => {
    return supabase.auth.getSession();
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isLoggedIn,
      isLoggedOut,
      signUp,
      signUpWithGoogle,
      logIn,
      logInWithGoogle,
      logOut,
      sendPasswordResetEmail,
      resetPassword,
      getSession,
    }),
    [user, isLoading, isLoggedIn, isLoggedOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
