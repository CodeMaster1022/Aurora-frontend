"use client"

import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut, Settings } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/hooks/redux"
import { logoutUser } from "@/lib/store/authSlice"
import Link from "next/link"
import Image from "next/image"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
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
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showUserMenu])

  const handleLogout = () => {
    dispatch(logoutUser())
    setShowUserMenu(false)
    router.push('/')
  }

  return (
    <header className={`w-full fixed top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/10 backdrop-blur-lg shadow-lg' : ''
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image 
              src="/image/logo.png" 
              alt="GEORGE Logo" 
              width={120} 
              height={140}
              className="rounded-lg"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-end flex-1 px-8">
            <div className="flex items-center space-x-12 xl:space-x-16">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="text-white hover:text-orange-400 transition-colors text-lg font-medium">
                    Dashboard
                  </Link>
                  <Link href="/my-lessons" className="text-white hover:text-orange-400 transition-colors text-lg font-medium">
                    My Lessons
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/" className="text-white hover:text-orange-400 transition-colors text-lg font-medium">
                    Home
                  </Link>
                  <Link href="#" className="text-white hover:text-orange-400 transition-colors text-lg font-medium">
                    Nosotros
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
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
                    <div className="border-t border-gray-100"></div>
                    <button
                      onClick={() => {
                        router.push('/profile')
                        setShowUserMenu(false)
                      }}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button className="px-6 py-2.5 rounded-lg text-white border-2 border-white/30 hover:border-white hover:bg-white hover:text-[#49BBBD] font-semibold transition-all duration-300" onClick={() => router.push('/auth/signin')}>
                Inicia sesión
                </button>
                <button className="px-6 py-2.5 rounded-lg bg-[#524FD5] text-white hover:bg-orange-400 hover:text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" onClick={() => router.push('/auth/speaker/signup')}>
                  Spreaker
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden relative w-10 h-10 text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="sr-only">Open main menu</span>
            <div className="absolute inset-0 flex items-center justify-center">
              {isMenuOpen ? (
                <X className="w-6 h-6 animate-spin-once" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed right-0 top-0 h-full w-[280px] bg-gradient-to-br from-[#49BBBD] to-[#3FA9AB] shadow-2xl transform transition-transform duration-300 ease-in-out">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <div className="flex items-center gap-2">
                <Image 
                  src="/image/logo.png" 
                  alt="GEORGE Logo" 
                  width={32} 
                  height={32}
                  className="rounded-lg"
                />
                <span className="text-xl font-bold text-white">GEORGE</span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col p-4">
              <nav className="space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard" className="block px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-colors text-lg font-medium">
                      Dashboard
                    </Link>
                    <Link href="/my-lessons" className="block px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-colors text-lg font-medium">
                      My Lessons
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/" className="block px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-colors text-lg font-medium">
                      Home
                    </Link>
                    <Link href="#" className="block px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-colors text-lg font-medium">
                      Nosotros
                    </Link>
                  </>
                )}
              </nav>

              {/* Mobile Auth Buttons */}
              <div className="mt-8 space-y-3">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 bg-white/20 rounded-lg text-center">
                      <p className="text-white font-medium">Welcome, {user?.firstname} {user?.lastname}!</p>
                    </div>
                    <button 
                      className="w-full px-6 py-3 rounded-full text-white border-2 border-white/30 hover:border-white hover:bg-white hover:text-[#49BBBD] font-semibold transition-all duration-300 flex items-center justify-center gap-2" 
                      onClick={() => {
                        router.push('/profile')
                        setIsMenuOpen(false)
                      }}
                    >
                      <Settings className="w-4 h-4" />
                      Profile
                    </button>
                    <button 
                      className="w-full px-6 py-3 rounded-full bg-red-500 text-white hover:bg-red-600 font-semibold transition-all duration-300 shadow-lg flex items-center justify-center gap-2" 
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button className="w-full px-6 py-3 rounded-full text-white border-2 border-white/30 hover:border-white hover:bg-white hover:text-[#49BBBD] font-semibold transition-all duration-300" onClick={() => router.push('/auth')}>
                      Login
                    </button>
                    <button className="w-full px-6 py-3 rounded-full bg-white text-[#49BBBD] hover:bg-orange-400 hover:text-white font-semibold transition-all duration-300 shadow-lg" onClick={() => router.push('/auth')}>
                      Sign Up
                    </button>
                  </>
                )}
              </div>

              {/* Mobile Menu Footer */}
              <div className="mt-auto pt-8 text-center">
                <p className="text-white/70 text-sm">
                  © 2024 GEORGE. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
