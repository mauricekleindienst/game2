"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import LandingNav from "@/components/landingnav";
import Footer from "@/components/Footer";
import Image from "next/image";


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
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/AuthBg.jpg"
            alt="Background"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          
          <button
            onClick={() => router.push('/auth?view=signup')}
            className="px-8 py-3 text-lg font-medium bg-amber-900/80 text-amber-200 rounded-lg border border-amber-700 hover:bg-amber-800 transition-colors shadow-xl"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Join
          </button>
        </div>
       
      </main>

      <Footer />
    </div>
  );
}
