"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useTranslation } from "@/lib/hooks/useTranslation"
import { authService } from "@/lib/services/authService"
import { Loader2 } from "lucide-react"

interface TermsAcceptanceModalProps {
  open: boolean
  onAccept: () => void
}

export function TermsAcceptanceModal({ open, onAccept }: TermsAcceptanceModalProps) {
  const { t } = useTranslation()
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleAccept = async () => {
    if (!termsAccepted) {
      setError(t('auth.signup.validate.termsRequired'))
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await authService.acceptTerms()
      if (response.success) {
        onAccept()
      } else {
        setError(t('auth.terms.error'))
      }
    } catch (err) {
      console.error("Accept terms error:", err)
      setError(err instanceof Error ? err.message : t('auth.terms.error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#524FD5]">
            {t('auth.terms.modal.title')}
          </DialogTitle>
          <DialogDescription className="text-gray-600 pt-2">
            {t('auth.terms.modal.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700 mb-3">
              {t('auth.terms.modal.content')}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <Checkbox
                id="terms-modal"
                checked={termsAccepted}
                onCheckedChange={(checked) => {
                  setTermsAccepted(checked as boolean)
                  if (checked) {
                    setError("")
                  }
                }}
                className="mt-0.5"
              />
              <label
                htmlFor="terms-modal"
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
            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleAccept}
            disabled={isLoading || !termsAccepted}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('auth.terms.modal.accepting')}
              </>
            ) : (
              t('auth.terms.modal.accept')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

