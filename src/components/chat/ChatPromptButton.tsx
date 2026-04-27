import * as React from "react"
import { cn } from "../ui/utils"

export interface ChatPromptButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function ChatPromptButton({ className, children, type = "button", ...props }: ChatPromptButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex max-w-[min(100%,22rem)] shrink-0 items-center justify-center gap-[var(--space-100)]",
        "rounded-full border border-border bg-card px-[var(--space-300)] py-[var(--space-150)] shadow-sm",
        "text-left text-[length:var(--font-size-xs)] font-[var(--font-weight-regular)] leading-snug text-primary break-words",
        "transition-[color,background-color,box-shadow,border-color] hover:border-border hover:bg-bg-secondary/50 hover:text-primary-hover hover:shadow",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]/35",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
