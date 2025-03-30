"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAudio } from '@/context/AudioContext';
import { useRouter } from 'next/navigation';

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [soundVolume, setSoundVolume] = useState(70);
  const { musicVolume, setMusicVolume } = useAudio();
  const [notifications, setNotifications] = useState(true);
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
    <div className="fixed inset-0 flex items-center justify-center z-[2000]">
      {/* Modal backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal content */}
      <div 
        className="relative z-[2001] w-96 bg-amber-100 dark:bg-gray-800 rounded-lg shadow-xl p-6 
               border-2 border-amber-700 dark:border-amber-600 max-h-[90vh] overflow-y-auto
               animate-fade-in-fast"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-amber-900 font-bold text-xl">Settings</h2>
          <button
            onClick={onClose}
            className="text-amber-900 hover:text-amber-700 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-amber-900 font-semibold">Audio</h3>
            <div className="space-y-3">
              <div>
                <label className="text-amber-900 text-sm">Sound Effects</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={soundVolume}
                    onChange={(e) => setSoundVolume(Number(e.target.value))}
                    className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-amber-900 w-8">{soundVolume}%</span>
                </div>
              </div>
              <div>
                <label className="text-amber-900 text-sm">Music</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={musicVolume}
                    onChange={(e) => setMusicVolume(Number(e.target.value))}
                    className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-amber-900 w-8">{musicVolume}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-amber-900 font-semibold">Game</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-amber-900">Notifications</label>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notifications ? 'bg-green-500' : 'bg-gray-300'
                  } relative`}
                >
                  <span className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-transform ${
                    notifications ? 'right-0.5' : 'left-0.5'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-amber-900 font-semibold">Account</h3>
            <div className="space-y-3">
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 
                  transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting Account...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-amber-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-amber-700 text-amber-100 rounded 
              hover:bg-amber-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}