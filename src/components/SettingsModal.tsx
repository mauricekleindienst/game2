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
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
      w-96 bg-amber-100 rounded-lg shadow-xl p-4 border-2 border-amber-700
      animate-fadeIn z-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-amber-900 font-bold text-xl">Settings</h2>
        <button
          onClick={onClose}
          className="text-amber-900 hover:text-amber-700 transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        <div className="pt-4 space-y-2">
          <button
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Deleting Account...' : 'Delete Account'}
          </button>
        
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-amber-700 text-amber-100 rounded 
            hover:bg-amber-800 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}