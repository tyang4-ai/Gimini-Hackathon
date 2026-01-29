"use client"

import { Zap } from "lucide-react"

export function DegradationBanner() {
  return (
    <div className="bg-warning/20 border-b border-warning/30 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <Zap className="w-4 h-4 text-warning" />
        <span className="text-sm">
          <span className="font-medium text-warning">Reduced Monitoring</span>
          <span className="text-warning/80 ml-2">"I'm experiencing a touch of delay. Do be extra careful."</span>
        </span>
      </div>
    </div>
  )
}
