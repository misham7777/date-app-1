import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with your actual credentials
const supabaseUrl = 'https://xyfccngjyuoqsjhxrllg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5ZmNjbmdqeXVvcXNqaHhybGxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMzQwNDMsImV4cCI6MjA3MTcxMDA0M30.BJ83sUcv6A3xGruWqFi3tL0rzXuRakE3U0ilQbgLXeo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for tracking data
export interface QuizSession {
  id?: string
  session_id: string
  ip_address?: string
  user_agent?: string
  referrer?: string
  created_at?: string
  updated_at?: string
  completed_at?: string
  is_completed?: boolean
  total_steps?: number
  current_step?: number
}

export interface QuizAnswer {
  id?: string
  session_id: string
  step_number: number
  question_type: 'name' | 'age' | 'location' | 'photo'
  answer_data: Record<string, unknown>
  created_at?: string
}

export interface PageView {
  id?: string
  session_id: string
  page_path: string
  page_title?: string
  time_spent_seconds?: number
  created_at?: string
}

export interface UserInteraction {
  id?: string
  session_id: string
  interaction_type: 'click' | 'form_submit' | 'button_press' | 'file_upload' | 'navigation'
  element_id?: string
  element_text?: string
  page_path?: string
  interaction_data?: Record<string, unknown>
  created_at?: string
}

export interface PaymentAttempt {
  id?: string
  session_id: string
  payment_method?: string
  amount?: number
  currency?: string
  status: 'attempted' | 'successful' | 'failed' | 'abandoned'
  error_message?: string
  payment_data?: Record<string, unknown>
  created_at?: string
  completed_at?: string
}

export interface LoadingScreenEvent {
  id?: string
  session_id: string
  event_type: 'started' | 'progress_update' | 'completed' | 'error'
  progress_percentage?: number
  profiles_analyzed?: number
  loading_message?: string
  duration_seconds?: number
  created_at?: string
}

export interface DeviceInfo {
  id?: string
  session_id: string
  browser?: string
  browser_version?: string
  operating_system?: string
  device_type?: 'desktop' | 'mobile' | 'tablet'
  screen_resolution?: string
  viewport_size?: string
  language?: string
  timezone?: string
  created_at?: string
}

export interface ConversionFunnel {
  id?: string
  session_id: string
  funnel_step: 'quiz_start' | 'quiz_complete' | 'loading_start' | 'loading_complete' | 'checkout_view' | 'payment_attempt' | 'payment_success'
  step_order: number
  time_spent_seconds?: number
  is_completed?: boolean
  created_at?: string
}

// Utility functions for tracking
export class TrackingService {
  private sessionId: string

  constructor() {
    this.sessionId = this.getOrCreateSessionId()
  }

  private getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return ''
    
