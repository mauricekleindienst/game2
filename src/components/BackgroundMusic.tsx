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
    const audio = new Audio('https://lofistudy.fra1.cdn.digitaloceanspaces.com/Playlist/Background%20music.webm');
    audio.loop = true;
    audioRef.current = audio;

    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current.play();
        document.removeEventListener('click', playAudio);
      }
    };

    document.addEventListener('click', playAudio);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      document.removeEventListener('click', playAudio);
    };
  }, []);

  return null;
}