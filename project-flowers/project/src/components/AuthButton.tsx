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

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin, // Redirect after login
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
          <LogIn size={0.1} />
          <span  className="hidden sm:block"></span>
        </>
      )}
    </button>
  );
}
