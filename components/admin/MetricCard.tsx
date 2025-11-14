'use client'

import { Loader2 } from 'lucide-react'
import clsx from 'clsx'
import { Badge } from '@/components/ui/badge'

type MetricCardProps = {
  title: string
  description: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  value: number | string
  secondary?: string
  accent: string
  isLoading?: boolean
}

export function MetricCard({
  title,
  description,
  icon: Icon,
  value,
  secondary,
  accent,
  isLoading,
}: MetricCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-white shadow-xl backdrop-blur-lg">
      <div
        className={clsx(
          'absolute inset-0 opacity-60 blur-3xl',
          'bg-gradient-to-br',
          accent,
        )}
      />
      <div className="relative flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
            <Icon className="h-5 w-5 text-white" />
          </div>
          <Badge className="bg-white/20 text-xs uppercase tracking-wide text-indigo-100">
            Live data
          </Badge>
        </div>
        <div>
          <p className="text-sm uppercase tracking-wide text-indigo-100">{title}</p>
          <h3 className="mt-1 text-3xl font-semibold">
            {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-indigo-100" /> : value}
          </h3>
        </div>
        <p className="text-sm text-indigo-100/80">{description}</p>
        {secondary ? (
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-200/80">
            {secondary}
          </p>
        ) : null}
      </div>
    </div>
  )
}

