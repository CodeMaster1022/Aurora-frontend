 "use client"
 
import { usePathname } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
 
 export function ClientLayout({
   children,
 }: {
   children: React.ReactNode
 }) {
   const pathname = usePathname()
  const publicPaths = new Set<string>(["/", "/privacy-policy", "/terms-and-conditions", "/about", "/speakers", "/home"]) 
 const isAuthSection = pathname?.startsWith('/auth')
 const isAdminSection = pathname?.startsWith('/admin')
 const isPublic = isAuthSection || (pathname ? publicPaths.has(pathname) : true)
 const hideChrome = isAuthSection || isAdminSection
 const shouldShowFooter = !hideChrome
 const shouldShowHeader = !hideChrome
   
   return (
     <>
      {shouldShowHeader && <Header />}
      {isPublic ? children : (
        <ProtectedRoute>
          {children}
        </ProtectedRoute>
      )}
      {shouldShowFooter && <Footer />}
     </>
   )
 }