"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2, X } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { speakerService } from "@/lib/services/speakerService"
import { authService } from "@/lib/services/authService"
import { useAppDispatch } from "@/lib/hooks/redux"
import { setUser } from "@/lib/store/authSlice"
import { useTranslation } from "@/lib/hooks/useTranslation"
import { TranslationKey } from "@/lib/i18n/translations"

const MEETING_OPTIONS = ["Mornings", "Afternoon", "Nights", "Other"] as const

const MEETING_OPTION_TRANSLATION_KEYS: Record<(typeof MEETING_OPTIONS)[number], TranslationKey> = {
  Mornings: "speakerSignup.step3.mornings",
  Afternoon: "speakerSignup.step3.afternoon",
  Nights: "speakerSignup.step3.nights",
  Other: "speakerSignup.step3.other",
}

interface SpeakerSignupModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

interface FormState {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  interests: string[]
  meetingPreference: string
  age: string
  cost: string
  avatar: File | null
}

interface ValidationState {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  age: string
  cost: string
  termsAccepted: string
}

const INITIAL_FORM: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  interests: [],
  meetingPreference: "",
  age: "",
  cost: "",
  avatar: null,
}

const INITIAL_ERRORS: ValidationState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  age: "",
  cost: "",
  termsAccepted: "",
}

