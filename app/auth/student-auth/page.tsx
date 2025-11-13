"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux"
import { loginUser } from "@/lib/store/authSlice"
import studentImage from "@/public/image/student.png"

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function StudentAuthPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { error: authError, isLoading: authLoading } = useAppSelector((state) => state.auth)

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
  const [registerErrors, setRegisterErrors] = useState({ fullName: "", email: "", password: "" })

  const isLoading = isSubmitting || authLoading
  const displayError = activeTab === "login" ? localError || authError || "" : ""

  const validateLoginEmail = (value: string) => {
    if (!value.trim()) return "El correo es obligatorio"
    if (!emailRegex.test(value)) return "Introduce un correo válido"
    return ""
  }

  const validateLoginPassword = (value: string) => {
    if (!value.trim()) return "La contraseña es obligatoria"
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
        } else {
          router.push("/speakers/profile")
        }
      } else if (loginUser.rejected.match(result)) {
        setLocalError((result.payload as string) || "No pudimos iniciar sesión")
      }
    } catch (error) {
      console.error("Login error", error)
      setLocalError("Ocurrió un problema al iniciar sesión")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRegisterSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const errors = {
      fullName: fullName.trim() ? "" : "El nombre es obligatorio",
      email: registerEmail.trim()
        ? emailRegex.test(registerEmail)
          ? ""
          : "Introduce un correo válido"
        : "El correo es obligatorio",
      password: registerPassword.length >= 6 ? "" : "Mínimo 6 caracteres",
    }

    setRegisterErrors(errors)

    if (Object.values(errors).every((error) => error === "")) {
      router.push("/")
    }
  }

  const handleTabChange = (tab: "login" | "register") => {
    setActiveTab(tab)
    setLocalError("")
    setValidationErrors({ email: "", password: "" })
  }

  return (
    <div className="w-full px-4 py-10">
         <div className="flex w-full flex-col justify-center px-6 py-10 sm:px-12 lg:w-1/2 mx-auto">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 space-y-2 text-center">
              <h1 className="text-3xl font-bold text-foreground">Estudiante</h1>
              <p className="text-sm text-muted-foreground">Inicia sesión o crea tu cuenta</p>
            </div>

            <div className="mb-8 flex items-center overflow-hidden rounded-full border border-border/70 bg-muted/50 p-1 text-sm font-medium text-muted-foreground">
              <button
                type="button"
                onClick={() => handleTabChange("login")}
                className={`flex-1 rounded-full px-4 py-2 transition ${
                  activeTab === "login" ? "bg-background text-foreground shadow-sm" : "hover:text-foreground"
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("register")}
                className={`flex-1 rounded-full px-4 py-2 transition ${
                  activeTab === "register" ? "bg-background text-foreground shadow-sm" : "hover:text-foreground"
                }`}
              >
                Crear Cuenta
              </button>
            </div>

            {displayError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {displayError}
              </div>
            )}

            {activeTab === "login" ? (
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Correo electrónico</label>
                  <Input
                    type="email"
                    placeholder="Ingresa tu correo electrónico"
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
                  <label className="block text-sm font-medium text-foreground">Contraseña</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingresa tu contraseña"
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
                      Iniciando sesión...
                    </>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Nombre completo</label>
                  <Input
                    type="text"
                    placeholder="Ingresa tu nombre completo"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className={`h-10 rounded-lg border border-border/70 bg-background text-base ${
                      registerErrors.fullName ? "border-red-500 focus-visible:border-red-500" : "focus-visible:border-primary"
                    }`}
                  />
                  {registerErrors.fullName && <p className="text-xs text-red-500">{registerErrors.fullName}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Correo electrónico</label>
                  <Input
                    type="email"
                    placeholder="Ingresa tu correo electrónico"
                    value={registerEmail}
                    onChange={(event) => setRegisterEmail(event.target.value)}
                    className={`h-10 rounded-lg border border-border/70 bg-background text-base ${
                      registerErrors.email ? "border-red-500 focus-visible:border-red-500" : "focus-visible:border-primary"
                    }`}
                  />
                  {registerErrors.email && <p className="text-xs text-red-500">{registerErrors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Contraseña</label>
                  <Input
                    type="password"
                    placeholder="Crea una contraseña"
                    value={registerPassword}
                    onChange={(event) => setRegisterPassword(event.target.value)}
                    className={`h-10 rounded-lg border border-border/70 bg-background text-base ${
                      registerErrors.password ? "border-red-500 focus-visible:border-red-500" : "focus-visible:border-primary"
                    }`}
                  />
                  {registerErrors.password && <p className="text-xs text-red-500">{registerErrors.password}</p>}
                </div>

                <Button className="h-10 w-full rounded-lg bg-gradient-to-r from-[#6c3bd5] to-[#9148f2] text-base font-semibold text-white shadow-lg shadow-primary/30 transition hover:from-[#5b2bd8] hover:to-[#7f3ef0]">
                  Continuar
                </Button>
              </form>
            )}
          </div>
        </div>
    </div>
  )
}

