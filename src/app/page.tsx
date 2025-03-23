"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'signup'>('login');
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to the game page
  useEffect(() => {
    if (user && !loading) {
      router.push('/game');
    }
  }, [user, loading, router]);

  const openLoginModal = () => {
    setAuthModalView('login');
    setIsAuthModalOpen(true);
  };

  const openSignupModal = () => {
    setAuthModalView('signup');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Show loading spinner while authentication state is loading
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-8">
          Game 2
        </h1>
        
        {user ? (
          <div className="flex flex-col items-center mt-8">
            <p className="text-lg mb-4 dark:text-white">
              Welcome, <span className="font-medium">{user.email}</span>!
            </p>
            <button 
              onClick={handleLogout}
              className="px-8 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button 
              onClick={openLoginModal}
              className="px-8 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
            <button 
              onClick={openSignupModal}
              className="px-8 py-3 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              Sign Up
            </button>
          </div>
        )}
      </main>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={closeAuthModal} 
        initialView={authModalView} 
      />
    </div>
  );
}
