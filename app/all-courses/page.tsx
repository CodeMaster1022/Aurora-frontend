'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useRouter } from 'next/navigation';
import { 
  Search,
  Filter,
  Star,
  Clock,
  Users,
  BookOpen,
  Play,
  Award,
  TrendingUp,
  Heart,
  Share2,
  ChevronDown,
  Grid3X3,
  List,
  SortAsc,
  MessageSquare,
  Headphones,
  Brain,
  Globe,
  Zap,
  Target
} from 'lucide-react';

// Demo courses data
const allCourses = [
  {
    id: 'speaking-basics',
    title: 'Speaking Basics',
    description: 'Master fundamental speaking skills with interactive exercises and real-world practice',
    instructor: 'Dr. Sarah Johnson',
    category: 'Speaking',
    level: 'Beginner',
    duration: '6 weeks',
    lessons: 24,
    students: 15420,
    rating: 4.8,
    reviews: 2341,
    price: 'Free',
    originalPrice: null,
    thumbnail: '/placeholder.jpg',
    tags: ['Speaking', 'Pronunciation', 'Conversation'],
    featured: true,
    bestseller: false,
    new: false,
    lastUpdated: '2024-01-15'
  },
  {
    id: 'advanced-conversation',
    title: 'Advanced Conversation Mastery',
    description: 'Take your speaking skills to the next level with advanced conversation techniques',
    instructor: 'Prof. Emily Davis',
    category: 'Speaking',
    level: 'Advanced',
    duration: '8 weeks',
    lessons: 32,
    students: 8765,
    rating: 4.9,
    reviews: 1543,
    price: '$49.99',
    originalPrice: '$79.99',
    thumbnail: '/placeholder.jpg',
    tags: ['Advanced Speaking', 'Business English', 'Fluency'],
    featured: false,
    bestseller: true,
    new: false,
    lastUpdated: '2024-01-20'
  },
  {
    id: 'listening-comprehension',
    title: 'Listening Comprehension Pro',
    description: 'Improve your listening skills with diverse audio content and exercises',
    instructor: 'Dr. Michael Chen',
    category: 'Listening',
    level: 'Intermediate',
    duration: '5 weeks',
    lessons: 20,
    students: 12340,
    rating: 4.7,
    reviews: 1876,
    price: '$29.99',
    originalPrice: '$49.99',
    thumbnail: '/placeholder.jpg',
    tags: ['Listening', 'Audio Comprehension', 'Accents'],
    featured: false,
    bestseller: false,
    new: true,
    lastUpdated: '2024-01-25'
  },
  {
    id: 'vocabulary-builder',
    title: 'Ultimate Vocabulary Builder',
    description: 'Expand your vocabulary with systematic learning and memory techniques',
    instructor: 'Lisa Rodriguez',
    category: 'Vocabulary',
    level: 'All Levels',
    duration: '4 weeks',
    lessons: 16,
    students: 23450,
    rating: 4.6,
    reviews: 3421,
    price: 'Free',
    originalPrice: null,
    thumbnail: '/placeholder.jpg',
    tags: ['Vocabulary', 'Memory Techniques', 'Word Building'],
    featured: true,
    bestseller: false,
    new: false,
    lastUpdated: '2024-01-10'
  },
  {
    id: 'business-english',
    title: 'Business English Essentials',
    description: 'Professional English skills for the workplace and business communications',
    instructor: 'James Wilson',
    category: 'Business',
    level: 'Intermediate',
    duration: '10 weeks',
    lessons: 40,
    students: 9876,
    rating: 4.8,
    reviews: 1234,
    price: '$79.99',
    originalPrice: '$129.99',
    thumbnail: '/placeholder.jpg',
    tags: ['Business English', 'Professional', 'Workplace'],
    featured: false,
    bestseller: true,
    new: false,
    lastUpdated: '2024-01-18'
  },
  {
    id: 'grammar-mastery',
    title: 'Grammar Mastery Complete',
    description: 'Comprehensive grammar course covering all essential English grammar rules',
    instructor: 'Dr. Anna Thompson',
    category: 'Grammar',
    level: 'Beginner',
    duration: '12 weeks',
    lessons: 48,
    students: 18765,
    rating: 4.9,
    reviews: 2876,
    price: '$39.99',
    originalPrice: '$59.99',
    thumbnail: '/placeholder.jpg',
    tags: ['Grammar', 'Rules', 'Structure'],
    featured: false,
    bestseller: false,
    new: false,
    lastUpdated: '2024-01-12'
  },
  {
    id: 'pronunciation-perfect',
    title: 'Pronunciation Perfection',
    description: 'Perfect your pronunciation with AI-powered feedback and practice exercises',
    instructor: 'Dr. Robert Kim',
    category: 'Pronunciation',
    level: 'All Levels',
    duration: '6 weeks',
    lessons: 28,
    students: 11234,
    rating: 4.7,
    reviews: 1654,
    price: '$34.99',
    originalPrice: null,
    thumbnail: '/placeholder.jpg',
    tags: ['Pronunciation', 'AI Feedback', 'Phonics'],
    featured: false,
    bestseller: false,
    new: true,
    lastUpdated: '2024-01-28'
  },
  {
    id: 'exam-prep-ielts',
    title: 'IELTS Exam Preparation',
    description: 'Comprehensive IELTS preparation with practice tests and strategies',
    instructor: 'Sarah Mitchell',
    category: 'Test Prep',
    level: 'Intermediate',
    duration: '8 weeks',
    lessons: 36,
    students: 7654,
    rating: 4.8,
    reviews: 987,
    price: '$89.99',
    originalPrice: '$119.99',
    thumbnail: '/placeholder.jpg',
    tags: ['IELTS', 'Test Prep', 'Exam Strategy'],
    featured: true,
    bestseller: false,
    new: false,
    lastUpdated: '2024-01-22'
  }
];

