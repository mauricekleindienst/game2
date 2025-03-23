import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'signup';
};

export default function AuthModal({
  isOpen,
  onClose,
  initialView = 'login',
}: AuthModalProps) {
  const [activeView, setActiveView] = useState<'login' | 'signup'>(initialView);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left shadow-xl transition-all w-full max-w-md">
          <div className="absolute top-4 right-4">
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6 flex border-b border-gray-200 dark:border-gray-700">
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeView === 'login'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveView('login')}
            >
              Login
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeView === 'signup'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveView('signup')}
            >
              Sign Up
            </button>
          </div>

          {activeView === 'login' ? <LoginForm /> : <SignupForm />}
        </div>
      </div>
    </div>
  );
} 