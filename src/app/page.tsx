"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import LandingNav from "@/components/landingnav";
import Footer from "@/components/Footer";
import Image from "next/image";
import { GiFishingPole, GiAxeInStump, GiMineralPearls, GiFarmer } from "react-icons/gi";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push('/game');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1510]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#1a1510]">
      <LandingNav />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/AuthBg.jpg"
            alt="Background"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto py-12 sm:py-16 md:py-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-amber-200 mb-6 font-cinzel" 
             style={{ textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}>
            Epic Crafting Adventure
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-amber-100/90 mb-8 max-w-3xl mx-auto" 
             style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
            Embark on a journey through a world of resources, crafting, and adventure. 
            Build your legacy across multiple skills and become a master of the realm.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <button
              onClick={() => router.push('/auth?view=signup')}
              className="px-8 py-4 text-lg font-medium bg-amber-700 hover:bg-amber-600 text-amber-100 rounded-lg border border-amber-500 transition-all duration-300 shadow-xl transform hover:scale-105 font-cinzel"
            >
              Sign Up
            </button>
            
            <button
              onClick={() => router.push('/auth?view=login')}
              className="px-8 py-4 text-lg font-medium bg-transparent hover:bg-amber-900/50 text-amber-200 rounded-lg border border-amber-500 transition-all duration-300 shadow-xl transform hover:scale-105 font-cinzel"
            >
              Login
            </button>
          </div>
        </div>
      </main>
      
      {/* Game Features Section */}
      <section className="py-16 bg-gradient-to-b from-[#1a1510] to-[#2a1f18] relative z-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-amber-200 text-center mb-12 font-cinzel">
            Game Features
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="bg-amber-900/30 rounded-lg p-6 border border-amber-800/50 backdrop-blur-sm transform transition duration-500 hover:scale-105 hover:bg-amber-800/40 h-full flex flex-col">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                <GiFishingPole className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-amber-200 text-center mb-2">Fishing</h3>
              <p className="text-amber-100/80 text-center mt-auto">
                Master the art of fishing in various waters. Catch rare fish and sea creatures to advance your skills.
              </p>
            </div>
            
            <div className="bg-amber-900/30 rounded-lg p-6 border border-amber-800/50 backdrop-blur-sm transform transition duration-500 hover:scale-105 hover:bg-amber-800/40 h-full flex flex-col">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white">
                <GiAxeInStump className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-amber-200 text-center mb-2">Woodcutting</h3>
              <p className="text-amber-100/80 text-center mt-auto">
                Harvest different types of wood from the ancient forests. Craft tools, furniture and more.
              </p>
            </div>
            
            <div className="bg-amber-900/30 rounded-lg p-6 border border-amber-800/50 backdrop-blur-sm transform transition duration-500 hover:scale-105 hover:bg-amber-800/40 h-full flex flex-col">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 text-white">
                <GiMineralPearls className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-amber-200 text-center mb-2">Mining</h3>
              <p className="text-amber-100/80 text-center mt-auto">
                Delve deep into caves to extract precious ores and gems. Discover rare materials for your crafting needs.
              </p>
            </div>
            
            <div className="bg-amber-900/30 rounded-lg p-6 border border-amber-800/50 backdrop-blur-sm transform transition duration-500 hover:scale-105 hover:bg-amber-800/40 h-full flex flex-col">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 text-white">
                <GiFarmer className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-amber-200 text-center mb-2">Farming</h3>
              <p className="text-amber-100/80 text-center mt-auto">
                Grow crops and tend to your farm. Create a sustainable source of ingredients for cooking and crafting.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Character Selection Section */}
      <section className="py-16 bg-gradient-to-b from-[#2a1f18] to-[#1a1510] relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-amber-200 text-center mb-12 font-cinzel">
            Choose Your Character
          </h2>
          
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute -inset-4 bg-amber-900/20 rounded-xl blur-xl"></div>
            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 bg-gradient-to-br from-amber-950/70 to-amber-900/50 p-6 rounded-lg border border-amber-700/50">
              {["Tobi", "Markus", "Sebastian", "Lukas"].map((name, i) => (
                <div key={i} className="flex flex-col items-center p-4 bg-amber-950/50 rounded-lg border border-amber-800/30 transform transition duration-300 hover:scale-105">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-amber-600/80 to-amber-800/80 mb-3 flex items-center justify-center overflow-hidden">
                    <Image
                      src={`/characters/character-${i+1}.png`}
                      alt={name}
                      width={100}
                      height={100}
                      className="object-cover"
                      onError={(e) => {
                        // Fallback image if the custom path fails
                        const target = e.target as HTMLImageElement;
                        target.src = "https://dredge.wiki.gg/images/thumb/f/f0/Fisherman.png/300px-Fisherman.png";
                      }}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-amber-200">{name}</h3>
                  <p className="text-sm text-amber-100/70 text-center mt-2">
                    {["Fisher", "Lumberjack", "Miner", "Farmer"][i]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
     
      
      <section className="py-16 sm:py-20 bg-gradient-to-b from-[#2a1f18] to-[#1a1510] relative">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="/map-bg.jpg"
            alt="Background"
            fill
            className="object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-200 mb-6 font-cinzel" 
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}>
              Your Adventure Awaits
            </h2>
            
            <p className="text-lg sm:text-xl text-amber-100/90 mb-8">
              Join thousands of players and start your journey today. Craft, explore, and build your legacy!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/auth?view=signup')}
                className="px-8 py-4 text-xl font-medium bg-gradient-to-r from-amber-700 to-amber-600 text-amber-100 rounded-lg border border-amber-500 transition-all duration-300 shadow-xl transform hover:scale-105 font-cinzel"
              >
                Start Your Journey
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
