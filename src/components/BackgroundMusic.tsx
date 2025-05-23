"use client";

import React, { useEffect, useRef } from 'react';
import { useAudio } from '@/context/AudioContext';

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { musicVolume } = useAudio();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musicVolume / 100;
    }
  }, [musicVolume]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const audio = new Audio('https://lofistudy.fra1.cdn.digitaloceanspaces.com/Playlist/Background%20mussdsdic.webm');
    audio.loop = true;
    audioRef.current = audio;

    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(err => {
          console.warn("Could not play audio automatically:", err);
        });
        document.removeEventListener('click', playAudio);
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('click', playAudio);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (typeof document !== 'undefined') {
        document.removeEventListener('click', playAudio);
      }
    };
  }, []);

  return null;
}