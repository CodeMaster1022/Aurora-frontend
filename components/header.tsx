"use client"

import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut, Settings, Globe, ChevronDown, Moon, Sun, Home, LayoutDashboard, Mic, UserCircle, Info, LogIn } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/hooks/redux"
import { logoutUser } from "@/lib/store/authSlice"
import { setLanguage } from "@/lib/store/languageSlice"
import { useTranslation } from "@/lib/hooks/useTranslation"
import { AuthModal } from "@/components/auth/AuthModal"
import { SpeakerSignupModal } from "@/components/auth/SpeakerSignupModal"
import Link from "next/link"
import Image from "next/image"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showLoginMenu, setShowLoginMenu] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const { t, language } = useTranslation()
  const isSpeaker = user?.role === 'speaker'
  type AuthModalView = 'signin' | 'signup' | 'speaker-signup'
  const [activeAuthView, setActiveAuthView] = useState<AuthModalView | null>(null)

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'es' : 'en'
    dispatch(setLanguage(newLanguage))
  }
  // Add scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu && !(event.target as Element).closest('.user-menu-container')) {
        setShowUserMenu(false)
      }
      if (showLoginMenu && !(event.target as Element).closest('.login-menu-container')) {
        setShowLoginMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showUserMenu, showLoginMenu])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const storedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldUseDark = storedTheme ? storedTheme === 'dark' : prefersDark

    const root = document.documentElement
    root.classList.toggle('dark', shouldUseDark)
    setIsDarkMode(shouldUseDark)
  }, [])

  const toggleTheme = () => {
    if (typeof window === 'undefined') return

    setIsDarkMode((prev) => {
      const next = !prev
      const root = document.documentElement
      root.classList.toggle('dark', next)
      localStorage.setItem('theme', next ? 'dark' : 'light')
      return next
    })
  }

  const handleLogout = async () => {
    setShowUserMenu(false)
    setIsMenuOpen(false)
    await dispatch(logoutUser())
    router.push('/')
  }

  const openAuthModal = (view: 'signin' | 'signup') => {
    setShowLoginMenu(false)
    setIsMenuOpen(false)
    setActiveAuthView(view)
  }

  const openSpeakerSignupModal = () => {
    setShowLoginMenu(false)
    setIsMenuOpen(false)
    setActiveAuthView('speaker-signup')
  }

  const closeActiveModal = () => {
    setActiveAuthView(null)
  }

  type MobileNavItem = {
    key: string
    label: string
    icon: LucideIcon
    href?: string
    onClick?: () => void
  }

  // const baseMobileNavItems: MobileNavItem[] = [
  //   {
  //     key: 'language',
  //     label: language === 'en' ? 'ES' : 'EN',
  //     icon: Globe,
  //     onClick: toggleLanguage,
  //   },
  //   {
  //     key: 'theme',
  //     label: isDarkMode ? 'Light' : 'Dark',
  //     icon: isDarkMode ? Sun : Moon,
  //     onClick: toggleTheme,
  //   },
  // ]

  const mobileNavItems: MobileNavItem[] = (() => {
    if (isAuthenticated) {
      if (isSpeaker) {
        return [
          {
            key: 'home',
            label: t('header.home'),
            icon: Home,
            href: '/',
          },
          {
            key: 'dashboard',
            label: t('header.speakerDashboard'),
            icon: LayoutDashboard,
            href: '/speakers/dashboard',
          },
          {
            key: 'profile',
            label: t('header.profile'),
            icon: UserCircle,
            href: '/profile',
          },
          {
            key: 'logout',
            label: t('header.logout'),
            icon: LogOut,
            onClick: () => {
              void handleLogout()
            },
          },
          // ...baseMobileNavItems,
        ]
      }
      return [
        {
          key: 'home',
          label: t('header.home'),
          icon: Home,
          href: '/',
        },
        {
          key: 'dashboard',
          label: t('header.dashboard'),
          icon: LayoutDashboard,
          href: '/learners/dashboard',
        },
        {
          key: 'speakers',
          label: t('header.speakers'),
          icon: Mic,
          href: '/speakers',
        },
        {
          key: 'speaker-signup',
          label: 'Become Speaker',
          icon: Mic,
          onClick: () => {
            openSpeakerSignupModal()
          },
        },
        {
          key: 'logout',
          label: t('header.logout'),
          icon: LogOut,
          onClick: () => {
            void handleLogout()
          },
        },
        // ...baseMobileNavItems,
      ]
    }

    return [
      {
        key: 'home',
        label: t('header.home'),
        icon: Home,
        href: '/',
      },
      {
        key: 'About',
        label: "About",
        icon: Info,
        href: '/',
      },
      {
        key: 'speakers',
        label: t('header.speakers'),
        icon: Mic,
        href: '/speakers',
      },
      {
        key: 'Profile',
        label: "Profile",
        icon: User,
        href: '/profile',
      },
      {
        key: 'login',
        label: t('header.login'),
        icon: LogIn,
        onClick: () => {
          openAuthModal('signin')
        },
      },
      // ...baseMobileNavItems,
    ]
  })()

  const handleMobileNavClick = (item: MobileNavItem) => {
    if (item.key === 'menu') {
      setIsMenuOpen(true)
      return
    }

    if (item.onClick) {
      item.onClick()
    }

    if (item.href && pathname !== item.href) {
      router.push(item.href)
    }

    setIsMenuOpen(false)
  }

  return (
    <>
      <header className={`w-full fixed top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/10 backdrop-blur-lg shadow-lg' 
        : ''
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <h3 className="text-2xl font-bold text-purple-600 dark:text-primary transition-colors duration-300">Aurora</h3>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-end flex-1 px-8">
            <div className="flex items-center space-x-12 xl:space-x-16 text-gray-800 dark:text-primary transition-colors duration-300">
              {isAuthenticated ? (
                <>
                  {user?.role === 'speaker' ? (
                    <>
                      <Link href="/" className="hover:text-orange-400 transition-colors text-lg font-medium">
                        {t('header.home')}
                      </Link>
                      <Link href="/speakers/dashboard" className="px-2 py-2 rounded-xl hover:text-orange-400 transition-colors text-lg font-medium">
                        {t('header.speakerDashboard')}
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/learners/dashboard" className="hover:text-orange-400 transition-colors text-lg font-medium">
                        {t('header.home')}
                      </Link>
                      <Link href="/learners/dashboard" className="hover:text-orange-400 transition-colors text-lg font-medium">
                        {t('header.dashboard')}
                      </Link>
                      <Link href="/speakers" className="hover:text-orange-400 transition-colors text-lg font-medium">
                        {t('header.speakers')}
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <>
                      <Link href="/" className="hover:text-orange-400 transition-colors text-lg font-medium">
                        {t('header.home')}
                      </Link>
                      <Link href="/speakers" className="hover:text-orange-400 transition-colors text-lg font-medium">Speakers</Link>
                      <Link href="/about" className="hover:text-orange-400 transition-colors text-lg font-medium">
                        {t('header.nosotros')}
                      </Link>
                      <Link href="/about" className="hover:text-orange-400 transition-colors text-lg font-medium">
                        Profile
                      </Link>
                </>
              )}
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="p-2 text-gray-800 hover:text-orange-400 transition-colors rounded-full hover:bg-white/20"
              aria-label={`Switch to ${language === 'en' ? 'Español' : 'English'}`}
              title={`Switch to ${language === 'en' ? 'Español' : 'English'}`}
            >
              <Globe className="w-5 h-5 text-black" />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-300 hover:text-orange-400 transition-colors rounded-full hover:bg-white/20"
              aria-label={`Activate ${isDarkMode ? 'light' : 'dark'} mode`}
              title={`${isDarkMode ? 'Light' : 'Dark'} mode`}
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-black" /> : <Moon className="w-5 h-5 text-black" />}
            </button>
            {isAuthenticated ? (
              <div className="relative user-menu-container">
                <button 
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full text-white border-2 border-white/30 hover:border-white hover:bg-white hover:text-[#49BBBD] font-semibold transition-all duration-300"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <User className="w-4 h-4" />
                  {user?.firstname ? `${user.firstname} ${user.lastname}` : 'User'}
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border overflow-hidden z-50">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('header.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative login-menu-container">
                <button
                  className="px-2 py-1 rounded-lg cursor-pointer text-white border-2 hover:border-gray-400 hover:bg-gray-100 hover:text-[#49BBBD] font-semibold transition-all duration-300 flex items-center gap-2 bg-purple-500"
                  onClick={() => setShowLoginMenu((prev) => !prev)}
                  aria-haspopup="menu"
                  aria-expanded={showLoginMenu}
                >
                  {t('header.login')}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${showLoginMenu ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                {showLoginMenu && (
                  <div className="absolute right-0 mt-2 w-32 rounded-lg bg-white shadow-lg border border-gray-200 overflow-hidden z-50">
                    <button
                      className="w-full px-4 py-3 cursor-pointer text-left text-gray-800 hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        openAuthModal('signin')
                      }}
                    >
                      Student
                    </button>
                    <button
                      className="w-full px-4 py-3 cursor-pointer text-left text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        openSpeakerSignupModal()
                      }}
                    >
                      Speaker
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Mobile Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleLanguage}
              className="p-2 text-black hover:text-orange-300 transition-colors rounded-full hover:bg-white/10"
              aria-label={`Switch to ${language === 'en' ? 'Español' : 'English'}`}
              title={`Switch to ${language === 'en' ? 'Español' : 'English'}`}
            >
              <Globe className="w-5 h-5 text-black" />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 text-black hover:text-orange-300 transition-colors rounded-full hover:bg-white/10"
              aria-label={`Activate ${isDarkMode ? 'light' : 'dark'} mode`}
              title={`${isDarkMode ? 'Light' : 'Dark'} mode`}
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-black" /> : <Moon className="w-5 h-5 text-black" />}
            </button>
          </div>
        
        </div>
      </nav>
      </header>
      {!isMenuOpen && (
        <div className="fixed inset-x-0 bottom-0 z-40 pb-0 md:hidden">
          <nav className="mx-auto max-w-3xl px-0">
            <div className="bg-white/90 dark:bg-slate-900/80 shadow-[0_10px_30px_rgba(0,0,0,0.15)] backdrop-blur-md border border-white/30 dark:border-white/10">
              <div className="flex items-stretch justify-around py-3">
                {mobileNavItems.map((item) => {
                  const Icon = item.icon
                  const isActive = item.href ? pathname === item.href : false
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleMobileNavClick(item)}
                      className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
                        isActive
                          ? 'text-black'
                          : 'text-slate-600 dark:text-slate-200 hover:text-black dark:hover:text-black'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="uppercase tracking-wide text-[10px]">
                        {item.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </nav>
        </div>
      )}
      {activeAuthView && activeAuthView !== 'speaker-signup' && (
        <AuthModal
          key={`auth-modal-${activeAuthView}`}
          initialView={activeAuthView as 'signin' | 'signup'}
          open={activeAuthView === 'signin' || activeAuthView === 'signup'}
          onOpenSpeakerSignup={openSpeakerSignupModal}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              closeActiveModal()
            }
          }}
        />
      )}
      {activeAuthView === 'speaker-signup' && (
        <SpeakerSignupModal
          open={true}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              closeActiveModal()
            }
          }}
        />
      )}
    </>
  )
}
