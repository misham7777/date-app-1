'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, Eye, MapPin, Navigation, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { trackQuizAnswer, trackInteraction, trackFunnelStep, trackPageView } from '@/lib/supabase-tracking'
import { searchTrackingService, trackSearchAnswer, completeSearchSession } from '@/lib/search-tracking'
import { useSearchParams } from 'next/navigation'

// TypeScript interfaces for Mapbox API
interface MapboxFeature {
  id: string
  type: string
  place_type: string[]
  relevance: number
  properties: Record<string, unknown>
  text: string
  place_name: string
  center: [number, number] // [longitude, latitude]
  geometry: {
    type: string
    coordinates: [number, number]
  }
  context: Array<{
    id: string
    text: string
    short_code?: string
  }>
}

function QuizContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1) // Step 1 is now age (was step 2)
  const [totalSteps] = useState(3) // Now 3 steps: age, location, photo
  const [answers, setAnswers] = useState({
    name: '',
    age: '',
    location: '',
    photo: null as File | null,
    coordinates: { lat: 52.153794, lng: 21.078421 }
  })
  const [locationSuggestions, setLocationSuggestions] = useState<MapboxFeature[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [mapLoading, setMapLoading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Get pre-filled name from URL params
  const preFilledName = searchParams.get('name') || ''

  // Initialize answers with pre-filled name
  useEffect(() => {
    if (preFilledName) {
      setAnswers(prev => ({ ...prev, name: preFilledName }))
    }
  }, [preFilledName])

  // Calculate progress percentage (step 1 = 33%, step 2 = 67%, step 3 = 100%)
  const progressPercentage = (currentStep / totalSteps) * 100

  // Mapbox API configuration
  const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZnJlZGJrayIsImEiOiJjbTJqeWVkczIwYzE5MmpyMGp6OTY1ODgzIn0.MiNzEcVX_atB-tG6y3KQkw'
  const MAPBOX_STYLE = 'mapbox/streets-v12'

  const handleInputChange = (field: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [field]: value
    }))
  }



  const handleAgeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const age = parseInt(value)
    const valid = age >= 18 && age <= 99
    
    setAnswers(prev => ({ ...prev, age: value }))

    // Track answer when valid
    if (valid) {
      await trackQuizAnswer({
        step_number: 1,
        question_type: 'age',
        answer_data: { age: age }
      })
      
      // Track with search tracking service
      await trackSearchAnswer({
        session_id: searchTrackingService['sessionId'],
        step_number: 1,
        question_type: 'age',
        answer_data: { age: age }
      })
    }
  }

  const handleLocationInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setAnswers(prev => ({ ...prev, location: value }))

    // Track answer when user finishes typing
    if (value.trim()) {
      await trackQuizAnswer({
        step_number: 2,
        question_type: 'location',
        answer_data: { location: value.trim() }
      })
      
      // Track with search tracking service
      await trackSearchAnswer({
        session_id: searchTrackingService['sessionId'],
        step_number: 2,
        question_type: 'location',
        answer_data: { location: value.trim() }
      })
    }
  }

  const handleNext = async () => {
    // Track interaction
    await trackInteraction({
      interaction_type: 'button_press',
      element_id: 'next-button',
      element_text: currentStep === 3 ? 'Start Search' : 'Next'
    })

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1)
    } else {
      // If this is the last step, redirect to loading
      await handleSubmit()
    }
  }

  const handleBack = async () => {
    // Track interaction
    await trackInteraction({
      interaction_type: 'button_press',
      element_id: 'back-button',
      element_text: 'Back'
    })

    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    // Track final submission
    await trackInteraction({
      interaction_type: 'form_submit',
      element_id: 'quiz-submit',
      element_text: 'Start Search'
    })

    // Update session as completed
    await searchTrackingService.updateSearchSession({
      is_completed: true,
      completed_at: new Date().toISOString(),
      current_step: totalSteps
    })

    // Complete search session
    await completeSearchSession()

    // Redirect to loading page with user data
    const params = new URLSearchParams({
      name: answers.name,
      age: answers.age,
      location: answers.location,
      lat: answers.coordinates.lat.toString(),
      lng: answers.coordinates.lng.toString()
    })
    
    router.push(`/loading?${params.toString()}`)
  }

  const validateAge = (age: string) => {
    const numAge = parseInt(age)
    return numAge >= 18 && numAge <= 99
  }

  // Mapbox API functions
  const getMapUrl = (lat: number, lng: number, zoom: number = 14) => {
    return `https://api.mapbox.com/styles/v1/${MAPBOX_STYLE}/static/${lng},${lat},${zoom},0/900x900?access_token=${MAPBOX_ACCESS_TOKEN}`
  }

  const searchLocations = async (query: string) => {
    if (!query || query.length < 3) {
      setLocationSuggestions([])
      setShowSuggestions(false)
      return
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&types=place,address&limit=5`
      )
      const data = await response.json()
      setLocationSuggestions(data.features || [])
      setShowSuggestions(true)
    } catch (error) {
      console.error('Error searching locations:', error)
      setLocationSuggestions([])
    }
  }

  const selectLocation = (suggestion: MapboxFeature) => {
    const [lng, lat] = suggestion.center
    setAnswers(prev => ({
      ...prev,
      location: suggestion.place_name,
      coordinates: { lat, lng }
    }))
    setShowSuggestions(false)
    setMapLoading(true)
  }

  const getCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setAnswers(prev => ({
            ...prev,
            coordinates: { lat: latitude, lng: longitude }
          }))
          setMapLoading(true)
          
          // Reverse geocode to get location name
          fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_ACCESS_TOKEN}&types=place,address&limit=1`
          )
            .then(response => response.json())
            .then(data => {
              if (data.features && data.features.length > 0) {
                setAnswers(prev => ({
                  ...prev,
                  location: data.features[0].place_name
                }))
              }
            })
            .catch(error => console.error('Error reverse geocoding:', error))
        },
        (error) => {
          console.error('Error getting current position:', error)
          alert('Unable to get your current location. Please enter it manually.')
        }
      )
    } else {
      alert('Geolocation is not supported by this browser.')
    }
  }



  // Photo upload functions
  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    
    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a valid image file (JPG, PNG, or WebP)'
    }
    
    if (file.size > maxSize) {
      return 'File size must be less than 10MB'
    }
    
    return null
  }

  const handleFileUpload = async (file: File) => {
    const error = validateFile(file)
    if (error) {
      setUploadError(error)
      return
    }

    setUploadError(null)
    setAnswers(prev => ({ ...prev, photo: file }))
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Track answer
    await trackQuizAnswer({
      step_number: 3,
      question_type: 'photo',
      answer_data: { 
        filename: file.name,
        size: file.size,
        type: file.type
      }
    })
    
    // Track with search tracking service
    await trackSearchAnswer({
      session_id: searchTrackingService['sessionId'],
      step_number: 3,
      question_type: 'photo',
      answer_data: { 
        filename: file.name,
        size: file.size,
        type: file.type
      }
    })

    // Track interaction
    await trackInteraction({
      interaction_type: 'file_upload',
      element_id: 'photo-upload',
      element_text: 'Photo Upload'
    })
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const removePhoto = () => {
    setAnswers(prev => ({ ...prev, photo: null }))
    setPhotoPreview(null)
    setUploadError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Update map when coordinates change
  useEffect(() => {
    if (currentStep === 3) {
      setMapLoading(true)
      // Simulate map loading
      setTimeout(() => setMapLoading(false), 500)
    }
  }, [answers.coordinates, currentStep])

  // Initialize tracking on component mount
  useEffect(() => {
    const initializeTracking = async () => {
      // Create search session
      await searchTrackingService.updateSearchSession({
        total_steps: totalSteps,
        current_step: currentStep
      })

      // Track page view
      await trackPageView('/quiz', 'Quiz - Relationship Intel')

      // Track funnel step
      await trackFunnelStep({
        funnel_step: 'quiz_start',
        step_order: 1,
        is_completed: true
      })
    }

    initializeTracking()
  }, [])

  // Handle pre-filled name from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const preFilledName = urlParams.get('name')
    const searchType = urlParams.get('searchType')
    
    if (preFilledName) {
      setAnswers(prev => ({ ...prev, name: preFilledName }))
      
      // Track the pre-filled answer
      trackQuizAnswer({
        step_number: 1,
        question_type: 'name',
        answer_data: { name: preFilledName }
      })
    }
  }, [])

  // Track step changes
  useEffect(() => {
    trackFunnelStep({
      funnel_step: currentStep === 1 ? 'quiz_start' : 'quiz_complete',
      step_order: currentStep,
      is_completed: currentStep === totalSteps
    })
  }, [currentStep])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 font-sans">
      {/* Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-2xl mx-auto">
          {/* Header with Logo */}
          <div className="mb-6">
            {/* Logo - Centered */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-800 mb-3">
                <Eye className="w-8 h-8 text-red-500" />
                <span>RELATIONSHIP INTEL</span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <motion.div
                  className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" as const }}
                />
              </div>
              <p className="text-sm text-gray-600">
                Step {currentStep} of {totalSteps}
              </p>
            </div>
          </div>

          {/* Quiz Card */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
          >
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    How old is {answers.name || 'they'}?
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="Enter his age"
                        value={answers.age}
                        onChange={handleAgeChange}
                        className="h-12 text-lg pr-12 bg-gray-50 rounded-lg"
                        min="18"
                        max="99"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl">
                        👈
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      Approximate age is fine
                    </p>
                    
                    {/* Pro Tip Box */}
                    <div className="border-l-4 border-red-500 bg-red-50 p-3 rounded-r-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Pro tip:</strong> Our AI can find profiles with slight age variations.
                      </p>
                    </div>
                    
                    {/* Statistic */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800 font-medium">
                        💡 <strong>89%</strong> of people lie about their age on dating apps
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Where are they located?
                  </h2>
                  
                  <div className="space-y-4">
                    {/* Location Input */}
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Enter city or address"
                        value={answers.location}
                        onChange={handleLocationInputChange}
                        className="h-12 text-lg pr-12"
                      />
                      <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>

                    {/* Location Suggestions */}
                    {showSuggestions && locationSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {locationSuggestions.map((suggestion: MapboxFeature, index: number) => (
                          <button
                            key={index}
                            onClick={() => selectLocation(suggestion)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-gray-800">{suggestion.text}</div>
                            <div className="text-sm text-gray-500">{suggestion.place_name}</div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Current Position Button */}
                    <Button
                      onClick={getCurrentPosition}
                      variant="outline"
                      className="w-full h-12 flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-4 h-4" />
                      Use my current position
                    </Button>

                    {/* Map Display */}
                    <div className="relative">
                      <div className="bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                        {mapLoading ? (
                          <div className="w-full h-48 flex items-center justify-center">
                            <div className="text-gray-500">Loading map...</div>
                          </div>
                        ) : (
                          <img
                            src={getMapUrl(answers.coordinates.lat, answers.coordinates.lng)}
                            alt="Location map"
                            className="w-full h-48 object-cover"
                            onLoad={() => setMapLoading(false)}
                          />
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      Enter the city where {answers.name || 'they'} are located.
                    </p>
                    
                    {/* Pro Tip Box */}
                    <div className="border-l-4 border-red-500 bg-red-50 p-3 rounded-r-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Pro tip:</strong> Location helps us find profiles in the same area.
                      </p>
                    </div>
                    
                    {/* Statistic */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800 font-medium">
                        💡 <strong>78%</strong> prefer matches within 25 miles
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Upload their photo
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload a clear photo for our AI to analyze.
                  </p>
                  
                  <div className="space-y-4">
                    {/* Photo Upload Area */}
                    <div className="relative">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                      
                      {!photoPreview ? (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          className={`
                            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
                            ${isDragOver 
                              ? 'border-blue-500 bg-blue-50' 
                              : uploadError 
                                ? 'border-red-500 bg-red-50' 
                                : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
                            }
                          `}
                        >
                          <div className="text-3xl mb-3">📷</div>
                          <p className="text-lg font-medium text-gray-700 mb-2">
                            {isDragOver ? 'Drop photo here' : 'Drag & drop photo here or click to browse'}
                          </p>
                          <p className="text-sm text-gray-500">
                            JPG, PNG, WebP up to 10MB
                          </p>
                        </div>
                      ) : (
                        <div className="relative">
                          <img
                            src={photoPreview}
                            alt="Photo preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <button
                            onClick={removePhoto}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="mt-2 text-sm text-gray-600">
                            {answers.photo?.name}
                          </div>
                        </div>
                      )}
                      
                      {uploadError && (
                        <p className="text-red-500 text-sm mt-2">{uploadError}</p>
                      )}
                    </div>

                    {/* Helper Text */}
                    <p className="text-sm text-gray-600">
                      Best results with clear, front-facing photos.
                    </p>

                    {/* Photo Requirements */}
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="text-green-500 mr-2">✓</span>
                        Clear face visible
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="text-green-500 mr-2">✓</span>
                        Good lighting
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="text-green-500 mr-2">✓</span>
                        Front-facing preferred
                      </div>
                    </div>
                    
                    {/* Pro Tip Box */}
                    <div className="border-l-4 border-red-500 bg-red-50 p-3 rounded-r-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Pro tip:</strong> Our AI works with different angles and lighting.
                      </p>
                    </div>
                    
                    {/* Statistic */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800 font-medium">
                        💡 <strong>94%</strong> accuracy rate in facial recognition
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="px-6"
              >
                Back
              </Button>
              
              <div className="flex flex-col items-end space-y-2">
                <Button
                  onClick={handleNext}
                                      disabled={
                      (currentStep === 1 && (!answers.age || !validateAge(answers.age))) ||
                      (currentStep === 2 && !answers.location) ||
                      (currentStep === 3 && !answers.photo)
                    }
                  className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold"
                >
                  {currentStep === 3 ? 'Start Search' : 'Next'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                
                {/* AI Accuracy Rate - Only show on step 4 */}
                {currentStep === 3 && (
                  <div className="text-center">
                    <div className="text-sm">
                      <span className="text-red-500 font-semibold">AI facial recognition with 94% accuracy rate</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Star Rating - Centered, only show on step 2 */}
            {currentStep === 2 && (
              <div className="text-center mt-4">
                <div className="text-yellow-400 text-lg">⭐⭐⭐⭐⭐</div>
                <div className="text-sm">
                  <span className="text-red-500 font-semibold">4.5/5</span>
                  <span className="text-gray-500"> based on 1572 reviews</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuizContent />
    </Suspense>
  )
}
