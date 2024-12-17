import React, { useEffect, useState } from 'react';
import { LogIn, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthButtonProps {
  user: any;
}

export function AuthButton({ user }: AuthButtonProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Your GitHub user ID from Supabase
  const allowedGitHubUserId = '4a24f365-9220-4f48-96da-7586cdb8bd9b'; // Replace with your actual GitHub user ID

  useEffect(() => {
    // If a user is authenticated, check if it's the authorized GitHub user
    if (user && user.id !== allowedGitHubUserId) {
      supabase.auth.signOut(); // Log out unauthorized users
      setIsAuthorized(false);
    } else {
      setIsAuthorized(true); // User is authorized (i.e., your GitHub account)
    }
  }, [user]);

  // Use this useEffect to handle the OAuth token from the URL
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1)); // remove the '#' from the beginning
      const accessToken = params.get('access_token');
      const providerToken = params.get('provider_token');
      const expiresAt = params.get('expires_at');
      const tokenType = params.get('token_type');

      // If an access token is found in the URL
      if (accessToken) {
        // Log in the user using the token
        supabase.auth.setSession({
          access_token: accessToken,
          provider_token: providerToken,
          expires_at: parseInt(expiresAt || '0'),
          token_type: tokenType,
        });

        // Clear the URL hash after login
        window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
      }
    }
  }, []);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: 'https://jplemos5.github.io/Flower-Garden/', // Redirect after login for the deployed version
      },
    });

    if (error) {
      console.error('Error during login:', error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <button
      onClick={user ? handleLogout : handleLogin}
      className={`fixed bottom-0 left-0 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-2 py-1 rounded-full shadow-lg flex items-center gap-1 transition-all text-sm ${
        user ? "button_color" : "button_no_color"
      }`}
      style={{ position: 'absolute', zIndex: 10001 }}
    >
      {user ? (
        <>
          <LogOut size={14} />
          <span className="hidden sm:block">Sign Out</span>
        </>
      ) : (
        <>
          <LogIn size={14} />
          <span className="hidden sm:block">Sign In</span>
        </>
      )}
    </button>
  );
}
