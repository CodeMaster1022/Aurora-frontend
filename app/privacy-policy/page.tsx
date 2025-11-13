"use client"

import { Header } from "@/components/header"
import { useTranslation } from "@/lib/hooks/useTranslation"

export default function PrivacyPolicyPage() {
  const { t } = useTranslation()
  
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="bg-background rounded-lg shadow-lg p-6 sm:p-8 lg:p-12 space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-base mb-4">
              {t('privacy.title')}
            </h1>
            <p className="text-primary text-sm">
              {t('privacy.lastUpdated')}
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-base">
              {t('privacy.section1.title')}
            </h2>
            <p className="text-foreground leading-relaxed">
              {t('privacy.section1.paragraph1.part1')}{" "}
              <a
                href="https://weareaurora.tech"
                className="secondary-foreground hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('privacy.section1.paragraph1.link')}
              </a>{" "}
              {t('privacy.section1.paragraph1.part2')}
            </p>
            <p className="text-foreground leading-relaxed">
              {t('privacy.section1.paragraph2')}
            </p>
            <p className="text-foreground leading-relaxed">
              {t('privacy.section1.paragraph3')}
            </p>
            <p className="text-foreground leading-relaxed">
              {t('privacy.section1.emailLabel')}{" "}
              <a
                href="mailto:weareaurora.tech@gmail.com"
                className="secondary-foreground hover:underline"
              >
                {t('privacy.section1.emailText')}
              </a>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-base">
              {t('privacy.section2.title')}
            </h2>
            <p className="text-foreground leading-relaxed">
              {t('privacy.section2.paragraph1')}
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
              <li>{t('privacy.section2.item1')}</li>
              <li>{t('privacy.section2.item2')}</li>
              <li>{t('privacy.section2.item3')}</li>
              <li>{t('privacy.section2.item4')}</li>
              <li>{t('privacy.section2.item5')}</li>
              <li>{t('privacy.section2.item6')}</li>
              <li>{t('privacy.section2.item7')}</li>
              <li>{t('privacy.section2.item8')}</li>
            </ul>
            <p className="text-foreground leading-relaxed font-semibold">
              {t('privacy.section2.note')}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-base">
              {t('privacy.section3.title')}
            </h2>
            <p className="text-foreground leading-relaxed">
              {t('privacy.section3.paragraph1')}
            </p>
            <div className="space-y-3">
              <div>
                <p className="text-foreground leading-relaxed font-semibold mb-2">
                  {t('privacy.section3.primaryHeading')}
                </p>
                <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                  <li>{t('privacy.section3.primaryItem1')}</li>
                  <li>{t('privacy.section3.primaryItem2')}</li>
                  <li>{t('privacy.section3.primaryItem3')}</li>
                  <li>{t('privacy.section3.primaryItem4')}</li>
                </ul>
              </div>
              <div>
                <p className="text-foreground leading-relaxed font-semibold mb-2">
                  {t('privacy.section3.secondaryHeading')}
                </p>
                <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                  <li>{t('privacy.section3.secondaryItem1')}</li>
                  <li>{t('privacy.section3.secondaryItem2')}</li>
                </ul>
              </div>
            </div>
            <p className="text-foreground leading-relaxed">
              {t('privacy.section3.paragraph2.part1')}{" "}
              <a
                href="mailto:contact@weareaurora.tech"
                className="secondary-foreground hover:underline"
              >
                {t('privacy.section3.paragraph2.link')}
              </a>
              {t('privacy.section3.paragraph2.part2')}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-base">
              {t('privacy.section4.title')}
            </h2>
            <p className="text-foreground leading-relaxed">
              {t('privacy.section4.paragraph1')}
            </p>
            <p className="text-foreground leading-relaxed">
              {t('privacy.section4.paragraph2')}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-base">
              {t('privacy.section5.title')}
            </h2>
            <p className="text-foreground leading-relaxed">
              {t('privacy.section5.paragraph1')}
            </p>
            <p className="text-foreground leading-relaxed">
              {t('privacy.section5.paragraph2')}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-base">
              {t('privacy.section6.title')}
            </h2>
            <p className="text-foreground leading-relaxed">
              {t('privacy.section6.paragraph1')}
            </p>
            <p className="text-foreground leading-relaxed">
              {t('privacy.section6.emailLabel')}{" "}
              <a
                href="mailto:contact@weareaurora.tech"
                className="secondary-foreground hover:underline"
              >
                {t('privacy.section6.emailText')}
              </a>
            </p>
            <p className="text-foreground leading-relaxed">
              {t('privacy.section6.paragraph2')}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-base">
              {t('privacy.section7.title')}
            </h2>
            <p className="text-foreground leading-relaxed">
              {t('privacy.section7.paragraph1')}
            </p>
            <p className="text-foreground leading-relaxed">
              {t('privacy.section7.paragraph2')}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-base">
              {t('privacy.section8.title')}
            </h2>
            <p className="text-foreground leading-relaxed">
              {t('privacy.section8.paragraph1')}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-base">
              {t('privacy.section9.title')}
            </h2>
            <p className="text-foreground leading-relaxed">
              {t('privacy.section9.paragraph1')}
            </p>
            <p className="text-foreground leading-relaxed">
              {t('privacy.section9.paragraph2.part1')}{" "}
              <a
                href="https://weareaurora.tech"
                className="secondary-foreground hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('privacy.section9.paragraph2.link')}
              </a>{" "}
              {t('privacy.section9.paragraph2.part2')}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-base">
              {t('privacy.section10.title')}
            </h2>
            <p className="text-foreground leading-relaxed">
              {t('privacy.section10.paragraph1')}
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}

