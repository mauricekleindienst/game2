"use client";

import React from 'react';
import CraftingComponent, { CraftableItem } from './CraftingComponent';
import { increaseCharacterExp } from '@/utils/character_util';
import { selectedCharacterId } from './IdleComponent';

export default function CookingHut() {
  const handleItemCrafted = (item: CraftableItem) => {
    if (item.xp && selectedCharacterId) {
      increaseCharacterExp(selectedCharacterId, "cooking", item.xp);
      console.log(`Cooked ${item.name}, gained ${item.xp} XP`);
    }
  };

  return (
    <div className="flex-1 px-4 max-w-6xl mx-auto">
      <CraftingComponent
        title="Cooking Station"
        itemType="food"
        apiEndpoint="/api/game-items?type=craftable-food"
        craftEndpoint="/api/craft-item"
        onItemCrafted={handleItemCrafted}
        colorTheme={{
          primary: 'amber',
          secondary: 'orange',
          text: 'white',
          accent: 'red'
        }}
        actionText={{
          inProgress: 'Cooking...',
          completed: 'Cooked!',
          button: 'Cook',
          buttonActive: 'Cooking...'
        }}
      />
    </div>
  );
}