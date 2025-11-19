"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Globe,
  Home,
  LogOut,
  Moon,
  Settings,
  Sun,
  User as UserIcon,
  Info,
  ChevronDown,
} from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux"
import { logoutUser } from "@/lib/store/authSlice"
import { setLanguage } from "@/lib/store/languageSlice"
import { useTranslation } from "@/lib/hooks/useTranslation"

type ThemeMode = "light" | "dark"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showAuthMenu, setShowAuthMenu] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<ThemeMode>("light")

  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const { t, language } = useTranslation()

  const navLinks = useMemo(
    () => [
      { href: "/", label: t("header.home") },
      { href: "/speakers", label: t("header.speakers") },
      { href: "/about", label: t("header.nosotros") },
    ],
    [t],
  )

  useEffect(() => {
    // Set mounted to true after hydration
    setMounted(true)
    
    // Initialize theme from localStorage or system preference
    const storedTheme = window.localStorage.getItem("aurora-theme") as ThemeMode | null
    let initialTheme: ThemeMode = "light"
    
    if (storedTheme === "light" || storedTheme === "dark") {
      initialTheme = storedTheme
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      initialTheme = "dark"
    }
    
    setTheme(initialTheme)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    const root = document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
    window.localStorage.setItem("aurora-theme", theme)
  }, [theme, mounted])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showUserMenu &&
        !(event.target as Element).closest(".user-menu-container")
      ) {
        setShowUserMenu(false)
      }
      if (
        showAuthMenu &&
        !(event.target as Element).closest(".auth-menu-container")
      ) {
        setShowAuthMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showUserMenu, showAuthMenu])

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "es" : "en"
    dispatch(setLanguage(newLanguage))
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  const profileHref = useMemo(() => {
    if (!isAuthenticated) {
      return "/auth"
    }

    if (user?.role === "learner") {
      return "/learners/profile"
    }

    if (user?.role === "speaker") {
      return "/speakers/profile"
    }

    if (user?.role === "admin") {
      return "/admin"
    }
    return "/"
  }, [isAuthenticated, user?.role])

  const handleLogout = async () => {
    setShowUserMenu(false)
    await dispatch(logoutUser())
    router.push("/")
  }

  return (
    <>
    <header
      className={`sticky top-0 z-50 w-full border-b border-transparent transition-all ${isScrolled ? "border-border bg-background/85 shadow-sm backdrop-blur-lg" : "bg-background/70"}`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 pr-2 pl-4 sm:px-4 py-2 sm:py-4 transition-all md:px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-primary transition-colors hover:text-primary/80"
          >
            <span className="text-xl">Aurora</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-foreground/80 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-primary ${pathname === link.href ? "text-primary" : ""}`}
                suppressHydrationWarning
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={profileHref}
              className={`transition-colors hover:text-primary ${pathname?.startsWith("/speakers/profile") || pathname?.startsWith("/learners/profile") ? "text-primary" : ""}`}
            >
              {t("header.profile")}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full"
            onClick={toggleLanguage}
            aria-label={language === "en" ? "Switch to Spanish" : "Cambiar a inglés"}
          >
            <Globe className="size-5" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="rounded-full"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Activate light mode" : "Activate dark mode"}
          >
            {mounted && theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>
          {!isAuthenticated ? (
            <div className="relative block md:hidden auth-menu-container">
              <Button
                variant="ghost"
                className="flex items-center gap-2 rounded-full py-2 text-sm font-medium text-white cursor-pointer transition-all hover:bg-accent/60 hover:text-foreground/90"
                onClick={() => setShowAuthMenu((prev) => !prev)}
                aria-expanded={showAuthMenu}
                aria-haspopup="menu"
                aria-label={t("header.login")}
              >
                <UserIcon className="size-5 text-foreground" />
              </Button>

              {showAuthMenu && (
                <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-xl border border-border bg-background shadow-xl">
                  <Link
                    href="/auth/student-auth"
                    className="flex items-center justify-between px-4 py-3 text-sm text-foreground transition-colors hover:bg-accent/50"
                    onClick={() => setShowAuthMenu(false)}
                  >
                    {t("header.loginStudent")}
                  </Link>
                  <Link
                    href="/auth/speaker-auth"
                    className="flex items-center justify-between px-4 py-3 text-sm text-foreground transition-colors hover:bg-accent/50"
                    onClick={() => setShowAuthMenu(false)}
                  >
                    {t("header.loginSpeaker")}
                  </Link>
                </div>
              )}
            </div>
          ) : null}
          {isAuthenticated ? (
            <>
              <div className="relative user-menu-container md:hidden">
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full cursor-pointer"
                  onClick={() => {
                    setShowUserMenu((prev) => !prev)
                    setShowAuthMenu(false)
                  }}
                  aria-haspopup="menu"
                  aria-expanded={showUserMenu}
                >
                  <UserIcon className="size-5" />
                </Button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-48 overflow-hidden rounded-xl border border-border bg-background shadow-xl">
                    {/* <Link
                      href={profileHref}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-foreground transition-colors hover:bg-accent/50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="size-4" />
                      {t("header.profile")}
                    </Link> */}
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
                      onClick={handleLogout}
                    >
                      <LogOut className="size-4" />
                      {t("header.logout")}
                    </button>
                  </div>
                )}
              </div>

              <div className="relative user-menu-container hidden md:block">
                <Button
                  variant="outline"
                  className="rounded-full border-border/60 bg-background/60 px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-accent/60 hover:text-foreground/90"
                  onClick={() => {
                    setShowUserMenu((prev) => !prev)
                    setShowAuthMenu(false)
                  }}
                  aria-haspopup="menu"
                  aria-expanded={showUserMenu}
                >
                  <UserIcon className="size-4" />
                  <span className="ml-2">
                    {user?.firstname || user?.email || t("header.profile")}
                  </span>
                </Button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-52 overflow-hidden rounded-xl border border-border bg-background shadow-xl">
                    {/* <Link
                      href={profileHref}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-foreground transition-colors hover:bg-accent/50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="size-4" />
                      {t("header.profile")}
                    </Link> */}
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
                      onClick={handleLogout}
                    >
                      <LogOut className="size-4" />
                      {t("header.logout")}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="relative hidden md:block auth-menu-container">
              <Button
                variant="outline"
                className="flex items-center gap-2 rounded-full border-border/60 bg-[#72309F] px-4 py-2 text-sm font-medium text-white cursor-pointer transition-all hover:bg-accent/60 hover:text-foreground/90"
                onClick={() => setShowAuthMenu((prev) => !prev)}
                aria-expanded={showAuthMenu}
                aria-haspopup="menu"
              >
                {t("header.login")}
                <ChevronDown className="size-4" />
              </Button>

              {showAuthMenu && (
                <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-xl border border-border bg-background shadow-xl">
                  <Link
                    href="/auth/student-auth"
                    className="flex items-center justify-between px-4 py-3 text-sm text-foreground transition-colors hover:bg-accent/50"
                    onClick={() => setShowAuthMenu(false)}
                  >
                    {t("header.loginStudent")}
                  </Link>
                  <Link
                    href="/auth/speaker-auth"
                    className="flex items-center justify-between px-4 py-3 text-sm text-foreground transition-colors hover:bg-accent/50"
                    onClick={() => setShowAuthMenu(false)}
                  >
                    {t("header.loginSpeaker")}
                  </Link>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </header>
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-background/95 px-6 py-3 shadow-lg backdrop-blur md:hidden">
      <div className="mx-auto flex w-full max-w-md items-center justify-between text-xs font-medium text-foreground/70">
        <Link
          href="/home"
          className={`flex flex-col items-center gap-1 transition-colors ${pathname === "/" ? "text-primary" : "hover:text-primary/80"}`}
          suppressHydrationWarning
        >
          <Home className="size-5" />
          <span suppressHydrationWarning>{t("header.home")}</span>
        </Link>
        <Link
          href="/about"
          className={`flex flex-col items-center gap-1 transition-colors ${pathname === "/about" ? "text-primary" : "hover:text-primary/80"}`}
          suppressHydrationWarning
        >
          <Info className="size-5" />
          <span suppressHydrationWarning>{t("header.nosotros")}</span>
        </Link>
        <Link
          href={profileHref}
          className={`flex flex-col items-center gap-1 transition-colors ${pathname?.startsWith("/speakers/profile") || pathname?.startsWith("/learners/profile") ? "text-primary" : "hover:text-primary/80"}`}
        >
          <UserIcon className="size-5" />
          <span>{t("header.profile")}</span>
        </Link>
      </div>
    </nav>
    </>
  )
}
