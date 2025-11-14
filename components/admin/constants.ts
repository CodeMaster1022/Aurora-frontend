import { AdminUser } from '@/lib/types/admin'

export const ROLE_OPTIONS: Array<{ label: string; value: AdminUser['role'] }> = [
  { label: 'Admin', value: 'admin' },
  { label: 'Moderator', value: 'moderator' },
  { label: 'Speaker', value: 'speaker' },
  { label: 'Learner', value: 'learner' },
]

export const STATUS_OPTIONS: Array<{ label: string; value: AdminUser['status'] }> = [
  { label: 'Under Review', value: 'review' },
  { label: 'Approved', value: 'success' },
  { label: 'Rejected', value: 'failed' },
]

export const ratingOptions = [1, 2, 3, 4, 5]

export const statusBadgeStyles: Record<AdminUser['status'], string> = {
  review: 'bg-amber-100 text-amber-800',
  success: 'bg-emerald-100 text-emerald-800',
  failed: 'bg-rose-100 text-rose-800',
}

export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export const percentageFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})

