'use client'

import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { trackPageView, trackInteraction, trackFunnelStep } from '@/lib/supabase-tracking'
import { useEffect } from 'react'

export default function ResultsPage() {
  const searchParams = useSearchParams()
  
  // Get data from URL params
  const name = searchParams.get('name') || 'User'
  const age = searchParams.get('age') || '25'
  const location = searchParams.get('location') || 'Warsaw, Poland'

  // Initialize tracking on component mount
  useEffect(() => {
    const initializeTracking = async () => {
      // Track page view
      await trackPageView('/results', 'Results - Relationship Intel')

      // Track final funnel step
      await trackFunnelStep({
        funnel_step: 'payment_success',
        step_order: 6,
        is_completed: true
      })
    }

    initializeTracking()
  }, [])

  const handleNewSearch = async () => {
    // Track interaction
    await trackInteraction({
      interaction_type: 'button_press',
      element_id: 'new-search-button',
      element_text: 'New Search'
    })
  }

  const handleViewFullReport = async () => {
    // Track interaction
    await trackInteraction({
      interaction_type: 'button_press',
      element_id: 'view-full-report-button',
      element_text: 'View Full Report'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 font-sans">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Analysis Complete</h1>
            <p className="text-gray-600">Your intelligence report is ready</p>
          </div>

          {/* Results Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
          >
            {/* Success Icon */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-12 h-12 text-green-500" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Search Results for {name}
              </h2>
              <p className="text-gray-600">
                {age} years old • {location}
              </p>
            </div>

            {/* Results Summary */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Search Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Platforms scanned:</span>
                    <span className="font-medium ml-2">50+</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Profiles analyzed:</span>
                    <span className="font-medium ml-2">50</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Match score:</span>
                    <span className="font-medium ml-2 text-red-500">41%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Analysis time:</span>
                    <span className="font-medium ml-2">10 seconds</span>
                  </div>
                </div>
              </div>

              {/* Sample Results */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Potential Matches Found</h3>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-gray-600 font-bold">**</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">Profile Match #1</h4>
                      <p className="text-sm text-gray-600">Distance: 1.3 miles</p>
                      <p className="text-sm text-gray-600">Platform: Tinder</p>
                    </div>
                    <div className="text-right">
                      <span className="text-red-500 font-bold">85%</span>
                      <p className="text-xs text-gray-500">Match</p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-gray-600 font-bold">**</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">Profile Match #2</h4>
                      <p className="text-sm text-gray-600">Distance: 1.5 miles</p>
                      <p className="text-sm text-gray-600">Platform: Bumble</p>
                    </div>
                    <div className="text-right">
                      <span className="text-red-500 font-bold">72%</span>
                      <p className="text-xs text-gray-500">Match</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <Link href="/quiz" className="flex-1">
                  <Button variant="outline" className="w-full" onClick={handleNewSearch}>
                    New Search
                  </Button>
                </Link>
                <Button 
                  className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                  onClick={handleViewFullReport}
                >
                  View Full Report
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
