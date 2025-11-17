"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star, Loader2, Gift, X } from "lucide-react"
import { speakerService } from "@/lib/services/speakerService"

interface SpeakerRatingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sessionId: string
  learnerName: string
  onSuccess?: () => void
}

export function SpeakerRatingModal({
  open,
  onOpenChange,
  sessionId,
  learnerName,
  onSuccess
}: SpeakerRatingModalProps) {
  const [rating, setRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [comment, setComment] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [showThankYou, setShowThankYou] = useState(false)
  const [isFetchingSong, setIsFetchingSong] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a rating")
      return
    }

    try {
      setIsLoading(true)
      setError("")
      
      await speakerService.rateLearner(sessionId, rating, comment.trim() || "")
      
      // Show thank you message
      setShowThankYou(true)
    } catch (err) {
      console.error("Error submitting review:", err)
      setError(err instanceof Error ? err.message : "Failed to submit review")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReceiveGift = async () => {
    try {
      setIsFetchingSong(true)
      
      const response = await speakerService.getGiftSong()
      
      if (response.success && response.data.url) {
        // Open the YouTube link in a new tab
        window.open(response.data.url, "_blank", "noopener,noreferrer")
        
        // Close modal and call onSuccess callback
        setTimeout(() => {
          onOpenChange(false)
          if (onSuccess) {
            onSuccess()
          }
          // Reset state
          resetModal()
        }, 500)
      }
    } catch (err) {
      console.error("Error fetching gift song:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch gift song")
    } finally {
      setIsFetchingSong(false)
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
    if (!isLoading && !isFetchingSong) {
      onOpenChange(false)
      resetModal()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-w-[95vw] mx-4">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-foreground">
            {showThankYou ? "Thank you!" : "Rate Your Session"}
          </DialogTitle>
        </DialogHeader>

        {!showThankYou ? (
          <div className="space-y-6 py-4">
            {/* Rating */}
            <div className="space-y-3">
              <p className="text-sm text-foreground text-center">
                How would you rate your session with <span className="font-semibold">{learnerName}</span>?
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
              <label htmlFor="comment" className="text-sm font-medium text-foreground">
                Share your thoughts (optional)
              </label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a short review about the session (optional)..."
                rows={4}
                disabled={isLoading}
                className="resize-none text-foreground"
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
                  <Gift className="w-12 h-12 text-purple-600" />
                </div>
              </div>
              <p className="text-lg text-gray-800">
                Thank you for sharing another story with Aurora.
              </p>
            </div>

            <Button
              onClick={handleReceiveGift}
              disabled={isFetchingSong}
              className="w-full cursor-pointer bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-foreground"
            >
              {isFetchingSong ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Opening...
                </>
              ) : (
                <>
                  <Gift className="mr-2 h-4 w-4" />
                  Receive your gift
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

