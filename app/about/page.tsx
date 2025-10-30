"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { HeartHandshake, Users, CalendarCheck, ArrowRight } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
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
            <Badge className="bg-white/10 text-white border border-white/20 px-3 py-1 rounded-full">Our Story</Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Aurora: Bringing English to Life
            </h1>
            <p className="max-w-3xl text-lg md:text-xl text-white/80 leading-relaxed">
              We believe language unlocks opportunity. Aurora connects learners with kind, inspiring speakers for warm, human conversations that build confidence—one meaningful session at a time.
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
                <h2 className="text-2xl md:text-3xl font-bold text-orange-400">The Story of Aurora</h2>
                <p className="text-white/80 leading-relaxed">
                  Aurora started with a simple idea: if we make practice feel safe, kind, and real, people will finally speak. No tests. No judgment. Just genuine conversations with people who care.
                </p>
                <p className="text-white/80 leading-relaxed">
                  From living rooms to laptops, from nerves to smiles—Aurora is where learners show up as themselves and leave a little braver every time.
                </p>
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
                <h2 className="text-2xl md:text-3xl font-bold text-[#49BBBD]">Our Mission</h2>
                <p className="text-white/80 leading-relaxed">
                  To make English practice accessible, human, and joyful—by matching learners with thoughtful speakers and giving them everything they need to connect, grow, and belong.
                </p>
                <ul className="space-y-4 text-white/90">
                  <li className="flex items-start gap-3">
                    <HeartHandshake className="w-6 h-6 mt-1 text-[#49BBBD]" />
                    <span><strong className="font-semibold">Warm, one‑to‑one sessions</strong> that build confidence</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Users className="w-6 h-6 mt-1 text-[#49BBBD]" />
                    <span><strong className="font-semibold">Diverse speakers</strong> with real‑world experience</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CalendarCheck className="w-6 h-6 mt-1 text-[#49BBBD]" />
                    <span><strong className="font-semibold">Flexible scheduling</strong> that fits real life</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
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
            <Badge className="bg-[#49BBBD]/20 text-[#49BBBD] border border-[#49BBBD]/30 px-4 py-1.5 mb-4">Our Community</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Join Thousands of Learners</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Connect with passionate speakers and embark on your English learning journey
            </p>
          </motion.div>

          {/* Image grid */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="relative h-48 md:h-64 rounded-2xl overflow-hidden group cursor-pointer"
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
                <p className="font-semibold text-sm md:text-base">Students</p>
                <p className="text-xs md:text-sm text-white/80">Building confidence</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="relative h-48 md:h-64 rounded-2xl overflow-hidden group cursor-pointer"
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
                <p className="font-semibold text-sm md:text-base">Instructors</p>
                <p className="text-xs md:text-sm text-white/80">Inspiring conversations</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="relative h-48 md:h-64 rounded-2xl overflow-hidden group cursor-pointer"
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
                <p className="font-semibold text-sm md:text-base">Practice</p>
                <p className="text-xs md:text-sm text-white/80">Real conversations</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="relative h-48 md:h-64 rounded-2xl overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
              <Image 
                src="/image/4.jpg" 
                alt="Community" 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute bottom-4 left-4 right-4 z-20 text-white">
                <p className="font-semibold text-sm md:text-base">Community</p>
                <p className="text-xs md:text-sm text-white/80">Grow together</p>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="bg-white/5 border border-white/10 rounded-xl divide-y divide-white/10">
            <AccordionItem value="donations">
              <AccordionTrigger className="px-4 md:px-6 text-left hover:text-orange-400 transition-colors">How do donations work?</AccordionTrigger>
              <AccordionContent className="px-4 md:px-6 text-white/80">
                Donations help us support free or reduced‑cost sessions for learners who need it, and sustain our platform. You can add a donation at checkout or through your account settings anytime.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="level">
              <AccordionTrigger className="px-4 md:px-6 text-left hover:text-orange-400 transition-colors">What English level do I need?</AccordionTrigger>
              <AccordionContent className="px-4 md:px-6 text-white/80">
                Any level. From first words to near‑fluency, your speaker meets you where you are and adapts the conversation to your goals.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="duration">
              <AccordionTrigger className="px-4 md:px-6 text-left hover:text-orange-400 transition-colors">How long is a session?</AccordionTrigger>
              <AccordionContent className="px-4 md:px-6 text-white/80">
                Most sessions are 30–60 minutes. Choose what fits your schedule—short, focused practice or a full conversation.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="cancellations">
              <AccordionTrigger className="px-4 md:px-6 text-left hover:text-orange-400 transition-colors">What is the cancellation policy?</AccordionTrigger>
              <AccordionContent className="px-4 md:px-6 text-white/80">
                You can reschedule or cancel up to 12 hours before your session with no fee. Inside 12 hours, the session may be charged to protect speakers’ time.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="tech">
              <AccordionTrigger className="px-4 md:px-6 text-left hover:text-orange-400 transition-colors">What do I need for the session?</AccordionTrigger>
              <AccordionContent className="px-4 md:px-6 text-white/80">
                A stable internet connection, a device with a microphone, and a quiet space. A webcam is recommended but optional.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <p className="mt-8 text-center text-white/70">Have another question? We’re here for you.</p>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="max-w-2xl mx-auto text-white/80 mb-8">
            Find a speaker who inspires you and book your first session today. Confidence is just a conversation away.
          </p>
          <Link href="/speakers">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-8 py-6 rounded-full group">
              Find a Speaker
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


