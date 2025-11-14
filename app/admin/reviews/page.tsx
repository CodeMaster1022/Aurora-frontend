'use client'

import { useEffect, useState } from 'react'
import { Pencil, Trash2, Loader2, AlertTriangle } from 'lucide-react'
import { adminService } from '@/lib/services/adminService'
import { AdminReview } from '@/lib/types/admin'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { ratingOptions } from '@/components/admin/constants'

type ReviewFormState = {
  rating: number
  comment: string
}

export default function AdminReviewsPage() {
  const { toast } = useToast()
  const [reviews, setReviews] = useState<AdminReview[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [filters, setFilters] = useState({
    search: '',
    rating: 'all',
    page: 1,
    limit: 10,
  })

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10,
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editingReview, setEditingReview] = useState<AdminReview | null>(null)
  const [reviewForm, setReviewForm] = useState<ReviewFormState>({
    rating: 5,
    comment: '',
  })

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await adminService.getReviews({
          rating: filters.rating === 'all' ? undefined : Number(filters.rating),
          search: filters.search || undefined,
          page: filters.page,
          limit: filters.limit,
        })

        if (response.success) {
          setReviews(response.data.reviews)
          setPagination(response.data.pagination)
        }
      } catch (err) {
        console.error('Failed to load reviews', err)
        setError(
          err instanceof Error
            ? err.message
            : 'We could not fetch the latest reviews.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    void fetchReviews()
  }, [filters])

  const openEditDialog = (review: AdminReview) => {
    setEditingReview(review)
    setReviewForm({
      rating: review.rating,
      comment: review.comment || '',
    })
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingReview(null)
    setReviewForm({
      rating: 5,
      comment: '',
    })
  }

  const handleSaveReview = async () => {
    if (!editingReview) {
      closeDialog()
      return
    }

    try {
      setIsSaving(true)
      await adminService.updateReview(editingReview._id, {
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      })
      toast({
        title: 'Review updated',
        description: 'Feedback has been refreshed.',
      })
      closeDialog()
      setFilters((prev) => ({ ...prev }))
    } catch (err) {
      console.error('Failed to update review', err)
      toast({
        title: 'Unable to update review',
        description:
          err instanceof Error ? err.message : 'Please try again in a moment.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await adminService.deleteReview(reviewId)
      toast({
        title: 'Review removed',
        description: 'The review has been deleted.',
      })
      setFilters((prev) => ({ ...prev }))
    } catch (err) {
      console.error('Failed to delete review', err)
      toast({
        title: 'Deletion failed',
        description:
          err instanceof Error ? err.message : 'We could not remove this review.',
        variant: 'destructive',
      })
    }
  }

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-white">Reviews</h2>
        <p className="text-sm text-indigo-200">
          Monitor the pulse of community feedback.
        </p>
      </header>

      {error ? (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <Card className="bg-white/5 text-white backdrop-blur-lg">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-lg font-semibold text-indigo-50">
            Feedback feed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <Input
              placeholder="Search feedback"
              value={filters.search}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  search: event.target.value,
                  page: 1,
                }))
              }
              className="md:col-span-2 bg-white/10 text-white placeholder:text-indigo-200/60"
            />
            <Select
              value={filters.rating}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  rating: value,
                  page: 1,
                }))
              }
            >
              <SelectTrigger className="bg-white/10 text-white">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 text-indigo-100">
                <SelectItem value="all">All ratings</SelectItem>
                {ratingOptions.map((rating) => (
                  <SelectItem key={rating} value={String(rating)}>
                    {rating} stars
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="hidden overflow-hidden rounded-lg border border-white/10 sm:block">
            <div className="max-w-full overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader className="bg-white/5 text-sm uppercase tracking-wide text-indigo-200">
                  <TableRow>
                    <TableHead className="text-indigo-200">Rating</TableHead>
                    <TableHead className="text-indigo-200">Comment</TableHead>
                    <TableHead className="text-indigo-200">From</TableHead>
                    <TableHead className="text-indigo-200">To</TableHead>
                    <TableHead className="text-indigo-200">Session</TableHead>
                    <TableHead className="text-right text-indigo-200">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <div className="flex items-center justify-center py-10 text-indigo-200">
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Loading reviews...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : reviews.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <div className="flex flex-col items-center justify-center py-10 text-indigo-200">
                          <AlertTriangle className="mb-2 h-8 w-8 text-amber-300" />
                          <p>No reviews available with the current filters.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    reviews.map((review) => (
                      <TableRow key={review._id} className="border-white/5 hover:bg-white/5">
                        <TableCell className="text-indigo-100">
                          <Badge className="bg-amber-500/20 text-amber-200">
                            {review.rating} ★
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs text-indigo-100">
                          <p className="line-clamp-3 text-sm">{review.comment || '—'}</p>
                        </TableCell>
                        <TableCell className="text-indigo-100">
                          {review.from && typeof review.from === 'object'
                            ? `${review.from.firstname || ''} ${review.from.lastname || ''}`
                            : '—'}
                          <span className="block text-xs capitalize text-indigo-200/70">
                            {review.from && typeof review.from === 'object' ? review.from.role : ''}
                          </span>
                        </TableCell>
                        <TableCell className="text-indigo-100">
                          {review.to && typeof review.to === 'object'
                            ? `${review.to.firstname || ''} ${review.to.lastname || ''}`
                            : '—'}
                          <span className="block text-xs capitalize text-indigo-200/70">
                            {review.to && typeof review.to === 'object' ? review.to.role : ''}
                          </span>
                        </TableCell>
                        <TableCell className="text-indigo-100">
                          {review.session && typeof review.session === 'object'
                            ? review.session.title
                            : '—'}
                        </TableCell>
                        <TableCell className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openEditDialog(review)}
                            className="text-indigo-100 hover:bg-indigo-500/20"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteReview(review._id)}
                            className="text-rose-300 hover:bg-rose-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="space-y-3 sm:hidden">
            {isLoading ? (
              <div className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 py-10 text-indigo-200">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading reviews...
              </div>
            ) : reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/5 py-10 text-indigo-200">
                <AlertTriangle className="mb-2 h-8 w-8 text-amber-300" />
                <p>No reviews available with the current filters.</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div
                  key={review._id}
                  className="rounded-2xl border border-white/15 bg-white/5 p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <Badge className="bg-amber-500/20 text-amber-200">
                      {review.rating} ★
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-indigo-100 hover:bg-indigo-500/20"
                        onClick={() => openEditDialog(review)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-rose-300 hover:bg-rose-500/20"
                        onClick={() => handleDeleteReview(review._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-indigo-100">
                    {review.comment || 'No comment provided'}
                  </p>

                  <div className="mt-4 space-y-2 text-xs text-indigo-200/80">
                    <div className="flex justify-between gap-3">
                      <span className="uppercase tracking-wide text-[11px] text-indigo-300/70">
                        From
                      </span>
                      <span className="text-right text-sm text-white">
                        {review.from && typeof review.from === 'object'
                          ? `${review.from.firstname || ''} ${review.from.lastname || ''}`.trim() || review.from.role
                          : '—'}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="uppercase tracking-wide text-[11px] text-indigo-300/70">
                        To
                      </span>
                      <span className="text-right text-sm text-white">
                        {review.to && typeof review.to === 'object'
                          ? `${review.to.firstname || ''} ${review.to.lastname || ''}`.trim() || review.to.role
                          : '—'}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="uppercase tracking-wide text-[11px] text-indigo-300/70">
                        Session
                      </span>
                      <span className="text-right text-sm text-white">
                        {review.session && typeof review.session === 'object'
                          ? review.session.title
                          : '—'}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="uppercase tracking-wide text-[11px] text-indigo-300/70">
                        Updated
                      </span>
                      <span className="text-right text-sm text-white">
                        {new Date(review.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex flex-col items-start justify-between gap-3 text-sm text-indigo-100 sm:flex-row sm:items-center">
            <div>
              Page {pagination.page} of {pagination.pages} — {pagination.total} reviews
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-white/20 text-foreground hover:bg-white/10"
                disabled={filters.page <= 1 || isLoading}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: Math.max(prev.page - 1, 1),
                  }))
                }
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-background text-foreground  hover:bg-white/10"
                disabled={filters.page >= pagination.pages || isLoading}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: Math.min(prev.page + 1, pagination.pages),
                  }))
                }
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg bg-slate-950/95 text-white">
          <DialogHeader>
            <DialogTitle>Adjust review</DialogTitle>
            <DialogDescription className="text-indigo-100">
              Fine-tune the feedback to keep the ecosystem fair and constructive.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="review-rating">Rating</Label>
              <Select
                value={String(reviewForm.rating)}
                onValueChange={(value) =>
                  setReviewForm((prev) => ({ ...prev, rating: Number(value) }))
                }
              >
                <SelectTrigger id="review-rating" className="bg-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 text-indigo-100">
                  {ratingOptions.map((rating) => (
                    <SelectItem key={rating} value={String(rating)}>
                      {rating} stars
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="review-comment">Comment</Label>
              <Textarea
                id="review-comment"
                value={reviewForm.comment}
                onChange={(event) =>
                  setReviewForm((prev) => ({ ...prev, comment: event.target.value }))
                }
                className="bg-white/10 text-white"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={handleSaveReview} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save review'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
