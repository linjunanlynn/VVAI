import * as React from "react"
import { cn } from "../ui/utils"

/** 主 VVAI 顶栏「新建对话」：圆角气泡轮廓 + 右上角缺口内加号；尺寸与左侧 Panel 收展等控件内图标一致（如 h-[18px] w-[18px]） */
export function NewSessionBubblePlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("shrink-0", className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <g
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 20 4 22.5V20H5c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h7" />
        <path d="M15 5h4c1.1 0 2 .9 2 2v11c0 1.1-.9 2-2 2h-9l-3.5 3.5V20H6" />
        <path d="M15 3.75v2.5M13.5 5h3" />
      </g>
    </svg>
  )
}
