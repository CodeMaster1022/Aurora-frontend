"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Star, Loader2, Filter } from "lucide-react"
import { learnerService } from "@/lib/services/learnerService"
import { useTranslation } from "@/lib/hooks/useTranslation"
import Image from "next/image"
import Link from "next/link"

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
      <div className="flex items-center justify-center min-h-screen bg-[#1A1A33]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1A1A33] pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {t('speakers.title')}
          </h1>
          <p className="text-gray-300 text-lg">
            {t('speakers.subtitle')}
          </p>
        </div>

        {/* Search and Filter Section */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-8">
          <CardContent className="p-6">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder={t('speakers.search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 text-lg"
              />
            </div>

            {/* Topic Filter */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-purple-400" />
                <h3 className="text-white font-semibold">{t('speakers.filter.title')}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={clearFilters}
                  variant={!selectedTopic ? "default" : "outline"}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  size="sm"
                >
                  {t('speakers.filter.allTopics')}
                </Button>
                {topics.map((topic) => (
                  <Button
                    key={topic.key}
                    onClick={() => setSelectedTopic(topic.key)}
                    variant={selectedTopic === topic.key ? "default" : "outline"}
                    className={
                      selectedTopic === topic.key
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "bg-white/10 border-white/20 text-gray-300 hover:bg-white/20"
                    }
                    size="sm"
                  >
                    {t(topic.translationKey as any)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-gray-300 text-sm">
              {filteredSpeakers.length} {filteredSpeakers.length !== 1 ? t('speakers.results.countPlural') : t('speakers.results.count')}
            </div>
          </CardContent>
        </Card>

        {/* Speakers Grid */}
        {filteredSpeakers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpeakers.map((speaker) => (
              <Link href={`/speakers/${speaker._id}`} key={speaker._id}>
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all cursor-pointer h-full">
                  <CardContent className="p-6">
                    {/* Avatar and Basic Info */}
                    <div className="flex flex-col items-center mb-4">
                      {speaker.avatar ? (
                        <Image
                          src={speaker.avatar}
                          alt={`${speaker.firstname} ${speaker.lastname}`}
                          width={100}
                          height={100}
                          className="rounded-full border-4 border-purple-500 mb-3"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center mb-3">
                          <span className="text-white text-2xl font-bold">
                            {speaker.firstname?.[0]}{speaker.lastname?.[0]}
                          </span>
                        </div>
                      )}
                      <h3 className="text-xl font-semibold text-white text-center mb-1">
                        {speaker.firstname} {speaker.lastname}
                      </h3>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-gray-300 text-sm">
                          {speaker.rating ? speaker.rating.toFixed(1) : t('speakers.card.new')}
                        </span>
                        <span className="text-gray-500 text-sm">
                          ({speaker.reviewsCount || 0} {t('speakers.card.reviews')})
                        </span>
                      </div>
                    </div>

                    {/* Bio */}
                    {speaker.bio && (
                      <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                        {speaker.bio}
                      </p>
                    )}

                    {/* Interests */}
                    {speaker.interests && speaker.interests.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {speaker.interests.slice(0, 3).map((interest: string, idx: number) => (
                          <Badge
                            key={idx}
                            className="bg-purple-500/20 text-purple-300 border-purple-500/30"
                          >
                            {interest}
                          </Badge>
                        ))}
                        {speaker.interests.length > 3 && (
                          <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">
                            +{speaker.interests.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Session Stats */}
                    <div className="mt-4 pt-4 border-t border-white/10 text-center text-sm text-gray-400">
                      {speaker.totalSessions || 0} {t('speakers.card.sessions')}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-12 text-center">
              <p className="text-gray-300 text-lg">
                {t('speakers.noResults')}
              </p>
              <Button
                onClick={clearFilters}
                variant="outline"
                className="mt-4 cursor-pointer"
              >
                {t('speakers.clearFilters')}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

