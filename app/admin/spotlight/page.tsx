'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, Loader2, Sparkles } from 'lucide-react'
import { adminService } from '@/lib/services/adminService'
import { AdminAnalytics } from '@/lib/types/admin'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MetricCard } from '@/components/admin/MetricCard'
import { Music2 } from 'lucide-react'

export default function AdminSpotlightPage() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await adminService.getAnalytics()
        if (response.success) {
          setAnalytics(response.data)
        }
      } catch (err) {
        console.error('Failed to load spotlight data', err)
        setError(
          err instanceof Error
            ? err.message
            : 'We could not load the spotlight data. Please try again later.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    void fetchAnalytics()
  }, [])

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-white">Spotlight</h2>
        <p className="text-sm text-indigo-200">
          Celebrate standout guides and their community impact.
        </p>
      </header>

      {error ? (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <MetricCard
          title="Songs Shared"
          description="Moments of celebration sparked by guides"
          icon={Music2}
          accent="from-pink-500/80 to-fuchsia-500/80"
          value={analytics?.songMetrics.totalShares ?? 0}
          secondary={
            analytics
              ? `${analytics.songMetrics.uniqueSongs} unique tracks`
              : undefined
          }
          isLoading={isLoading}
        />
        <MetricCard
          title="Calendar Connections"
          description="Guides ready to sync with learners"
          icon={Sparkles}
          accent="from-indigo-500/80 to-purple-500/80"
          value={analytics?.sessionMetrics.connectedCalendars ?? 0}
          isLoading={isLoading}
        />
      </div>

      <Card className="bg-white/5 text-white backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-indigo-50">
            Spotlight on star guides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {isLoading ? (
              <div className="md:col-span-3 flex items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-300" />
              </div>
            ) : analytics?.topSpeakers.length ? (
              analytics.topSpeakers.map((speaker) => (
                <div
                  key={speaker.userId}
                  className="flex flex-col gap-3 rounded-lg border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm uppercase tracking-wide text-indigo-200">
                      {speaker.role}
                    </span>
                    <Badge className="bg-purple-500/20 text-purple-100">
                      {speaker.reviewsCount} reviews
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{speaker.name}</h3>
                  <p className="text-sm text-indigo-100">
                    Average rating{' '}
                    <span className="font-semibold text-amber-200">
                      {speaker.averageRating.toFixed(2)} ★
                    </span>
                  </p>
                </div>
              ))
            ) : (
              <div className="md:col-span-3">
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-white/20 bg-white/5 py-10 text-indigo-200">
                  <AlertTriangle className="mb-3 h-8 w-8 text-amber-300" />
                  <p>No speaker insights yet</p>
                  <p className="text-xs text-indigo-100/60">
                    Encourage reviews to unlock spotlight rankings.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