const categories = [
  { id: 'all', name: 'All Courses', icon: Globe, count: allCourses.length },
  { id: 'speaking', name: 'Speaking', icon: MessageSquare, count: allCourses.filter(c => c.category === 'Speaking').length },
  { id: 'listening', name: 'Listening', icon: Headphones, count: allCourses.filter(c => c.category === 'Listening').length },
  { id: 'vocabulary', name: 'Vocabulary', icon: BookOpen, count: allCourses.filter(c => c.category === 'Vocabulary').length },
  { id: 'grammar', name: 'Grammar', icon: Target, count: allCourses.filter(c => c.category === 'Grammar').length },
  { id: 'business', name: 'Business', icon: TrendingUp, count: allCourses.filter(c => c.category === 'Business').length },
  { id: 'test-prep', name: 'Test Prep', icon: Award, count: allCourses.filter(c => c.category === 'Test Prep').length }
];

export default function AllCoursesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and search logic
  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
                           course.category.toLowerCase() === selectedCategory.toLowerCase();
    
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    
    const matchesPrice = selectedPrice === 'all' || 
                        (selectedPrice === 'free' && course.price === 'Free') ||
                        (selectedPrice === 'paid' && course.price !== 'Free');
    
    return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
  });

  // Sort logic
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'popularity':
        return b.students - a.students;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      case 'price-low':
        const priceA = a.price === 'Free' ? 0 : parseFloat(a.price.replace('$', ''));
        const priceB = b.price === 'Free' ? 0 : parseFloat(b.price.replace('$', ''));
        return priceA - priceB;
      case 'price-high':
        const priceA2 = a.price === 'Free' ? 0 : parseFloat(a.price.replace('$', ''));
        const priceB2 = b.price === 'Free' ? 0 : parseFloat(b.price.replace('$', ''));
        return priceB2 - priceA2;
      default:
        return 0;
    }
  });

  const handleCourseClick = (courseId: string) => {
    router.push(`/course/${courseId}`);
  };

  const handleEnrollClick = (courseId: string, price: string) => {
    if (price === 'Free') {
      // For free courses, redirect to the lesson
      router.push(`/my-lessons/${courseId}`);
    } else {
      // For paid courses, redirect to payment
      router.push(`/payment?course=${courseId}`);
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(cat => cat.name === category);
    return categoryData ? categoryData.icon : BookOpen;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-[#49BBBD] bg-clip-text text-transparent mb-4">
              All Courses
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Discover our complete collection of courses designed to help you master English at your own pace
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#49BBBD]">{allCourses.length}</div>
                <div className="text-sm text-slate-600">Total Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#49BBBD]">
                  {allCourses.filter(c => c.price === 'Free').length}
                </div>
                <div className="text-sm text-slate-600">Free Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#49BBBD]">
                  {allCourses.reduce((sum, course) => sum + course.students, 0).toLocaleString()}
                </div>
                <div className="text-sm text-slate-600">Total Students</div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search courses, instructors, or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/70"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 items-center">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[140px] bg-white/70">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.slice(1).map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="w-[120px] bg-white/70">
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                    <SelectTrigger className="w-[100px] bg-white/70">
                      <SelectValue placeholder="Price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px] bg-white/70">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popularity">Most Popular</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* View Mode Toggle */}
                  <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-white">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-none"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-none"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-600">
              Showing {sortedCourses.length} of {allCourses.length} courses
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <SortAsc className="w-4 h-4" />
              Sorted by {sortBy.replace('-', ' ')}
            </div>
          </div>

          {/* Courses Grid/List */}
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
          }>
            {sortedCourses.map((course) => {
              const IconComponent = getCategoryIcon(course.category);
              
              if (viewMode === 'list') {
                return (
                  <Card key={course.id} 
                        className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                        onClick={() => handleCourseClick(course.id)}>
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        {/* Thumbnail */}
                        <div className="w-32 h-24 bg-gradient-to-br from-[#49BBBD]/20 to-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-8 h-8 text-[#49BBBD]" />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900 mb-1">{course.title}</h3>
                              <p className="text-sm text-slate-600 mb-2">by {course.instructor}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              {course.price === 'Free' ? (
                                <Badge className="bg-green-100 text-green-800">Free</Badge>
                              ) : (
                                <div className="text-right">
                                  <div className="text-lg font-bold text-slate-900">{course.price}</div>
                                  {course.originalPrice && (
                                    <div className="text-sm text-slate-500 line-through">{course.originalPrice}</div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-slate-600 text-sm mb-3 line-clamp-2">{course.description}</p>
                          
                          <div className="flex items-center gap-4 mb-3">
                            <Badge variant="outline" className={getDifficultyColor(course.level)}>
                              {course.level}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{course.rating}</span>
                              <span className="text-sm text-slate-500">({course.reviews})</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-slate-500">
                              <Users className="w-4 h-4" />
                              {course.students.toLocaleString()}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <div className="flex items-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                {course.lessons} lessons
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {course.duration}
                              </div>
                            </div>
                            
                            <Button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEnrollClick(course.id, course.price);
                              }}
                              className="bg-gradient-to-r from-[#49BBBD] to-blue-500"
                            >
                              {course.price === 'Free' ? 'Start Learning' : 'Enroll Now'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              }

              // Grid view
              return (
                <Card key={course.id} 
                      className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
                      onClick={() => handleCourseClick(course.id)}>
                  {/* Course Thumbnail */}
                  <div className="relative h-48 bg-gradient-to-br from-[#49BBBD]/20 to-blue-500/20 flex items-center justify-center">
                    <IconComponent className="w-12 h-12 text-[#49BBBD]" />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {course.featured && <Badge className="bg-purple-100 text-purple-800 text-xs">Featured</Badge>}
                      {course.bestseller && <Badge className="bg-orange-100 text-orange-800 text-xs">Bestseller</Badge>}
                      {course.new && <Badge className="bg-green-100 text-green-800 text-xs">New</Badge>}
                    </div>
                    
                    {/* Price */}
                    <div className="absolute top-3 right-3">
                      {course.price === 'Free' ? (
                        <Badge className="bg-green-500 text-white">Free</Badge>
                      ) : (
                        <div className="text-right">
                          <div className="text-lg font-bold text-slate-900 bg-white/90 px-2 py-1 rounded">
                            {course.price}
                          </div>
                          {course.originalPrice && (
                            <div className="text-sm text-slate-500 line-through bg-white/70 px-2 rounded mt-1">
                              {course.originalPrice}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="mb-3">
                      <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-[#49BBBD] transition-colors line-clamp-1">
                        {course.title}
                      </h3>
                      <p className="text-sm text-slate-600">by {course.instructor}</p>
                    </div>
                    
                    <p className="text-slate-600 text-sm mb-3 line-clamp-2">{course.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className={getDifficultyColor(course.level)}>
                        {course.level}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{course.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {course.lessons} lessons
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {course.students > 1000 ? `${(course.students/1000).toFixed(1)}k` : course.students}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-[#49BBBD] to-blue-500 hover:from-[#3da5a7] hover:to-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEnrollClick(course.id, course.price);
                      }}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {course.price === 'Free' ? 'Start Learning' : 'Enroll Now'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* No Results */}
          {sortedCourses.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No courses found</h3>
              <p className="text-slate-600 mb-6">
                Try adjusting your search criteria or browse all available courses
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedLevel('all');
                  setSelectedPrice('all');
                }}
                className="bg-gradient-to-r from-[#49BBBD] to-blue-500"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
