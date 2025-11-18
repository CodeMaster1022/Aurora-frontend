"use client"
import SpeakersPage from "../speakers/page"


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


// type add country

type FilteredSpeaker = Speaker & { id?: string }

export default function HomePage() {

  return (
    <>
      <SpeakersPage />
    </>
  )
}

