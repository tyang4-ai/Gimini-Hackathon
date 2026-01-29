"use client"

import { useEffect } from "react"
import { AlertTriangle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SafetyAlertProps {
  isOpen: boolean
  type: "warning" | "danger"
  message: string
  onDismiss: () => void
}

export function SafetyAlert({ isOpen, type, message, onDismiss }: SafetyAlertProps) {
  // Auto-dismiss after 10 seconds
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onDismiss, 10000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onDismiss])

  // Voice dismiss (keyboard shortcut for demo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && (e.key === "Enter" || e.key === "Escape")) {
        onDismiss()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onDismiss])

  if (!isOpen) return null

  const borderColor = type === "danger" ? "border-danger" : "border-warning"
  const bgColor = type === "danger" ? "bg-danger/10" : "bg-warning/10"
  const iconColor = type === "danger" ? "text-danger" : "text-warning"

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className={`max-w-lg w-full ${bgColor} border-2 ${borderColor} rounded-lg p-6 animate-pulse-border`}>
        <div className="flex items-start gap-4">
          {type === "danger" ? (
            <XCircle className={`w-8 h-8 ${iconColor} shrink-0`} />
          ) : (
            <AlertTriangle className={`w-8 h-8 ${iconColor} shrink-0`} />
          )}

          <div className="flex-1">
            <h3 className={`text-lg font-bold ${iconColor} mb-3`}>
              {type === "danger" ? "⚠️ SAFETY ALERT" : "⚠️ SAFETY NOTICE"}
            </h3>

            <p className="text-foreground leading-relaxed mb-6">"{message}"</p>

            <div className="flex flex-col items-center gap-3">
              <Button
                onClick={onDismiss}
                className={`w-full ${
                  type === "danger" ? "bg-danger hover:bg-danger/90" : "bg-warning hover:bg-warning/90 text-black"
                }`}
              >
                Acknowledged
              </Button>

              <p className="text-sm text-muted-foreground">Say "okay" or "got it" to dismiss</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
