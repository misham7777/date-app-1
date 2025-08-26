'use client'

import { useRouter } from 'next/navigation'

export const useQuizNavigation = () => {
  const router = useRouter()

  const navigateToQuiz = () => {
    router.push('/quiz')
  }

  return { navigateToQuiz }
}

// For components that can't use hooks directly
export const navigateToQuiz = () => {
  if (typeof window !== 'undefined') {
    window.location.href = '/quiz'
  }
}
