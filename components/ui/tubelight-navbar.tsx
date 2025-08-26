"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { LucideIcon, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [isMobile, setIsMobile] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('EN')

  const languageOptions = [
    { code: 'FR', name: 'French' },
    { code: 'EN', name: 'English' },
    { code: 'ES', name: 'Spanish' },
    { code: 'PT', name: 'Portuguese' },
    { code: 'IT', name: 'Italian' },
    { code: 'DE', name: 'German' },
    { code: 'PL', name: 'Polish' },
  ]

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    setIsMenuOpen(false);
    console.log(`Language changed to: ${languageCode}`);
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      className={cn(
        "fixed top-6 left-1/2 -translate-x-1/2 z-[9999] pt-6",
        className,
      )}
    >
      <div className="flex items-center gap-3 bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-700 backdrop-blur-lg py-2 px-2 rounded-full shadow-xl">
        {/* Home Menu Item */}
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-4 py-3 rounded-full transition-colors",
                "text-gray-700 dark:text-gray-300 hover:text-primary",
                isActive && "bg-primary/10 text-primary",
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={24} strokeWidth={2} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                    <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </Link>
          )
        })}

        {/* Language Menu Button */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary rounded-full transition-colors"
          >
            <span className="hidden md:inline">{selectedLanguage}</span>
            {isMenuOpen ? (
              <X size={16} className="text-gray-500" />
            ) : (
              <Menu size={16} className="text-gray-500" />
            )}
          </button>

          {/* Language Dropdown */}
          {isMenuOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-700 backdrop-blur-lg rounded-2xl shadow-xl p-2 min-w-[180px]">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-3 py-2">
                Language
              </div>
              {languageOptions.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language.code)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors duration-200 text-sm font-medium ${
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
          )}
        </div>
      </div>

      {/* Backdrop to close dropdown when clicking outside */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-[-1]" 
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  )
}
