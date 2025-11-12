 "use client"
 
 import { usePathname } from 'next/navigation'
 import { Header } from '@/components/header'
 import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
 
 export function ClientLayout({
   children,
 }: {
   children: React.ReactNode
 }) {
   const pathname = usePathname()
   const publicPaths = new Set<string>(["/", "/speakers", "/privacy-policy", "/terms-and-conditions", "/about"]) 
   const isAuthSection = pathname?.startsWith('/auth')
   const isPublic = isAuthSection || (pathname ? publicPaths.has(pathname) : true)
   
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