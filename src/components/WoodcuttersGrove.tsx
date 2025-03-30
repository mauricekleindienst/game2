"use client";

import React, { useState } from 'react';
import IdleComponent, { IdleItem,selectedCharacterId } from './IdleComponent';
import { Wood } from '@/lib/wood';
import { updateInventory } from '@/utils/inventory_util';
import { increaseCharacterExp } from '@/utils/character_util';

export default function WoodcuttersGrove() {
  const [playerXP, setPlayerXP] = useState<number>(0);
  
  const handleWoodChopped = (item: IdleItem) => {
    const choppedWood = item as unknown as Wood; 
    
    const newXP = playerXP + choppedWood.xp;
    setPlayerXP(newXP);
    
    console.log(`Chopped ${choppedWood.name}, gained ${choppedWood.xp} XP. Total XP: ${newXP}`);
    updateInventory("wood",choppedWood.id,1)
    increaseCharacterExp(selectedCharacterId,"cutting",choppedWood.xp)
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