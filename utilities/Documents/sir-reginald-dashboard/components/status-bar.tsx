"use client"

import { Mic, MicOff, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ConnectionStatus } from "@/app/page"

interface StatusBarProps {
  connectionStatus: ConnectionStatus
  isMuted: boolean
  sessionTime: number
  onToggleMute: () => void
  onRetry: () => void
}

export function StatusBar({ connectionStatus, isMuted, sessionTime, onToggleMute, onRetry }: StatusBarProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getConnectionIndicator = () => {
    switch (connectionStatus) {
      case "connected":
        return (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-safe animate-pulse" />
            <span className="text-sm">Connected to Sir Reginald</span>
          </div>
        )
      case "connecting":
        return (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
            <span className="text-sm text-warning">Connecting...</span>
          </div>
        )
      case "reconnecting":
        return (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-sm text-orange-500">Reconnecting...</span>
          </div>
        )
      case "disconnected":
        return (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-danger" />
            <span className="text-sm text-danger">Disconnected</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRetry}
              className="h-6 px-2 text-xs text-danger hover:text-danger hover:bg-danger/10"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Retry
            </Button>
          </div>
        )
    }
  }

  return (
    <header className="h-12 bg-surface border-b border-border px-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        {getConnectionIndicator()}

        <div className="h-4 w-px bg-border" />

        <button onClick={onToggleMute} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          {isMuted ? (
            <>
              <MicOff className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Muted</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 text-safe" />
              <span className="text-sm">Listening</span>
            </>
          )}
        </button>
      </div>

      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="text-sm">Session:</span>
        <span className="text-sm font-medium text-foreground font-mono">{formatTime(sessionTime)}</span>
      </div>
    </header>
  )
}
