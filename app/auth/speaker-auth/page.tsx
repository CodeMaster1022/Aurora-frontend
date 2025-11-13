"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Eye, EyeOff, Loader2, Upload, ArrowLeft } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux"
import { loginUser, setUser } from "@/lib/store/authSlice"
import speakerHero from "@/public/image/student.png"
import { authService } from "@/lib/services/authService"

const emailRegex = /^[^\s@]+@gmail\.com$/i
const generalEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type RegisterStep = 1 | 2

export default function SpeakerAuthPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { error: authError, isLoading: authLoading } = useAppSelector((state) => state.auth)

  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginErrors, setLoginErrors] = useState({ email: "", password: "" })
  const [localError, setLocalError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [registerStep, setRegisterStep] = useState<RegisterStep>(1)
  const [fullName, setFullName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [city, setCity] = useState("")
  const [bio, setBio] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoName, setPhotoName] = useState("")
  const [registerErrors, setRegisterErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    birthDate: "",
    city: "",
    bio: "",
    photo: "",
  })
  const [registerError, setRegisterError] = useState("")

  const isLoading = isSubmitting || authLoading
  const displayError = activeTab === "login" ? localError || authError || "" : ""

  const validateLoginEmail = (value: string) => {
    if (!value.trim()) return "El correo es obligatorio"
    if (!generalEmailRegex.test(value)) return "Introduce un correo válido"
    return ""
  }

  const validateLoginPassword = (value: string) => {
    if (!value.trim()) return "La contraseña es obligatoria"
    return ""
  }

  const handleLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const emailError = validateLoginEmail(loginEmail)
    const passwordError = validateLoginPassword(loginPassword)
    setLoginErrors({ email: emailError, password: passwordError })
    if (emailError || passwordError) return

    setIsSubmitting(true)
    setLocalError("")
    try {
      const result = await dispatch(loginUser({ email: loginEmail, password: loginPassword }))
      if (loginUser.fulfilled.match(result)) {
        const role = result.payload.user?.role
        if (role === "speaker") {
          router.push("/speakers/profile")
        } else {
          router.push("/learners/profile")
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

  const validateStepOne = () => {
    const errors = {
      fullName: fullName.trim() ? "" : "El nombre es obligatorio",
      email: registerEmail.trim()
        ? emailRegex.test(registerEmail)
          ? ""
          : "Debe ser un correo de Gmail"
        : "El correo es obligatorio",
      password: registerPassword.length >= 6 ? "" : "Mínimo 6 caracteres",
    }
    setRegisterErrors((prev) => ({ ...prev, ...errors }))
    return Object.values(errors).every((error) => error === "")
  }

  const validateStepTwo = () => {
    const errors = {
      birthDate: birthDate ? "" : "La fecha de nacimiento es obligatoria",
      city: city.trim() ? "" : "La ciudad es obligatoria",
      bio: bio.trim() ? "" : "La descripción es obligatoria",
      photo: photo ? "" : "Sube una fotografía",
    }
    setRegisterErrors((prev) => ({ ...prev, ...errors }))
    return Object.values(errors).every((error) => error === "")
  }

  const handleNextStep = () => {
    if (validateStepOne()) {
      setRegisterError("")
      setRegisterStep(2)
    }
  }

  const handleRegisterSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!validateStepTwo()) return

    setIsSubmitting(true)
    setRegisterError("")
    try {
      const [firstName = "", ...rest] = fullName.trim().split(" ")
      const lastName = rest.join(" ") || firstName
      const ageValue = birthDate ? Math.max(18, Math.floor((Date.now() - new Date(birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25))) : undefined
      const meetingPreference = [city, bio].filter(Boolean).join(" | ") || undefined

      const response = await authService.registerSpeaker({
        firstName,
        lastName,
        email: registerEmail,
        password: registerPassword,
        confirmPassword: registerPassword,
        interests: [],
        meetingPreference,
        age: ageValue,
        avatar: photo ?? undefined,
        termsAccepted: true,
        privacyAccepted: true,
      })

      if (response.success && response.data) {
        authService.setToken(response.data.token)
        dispatch(setUser(response.data.user))
        router.push("/speakers/profile")
      }
    } catch (error) {
      console.error("Speaker signup error", error)
      setRegisterError(error instanceof Error ? error.message : "No pudimos completar el registro")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setPhoto(file)
      setPhotoName(file.name)
      setRegisterErrors((prev) => ({ ...prev, photo: "" }))
      setRegisterError("")
    }
  }

  const resetRegisterTab = () => {
    setRegisterStep(1)
    setFullName("")
    setRegisterEmail("")
    setRegisterPassword("")
    setBirthDate("")
    setCity("")
    setBio("")
    setPhoto(null)
    setPhotoName("")
    setRegisterErrors({ fullName: "", email: "", password: "", birthDate: "", city: "", bio: "", photo: "" })
    setRegisterError("")
  }

  const changeTab = (tab: "login" | "register") => {
    setActiveTab(tab)
    setLocalError("")
    setLoginErrors({ email: "", password: "" })
    setRegisterError("")
    if (tab === "register") {
      resetRegisterTab()
    }
  }

  return (
    <div className="w-full px-4 py-6"> 
        <div className="flex w-full flex-col justify-center px-6 py-6 sm:px-12 lg:w-1/2 mx-auto">
         <div className="mx-auto w-full max-w-md">
          <div className="mb-8 space-y-2 text-center">
            <h1 className="text-3xl font-bold text-foreground">Speaker / Orador</h1>
            <p className="text-sm text-muted-foreground">Inicia sesión o crea tu cuenta como orador</p>
          </div>

          <div className="mb-4 flex items-center overflow-hidden rounded-full border border-border/70 bg-muted/50 p-1 text-sm font-medium text-muted-foreground">
            <button
              type="button"
              onClick={() => changeTab("login")}
              className={`flex-1 rounded-full px-4 py-2 transition cursor-pointer ${
                activeTab === "login" ? "bg-card text-foreground shadow-sm" : "hover:text-foreground"
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => changeTab("register")}
              className={`flex-1 rounded-full px-4 py-2 transition ${
                activeTab === "register" ? "bg-card text-foreground shadow-sm" : "hover:text-foreground"
              }`}
            >
              Crear Cuenta
            </button>
          </div>

          {displayError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-400/40 dark:bg-red-950/40 dark:text-red-200">
              {displayError}
            </div>
          )}

          {activeTab === "register" && registerError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-400/40 dark:bg-red-950/40 dark:text-red-200">
              {registerError}
            </div>
          )}

          {activeTab === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Correo electrónico</label>
                <Input
                  type="email"
                  placeholder="Ingresa tu correo"
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                  onBlur={(event) => setLoginErrors((prev) => ({ ...prev, email: validateLoginEmail(event.target.value) }))}
                  className={`h-10 rounded-lg border border-border/70 bg-background text-base ${
                    loginErrors.email ? "border-red-500 focus-visible:border-red-500" : "focus-visible:border-primary"
                  }`}
                />
                {loginErrors.email && <p className="text-xs text-red-500">{loginErrors.email}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Contraseña</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    value={loginPassword}
                    onChange={(event) => setLoginPassword(event.target.value)}
                    onBlur={(event) => setLoginErrors((prev) => ({ ...prev, password: validateLoginPassword(event.target.value) }))}
                    className={`h-10 rounded-lg border border-border/70 bg-background pr-12 text-base ${
                      loginErrors.password ? "border-red-500 focus-visible:border-red-500" : "focus-visible:border-primary"
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
                {loginErrors.password && <p className="text-xs text-red-500">{loginErrors.password}</p>}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="h-10 w-full rounded-lg bg-[#59248F] cursor-pointer text-base font-semibold text-white shadow-lg shadow-primary/30 transition hover:from-[#4d20d3] hover:to-[#7638ec] disabled:opacity-60"
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
            <div className="space-y-8">
              {registerStep === 1 ? (
                <form onSubmit={(event) => { event.preventDefault(); handleNextStep() }} className="space-y-5">
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
                    <label className="block text-sm font-medium text-foreground">Correo electrónico (Gmail)</label>
                    <Input
                      type="email"
                      placeholder="ejemplo@gmail.com"
                      value={registerEmail}
                      onChange={(event) => setRegisterEmail(event.target.value)}
                      className={`h-10 rounded-lg border border-border/70 bg-background text-base ${
                        registerErrors.email ? "border-red-500 focus-visible:border-red-500" : "focus-visible:border-primary"
                      }`}
                    />
                    <p className="text-xs text-muted-foreground">Debe ser una cuenta de Gmail (@gmail.com)</p>
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

                  <Button type="submit" className="h-10 cursor-pointer w-full rounded-lg bg-[#59248F] text-base font-semibold text-white shadow-lg shadow-primary/30 transition hover:from-[#4d20d3] hover:to-[#7638ec]">
                    Continuar
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">Fecha de nacimiento</label>
                      <Input
                        type="date"
                        value={birthDate}
                        onChange={(event) => setBirthDate(event.target.value)}
                        className={`h-10 rounded-lg border border-border/70 bg-background text-base ${
                          registerErrors.birthDate ? "border-red-500 focus-visible:border-red-500" : "focus-visible:border-primary"
                        }`}
                      />
                      {registerErrors.birthDate && <p className="text-xs text-red-500">{registerErrors.birthDate}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground">Ciudad de residencia</label>
                      <Input
                        type="text"
                        placeholder="Ej: Miami, FL"
                        value={city}
                        onChange={(event) => setCity(event.target.value)}
                        className={`h-10 rounded-lg border border-border/70 bg-background text-base ${
                          registerErrors.city ? "border-red-500 focus-visible:border-red-500" : "focus-visible:border-primary"
                        }`}
                      />
                      {registerErrors.city && <p className="text-xs text-red-500">{registerErrors.city}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Descripción breve</label>
                    <Textarea
                      placeholder="Cuéntanos un poco sobre ti..."
                      value={bio}
                      onChange={(event) => setBio(event.target.value)}
                      className={`min-h-[80px] rounded-lg border border-border/70 bg-background text-base ${
                        registerErrors.bio ? "border-red-500 focus-visible:border-red-500" : "focus-visible:border-primary"
                      }`}
                    />
                    {registerErrors.bio && <p className="text-xs text-red-500">{registerErrors.bio}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Fotografía</label>
                    <div className={`flex items-center justify-between rounded-lg border border-dashed border-border/70 bg-muted/40 px-4 py-3 ${
                      registerErrors.photo ? "border-red-500" : ""
                    }`}>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">Subir foto</p>
                        <p className="text-xs text-muted-foreground">
                          JPG o PNG, máximo 5MB.
                        </p>
                        {photoName && <p className="text-xs text-primary">{photoName}</p>}
                      </div>
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20">
                        <Upload className="h-4 w-4" />
                        Seleccionar
                        <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                      </label>
                    </div>
                    {registerErrors.photo && <p className="text-xs text-red-500">{registerErrors.photo}</p>}
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 rounded-lg border-border/70 cursor-pointer"
                      onClick={() => setRegisterStep(1)}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Atrás
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 rounded-lg bg-[#59248F] cursor-pointer text-base font-semibold text-white shadow-lg shadow-primary/30 transition hover:from-[#4d20d3] hover:to-[#7638ec] disabled:opacity-60"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Creando cuenta...
                        </>
                      ) : (
                        "Crear Cuenta"
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* {activeTab === "login" && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              ¿Aún no tienes una cuenta?{" "}
              <button onClick={() => changeTab("register")} className="font-semibold text-primary hover:underline">
                Crea una ahora
              </button>
            </p> */}
          {/* )} */}
        </div>
      </div>
    </div>
  )
}

