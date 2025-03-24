"use client";

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1a1510] text-amber-200 py-8 border-t border-amber-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center md:text-left">
            <h3 className="font-medieval text-lg mb-4" style={{ fontFamily: 'Cinzel, serif' }}>About</h3>
            <p className="text-amber-400/80 text-sm">
              Never finished Idle Game
            </p>
          </div>
          <div className="text-center">
            <h3 className="font-medieval text-lg mb-4" style={{ fontFamily: 'Cinzel, serif' }}>Connect</h3>
            <div className="flex justify-center space-x-4">
              <a href="#" className="text-amber-400/80 hover:text-amber-200 transition-colors">Discord</a>
            </div>
          </div>
          <div className="text-center md:text-right">
            <h3 className="font-medieval text-lg mb-4" style={{ fontFamily: 'Cinzel, serif' }}>Legal</h3>
            <div className="space-y-2">
              <div className="flex flex-col items-center md:items-end space-y-2">
                <Link 
                  href="/legal" 
                  className="text-amber-400/80 hover:text-amber-200 transition-colors"
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  Legal Notice
                </Link>
                <Link 
                  href="/privacy" 
                  className="text-amber-400/80 hover:text-amber-200 transition-colors"
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  Privacy Policy
                </Link>
                <p className="text-amber-400/80 text-sm">© 2024 Game 2. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 