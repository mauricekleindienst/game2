"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAudio } from '@/context/AudioContext';
import { useRouter } from 'next/navigation';
import { ThemeColor, setThemeByColor } from '@/lib/theme';
import { FiMusic, FiVolume2, FiUser, FiMonitor, FiSun, FiMoon, FiSliders, FiX, FiSave, FiAlertTriangle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type SettingsTab = 'audio' | 'display' | 'gameplay' | 'account';

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  // Settings tabs
  const [activeTab, setActiveTab] = useState<SettingsTab>('audio');
  
  // Audio settings
  const [soundVolume, setSoundVolume] = useState(70);
  const { musicVolume, setMusicVolume } = useAudio();
  const [ambientSoundsEnabled, setAmbientSoundsEnabled] = useState(true);
  
  // Display settings
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [themeColor, setThemeColor] = useState<ThemeColor>('blue');
  const [pixelatedMode, setPixelatedMode] = useState(false);
  const [particles, setParticles] = useState(true);
  
  // Gameplay settings
  const [autoSave, setAutoSave] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [tutorialTips, setTutorialTips] = useState(true);
  const [autoCollect, setAutoCollect] = useState(false);
  

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  
  const { user, signOut, deleteAccount } = useAuth();
  const router = useRouter();

 
  useEffect(() => {
    if (typeof window !== 'undefined') {

      const savedSoundVolume = localStorage.getItem('soundVolume');
      if (savedSoundVolume) setSoundVolume(parseInt(savedSoundVolume));
      
      const savedAmbientSounds = localStorage.getItem('ambientSoundsEnabled');
      if (savedAmbientSounds !== null) setAmbientSoundsEnabled(savedAmbientSounds === 'true');

      const savedDarkMode = localStorage.getItem('darkMode');
      if (savedDarkMode !== null) setIsDarkMode(savedDarkMode === 'true');
      
      const savedThemeColor = localStorage.getItem('themeColor') as ThemeColor | null;
      if (savedThemeColor) setThemeColor(savedThemeColor);
      
      const savedPixelatedMode = localStorage.getItem('pixelatedMode');
      if (savedPixelatedMode !== null) setPixelatedMode(savedPixelatedMode === 'true');
      
      const savedParticles = localStorage.getItem('particles');
      if (savedParticles !== null) setParticles(savedParticles === 'true');
      const savedAutoSave = localStorage.getItem('autoSave');
      if (savedAutoSave !== null) setAutoSave(savedAutoSave === 'true');
      
      const savedNotifications = localStorage.getItem('notifications');
      if (savedNotifications !== null) setNotifications(savedNotifications === 'true');
      
      const savedTutorialTips = localStorage.getItem('tutorialTips');
      if (savedTutorialTips !== null) setTutorialTips(savedTutorialTips === 'true');
      
      const savedAutoCollect = localStorage.getItem('autoCollect');
      if (savedAutoCollect !== null) setAutoCollect(savedAutoCollect === 'true');
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem('soundVolume', soundVolume.toString());
    localStorage.setItem('ambientSoundsEnabled', ambientSoundsEnabled.toString());
    localStorage.setItem('darkMode', isDarkMode.toString());
    localStorage.setItem('themeColor', themeColor);
    localStorage.setItem('pixelatedMode', pixelatedMode.toString());
    localStorage.setItem('particles', particles.toString());
    localStorage.setItem('autoSave', autoSave.toString());
    localStorage.setItem('notifications', notifications.toString());
    localStorage.setItem('tutorialTips', tutorialTips.toString());
    localStorage.setItem('autoCollect', autoCollect.toString());
    
 
    setThemeByColor(themeColor);
    document.documentElement.classList.toggle('dark', isDarkMode);
    
 
    const saveButton = document.getElementById('save-settings-button');
    if (saveButton) {
      saveButton.textContent = "Saved!";
      setTimeout(() => {
        if (saveButton) saveButton.textContent = "Save Settings";
      }, 1500);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      return;
    }
    
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
      setShowDeleteConfirmation(false);
      setDeleteConfirmText('');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 flex items-center justify-center z-[2000]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm" 
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
        
        <motion.div 
          className="relative z-[2001] w-full max-w-2xl bg-gradient-to-b from-amber-50 to-amber-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-2xl 
                     border border-amber-200 dark:border-amber-900/50 max-h-[90vh] overflow-hidden
                     flex flex-col mx-4"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-5 border-b border-amber-200 dark:border-gray-700">
            <h2 className="text-amber-900 dark:text-amber-100 font-bold text-xl flex items-center">
              <FiSliders className="mr-2" /> Settings
            </h2>
            <button
              onClick={onClose}
              className="text-amber-900 dark:text-amber-100 hover:text-amber-700 dark:hover:text-amber-300 transition-colors p-2 rounded-full hover:bg-amber-200 dark:hover:bg-gray-700"
              aria-label="Close"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="flex border-b border-amber-200 dark:border-gray-700 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('audio')}
              className={`px-5 py-3 flex items-center text-sm font-medium ${
                activeTab === 'audio'
                  ? 'text-amber-900 dark:text-amber-300 border-b-2 border-amber-500 dark:border-amber-400'
                  : 'text-amber-700 dark:text-amber-100/70 hover:text-amber-900 dark:hover:text-amber-100'
              }`}
            >
              <FiMusic className="mr-2" /> Audio
            </button>
            <button
              onClick={() => setActiveTab('display')}
              className={`px-5 py-3 flex items-center text-sm font-medium ${
                activeTab === 'display'
                  ? 'text-amber-900 dark:text-amber-300 border-b-2 border-amber-500 dark:border-amber-400'
                  : 'text-amber-700 dark:text-amber-100/70 hover:text-amber-900 dark:hover:text-amber-100'
              }`}
            >
              <FiMonitor className="mr-2" /> Display
            </button>
            <button
              onClick={() => setActiveTab('gameplay')}
              className={`px-5 py-3 flex items-center text-sm font-medium ${
                activeTab === 'gameplay'
                  ? 'text-amber-900 dark:text-amber-300 border-b-2 border-amber-500 dark:border-amber-400'
                  : 'text-amber-700 dark:text-amber-100/70 hover:text-amber-900 dark:hover:text-amber-100'
              }`}
            >
              <FiSliders className="mr-2" /> Gameplay
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className={`px-5 py-3 flex items-center text-sm font-medium ${
                activeTab === 'account'
                  ? 'text-amber-900 dark:text-amber-300 border-b-2 border-amber-500 dark:border-amber-400'
                  : 'text-amber-700 dark:text-amber-100/70 hover:text-amber-900 dark:hover:text-amber-100'
              }`}
            >
              <FiUser className="mr-2" /> Account
            </button>
          </div>

          <div className="p-5 overflow-y-auto flex-grow">
            {activeTab === 'audio' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <label className="text-amber-900 dark:text-amber-100 font-medium flex items-center">
                        <FiVolume2 className="mr-2" /> Sound Effects
                      </label>
                      <span className="text-amber-900 dark:text-amber-100">{soundVolume}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={soundVolume}
                      onChange={(e) => setSoundVolume(Number(e.target.value))}
                      className="w-full h-2 bg-amber-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <label className="text-amber-900 dark:text-amber-100 font-medium flex items-center">
                        <FiMusic className="mr-2" /> Music
                      </label>
                      <span className="text-amber-900 dark:text-amber-100">{musicVolume}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={musicVolume}
                      onChange={(e) => setMusicVolume(Number(e.target.value))}
                      className="w-full h-2 bg-amber-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <label className="text-amber-900 dark:text-amber-100 font-medium">Enable Ambient Sounds</label>
                    <button
                      onClick={() => setAmbientSoundsEnabled(!ambientSoundsEnabled)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        ambientSoundsEnabled ? 'bg-amber-500 dark:bg-amber-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      aria-checked={ambientSoundsEnabled}
                      role="switch"
                    >
                      <span className={`absolute w-5 h-5 rounded-full bg-white shadow-sm top-0.5 transition-transform transform ${
                        ambientSoundsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'display' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-amber-900 dark:text-amber-100 font-medium flex items-center">
                    <FiMoon className="mr-2" /> Dark Mode
                  </label>
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      isDarkMode ? 'bg-amber-500 dark:bg-amber-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    aria-checked={isDarkMode}
                    role="switch"
                  >
                    <span className={`absolute w-5 h-5 rounded-full bg-white shadow-sm top-0.5 transition-transform transform ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <label className="text-amber-900 dark:text-amber-100 font-medium block">Theme Color</label>
                  <div className="grid grid-cols-5 gap-2">
                    {['blue', 'green', 'red', 'purple', 'yellow', 'pink', 'indigo', 'teal', 'orange', 'gray'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setThemeColor(color as ThemeColor)}
                        className={`w-full aspect-square rounded-full ${
                          color === 'blue' ? 'bg-blue-500' :
                          color === 'green' ? 'bg-green-500' :
                          color === 'red' ? 'bg-red-500' :
                          color === 'purple' ? 'bg-purple-500' :
                          color === 'yellow' ? 'bg-yellow-500' :
                          color === 'pink' ? 'bg-pink-500' :
                          color === 'indigo' ? 'bg-indigo-500' :
                          color === 'teal' ? 'bg-teal-500' :
                          color === 'orange' ? 'bg-orange-500' :
                          'bg-gray-500'
                        } ${themeColor === color ? 'ring-2 ring-offset-2 ring-amber-600 dark:ring-amber-300' : ''}`}
                        aria-label={`${color} theme`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-amber-900 dark:text-amber-100 font-medium">Pixelated Mode</label>
                  <button
                    onClick={() => setPixelatedMode(!pixelatedMode)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      pixelatedMode ? 'bg-amber-500 dark:bg-amber-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    aria-checked={pixelatedMode}
                    role="switch"
                  >
                    <span className={`absolute w-5 h-5 rounded-full bg-white shadow-sm top-0.5 transition-transform transform ${
                      pixelatedMode ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-amber-900 dark:text-amber-100 font-medium">Enable Particles</label>
                  <button
                    onClick={() => setParticles(!particles)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      particles ? 'bg-amber-500 dark:bg-amber-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    aria-checked={particles}
                    role="switch"
                  >
                    <span className={`absolute w-5 h-5 rounded-full bg-white shadow-sm top-0.5 transition-transform transform ${
                      particles ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'gameplay' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-amber-900 dark:text-amber-100 font-medium">Auto-Save</label>
                  <button
                    onClick={() => setAutoSave(!autoSave)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      autoSave ? 'bg-amber-500 dark:bg-amber-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    aria-checked={autoSave}
                    role="switch"
                  >
                    <span className={`absolute w-5 h-5 rounded-full bg-white shadow-sm top-0.5 transition-transform transform ${
                      autoSave ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-amber-900 dark:text-amber-100 font-medium">Game Notifications</label>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      notifications ? 'bg-amber-500 dark:bg-amber-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    aria-checked={notifications}
                    role="switch"
                  >
                    <span className={`absolute w-5 h-5 rounded-full bg-white shadow-sm top-0.5 transition-transform transform ${
                      notifications ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-amber-900 dark:text-amber-100 font-medium">Show Tutorial Tips</label>
                  <button
                    onClick={() => setTutorialTips(!tutorialTips)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      tutorialTips ? 'bg-amber-500 dark:bg-amber-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    aria-checked={tutorialTips}
                    role="switch"
                  >
                    <span className={`absolute w-5 h-5 rounded-full bg-white shadow-sm top-0.5 transition-transform transform ${
                      tutorialTips ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-amber-900 dark:text-amber-100 font-medium">Auto-Collect Resources</label>
                  <button
                    onClick={() => setAutoCollect(!autoCollect)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      autoCollect ? 'bg-amber-500 dark:bg-amber-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    aria-checked={autoCollect}
                    role="switch"
                  >
                    <span className={`absolute w-5 h-5 rounded-full bg-white shadow-sm top-0.5 transition-transform transform ${
                      autoCollect ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6">
                <div className="bg-amber-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-amber-900 dark:text-amber-100 font-medium mb-2">Account Information</h3>
                  <div className="space-y-2">
                    <p className="text-amber-700 dark:text-amber-200 text-sm flex items-center">
                      <span className="font-medium mr-2">Email:</span> 
                      {user?.email || 'Not available'}
                    </p>
                    <p className="text-amber-700 dark:text-amber-200 text-sm flex items-center">
                      <span className="font-medium mr-2">Account created:</span>
                      {user ? 'Active account' : 'Not available'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-amber-900 dark:text-amber-100 font-medium">Danger Zone</h3>
                  
                  {showDeleteConfirmation ? (
                    <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="flex items-center mb-4 text-red-600 dark:text-red-400">
                        <FiAlertTriangle className="w-5 h-5 mr-2" />
                        <h4 className="font-medium">Delete your account</h4>
                      </div>
                      
                      <p className="text-red-700 dark:text-red-300 text-sm mb-4">
                        This action is permanent. All your data will be permanently deleted.
                        Type "DELETE" to confirm.
                      </p>
                      
                      <div className="mb-4">
                        <input
                          type="text"
                          value={deleteConfirmText}
                          onChange={(e) => setDeleteConfirmText(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-red-300 dark:border-red-700 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Type DELETE"
                        />
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={handleDeleteAccount}
                          disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 
                            transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                        </button>
                        
                        <button
                          onClick={() => {
                            setShowDeleteConfirmation(false);
                            setDeleteConfirmText('');
                          }}
                          className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowDeleteConfirmation(true)}
                      className="px-4 py-2 bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 rounded border border-red-300 dark:border-red-700
                        hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      Delete Account
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-amber-200 dark:border-gray-700 p-4 flex justify-end bg-amber-50 dark:bg-gray-800">
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg
                  hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              
              <button
                id="save-settings-button"
                onClick={saveSettings}
                className="px-6 py-2 bg-amber-600 text-white rounded-lg 
                  hover:bg-amber-700 transition-colors flex items-center"
              >
                <FiSave className="mr-2" /> Save Settings
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}