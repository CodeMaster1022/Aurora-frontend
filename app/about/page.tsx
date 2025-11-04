"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { HeartHandshake, Users, CalendarCheck, ArrowRight } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTranslation } from "@/lib/hooks/useTranslation"

export default function AboutPage() {
  const { t } = useTranslation()
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0b1420] via-[#0b1420] to-[#0f1c2b] text-white">
      {/* Hero */}
      <section className="relative pt-28 md:pt-36 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/image/hero-meeting.jpg"
            alt="Learners and mentors connecting"
            fill
            priority
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#49BBBD]/30 via-transparent to-transparent" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4">
          <motion.div 
            className="flex flex-col items-center text-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Badge className="bg-white/10 text-white border border-white/20 px-3 py-1 rounded-full">{t('about.hero.badge')}</Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              {t('about.hero.title')}
            </h1>
            <p className="max-w-3xl text-lg md:text-xl text-white/80 leading-relaxed">
              {t('about.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story & Mission */}
      <section className="relative py-8 md:py-14">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 md:gap-12 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-md h-full">
              <CardContent className="p-6 md:p-8 flex flex-col gap-4">
                <h2 className="text-2xl md:text-3xl font-bold text-orange-400">{t('about.story.title')}</h2>
                <p className="text-white/80 leading-relaxed">
                  {t('about.story.p1')}
                </p>
                {/* <p className="text-white/80 leading-relaxed">
                  {t('about.story.p2')}
                </p> */}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-md h-full">
              <CardContent className="p-6 md:p-8 flex flex-col gap-4">
                <h2 className="text-2xl md:text-3xl font-bold text-[#49BBBD]">{t('about.mission.title')}</h2>
                <p className="text-white/80 leading-relaxed">
                  {t('about.mission.p1')}
                </p>
                <ul className="space-y-4 text-white/90">
                  <li className="flex items-start gap-3">
                    <HeartHandshake className="w-6 h-6 mt-1 text-[#49BBBD]" />
                    <span>{t('about.mission.point1')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Users className="w-6 h-6 mt-1 text-[#49BBBD]" />
                    <span>{t('about.mission.point2')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CalendarCheck className="w-6 h-6 mt-1 text-[#49BBBD]" />
                    <span>{t('about.mission.point3')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Photo card */}
      <section className="py-8 md:py-12">
        <div className="max-w-xl mx-auto px-4">
          <motion.div 
            className="relative aspect-square w-full rounded-2xl overflow-hidden group cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
            <Image 
              src="/image/3.jpeg" 
              alt="Community" 
              fill 
              className="object-cover transition-transform duration-500 group-hover:scale-110" 
            />
          </motion.div>
        </div>
      </section>

      {/* Visual strip */}
      <section className="py-12 md:py-16 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#49BBBD]/5 to-transparent" />
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          {/* Section header */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-[#49BBBD]/20 text-[#49BBBD] border border-[#49BBBD]/30 px-4 py-1.5 mb-4">{t('about.community.badge')}</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">{t('about.community.title')}</h2>
            <p className="text-white/70 max-w-2xl mx-auto">{t('about.community.subtitle')}</p>
          </motion.div>

          {/* Image grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="relative h-64 md:h-96 rounded-2xl overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
              <Image 
                src="/image/1.jpeg" 
                alt="Learner" 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute bottom-4 left-4 right-4 z-20 text-white">
                <p className="font-semibold text-sm md:text-base">{t('about.community.card1.title')}</p>
                <p className="text-xs md:text-sm text-white/80">{t('about.community.card1.subtitle')}</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="relative h-64 md:h-96 rounded-2xl overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
              <Image 
                src="/image/2.jpeg" 
                alt="Speaker" 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute bottom-4 left-4 right-4 z-20 text-white">
                <p className="font-semibold text-sm md:text-base">{t('about.community.card2.title')}</p>
                <p className="text-xs md:text-sm text-white/80">{t('about.community.card2.subtitle')}</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="relative h-64 md:h-96 rounded-2xl overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
              <Image 
                src="/image/3.jpeg" 
                alt="Learning" 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute bottom-4 left-4 right-4 z-20 text-white">
                <p className="font-semibold text-sm md:text-base">{t('about.community.card3.title')}</p>
                <p className="text-xs md:text-sm text-white/80">{t('about.community.card3.subtitle')}</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 md:py-16">
        <motion.div 
          className="max-w-3xl mx-auto px-4"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">{t('about.faq.title')}</h2>
          <Accordion type="single" collapsible className="bg-white/5 border border-white/10 rounded-xl divide-y divide-white/10">
            <AccordionItem value="donations">
              <AccordionTrigger className="px-4 md:px-6 text-left hover:text-orange-400 transition-colors">{t('about.faq.q1')}</AccordionTrigger>
              <AccordionContent className="px-4 md:px-6 text-white/80">
                {t('about.faq.a1')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="level">
              <AccordionTrigger className="px-4 md:px-6 text-left hover:text-orange-400 transition-colors">{t('about.faq.q2')}</AccordionTrigger>
              <AccordionContent className="px-4 md:px-6 text-white/80">
                {t('about.faq.a2')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="duration">
              <AccordionTrigger className="px-4 md:px-6 text-left hover:text-orange-400 transition-colors">{t('about.faq.q3')}</AccordionTrigger>
              <AccordionContent className="px-4 md:px-6 text-white/80">
                {t('about.faq.a3')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="cancellations">
              <AccordionTrigger className="px-4 md:px-6 text-left hover:text-orange-400 transition-colors">{t('about.faq.q4')}</AccordionTrigger>
              <AccordionContent className="px-4 md:px-6 text-white/80">
                {t('about.faq.a4')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="tech">
              <AccordionTrigger className="px-4 md:px-6 text-left hover:text-orange-400 transition-colors">{t('about.faq.q5')}</AccordionTrigger>
              <AccordionContent className="px-4 md:px-6 text-white/80">
                {t('about.faq.a5')}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <p className="mt-8 text-center text-white/70">{t('about.faq.more')}</p>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <motion.div 
          className="max-w-4xl mx-auto px-4 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('about.cta.title')}</h2>
          <p className="max-w-2xl mx-auto text-white/80 mb-8">
            {t('about.cta.subtitle')}
          </p>
          <Link href="/speakers">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-8 py-6 rounded-full group">
              {t('about.cta.button')}
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer spacer for aesthetics */}
      <div className="h-10" />
    </main>
  )
}


