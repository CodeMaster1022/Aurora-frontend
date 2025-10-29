"use client"

import { Header } from "@/components/header"
import { FloatingCards } from "@/components/floating-cards"
import { Play, ArrowRight, BookOpen, Users, Award, FileText, Calendar, UserCheck, Grid3X3, Square, Eye, CheckCircle, X, Send, Star, Download, Volume2, MessageCircle, CalendarDays, FastForward } from "lucide-react"
import Image from "next/image"
import studentImage from "@/public/image/student.png"

import grandfatherImage from "@/public/image/grandfather.png"
import { useTranslation } from "@/lib/hooks/useTranslation"

export default function HomePage() {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Header />
      <main className="relative overflow-hidden"> 
        <div className="bg-gradient-to-b from-[#7196FF] to-[#29CC7A] relative overflow-hidden min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-3 py-4 sm:py-8 lg:py-12 relative z-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-6 sm:space-y-8 order-2 lg:order-1 text-center lg:text-left">
                <div className="space-y-4">
                  {/* "Never stop learning" badge */}
                  <div className="inline-block bg-white text-[#7357F5] px-4 py-2 rounded-md text-sm font-medium">
                    {t('home.badge')}
                  </div>
                  
                  {/* Main headline - 3 lines */}
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                    <span className="text-[#524FD5] block">{t('home.title.line1')}</span>
                    <span className="text-[#524FD5] block">{t('home.title.line2')}</span>
                    <span className="text-[#524FD5] block">{t('home.title.line3')}</span>
                  </h1>
                </div>

                {/* CTA Section with Reviews */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <div className="flex items-center gap-0 rounded-2xl pr-6 py-4">
                    <button className="group bg-[#524FD5] text-white font-semibold hover:bg-[#4240C5] px-6 py-5 text-base rounded-xl rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 uppercase tracking-wide">
                      {t('home.cta.explore')}
                    </button>
                    
                    {/* Profile Pictures */}
                    <div className="flex items-center -ml-4">
                      <div className="w-14 h-14 rounded-full border-2 border-white overflow-hidden relative z-10">
                        <Image
                          src="https://i.pravatar.cc/150?img=5"
                          alt="User avatar"
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-14 h-14 rounded-full border-2 border-white overflow-hidden -ml-2">
                        <Image
                          src="https://i.pravatar.cc/150?img=8"
                          alt="User avatar"
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-14 h-14 rounded-full border-2 border-white overflow-hidden -ml-2">
                        <Image
                          src="https://i.pravatar.cc/150?img=12"
                          alt="User avatar"
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-1 ml-3">
                        {[...Array(4)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-black text-black" />
                        ))}
                        <Star className="w-5 h-5 fill-black text-black" style={{ clipPath: 'inset(0 50% 0 0)' }} />
                      </div>
                      <p className="text-sm text-black font-medium whitespace-nowrap px-3">{t('home.reviews')}</p>
                    </div>
                  </div>
                </div>
         
              </div>

              {/* Right Content - Image Section */}
              <div className="relative order-1 lg:order-2 flex items-center justify-center">
                <div className="relative w-full max-w-[400px] sm:max-w-[500px] md:max-w-[650px] lg:max-w-[750px] xl:max-w-[850px] 2xl:max-w-[950px] mx-auto h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px]">
                  <div className="relative z-10 w-full h-full flex items-end">
                  <Image
                    src={studentImage}
                      alt="Graduate student in cap and gown"
                      className="w-full h-[80vh] drop-shadow-2xl"
                      width={600}
                      height={700}
                    priority
                      sizes="(max-width: 640px) 400px, (max-width: 768px) 500px, (max-width: 1024px) 650px, (max-width: 1280px) 750px, (max-width: 1536px) 850px, 950px"
                      style={{
                        maxHeight: '80vh',
                        objectFit: 'cover',
                        objectPosition: 'center bottom',
                        width: '100%',
                        height: '100%',
                        maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
                      }}
                    />
                  </div>

                  {/* Decorative Elements - Hidden on Small Mobile */}
                  <div className="hidden sm:block">
                    {/* Top Right Decoration */}
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-orange-400/20 rounded-full blur-2xl animate-pulse"></div>
                    
                    {/* Bottom Left Decoration */}
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/20 rounded-full blur-xl animate-pulse delay-700"></div>
                    
                    {/* Small Dots */}
                    <div className="absolute top-10 right-10 w-3 h-3 bg-orange-400 rounded-full animate-bounce"></div>
                    <div className="absolute bottom-20 left-10 w-2 h-2 bg-white rounded-full animate-bounce delay-300"></div>
                  </div>
                </div>

                {/* Floating UI Cards - Responsive Positioning */}
                <FloatingCards />
              </div>
            </div>
          </div>
        </div>   


        {/* Popular Speakers Section */}
        <section className="bg-[#0F172A] py-16 sm:py-20 lg:py-24 -mt-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                {t('home.popularSpeakers')}
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                {t('home.popularSpeakersDesc')}
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <button className="px-4 py-2 rounded-lg bg-[#524FD5] text-white font-medium transition-colors">
                {t('home.filter.all')}
              </button>
              <button className="px-4 py-2 rounded-lg bg-transparent text-white border border-white font-medium hover:bg-white/10 transition-colors">
                {t('home.filter.literature')}
              </button>
              <button className="px-4 py-2 rounded-lg bg-transparent text-white border border-white font-medium hover:bg-white/10 transition-colors">
                {t('home.filter.architecture')}
              </button>
              <button className="px-4 py-2 rounded-lg bg-transparent text-white border border-white font-medium hover:bg-white/10 transition-colors">
                {t('home.filter.engineering')}
              </button>
              <button className="px-4 py-2 rounded-lg bg-transparent text-white border border-white font-medium hover:bg-white/10 transition-colors">
                {t('home.filter.business')}
              </button>
              <button className="px-4 py-2 rounded-lg bg-transparent text-white border border-white font-medium hover:bg-white/10 transition-colors">
                {t('home.filter.cooking')}
              </button>
            </div>

            {/* Speaker Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {/* Card 1 - John Damon */}
              <div className="bg-[#1B2335] rounded-2xl overflow-hidden flex flex-col h-full">
                {/* Image */}
                <div className="relative w-full h-48 bg-gray-200">
                  <Image
                    src="https://i.pravatar.cc/150?img=1"
                    alt="John Damon"
                    width={200}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <p className="text-gray-400 text-sm mb-2">79 {t('home.speakerCard.age')}</p>
                  <h3 className="text-white font-bold text-lg mb-3">John Damon</h3>
                  <p className="text-gray-400 text-sm mb-4 flex-1">
                    Product Management Masterclass, you will learn with Sarah Johnson - Head of Product Customer Platform Gojek Indonesia.
                  </p>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-white text-xs border border-white px-2 py-1 rounded">Literatura</span>
                    <span className="text-white text-xs border border-white px-2 py-1 rounded">Arquitectura</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="">
                      <span className="text-white font-bold mr-2">{t('home.speakerCard.free')}</span>
                      <span className="text-gray-500 text-sm line-through">$ 300</span>
                    </div>
                    {/* Button */}
                    <button className="px-3 cursor-pointer bg-[#524FD5] text-white py-2 rounded-md font-medium hover:bg-[#4240C5] transition-colors">
                      {t('home.speakerCard.book')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 2 - Martha Stuart */}
              <div className="bg-[#1B2335] rounded-2xl overflow-hidden flex flex-col h-full">
                {/* Image */}
                <div className="relative w-full h-48 bg-gray-200">
                  <Image
                    src="https://i.pravatar.cc/150?img=5"
                    alt="Martha Stuart"
                    width={200}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <p className="text-gray-400 text-sm mb-2">81 {t('home.speakerCard.age')}</p>
                  <h3 className="text-white font-bold text-lg mb-3">Martha Stuart</h3>
                  <p className="text-gray-400 text-sm mb-4 flex-1">
                    Product Management Masterclass, you will learn with Sarah Johnson - Head of Product Customer Platform Gojek Indonesia.
                  </p>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-white text-xs border border-white px-2 py-1 rounded">Literatura</span>
                    <span className="text-white text-xs border border-white px-2 py-1 rounded">Arquitectura</span>
                  </div>
                  <div className="flex items-center justify-between ">
                    <div className="">
                      <span className="text-white font-bold mr-2">{t('home.speakerCard.free')}</span>
                      <span className="text-gray-500 text-sm line-through">$300</span>
                    </div>
                    {/* Button */}
                    <button className="px-3 cursor-pointer bg-[#524FD5] text-white py-2 rounded-md font-medium hover:bg-[#4240C5] transition-colors">
                      {t('home.speakerCard.book')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 3 - Leonard Washington */}
              <div className="bg-[#1B2335] rounded-2xl overflow-hidden flex flex-col h-full">
                {/* Image */}
                <div className="relative w-full h-48 bg-gray-200">
                  <Image
                    src="https://i.pravatar.cc/150?img=11"
                    alt="Leonard Washington"
                    width={200}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <p className="text-gray-400 text-sm mb-2">68 {t('home.speakerCard.age')}</p>
                  <h3 className="text-white font-bold text-lg mb-3">Leonard Washington</h3>
                  <p className="text-gray-400 text-sm mb-4 flex-1">
                    Product Management Masterclass, you will learn with Sarah Johnson - Head of Product Customer Platform Gojek Indonesia.
                  </p>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-white text-xs border border-white px-2 py-1 rounded">Literatura</span>
                    <span className="text-white text-xs border border-white px-2 py-1 rounded">Arquitectura</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="">
                      <span className="text-white font-bold mr-2">{t('home.speakerCard.free')}</span>
                      <span className="text-gray-500 text-sm line-through">$300</span>
                    </div>
                    {/* Button */}
                    <button className="px-3 cursor-pointer bg-[#524FD5] text-white py-2 rounded-md font-medium hover:bg-[#4240C5] transition-colors">
                      {t('home.speakerCard.book')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 4 - Clara Berman */}
              <div className="bg-[#1B2335] rounded-2xl overflow-hidden flex flex-col h-full">
                {/* Image */}
                <div className="relative w-full h-48 bg-gray-200">
                  <Image
                    src="https://i.pravatar.cc/150?img=9"
                    alt="Clara Berman"
                    width={200}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <p className="text-gray-400 text-sm mb-2">83 {t('home.speakerCard.age')}</p>
                  <h3 className="text-white font-bold text-lg mb-3">Clara Berman</h3>
                  <p className="text-gray-400 text-sm mb-4 flex-1">
                    Product Management Masterclass, you will learn with Sarah Johnson - Head of Product Customer Platform Gojek Indonesia.
                  </p>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-white text-xs border border-white px-2 py-1 rounded">Literatura</span>
                    <span className="text-white text-xs border border-white px-2 py-1 rounded">Arquitectura</span>
                  </div>
                  {/* Pricing */}
                  <div className="flex items-center justify-between ">
                    <div className="">
                      <span className="text-white font-bold mr-2">{t('home.speakerCard.free')}</span>
                      <span className="text-gray-500 text-sm line-through">$300</span>
                    </div>
                    {/* Button */}
                    <button className="px-3 cursor-pointer bg-[#524FD5] text-white py-2 rounded-md font-medium hover:bg-[#4240C5] transition-colors">
                      {t('home.speakerCard.book')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Ver todos Button */}
            <div className="text-center">
              <button className="bg-white text-[#524FD5] px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer">
                {t('home.viewAll')}
              </button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-[#0F172A] py-16 sm:py-20 lg:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left Column - How It Works */}
              <div>
                {/* Header Badge */}
                <div className="inline-block bg-white text-[#0F172A] px-4 py-2 rounded-full text-sm font-medium mb-6">
                  {t('home.howItWorks.badge')}
                </div>
                {/* Title */}
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#524FD5] mb-12">
                  {t('home.howItWorks.title')}
                </h2>
                {/* Steps */}
                <div className="space-y-8">
                  {/* Step 1 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-14 h-14 bg-white rounded-full flex items-center justify-center">
                      <span className="text-[#0F172A] font-bold text-lg">1</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-lg">
                        {t('home.howItWorks.step1')}
                      </p>
                    </div>
                  </div>
                  {/* Step 2 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-14 h-14 bg-white rounded-full flex items-center justify-center">
                      <span className="text-[#0F172A] font-bold text-lg">2</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-lg">
                        {t('home.howItWorks.step2')}
                      </p>
                    </div>
                  </div>
                  {/* Step 3 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-14 h-14 bg-white rounded-full flex items-center justify-center">
                      <span className="text-[#0F172A] font-bold text-lg">3</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-lg">
                        {t('home.howItWorks.step3')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Why Aurora is Different */}
            </div>
          </div>
        </section>
        <section className="bg-[#0F172A] py-16 sm:py-20 lg:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div></div>
              <div>
                {/* Header Badge */}
                <div className="inline-block bg-white text-[#0F172A] px-4 py-2 rounded-full text-sm font-medium mb-6">
                  {t('home.whyDifferent.badge')}
                </div>
                {/* Title */}
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#524FD5] mb-12">
                  {t('home.whyDifferent.title')}
                </h2>
                {/* Points */}
                <div className="space-y-8">
                  {/* Point 1 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-14 h-14 bg-white rounded-full flex items-center justify-center">
                      <span className="text-[#0F172A] font-bold text-lg">1</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-lg">
                        {t('home.whyDifferent.point1')}
                      </p>
                    </div>
                  </div>
                  {/* Point 2 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-14 h-14 bg-white rounded-full flex items-center justify-center">
                      <span className="text-[#0F172A] font-bold text-lg">2</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-lg">
                        {t('home.whyDifferent.point2')}
                      </p>
                    </div>
                  </div>
                  {/* Point 3 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-14 h-14 bg-white rounded-full flex items-center justify-center">
                      <span className="text-[#0F172A] font-bold text-lg">3</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-lg">
                        {t('home.whyDifferent.point3')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Become a Speaker Section */}
        <section className="py-4 px-4 sm:px-6 lg:px-8 sm:py-8 lg:pt-12 lg:pb-48">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#7357F5] to-[#29CC7A] rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Content - Text */}
              <div className="space-y-8 text-center lg:text-left order-2 lg:order-1">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  {t('home.becomeSpeaker.title')}<br />
                  <span className="text-white">{t('home.becomeSpeaker.titleSpeaker')}</span>
                </h2>
                
                {/* Bullet Points */}
                <div className="space-y-4 text-white">
                  <div className="flex items-start gap-3">
                    <Star className="w-6 h-6 fill-white text-white flex-shrink-0 mt-1" />
                    <p className="text-lg">{t('home.becomeSpeaker.point1')}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Star className="w-6 h-6 fill-white text-white flex-shrink-0 mt-1" />
                    <p className="text-lg">{t('home.becomeSpeaker.point2')}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Star className="w-6 h-6 fill-white text-white flex-shrink-0 mt-1" />
                    <p className="text-lg">{t('home.becomeSpeaker.point3')}</p>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="flex justify-center lg:justify-start">
                  <button className="bg-white text-[#7357F5] font-semibold hover:bg-[#24B86D] px-8 py-4 text-base rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 uppercase tracking-wide">
                    {t('home.becomeSpeaker.cta')}
                  </button>
                </div>
              </div>

              {/* Right Content - Image */}
              <div className="relative order-1 lg:order-2 flex items-center justify-center">
                <div className="relative w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[450px] mx-auto h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px]">
                  <div className="relative z-10 w-full h-full flex items-end">
                    <Image
                      src={grandfatherImage}
                      alt="Speaker grandfather"
                      className="w-full h-full object-cover rounded-2xl drop-shadow-2xl"
                      width={450}
                      height={450}
                      priority
                      sizes="(max-width: 640px) 300px, (max-width: 768px) 350px, (max-width: 1024px) 400px, 450px"
                    />
                  </div>

                  {/* Decorative Elements */}
                  <div className="hidden sm:block">
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/20 rounded-full blur-xl animate-pulse delay-700"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer className="relative w-full">

          {/* Main Gradient Section */}
          <div 
            className="w-full relative"
            style={{
              background: 'linear-gradient(to right, rgb(51, 204, 153), rgb(102, 178, 255))',
              paddingTop: '2rem',
              paddingBottom: '2rem'
            }}
          >
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                {/* Left Side - Links Section */}
                <div className="space-y-2 py-24">
                  <h3 className="text-lg font-bold text-[#4B0082] mb-3">{t('home.footer.links')}</h3>
                  <div className="space-y-1">
                    <a href="#" className="block text-[#4B0082] hover:underline text-base">
                      {t('home.footer.terms')}
                    </a>
                    <a href="#" className="block text-[#4B0082] hover:underline text-base">
                      {t('home.footer.privacy')}
                    </a>
                  </div>
                </div>
              </div>
              <div className="text-[#4B0082] text-base w-full mx-auto text-center">
                <p>{t('home.footer.copyright')}</p>
              </div>
            </div>
          </div>

          {/* Bottom Dark Band */}
          <div className="bg-[#1A1D21] w-full h-8"></div>
        </footer>
        {/* <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg 
            viewBox="0 0 1440 120" 
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path 
              d="M0,40 C480,100 960,100 1440,40 L1440,120 L0,120 Z" 
              fill="white" 
              fillOpacity="0.1"
            />
          </svg>
        </div> */}
      </main>
    </div>
  )
}