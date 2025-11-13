"use client"

import { Header } from "@/components/header"
import { useTranslation } from "@/lib/hooks/useTranslation"

export default function TermsAndConditionsPage() {
  const { t } = useTranslation()
  
  return (
    <div className="min-h-screen bg-background">
      <main className="bg-background max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-card rounded-lg shadow-lg p-6 sm:p-8 lg:p-12 space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t('terms.title')}
            </h1>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-base">
              {t('terms.section1.title')}
            </h2>
            <p className="secondary-foreground leading-relaxed">
              {t('terms.section1.paragraph1')}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-base">
              {t('terms.section2.title')}
            </h2>
            <p className="secondary-foreground leading-relaxed">
              {t('terms.section2.paragraph1')}
            </p>
            <p className="secondary-foreground leading-relaxed">
              {t('terms.section2.paragraph2')}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-base">
              {t('terms.section3.title')}
            </h2>
            <p className="secondary-foreground leading-relaxed">
              {t('terms.section3.paragraph1')}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-base">
              {t('terms.section4.title')}
            </h2>
            <p className="secondary-foreground leading-relaxed">
              {t('terms.section4.intro')}
            </p>
            <ul className="list-disc list-inside space-y-2 secondary-foreground ml-4">
              <li>{t('terms.section4.item1')}</li>
              <li>{t('terms.section4.item2')}</li>
              <li>{t('terms.section4.item3')}</li>
            </ul>
            <p className="secondary-foreground leading-relaxed">
              {t('terms.section4.paragraph1')}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-base">
              {t('terms.section5.title')}
            </h2>
            <p className="secondary-foreground leading-relaxed">
              {t('terms.section5.paragraph1')}
            </p>
            <p className="secondary-foreground leading-relaxed">
              {t('terms.section5.intro')}
            </p>
            <ul className="list-disc list-inside space-y-2 secondary-foreground ml-4">
              <li>{t('terms.section5.item1')}</li>
              <li>{t('terms.section5.item2')}</li>
              <li>{t('terms.section5.item3')}</li>
            </ul>
            <p className="secondary-foreground leading-relaxed">
              {t('terms.section5.paragraph2')}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-base">
              {t('terms.section6.title')}
            </h2>
            <p className="secondary-foreground leading-relaxed">
              {t('terms.section6.part1')}{" "}
              <a href="/privacy-policy" className="text-[#524FD5] hover:underline">{t('terms.section6.link1')}</a>,{" "}
              {t('terms.section6.part2')}{" "}
              <a href="/privacy-policy" className="text-[#524FD5] hover:underline">{t('terms.section6.link2')}</a>.
            </p>
            <p className="secondary-foreground leading-relaxed">
              {t('terms.section6.paragraph2')}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-base">
              {t('terms.section7.title')}
            </h2>
            <p className="secondary-foreground leading-relaxed">
              {t('terms.section7.paragraph1')}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-base">
              {t('terms.section8.title')}
            </h2>
            <p className="secondary-foreground leading-relaxed">
              {t('terms.section8.paragraph1')}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-base">
              {t('terms.section9.title')}
            </h2>
            <p className="secondary-foreground leading-relaxed">
              {t('terms.section9.paragraph1')}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-base">
              {t('terms.section10.title')}
            </h2>
            <p className="secondary-foreground leading-relaxed">
              {t('terms.section10.paragraph1')}
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}

