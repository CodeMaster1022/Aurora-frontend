"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Header } from '@/components/header'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

const lightModeRoutes = new Set<string>(['/', '/about'])

export function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const publicPaths = new Set<string>(["/", "/speakers", "/privacy-policy", "/terms-and-conditions", "/about"]) 
  const isAuthSection = pathname?.startsWith('/auth')
  const isPublic = isAuthSection || (pathname ? publicPaths.has(pathname) : true)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const root = document.documentElement
    const shouldUseLightMode = pathname ? lightModeRoutes.has(pathname) : false

    if (shouldUseLightMode) {
      root.classList.remove('dark')
      window.localStorage.setItem('theme', 'light')
    } else {
      root.classList.add('dark')
      window.localStorage.setItem('theme', 'dark')
    }
  }, [pathname])
  
  return (
    <>
     {pathname !== "/auth" && pathname !== "/" && <Header />}
     {isPublic ? children : (
       <ProtectedRoute>
         {children}
       </ProtectedRoute>
     )}
    </>
  )
}