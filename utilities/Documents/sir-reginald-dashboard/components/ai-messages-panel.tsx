"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import type { Message } from "@/app/page"

interface AIMessagesPanelProps {
  messages: Message[]
}

export function AIMessagesPanel({ messages }: AIMessagesPanelProps) {
  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return "just now"
    if (minutes < 60) return `${minutes}m ago`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`

    return date.toLocaleDateString()
  }

  return (
    <div className="bg-surface rounded-lg border border-border h-full">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold flex items-center gap-2">
          <span className="text-xl">🎩</span>
          AI Messages
        </h2>
      </div>

      <ScrollArea className="h-[400px] lg:h-[calc(100vh-320px)]">
        <div className="p-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded-lg border ${
                message.type === "danger"
                  ? "bg-danger/10 border-danger/30"
                  : message.type === "warning"
                    ? "bg-warning/10 border-warning/30"
                    : "bg-surface-light border-border"
              }`}
            >
              <div className="flex gap-2">
                <span className="text-lg shrink-0">🎩</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed">"{message.text}"</p>
                  <p className="text-xs text-text-muted mt-2 text-right">{formatTimestamp(message.timestamp)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
