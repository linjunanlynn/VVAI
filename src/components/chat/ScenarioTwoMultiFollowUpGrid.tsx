import * as React from "react"
import { cn } from "../ui/utils"

/**
 * 场景二多组织：与考勤工作台卡片下方一致——左可选「补卡/请假」等追问，右为「另一组织」；
 * 仅右侧时整行栅格化右对齐（与 `ScenarioTwoMultiAttendanceFollowUpStrip` 视觉一致）。
 */
export function ScenarioTwoMultiFollowUpGrid({
  left,
  right,
}: {
  left?: React.ReactNode
  right?: React.ReactNode
}) {
  const hasL = left != null
  const hasR = right != null
  if (!hasL && !hasR) return null
  return (
    <div
      className={cn(
        "mt-[var(--space-200)] w-full max-w-full",
        hasL && hasR &&
          "grid grid-cols-1 gap-[var(--space-200)] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start",
        (!hasL || !hasR) && "flex flex-col gap-[var(--space-200)]"
      )}
    >
      {hasL ? <div className="min-w-0">{left}</div> : null}
      {hasR ? (
        <div
          className={cn(
            "flex w-full min-w-0",
            hasL ? "justify-stretch sm:justify-self-end sm:justify-end" : "justify-end"
          )}
        >
          {right}
        </div>
      ) : null}
    </div>
  )
}
