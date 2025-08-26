'use client'

import { usePathname } from 'next/navigation'
import NavBarWrapper from './navbar-wrapper'

export default function ConditionalNavbar() {
  const pathname = usePathname()
  const isQuizFlow = pathname.startsWith('/quiz') || 
                    pathname.startsWith('/loading') || 
                    pathname.startsWith('/checkout') || 
                    pathname.startsWith('/results')
  
  if (isQuizFlow) {
    return null
  }
  
  return <NavBarWrapper />
}
