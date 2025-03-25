"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function LandingNav() {
  const router = useRouter();

  const navigateToAuth = (view: 'login' | 'signup') => {
    router.push(`/auth?view=${view}`);
  };

  return (
    <nav className="bg-[#1a1510] shadow-lg border-b border-amber-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-2xl font-bold text-amber-200 tracking-wide"
                style={{ fontFamily: 'Cinzel, serif' }}>
              Game 2
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateToAuth('login')}
              className="px-4 py-2 text-sm font-medium text-amber-400 hover:text-amber-200 transition-colors"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Login
            </button>
            <button
              onClick={() => navigateToAuth('signup')}
              className="px-6 py-2 text-sm font-medium bg-amber-900/80 text-amber-200 rounded border border-amber-700 hover:bg-amber-800 transition-colors"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Signup 
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
