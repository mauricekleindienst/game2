"use client";

import React, { useState } from 'react';
import IdleComponent, { IdleItem,selectedCharacterId } from './IdleComponent';
import { Crop } from '@/lib/crops';
import { updateInventory } from '@/utils/inventory_util';
import { increaseCharacterExp } from '@/utils/character_util';

export default function Farmland() {
  const [playerXP, setPlayerXP] = useState<number>(0);
  
  const handleCropHarvested = (item: IdleItem) => {
    const harvestedCrop = item as unknown as Crop; 
    
    const newXP = playerXP + harvestedCrop.xp;
    setPlayerXP(newXP);
    
    console.log(`Harvested ${harvestedCrop.name}, gained ${harvestedCrop.xp} XP. Total XP: ${newXP}`);
    updateInventory("farming_crops",harvestedCrop.id,1)
    increaseCharacterExp(selectedCharacterId,"farming",harvestedCrop.xp)
  };

  return (
    <div className="flex-1 px-4 max-w-6xl mx-auto">
      <IdleComponent
        title="Available Crops"
        itemType="crop" 
        apiEndpoint="/api/game-items?type=crop" 
        onItemClick={handleCropHarvested} 
        colorTheme={{
          primary: 'red', 
          secondary: 'red',
          text: 'white',
          accent: 'red'
        }}
        actionText={{
          inProgress: 'Harvesting...',
          completed: 'Harvested!',
          button: 'Start Farming',
          buttonActive: 'Farming in Progress'
        }}
        loopActions={true} 
      />
    </div>
  );
} 