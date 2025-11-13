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
  const publicPaths = new Set<string>(["/", "/privacy-policy", "/terms-and-conditions", "/about", "/speakers"]) 
   const isAuthSection = pathname?.startsWith('/auth')
   const isPublic = isAuthSection || (pathname ? publicPaths.has(pathname) : true)
  const shouldShowFooter = !pathname?.startsWith('/auth')
  const shouldShowHeader = !pathname?.startsWith('/auth')
   
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