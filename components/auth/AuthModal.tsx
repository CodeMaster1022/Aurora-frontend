"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { SignInForm } from "@/components/auth/SignInForm"
import { SignUpForm } from "@/components/auth/SignUpForm"
import { useTranslation } from "@/lib/hooks/useTranslation"

type AuthView = "signin" | "signup"

interface AuthModalProps {
  initialView?: AuthView
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onOpenSpeakerSignup?: () => void
}

export function AuthModal({
  initialView = "signin",
  open: controlledOpen,
  onOpenChange,
  onOpenSpeakerSignup,
}: AuthModalProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const [internalOpen, setInternalOpen] = useState(true)
  const [view, setView] = useState<AuthView>(initialView)
  const isControlled = typeof controlledOpen === "boolean"
  const open = isControlled ? controlledOpen : internalOpen

  useEffect(() => {
    setView(initialView)
  }, [initialView])

  const handleClose = useCallback(() => {
    if (isControlled) {
      onOpenChange?.(false)
    } else {
      setInternalOpen(false)
      router.back()
    }
  }, [isControlled, onOpenChange, router])

  const handleOpenChange = useCallback(
    (value: boolean) => {
      if (isControlled) {
        onOpenChange?.(value)
      } else if (!value) {
        handleClose()
      } else {
        setInternalOpen(true)
      }
    },
    [handleClose, isControlled, onOpenChange],
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-lg p-0 overflow-hidden"
        showCloseButton={false}
      >
        <Tabs
          value={view}
          onValueChange={(value) => setView(value as AuthView)}
          className="flex flex-col"
        >
          <DialogHeader className="flex flex-row items-center justify-between border-b border-border px-6 py-4">
            <TabsList className="grid grid-cols-2 w-full max-w-xs rounded-full bg-muted/50 p-1">
              <TabsTrigger
                value="signin"
                className="rounded-full data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md"
              >
                {t("auth.signin.submit")}
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="rounded-full data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md"
              >
                {t("auth.signup.createAccount")}
              </TabsTrigger>
            </TabsList>
            <button
              type="button"
              onClick={handleClose}
              className="ml-4 rounded-full p-1 text-muted-foreground transition hover:bg-muted"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>
          </DialogHeader>

          <div className="px-6 pb-6 pt-4">
            <TabsContent value="signin">
              <SignInForm
                variant="modal"
                onSwitchView={(next) => setView(next)}
              />
            </TabsContent>
            <TabsContent value="signup">
              <SignUpForm
                variant="modal"
                onSwitchView={(next) => setView(next)}
                onOpenSpeakerSignup={onOpenSpeakerSignup}
              />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

