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
        <div className="mb-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {t('speakers.title')}
          </h1>
          {/* <p className="text-gray-300 text-lg">
            {t('speakers.subtitle')}
          </p> */}
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/10 backdrop-blur-lg border-white/20 mb-6 rounded-xl">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={t('speakers.search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-9 text-sm"
                />
              </div>

              {/* Topic Filter */}
              <div className="flex items-center gap-2 md:border-l md:pl-3 md:border-white/20">
                <Filter className="w-4 h-4 text-purple-400" />
                <div className="flex flex-wrap gap-1.5">
                  {topics.slice(0, 6).map((topic) => (
                    <Button
                      key={topic.key}
                      onClick={() => setSelectedTopic(topic.key === selectedTopic ? "" : topic.key)}
                      variant={selectedTopic === topic.key ? "default" : "outline"}
                      className={`h-8 px-2 text-xs ${
                        selectedTopic === topic.key
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "bg-white/10 border-white/20 text-gray-300 hover:bg-white/20"
                      }`}
                    >
                      {t(topic.translationKey as any)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-2 text-gray-400 text-xs">
              {filteredSpeakers.length} {filteredSpeakers.length !== 1 ? t('speakers.results.countPlural') : t('speakers.results.count')}
            </div>
          </CardContent>
        </div>

        {/* Speakers Grid */}
        {filteredSpeakers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredSpeakers.map((speaker) => (
              <Link href={`/speakers/${speaker._id}`} key={speaker._id}>
                <Card className="bg-[#1A1A33] border-white/20 hover:shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer h-full flex flex-col overflow-hidden rounded-2xl">
                  {/* Top Half - Full Width Image */}
                  <div className="relative w-full h-[180px] overflow-hidden">
                    {speaker.avatar ? (
                      <Image
                        src={speaker.avatar}
                        alt={`${speaker.firstname} ${speaker.lastname}`}
                        fill
                        className="object-cover object-center"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                        <span className="text-white text-6xl font-bold">
                          {speaker.firstname?.[0]}{speaker.lastname?.[0]}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Half - Content */}
                  <CardContent className="p-4 flex-1 flex flex-col">
                    {/* Age */}
                    {speaker.age && (
                      <p className="text-gray-400 text-xs mb-1">{speaker.age} years</p>
                    )}
                    
                    {/* Name */}
                    <h3 className="text-lg font-bold text-white mb-2">
                      {speaker.firstname} {speaker.lastname}
                    </h3>

                    {/* Bio */}
                    {speaker.bio && (
                      <p className="text-gray-300 text-xs mb-3 line-clamp-2 flex-grow min-h-[2.5rem]">
                        {speaker.bio}
                      </p>
                    )}

                    {/* Interests */}
                    {speaker.interests && speaker.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {speaker.interests.slice(0, 2).map((interest: string, idx: number) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="bg-transparent text-white border-white/30 hover:border-purple-400 text-xs py-0 px-2 h-6"
                          >
                            {interest}
                          </Badge>
                        ))}
                        {speaker.interests.length > 2 && (
                          <Badge variant="outline" className="bg-transparent text-gray-400 border-gray-600/30 text-xs py-0 px-2 h-6">
                            +{speaker.interests.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Bottom Row - Cost and Button - Always at bottom */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">
                      <div className="flex items-center gap-2">
                        <span className="text-purple-400 font-bold text-sm">
                          {speaker.cost ? `$${speaker.cost}` : 'Free'}
                        </span>
                        {speaker.cost && speaker.cost > 0 && (
                          <span className="text-gray-500 text-xs line-through">$300</span>
                        )}
                      </div>
                      <Button
                        className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-lg px-4 py-1.5 text-sm h-8"
                      >
                        Schedule
                      </Button>
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

