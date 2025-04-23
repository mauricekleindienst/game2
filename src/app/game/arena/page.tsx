"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './arena.module.css';

export default function ArenaPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate loading for a brief moment
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      {loading ? (
        <div className="text-white text-2xl">
          Loading arena battle...
        </div>
      ) : (
        <div className="flex flex-col items-center w-full">
          <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-6">
            Arena Challenge
          </h1>
          <div className="relative w-full max-w-4xl aspect-video">
            <iframe 
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="Rick Astley - Never Gonna Give You Up"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          
          <div className="mt-8 text-white text-center">
            <p className="text-xl mb-4">You just got Rick Rolled!</p>
            <p className="mb-6">The arena feature is coming soon. Stay tuned!</p>
            <button
              onClick={() => router.push('/game')}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Return to Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}