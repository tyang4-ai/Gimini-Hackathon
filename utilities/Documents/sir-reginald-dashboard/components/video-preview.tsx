"use client"

import { useRef, useEffect, useState } from "react"
import { Shield, Wrench, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Mode } from "@/app/page"

interface VideoPreviewProps {
  mode: Mode
  isConnected: boolean
  onTriggerAlert: () => void
}

export function VideoPreview({ mode, isConnected, onTriggerAlert }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasVideo, setHasVideo] = useState(false)
  const [highlightRegion, setHighlightRegion] = useState<{
    x: number
    y: number
    width: number
    height: number
    color: string
    label: string
  } | null>(null)

  useEffect(() => {
    async function setupVideo() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setHasVideo(true)
        }
      } catch (err) {
        console.log("[v0] Camera access denied or unavailable")
        setHasVideo(false)
      }
    }

    if (isConnected) {
      setupVideo()
    }

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [isConnected])

  // Demo: Show highlight region on hover areas
  const showHandsRegion = () => {
    setHighlightRegion({
      x: 20,
      y: 60,
      width: 40,
      height: 30,
      color: "orange",
      label: "HANDS AREA",
    })
    setTimeout(() => setHighlightRegion(null), 3000)
  }

  const borderColor = mode === "safety" ? "border-safe" : "border-primary"

  return (
    <div className="relative">
      <div className={`relative aspect-[4/3] bg-surface rounded-lg border-2 ${borderColor} overflow-hidden`}>
        {/* Video Feed */}
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

        {/* Fallback when no video */}
        {!hasVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface">
            <div className="text-center text-muted-foreground">
              <div className="text-4xl mb-2">🎩</div>
              <p>Camera feed will appear here</p>
              <p className="text-sm mt-1">Grant camera access to begin</p>
            </div>
          </div>
        )}

        {/* Mode Badge - Top Left */}
        <div className="absolute top-3 left-3">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium ${
              mode === "safety"
                ? "bg-safe/20 text-safe border border-safe/30"
                : "bg-primary/20 text-primary border border-primary/30"
            }`}
          >
            {mode === "safety" ? (
              <>
                <Shield className="w-4 h-4" />
                SAFETY MODE
              </>
            ) : (
              <>
                <Wrench className="w-4 h-4" />
                TROUBLESHOOT
              </>
            )}
          </div>
        </div>

        {/* Recording Indicator - Top Right */}
        {isConnected && (
          <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 bg-black/60 rounded text-sm">
            <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
            <span className="text-white/90">SIR REGINALD WATCHING</span>
          </div>
        )}

        {/* Visual Highlight Region */}
        {highlightRegion && (
          <div
            className="absolute transition-all duration-300"
            style={{
              left: `${highlightRegion.x}%`,
              top: `${highlightRegion.y}%`,
              width: `${highlightRegion.width}%`,
              height: `${highlightRegion.height}%`,
            }}
          >
            <div
              className={`w-full h-full border-2 rounded animate-pulse-border ${
                highlightRegion.color === "orange"
                  ? "border-orange-500 bg-orange-500/20"
                  : highlightRegion.color === "teal"
                    ? "border-teal-500 bg-teal-500/20"
                    : "border-safe bg-safe/20"
              }`}
            >
              <span className="absolute -top-6 left-0 text-xs font-medium px-2 py-0.5 rounded bg-black/80 text-white">
                {highlightRegion.label}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Demo Controls */}
      <div className="mt-3 flex gap-2">
        <Button variant="outline" size="sm" onClick={showHandsRegion} className="text-xs bg-transparent">
          Demo: Highlight Hands
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onTriggerAlert}
          className="text-xs text-warning border-warning/50 hover:bg-warning/10 bg-transparent"
        >
          <AlertTriangle className="w-3 h-3 mr-1" />
          Demo: Safety Alert
        </Button>
      </div>
    </div>
  )
}
