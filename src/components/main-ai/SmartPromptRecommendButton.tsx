import * as React from "react"
import { Sparkles } from "lucide-react"
import { cn } from "../ui/utils"

interface SmartPromptRecommendButtonProps {
  onClick?: () => void
  /** 抽屉打开时略强调 */
  active?: boolean
  disabled?: boolean
}

/**
 * 应用 Agent 会话底部条最右侧：智能指令推荐入口（区别于「全部应用」九宫格）
 */
export function SmartPromptRecommendButton({
  onClick,
  active = false,
  disabled = false,
}: SmartPromptRecommendButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      title="智能指令推荐"
      aria-label="智能指令推荐"
      aria-expanded={active}
      className={cn(
        "flex h-[var(--space-800)] w-[var(--space-800)] shrink-0 items-center justify-center rounded-full border transition-all",
        "border-primary/30 bg-gradient-to-br from-[var(--blue-alpha-11)] to-bg text-primary shadow-xs",
        "hover:border-primary/45 hover:shadow-sm hover:from-[var(--blue-alpha-12)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        disabled && "pointer-events-none opacity-40",
        active && "ring-2 ring-primary/25 border-primary/50"
      )}
    >
      <Sparkles className="size-[18px]" strokeWidth={1.85} aria-hidden />
    </button>
  )
}
