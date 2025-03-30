"use client";

import React, { useState } from 'react';
import IdleComponent, { IdleItem,selectedCharacterId } from './IdleComponent';
import { Fish } from '@/lib/fish';
import { updateInventory } from '@/utils/inventory_util';
import { increaseCharacterExp } from '@/utils/character_util';



export default function FishingDock() {
  const [playerXP, setPlayerXP] = useState<number>(0);
  
  const handleFishCaught = (fish: IdleItem) => {
    const caughtFish = fish as unknown as Fish;
    
    const newXP = playerXP + caughtFish.xp;
    setPlayerXP(newXP);
    
    console.log(`Caught ${caughtFish.name}, gained ${caughtFish.xp} XP. Total XP: ${newXP}`);
    updateInventory("fish",caughtFish.id,1)
    increaseCharacterExp(selectedCharacterId,"fishing",caughtFish.xp)
  };

  return (
    <div className="flex-1 px-4 max-w-6xl mx-auto">
      <IdleComponent
        title="Available Fish Types"
        itemType="fish"
        apiEndpoint="/api/game-items?type=fish"
        onItemClick={handleFishCaught}
        colorTheme={{
          primary: 'blue',
          secondary: 'blue',
          text: 'white',
          accent: 'blue'
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
