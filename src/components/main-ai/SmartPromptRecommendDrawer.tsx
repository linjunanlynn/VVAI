import * as React from "react"
import { cn } from "../ui/utils"
import { Sparkles, X } from "lucide-react"

interface SmartPromptRecommendDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 当前应用展示名（副标题） */
  appLabel?: string
  prompts: readonly string[]
  onPickPrompt: (text: string) => void
}

/**
 * 锚定在底部输入区上方，与 AllAppsDrawer 同宽；展示可一键发给当前应用 Agent 的引导指令
 */
export function SmartPromptRecommendDrawer({
  open,
  onOpenChange,
  appLabel,
  prompts,
  onPickPrompt,
}: SmartPromptRecommendDrawerProps) {
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-[100] bg-transparent transition-opacity duration-300",
          open ? "visible" : "invisible pointer-events-none"
        )}
        onClick={() => onOpenChange(false)}
        aria-hidden={!open}
      />

      <div
        className={cn(
          "pointer-events-none absolute left-0 right-0 z-[101] min-w-0 origin-bottom transition-all duration-[350ms] ease-out",
          "bottom-full mb-[var(--space-200)]",
          open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-2 scale-95 opacity-0"
        )}
      >
        <div
          className={cn(
            "flex w-full min-w-0 flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-bg-secondary shadow-[var(--shadow-md)]",
            open ? "pointer-events-auto" : "pointer-events-none"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex shrink-0 items-center justify-between gap-[var(--space-300)] border-b border-border px-[var(--space-400)] py-[var(--space-300)]">
            <div className="flex min-w-0 items-center gap-[var(--space-200)]">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--blue-alpha-11)] text-primary">
                <Sparkles className="size-4" strokeWidth={1.75} aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] leading-tight text-text">
                  智能指令推荐
                </p>
                {appLabel ? (
                  <p className="mt-[2px] truncate text-[length:var(--font-size-xs)] text-text-tertiary">
                    可直接发给「{appLabel}」助手
                  </p>
                ) : null}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex h-[var(--space-500)] w-[var(--space-500)] shrink-0 items-center justify-center rounded-sm text-text-muted transition-colors hover:bg-[var(--black-alpha-11)] hover:text-text"
              aria-label="关闭"
            >
              <X className="size-4" strokeWidth={1.5} />
            </button>
          </div>

          <div className="max-h-[min(48vh,380px)] min-h-0 overflow-x-hidden overflow-y-auto overscroll-contain px-[var(--space-400)] py-[var(--space-400)] scrollbar-hide">
            {prompts.length === 0 ? (
              <p className="text-center text-[length:var(--font-size-sm)] text-text-secondary py-[var(--space-400)]">
                暂无推荐指令
              </p>
            ) : (
              <div className="flex flex-wrap gap-[var(--space-200)]">
                {prompts.map((text) => (
                  <button
                    key={text}
                    type="button"
                    onClick={() => {
                      onPickPrompt(text)
                      onOpenChange(false)
                    }}
                    className={cn(
                      "max-w-full rounded-full border border-border bg-bg px-[var(--space-300)] py-[var(--space-200)] text-left",
                      "text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] leading-snug text-text transition-colors",
                      "hover:border-primary/35 hover:bg-[var(--blue-alpha-11)] hover:text-primary",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    )}
                  >
                    <span className="break-words [overflow-wrap:anywhere]">{text}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
