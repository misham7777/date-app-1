'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getSearchFunnelAnalytics, getSearchDropOffAnalysis, getSearchesWithProgress } from '@/lib/search-tracking'
import { TrendingDown, Clock, Target, Search } from 'lucide-react'

interface SearchAnalyticsData {
  searches: Array<{
    id: string
    name: string
    email?: string
    search_type?: string
    created_at: string
    is_completed: boolean
    current_step?: number
  }>
  funnelAnalytics: Array<{
    step: string
    count: number
    percentage: number
  }>
  dropOffs: Array<{
    step_name: string
    time_spent_seconds?: number
  }>
}

export function SearchAnalyticsDashboard() {
  const [data, setData] = useState<SearchAnalyticsData>({ searches: [], funnelAnalytics: [], dropOffs: [] })
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
    end: new Date().toISOString().split('T')[0] // today
  })

  const loadAnalytics = useCallback(async () => {
    setLoading(true)
    try {
      const [funnelAnalytics, dropOffs, searches] = await Promise.all([
        getSearchFunnelAnalytics(dateRange),
        getSearchDropOffAnalysis(dateRange),
        getSearchesWithProgress(dateRange)
      ])

      setData({
        searches: searches || [],
        funnelAnalytics: funnelAnalytics || [],
        dropOffs: dropOffs || []
      })
    } catch (error) {
      console.error('Error loading search analytics:', error)
    } finally {
      setLoading(false)
    }
  }, [dateRange])

  useEffect(() => {
    loadAnalytics()
  }, [loadAnalytics])

  const totalSearches = data.searches.length
  const completedSearches = data.searches.filter(search => search.is_completed).length
  const dropOffRate = totalSearches > 0 ? ((totalSearches - completedSearches) / totalSearches * 100).toFixed(1) : '0'

  const stepDropOffs = data.dropOffs.reduce((acc: Record<string, number>, dropOff) => {
    const step = dropOff.step_name
    acc[step] = (acc[step] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading search analytics...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Search Analytics Dashboard</h1>
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
            <CardTitle className="text-sm font-medium">Total Searches</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSearches}</div>
            <p className="text-xs text-muted-foreground">
              From {dateRange.start} to {dateRange.end}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Searches</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedSearches}</div>
            <p className="text-xs text-muted-foreground">
              {totalSearches > 0 ? ((completedSearches / totalSearches) * 100).toFixed(1) : '0'}% completion rate
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
              {totalSearches - completedSearches} users dropped off
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
                                 ? Math.round(data.dropOffs.reduce((sum: number, dropOff: { step_name: string; time_spent_seconds?: number }) => sum + (dropOff.time_spent_seconds || 0), 0) / data.dropOffs.length)
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
            {Object.entries(stepDropOffs).map(([step, count]: [string, number]) => (
              <div key={step} className="flex justify-between items-center">
                <div>
                  <div className="font-medium capitalize">{step.replace('_', ' ')}</div>
                  <div className="text-sm text-muted-foreground">
                    {count} drop-offs
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    {totalSearches > 0 ? ((count as number / totalSearches) * 100).toFixed(1) : '0'}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Searches */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Searches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.searches.slice(0, 10).map((search) => (
              <div key={search.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <div className="font-medium">{search.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {search.email} • {search.search_type} • {new Date(search.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    search.is_completed
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {search.is_completed
                      ? 'Completed'
                      : 'Dropped off'
                    }
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Step {search.current_step || 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Search Type Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(() => {
              const searchTypes = data.searches.reduce((acc: Record<string, number>, search) => {
                const type = search.search_type || 'partner'
                acc[type] = (acc[type] || 0) + 1
                return acc
              }, {} as Record<string, number>)

              return Object.entries(searchTypes).map(([type, count]: [string, number]) => (
                <div key={type} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium capitalize">{type}</div>
                    <div className="text-sm text-muted-foreground">
                      {count} searches
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      {totalSearches > 0 ? ((count as number / totalSearches) * 100).toFixed(1) : '0'}%
                    </div>
                  </div>
                </div>
              ))
            })()}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
