"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux"
import { loginUser, registerUser } from "@/lib/store/authSlice"
import { Header } from "@/components/header"
import { useTranslation } from "@/lib/hooks/useTranslation"

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function StudentAuthPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { error: authError, isLoading: authLoading } = useAppSelector((state) => state.auth)
  const { t } = useTranslation()

  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [showPassword, setShowPassword] = useState(false)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [validationErrors, setValidationErrors] = useState({ email: "", password: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localError, setLocalError] = useState("")

  const [fullName, setFullName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [registerErrors, setRegisterErrors] = useState({ fullName: "", email: "", password: "", confirmPassword: "" })
  const [registerSubmitError, setRegisterSubmitError] = useState("")

  const isLoading = isSubmitting || authLoading
  const displayError = activeTab === "login" ? localError || authError || "" : ""

  const validateLoginEmail = (value: string) => {
    if (!value.trim()) return t("auth.validation.emailRequired")
    if (!emailRegex.test(value)) return t("auth.validation.emailInvalid")
    return ""
  }

  const validateLoginPassword = (value: string) => {
    if (!value.trim()) return t("auth.validation.passwordRequired")
    return ""
  }

  const handleLoginBlur = (field: "email" | "password", value: string) => {
    setValidationErrors((prev) => ({
      ...prev,
      [field]: field === "email" ? validateLoginEmail(value) : validateLoginPassword(value),
    }))
  }

  const handleLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLocalError("")

    const emailError = validateLoginEmail(email)
    const passwordError = validateLoginPassword(password)
    setValidationErrors({ email: emailError, password: passwordError })

    if (emailError || passwordError) {
      return
    }

    setIsSubmitting(true)
    try {
      const result = await dispatch(loginUser({ email, password }))

      if (loginUser.fulfilled.match(result)) {
        const userRole = result.payload.user?.role
        if (userRole === "learner") {
          router.push("/learners/profile")
        } else if (userRole === "speaker") {
          router.push("/speakers/profile")
        } else if (userRole === "admin") {
          router.push("/admin")
        } else {
          router.push("/")
        }
      } else if (loginUser.rejected.match(result)) {
        setLocalError((result.payload as string) || t("auth.errors.loginFailed"))
      }
    } catch (error) {
      console.error("Login error", error)
      setLocalError(t("auth.errors.loginUnknown"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRegisterSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const errors = {
      fullName: fullName.trim() ? "" : t("auth.validation.fullNameRequired"),
      email: registerEmail.trim()
        ? emailRegex.test(registerEmail)
          ? ""
          : t("auth.validation.emailInvalid")
        : t("auth.validation.emailRequired"),
      password: registerPassword.length >= 8 ? "" : t("auth.signup.validate.passwordMin"),
      confirmPassword: confirmPassword.trim()
        ? confirmPassword === registerPassword
          ? ""
          : t("auth.validation.passwordsDoNotMatch")
        : t("auth.validation.confirmPasswordRequired"),
    }

    setRegisterErrors(errors)
    setRegisterSubmitError("")

    if (Object.values(errors).every((error) => error === "")) {
      const [firstName = "", ...rest] = fullName.trim().split(" ")
      const lastName = rest.join(" ") || firstName

      setIsSubmitting(true)
      try {
        const result = await dispatch(
          registerUser({
            firstname: firstName,
            lastname: lastName,
            email: registerEmail,
            password: registerPassword,
            confirmPassword: confirmPassword,
            role: "learner",
            termsAccepted: true,
            privacyAccepted: true,
          })
        )

        if (registerUser.fulfilled.match(result)) {
          router.push("/learners/profile")
        } else if (registerUser.rejected.match(result)) {
          setRegisterSubmitError((result.payload as string) || t("auth.errors.registerFailed"))
        }
      } catch (error) {
        console.error("Register error", error)
        setRegisterSubmitError(error instanceof Error ? error.message : t("auth.errors.registerFailed"))
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleTabChange = (tab: "login" | "register") => {
    setActiveTab(tab)
    setLocalError("")
    setValidationErrors({ email: "", password: "" })
    setRegisterSubmitError("")
    if (tab === "register") {
      setFullName("")
      setRegisterEmail("")
      setRegisterPassword("")
      setConfirmPassword("")
      setRegisterErrors({ fullName: "", email: "", password: "", confirmPassword: "" })
    }
  }

  return (
    <div className="w-full">
      <Header/>
      <div className="px-4 pt-6 sm:pt-10 sm:pb-10">
         <div className="flex w-full flex-col justify-center px-6 py-10 sm:px-12 lg:w-1/2 mx-auto">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 space-y-2 text-center">
              <h1 className="text-3xl font-bold text-foreground">{t("auth.student.title")}</h1>
              <p className="text-sm text-muted-foreground">{t("auth.student.subtitle")}</p>
            </div>

            <div className="mb-8 flex items-center overflow-hidden rounded-full border border-border/70 bg-muted/50 p-1 text-sm font-medium text-muted-foreground">
              <button
                type="button"
                onClick={() => handleTabChange("login")}
                className={`flex-1 rounded-full px-4 py-2 transition ${
                  activeTab === "login" ? "bg-background text-foreground shadow-sm" : "hover:text-foreground"
                }`}
              >
                {t("auth.signup.login")}
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("register")}
                className={`flex-1 rounded-full px-4 py-2 transition ${
                  activeTab === "register" ? "bg-background text-foreground shadow-sm" : "hover:text-foreground"
                }`}
              >
                {t("auth.signup.createAccount")}
              </button>
            </div>

            {displayError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {displayError}
              </div>
            )}

            {activeTab === "register" && registerSubmitError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {registerSubmitError}
              </div>
            )}

            {activeTab === "login" ? (
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">{t("auth.signup.email")}</label>
                  <Input
                    type="email"
                    placeholder={t("auth.common.emailPlaceholder")}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    onBlur={(event) => handleLoginBlur("email", event.target.value)}
                    className={`h-10 rounded-lg border border-border/70 bg-background text-base ${
                      validationErrors.email ? "border-red-500 focus-visible:border-red-500" : "focus-visible:border-primary"
                    }`}
                  />
                  {validationErrors.email && <p className="text-xs text-red-500">{validationErrors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">{t("auth.signup.password")}</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={t("auth.common.passwordPlaceholder")}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      onBlur={(event) => handleLoginBlur("password", event.target.value)}
                      className={`h-10 rounded-lg border border-border/70 bg-background pr-12 text-base ${
                        validationErrors.password ? "border-red-500 focus-visible:border-red-500" : "focus-visible:border-primary"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {validationErrors.password && <p className="text-xs text-red-500">{validationErrors.password}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-10 w-full rounded-lg bg-gradient-to-r from-[#6c3bd5] to-[#9148f2] text-base font-semibold text-white shadow-lg shadow-primary/30 transition hover:from-[#5b2bd8] hover:to-[#7f3ef0] disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t("auth.student.login.submitting")}
                    </>
                  ) : (
                    t("auth.signin.submit")
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">{t("auth.common.fullName")}</label>
                  <Input
                    type="text"
                    placeholder={t("auth.common.fullNamePlaceholder")}
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className={`h-10 rounded-lg border border-border/70 bg-background text-base ${
                      registerErrors.fullName ? "border-red-500 focus-visible:border-red-500" : "focus-visible:border-primary"
                    }`}
                  />
                  {registerErrors.fullName && <p className="text-xs text-red-500">{registerErrors.fullName}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">{t("auth.signup.email")}</label>
                  <Input
                    type="email"
                    placeholder={t("auth.common.emailPlaceholder")}
                    value={registerEmail}
                    onChange={(event) => setRegisterEmail(event.target.value)}
                    className={`h-10 rounded-lg border border-border/70 bg-background text-base ${
                      registerErrors.email ? "border-red-500 focus-visible:border-red-500" : "focus-visible:border-primary"
                    }`}
                  />
                  {registerErrors.email && <p className="text-xs text-red-500">{registerErrors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">{t("auth.signup.password")}</label>
                  <Input
                    type="password"
                    placeholder={t("auth.common.passwordCreatePlaceholder")}
                    value={registerPassword}
                    onChange={(event) => {
                      setRegisterPassword(event.target.value)
                      // Clear confirm password error if passwords now match
                      if (confirmPassword && registerErrors.confirmPassword) {
                        setRegisterErrors((prev) => ({
                          ...prev,
                          confirmPassword: event.target.value === confirmPassword
                            ? ""
                            : t("auth.validation.passwordsDoNotMatch"),
                        }))
                      }
                    }}
                    className={`h-10 rounded-lg border border-border/70 bg-background text-base ${
                      registerErrors.password ? "border-red-500 focus-visible:border-red-500" : "focus-visible:border-primary"
                    }`}
                  />
                  {registerErrors.password && <p className="text-xs text-red-500">{registerErrors.password}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">{t("auth.common.confirmPassword")}</label>
                  <Input
                    type="password"
                    placeholder={t("auth.common.confirmPasswordPlaceholder")}
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value)
                      if (registerErrors.confirmPassword) {
                        setRegisterErrors((prev) => ({
                          ...prev,
                          confirmPassword: event.target.value.trim()
                            ? event.target.value === registerPassword
                              ? ""
                              : t("auth.validation.passwordsDoNotMatch")
                            : t("auth.validation.confirmPasswordRequired"),
                        }))
                      }
                    }}
                    onBlur={(event) => {
                      setRegisterErrors((prev) => ({
                        ...prev,
                        confirmPassword: event.target.value.trim()
                          ? event.target.value === registerPassword
                            ? ""
                            : t("auth.validation.passwordsDoNotMatch")
                          : t("auth.validation.confirmPasswordRequired"),
                      }))
                    }}
                    className={`h-10 rounded-lg border border-border/70 bg-background text-base ${
                      registerErrors.confirmPassword ? "border-red-500 focus-visible:border-red-500" : "focus-visible:border-primary"
                    }`}
                  />
                  {registerErrors.confirmPassword && <p className="text-xs text-red-500">{registerErrors.confirmPassword}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-10 w-full rounded-lg bg-gradient-to-r from-[#6c3bd5] to-[#9148f2] text-base font-semibold text-white shadow-lg shadow-primary/30 transition hover:from-[#5b2bd8] hover:to-[#7f3ef0] disabled:opacity-60"
                >
                  {t("auth.student.register.submit")}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

