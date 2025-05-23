"use client";

import React, { useState } from 'react';
import IdleComponent, { IdleItem,selectedCharacterId } from './IdleComponent';
import { Ore } from '@/lib/ores';
import { updateInventory } from '@/utils/inventory_util';
import { increaseCharacterExp } from '@/utils/character_util';
export default function MiningCave() {
  const [playerXP, setPlayerXP] = useState<number>(0);
  

  const handleOreMined = (item: IdleItem) => {
    const minedOre = item as unknown as Ore; 
    
    const newXP = playerXP + minedOre.xp;
    setPlayerXP(newXP);
    
    console.log(`Mined ${minedOre.name}, gained ${minedOre.xp} XP. Total XP: ${newXP}`);
    updateInventory("ores",minedOre.id,1)
    increaseCharacterExp(selectedCharacterId,"mining",minedOre.xp)
  };

  return (
    <div className="flex-1 px-4 max-w-6xl mx-auto">
      <IdleComponent
        title="Available Ore Veins"
        itemType="ore" 
        apiEndpoint="/api/game-items?type=ore" 
        onItemClick={handleOreMined} 
        colorTheme={{
          primary: 'purple', 
          secondary: 'purple',
          text: 'white',
          accent: 'purple'
        }}
        actionText={{
          inProgress: 'Mining...',
          completed: 'Mined!',
          button: 'Start Mining',
          buttonActive: 'Mining in Progress'
        }}
        loopActions={true} 
      />
    </div>
  );
} 