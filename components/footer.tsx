"use client"

import Link from "next/link"
import { useTranslation } from "@/lib/hooks/useTranslation"

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center">
        <span className="text-lg font-semibold text-primary">Aurora</span>

        <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link
            href="/terms-and-conditions"
            className="transition-colors hover:text-primary"
          >
            {t("home.footer.terms")}
          </Link>
          <Link
            href="/privacy-policy"
            className="transition-colors hover:text-primary"
          >
            {t("home.footer.privacy")}
          </Link>
        </nav>

        <p className="text-xs text-muted-foreground">
          {t("home.footer.copyright")}
        </p>
      </div>
    </footer>
  )
}

