'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, Clock, Lock, CheckCircle, Flame, MapPin, CreditCard, Building, DollarSign, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { trackPaymentAttempt, trackInteraction, trackFunnelStep, trackPageView } from '@/lib/supabase-tracking'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState(5 * 60) // 5 minutes in seconds
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvc, setCvc] = useState('')
  const [billingAddress, setBillingAddress] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    country: ''
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [cardType, setCardType] = useState('')

  // Get data from URL params
  const name = searchParams.get('name') || 'User'
  const age = searchParams.get('age') || '25'
  const location = searchParams.get('location') || 'Warsaw, Poland'
  const lat = searchParams.get('lat') || '52.153794'
  const lng = searchParams.get('lng') || '21.078421'

  // Initialize tracking on component mount
  useEffect(() => {
    const initializeTracking = async () => {
      // Track page view
      await trackPageView('/checkout', 'Checkout - Relationship Intel')

      // Track funnel step
      await trackFunnelStep({
        funnel_step: 'checkout_view',
        step_order: 4,
        is_completed: false
      })
    }

    initializeTracking()
  }, [])

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const detectCardType = (number: string) => {
    const cleanNumber = number.replace(/\s/g, '')
    if (cleanNumber.startsWith('4')) return 'visa'
    if (cleanNumber.startsWith('5')) return 'mastercard'
    if (cleanNumber.startsWith('3')) return 'amex'
    if (cleanNumber.startsWith('6')) return 'discover'
    return ''
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, '')
    value = value.replace(/\D/g, '')
    value = value.replace(/(\d{4})/g, '$1 ').trim()
    setCardNumber(value.slice(0, 19))
    setCardType(detectCardType(value))
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4)
    }
    setExpiryDate(value.slice(0, 5))
  }

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    setCvc(value.slice(0, 3))
  }

  const validateForm = () => {
    if (!cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      setPaymentError('Please enter a valid 16-digit card number')
      return false
    }
    if (!expiryDate.match(/^\d{2}\/\d{2}$/)) {
      setPaymentError('Please enter a valid expiry date (MM/YY)')
      return false
    }
    if (!cvc.match(/^\d{3}$/)) {
      setPaymentError('Please enter a valid 3-digit CVC')
      return false
    }
    if (!billingAddress.name.trim()) {
      setPaymentError('Please enter the name on card')
      return false
    }
    if (!billingAddress.email.trim() || !billingAddress.email.includes('@')) {
      setPaymentError('Please enter a valid email address')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPaymentError('')

    if (!validateForm()) {
      return
    }

    setIsProcessing(true)

    // Track payment attempt
    await trackPaymentAttempt({
      payment_method: selectedPaymentMethod,
      amount: 17.9,
      currency: 'USD',
      status: 'attempted',
      payment_data: {
        card_type: cardType,
        has_valid_form: true
      }
    })

    // Track interaction
    await trackInteraction({
      interaction_type: 'form_submit',
      element_id: 'payment-form',
      element_text: 'Pay $17.9'
    })

    // Simulate Stripe payment processing
    setTimeout(async () => {
      setIsProcessing(false)
      
      // Track successful payment
      await trackPaymentAttempt({
        payment_method: selectedPaymentMethod,
        amount: 17.9,
        currency: 'USD',
        status: 'successful',
        payment_data: {
          card_type: cardType,
          processing_time: 2000
        },
        completed_at: new Date().toISOString()
      })

      // Track funnel step completion
      await trackFunnelStep({
        funnel_step: 'payment_success',
        step_order: 5,
        is_completed: true
      })

      // Here you would integrate with Stripe API
      console.log('Payment processed:', {
        cardNumber: cardNumber.replace(/\s/g, ''),
        expiryDate,
        cvc,
        billingAddress,
        cardType
      })
      
      // Simulate successful payment
      alert('Payment successful! Redirecting to your report...')
    }, 2000)
  }

  const handleViewFullReport = async () => {
    // Track interaction
    await trackInteraction({
      interaction_type: 'button_press',
      element_id: 'view-report-button',
      element_text: 'Get the report'
    })

    // Redirect to results page with user data
    const params = new URLSearchParams({
      name: name,
      age: age,
      location: location,
      lat: lat,
      lng: lng
    })
    
    router.push(`/results?${params.toString()}`)
  }

  const handlePaymentMethodChange = async (method: string) => {
    setSelectedPaymentMethod(method)
    
    // Track interaction
    await trackInteraction({
      interaction_type: 'button_press',
      element_id: `payment-method-${method}`,
      element_text: method
    })
  }

  const getCardIcon = () => {
    switch (cardType) {
      case 'visa': return '💳'
      case 'mastercard': return '💳'
      case 'amex': return '💳'
      case 'discover': return '💳'
      default: return '💳'
    }
  }

  const profiles = [
    { id: 1, name: 'Example', age: '34', distance: '1.9 mi', isExample: true },
    { id: 2, name: 'N***', age: '39', distance: '1.5 mi', isExample: false },
    { id: 3, name: 'N***', age: '28', distance: '0.9 mi', isExample: false },
    { id: 4, name: 'N***', age: '31', distance: '2.1 mi', isExample: false },
    { id: 5, name: 'N***', age: '26', distance: '1.2 mi', isExample: false },
    { id: 6, name: 'N***', age: '33', distance: '1.8 mi', isExample: false },
    { id: 7, name: 'N***', age: '29', distance: '2.3 mi', isExample: false }
  ]

  const paymentMethods = [
    { id: 'card', label: '💳 Card', icon: CreditCard, selected: selectedPaymentMethod === 'card' },
    { id: 'bank', label: '🏛️ Bank', icon: Building, selected: selectedPaymentMethod === 'bank' },
    { id: 'cashback', label: '💰 $5 back', icon: DollarSign, selected: selectedPaymentMethod === 'cashback' },
    { id: 'googlepay', label: '📱 Google Pay', icon: Smartphone, selected: selectedPaymentMethod === 'googlepay' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white font-sans">
      {/* Header Banner */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Offer valid for</span>
              <span className="text-red-500 font-bold text-lg">{formatTime(timeLeft)}</span>
            </div>
            <Button 
              className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold"
              onClick={handleViewFullReport}
            >
              Get the report
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Results Preview */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Results for {name}
            </h1>
            <p className="text-gray-600 text-sm">
              {location}
            </p>
          </div>

          {/* Match Score Display */}
          <Card className="border shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Flame className="w-8 h-8 text-red-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Profile Match Score</h3>
                    <motion.p 
                      className="text-3xl font-bold text-pink-500"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      97%
                    </motion.p>
                  </div>
                </div>
                <div className="text-right">
                  <motion.p 
                    className="text-sm text-gray-600"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    7 potential profiles
                  </motion.p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="relative">
                <div className="w-full h-3 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-full">
                  <motion.div 
                    className="absolute top-0 w-2 h-3 bg-black transform -translate-x-1"
                    initial={{ left: '0%' }}
                    animate={{ left: '97%' }}
                    transition={{ duration: 1, delay: 0.6, ease: "easeOut" as const }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* High Probability Profiles */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">High probability profiles</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {profiles.map((profile, index) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className="min-w-[200px] border shadow-md">
                  <CardContent className="p-4">
                    <div className="text-center">
                      {profile.isExample ? (
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">E</span>
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-3 flex items-center justify-center relative">
                          <span className="text-gray-600 font-bold text-lg">{profile.name}</span>
                          <div className="absolute inset-0 bg-black/20 rounded-lg" />
                        </div>
                      )}
                      
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {profile.isExample ? 'Example' : profile.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{profile.age} yo</p>
                      <p className="text-sm text-gray-600 mb-2">Location</p>
                      <p className="text-sm font-medium text-gray-800 mb-3">{profile.distance}</p>
                      
                      {profile.isExample ? (
                        <Button 
                          className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white text-sm"
                          onClick={handleViewFullReport}
                        >
                          See report
                        </Button>
                      ) : (
                        <div className="w-full h-8 bg-gray-200 rounded flex items-center justify-center">
                          <Lock className="w-4 h-4 text-gray-500" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Payment Section */}
          <div className="space-y-6">
            {/* Urgency Banner */}
            <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white p-4 rounded-lg text-center">
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">50% discount expires in {formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Pricing Card */}
            <Card className="border shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="w-6 h-6 text-gray-600" />
                  <h2 className="text-xl font-bold text-gray-800">Access detailed report now</h2>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Detailed report</h3>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Profile details (bio, photos...)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Last dating activity</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Subscription info (Tinder+...)</span>
                    </li>
                  </ul>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-red-500">$17.9</span>
                    <span className="text-lg text-gray-400 line-through">$29.9</span>
                  </div>
                </div>

                {/* Payment Method Tabs */}
                <div className="mb-6">
                  <div className="flex gap-2 mb-4 overflow-x-auto">
                    {paymentMethods.map(method => (
                      <button
                        key={method.id}
                        onClick={() => handlePaymentMethodChange(method.id)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors whitespace-nowrap ${
                          method.selected 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {method.label}
                      </button>
                    ))}
                  </div>

                  {/* Payment Form */}
                  {selectedPaymentMethod === 'card' && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card number
                        </label>
                        <div className="relative">
                          <Input
                            type="text"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="1234 5678 9012 3456"
                            className="h-12 pr-12"
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg">
                            {getCardIcon()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry date
                          </label>
                          <Input
                            type="text"
                            value={expiryDate}
                            onChange={handleExpiryChange}
                            placeholder="MM/YY"
                            className="h-12"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVC
                          </label>
                          <Input
                            type="text"
                            value={cvc}
                            onChange={handleCvcChange}
                            placeholder="123"
                            className="h-12"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name on card
                        </label>
                        <Input
                          type="text"
                          value={billingAddress.name}
                          onChange={(e) => setBillingAddress(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="John Doe"
                          className="h-12"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <Input
                          type="email"
                          value={billingAddress.email}
                          onChange={(e) => setBillingAddress(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="john@example.com"
                          className="h-12"
                        />
                      </div>

                      {paymentError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                          {paymentError}
                        </div>
                      )}

                      <Button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full h-14 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold text-lg disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </div>
                        ) : (
                          'Pay $17.9'
                        )}
                      </Button>
                    </form>
                  )}

                  {/* Other Payment Methods */}
                  {selectedPaymentMethod !== 'card' && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        {(() => {
                          const method = paymentMethods.find(m => m.id === selectedPaymentMethod)
                          const IconComponent = method?.icon
                          return IconComponent ? <IconComponent className="w-8 h-8 text-gray-400" /> : null
                        })()}
                      </div>
                      <p className="text-gray-600">
                        {selectedPaymentMethod === 'bank' && 'Bank transfer option coming soon'}
                        {selectedPaymentMethod === 'cashback' && 'Cashback option coming soon'}
                        {selectedPaymentMethod === 'googlepay' && 'Google Pay option coming soon'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Security Section */}
            <div className="bg-green-500 text-white p-4 rounded-lg text-center">
              <div className="flex items-center justify-center gap-2">
                <Lock className="w-5 h-5" />
                <span className="font-medium">Secure, fast checkout with Link ✓</span>
              </div>
              <div className="flex items-center justify-center gap-4 mt-2">
                <div className="text-xs opacity-80">PCI DSS Compliant</div>
                <div className="text-xs opacity-80">256-bit SSL</div>
                <div className="text-xs opacity-80">Stripe Secure</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
