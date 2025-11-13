"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Search, Star, Loader2 } from "lucide-react"
import { learnerService } from "@/lib/services/learnerService"
import { useTranslation } from "@/lib/hooks/useTranslation"
import { BookSessionDialog } from "@/components/speakers/BookSessionDialog"

const FALLBACK_SPEAKERS = [
  {
    id: "default-1",
    firstname: "Margaret",
    lastname: "Thompson",
    age: 68,
    city: "Boston",
    state: "MA",
    rating: 4.9,
    ratingCount: 127,
    bio: "Retired history teacher with stories from 40 years in education.",
    interests: ["Travel", "History", "Cooking", "Culture"],
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "default-2",
    firstname: "Robert",
    lastname: "Williams",
    age: 72,
    city: "Seattle",
    state: "WA",
    rating: 5,
    ratingCount: 89,
    bio: "Former engineer who loves sharing knowledge about the world.",
    interests: ["Technology", "Science", "Nature", "Music"],
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "default-3",
    firstname: "Dorothy",
    lastname: "Martinez",
    age: 65,
    city: "Austin",
    state: "TX",
    rating: 4.8,
    ratingCount: 156,
    bio: "Retired librarian passionate about books and storytelling.",
    interests: ["Art", "Literature", "Gardening", "Family"],
    avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "default-4",
    firstname: "James",
    lastname: "Anderson",
    age: 70,
    city: "Portland",
    state: "OR",
    rating: 4.9,
    ratingCount: 98,
    bio: "Former business owner who traveled the world for 30 years.",
    interests: ["Business", "Travel", "Photography", "Sports"],
    avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "default-5",
    firstname: "Patricia",
    lastname: "Lee",
    age: 67,
    city: "Denver",
    state: "CO",
    rating: 5,
    ratingCount: 134,
    bio: "Wellness coach helping others live their best lives.",
    interests: ["Health", "Yoga", "Cooking", "Nature"],
    avatar: "https://images.unsplash.com/photo-1500631195312-e3a9a5819f83?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "default-6",
    firstname: "William",
    lastname: "Brown",
    age: 74,
    city: "Chicago",
    state: "IL",
    rating: 4.7,
    ratingCount: 76,
    bio: "Retired professor with a passion for deep conversations.",
    interests: ["History", "Politics", "Literature", "Chess"],
    avatar: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80",
  },
]

type Speaker = {
  _id?: string
  firstname: string
  lastname: string
  age?: number
  city?: string
  state?: string
  interests?: string[]
  bio?: string
  avatar?: string
  rating?: number
  ratingCount?: number
  cost?: number
}

type FilteredSpeaker = Speaker & { id?: string }

export default function SpeakersPage() {
  const { t } = useTranslation()
  const [speakers, setSpeakers] = useState<FilteredSpeaker[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        setIsLoading(true)
        const response = await learnerService.getSpeakers()
        if (response.success) {
          setSpeakers(response.data.speakers)
        } else {
          setSpeakers([])
        }
      } catch (error) {
        console.error("Error fetching speakers:", error)
        setSpeakers([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchSpeakers()
  }, [])

  const filteredSpeakers = useMemo(() => {
    const source: FilteredSpeaker[] = speakers.length > 0 ? speakers : FALLBACK_SPEAKERS
    if (!searchQuery.trim()) {
      return source
    }
    return source.filter((speaker) => {
      const fullName = `${speaker.firstname ?? ""} ${speaker.lastname ?? ""}`.toLowerCase()
      return fullName.includes(searchQuery.toLowerCase())
    })
  }, [searchQuery, speakers])

  return (
    <div className="min-h-screen bg-muted/40 py-16">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 space-y-4 text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Find Your Speaker</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Search by name or explore topics to meet the perfect person for your next conversation.
          </p>
          <div className="mx-auto flex max-w-xl items-center gap-3 rounded-full border border-border bg-background px-4 py-2 shadow-sm">
            <Search className="size-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by name or topic..."
              className="h-9 border-0 bg-transparent text-sm focus-visible:ring-0"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : filteredSpeakers.length === 0 ? (
          <div className="rounded-3xl border border-border/40 bg-card p-12 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">No speakers found</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your search or explore other topics to discover more voices.
            </p>
            <Button className="mt-6 rounded-full" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredSpeakers.map((speaker) => {
              const key = speaker._id ?? speaker.id ?? `${speaker.firstname}-${speaker.lastname}`
              const rating = speaker.rating ?? 4.9
              const ratingCount = speaker.ratingCount ?? 120
              const locationParts = [speaker.city, speaker.state].filter(Boolean)
              const location = locationParts.join(", ")
              return (
                <Card
                  key={key}
                  className="relative flex h-full flex-col gap-4 border border-border/60 bg-background p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative size-16 overflow-hidden rounded-full border border-border/60 bg-muted">
                      {speaker.avatar ? (
                        <Image src={speaker.avatar} alt={`${speaker.firstname} ${speaker.lastname}`} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary/10 text-lg font-semibold text-primary">
                          {(speaker.firstname?.[0] ?? "A") + (speaker.lastname?.[0] ?? "")}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {speaker.firstname} {speaker.lastname}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {speaker.age ? `${speaker.age} • ` : ""}
                            {location || "Remote"}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                          <Star className="size-3" />
                          <span>{rating.toFixed(1)}</span>
                          <span className="text-muted-foreground">({ratingCount})</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {speaker.bio ?? "Self introduction coming soon."}
                      </p>
                    </div>
                  </div>

                  {speaker.interests && speaker.interests.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {speaker.interests.slice(0, 4).map((interest, index) => (
                        <Badge
                          key={`${key}-${interest}-${index}`}
                          variant="outline"
                          className="rounded-full border-border/60 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-4 rounded-xl bg-primary/5 px-4 py-3">
                    <div className="text-sm font-semibold text-primary">
                      {speaker.cost && speaker.cost > 0 ? `$${speaker.cost}` : "Free"}
                    </div>
                    <BookSessionDialog
                      speaker={{
                        _id: speaker._id,
                        firstname: speaker.firstname,
                        lastname: speaker.lastname,
                        availability: (speaker as any)?.availability,
                      }}
                      trigger={
                        <Button className="rounded-full px-5 cursor-pointer bg-[#59248F] text-white">
                          Book Session
                        </Button>
                      }
                    />
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

