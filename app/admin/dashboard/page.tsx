'use client'

import { useEffect, useState } from 'react'
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  DollarSign,
  Loader2,
  Music2,
  PieChart,
  Users,
} from 'lucide-react'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Area, Bar, BarChart, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { adminService } from '@/lib/services/adminService'
import { AdminAnalytics } from '@/lib/types/admin'
import { MetricCard } from '@/components/admin/MetricCard'
import { currencyFormatter, percentageFormatter } from '@/components/admin/constants'

const sessionChartConfig = {
  scheduled: {
    label: 'Scheduled',
    color: 'var(--chart-3)',
  },
  completed: {
    label: 'Completed',
    color: 'var(--chart-1)',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'var(--chart-4)',
  },
}

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
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
        console.error('Failed to load analytics', err)
        setError(
          err instanceof Error
            ? err.message
            : 'We could not load the latest analytics. Please try again later.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    void fetchAnalytics()
  }, [])

  const statusBreakdownEntries = analytics
    ? Object.entries(analytics.sessionMetrics.statusBreakdown)
    : []

  const monthlyRevenueData =
    analytics?.revenueMetrics.monthlyRevenue.map((entry) => ({
      month: entry.month,
      revenue: entry.total,
      sessions: entry.sessions,
    })) ?? []

  return (
    <section className="space-y-10">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Overview</h2>
        <p className="text-sm text-indigo-200">
          Track platform health, momentum, and engagement at a glance.
        </p>
      </header>

      {error ? (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Community"
          description="All active members across roles"
          icon={Users}
          accent="from-indigo-500/80 to-purple-500/80"
          value={analytics?.userMetrics.totalUsers ?? 0}
          isLoading={isLoading}
        />
        <MetricCard
          title="Sessions Completed"
          description="Successful knowledge exchanges"
          icon={CheckCircle2}
          accent="from-emerald-500/80 to-teal-500/80"
          value={analytics?.sessionMetrics.completedSessions ?? 0}
          isLoading={isLoading}
        />
        <MetricCard
          title="Learning Revenue"
          description="Completed session value"
          icon={DollarSign}
          accent="from-amber-500/80 to-orange-500/80"
          value={
            analytics
              ? currencyFormatter.format(analytics.revenueMetrics.totalRevenue)
              : currencyFormatter.format(0)
          }
          isLoading={isLoading}
        />
        <MetricCard
          title="Songs Shared"
          description="Moments of celebration"
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
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-7">
        <Card className="bg-white/5 text-white backdrop-blur-lg xl:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-indigo-50">
              Session Pulse
            </CardTitle>
            <BarChart3 className="h-5 w-5 text-indigo-200" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-300" />
              </div>
            ) : (
              <ChartContainer config={sessionChartConfig} className="h-64 w-full">
                <BarChart data={[{
                  name: 'Sessions',
                  scheduled: analytics?.sessionMetrics.statusBreakdown.scheduled ?? 0,
                  completed: analytics?.sessionMetrics.statusBreakdown.completed ?? 0,
                  cancelled: analytics?.sessionMetrics.statusBreakdown.cancelled ?? 0,
                }]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                  <YAxis allowDecimals={false} stroke="rgba(255,255,255,0.5)" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="scheduled" stackId="a" fill="var(--color-scheduled)" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="completed" stackId="a" fill="var(--color-completed)" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="cancelled" stackId="a" fill="var(--color-cancelled)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ChartContainer>
            )}

            <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
              {statusBreakdownEntries.map(([status, value]) => (
                <div
                  key={status}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-indigo-100"
                >
                  <p className="text-xs uppercase tracking-wide text-indigo-300">
                    {status}
                  </p>
                  <p className="text-lg font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 text-white backdrop-blur-lg xl:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-indigo-50">
              Revenue Orbit
            </CardTitle>
            <PieChart className="h-5 w-5 text-indigo-200" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-300" />
              </div>
            ) : monthlyRevenueData.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center text-center text-indigo-200">
                <AlertTriangle className="mb-3 h-8 w-8 text-amber-300" />
                <p>No revenue data yet</p>
                <p className="text-xs text-indigo-100/70">
                  Completed sessions with pricing will begin charting here.
                </p>
              </div>
            ) : (
              <ChartContainer
                config={{
                  revenue: { label: 'Revenue', color: 'var(--chart-1)' },
                  sessions: { label: 'Sessions', color: 'var(--chart-3)' },
                }}
                className="h-64 w-full"
              >
                <ComposedChart data={monthlyRevenueData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="sessions" stroke="var(--color-sessions)" strokeWidth={2} dot />
                  <Area type="monotone" dataKey="revenue" stroke="var(--color-revenue)" fill="url(#revenueGradient)" />
                </ComposedChart>
              </ChartContainer>
            )}

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                <p className="text-indigo-200">Average session ticket</p>
                <p className="font-semibold text-white">
                  {analytics
                    ? currencyFormatter.format(analytics.revenueMetrics.averageTicket || 0)
                    : currencyFormatter.format(0)}
                </p>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                <p className="text-indigo-200">Calendar connectivity</p>
                <p className="font-semibold text-white">
                  {analytics && analytics.userMetrics.totalUsers
                    ? percentageFormatter.format(
                        analytics.sessionMetrics.connectedCalendars /
                          Math.max(analytics.userMetrics.totalUsers, 1),
                      )
                    : percentageFormatter.format(0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

