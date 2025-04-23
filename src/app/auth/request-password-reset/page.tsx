"use client";

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase'; // Adjust import path if needed
import Link from 'next/link';
import Image from 'next/image';

export default function RequestPasswordResetPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    const redirectUrl = `${window.location.origin}/auth/update-password`;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setMessage('Password reset email sent. Please check your inbox (and spam folder).');
      setEmail(''); // Clear the email field on success
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative">
      <Image
        src="/AuthBg.jpg" // Assuming same background as auth page
        alt="Background"
        fill
        className="object-cover"
        priority
      />
      <div className="relative min-h-screen flex flex-col items-center justify-center">
        <div className="w-full max-w-md p-8">
          <div className="bg-[#1a1510]/90 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden border border-amber-900/30">
            <div className="p-8">
              <h2 className="text-2xl font-medieval text-amber-200 mb-6 text-center" style={{ fontFamily: 'Cinzel, serif' }}>
                Reset Password
              </h2>
              {message && (
                <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                  {message}
                </div>
              )}
              {error && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  {error}
                </div>
              )}
              <form onSubmit={handleResetRequest} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-amber-300">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-amber-300 rounded-md shadow-sm
                      focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500
                      bg-amber-50 text-amber-900 placeholder-amber-400"
                    placeholder="Enter your email"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-amber-100
                    bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2
                    focus:ring-amber-500 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              <div className="mt-4 text-center">
                <Link href="/auth?view=login" className="text-sm font-medium text-amber-400 hover:text-amber-200">
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
