"use client";

import React, { useState } from 'react';
import { GiSchoolBag, GiFishBucket  } from 'react-icons/gi';
import Storage from '@/components/Storage';

export default function Inventory() {
  const [isOpen, setIsOpen] = useState(false);
  const [isStorageOpen, setIsStorageOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 left-8 w-16 h-16 rounded-full bg-gradient-to-br from-amber-700 to-amber-900
          hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1
          flex items-center justify-center"
        aria-label="Toggle inventory"
      >
        <GiSchoolBag className="w-8 h-8 text-amber-100" />
      </button>

      {isOpen && (
        <div className="fixed bottom-28 left-8 w-64 h-80 bg-amber-100 rounded-lg shadow-xl p-4 border-2 border-amber-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-amber-900 font-bold">Inventar</h2>
            <button
              onClick={() => setIsStorageOpen(!isStorageOpen)}
              className="px-3 py-1 bg-amber-700 text-amber-100 rounded hover:bg-amber-800 transition-colors"
            >
              Storage
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className="w-12 h-12 bg-amber-200 rounded border border-amber-600 relative flex items-center justify-center">
              <GiFishBucket  className="w-8 h-8 text-blue-600" />
              <span className="absolute bottom-0 left-0 bg-amber-700 text-amber-100 text-xs px-1 rounded-tl">69</span>
            </div>
            {[...Array(15)].map((_, i) => (
              <div key={i} className="w-12 h-12 bg-amber-200 rounded border border-amber-600" />
            ))}
          </div>
        </div>
      )}

      <Storage isOpen={isStorageOpen} onClose={() => setIsStorageOpen(false)} />
    </>
  );
}