import React from 'react';

type WelcomeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left shadow-xl transition-all w-full max-w-md animate-fadeIn">
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

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Welcome to Game2! 🎮</h2>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>Here's a quick guide to get you started:</p>
              
              <div className="text-left space-y-3">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600">1.</span>
                  <p>Choose your character from the character selection menu at the bottom of the screen</p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600">2.</span>
                  <p>Check your inventory by clicking the bag icon in the bottom left</p>
                </div>
                
                <div className="flex items-start space-x-2">
                    <span className="text-blue-600">3.</span>
                    <p>Explore the map to relocate the selected character or upgrade the selected Area</p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600">4.</span>
                  <p>Use the navigation menu at the bottom right for settings</p>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Let's Begin!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 