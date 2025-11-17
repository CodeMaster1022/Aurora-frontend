"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Heart, Gift } from "lucide-react"

interface DonationAmountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (amount: number) => void
  isLoading?: boolean
  defaultAmount?: number
}

const PRESET_AMOUNTS = [
  { value: 500, label: "$5" },
  { value: 1000, label: "$10" },
  { value: 2500, label: "$25" },
  { value: 5000, label: "$50" },
  { value: 10000, label: "$100" },
]

const MIN_DONATION = 50 // $0.50 in cents

export function DonationAmountDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
  defaultAmount = 500
}: DonationAmountDialogProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(defaultAmount)
  const [customAmount, setCustomAmount] = useState<string>("")
  const [error, setError] = useState<string>("")

  const handlePresetClick = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount("")
    setError("")
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    setSelectedAmount(null)
    setError("")
  }

  const handleConfirm = () => {
    let amount: number

    if (customAmount.trim()) {
      // Parse custom amount (user enters dollars, we convert to cents)
      const dollars = parseFloat(customAmount.trim())
      if (isNaN(dollars) || dollars <= 0) {
        setError("Please enter a valid amount")
        return
      }
      amount = Math.round(dollars * 100) // Convert to cents
    } else if (selectedAmount) {
      amount = selectedAmount
    } else {
      setError("Please select or enter a donation amount")
      return
    }

    // Validate minimum
    if (amount < MIN_DONATION) {
      setError(`Minimum donation is $${(MIN_DONATION / 100).toFixed(2)}`)
      return
    }

    onConfirm(amount)
  }

  const reset = () => {
    setSelectedAmount(defaultAmount)
    setCustomAmount("")
    setError("")
  }

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false)
      reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Heart className="w-6 h-6 text-pink-500" />
            Donate to Aurora
          </DialogTitle>
          <DialogDescription className="text-center">
            Thank you for supporting Aurora and helping others learn English!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Preset amounts */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Select an amount</Label>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_AMOUNTS.map((preset) => (
                <Button
                  key={preset.value}
                  type="button"
                  variant={selectedAmount === preset.value ? "default" : "outline"}
                  onClick={() => handlePresetClick(preset.value)}
                  disabled={isLoading || customAmount.trim() !== ""}
                  className={`${
                    selectedAmount === preset.value
                      ? "bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
                      : ""
                  }`}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom amount */}
          <div className="space-y-2">
            <Label htmlFor="customAmount" className="text-sm font-medium">
              Or enter a custom amount
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <Input
                id="customAmount"
                type="number"
                min="0.50"
                step="0.01"
                placeholder="0.00"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                disabled={isLoading || selectedAmount !== null}
                className="pl-8"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Minimum donation: ${(MIN_DONATION / 100).toFixed(2)}
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Confirm button */}
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="w-full cursor-pointer bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Gift className="mr-2 h-4 w-4" />
                Continue to Checkout
              </>
            )}
          </Button>

          {/* Cancel button */}
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isLoading}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

