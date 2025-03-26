"use client";

import React, { useState } from 'react';
import { increaseFishingLevel } from '@/utils/character_util';

const DebugPage = () => {
  const [characterId, setCharacterId] = useState('a1ee6970-51b3-42cd-b7f5-2a00a2965a61'); // Replace with your character ID
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleIncreaseFishingLevel = async () => {
    try {
      const updatedLevel = await increaseFishingLevel(characterId, 1);
      setSuccess(`Fishing level updated successfully: ${updatedLevel}`);
      setError(null);
    } catch (err) {
      
      setSuccess(null);
    }
  };

  return (
    <div>
      <h1>Debug Page</h1>
      <input
        type="text"
        placeholder="Enter Character ID"
        value={characterId}
        onChange={(e) => setCharacterId(e.target.value)}
      />
      <button onClick={handleIncreaseFishingLevel}>Increase Fishing Level by 1</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default DebugPage;