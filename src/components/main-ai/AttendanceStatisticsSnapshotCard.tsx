import { ChevronDown, ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { cn } from "../ui/utils"

/** 与考勤统计页截图一致的指标顺序与文案 */
const ATTENDANCE_STAT_CELLS: readonly { label: string; value: number }[] = [
  { label: "平均工时(时)", value: 0 },
  { label: "迟到(人)", value: 0 },
  { label: "早退(人)", value: 0 },
  { label: "缺卡(人)", value: 0 },
  { label: "旷工(人)", value: 0 },
  { label: "外出(人)", value: 0 },
  { label: "出差(人)", value: 0 },
  { label: "补卡(人)", value: 0 },
  { label: "加班(人)", value: 0 },
  { label: "请假(人)", value: 0 },
]

export function formatAttendanceMonthTitle(monthId: string): string {
  const m = monthId.trim().match(/^(\d{4})-(\d{2})$/)
  if (!m) return monthId
  return `${m[1]}年${Number(m[2])}月`
}

type AttendanceStatisticsSnapshotCardProps = {
  className?: string
  /** 顶栏右侧月份文案，如 `2026年4月` */
  monthTitle: string
  /** 点击左右箭头时（演示）；不传则箭头不响应 */
  onMonthNavigate?: (delta: -1 | 1) => void
}

export function AttendanceStatisticsSnapshotCard({
  className,
  monthTitle,
  onMonthNavigate,
}: AttendanceStatisticsSnapshotCardProps) {
  const firstRow = ATTENDANCE_STAT_CELLS.slice(0, 8)
  const lastRow = ATTENDANCE_STAT_CELLS.slice(8)

  const cellClass =
    "flex flex-col gap-[var(--space-100)] rounded-[var(--radius-md)] border border-border bg-bg px-[var(--space-250)] py-[var(--space-300)]"

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg shadow-elevation-sm",
        className
      )}
    >
      <header className="flex flex-wrap items-center justify-between gap-[var(--space-200)] border-b border-border px-[var(--space-400)] py-[var(--space-300)]">
        <div className="flex min-w-0 items-center gap-[var(--space-200)]">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7C3AED]"
            aria-hidden
          >
            <Clock className="h-[18px] w-[18px] text-white" strokeWidth={2} />
          </div>
          <span className="inline-flex items-center gap-[var(--space-100)] text-[length:var(--font-size-base)] font-[var(--font-weight-semi-bold)] text-text">
            考勤统计
            <ChevronRight className="h-4 w-4 shrink-0 text-text-tertiary" strokeWidth={2} aria-hidden />
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-[var(--space-200)]">
          <span className="text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text">
            {monthTitle}
          </span>
          <div className="inline-flex overflow-hidden rounded-[var(--radius-md)] border border-border">
            <button
              type="button"
              disabled={!onMonthNavigate}
              onClick={() => onMonthNavigate?.(-1)}
              className={cn(
                "flex h-8 w-8 items-center justify-center border-r border-border bg-bg text-text-secondary transition-colors",
                onMonthNavigate && "hover:bg-[var(--black-alpha-11)]"
              )}
              aria-label="上一月"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            </button>
            <button
              type="button"
              disabled={!onMonthNavigate}
              onClick={() => onMonthNavigate?.(1)}
              className={cn(
                "flex h-8 w-8 items-center justify-center bg-bg text-text-secondary transition-colors",
                onMonthNavigate && "hover:bg-[var(--black-alpha-11)]"
              )}
              aria-label="下一月"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-wrap gap-[var(--space-200)] border-b border-border px-[var(--space-400)] py-[var(--space-250)]">
        <button
          type="button"
          className="flex min-h-[36px] min-w-[min(140px,42%)] flex-1 items-center justify-between gap-[var(--space-150)] rounded-[var(--radius-md)] border border-border bg-bg px-[var(--space-300)] py-[var(--space-150)] text-left text-[length:var(--font-size-sm)] text-text transition-colors hover:bg-[var(--black-alpha-11)]"
        >
          组织机构
          <ChevronDown className="h-4 w-4 shrink-0 text-text-tertiary" strokeWidth={2} aria-hidden />
        </button>
        <button
          type="button"
          className="flex min-h-[36px] min-w-[min(140px,42%)] flex-1 items-center justify-between gap-[var(--space-150)] rounded-[var(--radius-md)] border border-border bg-bg px-[var(--space-300)] py-[var(--space-150)] text-left text-[length:var(--font-size-sm)] text-text transition-colors hover:bg-[var(--black-alpha-11)]"
        >
          月统计
          <ChevronDown className="h-4 w-4 shrink-0 text-text-tertiary" strokeWidth={2} aria-hidden />
        </button>
      </div>

      <div className="p-[var(--space-400)]">
        <div className="flex flex-wrap gap-[var(--space-200)]">
          {firstRow.map((cell) => (
            <div
              key={cell.label}
              className={cn(
                cellClass,
                "w-[calc(50%-var(--space-100))] sm:w-[calc(25%-var(--space-150))]"
              )}
            >
              <span className="text-[length:var(--font-size-xl)] font-[var(--font-weight-semi-bold)] leading-none text-text tabular-nums">
                {cell.value}
              </span>
              <span className="text-[length:var(--font-size-xs)] font-[var(--font-weight-regular)] leading-[var(--line-height-sm)] text-text-secondary">
                {cell.label}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-[var(--space-200)] flex flex-wrap justify-center gap-[var(--space-200)]">
          {lastRow.map((cell) => (
            <div
              key={cell.label}
              className={cn(cellClass, "w-[calc(50%-var(--space-100))] max-w-[200px] sm:w-[calc(25%-var(--space-150))] sm:max-w-none")}
            >
              <span className="text-[length:var(--font-size-xl)] font-[var(--font-weight-semi-bold)] leading-none text-text tabular-nums">
                {cell.value}
              </span>
              <span className="text-[length:var(--font-size-xs)] font-[var(--font-weight-regular)] leading-[var(--line-height-sm)] text-text-secondary">
                {cell.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
