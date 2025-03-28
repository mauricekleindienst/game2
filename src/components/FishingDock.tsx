"use client";

import React, { useState } from 'react';
import IdleComponent, { IdleItem } from './IdleComponent';
import { Fish } from '@/lib/fish';

export default function FishingDock() {
  const [playerXP, setPlayerXP] = useState<number>(0);
  
  const handleFishCaught = (fish: IdleItem) => {
    const caughtFish = fish as unknown as Fish;
    
    const newXP = playerXP + caughtFish.xp;
    setPlayerXP(newXP);
  };

  return (
    // Using a very low z-index to ensure it's below other UI elements
    <div className="flex-1 mt-45 mb-28 px-4 max-w-6xl mx-auto" style={{ zIndex: 1 }}>
      <IdleComponent
        title="Available Fish Types"
        itemType="fish"
        apiEndpoint="/api/game-items?type=fish"
        onItemClick={handleFishCaught}
        colorTheme={{
          primary: 'blue',
          secondary: 'indigo',
          text: 'white',
          accent: 'cyan'
        }}
        actionText={{
          inProgress: 'Fishing...',
          completed: 'Caught!',
          button: 'Start Fishing for',
          buttonActive: 'Fishing in Progress'
        }}
        loopActions={true}
      />
    </div>
  );
}
