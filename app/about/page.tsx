"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { HeartHandshake, Users, CalendarCheck, ArrowRight, ChevronLeft, ChevronRight, Target, HelpCircle } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTranslation } from "@/lib/hooks/useTranslation"

export default function AboutPage() {
  const { t } = useTranslation()
  const carouselItems = [
    {
      image: "/image/1.jpeg",
      title: t('about.community.card1.title'),
      subtitle: t('about.community.card1.subtitle'),
    },
    {
      image: "/image/2.jpeg",
      title: t('about.community.card2.title'),
      subtitle: t('about.community.card2.subtitle'),
    },
    {
      image: "/image/3.jpeg",
      title: t('about.community.card3.title'),
      subtitle: t('about.community.card3.subtitle'),
    },
    {
      image: "/image/4.jpeg",
      title: t('about.community.card4.title'),
      subtitle: t('about.community.card4.subtitle'),
    },
    {
      image: "/image/5.jpeg",
      title: t('about.community.card4.title'),
      subtitle: t('about.community.card4.subtitle'),
    },
  ]
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const missionHighlights = [
    {
      icon: HeartHandshake,
      title: t('about.mission.cards.warm.title'),
      description: t('about.mission.cards.warm.description'),
    },
    {
      icon: Users,
      title: t('about.mission.cards.diverse.title'),
      description: t('about.mission.cards.diverse.description'),
    },
    {
      icon: CalendarCheck,
      title: t('about.mission.cards.flexible.title'),
      description: t('about.mission.cards.flexible.description'),
    },
  ]

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length)
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % carouselItems.length)
  }

  useEffect(() => {
    if (isHovered) {
      return
    }

    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % carouselItems.length)
    }, 4000)

    return () => {
      window.clearInterval(interval)
    }
  }, [carouselItems.length, isHovered])

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500">
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 md:pt-36 pb-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-100/70 via-transparent to-transparent dark:from-indigo-900/60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(73,187,189,0.18),transparent_60%)] dark:bg-[radial-gradient(circle_at_top,_rgba(73,187,189,0.25),transparent_65%)]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4">
          <motion.div
            className="flex flex-col items-center text-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#49BBBD] dark:text-[#7ae2e4]">
              {t('about.hero.title')}
            </h1>
            <p className="max-w-3xl text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed">
              {t('about.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>
      {/* Story & Mission */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
          {t('about.story.title')}
        </h2>
      </div>
      <section className="relative pb-10 md:pb-16 pt-4">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 md:gap-12 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="h-full transition-colors duration-300">
              <div className="flex flex-col gap-5">
                <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                If you're new here, my name is Mónica Medina, and my mission in life is communication—helping people express themselves and feel happy.
                </p>
                <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                I've been teaching English at multiple levels, from children to adults, since 1988. Beyond teaching, I have a special bond with elderly people—they are living treasures, with encyclopedic knowledge and extraordinary life stories.
                </p>
                <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                I've helped hundreds of English learners succeed—and they've become better people through it.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="max-w-[460px] mx-auto px-4 relative z-10 w-full h-full">
          <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocusCapture={() => setIsHovered(true)}
            onBlur={() => setIsHovered(false)}
          >
            <motion.div
              key={activeIndex}
              className="relative overflow-hidden rounded-3xl shadow-xl border border-border/60 aspect-[4/3]"
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Image
                src={carouselItems[activeIndex].image}
                alt={carouselItems[activeIndex].title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent dark:from-black/70 dark:via-black/30" />
            </motion.div>

            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-1 md:left-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/10 hover:bg-black/15 border border-black/10 p-2 text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary dark:bg-white/20 dark:hover:bg-white/30 dark:border-white/30 cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-1 md:right-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/10 hover:bg-black/15 border border-black/10 p-2 text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary dark:bg-white/20 dark:hover:bg-white/30 dark:border-white/30 cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        </div>
      </section>

      {/* Mission Highlights */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            className="text-left max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 text-[#49BBBD] dark:text-[#7ae2e4]">
              <Target className="w-7 h-7" />
              <span className="text-3xl md:text-4xl font-bold text-foreground">
                {t('about.mission.title')}
              </span>
            </div>
            <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              {t('about.mission.p1')}
            </p>
          </motion.div>

          <motion.div
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.12,
                },
              },
            }}
          >
            {missionHighlights.map(({ icon: Icon, title, description }) => (
              <motion.div
                key={title}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <div className="h-full border border-border/60 bg-card rounded-2xl shadow-lg transition-colors duration-300 hover:border-[#49BBBD]/40 hover:shadow-xl">
                  <CardContent className="p-4 sm:p-6 space-y-3">
                    {/* <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#49BBBD]/15 text-[#49BBBD] dark:bg-[#49BBBD]/20 dark:text-[#7ae2e4]">
                      <Icon className="w-5 h-5" />
                    </div> */}
                    <h3 className="text-lg font-semibold text-foreground">
                      {title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {description}
                    </p>
                  </CardContent>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      {/* FAQs */}
      <section className="py-4 md:py-8 max-w-5xl mx-auto">
        <motion.div 
          className="max-w-4xl mx-auto px-4"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center gap-3 mb-6 text-left">
            <HelpCircle className="w-8 h-8 text-[#49BBBD] dark:text-[#7ae2e4]" aria-hidden="true" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              FAQ
            </h2>
          </div>
          <Accordion
            type="single"
            collapsible
            className="rounded-2xl divide-y divide-border/60 transition-colors duration-300"
          >
            <AccordionItem value="donations">
              <AccordionTrigger className="px-4 md:px-6 text-left text-foreground hover:text-[#49BBBD] transition-colors">
                {t('about.faq.q1')}
              </AccordionTrigger>
              <AccordionContent className="px-4 md:px-6 text-muted-foreground">
                {t('about.faq.a1')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="level">
              <AccordionTrigger className="px-4 md:px-6 text-left text-foreground hover:text-[#49BBBD] transition-colors">
                {t('about.faq.q2')}
              </AccordionTrigger>
              <AccordionContent className="px-4 md:px-6 text-muted-foreground">
                {t('about.faq.a2')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="duration">
              <AccordionTrigger className="px-4 md:px-6 text-left text-foreground hover:text-[#49BBBD] transition-colors">
                {t('about.faq.q3')}
              </AccordionTrigger>
              <AccordionContent className="px-4 md:px-6 text-muted-foreground">
                {t('about.faq.a3')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="cancellations">
              <AccordionTrigger className="px-4 md:px-6 text-left text-foreground hover:text-[#49BBBD] transition-colors">
                {t('about.faq.q4')}
              </AccordionTrigger>
              <AccordionContent className="px-4 md:px-6 text-muted-foreground">
                {t('about.faq.a4')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="tech">
              <AccordionTrigger className="px-4 md:px-6 text-left text-foreground hover:text-[#49BBBD] transition-colors">
                {t('about.faq.q5')}
              </AccordionTrigger>
              <AccordionContent className="px-4 md:px-6 text-muted-foreground">
                {t('about.faq.a5')}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </section>

      {/* Footer spacer for aesthetics */}
      <div className="h-36" />
    </main>
  )
}


