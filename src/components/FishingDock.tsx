"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Fish {
  id: number;
  name: string;
  level: number;
  xp_reward?: number;
  image_url?: string;
}

export default function FishingDock() {
  const [hoveredSpot, setHoveredSpot] = useState<number | null>(null);
  const [fishData, setFishData] = useState<Fish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchFish = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/game-items?type=fish');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setFishData(data.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        console.error('Error fetching fish data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFish();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="text-amber-700 text-xl">Loading fishing spots...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error loading fishing spots: {error}</p>
          <p>Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-amber-700">Selection of Fish</h2>
      
      <div className="hidden md:grid grid-cols-4 gap-6">
        {fishData.map((spot, index) => (
          <motion.div
            key={spot.id}
            className={`
              relative p-4 rounded-lg shadow-lg
              cursor-pointer
              bg-gradient-to-br from-amber-600 to-amber-800
              border-2 border-amber-900
            `}
            style={{ 
              backgroundColor: '#BA4D00',
              transform: `translateZ(${index * 5}px)`,
              zIndex: hoveredSpot === spot.id ? 50 : index
            }}
            whileHover={{ 
              scale: 1.05,
              zIndex: 50,
              boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)"
            }}
            onMouseEnter={() => setHoveredSpot(spot.id)}
            onMouseLeave={() => setHoveredSpot(null)}
          >
            <div className="text-white">
              <h3 className="font-bold text-lg mb-2">{spot.name}</h3>
            
              {spot.xp_reward && <p className="text-amber-200">XP: {spot.xp_reward}</p>}
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="md:hidden flex flex-col space-y-4">
        {fishData.map((spot, index) => (
          <motion.div
            key={spot.id}
            className={`
              relative p-4 rounded-lg shadow-lg
              cursor-pointer
              bg-gradient-to-br from-amber-600 to-amber-800
              border-2 border-amber-900
            `}
            style={{ 
              backgroundColor: '#BA4D00',
              transform: `translateZ(${index * 2}px)`,
            }}
            whileTap={{ 
              scale: 0.95
            }}
          >
            <div className="text-white">
              <h3 className="font-bold text-lg mb-2">{spot.name}</h3>
             
              {spot.xp_reward && <p className="text-amber-200">XP: {spot.xp_reward}</p>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
