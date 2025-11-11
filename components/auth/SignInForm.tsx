"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux"
import { loginUser, setUser } from "@/lib/store/authSlice"
import { useTranslation } from "@/lib/hooks/useTranslation"

type AuthView = "signin" | "signup"

interface SignInFormProps {
  variant?: "page" | "modal"
  onSwitchView?: (view: AuthView) => void
}

export function SignInForm({
  variant = "page",
  onSwitchView,
}: SignInFormProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { error: authError, isLoading: authLoading } = useAppSelector(
    (state) => state.auth,
  )

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
  })

  const isLoadingState = isLoading || authLoading
  const displayError = error || authError

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
    return ""
  }

  const handleBlur = (field: "email" | "password", value: string) => {
    const validators = {
      email: validateEmail,
      password: validatePassword,
    } satisfies Record<typeof field, (val: string) => string>

    setValidationErrors((prev) => ({
      ...prev,
      [field]: validators[field](value),
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setError("")
    setValidationErrors({ email: "", password: "" })

    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)

    setValidationErrors({
      email: emailError,
      password: passwordError,
    })

    if (emailError || passwordError) {
      setIsLoading(false)
      return
    }

    try {
      const result = await dispatch(loginUser({ email, password }))

      if (loginUser.fulfilled.match(result)) {
        const userRole = result.payload.user?.role

        if (userRole === "learner") {
          router.push("/learners/dashboard")
        } else if (userRole === "speaker") {
          router.push("/speakers/dashboard")
        } else {
          router.push("/speakers/dashboard")
        }
      } else if (loginUser.rejected.match(result)) {
        setError((result.payload as string) || t("auth.signin.submit"))
      }
    } catch (err) {
      console.error("Login error:", err)
      setError(t("auth.signin.submit"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`w-full max-w-md ${variant === "modal" ? "mx-auto" : ""}`}>
      <h2 className="text-3xl font-bold text-center text-primary dark:text-white mb-8">
        {t("auth.signin.submit")}
      </h2>

      {displayError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{displayError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            type="email"
            placeholder={t("auth.signin.email")}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onBlur={(event) => handleBlur("email", event.target.value)}
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

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder={t("auth.signin.password")}
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

        <Button
          type="submit"
          disabled={isLoadingState}
          className="w-full py-6 text-lg font-semibold rounded-lg disabled:opacity-50"
          style={{
            background: "linear-gradient(to right, #9333ea, #d946ef)",
          }}
        >
          {isLoadingState ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {t("auth.signin.loading")}
            </>
          ) : (
            t("auth.signin.submit")
          )}
        </Button>
      </form>

      <p className="text-center mt-6 text-gray-600 text-sm">
        {t("auth.signin.noAccount")}{" "}
        <Link
          href="/auth/signup"
          scroll={false}
          className="text-purple-600 hover:text-purple-700 font-semibold"
          onClick={(event) => {
            if (onSwitchView) {
              event.preventDefault()
              onSwitchView("signup")
            }
          }}
        >
          {t("auth.signin.signup")}
        </Link>
      </p>
    </div>
  )
}

