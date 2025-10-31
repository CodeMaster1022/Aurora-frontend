"use client"

import { GoogleOAuthProvider as GoogleProvider } from '@react-oauth/google'

export function GoogleOAuthProvider({ children }: { children: React.ReactNode }) {
  // For testing, you can hardcode a temporary client ID here
  // const clientId = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
  const clientId = "806363351868-4fp9s1q3rhkhua2gj0l3u7j3cop4a8g2.apps.googleusercontent.com"
  console.log('GoogleOAuthProvider - Client ID:', clientId ? 'Set' : 'Not Set')

  if (!clientId) {
    console.error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set in environment variables!')
    // Still wrap with a div to maintain component tree structure
    return <div>{children}</div>
  }

  return (
    <GoogleProvider clientId={clientId}>
      {children}
    </GoogleProvider>
  )
}

