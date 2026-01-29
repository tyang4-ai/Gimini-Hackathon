"use client"

import { Shield, Wrench } from "lucide-react"
import type { Mode } from "@/app/page"

interface ModeToggleProps {
  mode: Mode
  onModeChange: (mode: Mode) => void
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="bg-surface rounded-lg border border-border p-2">
      <div className="flex">
        <button
          onClick={() => onModeChange("safety")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded transition-all ${
            mode === "safety"
              ? "bg-safe text-white"
              : "text-muted-foreground hover:text-foreground hover:bg-surface-light"
          }`}
        >
          <Shield className="w-4 h-4" />
          <span className="font-medium">Safety Monitor</span>
        </button>

        <button
          onClick={() => onModeChange("troubleshoot")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded transition-all ${
            mode === "troubleshoot"
              ? "bg-primary text-white"
              : "text-muted-foreground hover:text-foreground hover:bg-surface-light"
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span className="font-medium">Troubleshooter</span>
        </button>
      </div>
    </div>
  )
}
