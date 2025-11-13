"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Loader2, ArrowLeft, Calendar, Users, MessageSquare } from "lucide-react"
import { learnerService } from "@/lib/services/learnerService"
import { useTranslation } from "@/lib/hooks/useTranslation"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { BookSessionDialog } from "@/components/speakers/BookSessionDialog"

export default function SpeakerProfilePage({ params }: { params: { id: string } }) {
  const { t } = useTranslation()
  const [speaker, setSpeaker] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1A1A33]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (!speaker) {
    return (
      <div className="min-h-screen bg-[#1A1A33] pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-12 text-center">
              <p className="text-gray-300 text-lg mb-4">{t('speakerProfile.notFound')}</p>
              <Button onClick={() => router.push('/speakers')} variant="outline" className="cursor-pointer">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('speakerProfile.backToSpeakers')}
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
          variant="ghost"
          className="mb-6 text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Speakers
        </Button>

        {/* Hero Section with Large Image */}
        <Card className="bg-transparent border-white/20 mb-8 overflow-hidden shadow-2xl p-0">
          <CardContent className="p-0">
            <div className="relative w-full h-[400px]">
              {speaker.avatar ? (
                <Image
                  src={speaker.avatar}
                  alt={`${speaker.firstname} ${speaker.lastname}`}
                  fill
                  className="object-cover"
                  priority
                  quality={90}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                  <span className="text-white text-8xl font-bold drop-shadow-2xl">
                    {speaker.firstname?.[0]}{speaker.lastname?.[0]}
                  </span>
                </div>
              )}
              
              {/* Gradient Overlays for Better Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A33] via-transparent to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-purple-500/5 to-purple-500/10"></div>
              
              {/* Decorative Corner Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-[200px]"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-cyan-500/20 to-transparent rounded-tr-[200px]"></div>
              
              {/* Subtle Border Glow */}
              <div className="absolute inset-0 border border-purple-500/20 pointer-events-none"></div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Header */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Profile Info Section */}
              <div className="flex-1">
                {/* Age and Name */}
                <div className="mb-4">
                  {speaker.age && (
                    <p className="text-gray-400 text-sm mb-2">{speaker.age} years</p>
                  )}
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                    {speaker.firstname} {speaker.lastname}
                  </h1>
                </div>
                
                {/* Rating and Stats */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-semibold">
                      {speaker.rating ? speaker.rating.toFixed(1) : t('speakerProfile.new')}
                    </span>
                    <span className="text-gray-400 text-sm">
                      ({speaker.reviewsCount || 0} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span className="text-sm">{speaker.totalSessions || 0} sessions</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm">{speaker.completedSessions || 0} completed</span>
                  </div>
                  {/* Cost Badge */}
                  {speaker.cost && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full">
                      <span className="text-purple-300 text-sm font-medium">Cost:</span>
                      <span className="text-white text-sm font-semibold">${speaker.cost}</span>
                    </div>
                  )}
                </div>

                {/* Interests */}
                {speaker.interests && speaker.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {speaker.interests.map((interest: string, idx: number) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="bg-transparent text-white border-white/30 hover:border-purple-400"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Bio */}
                {speaker.bio && (
                  <div className="mb-6">
                    <h3 className="text-white font-semibold mb-2">About</h3>
                    <p className="text-gray-300 leading-relaxed">{speaker.bio}</p>
                  </div>
                )}

                {/* Book Session Button */}
                <BookSessionDialog
                  speaker={speaker}
                  trigger={
                    <Button className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white cursor-pointer px-8 py-3 text-lg">
                      <Calendar className="w-5 h-5 mr-2" />
                      {t('speakerProfile.bookSession')}
                    </Button>
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Section */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              {t('speakerProfile.reviews')} ({reviews.length})
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
                              : t('speakerProfile.bookSession.anonymous')
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
                <p className="text-gray-300">{t('speakerProfile.bookSession.noReviews')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
