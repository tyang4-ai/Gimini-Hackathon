"use client"

import { useState, useRef, useEffect } from "react"
import { Check, Circle, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OnboardingScreenProps {
  onBegin: () => void
}

export function OnboardingScreen({ onBegin }: OnboardingScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [permissions, setPermissions] = useState({
    camera: false,
    microphone: false,
    audioTested: false,
  })

  useEffect(() => {
    // Check/request permissions
    async function checkPermissions() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }

        setPermissions((prev) => ({
          ...prev,
          camera: true,
          microphone: true,
        }))
      } catch (err) {
        console.log("[v0] Permission denied:", err)
      }
    }

    checkPermissions()

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

  const testAudio = () => {
    // Play a test sound
    const utterance = new SpeechSynthesisUtterance("Good day! I shall be keeping a watchful eye on your workshop.")
    utterance.rate = 0.9
    utterance.pitch = 0.8
    speechSynthesis.speak(utterance)
    setPermissions((prev) => ({ ...prev, audioTested: true }))
  }

  const canBegin = permissions.camera && permissions.microphone

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎩</div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Sir Reginald Makesworth III</h1>
          <p className="text-muted-foreground text-lg">Your Distinguished Workshop Guardian</p>
        </div>

        {/* Camera Preview */}
        <div className="bg-surface rounded-lg border border-border overflow-hidden mb-6">
          <div className="aspect-video relative">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            {!permissions.camera && (
              <div className="absolute inset-0 flex items-center justify-center bg-surface">
                <p className="text-muted-foreground">Awaiting camera access...</p>
              </div>
            )}
          </div>
        </div>

        {/* Permission Checklist */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3">
            {permissions.camera ? (
              <Check className="w-5 h-5 text-safe" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground" />
            )}
            <span className={permissions.camera ? "text-foreground" : "text-muted-foreground"}>
              Camera access granted
            </span>
          </div>

          <div className="flex items-center gap-3">
            {permissions.microphone ? (
              <Check className="w-5 h-5 text-safe" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground" />
            )}
            <span className={permissions.microphone ? "text-foreground" : "text-muted-foreground"}>
              Microphone access granted
            </span>
          </div>

          <div className="flex items-center gap-3">
            {permissions.audioTested ? (
              <Check className="w-5 h-5 text-safe" />
            ) : (
              <button onClick={testAudio} className="flex items-center gap-2 text-primary hover:underline">
                <Circle className="w-5 h-5" />
                <span>Test audio output</span>
                <Volume2 className="w-4 h-4" />
              </button>
            )}
            {permissions.audioTested && <span className="text-foreground">Audio output tested</span>}
          </div>
        </div>

        {/* Begin Button */}
        <Button
          onClick={onBegin}
          disabled={!canBegin}
          className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg"
        >
          Begin Session
        </Button>

        {/* Welcome Message */}
        <div className="mt-6 p-4 bg-surface rounded-lg border border-border">
          <p className="text-center text-muted-foreground italic">
            "Good day! I shall be keeping a watchful eye on your workshop. Do carry on with your excellent work."
          </p>
        </div>
      </div>
    </div>
  )
}
