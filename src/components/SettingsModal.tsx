"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { user, signOut, deleteAccount } = useAuth();
  const router = useRouter();

  if (!isOpen) return null;

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      try {
        setIsDeleting(true);
        await deleteAccount();
        await signOut();
        router.push('/');
      } catch (error) {
        console.error('Failed to delete account:', error);
        alert('Failed to delete account. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="fixed inset-0 transition-opacity" 
          onClick={onClose}
        ></div>
        
        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left shadow-xl transition-all w-full max-w-md z-10">
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
          
          <div className="mt-3 text-center sm:mt-0 sm:text-left">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
              Settings
            </h3>
            
            <div className="mt-6 space-y-4">
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="w-full px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting Account...' : 'Delete Account'}
                </button>
               
              </div>
              
              <button
                onClick={onClose}
                className="mt-4 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}