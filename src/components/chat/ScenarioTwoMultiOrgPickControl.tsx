import * as React from "react"
import { ChevronDown } from "lucide-react"
import { ChatPromptButton } from "./ChatPromptButton"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from "../ui/utils"

export type ScenarioTwoMultiOrgPickControlOrg = { id: string; name: string }

export type ScenarioTwoMultiOrgPickLabelMode = "attendance" | "task_table"

function orgPickLabels(mode: ScenarioTwoMultiOrgPickLabelMode | undefined, orgName: string) {
  const m = mode ?? "attendance"
  const n = orgName.trim()
  if (m === "task_table") {
    return {
      singleButton: `查看「${n}」任务`,
      multiTrigger: "选择机构打开任务列表",
    }
  }
  return {
    singleButton: `查看「${n}」考勤`,
    multiTrigger: "选择机构查看考勤",
  }
}

/**
 * 卡片顶栏：在「当前所属组织：名称」同一区域内展开列表切换其它机构（右侧不再单独放按钮）。
 */
export function ScenarioTwoMultiOrgAttributionBarTrigger({
  cardOrgDisplayName,
  organizations,
  currentOrgId,
  onNavigateOtherOrgAttendance,
  orgPickLabelMode,
}: {
  cardOrgDisplayName: string
  organizations: ScenarioTwoMultiOrgPickControlOrg[]
  currentOrgId: string
  onNavigateOtherOrgAttendance: (orgName: string) => void
  orgPickLabelMode?: ScenarioTwoMultiOrgPickLabelMode
}) {
  const [open, setOpen] = React.useState(false)
  const others = React.useMemo(
    () => organizations.filter((o) => o.id !== currentOrgId),
    [organizations, currentOrgId]
  )
  const modeHint =
    orgPickLabelMode === "task_table" ? "任务列表" : "考勤"

  if (others.length === 0) {
    return (
      <p className="m-0 min-w-0 flex-1 truncate text-[length:var(--font-size-xxs)] leading-[var(--line-height-sm)] font-[var(--font-weight-medium)] text-text">
        <span className="text-text-secondary font-[var(--font-weight-regular)]">当前所属组织：</span>
        {cardOrgDisplayName}
      </p>
    )
  }

  return (
    <div className="flex min-w-0 flex-1 justify-start">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "m-0 inline-flex min-h-7 min-w-0 max-w-full items-center gap-[var(--space-100)] overflow-hidden rounded-[var(--radius-sm)] text-left outline-none",
              "text-[length:var(--font-size-xxs)] leading-[var(--line-height-sm)]",
              "transition-colors hover:bg-[var(--black-alpha-06)] focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]/35",
              "-my-px -mr-[var(--space-100)] px-[var(--space-100)] py-[var(--space-50)] -ml-[var(--space-50)]"
            )}
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-label={`切换机构以打开其它主体的${modeHint}，当前所属组织：${cardOrgDisplayName}`}
          >
            <span className="shrink-0 text-text-secondary font-[var(--font-weight-regular)]">当前所属组织：</span>
            <span className="inline-flex min-w-0 max-w-full items-center gap-[var(--space-50)]">
              <span className="min-w-0 truncate font-[var(--font-weight-medium)] text-text">
                {cardOrgDisplayName}
              </span>
              <ChevronDown
                className={cn(
                  "size-3.5 shrink-0 text-primary opacity-80",
                  open && "opacity-100"
                )}
                strokeWidth={2}
                aria-hidden
              />
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={6}
          className="w-[min(18rem,calc(100vw-2rem))] p-[var(--space-100)]"
        >
          <p className="m-0 mb-[var(--space-100)] px-[var(--space-100)] text-[length:var(--font-size-xxs)] leading-snug text-text-secondary">
            {`选择机构打开${modeHint}`}
          </p>
          <ul className="m-0 list-none space-y-px p-0">
            {others.map((o) => (
              <li key={o.id}>
                <button
                  type="button"
                  className={cn(
                    "w-full rounded-[var(--radius-md)] px-[var(--space-200)] py-[var(--space-200)] text-left",
                    "text-[length:var(--font-size-sm)] text-text transition-colors hover:bg-[var(--black-alpha-11)]"
                  )}
                  onClick={() => {
                    setOpen(false)
                    onNavigateOtherOrgAttendance(o.name.trim())
                  }}
                >
                  {o.name.trim()}
                </button>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  )
}

/**
 * 场景二多组织：底部条右侧「另一机构」入口（与顶栏内联触发器二选一使用）。
 */
export function ScenarioTwoMultiOrgPickControl({
  organizations,
  currentOrgId,
  onNavigateOtherOrgAttendance,
  orgPickLabelMode,
  /** 顶栏内紧凑排版：避免过宽按钮把顶栏撑破 */
  compact = false,
}: {
  organizations: ScenarioTwoMultiOrgPickControlOrg[]
  currentOrgId: string
  onNavigateOtherOrgAttendance: (orgName: string) => void
  orgPickLabelMode?: ScenarioTwoMultiOrgPickLabelMode
  compact?: boolean
}) {
  const [open, setOpen] = React.useState(false)

  const others = React.useMemo(
    () => organizations.filter((o) => o.id !== currentOrgId),
    [organizations, currentOrgId]
  )

  if (others.length === 0) return null

  const singleOther = others.length === 1 ? others[0]! : null
  const multiOthers = others.length >= 2

  if (singleOther) {
    const { singleButton } = orgPickLabels(orgPickLabelMode, singleOther.name)
    return (
      <ChatPromptButton
        type="button"
        className={cn(
          "max-w-full shrink-0 justify-end text-right",
          compact ? "w-auto max-w-[min(100%,14rem)] px-[var(--space-200)] py-[var(--space-100)] text-[length:var(--font-size-xxs)]" : null,
          !compact && "w-full justify-end text-right sm:w-auto sm:max-w-[min(100%,22rem)]"
        )}
        onClick={() => onNavigateOtherOrgAttendance(singleOther.name.trim())}
      >
        {singleButton}
      </ChatPromptButton>
    )
  }

  if (multiOthers) {
    const { multiTrigger } = orgPickLabels(orgPickLabelMode, "")
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex max-w-full shrink-0 items-center justify-end gap-[var(--space-100)] rounded-full border border-border bg-card",
              "text-right shadow-sm text-primary",
              "transition-[color,background-color,box-shadow,border-color] hover:border-border hover:bg-bg-secondary/50 hover:text-primary-hover hover:shadow",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]/35",
              compact
                ? "max-w-[min(100%,12rem)] px-[var(--space-200)] py-[var(--space-100)] text-[length:var(--font-size-xxs)] font-[var(--font-weight-medium)] leading-snug"
                : "w-full max-w-full px-[var(--space-300)] py-[var(--space-150)] text-[length:var(--font-size-xs)] font-[var(--font-weight-regular)] leading-snug sm:w-auto sm:max-w-[min(100%,22rem)]"
            )}
            aria-expanded={open}
            aria-haspopup="dialog"
          >
            <span className="min-w-0 break-words text-pretty">{multiTrigger}</span>
            <ChevronDown className="size-3 shrink-0 opacity-70" strokeWidth={2} aria-hidden />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={6}
          className="w-[min(18rem,calc(100vw-2rem))] p-[var(--space-100)]"
        >
          <ul className="m-0 list-none space-y-px p-0">
            {others.map((o) => (
              <li key={o.id}>
                <button
                  type="button"
                  className={cn(
                    "w-full rounded-[var(--radius-md)] px-[var(--space-200)] py-[var(--space-200)] text-left",
                    "text-[length:var(--font-size-sm)] text-text transition-colors hover:bg-[var(--black-alpha-11)]"
                  )}
                  onClick={() => {
                    setOpen(false)
                    onNavigateOtherOrgAttendance(o.name.trim())
                  }}
                >
                  {o.name.trim()}
                </button>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    )
  }

  return null
}
