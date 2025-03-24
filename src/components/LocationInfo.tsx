"use client";

import React from 'react';
import { Location } from './GameNav';

type LocationInfoProps = {
  selectedLocation: Location | null;
};

export default function LocationInfo({ selectedLocation }: LocationInfoProps) {
  return (
    <div className="fixed right-8 top-34 w-64 bg-amber-100 rounded-lg shadow-xl p-4 border-2 border-amber-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-amber-900 font-bold">Location Info</h2>
      </div>
      
      {selectedLocation ? (
        <>
          <div className="flex items-center gap-3 p-2 mb-4 bg-amber-200 rounded border border-amber-600">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${selectedLocation.gradient} flex items-center justify-center`}>
              {selectedLocation.icon}
            </div>
            <span className="text-amber-900 font-semibold">{selectedLocation.name}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 hover:bg-amber-50 rounded">
              <span className="text-amber-900">Level</span>
              <span className="text-amber-700 font-medium">3</span>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-amber-50 rounded">
              <span className="text-amber-900">Resources</span>
              <span className="text-amber-700 font-medium">247</span>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-amber-50 rounded">
              <span className="text-amber-900">Workers</span>
              <span className="text-amber-700 font-medium">5/8</span>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-amber-50 rounded">
              <span className="text-amber-900">Production</span>
              <span className="text-amber-700 font-medium">12/h</span>
            </div>
            <div className="flex justify-between items-center p-2 hover:bg-amber-50 rounded">
              <span className="text-amber-900">Efficiency</span>
              <span className="text-amber-700 font-medium">87%</span>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-amber-900 py-4">
          Select a location to view details
        </div>
      )}
    </div>
  );
} 