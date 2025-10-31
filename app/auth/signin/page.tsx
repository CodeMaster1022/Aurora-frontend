"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux"
import { loginUser, setUser } from "@/lib/store/authSlice"
import { useTranslation } from "@/lib/hooks/useTranslation"
import { GoogleLogin, CredentialResponse } from '@react-oauth/google'
import { authService } from "@/lib/services/authService"

export default function SignInPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { error: authError, isLoading: authLoading } = useAppSelector((state) => state.auth)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  // Combine local loading with Redux loading state
  const isLoadingState = isLoading || authLoading
  
  // Combine local error with Redux error
  const displayError = error || authError
  
  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: ""
  })

  // Validation functions
  const validateEmail = (email: string) => {
    if (!email.trim()) {
      return t('auth.signup.validate.emailRequired')
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return t('auth.signup.validate.emailInvalid')
    }
    return ""
  }

  const validatePassword = (password: string) => {
    if (!password) {
      return t('auth.signup.validate.passwordRequired')
    }
    return ""
  }

  const handleBlur = (field: string, value: string) => {
    let error = ""
    switch (field) {
      case "email":
        error = validateEmail(value)
        break
      case "password":
        error = validatePassword(value)
        break
    }
    setValidationErrors(prev => ({ ...prev, [field]: error }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setValidationErrors({ email: "", password: "" })
    
    // Validate all fields
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)
    
    setValidationErrors({
      email: emailError,
      password: passwordError
    })
    
    if (emailError || passwordError) {
      setIsLoading(false)
      return
    }
    
    try {
      // Call the login action
      const result = await dispatch(loginUser({ email, password }))
      
      if (loginUser.fulfilled.match(result)) {
        // Login successful - navigate to dashboard based on role
        const userRole = result.payload.user?.role
        if (userRole === 'learner') {
          router.push("/learners/dashboard")
        } else if (userRole === 'speaker') {
          router.push("/speakers/dashboard")
        } else {
          // Fallback to speakers dashboard for other roles (admin, moderator)
          router.push("/speakers/dashboard")
        }
      } else if (loginUser.rejected.match(result)) {
        // Login failed - show error
        setError(result.payload as string || t('auth.signin.submit'))
      }
    } catch (err) {
      console.error("Login error:", err)
      setError(t('auth.signin.submit'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setError("Google sign-in failed. Please try again.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await authService.googleAuth(credentialResponse.credential, 'learner')
      
      if (response.success && response.data) {
        // Store token and update Redux state
        authService.setToken(response.data.token)
        dispatch(setUser(response.data.user))
        
        // Navigate to dashboard based on role
        const userRole = response.data.user?.role
        if (userRole === 'learner') {
          router.push("/learners/dashboard")
        } else if (userRole === 'speaker') {
          router.push("/speakers/dashboard")
        } else {
          router.push("/speakers/dashboard")
        }
      }
    } catch (err) {
      console.error("Google sign-in error:", err)
      setError(err instanceof Error ? err.message : "Google sign-in failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignInError = () => {
    setError("Google sign-in was cancelled or failed.")
  }

  const handleFacebookSignIn = () => {
    // TODO: Implement Facebook signin
    console.log("Facebook signin")
  }

  return (
    <div className="min-h-screen flex bg-[#1A1A33]">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Aurora gradient bars */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex gap-1 w-full max-w-md">
              {Array.from({ length: 50 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-64 rounded-full opacity-80"
                  style={{
                    background: `linear-gradient(to bottom, 
                      hsl(${270 + (i * 3)}, 80%, ${60 + (i % 10)}%), 
                      transparent)`,
                    animationDelay: `${i * 0.02}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="relative z-10 text-center">
          <h1 className="text-6xl font-bold mb-4" style={{
            background: 'linear-gradient(to right, #a855f7, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {t('auth.signin.title')}
          </h1>
          <p className="text-xl text-gray-300 font-light">{t('speakerSignup.tagline')}</p>
        </div>
      </div>

      {/* Right Panel - Sign In Form */}
      <div className="flex-1 lg:flex-[1.5] bg-white rounded-tl-2xl lg:rounded-tl-3xl rounded-bl-2xl lg:rounded-bl-3xl flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            {t('auth.signin.submit')}
          </h2>

          {/* Social Sign In Buttons */}
          <div className="flex gap-3 mb-6">
            <div className="flex flex items-center justify-center border border-gray-300 rounded-lg overflow-hidden">
              <GoogleLogin
                onSuccess={handleGoogleSignIn}
                onError={handleGoogleSignInError}
                text="signin_with"
                width="100%"
                size="large"
              />
            </div>

            <button
              onClick={handleFacebookSignIn}
              className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 px-2 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                <circle cx="12" cy="12" r="10" fill="#1877F2"/>
                <path d="M16 8h-2c-.55 0-1 .45-1 1v1h3v2h-3v6h-2v-6H9v-2h2V9c0-1.1.9-2 2-2h3v1z" fill="white"/>
              </svg>
              <span className="font-medium">{t('auth.signup.facebook')}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-gray-500 text-sm">{t('auth.signup.or')}</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Error Message */}
          {displayError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{displayError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <Input
                type="email"
                placeholder={t('auth.signin.email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={(e) => handleBlur("email", e.target.value)}
                required
                className={`border-0 border-b-2 rounded-none focus-visible:ring-0 px-3 py-3 text-base text-gray-900 ${
                  validationErrors.email 
                    ? "border-red-500 focus-visible:border-red-500" 
                    : "border-gray-300 focus-visible:border-purple-500"
                }`}
              />
              {validationErrors.email && (
                <p className="text-xs text-red-500 mt-1">{validationErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={t('auth.signin.password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={(e) => handleBlur("password", e.target.value)}
                required
                className={`border-0 border-b-2 rounded-none focus-visible:ring-0 px-3  py-3 pr-10 text-base text-gray-900 ${
                  validationErrors.password 
                    ? "border-red-500 focus-visible:border-red-500" 
                    : "border-gray-300 focus-visible:border-purple-500"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
              {validationErrors.password && (
                <p className="text-xs text-red-500 mt-1">{validationErrors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoadingState}
              className="w-full py-6 text-lg font-semibold rounded-lg disabled:opacity-50"
              style={{
                background: 'linear-gradient(to right, #9333ea, #d946ef)',
              }}
            >
              {isLoadingState ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t('auth.signin.loading')}
                </>
              ) : (
                t('auth.signin.submit')
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center mt-6 text-gray-600 text-sm">
            {t('auth.signin.noAccount')}{" "}
            <Link href="/auth/signup" className="text-purple-600 hover:text-purple-700 font-semibold">
              {t('auth.signin.signup')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

