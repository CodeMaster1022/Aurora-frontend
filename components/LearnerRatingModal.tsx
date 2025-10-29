"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star, Loader2, Gift, Heart } from "lucide-react"
import { learnerService } from "@/lib/services/learnerService"

interface LearnerRatingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sessionId: string
  speakerName: string
  onSuccess?: () => void
}

export function LearnerRatingModal({
  open,
  onOpenChange,
  sessionId,
  speakerName,
  onSuccess
}: LearnerRatingModalProps) {
  const [rating, setRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [comment, setComment] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [showThankYou, setShowThankYou] = useState(false)
  const [isCreatingDonation, setIsCreatingDonation] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a rating")
      return
    }

    try {
      setIsLoading(true)
      setError("")
      
      await learnerService.rateSession(sessionId, rating, comment.trim() || "")
      
      // Show thank you message
      setShowThankYou(true)
    } catch (err) {
      console.error("Error submitting review:", err)
      setError(err instanceof Error ? err.message : "Failed to submit review")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDonate = async () => {
    try {
      setIsCreatingDonation(true)
      setError("")
      
      // Create Stripe checkout session
      const response = await learnerService.createDonation()
      
      if (response.success && response.data?.url) {
        // Redirect to Stripe checkout
        window.location.href = response.data.url
      } else {
        // Check if it's a configuration error
        if ((response as any).error === 'STRIPE_NOT_CONFIGURED') {
          setError("Donation feature is temporarily unavailable. Please try again later.")
        } else {
          setError((response as any).message || "Failed to create donation checkout")
        }
        setIsCreatingDonation(false)
      }
    } catch (err: any) {
      console.error("Error creating donation:", err)
      // Check if it's the Stripe configuration error
      if (err.response?.data?.error === 'STRIPE_NOT_CONFIGURED' || err.message?.includes('Stripe is not configured')) {
        setError("Donation feature is temporarily unavailable. Please try again later.")
      } else {
        setError(err.message || "Failed to create donation")
      }
      setIsCreatingDonation(false)
    }
  }

  const resetModal = () => {
    setRating(0)
    setHoverRating(0)
    setComment("")
    setError("")
    setShowThankYou(false)
  }

  const handleClose = () => {
    if (!isLoading && !isCreatingDonation) {
      onOpenChange(false)
      resetModal()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-w-[95vw] mx-4">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-white">
            {showThankYou ? "Thank you!" : "Rate Your Session"}
          </DialogTitle>
        </DialogHeader>

        {!showThankYou ? (
          <div className="space-y-6 py-4">
            {/* Rating */}
            <div className="space-y-3">
              <p className="text-sm text-gray-600 text-center">
                How would you rate your session with <span className="font-semibold">{speakerName}</span>?
              </p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    disabled={isLoading}
                    className="transition-all duration-200 disabled:opacity-50"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      } transition-all duration-200 hover:scale-110`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <label htmlFor="comment" className="text-sm font-medium text-white">
                Share your thoughts (optional)
              </label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a short review about the session..."
                rows={4}
                disabled={isLoading}
                className="resize-none"
              />
            </div>

            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="rounded-full bg-purple-100 p-4">
                  <Heart className="w-12 h-12 text-purple-600" />
                </div>
              </div>
              <p className="text-lg text-gray-800">
                Thank you for making Aurora possible.
              </p>
            </div>

            <Button
              onClick={handleDonate}
              disabled={isCreatingDonation}
              className="w-full cursor-pointer bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white"
            >
              {isCreatingDonation ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Gift className="mr-2 h-4 w-4" />
                  Donate to help Aurora grow
                </>
              )}
            </Button>

            {/* Skip donation button */}
            <Button
              variant="ghost"
              onClick={() => {
                onOpenChange(false)
                if (onSuccess) {
                  onSuccess()
                }
                resetModal()
              }}
              disabled={isCreatingDonation}
              className="w-full"
            >
              Maybe later
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

