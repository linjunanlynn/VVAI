import * as React from "react"
import { ChatPromptButton } from "./ChatPromptButton"
import { cn } from "../ui/utils"

export function DockCuiFollowUpStrip({
  prompts,
  sendTexts,
  onSend,
  className,
}: {
  prompts?: string[] | null
  /** 与 `prompts` 等长；缺省时点击发送 `prompts[i]` */
  sendTexts?: string[] | null
  onSend: (text: string) => void
  className?: string
}) {
  const list = Array.isArray(prompts) ? prompts : []
  if (!list.length) return null
  const sends = Array.isArray(sendTexts) ? sendTexts : null
  return (
    <div
      className={cn(
        "flex w-full max-w-full flex-wrap items-start justify-start gap-[var(--space-200)]",
        className
      )}
      role="region"
      aria-label="推荐追问与下一步"
    >
      {list.map((t, i) => (
        <ChatPromptButton
          key={`${i}-${t.slice(0, 24)}`}
          type="button"
          onClick={() => onSend((sends && sends[i] != null ? sends[i] : t) as string)}
        >
          {t}
        </ChatPromptButton>
      ))}
    </div>
  )
}
