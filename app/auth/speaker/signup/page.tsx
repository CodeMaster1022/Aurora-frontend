"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { authService } from "@/lib/services/authService"
import { useAppDispatch } from "@/lib/hooks/redux"
import { setUser } from "@/lib/store/authSlice"

export default function SignUpPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    interests: [] as string[],
    meetingPreference: "",
    avatar: null as File | null
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [validationErrors, setValidationErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  // Validation functions
  const validateFirstName = (name: string) => {
    if (!name.trim()) return "First name is required"
    if (name.trim().length < 2) return "First name must be at least 2 characters"
    if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) return "First name can only contain letters"
    return ""
  }

  const validateLastName = (name: string) => {
    if (!name.trim()) return "Last name is required"
    if (name.trim().length < 2) return "Last name must be at least 2 characters"
    if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) return "Last name can only contain letters"
    return ""
  }

  const validateEmail = (email: string) => {
    if (!email.trim()) return "Email is required"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return "Please enter a valid email address"
    return ""
  }

  const validatePassword = (password: string) => {
    if (!password) return "Password is required"
    if (password.length < 8) return "Password must be at least 8 characters"
    if (!/[A-Za-z]/.test(password)) return "Password must contain at least one letter"
    if (!/[0-9]/.test(password)) return "Password must contain at least one number"
    return ""
  }

  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (!confirmPassword) return "Please confirm your password"
    if (password !== confirmPassword) return "Passwords do not match"
    return ""
  }

  const handleBlur = (field: string, value: string) => {
    let error = ""
    switch (field) {
      case "firstName":
        error = validateFirstName(value)
        break
      case "lastName":
        error = validateLastName(value)
        break
      case "email":
        error = validateEmail(value)
        break
      case "password":
        error = validatePassword(value)
        break
      case "confirmPassword":
        error = validateConfirmPassword(formData.password, value)
        break
    }
    setValidationErrors(prev => ({ ...prev, [field]: error }))
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : prev.interests.length < 4
          ? [...prev.interests, interest]
          : prev.interests
      return { ...prev, interests }
    })
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, avatar: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      router.push("/")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        setIsLoading(false)
        return
      }
      
      const response = await authService.registerSpeaker({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        interests: formData.interests,
        meetingPreference: formData.meetingPreference,
        avatar: formData.avatar || undefined,
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

  const totalSteps = 5

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
      <div className="flex-1 lg:flex-[1.5] bg-gray-50 rounded-tl-2xl lg:rounded-tl-3xl rounded-bl-2xl lg:rounded-bl-3xl flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-2xl">
          {/* Header with Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Account set up</h2>
              <span className="text-sm text-gray-500">{currentStep}/{totalSteps}</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
            
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Step Content */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            {currentStep === 1 && (
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Tell us a bit about you</h3>
                <p className="text-gray-600 mb-8">That will help us better account setup for you.</p>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First name</label>
                      <Input
                        type="text"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        onBlur={(e) => handleBlur("firstName", e.target.value)}
                        required
                        className={`border rounded-lg px-4 py-3 text-gray-900 ${
                          validationErrors.firstName 
                            ? "border-red-500 focus-visible:border-red-500" 
                            : "border-gray-300 focus-visible:border-purple-500"
                        }`}
                      />
                      {validationErrors.firstName && (
                        <p className="text-xs text-red-500 mt-1">{validationErrors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last name</label>
                      <Input
                        type="text"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        onBlur={(e) => handleBlur("lastName", e.target.value)}
                        required
                        className={`border rounded-lg px-4 py-3 text-gray-900 ${
                          validationErrors.lastName 
                            ? "border-red-500 focus-visible:border-red-500" 
                            : "border-gray-300 focus-visible:border-purple-500"
                        }`}
                      />
                      {validationErrors.lastName && (
                        <p className="text-xs text-red-500 mt-1">{validationErrors.lastName}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mail</label>
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      onBlur={(e) => handleBlur("email", e.target.value)}
                      required
                      className={`border rounded-lg px-4 py-3 text-gray-900 ${
                        validationErrors.email 
                          ? "border-red-500 focus-visible:border-red-500" 
                          : "border-gray-300 focus-visible:border-purple-500"
                      }`}
                    />
                    {validationErrors.email && (
                      <p className="text-xs text-red-500 mt-1">{validationErrors.email}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">What topics do you like?</h3>
                <p className="text-gray-600 mb-8">Select up to 4 topics you're interested in</p>
                
                <div className="flex flex-wrap gap-3">
                  {[
                    "Technology", "Business", "Science", "Art", "Music", 
                    "Sports", "Travel", "Food", "Health", "Education",
                    "Fashion", "Literature", "History", "Languages", "Gaming"
                  ].map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => handleInterestToggle(topic)}
                      className={`px-6 py-3 border-2 rounded-full transition-all ${
                        formData.interests.includes(topic)
                          ? "border-purple-600 bg-purple-50 text-purple-600 font-medium"
                          : "border-gray-300 hover:border-gray-400 text-gray-700"
                      }`}
                      disabled={!formData.interests.includes(topic) && formData.interests.length >= 4}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
                
                {formData.interests.length > 0 && (
                  <p className="mt-6 text-sm text-gray-500">
                    Selected: {formData.interests.length}/4
                  </p>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">When do you prefer to meet?</h3>
                <p className="text-gray-600 mb-8">Select your preferred meeting time</p>
                
                <div className="space-y-4">
                  {[
                    "Mornings",
                    "Afternoon",
                    "Nights",
                    "Other"
                  ].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleInputChange("meetingPreference", option)}
                      className={`w-full text-left p-4 border-2 rounded-lg transition-all flex items-center gap-3 ${
                        formData.meetingPreference === option
                          ? "border-purple-600 bg-purple-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        formData.meetingPreference === option
                          ? "border-purple-600 bg-purple-600"
                          : "border-gray-300"
                      }`}>
                        {formData.meetingPreference === option && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span className="text-gray-900 font-medium">{option}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Choose your avatar</h3>
                <p className="text-gray-600 mb-8">Please share your profile picture</p>
                
                <div className="flex flex-col items-center gap-6">
                  {avatarPreview && (
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-200">
                      <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-lg cursor-pointer transition-all font-medium"
                  >
                    Select image
                  </label>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Set up your password</h3>
                <p className="text-gray-600 mb-8">Create a secure password to complete your account.</p>
                
                <div className="space-y-6">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      onBlur={(e) => handleBlur("password", e.target.value)}
                      required
                      className={`border rounded-lg px-4 py-3 pr-10 text-gray-900 ${
                        validationErrors.password 
                          ? "border-red-500 focus-visible:border-red-500" 
                          : "border-gray-300 focus-visible:border-purple-500"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                    {validationErrors.password ? (
                      <p className="text-xs text-red-500 mt-2">{validationErrors.password}</p>
                    ) : (
                      <p className="text-xs text-gray-500 mt-2">Must be at least 8 characters with letters and numbers</p>
                    )}
                  </div>
                  
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      onBlur={(e) => handleBlur("confirmPassword", e.target.value)}
                      required
                      className={`border rounded-lg px-4 py-3 pr-10 text-gray-900 ${
                        validationErrors.confirmPassword 
                          ? "border-red-500 focus-visible:border-red-500" 
                          : "border-gray-300 focus-visible:border-purple-500"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                    {validationErrors.confirmPassword && (
                      <p className="text-xs text-red-500 mt-2">{validationErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4">
            {currentStep < totalSteps && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/dashboard")}
                className="text-gray-600 hover:text-gray-900"
              >
                Skip
              </Button>
            )}
            
            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && (!formData.firstName || !formData.lastName || !formData.email)) ||
                  (currentStep === 3 && !formData.meetingPreference) ||
                  (currentStep === 5 && (!formData.password || !formData.confirmPassword))
                }
                className="px-8 py-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-lg disabled:opacity-50 transition-all"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-8 py-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-lg disabled:opacity-50 transition-all"
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
            )}
          </div>

          {/* Login Link */}
          {currentStep === 1 && (
            <p className="text-center mt-6 text-gray-600 text-sm">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-purple-600 hover:text-purple-700 font-semibold">
                Log in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
