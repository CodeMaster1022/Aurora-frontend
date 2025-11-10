"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { authService } from "@/lib/services/authService"
import { speakerService } from "@/lib/services/speakerService"
import { useAppDispatch } from "@/lib/hooks/redux"
import { setUser } from "@/lib/store/authSlice"
import { useTranslation } from "@/lib/hooks/useTranslation"

export default function SignUpPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
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
    age: "",
    cost: "",
    avatar: null as File | null
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [error, setError] = useState("")
  const [validationErrors, setValidationErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    cost: "",
    termsAccepted: ""
  })

  // Available topics - loaded from backend
  const [availableTopics, setAvailableTopics] = useState<string[]>([])

  // Load topics from backend on mount
  useEffect(() => {
    const loadTopics = async () => {
      try {
        const response = await speakerService.getTopics()
        if (response.success && response.data.topics) {
          setAvailableTopics(response.data.topics)
        }
      } catch (error) {
        console.error('Error loading topics:', error)
        // Keep default topics if backend fails
      }
    }
    loadTopics()
  }, [])

  // Validation functions
  const validateFirstName = (name: string) => {
    if (!name.trim()) return t('speakerSignup.step1.validate.firstNameRequired')
    if (name.trim().length < 2) return t('speakerSignup.step1.validate.firstNameMin')
    if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) return t('speakerSignup.step1.validate.firstNameInvalid')
    return ""
  }

  const validateLastName = (name: string) => {
    if (!name.trim()) return t('speakerSignup.step1.validate.lastNameRequired')
    if (name.trim().length < 2) return t('speakerSignup.step1.validate.lastNameMin')
    if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) return t('speakerSignup.step1.validate.lastNameInvalid')
    return ""
  }

  const validateEmail = (email: string) => {
    if (!email.trim()) return t('speakerSignup.step1.validate.emailRequired')
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return t('speakerSignup.step1.validate.emailInvalid')
    return ""
  }

  const validatePassword = (password: string) => {
    if (!password) return t('speakerSignup.step5.validate.passwordRequired')
    if (password.length < 8) return t('speakerSignup.step5.validate.passwordMin')
    if (!/[A-Za-z]/.test(password)) return t('speakerSignup.step5.validate.passwordLetter')
    if (!/[0-9]/.test(password)) return t('speakerSignup.step5.validate.passwordNumber')
    return ""
  }

  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (!confirmPassword) return t('speakerSignup.step5.validate.confirmRequired')
    if (password !== confirmPassword) return t('speakerSignup.step5.validate.passwordsMatch')
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
      case "age":
        if (value && (isNaN(Number(value)) || Number(value) < 18 || Number(value) > 120)) {
          error = "Please enter a valid age between 18 and 120"
        }
        break
      case "cost":
        if (value && (isNaN(Number(value)) || Number(value) < 0)) {
          error = "Please enter a valid cost (must be 0 or greater)"
        }
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
    if (currentStep < totalSteps) {
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
        setError(t('speakerSignup.error.passwordsMatch'))
        setIsLoading(false)
        return
      }

      // Validate terms acceptance
      if (!termsAccepted) {
        setValidationErrors(prev => ({ ...prev, termsAccepted: t('auth.signup.validate.termsRequired') }))
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
        age: formData.age ? Number(formData.age) : undefined,
        cost: formData.cost ? Number(formData.cost) : undefined,
        avatar: formData.avatar || undefined,
        termsAccepted: true,
        privacyAccepted: true,
      })
      
      if (response.success && response.data) {
        // Store token and update Redux state
        authService.setToken(response.data.token)
        dispatch(setUser(response.data.user))
        
        // Redirect to dashboard
        router.push("/learners/dashboard")
      }
    } catch (err) {
      console.error("Registration error:", err)
      setError(err instanceof Error ? err.message : t('speakerSignup.error.createFailed'))
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

  const totalSteps = 6

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
            {t('speakerSignup.title')}
          </h1>
          <p className="text-xl text-gray-300 font-light">{t('speakerSignup.tagline')}</p>
        </div>
      </div>

      {/* Right Panel - Sign Up Form */}
      <div className="flex-1 lg:flex-[1.5] bg-gray-50 rounded-tl-2xl lg:rounded-tl-3xl rounded-bl-2xl lg:rounded-bl-3xl flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-2xl">
          {/* Header with Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{t('speakerSignup.accountSetup')}</h2>
              <span className="text-sm text-gray-500">{currentStep}{t('speakerSignup.step')}{totalSteps}</span>
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
              <span>{t('speakerSignup.back')}</span>
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
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{t('speakerSignup.step1.title')}</h3>
                <p className="text-gray-600 mb-8">{t('speakerSignup.step1.description')}</p>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('speakerSignup.step1.firstName')}</label>
                      <Input
                        type="text"
                        placeholder={t('speakerSignup.step1.firstNamePlaceholder')}
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('speakerSignup.step1.lastName')}</label>
                      <Input
                        type="text"
                        placeholder={t('speakerSignup.step1.lastNamePlaceholder')}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('speakerSignup.step1.mail')}</label>
                    <Input
                      type="email"
                      placeholder={t('speakerSignup.step1.emailPlaceholder')}
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
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{t('speakerSignup.step2.title')}</h3>
                <p className="text-gray-600 mb-8">{t('speakerSignup.step2.description')}</p>
                
                <div className="flex flex-wrap gap-3">
                  {availableTopics.map((topic) => (
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
                    {t('speakerSignup.step2.selected')} {formData.interests.length}/4
                  </p>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{t('speakerSignup.step3.title')}</h3>
                <p className="text-gray-600 mb-8">{t('speakerSignup.step3.description')}</p>
                
                <div className="space-y-4">
                  {[
                    { key: "Mornings", label: t('speakerSignup.step3.mornings') },
                    { key: "Afternoon", label: t('speakerSignup.step3.afternoon') },
                    { key: "Nights", label: t('speakerSignup.step3.nights') },
                    { key: "Other", label: t('speakerSignup.step3.other') }
                  ].map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => handleInputChange("meetingPreference", option.key)}
                      className={`w-full text-left p-4 border-2 rounded-lg transition-all flex items-center gap-3 ${
                        formData.meetingPreference === option.key
                          ? "border-purple-600 bg-purple-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        formData.meetingPreference === option.key
                          ? "border-purple-600 bg-purple-600"
                          : "border-gray-300"
                      }`}>
                        {formData.meetingPreference === option.key && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span className="text-gray-900 font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{t('speakerSignup.step4.title')}</h3>
                <p className="text-gray-600 mb-8">{t('speakerSignup.step4.description')}</p>
                
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
                    {t('speakerSignup.step4.selectImage')}
                  </label>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Age & Cost</h3>
                <p className="text-gray-600 mb-8">Tell us a bit more about yourself</p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <Input
                      type="number"
                      placeholder="Enter your age"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      onBlur={(e) => handleBlur("age", e.target.value)}
                      min={18}
                      max={120}
                      className={`border rounded-lg px-4 py-3 text-gray-900 ${
                        validationErrors.age 
                          ? "border-red-500 focus-visible:border-red-500" 
                          : "border-gray-300 focus-visible:border-purple-500"
                      }`}
                    />
                    {validationErrors.age && (
                      <p className="text-xs text-red-500 mt-1">{validationErrors.age}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cost per Session (USD)</label>
                    <Input
                      type="number"
                      placeholder="Enter your hourly rate"
                      value={formData.cost}
                      onChange={(e) => handleInputChange("cost", e.target.value)}
                      onBlur={(e) => handleBlur("cost", e.target.value)}
                      min={0}
                      step="0.01"
                      className={`border rounded-lg px-4 py-3 text-gray-900 ${
                        validationErrors.cost 
                          ? "border-red-500 focus-visible:border-red-500" 
                          : "border-gray-300 focus-visible:border-purple-500"
                      }`}
                    />
                    {validationErrors.cost && (
                      <p className="text-xs text-red-500 mt-1">{validationErrors.cost}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">Optional: Leave blank if you haven't decided yet</p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{t('speakerSignup.step5.title')}</h3>
                <p className="text-gray-600 mb-8">{t('speakerSignup.step5.description')}</p>
                
                <div className="space-y-6">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('speakerSignup.step5.password')}</label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={t('speakerSignup.step5.passwordPlaceholder')}
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
                      <p className="text-xs text-gray-500 mt-2">{t('speakerSignup.step5.hint')}</p>
                    )}
                  </div>
                  
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('speakerSignup.step5.confirmPassword')}</label>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={t('speakerSignup.step5.confirmPasswordPlaceholder')}
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

                  {/* Terms and Conditions Checkbox */}
                  <div className="space-y-2 mt-6">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="terms-speaker"
                        checked={termsAccepted}
                        onCheckedChange={(checked) => {
                          setTermsAccepted(checked as boolean)
                          if (checked) {
                            setValidationErrors(prev => ({ ...prev, termsAccepted: "" }))
                          }
                        }}
                        className="mt-0.5"
                      />
                      <label
                        htmlFor="terms-speaker"
                        className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                      >
                        {t('auth.signup.termsText')}{" "}
                        <a
                          href="/terms-and-conditions"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-700 underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {t('auth.signup.termsLink')}
                        </a>
                        {" "}{t('auth.signup.termsAnd')}{" "}
                        <a
                          href="/privacy-policy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-700 underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {t('auth.signup.privacyLink')}
                        </a>.
                      </label>
                    </div>
                    {validationErrors.termsAccepted && (
                      <p className="text-xs text-red-500">{validationErrors.termsAccepted}</p>
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
                onClick={() => router.push("/speakers/dashboard")}
                className="text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                {t('speakerSignup.skip')}
              </Button>
            )}
            
            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && (!formData.firstName || !formData.lastName || !formData.email)) ||
                  (currentStep === 3 && !formData.meetingPreference) ||
                  (currentStep === 6 && (!formData.password || !formData.confirmPassword || !termsAccepted))
                }
                className="px-8 py-2 cursor-pointer bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-lg cursor-pointer disabled:opacity-50 transition-all"
              >
                {t('speakerSignup.next')}
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !termsAccepted}
                className="px-8 py-2 bg-gradient-to-r cursor-pointer from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-lg disabled:opacity-50 transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t('speakerSignup.creating')}
                  </>
                ) : (
                  t('speakerSignup.createAccount')
                )}
              </Button>
            )}
          </div>

          {/* Login Link */}
          {currentStep === 1 && (
            <p className="text-center mt-6 text-gray-600 text-sm">
              {t('speakerSignup.hasAccount')}{" "}
              <Link href="/auth/signin" className="text-purple-600 hover:text-purple-700 font-semibold">
                {t('speakerSignup.login')}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
