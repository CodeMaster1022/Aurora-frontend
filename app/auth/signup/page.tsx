"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"
import { authService } from "@/lib/services/authService"
import { useAppDispatch } from "@/lib/hooks/redux"
import { setUser } from "@/lib/store/authSlice"

export default function SignUpPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [validationErrors, setValidationErrors] = useState({
    fullName: "",
    email: "",
    password: ""
  })

  // Validation functions
  const validateFullName = (name: string) => {
    if (!name.trim()) {
      return "Full name is required"
    }
    if (name.trim().length < 2) {
      return "Full name must be at least 2 characters"
    }
    if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) {
      return "Full name can only contain letters, spaces, hyphens, and apostrophes"
    }
    return ""
  }

  const validateEmail = (email: string) => {
    if (!email.trim()) {
      return "Email is required"
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address"
    }
    return ""
  }

  const validatePassword = (password: string) => {
    if (!password) {
      return "Password is required"
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters"
    }
    if (!/[A-Za-z]/.test(password)) {
      return "Password must contain at least one letter"
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number"
    }
    return ""
  }

  const handleBlur = (field: string, value: string) => {
    let error = ""
    switch (field) {
      case "fullName":
        error = validateFullName(value)
        break
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
    
    // Validate all fields
    const fullNameError = validateFullName(fullName)
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)
    
    setValidationErrors({
      fullName: fullNameError,
      email: emailError,
      password: passwordError
    })
    
    if (fullNameError || emailError || passwordError) {
      setIsLoading(false)
      return
    }
    
    try {
      const response = await authService.register({
        fullName: fullName,
        email: email,
        password: password,
        confirmPassword: password,
      })
      
      if (response.success && response.data) {
        // Store token and update Redux state
        authService.setToken(response.data.token)
        dispatch(setUser(response.data.user))
        
        // Redirect to dashboard
        router.push("/dashboard")
      }
    } catch (err) {
      console.error("Registration error:", err)
      setError(err instanceof Error ? err.message : "Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = () => {
    // TODO: Implement Google signup
    console.log("Google signup")
  }

  const handleFacebookSignUp = () => {
    // TODO: Implement Facebook signup
    console.log("Facebook signup")
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
            Aurora
          </h1>
          <p className="text-xl text-gray-300 font-light">Happy & Fluent</p>
        </div>
      </div>

      {/* Right Panel - Sign Up Form */}
      <div className="flex-1 lg:flex-[1.5] bg-white rounded-tl-2xl lg:rounded-tl-3xl rounded-bl-2xl lg:rounded-bl-3xl flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Create Account
          </h2>

          {/* Social Sign Up Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleGoogleSignUp}
              className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 px-2 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-medium">Sign up with Google</span>
            </button>

            <button
              onClick={handleFacebookSignUp}
              className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 px-2 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                <circle cx="12" cy="12" r="10" fill="#1877F2"/>
                <path d="M16 8h-2c-.55 0-1 .45-1 1v1h3v2h-3v6h-2v-6H9v-2h2V9c0-1.1.9-2 2-2h3v1z" fill="white"/>
              </svg>
              <span className="font-medium">Sign up with Facebook</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-gray-500 text-sm">- OR -</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onBlur={(e) => handleBlur("fullName", e.target.value)}
                required
                className={`border-0 border-b-2 rounded-none focus-visible:ring-0 px-3  py-3 text-base text-gray-900 ${
                  validationErrors.fullName 
                    ? "border-red-500 focus-visible:border-red-500" 
                    : "border-gray-300 focus-visible:border-purple-500"
                }`}
              />
              {validationErrors.fullName && (
                <p className="text-xs text-red-500 mt-1">{validationErrors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div className="relative">
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={(e) => handleBlur("email", e.target.value)}
                required
                className={`border-0 border-b-2 rounded-none focus-visible:ring-0 px-3  py-3 text-base text-gray-900 ${
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
                placeholder="Password"
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
              disabled={isLoading}
              className="w-full py-6 text-lg font-semibold rounded-lg disabled:opacity-50"
              style={{
                background: 'linear-gradient(to right, #9333ea, #d946ef)',
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-6 text-gray-600 text-sm">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-purple-600 hover:text-purple-700 font-semibold">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

