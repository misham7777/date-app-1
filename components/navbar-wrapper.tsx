"use client"

import { NavBar } from "@/components/ui/tubelight-navbar";
import { Home, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function NavBarWrapper() {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');

  const navItems = [
    { name: "Home", url: "/", icon: Home },
  ];

  const languageOptions = [
    { code: 'FR', name: 'French' },
    { code: 'EN', name: 'English' },
    { code: 'ES', name: 'Spanish' },
    { code: 'PT', name: 'Portuguese' },
    { code: 'IT', name: 'Italian' },
    { code: 'DE', name: 'German' },
    { code: 'PL', name: 'Polish' },
  ];

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    setIsMenuOpen(false);
    // Here you can add logic to change the app language
    console.log(`Language changed to: ${languageCode}`);
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      console.log('Window width:', window.innerWidth, 'Mobile:', mobile);
      setIsMobile(mobile);
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Set initial state immediately
    handleResize();
    handleScroll();
    
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Always show debug info and mobile menu for testing
  return (
    <>
      {/* Always visible debug info */}
      <div className="fixed top-2 left-2 z-[9999] bg-red-500 text-white px-2 py-1 text-xs rounded">
        Width: {typeof window !== 'undefined' ? window.innerWidth : 'SSR'} | Mobile: {isMobile ? 'Yes' : 'No'}
      </div>
      
      {/* Mobile burger menu - hidden on desktop */}
      {isMobile && (
        <div className="fixed top-6 right-4 z-[9999]">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="bg-black/70 border border-gray-300/70 p-3 rounded-full shadow-xl hover:scale-105 transition-transform duration-200"
          >
            {isMenuOpen ? (
              <X size={24} className="text-white" />
            ) : (
              <Menu size={24} className="text-white" />
            )}
          </button>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute top-20 right-4 bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-700 backdrop-blur-lg rounded-2xl shadow-xl p-4 min-w-[200px] max-w-[280px]">
            <nav className="flex flex-col gap-2">
              {/* Home Menu Item */}
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors duration-200 font-medium"
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </a>
              ))}
              
              {/* Language Selection Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Language
                </div>
                {languageOptions.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageSelect(language.code)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors duration-200 font-medium ${
                      selectedLanguage === language.code
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5'
                    }`}
                    aria-label={`Select ${language.name} language`}
                  >
                    <span>{language.code}</span>
                    {selectedLanguage === language.code && (
                      <span className="ml-auto text-primary">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Show desktop navbar only on larger screens */}
      {!isMobile && <NavBar items={navItems} />}
    </>
  );
}
