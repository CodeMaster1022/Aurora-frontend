"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { GoogleLogin, CredentialResponse } from "@react-oauth/google"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { authService } from "@/lib/services/authService"
import { useAppDispatch } from "@/lib/hooks/redux"
import { setUser } from "@/lib/store/authSlice"
import { useTranslation } from "@/lib/hooks/useTranslation"

type AuthView = "signin" | "signup"

interface SignUpFormProps {
  variant?: "page" | "modal"
  onSwitchView?: (view: AuthView) => void
  onOpenSpeakerSignup?: () => void
}

export function SignUpForm({
  variant = "page",
  onSwitchView,
  onOpenSpeakerSignup,
}: SignUpFormProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const [showPassword, setShowPassword] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [validationErrors, setValidationErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    termsAccepted: "",
  })

  const validateFirstName = (name: string) => {
    if (!name.trim()) {
      return t("auth.signup.validate.firstNameRequired")
    }
    if (name.trim().length < 2) {
      return t("auth.signup.validate.firstNameMin")
    }
    if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) {
      return t("auth.signup.validate.firstNameInvalid")
    }
    return ""
  }

  const validateLastName = (name: string) => {
    if (!name.trim()) {
      return t("auth.signup.validate.lastNameRequired")
    }
    if (name.trim().length < 2) {
      return t("auth.signup.validate.lastNameMin")
    }
    if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) {
      return t("auth.signup.validate.lastNameInvalid")
    }
    return ""
  }

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      return t("auth.signup.validate.emailRequired")
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return t("auth.signup.validate.emailInvalid")
    }
    return ""
  }

  const validatePassword = (value: string) => {
    if (!value) {
      return t("auth.signup.validate.passwordRequired")
    }
    if (value.length < 8) {
      return t("auth.signup.validate.passwordMin")
    }
    if (!/[A-Za-z]/.test(value)) {
      return t("auth.signup.validate.passwordLetter")
    }
    if (!/[0-9]/.test(value)) {
      return t("auth.signup.validate.passwordNumber")
    }
    return ""
  }

  const handleBlur = (field: keyof typeof validationErrors, value: string) => {
    const validators: Record<
      keyof typeof validationErrors,
      (val: string) => string
    > = {
      firstName: validateFirstName,
      lastName: validateLastName,
      email: validateEmail,
      password: validatePassword,
      termsAccepted: () => "",
    }

    setValidationErrors((prev) => ({
      ...prev,
      [field]: validators[field](value),
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    const firstNameError = validateFirstName(firstName)
    const lastNameError = validateLastName(lastName)
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)

    setValidationErrors({
      firstName: firstNameError,
      lastName: lastNameError,
      email: emailError,
      password: passwordError,
      termsAccepted: termsAccepted
        ? ""
        : t("auth.signup.validate.termsRequired"),
    })

    if (
      firstNameError ||
      lastNameError ||
      emailError ||
      passwordError ||
      !termsAccepted
    ) {
      setIsLoading(false)
      return
    }

    try {
      const response = await authService.register({
        firstname: firstName,
        lastname: lastName,
        email,
        password,
        confirmPassword: password,
        termsAccepted: true,
        privacyAccepted: true,
      })

      if (response.success && response.data) {
        authService.setToken(response.data.token)
        dispatch(setUser(response.data.user))
        router.push("/home")
      }
    } catch (err) {
      console.error("Registration error:", err)
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create account. Please try again.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`w-full max-w-md ${variant === "modal" ? "mx-auto" : ""}`}>
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
        {t("auth.signup.createAccount")}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            type="text"
            placeholder={t("auth.signup.firstName")}
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            onBlur={(event) => handleBlur("firstName", event.target.value)}
            required
            className={`border-0 border-b-2 rounded-none focus-visible:ring-0 px-3  py-3 text-base text-gray-900 ${
              validationErrors.firstName
                ? "border-red-500 focus-visible:border-red-500"
                : "border-gray-300 focus-visible:border-purple-500"
            }`}
          />
          {validationErrors.firstName && (
            <p className="text-xs text-red-500 mt-1">
              {validationErrors.firstName}
            </p>
          )}
        </div>

        <div className="relative">
          <Input
            type="text"
            placeholder={t("auth.signup.lastName")}
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            onBlur={(event) => handleBlur("lastName", event.target.value)}
            required
            className={`border-0 border-b-2 rounded-none focus-visible:ring-0 px-3  py-3 text-base text-gray-900 ${
              validationErrors.lastName
                ? "border-red-500 focus-visible:border-red-500"
                : "border-gray-300 focus-visible:border-purple-500"
            }`}
          />
          {validationErrors.lastName && (
            <p className="text-xs text-red-500 mt-1">
              {validationErrors.lastName}
            </p>
          )}
        </div>

        <div className="relative">
          <Input
            type="email"
            placeholder={t("auth.signup.email")}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onBlur={(event) => handleBlur("email", event.target.value)}
            required
            className={`border-0 border-b-2 rounded-none focus-visible:ring-0 px-3  py-3 text-base text-gray-900 ${
              validationErrors.email
                ? "border-red-500 focus-visible:border-red-500"
                : "border-gray-300 focus-visible:border-purple-500"
            }`}
          />
          {validationErrors.email && (
            <p className="text-xs text-red-500 mt-1">
              {validationErrors.email}
            </p>
          )}
        </div>

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder={t("auth.signup.password")}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onBlur={(event) => handleBlur("password", event.target.value)}
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
            <p className="text-xs text-red-500 mt-1">
              {validationErrors.password}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => {
                setTermsAccepted(checked as boolean)
                if (checked) {
                  setValidationErrors((prev) => ({
                    ...prev,
                    termsAccepted: "",
                  }))
                }
              }}
              className="mt-0.5 border-2 border-gray-800"
            />
            <label
              htmlFor="terms"
              className="text-sm text-gray-700 leading-relaxed cursor-pointer border-b-2 border-gray-300"
            >
              {t("auth.signup.termsText")}{" "}
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
            <p className="text-xs text-red-500">
              {validationErrors.termsAccepted}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full py-6 text-lg font-semibold rounded-lg disabled:opacity-50"
          style={{
            background: "linear-gradient(to right, #9333ea, #d946ef)",
          }}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {t("auth.signup.loading")}
            </>
          ) : (
            t("auth.signup.submit")
          )}
        </Button>
      </form>

      <p className="text-center mt-6 text-gray-600 text-sm">
        {t("auth.signup.hasAccount")}{" "}
        <Link
          href="/auth/signin"
          scroll={false}
          className="text-purple-600 hover:text-purple-700 font-semibold"
          onClick={(event) => {
            if (onSwitchView) {
              event.preventDefault()
              onSwitchView("signin")
            }
          }}
        >
          {t("auth.signup.login")}
        </Link>
      </p>

      <p className="text-center mt-3 text-gray-600 text-sm">
        Interested in becoming a speaker?{" "}
        <button
          type="button"
          className="text-purple-600 hover:text-purple-700 font-semibold underline"
          onClick={() => {
            if (onOpenSpeakerSignup) {
              onOpenSpeakerSignup()
            }
          }}
        >
          Start the speaker application
        </button>
      </p>
    </div>
  )
}

