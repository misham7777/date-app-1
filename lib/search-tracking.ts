import { supabase } from './supabase-tracking'

// TypeScript interfaces for search tracking
export interface SearchData {
  session_id: string
  name: string
  email?: string
  search_type?: 'partner' | 'friend' | 'family'
  source_page?: string
  user_agent?: string
  ip_address?: string
  referrer?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

export interface SearchSessionData {
  session_id: string
  current_step: number
  total_steps: number
  started_at?: string
  last_activity_at?: string
  completed_at?: string
  dropped_off_at?: string
  drop_off_step?: number
  drop_off_reason?: string
  is_completed?: boolean
}

export interface SearchAnswerData {
  session_id: string
  search_id?: string
  step_number: number
  question_type: 'name' | 'age' | 'location' | 'photo'
  answer_data: Record<string, unknown>
}

export interface SearchDropOffData {
  session_id: string
  search_id?: string
  step_number: number
  step_name: string
  drop_off_reason?: string
  time_spent_seconds?: number
  user_agent?: string
  ip_address?: string
}

// Enhanced tracking service for existing Searches table
export class SearchTrackingService {
  private sessionId: string

  constructor() {
    this.sessionId = this.getOrCreateSessionId()
  }

  private getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return ''
    
    let sessionId = localStorage.getItem('search_session_id')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('search_session_id', sessionId)
    }
    return sessionId
  }

  private getDeviceInfo() {
    if (typeof window === 'undefined') return {}
    
    return {
      user_agent: navigator.userAgent,
      referrer: document.referrer,
      utm_source: new URLSearchParams(window.location.search).get('utm_source'),
      utm_medium: new URLSearchParams(window.location.search).get('utm_medium'),
      utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign'),
    }
  }

  // Track search from home page form submission
  async trackSearch(data: SearchData): Promise<string | null> {
    try {
      const deviceInfo = this.getDeviceInfo()
      
      const { data: search, error } = await supabase
        .from('searches')
        .insert([{
          session_id: data.session_id,
          name: data.name,
          email: data.email,
          search_type: data.search_type || 'partner',
          source_page: data.source_page || 'home',
          user_agent: data.user_agent || deviceInfo.user_agent,
          referrer: data.referrer || deviceInfo.referrer,
          utm_source: data.utm_source || deviceInfo.utm_source,
          utm_medium: data.utm_medium || deviceInfo.utm_medium,
          utm_campaign: data.utm_campaign || deviceInfo.utm_campaign,
          current_step: 1,
          total_steps: 3,
          started_at: new Date().toISOString(),
          last_activity_at: new Date().toISOString(),
        }])
        .select('id')
        .single()

      if (error) {
        console.error('Error tracking search:', error)
        return null
      }

      return search.id
    } catch (error) {
      console.error('Error tracking search:', error)
      return null
    }
  }

  // Update search session progress
  async updateSearchSession(data: Partial<SearchSessionData>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('searches')
        .update({
          current_step: data.current_step,
          last_activity_at: new Date().toISOString(),
          completed_at: data.completed_at,
          dropped_off_at: data.dropped_off_at,
          drop_off_step: data.drop_off_step,
          drop_off_reason: data.drop_off_reason,
          is_completed: data.is_completed,
        })
        .eq('session_id', this.sessionId)

      if (error) {
        console.error('Error updating search session:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error updating search session:', error)
      return false
    }
  }

  // Track search answer
  async trackSearchAnswer(data: SearchAnswerData): Promise<boolean> {
    try {
      // Get search ID
      const { data: search } = await supabase
        .from('searches')
        .select('id')
        .eq('session_id', this.sessionId)
        .single()

      const { error } = await supabase
        .from('search_answers')
        .insert([{
          search_id: search?.id,
          session_id: data.session_id,
          step_number: data.step_number,
          question_type: data.question_type,
          answer_data: data.answer_data,
        }])

      if (error) {
        console.error('Error tracking search answer:', error)
        return false
      }

      // Update search session progress
      await this.updateSearchSession({
        current_step: data.step_number + 1,
        last_activity_at: new Date().toISOString(),
      })

      return true
    } catch (error) {
      console.error('Error tracking search answer:', error)
      return false
    }
  }

  // Track search drop-off
  async trackSearchDropOff(data: SearchDropOffData): Promise<boolean> {
    try {
      // Get search ID
      const { data: search } = await supabase
        .from('searches')
        .select('id')
        .eq('session_id', this.sessionId)
        .single()

      const deviceInfo = this.getDeviceInfo()

      const { error } = await supabase
        .from('search_drop_offs')
        .insert([{
          search_id: search?.id,
          session_id: data.session_id,
          step_number: data.step_number,
          step_name: data.step_name,
          drop_off_reason: data.drop_off_reason,
          time_spent_seconds: data.time_spent_seconds,
          user_agent: data.user_agent || deviceInfo.user_agent,
          ip_address: data.ip_address,
        }])

      if (error) {
        console.error('Error tracking search drop-off:', error)
        return false
      }

      // Update search session as dropped off
      await this.updateSearchSession({
        dropped_off_at: new Date().toISOString(),
        drop_off_step: data.step_number,
        drop_off_reason: data.drop_off_reason,
      })

      return true
    } catch (error) {
      console.error('Error tracking search drop-off:', error)
      return false
    }
  }

  // Complete search session
  async completeSearchSession(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('searches')
        .update({
          is_completed: true,
          completed_at: new Date().toISOString(),
          last_activity_at: new Date().toISOString(),
        })
        .eq('session_id', this.sessionId)

      if (error) {
        console.error('Error completing search session:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error completing search session:', error)
      return false
    }
  }

  // Get funnel analytics
  async getSearchFunnelAnalytics(dateRange: { start: string; end: string }) {
    try {
      const { data, error } = await supabase
        .from('search_funnel_analytics')
        .select('*')
        .gte('date', dateRange.start)
        .lte('date', dateRange.end)
        .order('date', { ascending: false })

      if (error) {
        console.error('Error getting search funnel analytics:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error getting search funnel analytics:', error)
      return null
    }
  }

  // Get drop-off analysis
  async getSearchDropOffAnalysis(dateRange: { start: string; end: string }) {
    try {
      const { data, error } = await supabase
        .from('search_drop_offs')
        .select(`
          *,
          searches!inner(session_id, name, email)
        `)
        .gte('created_at', dateRange.start)
        .lte('created_at', dateRange.end)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error getting search drop-off analysis:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error getting search drop-off analysis:', error)
      return null
    }
  }

  // Get searches with progress
  async getSearchesWithProgress(dateRange: { start: string; end: string }) {
    try {
      const { data, error } = await supabase
        .from('searches')
        .select(`
          *,
          search_answers(*)
        `)
        .gte('created_at', dateRange.start)
        .lte('created_at', dateRange.end)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error getting searches with progress:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error getting searches with progress:', error)
      return null
    }
  }

  // Get all searches (for analytics)
  async getAllSearches() {
    try {
      const { data, error } = await supabase
        .from('searches')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error getting all searches:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error getting all searches:', error)
      return null
    }
  }
}

// Export singleton instance
export const searchTrackingService = new SearchTrackingService()

// Convenience functions for easy integration
export const trackSearch = (data: SearchData) => searchTrackingService.trackSearch(data)
export const trackSearchAnswer = (data: SearchAnswerData) => searchTrackingService.trackSearchAnswer(data)
export const trackSearchDropOff = (data: SearchDropOffData) => searchTrackingService.trackSearchDropOff(data)
export const completeSearchSession = () => searchTrackingService.completeSearchSession()
export const getSearchFunnelAnalytics = (dateRange: { start: string; end: string }) => searchTrackingService.getSearchFunnelAnalytics(dateRange)
export const getSearchDropOffAnalysis = (dateRange: { start: string; end: string }) => searchTrackingService.getSearchDropOffAnalysis(dateRange)
export const getSearchesWithProgress = (dateRange: { start: string; end: string }) => searchTrackingService.getSearchesWithProgress(dateRange)
export const getAllSearches = () => searchTrackingService.getAllSearches()
