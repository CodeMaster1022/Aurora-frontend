import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { ReduxProvider } from '@/components/providers/ReduxProvider'
import { GoogleOAuthProvider } from '@/components/providers/GoogleOAuthProvider'
import { Toaster } from 'sonner'
import { ClientLayout } from '@/components/ClientLayout'
import './globals.css'

export const metadata: Metadata = {
  title: 'Aurora App',
  description: 'Created with Aurora',
  generator: 'Aurora.app',
}

export default function RootLayout({
  children,
  auth,
}: Readonly<{
  children: React.ReactNode
  auth: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`min-h-screen bg-background text-foreground font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {/* <GoogleOAuthProvider> */}
          <ReduxProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
            {auth}
          </ReduxProvider>
        {/* </GoogleOAuthProvider> */}
        <Toaster position="top-right" richColors />
        <Analytics />
      </body>
    </html>
  )
}
