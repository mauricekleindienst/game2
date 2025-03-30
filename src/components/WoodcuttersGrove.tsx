"use client";

import React, { useState } from 'react';
import IdleComponent, { IdleItem } from './IdleComponent';
import { Wood } from '@/lib/wood';

export default function WoodcuttersGrove() {
  const [playerXP, setPlayerXP] = useState<number>(0);
  
  const handleWoodChopped = (item: IdleItem) => {
    const choppedWood = item as unknown as Wood; 
    
    const newXP = playerXP + choppedWood.xp;
    setPlayerXP(newXP);
    
    console.log(`Chopped ${choppedWood.name}, gained ${choppedWood.xp} XP. Total XP: ${newXP}`);
    // HIER MUSS DIE LOGIC HIN
  };

  return (
    <div className="flex-1 px-4 max-w-6xl mx-auto">
      <IdleComponent
        title="Available Tree Types"
        itemType="wood" 
        apiEndpoint="/api/game-items?type=wood" 
        onItemClick={handleWoodChopped}
        colorTheme={{
          primary: 'green', 
          secondary: 'green',
          text: 'white',
          accent: 'green'
        }}
        actionText={{
          inProgress: 'Chopping...',
          completed: 'Chopped!',
          button: 'Start Chopping',
          buttonActive: 'Chopping in Progress'
        }}
        loopActions={true}
      />
    </div>
  );
} 