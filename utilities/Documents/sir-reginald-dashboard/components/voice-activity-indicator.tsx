"use client"

import { Mic, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { VoiceState } from "@/app/page"

interface VoiceActivityIndicatorProps {
  state: VoiceState
  onSimulateAI: () => void
  onSimulateListen: () => void
}

export function VoiceActivityIndicator({ state, onSimulateAI, onSimulateListen }: VoiceActivityIndicatorProps) {
  return (
    <div className="space-y-2">
      <div className="bg-surface rounded-lg border border-border p-3">
        {state === "ai-speaking" && (
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-safe" />
            <div className="flex items-center gap-1">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-safe rounded-full animate-sound-wave"
                  style={{
                    height: "16px",
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
            <span className="text-sm text-safe">Sir Reginald speaking</span>
          </div>
        )}

        {state === "listening" && (
          <div className="flex items-center gap-3">
            <Mic className="w-5 h-5 text-primary animate-pulse" />
            <div className="flex-1 bg-surface-light rounded-full h-2 overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: "60%" }} />
            </div>
            <span className="text-sm text-muted-foreground">Listening...</span>
          </div>
        )}

        {state === "idle" && (
          <div className="flex items-center gap-3">
            <Mic className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Ready</span>
          </div>
        )}
      </div>

      {/* Demo Controls */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onSimulateAI} className="text-xs bg-transparent">
          Demo: AI Speaking
        </Button>
        <Button variant="outline" size="sm" onClick={onSimulateListen} className="text-xs bg-transparent">
          Demo: Listening
        </Button>
      </div>
    </div>
  )
}
