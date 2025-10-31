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
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <GoogleOAuthProvider>
          <ReduxProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </ReduxProvider>
        </GoogleOAuthProvider>
        <Toaster position="top-right" richColors />
        <Analytics />
      </body>
    </html>
  )
}
