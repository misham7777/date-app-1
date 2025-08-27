'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, MapPin } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { trackLoadingEvent, trackFunnelStep, trackPageView } from '@/lib/supabase-tracking'

function LoadingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [percentage] = useState(97)
  const [profileCount, setProfileCount] = useState(0)
  const [progressBar, setProgressBar] = useState(0)
  const [currentMessage, setCurrentMessage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const [countdown, setCountdown] = useState(10)

  // Get quiz data from URL params
  const name = searchParams.get('name') || 'User'
  const age = searchParams.get('age') || '25'
  const location = searchParams.get('location') || 'Warsaw, Poland'
  const lat = searchParams.get('lat') || '52.153794'
  const lng = searchParams.get('lng') || '21.078421'

  // Mapbox API configuration
  const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZnJlZGJrayIsImEiOiJjbTJqeWVkczIwYzE5MmpyMGp6OTY1ODgzIn0.MiNzEcVX_atB-tG6y3KQkw'
  const MAPBOX_STYLE = 'mapbox/streets-v12'

  const getMapUrl = (lat: string, lng: string, zoom: number = 14) => {
    return `https://api.mapbox.com/styles/v1/${MAPBOX_STYLE}/static/${lng},${lat},${zoom},0/900x900?access_token=${MAPBOX_ACCESS_TOKEN}`
  }

  const loadingMessages = [
    "Scanning 50+ dating platforms...",
    "Analyzing facial recognition patterns...",
    "Cross-referencing location data...",
    "Comparing profile information...",
    "Generating intelligence report..."
  ]

  // Initialize tracking on component mount
  useEffect(() => {
    const initializeTracking = async () => {
      // Track page view
      await trackPageView('/loading', 'Loading - Relationship Intel')

      // Track funnel step
      await trackFunnelStep({
        funnel_step: 'loading_start',
        step_order: 2,
        is_completed: false
      })

      // Track loading started
      await trackLoadingEvent({
        event_type: 'started',
        progress_percentage: 0,
        profiles_analyzed: 0,
        loading_message: loadingMessages[0]
      })
    }

    initializeTracking()
  }, [])

  useEffect(() => {
    // Animate profile count (0 to 250,000)
    const profileInterval = setInterval(() => {
      setProfileCount(prev => {
        if (prev >= 250000) {
          clearInterval(profileInterval)
          return 250000
        }
        // Increment by larger amounts to reach 250k faster
        const increment = Math.max(1000, Math.floor(prev / 10))
        return Math.min(prev + increment, 250000)
      })
    }, 100)

    // Animate progress bar (0% to 100%)
    const progressInterval = setInterval(() => {
      setProgressBar(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 1
      })
    }, 100)

    // Rotate loading messages every 2 seconds
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % loadingMessages.length)
    }, 2000)



    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Track progress updates
    const progressTrackingInterval = setInterval(async () => {
      if (percentage > 0 && percentage <= 97) {
        await trackLoadingEvent({
          event_type: 'progress_update',
          progress_percentage: percentage,
          profiles_analyzed: profileCount,
          loading_message: loadingMessages[currentMessage]
        })
      }
    }, 2000)

    // Complete loading after 10 seconds and redirect
    const completeTimeout = setTimeout(() => {
      console.log('Loading complete, redirecting to checkout...')
      setIsLoading(false)
      
      // Simple, direct redirect
      const checkoutUrl = `/checkout?name=${encodeURIComponent(name)}&age=${encodeURIComponent(age)}&location=${encodeURIComponent(location)}&lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`
      console.log('Redirecting to:', checkoutUrl)
      
      // Use router.push for smooth navigation
      router.push(checkoutUrl)
      
      // Track completion in background
      setTimeout(async () => {
        try {
          await trackLoadingEvent({
            event_type: 'completed',
            progress_percentage: 97,
            profiles_analyzed: 250000,
            loading_message: 'Analysis complete!',
            duration_seconds: 10
          })

          await trackFunnelStep({
            funnel_step: 'loading_complete',
            step_order: 3,
            is_completed: true
          })
        } catch (error) {
          console.error('Error tracking loading completion:', error)
        }
      }, 100)
    }, 10000) // 10 seconds loading duration

    return () => {
      clearInterval(profileInterval)
      clearInterval(progressInterval)
      clearInterval(messageInterval)
      clearInterval(eyeInterval)
      clearInterval(countdownInterval)
      clearInterval(progressTrackingInterval)
      clearTimeout(completeTimeout)
    }
  }, [name, age, location, lat, lng])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 font-sans">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Header Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-pink-500 to-red-500 rounded-t-2xl p-6 text-white"
          >
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-lg font-medium mb-1">Searching for</h1>
                <p className="text-2xl font-bold">{name}, {age} y.o</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium mb-1">Profile Match Score</p>
                <motion.p 
                  className="text-4xl font-bold"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {percentage}%
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* Main Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-b-2xl shadow-xl border border-gray-100 p-6"
          >
            {/* Map Section */}
            <div className="relative mb-6">
              <div className="bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                <img
                  src={getMapUrl(lat, lng)}
                  alt="Location map"
                  className="w-full h-64 object-cover"
                />
                
                {/* Overlay Eye Logo */}
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="bg-red-500/20 backdrop-blur-sm rounded-full p-4">
                    <Eye className="w-12 h-12 text-red-600" />
                  </div>
                </motion.div>

                                 {/* Location Markers */}
                 <div className="absolute top-4 left-4">
                   <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                     <div className="flex items-center gap-2">
                       <MapPin className="w-4 h-4 text-red-500" />
                       <span className="text-sm font-medium text-gray-800">1.3 mi</span>
                     </div>
                   </div>
                 </div>

                 <div className="absolute top-4 right-4">
                   <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                     <div className="flex items-center gap-2">
                       <MapPin className="w-4 h-4 text-red-500" />
                       <span className="text-sm font-medium text-gray-800">1.5 mi</span>
                     </div>
                   </div>
                 </div>

                 {/* Profile Thumbnails */}
                <div className="absolute bottom-4 left-4">
                  <div className="flex gap-3">
                    <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                      <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center mb-2">
                        <span className="text-white text-lg font-bold">**</span>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-white/80">Location</p>
                        <p className="text-sm font-medium text-white">1.3 mi</p>
                      </div>
                    </div>

                    <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                      <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center mb-2">
                        <span className="text-white text-lg font-bold">**</span>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-white/80">Location</p>
                        <p className="text-sm font-medium text-white">1.5 mi</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Indicators */}
            <div className="space-y-4">
                             {/* Profiles Analyzed */}
               <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-4">
                 <div className="flex justify-between items-center">
                   <span className="text-white font-medium">Profiles analyzed:</span>
                   <motion.span 
                     className="text-white text-2xl font-bold"
                     initial={{ scale: 0.8 }}
                     animate={{ scale: 1 }}
                     transition={{ duration: 0.3 }}
                   >
                     {profileCount.toLocaleString()}
                   </motion.span>
                 </div>
               </div>

              {/* Loading Message */}
              <div className="text-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentMessage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-lg font-medium text-gray-700"
                  >
                    {loadingMessages[currentMessage]}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Progress Bar */}
              <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-500 via-orange-500 to-green-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressBar}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" as const }}
                />
              </div>

              {/* Countdown Timer */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Redirecting in {countdown} seconds...
                </p>
              </div>

                             {/* Completion Status */}
               {!isLoading && (
                 <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="text-center space-y-4"
                 >
                   <p className="text-green-600 font-medium">Analysis complete! Redirecting to checkout...</p>
                   <button
                     onClick={() => {
                       const checkoutUrl = `/checkout?name=${encodeURIComponent(name)}&age=${encodeURIComponent(age)}&location=${encodeURIComponent(location)}&lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`
                       window.location.href = checkoutUrl
                     }}
                     className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                   >
                     Click here if not redirected automatically
                   </button>
                 </motion.div>
               )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function LoadingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoadingContent />
    </Suspense>
  )
}
