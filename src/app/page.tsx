"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import LandingNav from "@/components/landingnav";

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">

      <LandingNav />
      
 
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-white mb-8">
          Lutsch Eier
        </h1>
        
        
  
        
        <div className="mt-8 flex justify-center">
          <img 
            src="https://i.etsystatic.com/25272370/r/il/e86ea6/3718922102/il_fullxfull.3718922102_11ac.jpg" 
            alt="Game 2 Preview" 
            className="rounded-lg shadow-xl max-w-md w-full opacity-80 hover:opacity-100 transition-opacity duration-300"
            onError={(e) => e.currentTarget.style.display = 'none'}
          />
        </div>
      </main>
      

    </div>
  );
}
