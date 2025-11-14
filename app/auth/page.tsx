"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { UserCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux"
import { initializeAuth } from "@/lib/store/authSlice"
import { useTranslation } from "@/lib/hooks/useTranslation"
import { Header } from "@/components/header"

export default function AuthRoleSelectionPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth)
  const { t } = useTranslation()

  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      if (user?.role === "learner") {
        router.replace("/learners/profile")
        return
      }

      if (user?.role === "speaker") {
        router.replace("/speakers/profile")
        return
      }

      if (user?.role === "admin") {
        router.replace("/admin")
        return
      }

      router.replace("/")
    }
  }, [isAuthenticated, isLoading, user?.role, router])

  return (
    <div>
        <Header />
        <main className="flex min-h-[80vh] items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-border/60 bg-card px-8 py-12 text-center shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <UserCircle2 className="h-8 w-8" />
        </div>

        <h1 className="mt-8 text-2xl font-semibold text-foreground">
          {t("auth.roleSelection.title")}
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          {t("auth.roleSelection.subtitle")}
        </p>

        <div className="mt-10 space-y-4">
          <Button
            asChild
            className="h-12 w-full bg-[#72309F] text-base font-semibold text-white hover:bg-[#5d2682]"
          >
            <Link href="/auth/student-auth">{t("auth.roleSelection.student")}</Link>
          </Button>

          <Button asChild variant="outline" className="h-12 w-full text-base font-semibold">
            <Link href="/auth/speaker-auth">{t("auth.roleSelection.speaker")}</Link>
          </Button>
        </div>
      </div>
    </main>
    </div>

  )
}


