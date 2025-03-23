"use client";

import React from 'react';

interface StorageProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Storage({ isOpen, onClose }: StorageProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
      w-96 h-96 bg-amber-100 rounded-lg shadow-xl p-4 border-2 border-amber-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-amber-900 font-bold">Storage</h2>
        <button
          onClick={onClose}
          className="text-amber-900 hover:text-amber-700"
        >
          ✕
        </button>
      </div>
    
        <button
          className="px-4 py-2 bg-amber-700 text-amber-100 rounded hover:bg-amber-800 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed"
          disabled
        >
           Leck Eier
        </button>
      </div>

  );
}