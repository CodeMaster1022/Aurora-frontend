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
  const [giftUrl, setGiftUrl] = useState<string>("")

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
      setError("")
      
      // Open a new window immediately (within user gesture context) to avoid mobile popup blockers
      // Use 'about:blank' instead of empty string for better Safari compatibility
      // We'll redirect it once we have the URL
      const newWindow = window.open('about:blank', '_blank', 'noopener,noreferrer')
      
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        // If popup was blocked, we'll show the URL as a clickable link instead
        const response = await speakerService.getGiftSong()
        
        if (response.success && response.data?.url) {
          setGiftUrl(response.data.url)
          setIsFetchingSong(false)
          
          // Try one more time with link click as fallback (for desktop Safari)
          setTimeout(() => {
            const link = document.createElement('a')
            link.href = response.data.url
            link.target = '_blank'
            link.rel = 'noopener noreferrer'
            link.style.display = 'none'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }, 100)
          
          return
        } else {
          setError("Failed to get YouTube song. Please try again.")
          setIsFetchingSong(false)
          return
        }
      }
      
      // Show loading message in the new window
      // Use try-catch for Safari compatibility in case document.write is restricted
      try {
        newWindow.document.open()
        newWindow.document.write(`
          <html>
            <head>
              <title>Opening your gift...</title>
              <style>
                body {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  margin: 0;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                }
                .container {
                  text-align: center;
                }
                .spinner {
                  border: 4px solid rgba(255,255,255,0.3);
                  border-top: 4px solid white;
                  border-radius: 50%;
                  width: 40px;
                  height: 40px;
                  animation: spin 1s linear infinite;
                  margin: 0 auto 20px;
                }
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="spinner"></div>
                <p>Opening your gift...</p>
              </div>
            </body>
          </html>
        `)
        newWindow.document.close()
      } catch (docError) {
        // If document.write fails (some Safari restrictions), just proceed with redirect
        console.warn('Could not write to new window:', docError)
      }
      
      const response = await speakerService.getGiftSong()
      
      if (response.success && response.data?.url) {
        // Check if window is still open (Safari might close it)
        if (newWindow && !newWindow.closed) {
          try {
            // Use location.replace for better Safari compatibility
            newWindow.location.replace(response.data.url)
          } catch (locationError) {
            // Fallback to href if replace fails
            try {
              newWindow.location.href = response.data.url
            } catch (hrefError) {
              // If both fail, close window and show clickable link
              newWindow.close()
              setGiftUrl(response.data.url)
              setIsFetchingSong(false)
              return
            }
          }
          
          // Close modal and call onSuccess callback
          setTimeout(() => {
            onOpenChange(false)
            if (onSuccess) {
              onSuccess()
            }
            // Reset state
            resetModal()
            // Clear loading state after modal operations complete
            setIsFetchingSong(false)
          }, 500)
        } else {
          // Window was closed or blocked, show clickable link
          setGiftUrl(response.data.url)
          setIsFetchingSong(false)
        }
      } else {
        if (newWindow && !newWindow.closed) {
          newWindow.close()
        }
        setError("Failed to get YouTube song. Please try again.")
        setIsFetchingSong(false)
      }
    } catch (err) {
      console.error("Error fetching gift song:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch gift song")
      setIsFetchingSong(false)
    }
  }

  const resetModal = () => {
    setRating(0)
    setHoverRating(0)
    setComment("")
    setError("")
    setShowThankYou(false)
    setGiftUrl("")
  }

  const handleClose = () => {
    if (!isLoading && !isFetchingSong) {
      // If feedback has been submitted (showThankYou is true), update status
      if (showThankYou && onSuccess) {
        onSuccess()
      }
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
              <p className="text-lg text-foreground">
                Thank you for sharing another story with Aurora.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {giftUrl ? (
              <div className="space-y-3">
                <p className="text-sm text-foreground text-center">
                  Please tap the link below to open your gift:
                </p>
                <a
                  href={giftUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                  onClick={() => {
                    setTimeout(() => {
                      onOpenChange(false)
                      if (onSuccess) {
                        onSuccess()
                      }
                      resetModal()
                    }, 500)
                  }}
                >
                  <Button className="w-full cursor-pointer bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-foreground">
                    <Gift className="mr-2 h-4 w-4" />
                    Open Your Gift
                  </Button>
                </a>
              </div>
            ) : (
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
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

