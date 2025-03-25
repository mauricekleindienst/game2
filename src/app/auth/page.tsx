"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import LoginForm from '@/components/LoginForm';
import SignupForm from '@/components/SignupForm';
import Image from 'next/image';

export default function AuthPage() {
  const searchParams = useSearchParams();
  const [activeView, setActiveView] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    const view = searchParams.get('view');
    if (view === 'login' || view === 'signup') {
      setActiveView(view);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen relative">
      <Image
        src="/AuthBg.jpg"
        alt="Background"
        fill
        className="object-cover"
        priority
      />
      <div className="relative min-h-screen flex flex-col items-center">
        <div className="mt-12 mb-8 text-center">
          <h1 className="text-8xl font-medieval text-amber-100 tracking-wide" 
              style={{ 
                textShadow: '0 2px 4px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.3)',
                fontFamily: 'Cinzel, serif'
              }}>
            Welcome to Game 2
          </h1>
         
        </div>

        <div className="w-full max-w-md p-8">
  
          
          <div className="bg-[#1a1510]/90 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden border border-amber-900/30">
            <div className="flex border-b border-amber-900/30">
              <button
                className={`flex-1 px-6 py-4 text-base font-medieval transition-colors ${
                  activeView === 'login'
                    ? 'text-amber-200 border-b-2 border-amber-500 font-bold bg-amber-900/40'
                    : 'text-amber-400 hover:text-amber-200 hover:bg-amber-900/20'
                }`}
                style={{ fontFamily: 'Cinzel, serif' }}
                onClick={() => setActiveView('login')}
              >
                Login
              </button>
              <button
                className={`flex-1 px-6 py-4 text-base font-medieval transition-colors ${
                  activeView === 'signup'
                    ? 'text-amber-200 border-b-2 border-amber-500 font-bold bg-amber-900/40'
                    : 'text-amber-400 hover:text-amber-200 hover:bg-amber-900/20'
                }`}
                style={{ fontFamily: 'Cinzel, serif' }}
                onClick={() => setActiveView('signup')}
              >
                Signup
              </button>
            </div>

            <div className="p-8">
              {activeView === 'login' ? <LoginForm /> : <SignupForm />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 