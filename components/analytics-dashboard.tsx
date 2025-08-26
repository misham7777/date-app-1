'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getFunnelAnalytics, getDropOffAnalysis, getLeadsWithProgress } from '@/lib/lead-tracking'
import { Users, TrendingUp, TrendingDown, Clock, Target } from 'lucide-react'

interface AnalyticsData {
  leads: any[]
  funnelAnalytics: any[]
  dropOffs: any[]
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData>({ leads: [], funnelAnalytics: [], dropOffs: [] })
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
    end: new Date().toISOString().split('T')[0] // today
  })

  useEffect(() => {
    loadAnalytics()
  }, [dateRange])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const [funnelAnalytics, dropOffs, leads] = await Promise.all([
        getFunnelAnalytics(dateRange),
        getDropOffAnalysis(dateRange),
        getLeadsWithProgress(dateRange)
      ])

      setData({
        leads: leads || [],
        funnelAnalytics: funnelAnalytics || [],
        dropOffs: dropOffs || []
      })
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalLeads = data.leads.length
  const completedQuizzes = data.leads.filter(lead => lead.quiz_sessions?.some((session: any) => session.is_completed)).length
  const dropOffRate = totalLeads > 0 ? ((totalLeads - completedQuizzes) / totalLeads * 100).toFixed(1) : '0'

  const stepDropOffs = data.dropOffs.reduce((acc: any, dropOff: any) => {
    const step = dropOff.step_name
    acc[step] = (acc[step] || 0) + 1
    return acc
  }, {})

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading analytics...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex gap-2">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="border rounded px-3 py-2"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="border rounded px-3 py-2"
          />
          <Button onClick={loadAnalytics}>Refresh</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              From {dateRange.start} to {dateRange.end}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Quizzes</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedQuizzes}</div>
            <p className="text-xs text-muted-foreground">
              {totalLeads > 0 ? ((completedQuizzes / totalLeads) * 100).toFixed(1) : '0'}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drop-off Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dropOffRate}%</div>
            <p className="text-xs text-muted-foreground">
              {totalLeads - completedQuizzes} users dropped off
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.dropOffs.length > 0 
                ? Math.round(data.dropOffs.reduce((sum: number, dropOff: any) => sum + (dropOff.time_spent_seconds || 0), 0) / data.dropOffs.length)
                : 0}s
            </div>
            <p className="text-xs text-muted-foreground">
              Average time before drop-off
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Drop-off Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Drop-off Analysis by Step</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stepDropOffs).map(([step, count]) => (
              <div key={step} className="flex justify-between items-center">
                <div>
                  <div className="font-medium capitalize">{step.replace('_', ' ')}</div>
                  <div className="text-sm text-muted-foreground">
                    {count} drop-offs
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    {totalLeads > 0 ? ((count as number / totalLeads) * 100).toFixed(1) : '0'}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Leads */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.leads.slice(0, 10).map((lead: any) => (
              <div key={lead.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <div className="font-medium">{lead.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {lead.email} • {lead.search_type} • {new Date(lead.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    lead.quiz_sessions?.some((session: any) => session.is_completed)
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {lead.quiz_sessions?.some((session: any) => session.is_completed)
                      ? 'Completed'
                      : 'Dropped off'
                    }
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Step {lead.quiz_sessions?.[0]?.current_step || 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
