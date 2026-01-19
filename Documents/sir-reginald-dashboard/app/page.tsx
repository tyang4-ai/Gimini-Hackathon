"use client"

import { useState } from "react"
import Link from "next/link"
import { StatusBar } from "@/components/status-bar"
import { VideoPreview } from "@/components/video-preview"
import { AIMessagesPanel } from "@/components/ai-messages-panel"
import { ModeToggle } from "@/components/mode-toggle"
import { VoiceActivityIndicator } from "@/components/voice-activity-indicator"
import { SafetyAlert } from "@/components/safety-alert"
import { OnboardingScreen } from "@/components/onboarding-screen"
import { DegradationBanner } from "@/components/degradation-banner"
import { BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

export type ConnectionStatus = "connected" | "connecting" | "reconnecting" | "disconnected"
export type Mode = "safety" | "troubleshoot"
export type VoiceState = "idle" | "listening" | "ai-speaking"

export interface Message {
  id: string
  text: string
  timestamp: Date
  type: "info" | "warning" | "danger"
}

export default function Home() {
  const [isOnboarding, setIsOnboarding] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connected")
  const [mode, setMode] = useState<Mode>("safety")
  const [voiceState, setVoiceState] = useState<VoiceState>("idle")
  const [sessionTime, setSessionTime] = useState(154) // 2:34 in seconds
  const [isMuted, setIsMuted] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [isDegraded, setIsDegraded] = useState(false)

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Splendid! Safety glasses on. Do carry on.",
      timestamp: new Date(),
      type: "info",
    },
    {
      id: "2",
      text: "I notice your hand is approaching the blade area. Do exercise caution, if you would.",
      timestamp: new Date(Date.now() - 120000),
      type: "warning",
    },
    {
      id: "3",
      text: "Excellent form on that cut, if I may say so myself.",
      timestamp: new Date(Date.now() - 300000),
      type: "info",
    },
  ])

  const [currentAlert, setCurrentAlert] = useState({
    type: "warning" as "warning" | "danger",
    message:
      "Pardon the interruption, but I don't see safety spectacles, and that laser is rather unforgiving of such oversights.",
  })

  const handleBeginSession = () => {
    setIsOnboarding(false)
    setConnectionStatus("connecting")
    setTimeout(() => setConnectionStatus("connected"), 1500)
  }

  const handleDismissAlert = () => {
    setShowAlert(false)
  }

  const handleRetryConnection = () => {
    setConnectionStatus("reconnecting")
    setTimeout(() => setConnectionStatus("connected"), 2000)
  }

  // Demo functions for interactivity
  const triggerSafetyAlert = () => {
    setCurrentAlert({
      type: "danger",
      message:
        "Pardon the interruption, but I don't see safety spectacles, and that laser is rather unforgiving of such oversights.",
    })
    setShowAlert(true)
  }

  const simulateAISpeaking = () => {
    setVoiceState("ai-speaking")
    const newMessage: Message = {
      id: Date.now().toString(),
      text: "I say, that's rather impressive craftsmanship you're demonstrating there.",
      timestamp: new Date(),
      type: "info",
    }
    setMessages((prev) => [newMessage, ...prev])
    setTimeout(() => setVoiceState("idle"), 3000)
  }

  const simulateListening = () => {
    setVoiceState("listening")
    setTimeout(() => setVoiceState("idle"), 3000)
  }

  if (isOnboarding) {
    return <OnboardingScreen onBegin={handleBeginSession} />
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <StatusBar
        connectionStatus={connectionStatus}
        isMuted={isMuted}
        sessionTime={sessionTime}
        onToggleMute={() => setIsMuted(!isMuted)}
        onRetry={handleRetryConnection}
      />

      {isDegraded && <DegradationBanner />}

      <main className="flex-1 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-end mb-4">
            <Link href="/analytics">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <BarChart3 className="h-4 w-4" />
                Safety Ledger
              </Button>
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Main Video Area */}
            <div className="flex-1 space-y-4">
              <VideoPreview
                mode={mode}
                isConnected={connectionStatus === "connected"}
                onTriggerAlert={triggerSafetyAlert}
              />

              <VoiceActivityIndicator
                state={voiceState}
                onSimulateAI={simulateAISpeaking}
                onSimulateListen={simulateListening}
              />

              <ModeToggle mode={mode} onModeChange={setMode} />
            </div>

            {/* AI Messages Sidebar */}
            <div className="lg:w-80">
              <AIMessagesPanel messages={messages} />
            </div>
          </div>
        </div>
      </main>

      {/* Safety Alert Modal */}
      <SafetyAlert
        isOpen={showAlert}
        type={currentAlert.type}
        message={currentAlert.message}
        onDismiss={handleDismissAlert}
      />
    </div>
  )
}