export function SpeakerSignupModal({
  open: controlledOpen,
  onOpenChange,
}: SpeakerSignupModalProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const [uncontrolledOpen, setUncontrolledOpen] = useState(true)
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM)
  const [validationErrors, setValidationErrors] = useState<ValidationState>(INITIAL_ERRORS)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [availableTopics, setAvailableTopics] = useState<string[]>([])
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const isControlled = typeof controlledOpen === "boolean"
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const headingClass = "text-lg sm:text-xl"
  const sectionHeadingClass = "text-base"
  const bodyCopyClass = "text-xs"
  const formSpacing = "space-y-4"
  const sectionSpacing = "space-y-2"
  const sectionGap = "gap-2"
  const inputClass = "h-9 text-xs"
  const interestButtonPadding = "px-4 py-2 text-xs"
  const meetingButtonPadding = "p-3 text-xs"
  const submitButtonPadding = "px-4 py-2.5"

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const response = await speakerService.getTopics()
        if (response.success && response.data.topics) {
          setAvailableTopics(response.data.topics)
        }
      } catch (err) {
        console.error("Error loading topics:", err)
      }
    }

    void loadTopics()
  }, [])

  const handleClose = useCallback(() => {
    if (isControlled) {
      onOpenChange?.(false)
    } else {
      setUncontrolledOpen(false)
      router.back()
    }
  }, [isControlled, onOpenChange, router])

  const handleOpenChange = useCallback(
    (value: boolean) => {
      if (isControlled) {
        onOpenChange?.(value)
      } else {
        setUncontrolledOpen(value)
        if (!value) {
          router.back()
        }
      }
    },
    [isControlled, onOpenChange, router],
  )

  const validateFirstName = (value: string) => {
    if (!value.trim()) return t("speakerSignup.step1.validate.firstNameRequired")
    if (value.trim().length < 2) return t("speakerSignup.step1.validate.firstNameMin")
    if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) return t("speakerSignup.step1.validate.firstNameInvalid")
    return ""
  }

  const validateLastName = (value: string) => {
    if (!value.trim()) return t("speakerSignup.step1.validate.lastNameRequired")
    if (value.trim().length < 2) return t("speakerSignup.step1.validate.lastNameMin")
    if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) return t("speakerSignup.step1.validate.lastNameInvalid")
    return ""
  }

  const validateEmail = (value: string) => {
    if (!value.trim()) return t("speakerSignup.step1.validate.emailRequired")
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value.trim())) return t("speakerSignup.step1.validate.emailInvalid")
    return ""
  }

  const validatePassword = (value: string) => {
    if (!value) return t("speakerSignup.step5.validate.passwordRequired")
    if (value.length < 8) return t("speakerSignup.step5.validate.passwordMin")
    if (!/[A-Za-z]/.test(value)) return t("speakerSignup.step5.validate.passwordLetter")
    if (!/[0-9]/.test(value)) return t("speakerSignup.step5.validate.passwordNumber")
    return ""
  }

  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (!confirmPassword) return t("speakerSignup.step5.validate.confirmRequired")
    if (password !== confirmPassword) return t("speakerSignup.step5.validate.passwordsMatch")
    return ""
  }

  const validateAge = (value: string) => {
    if (!value) return ""
    const parsed = Number(value)
    if (Number.isNaN(parsed) || parsed < 18 || parsed > 120) {
      return "Please enter a valid age between 18 and 120"
    }
    return ""
  }

  const validateCost = (value: string) => {
    if (!value) return ""
    const parsed = Number(value)
    if (Number.isNaN(parsed) || parsed < 0) {
      return "Please enter a valid cost (must be 0 or greater)"
    }
    return ""
  }

  const handleInputChange = (field: keyof FormState, value: string | File | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    handleInputChange("avatar", file)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setAvatarPreview(null)
    }
  }

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter((item) => item !== interest)
        : prev.interests.length < 4
        ? [...prev.interests, interest]
        : prev.interests
      return {
        ...prev,
        interests,
      }
    })
  }

  const handleBlur = (field: keyof ValidationState) => {
    let message = ""
    switch (field) {
      case "firstName":
        message = validateFirstName(formData.firstName)
        break
      case "lastName":
        message = validateLastName(formData.lastName)
        break
      case "email":
        message = validateEmail(formData.email)
        break
      case "password":
        message = validatePassword(formData.password)
        break
      case "confirmPassword":
        message = validateConfirmPassword(formData.password, formData.confirmPassword)
        break
      case "age":
        message = validateAge(formData.age)
        break
      case "cost":
        message = validateCost(formData.cost)
        break
      case "termsAccepted":
        message = termsAccepted ? "" : t("auth.signup.validate.termsRequired")
        break
      default:
        message = ""
    }

    setValidationErrors((prev) => ({ ...prev, [field]: message }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    const nextErrors: ValidationState = {
      firstName: validateFirstName(formData.firstName),
      lastName: validateLastName(formData.lastName),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.password, formData.confirmPassword),
      age: validateAge(formData.age),
      cost: validateCost(formData.cost),
      termsAccepted: termsAccepted ? "" : t("auth.signup.validate.termsRequired"),
    }

    setValidationErrors(nextErrors)

    const hasErrors = Object.values(nextErrors).some((message) => message)
    if (hasErrors) {
      setIsLoading(false)
      return
    }

    try {
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
        avatar: formData.avatar ?? undefined,
        termsAccepted: true,
        privacyAccepted: true,
      })

      if (response.success && response.data) {
        authService.setToken(response.data.token)
        dispatch(setUser(response.data.user))
        onOpenChange?.(false) // Close the modal on successful registration
        router.push("/speakers/dashboard")
      }
    } catch (err) {
      console.error("Registration error:", err)
      setError(err instanceof Error ? err.message : t("speakerSignup.error.createFailed"))
    } finally {
      setIsLoading(false)
    }
  }

  const InterestPills = (
    <div className="flex flex-wrap gap-2">
      {availableTopics.map((topic) => (
        <button
          key={topic}
          type="button"
          onClick={() => handleInterestToggle(topic)}
          className={`border rounded-full transition-all ${interestButtonPadding} ${
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
  )

  const MeetingPreferenceOptions = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {MEETING_OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => handleInputChange("meetingPreference", option)}
          className={`w-full text-left border rounded-lg transition-all flex items-center gap-2.5 ${meetingButtonPadding} ${
            formData.meetingPreference === option
              ? "border-purple-600 bg-purple-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
              formData.meetingPreference === option ? "border-purple-600 bg-purple-600" : "border-gray-300"
            }`}
          >
            {formData.meetingPreference === option && <span className="h-2 w-2 rounded-full bg-white" />}
          </span>
          <span className="text-gray-900 font-medium">{t(MEETING_OPTION_TRANSLATION_KEYS[option])}</span>
        </button>
      ))}
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-3xl max-h-[92vh] p-0 bg-white text-neutral-900 dark:bg-[#0f111f] dark:text-white/90 border border-purple-500/20 dark:border-purple-500/40 shadow-2xl"
        showCloseButton={false}
      >
        <div className="relative flex items-start justify-between px-4 py-3 sm:px-6 border-b border-neutral-200/70 dark:border-white/5 bg-gradient-to-r from-purple-100/60 via-white to-purple-50/60 dark:from-purple-700/40 dark:via-transparent dark:to-purple-500/20 backdrop-blur">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-purple-500 dark:text-purple-200/70">Aurora speakers</p>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">{t("speakerSignup.title")}</h2>
            <p className="text-[11px] text-neutral-600/90 dark:text-purple-100/80 mt-1">
              {t("speakerSignup.step1.description")}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="ml-3 rounded-full p-1.5 text-neutral-500 hover:text-neutral-800 dark:text-purple-100/80 transition hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-4 sm:px-6 pb-5 max-h-[calc(92vh-120px)] overflow-y-auto thin-scrollbar" style={{ scrollBehavior: "smooth" }}>
          {error && (
            <div className="mb-3 rounded-md border border-red-400/60 dark:border-red-500/40 bg-red-50 dark:bg-red-500/10 px-3 py-2 text-xs text-red-600 dark:text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={`${formSpacing} text-neutral-900 dark:text-white/90`}>
            <section className={`${sectionSpacing} rounded-lg border border-neutral-200/70 bg-neutral-100/80 dark:border-white/5 dark:bg-white/5 p-3`}>
              <h4 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide dark:text-white/80">Basic Information</h4>
              <div className={`mt-2 grid grid-cols-1 sm:grid-cols-3 ${sectionGap}`}>
                <div>
                  <label className={`${bodyCopyClass} font-medium text-neutral-700 dark:text-gray-300 mb-2`}>{t("speakerSignup.step1.firstName")}</label>
                  <Input
                    type="text"
                    value={formData.firstName}
                    onChange={(event) => handleInputChange("firstName", event.target.value)}
                    onBlur={() => handleBlur("firstName")}
                    placeholder={t("speakerSignup.step1.firstNamePlaceholder")}
                    className={inputClass}
                  />
                  {validationErrors.firstName && (
                    <p className="text-xs text-red-500 mt-1">{validationErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className={`${bodyCopyClass} font-medium text-neutral-700 dark:text-gray-300 mb-2`}>{t("speakerSignup.step1.lastName")}</label>
                  <Input
                    type="text"
                    value={formData.lastName}
                    onChange={(event) => handleInputChange("lastName", event.target.value)}
                    onBlur={() => handleBlur("lastName")}
                    placeholder={t("speakerSignup.step1.lastNamePlaceholder")}
                    className={inputClass}
                  />
                  {validationErrors.lastName && (
                    <p className="text-xs text-red-500 mt-1">{validationErrors.lastName}</p>
                  )}
                </div>
                <div className="sm:col-span-1">
                  <label className={`${bodyCopyClass} font-medium text-neutral-700 dark:text-gray-300 mb-2`}>{t("speakerSignup.step1.mail")}</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(event) => handleInputChange("email", event.target.value)}
                    onBlur={() => handleBlur("email")}
                    placeholder={t("speakerSignup.step1.emailPlaceholder")}
                    className={inputClass}
                  />
                  {validationErrors.email && <p className="text-xs text-red-500 mt-1">{validationErrors.email}</p>}
                </div>
              </div>
            </section>

            <section className={`${sectionSpacing} rounded-lg border border-neutral-200/70 bg-neutral-100/80 dark:border-white/5 dark:bg-white/5 p-3`}>
              <h4 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide dark:text-white/80">Account security</h4>
              <div className={`mt-2 grid grid-cols-1 sm:grid-cols-2 ${sectionGap}`}>
                <div className="relative">
                  <label className={`${bodyCopyClass} font-medium text-neutral-700 dark:text-gray-300 mb-2`}>
                    {t("speakerSignup.step5.password")}
                  </label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(event) => handleInputChange("password", event.target.value)}
                    onBlur={() => handleBlur("password")}
                    placeholder={t("speakerSignup.step5.passwordPlaceholder")}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-8 text-neutral-400 hover:text-neutral-600 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  {validationErrors.password ? (
                    <p className="text-xs text-red-500 mt-1">{validationErrors.password}</p>
                  ) : (
                    <p className="text-xs text-neutral-500 dark:text-gray-400 mt-1">{t("speakerSignup.step5.hint")}</p>
                  )}
                </div>
                <div className="relative">
                  <label className={`${bodyCopyClass} font-medium text-neutral-700 dark:text-gray-300 mb-2`}>
                    {t("speakerSignup.step5.confirmPassword")}
                  </label>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(event) => handleInputChange("confirmPassword", event.target.value)}
                    onBlur={() => handleBlur("confirmPassword")}
                    placeholder={t("speakerSignup.step5.confirmPasswordPlaceholder")}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-8 text-neutral-400 hover:text-neutral-600 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  {validationErrors.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">{validationErrors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </section>

            <section className={`${sectionSpacing} rounded-lg border border-neutral-200/70 bg-neutral-100/80 dark:border-white/5 dark:bg-white/5 p-3`}>
              <h4 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide dark:text-white/80">Availability & preferences</h4>
              <p className={`${bodyCopyClass} text-neutral-600 mt-1 dark:text-gray-300/80`}>{t("speakerSignup.step3.description")}</p>
              <div className="mt-2">{MeetingPreferenceOptions}</div>
              <div className="mt-3 space-y-1.5">
                <p className={`${bodyCopyClass} font-medium text-neutral-700 dark:text-gray-200/80`}>{t("speakerSignup.step2.title")}</p>
                {InterestPills}
                <p className="text-[11px] text-neutral-500 dark:text-gray-400/80">
                  {t("speakerSignup.step2.selected")} {formData.interests.length}/4
                </p>
              </div>
            </section>

            <section className={`${sectionSpacing} rounded-lg border border-neutral-200/70 bg-neutral-100/80 dark:border-white/5 dark:bg-white/5 p-3`}>
              <h4 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide dark:text-white/80">Profile details</h4>
              <div className={`mt-2 grid grid-cols-1 sm:grid-cols-2 ${sectionGap}`}>
                <div>
                  <label className={`${bodyCopyClass} font-medium text-neutral-700 dark:text-gray-300 mb-2`}>Age</label>
                  <Input
                    type="number"
                    value={formData.age}
                    onChange={(event) => handleInputChange("age", event.target.value)}
                    onBlur={() => handleBlur("age")}
                    placeholder="18"
                    min={18}
                    max={120}
                    className={inputClass}
                  />
                  {validationErrors.age && <p className="text-xs text-red-500 mt-1">{validationErrors.age}</p>}
                </div>
                <div>
                  <label className={`${bodyCopyClass} font-medium text-neutral-700 dark:text-gray-300 mb-2`}>Cost per session (USD)</label>
                  <Input
                    type="number"
                    value={formData.cost}
                    onChange={(event) => handleInputChange("cost", event.target.value)}
                    onBlur={() => handleBlur("cost")}
                    placeholder="40"
                    min={0}
                    step="0.01"
                    className={inputClass}
                  />
                  {validationErrors.cost && <p className="text-xs text-red-500 mt-1">{validationErrors.cost}</p>}
                  <p className="text-[11px] text-neutral-500 dark:text-gray-400/80 mt-2">Optional: Leave blank if you haven't decided yet.</p>
                </div>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
                {avatarPreview && (
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-300/60 shadow-inner">
                    <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="space-y-2 text-center sm:text-left">
                  <input
                    type="file"
                    id="speaker-avatar-upload"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="speaker-avatar-upload"
                    className="inline-flex px-5 py-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white rounded-lg cursor-pointer transition-all font-medium text-xs shadow"
                  >
                    {t("speakerSignup.step4.selectImage")}
                  </label>
                  <p className="text-[11px] text-neutral-500 dark:text-gray-400/80">PNG or JPG up to 5MB.</p>
                </div>
              </div>
            </section>

            <section className={`${sectionSpacing} rounded-lg border border-neutral-200/70 bg-neutral-100/80 dark:border-white/5 dark:bg-white/5 p-3`}>
              <h4 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide dark:text-white/80">Agreements</h4>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="speaker-terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => {
                    setTermsAccepted(Boolean(checked))
                    if (checked) {
                      setValidationErrors((prev) => ({ ...prev, termsAccepted: "" }))
                    }
                  }}
                  className="mt-0.5 border-2 border-gray-800"
                />
                <label htmlFor="speaker-terms" className="text-xs text-neutral-700 dark:text-gray-300 leading-relaxed">
                  {t("auth.signup.termsText")} {" "}
                  <Link
                    href="/terms-and-conditions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-700 underline"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {t("auth.signup.termsLink")}
                  </Link>{" "}
                  {t("auth.signup.termsAnd")} {" "}
                  <Link
                    href="/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-700 underline"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {t("auth.signup.privacyLink")}
                  </Link>
                  .
                </label>
              </div>
              {validationErrors.termsAccepted && (
                <p className="text-xs text-red-500">{validationErrors.termsAccepted}</p>
              )}
            </section>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <p className={`${bodyCopyClass} text-neutral-600 dark:text-gray-400`}>
                {t("speakerSignup.hasAccount")}
              </p>
              <Button
                type="submit"
                disabled={isLoading}
                className={`${submitButtonPadding} bg-gradient-to-r from-purple-500 via-purple-400 to-purple-500 hover:from-purple-400 hover:to-purple-500 text-white rounded-lg disabled:opacity-50 transition-all text-sm shadow-lg shadow-purple-500/20`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("speakerSignup.creating")}
                  </>
                ) : (
                  t("speakerSignup.createAccount")
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
