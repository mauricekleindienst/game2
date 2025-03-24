"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import LandingNav from '@/components/landingnav';
import Footer from '@/components/Footer';

export default function LegalNotice() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-[#1a1510]">
      <LandingNav />
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-amber-200 mb-8 text-center"
              style={{ fontFamily: 'Cinzel, serif' }}>
            Legal Notice
          </h1>
          
          <div className="space-y-8 text-amber-200/90">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-amber-200" style={{ fontFamily: 'Cinzel, serif' }}>
                Company Information
              </h2>
              <div className="space-y-2">
                <p>Game II</p>
                <p>Address: Your Company Address</p>
                <p>Email: contact@game2.com</p>
                <p>Registration Number: XX-XXXXX</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-amber-200" style={{ fontFamily: 'Cinzel, serif' }}>
                Disclaimer
              </h2>
              <div className="space-y-2">
                <p>
                  The information provided on this site is for general informational purposes only. 
                  While we strive to keep the information up to date and correct, we make no 
                  representations or warranties of any kind about the completeness, accuracy, 
                  reliability, suitability, or availability of the website or the information, 
                  products, services, or related graphics contained on the website.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-amber-200" style={{ fontFamily: 'Cinzel, serif' }}>
                Intellectual Property
              </h2>
              <div className="space-y-2">
                <p>
                  All content on this website, including but not limited to text, graphics, 
                  logos, images, audio clips, digital downloads, and data compilations, is the 
                  property of Game II and is protected by international copyright laws.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-amber-200" style={{ fontFamily: 'Cinzel, serif' }}>
                Governing Law
              </h2>
              <div className="space-y-2">
                <p>
                  These terms and conditions are governed by and construed in accordance with 
                  the laws of [Your Country] and you irrevocably submit to the exclusive 
                  jurisdiction of the courts in that location.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 