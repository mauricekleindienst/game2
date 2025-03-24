"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type AudioContextType = {
  musicVolume: number;
  setMusicVolume: (volume: number) => void;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const DEFAULT_MUSIC_VOLUME = 20;

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [musicVolume, setMusicVolume] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedVolume = localStorage.getItem('musicVolume');
      return savedVolume ? parseInt(savedVolume, 10) : DEFAULT_MUSIC_VOLUME;
    }
    return DEFAULT_MUSIC_VOLUME;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('musicVolume', musicVolume.toString());
    }
  }, [musicVolume]);

  return (
    <AudioContext.Provider value={{ musicVolume, setMusicVolume }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}