    let sessionId = localStorage.getItem('quiz_session_id')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('quiz_session_id', sessionId)
    }
    return sessionId
  }

  // Create or get quiz session
  async createQuizSession(data: Partial<QuizSession>): Promise<string> {
    const sessionData: QuizSession = {
      session_id: this.sessionId,
      ip_address: data.ip_address,
      user_agent: data.user_agent || (typeof window !== 'undefined' ? window.navigator.userAgent : ''),
      referrer: data.referrer || (typeof window !== 'undefined' ? document.referrer : ''),
      total_steps: data.total_steps || 4,
      current_step: data.current_step || 1,
      ...data
    }

    const { data: session, error } = await supabase
      .from('quiz_sessions')
      .insert([sessionData])
      .select()
      .single()

    if (error) {
      console.error('Error creating quiz session:', error)
      return this.sessionId
    }

    return session?.id || this.sessionId
  }

  // Track quiz answers
  async trackQuizAnswer(answer: Omit<QuizAnswer, 'session_id'>): Promise<void> {
    const answerData: QuizAnswer = {
      ...answer,
      session_id: this.sessionId
    }

    const { error } = await supabase
      .from('quiz_answers')
      .insert([answerData])

    if (error) {
      console.error('Error tracking quiz answer:', error)
    }
  }

  // Track page views
  async trackPageView(pagePath: string, pageTitle?: string, timeSpent?: number): Promise<void> {
    const pageViewData: PageView = {
      session_id: this.sessionId,
      page_path: pagePath,
      page_title: pageTitle || (typeof window !== 'undefined' ? document.title : ''),
      time_spent_seconds: timeSpent
    }

    const { error } = await supabase
      .from('page_views')
      .insert([pageViewData])

    if (error) {
      console.error('Error tracking page view:', error)
    }
  }

  // Track user interactions
  async trackInteraction(interaction: Omit<UserInteraction, 'session_id'>): Promise<void> {
    const interactionData: UserInteraction = {
      ...interaction,
      session_id: this.sessionId,
      page_path: interaction.page_path || (typeof window !== 'undefined' ? window.location.pathname : '')
    }

    const { error } = await supabase
      .from('user_interactions')
      .insert([interactionData])

    if (error) {
      console.error('Error tracking interaction:', error)
    }
  }

  // Track payment attempts
  async trackPaymentAttempt(payment: Omit<PaymentAttempt, 'session_id'>): Promise<void> {
    const paymentData: PaymentAttempt = {
      ...payment,
      session_id: this.sessionId
    }

    const { error } = await supabase
      .from('payment_attempts')
      .insert([paymentData])

    if (error) {
      console.error('Error tracking payment attempt:', error)
    }
  }

  // Track loading screen events
  async trackLoadingEvent(event: Omit<LoadingScreenEvent, 'session_id'>): Promise<void> {
    const eventData: LoadingScreenEvent = {
      ...event,
      session_id: this.sessionId
    }

    const { error } = await supabase
      .from('loading_screen_events')
      .insert([eventData])

    if (error) {
      console.error('Error tracking loading event:', error)
    }
  }

  // Track device information
  async trackDeviceInfo(): Promise<void> {
    if (typeof window === 'undefined') return

    const deviceData: DeviceInfo = {
      session_id: this.sessionId,
      browser: this.getBrowserInfo(),
      browser_version: this.getBrowserVersion(),
      operating_system: this.getOperatingSystem(),
      device_type: this.getDeviceType(),
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }

    const { error } = await supabase
      .from('device_info')
      .insert([deviceData])

    if (error) {
      console.error('Error tracking device info:', error)
    }
  }

  // Track conversion funnel steps
  async trackFunnelStep(step: Omit<ConversionFunnel, 'session_id'>): Promise<void> {
    const funnelData: ConversionFunnel = {
      ...step,
      session_id: this.sessionId
    }

    const { error } = await supabase
      .from('conversion_funnel')
      .insert([funnelData])

    if (error) {
      console.error('Error tracking funnel step:', error)
    }
  }

  // Update quiz session
  async updateQuizSession(updates: Partial<QuizSession>): Promise<void> {
    const { error } = await supabase
      .from('quiz_sessions')
      .update(updates)
      .eq('session_id', this.sessionId)

    if (error) {
      console.error('Error updating quiz session:', error)
    }
  }

  // Helper methods for device detection
  private getBrowserInfo(): string {
    const userAgent = navigator.userAgent
    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari')) return 'Safari'
    if (userAgent.includes('Edge')) return 'Edge'
    return 'Unknown'
  }

  private getBrowserVersion(): string {
    const userAgent = navigator.userAgent
    const match = userAgent.match(/(chrome|firefox|safari|edge)\/(\d+)/i)
    return match ? match[2] : 'Unknown'
  }

  private getOperatingSystem(): string {
    const userAgent = navigator.userAgent
    if (userAgent.includes('Windows')) return 'Windows'
    if (userAgent.includes('Mac')) return 'macOS'
    if (userAgent.includes('Linux')) return 'Linux'
    if (userAgent.includes('Android')) return 'Android'
    if (userAgent.includes('iOS')) return 'iOS'
    return 'Unknown'
  }

  private getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
    const userAgent = navigator.userAgent
    if (userAgent.includes('Mobile')) return 'mobile'
    if (userAgent.includes('Tablet') || userAgent.includes('iPad')) return 'tablet'
    return 'desktop'
  }

  // Get current session ID
  getSessionId(): string {
    return this.sessionId
  }
}

// Create a singleton instance
export const trackingService = new TrackingService()

// Export convenience functions
export const trackQuizAnswer = (answer: Omit<QuizAnswer, 'session_id'>) => 
  trackingService.trackQuizAnswer(answer)

export const trackPageView = (pagePath: string, pageTitle?: string, timeSpent?: number) => 
  trackingService.trackPageView(pagePath, pageTitle, timeSpent)

export const trackInteraction = (interaction: Omit<UserInteraction, 'session_id'>) => 
  trackingService.trackInteraction(interaction)

export const trackPaymentAttempt = (payment: Omit<PaymentAttempt, 'session_id'>) => 
  trackingService.trackPaymentAttempt(payment)

export const trackLoadingEvent = (event: Omit<LoadingScreenEvent, 'session_id'>) => 
  trackingService.trackLoadingEvent(event)

export const trackFunnelStep = (step: Omit<ConversionFunnel, 'session_id'>) => 
  trackingService.trackFunnelStep(step)

export const updateQuizSession = (updates: Partial<QuizSession>) => 
  trackingService.updateQuizSession(updates)
