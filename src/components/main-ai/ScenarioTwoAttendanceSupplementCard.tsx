import { Clock } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { cn } from "../ui/utils"
import type { ScenarioTwoAttendanceSupplementPayload } from "./scenarioTwoAttendanceSupplementRequest"

type ScenarioTwoAttendanceSupplementCardProps = {
  payload: ScenarioTwoAttendanceSupplementPayload
  onPatch: (next: ScenarioTwoAttendanceSupplementPayload) => void
}

export function ScenarioTwoAttendanceSupplementCard({
  payload,
  onPatch,
}: ScenarioTwoAttendanceSupplementCardProps) {
  const isMakeup = payload.kind === "makeup"
  const title = isMakeup ? "补卡申请" : "请假申请"
  const locked = Boolean(payload.submitted)

  return (
    <div className="w-full overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg shadow-elevation-sm">
      <header className="flex flex-wrap items-center justify-between gap-[var(--space-200)] border-b border-border px-[var(--space-400)] py-[var(--space-300)]">
        <div className="flex min-w-0 items-center gap-[var(--space-200)]">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7C3AED]"
            aria-hidden
          >
            <Clock className="h-[18px] w-[18px] text-white" strokeWidth={2} />
          </div>
          <span className="text-[length:var(--font-size-base)] font-[var(--font-weight-semi-bold)] text-text">
            {title}
          </span>
        </div>
      </header>
      <div className="flex flex-col gap-[var(--space-250)] p-[var(--space-350)]">
        <p className="m-0 text-[length:var(--font-size-sm)] leading-relaxed text-text-secondary">
          {isMakeup
            ? "填写补卡日期与原因，提交后由考勤应用处理（演示界面，与考勤统计卡同风格）。"
            : "填写请假起止与事由，提交后由考勤应用处理（演示界面，与考勤统计卡同风格）。"}
        </p>
        <label className="flex flex-col gap-[var(--space-100)]">
          <span className="text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-text-secondary">
            {isMakeup ? "补卡日期" : "请假日期"}
          </span>
          <Input
            value={payload.date}
            disabled={locked}
            placeholder={isMakeup ? "如 2026-04-20" : "如 2026-04-20 起"}
            onChange={(e) => onPatch({ ...payload, date: e.target.value, submitted: false })}
            className="max-w-md"
          />
        </label>
        <label className="flex flex-col gap-[var(--space-100)]">
          <span className="text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-text-secondary">
            事由说明
          </span>
          <textarea
            value={payload.reasonDraft}
            disabled={locked}
            placeholder="简要说明（演示）"
            rows={3}
            onChange={(e) => onPatch({ ...payload, reasonDraft: e.target.value, submitted: false })}
            className={cn(
              "max-w-md resize-y rounded-[var(--radius-md)] border border-border bg-bg px-[var(--space-250)] py-[var(--space-200)]",
              "text-[length:var(--font-size-sm)] text-text outline-none",
              "focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]/35"
            )}
          />
        </label>
        <div className="flex flex-wrap gap-[var(--space-150)]">
          <Button
            type="button"
            variant="chat-submit"
            disabled={locked}
            onClick={() => onPatch({ ...payload, submitted: true })}
          >
            提交申请（演示）
          </Button>
        </div>
        {locked ? (
          <p className="m-0 text-[length:var(--font-size-xs)] text-text-secondary" role="status">
            已提交（演示）。接入系统后将进入考勤审批流。
          </p>
        ) : null}
      </div>
    </div>
  )
}
