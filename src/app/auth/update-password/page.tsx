"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase'; // Assuming you have a client helper

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient(); // Initialize Supabase client

  useEffect(() => {
    // Supabase password recovery sends the token in the URL fragment
    const hash = window.location.hash;
    console.log("URL Fragment (hash):", hash); // Log the hash
    
    if (!hash || hash === '') {
      console.log("No hash found in URL, checking for session");
      // If there's no hash, the user might have been redirected here
      // after the hash was processed on the home page.
      // Check if we already have a session.
      supabase.auth.getSession().then(({ data }) => {
        if (data?.session) {
          console.log("Existing session found");
          setAccessToken(data.session.access_token);
        } else {
          setError("No password reset session found. Please try the reset link again or request a new one.");
        }
      });
      return;
    }
    
    const params = new URLSearchParams(hash.substring(1)); // Remove '#'
    const token = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    console.log("Extracted access_token:", token); // Log the token
    console.log("Extracted refresh_token:", refreshToken); // Log the refresh token

    if (token && refreshToken) {
      // Set the session in the Supabase client using the tokens from the URL
      supabase.auth.setSession({
        access_token: token,
        refresh_token: refreshToken,
      }).then(({ error: sessionError }) => {
        if (sessionError) {
          console.error("Error setting session from URL:", sessionError);
          setError("Failed to process password reset link. Please try again.");
        } else {
          console.log("Session set successfully from URL fragment.");
          setAccessToken(token); // Set state only after session is confirmed
        }
      });
    } else {
      // Check if there's an error in the fragment instead
      const errorDescription = params.get('error_description');
      if (errorDescription) {
        setError(`Error during password reset: ${decodeURIComponent(errorDescription)}`);
      } else if (!token) {
        setError("Password reset access token not found in URL. Please ensure you've followed the link from your email correctly, or request a new one.");
      } else if (!refreshToken) {
        setError("Password reset refresh token not found in URL. Please ensure you've followed the link from your email correctly, or request a new one.");
      }
    }
  }, [supabase.auth]); // Add supabase.auth as dependency

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!accessToken) {
      setError("Missing access token. Cannot reset password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) { // Example: Enforce minimum password length
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        throw updateError;
      }

      setMessage("Password updated successfully! Redirecting to login...");
      setTimeout(() => {
        router.push('/auth'); // Redirect to login page after success
      }, 3000);

    } catch (err) {
      console.error("Password update error:", err);
      setError(err instanceof Error ? err.message : 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md border border-amber-200">
        <h2 className="text-2xl font-bold text-center text-amber-900 mb-6">Set New Password</h2>

        {!accessToken && error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        {accessToken && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}
            {message && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                {message}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-amber-900">
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-amber-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 text-amber-900 placeholder-amber-400"
                placeholder="Enter new password"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-amber-900">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-amber-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 text-amber-900 placeholder-amber-400"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !accessToken}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-amber-100 bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
