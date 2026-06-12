import React, { useState } from 'react'; // Added useState
import { useRouter } from 'next/router'; // Added useRouter
import '../index.css'; 
import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script';
import { ThemeProvider } from 'next-themes';

import Navbar from '../components/Navbar'; 
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  // This state controls the mobile sidebar!
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Check if current page is a tool page or home page
  const isLayoutPage = router.pathname === '/' || 
                     router.pathname.startsWith('/pdf-to-word') || 
                     router.pathname.startsWith('/word-to-pdf') || 
                     router.pathname.startsWith('/excel-to-pdf') || 
                     router.pathname.startsWith('/ppt-to-pdf') ||
                     router.pathname.startsWith('/file-merger') ||
                     router.pathname.startsWith('/json-formatter') ||
                     router.pathname.startsWith('/age-calculator') ||
                     router.pathname.startsWith('/emi-calculator') ||
                     router.pathname.startsWith('/gpa-calculator') ||
                     router.pathname.startsWith('/land-converter') ||
                     router.pathname.startsWith('/lok-sewa-age') ||
                     router.pathname.startsWith('/nepali-patro') ||
                     router.pathname.startsWith('/np-domain-letter') ||
                     router.pathname.startsWith('/password-generator') ||
                     router.pathname.startsWith('/photo-resizer') ||
                     router.pathname.startsWith('/preeti-unicode') ||
                     router.pathname.startsWith('/hash-encoder') ||
                     router.pathname.startsWith('/bio-formatter') ||
                     router.pathname.startsWith('/date-converter') ||
                     router.pathname.startsWith('/tax-calculator') ||
                     router.pathname.startsWith('/nea-calculator') ||
                     router.pathname.startsWith('/roman-to-nepali') ||
                     router.pathname.startsWith('/word-counter') ||
                     router.pathname.startsWith('/youtube-tags');

  if (isLayoutPage) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
          
          {/* Global AdSense Script (Uncomment and replace XXXXXX when ready) */}
          {/* 
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          /> 
          */}
          
          {/* Fixed Navbar */}
          <div className="fixed top-0 left-0 right-0 z-50">
            <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          </div>
          
          {/* Desktop Sidebar - Fixed Position */}
          <div className="hidden lg:block fixed left-0 top-15 bottom-0 w-64 bg-white dark:bg-slate-950 z-30">
            <Sidebar onClose={() => setIsSidebarOpen(false)} />
          </div>
          
          <div className="flex flex-grow min-h-0 w-full relative pt-16">
            
            {/* Mobile Sidebar - Overlay */}
            <div className={`fixed inset-x-0 top-15 bottom-0 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:hidden transition duration-200 ease-in-out z-40 w-64 flex-shrink-0 bg-white dark:bg-slate-950 h-[calc(100vh-4rem)]`}>
               <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </div>

            {/* Mobile Overlay: Clicks outside the sidebar close it */}
            {isSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}
            
            <main className="flex-grow flex flex-col w-full min-w-0 min-h-0 overflow-hidden">
              <div className="flex-grow overflow-y-auto p-4 md:p-8">
                <div className="w-full max-w-7xl mx-auto lg:pl-40 lg:max-w-[calc(100vw-16rem)]">
                  <Component {...pageProps} />
                </div>
              </div>
              <Footer />
            </main>

          </div>
          <Analytics />
        </div>
      </ThemeProvider>
    );
  }

  // For non-tool pages (home, blog), render without Layout
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <Component {...pageProps} />
        <Analytics />
      </div>
    </ThemeProvider>
  );
}