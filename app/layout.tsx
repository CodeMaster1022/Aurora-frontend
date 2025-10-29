import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { ReduxProvider } from '@/components/providers/ReduxProvider'
import { Toaster } from 'sonner'
import { ClientLayout } from '@/components/ClientLayout'
import './globals.css'

export const metadata: Metadata = {
  title: 'GEORGE App',
  description: 'Created with GEORGE',
  generator: 'GEORGE.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ReduxProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </ReduxProvider>
        <Toaster position="top-right" richColors />
        <Analytics />
      </body>
    </html>
  )
}
