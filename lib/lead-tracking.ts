import { supabase } from './supabase-tracking'

// TypeScript interfaces for lead tracking
export interface LeadData {
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

export interface QuizSessionData {
  session_id: string
  lead_id?: string
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

export interface QuizAnswerData {
  session_id: string
  quiz_session_id?: string
  step_number: number
  question_type: 'name' | 'age' | 'location' | 'photo'
  answer_data: Record<string, unknown>
}

export interface DropOffData {
  session_id: string
  quiz_session_id?: string
  step_number: number
  step_name: string
  drop_off_reason?: string
  time_spent_seconds?: number
  user_agent?: string
  ip_address?: string
}

// Enhanced tracking service for leads and quiz drop-offs
export class LeadTrackingService {
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

  // Track lead from home page form submission
  async trackLead(data: LeadData): Promise<string | null> {
    try {
      const deviceInfo = this.getDeviceInfo()
      
      const { data: lead, error } = await supabase
        .from('leads')
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
        }])
        .select('id')
        .single()

      if (error) {
        console.error('Error tracking lead:', error)
        return null
      }

      return lead.id
    } catch (error) {
      console.error('Error tracking lead:', error)
      return null
    }
  }

  // Start quiz session
  async startQuizSession(leadId?: string): Promise<string | null> {
    try {
      const { data: session, error } = await supabase
        .from('quiz_sessions')
        .insert([{
          session_id: this.sessionId,
          lead_id: leadId,
          current_step: 1,
          total_steps: 3,
          started_at: new Date().toISOString(),
          last_activity_at: new Date().toISOString(),
        }])
        .select('id')
        .single()

      if (error) {
        console.error('Error starting quiz session:', error)
        return null
      }

      return session.id
    } catch (error) {
      console.error('Error starting quiz session:', error)
      return null
    }
  }

  // Update quiz session progress
  async updateQuizSession(data: Partial<QuizSessionData>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('quiz_sessions')
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
        console.error('Error updating quiz session:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error updating quiz session:', error)
      return false
    }
  }

  // Track quiz answer
  async trackQuizAnswer(data: QuizAnswerData): Promise<boolean> {
    try {
      // Get quiz session ID
      const { data: session } = await supabase
        .from('quiz_sessions')
        .select('id')
        .eq('session_id', this.sessionId)
        .single()

      const { error } = await supabase
        .from('quiz_answers')
        .insert([{
          session_id: data.session_id,
          quiz_session_id: session?.id,
          step_number: data.step_number,
          question_type: data.question_type,
          answer_data: data.answer_data,
        }])

      if (error) {
        console.error('Error tracking quiz answer:', error)
        return false
      }

      // Update quiz session progress
      await this.updateQuizSession({
        current_step: data.step_number + 1,
        last_activity_at: new Date().toISOString(),
      })

      return true
    } catch (error) {
      console.error('Error tracking quiz answer:', error)
      return false
    }
  }

  // Track quiz drop-off
  async trackQuizDropOff(data: DropOffData): Promise<boolean> {
    try {
      // Get quiz session ID
      const { data: session } = await supabase
        .from('quiz_sessions')
        .select('id')
        .eq('session_id', this.sessionId)
        .single()

      const deviceInfo = this.getDeviceInfo()

      const { error } = await supabase
        .from('quiz_drop_offs')
        .insert([{
          session_id: data.session_id,
          quiz_session_id: session?.id,
          step_number: data.step_number,
          step_name: data.step_name,
          drop_off_reason: data.drop_off_reason,
          time_spent_seconds: data.time_spent_seconds,
          user_agent: data.user_agent || deviceInfo.user_agent,
          ip_address: data.ip_address,
        }])

      if (error) {
        console.error('Error tracking quiz drop-off:', error)
        return false
      }

      // Update quiz session as dropped off
      await this.updateQuizSession({
        dropped_off_at: new Date().toISOString(),
        drop_off_step: data.step_number,
        drop_off_reason: data.drop_off_reason,
      })

      return true
    } catch (error) {
      console.error('Error tracking quiz drop-off:', error)
      return false
    }
  }

  // Complete quiz session
  async completeQuizSession(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('quiz_sessions')
        .update({
          is_completed: true,
          completed_at: new Date().toISOString(),
          last_activity_at: new Date().toISOString(),
        })
        .eq('session_id', this.sessionId)

      if (error) {
        console.error('Error completing quiz session:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error completing quiz session:', error)
      return false
    }
  }

  // Get funnel analytics
  async getFunnelAnalytics(dateRange: { start: string; end: string }) {
    try {
      const { data, error } = await supabase
        .from('funnel_analytics')
        .select('*')
        .gte('date', dateRange.start)
        .lte('date', dateRange.end)
        .order('date', { ascending: false })

      if (error) {
        console.error('Error getting funnel analytics:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error getting funnel analytics:', error)
      return null
    }
  }

  // Get drop-off analysis
  async getDropOffAnalysis(dateRange: { start: string; end: string }) {
    try {
      const { data, error } = await supabase
        .from('quiz_drop_offs')
        .select(`
          *,
          quiz_sessions!inner(session_id, lead_id),
          leads!inner(name, email)
        `)
        .gte('created_at', dateRange.start)
        .lte('created_at', dateRange.end)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error getting drop-off analysis:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error getting drop-off analysis:', error)
      return null
    }
  }

  // Get leads with quiz progress
  async getLeadsWithProgress(dateRange: { start: string; end: string }) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          quiz_sessions(*)
        `)
        .gte('created_at', dateRange.start)
        .lte('created_at', dateRange.end)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error getting leads with progress:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error getting leads with progress:', error)
      return null
    }
  }
}

// Export singleton instance
export const leadTrackingService = new LeadTrackingService()

// Convenience functions for easy integration
export const trackLead = (data: LeadData) => leadTrackingService.trackLead(data)
export const startQuizSession = (leadId?: string) => leadTrackingService.startQuizSession(leadId)
export const trackQuizAnswer = (data: QuizAnswerData) => leadTrackingService.trackQuizAnswer(data)
export const trackQuizDropOff = (data: DropOffData) => leadTrackingService.trackQuizDropOff(data)
export const completeQuizSession = () => leadTrackingService.completeQuizSession()
export const getFunnelAnalytics = (dateRange: { start: string; end: string }) => leadTrackingService.getFunnelAnalytics(dateRange)
export const getDropOffAnalysis = (dateRange: { start: string; end: string }) => leadTrackingService.getDropOffAnalysis(dateRange)
export const getLeadsWithProgress = (dateRange: { start: string; end: string }) => leadTrackingService.getLeadsWithProgress(dateRange)
