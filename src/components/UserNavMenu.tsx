"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import SettingsModal from './SettingsModal';
import { ThemeColor } from '@/lib/theme';

interface UserNavMenuProps {
  themeColor?: ThemeColor;
  isInModal?: boolean;
  onClose?: () => void;
}

export default function UserNavMenu({ 
  themeColor = 'blue', 
  isInModal = false,
  onClose 
}: UserNavMenuProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      if (isInModal && onClose) {
        onClose();
      }
      
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 100);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getButtonGradient = () => {
    switch (themeColor) {
      case 'red': return 'from-red-400 to-red-600';
      case 'green': return 'from-green-400 to-green-600';
      case 'blue': return 'from-blue-400 to-blue-600';
      case 'purple': return 'from-purple-400 to-purple-600';
      case 'yellow': return 'from-yellow-400 to-yellow-600';
      case 'pink': return 'from-pink-400 to-pink-600';
      case 'indigo': return 'from-indigo-400 to-indigo-600';
      case 'teal': return 'from-teal-400 to-teal-600';
      case 'orange': return 'from-orange-400 to-orange-600';
      case 'gray': return 'from-gray-400 to-gray-600';
      default: return 'from-blue-400 to-blue-600';
    }
  };

  const getRingColor = () => {
    switch (themeColor) {
      case 'red': return 'ring-red-400';
      case 'green': return 'ring-green-400';
      case 'blue': return 'ring-blue-400';
      case 'purple': return 'ring-purple-400';
      case 'yellow': return 'ring-yellow-400';
      case 'pink': return 'ring-pink-400';
      case 'indigo': return 'ring-indigo-400';
      case 'teal': return 'ring-teal-400';
      case 'orange': return 'ring-orange-400';
      case 'gray': return 'ring-gray-400';
      default: return 'ring-blue-400';
    }
  };

  if (isInModal) {
    return (
      <>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col items-center">
          <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getButtonGradient()}
                        flex items-center justify-center shadow-lg mb-3 
                        ring-4 ring-white dark:ring-gray-800`}>
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100">User Account</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Game Menu</p>
        </div>
        
        <div className="p-3">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsSettingsOpen(true);
            }}
            className="w-full px-4 py-3 rounded-lg text-left text-gray-700 dark:text-gray-200 
                     hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors
                     flex items-center gap-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium">Settings</span>
          </button>
          
          <div className="my-2 border-t border-gray-200 dark:border-gray-700"></div>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleLogout();
            }}
            className="w-full px-4 py-3 rounded-lg text-left text-red-600 dark:text-red-400
                     hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors
                     flex items-center gap-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">Logout</span>
          </button>
        </div>
        
        {onClose && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200
                       rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors 
                       font-medium shadow-sm"
            >
              Close
            </button>
          </div>
        )}

        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      </>
    );
  }

  return (
    <>
      <div className="fixed top-8 right-8 z-[9999]" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`w-12 h-12 rounded-full bg-gradient-to-br ${getButtonGradient()}
            flex items-center justify-center hover:scale-110 active:scale-95
            transition-all duration-300 shadow-lg hover:shadow-xl
            ring-2 ring-offset-2 ${getRingColor()} dark:ring-offset-gray-800`}
          aria-label="User menu"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-1 z-[9999]">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsSettingsOpen(true);
                setIsDropdownOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700
                flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLogout();
                setIsDropdownOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20
                flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}