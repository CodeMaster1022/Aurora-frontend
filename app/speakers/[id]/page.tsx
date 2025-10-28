"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Star, Loader2, ArrowLeft, Calendar, Users, MessageSquare, CheckCircle2 } from "lucide-react"
import { learnerService } from "@/lib/services/learnerService"
import { useAppSelector } from "@/lib/hooks/redux"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SpeakerProfilePage({ params }: { params: { id: string } }) {
  const [speaker, setSpeaker] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const [isBooking, setIsBooking] = useState(false)
  const [bookingError, setBookingError] = useState("")
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const router = useRouter()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  
  // Booking form state
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    topic1: "",
    topic2: ""
  })

  useEffect(() => {
    fetchSpeakerProfile()
  }, [params.id])

  const fetchSpeakerProfile = async () => {
    try {
      setIsLoading(true)
      const response = await learnerService.getSpeakerProfile(params.id)
      if (response.success) {
        setSpeaker(response.data.speaker)
        setReviews(response.data.reviews)
      }
    } catch (error) {
      console.error("Error fetching speaker profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBooking = async () => {
    if (!formData.title || !formData.date || !formData.time) {
      setBookingError("Please fill in all required fields")
      return
    }

    const topics = [formData.topic1, formData.topic2].filter(t => t.trim() !== "")
    
    if (topics.length > 2) {
      setBookingError("Maximum 2 topics allowed")
      return
    }

    try {
      setIsBooking(true)
      setBookingError("")
      
      await learnerService.bookSession({
        speakerId: params.id,
        title: formData.title,
        date: formData.date,
        time: formData.time,
        topics: topics
      })

      setBookingSuccess(true)
      
      // Reset form
      setFormData({
        title: "",
        date: "",
        time: "",
        topic1: "",
        topic2: ""
      })

      // Close dialog after 2 seconds and redirect to dashboard
      setTimeout(() => {
        setIsBookingDialogOpen(false)
        router.push("/learners/dashboard")
      }, 2000)
    } catch (error: any) {
      console.error("Error booking session:", error)
      setBookingError(error.message || "Failed to book session")
    } finally {
      setIsBooking(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1A1A33]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (!speaker) {
    return (
      <div className="min-h-screen bg我在-[#1A1A33] pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-12 text-center">
              <p className="text-gray-300 text-lg mb-4">Speaker not found</p>
              <Button onClick={() => router.push('/speakers')} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Speakers
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1A1A33] pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Button
          onClick={() => router.push('/speakers')}
          variant="outline"
          className="mb-6 bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Speakers
        </Button>

        {/* Profile Header */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-6">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              {speaker.avatar ? (
                <Image
                  src={speaker.avatar}
                  alt={`${speaker.firstname} ${speaker.lastname}`}
                  width={150}
                  height={150}
                  className="rounded-full border-4 border-purple-500"
                />
              ) : (
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">
                    {speaker.firstname?.[0]}{speaker.lastname?.[0]}
                  </span>
                </div>
              )}

              {/* Name and Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                  {speaker.firstname} {speaker.lastname}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  <span className="text-white text-xl font-semibold">
                    {speaker.rating ? speaker.rating.toFixed(1) : 'New'}
                  </span>
                  <span className="text-gray-300">
                    ({speaker.reviewsCount || 0} review{speaker.reviewsCount !== 1 ? 's' : ''})
                  </span>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    <span className="text-sm">{speaker.totalSessions || 0} Sessions</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Users className="w-5 h-5 text-purple-400" />
                    <span className="text-sm">{speaker.completedSessions || 0} Completed</span>
                  </div>
                </div>

                {/* Book Session Button */}
                {isAuthenticated && user && user.role === 'learner' && (
                  <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book a Session
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#1A1A33] border-white/20 text-white">
                      <DialogHeader>
                        <DialogTitle className="text-white text-2xl">Book a Session</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {bookingSuccess ? (
                          <div className="text-center py-8">
                            <CheckCircle2 className="w-16 h-16 mx-auto text-green-400 mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">Session Booked!</h3>
                            <p className="text-gray-300">
                              Your session has been confirmed. Check your email for details.
                            </p>
                          </div>
                        ) : (
                          <>
                            <div>
                              <Label htmlFor="title" className="text-white">Session Title *</Label>
                              <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="E.g., Practice Conversation"
                                className="bg-white/10 border-white/20 text-white mt-2"
                              />
                            </div>

                            <div>
                              <Label htmlFor="date" className="text-white">Date *</Label>
                              <Input
                                id="date"
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="bg-white/10 border-white/20 text-white mt-2"
                              />
                            </div>

                            <div>
                              <Label htmlFor="time" className="text-white">Time *</Label>
                              <Input
                                id="time"
                                type="time"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                className="bg-white/10 border-white/20 text-white mt-2"
                              />
                            </div>

                            <div>
                              <Label className="text-white">Topics (max 2, optional)</Label>
                              <Input
                                placeholder="Topic 1"
                                value={formData.topic1}
                                onChange={(e) => setFormData({ ...formData, topic1: e.target.value })}
                                className="bg-white/10 border-white/20 text-white mt-2 mb-2"
                              />
                              <Input
                                placeholder="Topic 2"
                                value={formData.topic2}
                                onChange={(e) => setFormData({ ...formData, topic2: e.target.value })}
                                className="bg-white/10 border-white/20 text-white"
                              />
                            </div>

                            {bookingError && (
                              <div className="text-red-400 text-sm">{bookingError}</div>
                            )}

                            <Button
                              onClick={handleBooking}
                              disabled={isBooking}
                              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                            >
                              {isBooking ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Booking...
                                </>
                              ) : (
                                "Confirm Booking"
                              )}
                            </Button>
                          </>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>

            {/* Bio */}
            {speaker.bio && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="text-white font-semibold mb-3">About</h3>
                <p className="text-gray-300 leading-relaxed">{speaker.bio}</p>
              </div>
            )}

            {/* Interests */}
            {speaker.interests && speaker.interests.length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="text-white font-semibold mb-3">Topics & Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {speaker.interests.map((interest: string, idx: number) => (
                    <Badge
                      key={idx}
                      className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-sm py-1.5 px-3"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reviews Section */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Reviews ({reviews.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-white/5 rounded-lg p-4 border border-white/10"
                  >
                    {/* Review Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {review.from && typeof review.from === 'object' && review.from.avatar ? (
                          <Image
                            src={review.from.avatar}
                            alt={review.from.firstname}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {review.from && typeof review.from === 'object' 
                                ? `${review.from.firstname?.[0] || ''}${review.from.lastname?.[0] || ''}`
                                : 'U'
                              }
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-white font-medium">
                            {review.from && typeof review.from === 'object'
                              ? `${review.from.firstname} ${review.from.lastname}`
                              : 'Anonymous'
                            }
                          </p>
                          <p className="text-gray-400 text-sm">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-500'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review Comment */}
                    {review.comment && (
                      <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                <p className="text-gray-300">No reviews yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
