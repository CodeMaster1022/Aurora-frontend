"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Star, Loader2, Filter } from "lucide-react"
import { learnerService } from "@/lib/services/learnerService"
import { useTranslation } from "@/lib/hooks/useTranslation"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"

export default function SpeakersPage() {
  const { t } = useTranslation()
  const [speakers, setSpeakers] = useState<any[]>([])
  const [filteredSpeakers, setFilteredSpeakers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTopic, setSelectedTopic] = useState<string>("")

  const topics = [
    { key: "Business", translationKey: 'speakers.filter.business' },
    { key: "Technology", translationKey: 'speakers.filter.technology' },
    { key: "Health", translationKey: 'speakers.filter.health' },
    { key: "Education", translationKey: 'speakers.filter.education' },
    { key: "Arts", translationKey: 'speakers.filter.arts' },
    { key: "Sports", translationKey: 'speakers.filter.sports' },
    { key: "Travel", translationKey: 'speakers.filter.travel' },
    { key: "Food", translationKey: 'speakers.filter.food' },
    { key: "Science", translationKey: 'speakers.filter.science' },
    { key: "Entertainment", translationKey: 'speakers.filter.entertainment' }
  ]

  useEffect(() => {
    fetchSpeakers()
  }, [])

  useEffect(() => {
    filterSpeakers()
  }, [searchQuery, selectedTopic, speakers])

  const fetchSpeakers = async () => {
    try {
      setIsLoading(true)
      const response = await learnerService.getSpeakers()
      if (response.success) {
        setSpeakers(response.data.speakers)
        setFilteredSpeakers(response.data.speakers)
      }
    } catch (error) {
      console.error("Error fetching speakers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterSpeakers = () => {
    let filtered = speakers

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(speaker => {
        const fullName = `${speaker.firstname} ${speaker.lastname}`.toLowerCase()
        return fullName.includes(searchQuery.toLowerCase())
      })
    }

    // Topic filter
    if (selectedTopic) {
      filtered = filtered.filter(speaker => 
        speaker.interests?.includes(selectedTopic)
      )
    }

    setFilteredSpeakers(filtered)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedTopic("")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground transition-colors duration-300">
        <Loader2 className="h-8 w-8 animate-spin text-[#524FD5]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 sm:pb-0 pb-12">
      <Header />
      <main className="relative py-16 px-4 sm:px-6">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#F7F2FF] via-[#EEE8FF] to-[#FBF6FF] dark:from-[#080A18] dark:via-[#161B2D] dark:to-[#3B82F6] opacity-60 dark:opacity-90 transition-colors duration-700" />
        <div className="absolute inset-0 -z-10 opacity-40 dark:opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(0deg, rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.25) 1px, transparent 1px)",
            backgroundSize: "120px 120px",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-4 text-left">
          <h1 className="text-xl sm:text-xl font-bold text-foreground mb-4 transition-colors duration-300">
            {t('speakers.title')}
          </h1>
          {/* <p className="text-gray-300 text-lg">
            {t('speakers.subtitle')}
          </p> */}
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 transition-colors duration-300">
          <div className="">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={t('speakers.search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-transparent border border-border/60 text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-[#7357F5]/40 focus-visible:border-[#7357F5]/50 h-10 text-sm"
                />
              </div>

              {/* Topic Filter */}
              <div className="flex items-center gap-2 md:border-l md:pl-3 md:border-border/60">
                <Filter className="w-4 h-4 text-[#7357F5]" />
                <div className="flex flex-wrap gap-1.5 justify-end">
                  {topics.slice(0, 6).map((topic) => (
                    <Button
                      key={topic.key}
                      onClick={() => setSelectedTopic(topic.key === selectedTopic ? "" : topic.key)}
                      variant={selectedTopic === topic.key ? "default" : "outline"}
                      className={`h-8 px-3 text-xs rounded-full border ${
                        selectedTopic === topic.key
                          ? "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white border-transparent shadow-md hover:brightness-110"
                          : "bg-transparent border-border/60 text-muted-foreground hover:bg-muted/20"
                      }`}
                    >
                      {t(topic.translationKey as any)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Count */}
            {/* <div className="mt-3 text-muted-foreground text-xs">
              {filteredSpeakers.length} {filteredSpeakers.length !== 1 ? t('speakers.results.countPlural') : t('speakers.results.count')}
            </div> */}
          </div>
        </div>

        {/* Speakers Grid */}
        {filteredSpeakers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSpeakers.map((speaker) => (
              <Link
                href={`/speakers/${speaker._id}`}
                key={speaker._id}
                className="h-full"
              >
                <div className="bg-card text-card-foreground backdrop-blur-sm border border-border/60 rounded-3xl shadow-lg p-6 flex flex-col gap-5 h-full transition-colors duration-300 hover:shadow-xl hover:border-[#7357F5]/60 cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="relative h-16 w-16 rounded-full border-4 border-indigo-100 bg-gradient-to-br from-indigo-100 to-cyan-100 overflow-hidden flex items-center justify-center text-indigo-600 font-semibold text-xl">
                      {speaker.avatar ? (
                        <Image
                          src={speaker.avatar}
                          alt={`${speaker.firstname || ""} ${speaker.lastname || ""}`}
                          fill
                          className="object-cover"
                          sizes="64px"
                          unoptimized
                        />
                      ) : (
                        <span>
                          {speaker.firstname?.[0] || ""}
                          {speaker.lastname?.[0] || ""}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground transition-colors duration-300">
                        {speaker.firstname} {speaker.lastname}
                      </h3>
                      {(speaker.age || speaker.location) && (
                        <p className="text-sm text-muted-foreground transition-colors duration-300">
                          {[
                            speaker.age ? `${speaker.age} ${t('home.speakerCard.age')}` : null,
                            speaker.location,
                          ]
                            .filter(Boolean)
                            .join(" • ")}
                        </p>
                      )}
                      {(() => {
                        const ratingValue =
                          typeof speaker.rating === "number"
                            ? speaker.rating
                            : typeof speaker.averageRating === "number"
                              ? speaker.averageRating
                              : undefined
                        const reviewCount =
                          speaker.reviewsCount ??
                          speaker.reviewCount ??
                          speaker.totalReviews ??
                          (Array.isArray(speaker.reviews) ? speaker.reviews.length : undefined)
                        if (!ratingValue && !reviewCount) {
                          return null
                        }
                        return (
                          <div className="mt-2 flex items-center gap-1 text-indigo-500 dark:text-indigo-300 text-sm font-medium transition-colors duration-300">
                            <Star className="w-4 h-4 fill-current stroke-0" />
                            <span>{ratingValue ? ratingValue.toFixed(1) : "New"}</span>
                            {reviewCount ? (
                              <span className="text-slate-400 dark:text-slate-500 font-normal">
                                ({reviewCount})
                              </span>
                            ) : null}
                          </div>
                        )
                      })()}
                    </div>
                  </div>

                  {speaker.bio && (
                    <p className="text-sm leading-relaxed text-muted-foreground transition-colors duration-300">
                      {speaker.bio}
                    </p>
                  )}

                  {speaker.interests && speaker.interests.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {speaker.interests.slice(0, 4).map((interest: string, idx: number) => (
                        <span
                          key={idx}
                          className="rounded-full bg-[#7357F5] text-white text-xs font-medium px-3 py-1"
                        >
                          {interest}
                        </span>
                      ))}
                      {speaker.interests.length > 4 && (
                        <span className="rounded-full border border-border/60 text-muted-foreground text-xs font-medium px-3 py-1 transition-colors duration-300">
                          +{speaker.interests.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-auto">
                    <button className="w-full cursor-pointer rounded-xl border border-border bg-transparent py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted/20">
                      {t('home.speakerCard.book')}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="bg-card/80 dark:bg-slate-900/70 backdrop-blur-md border border-border/60 shadow-lg transition-colors duration-300">
            <CardContent className="p-12 text-center space-y-4">
              <p className="text-muted-foreground text-lg">
                {t('speakers.noResults')}
              </p>
              <Button
                onClick={clearFilters}
                variant="outline"
                className="cursor-pointer"
              >
                {t('speakers.clearFilters')}
              </Button>
            </CardContent>
          </Card>
        )}
        </div>
      </main>
    </div>
  )
}

