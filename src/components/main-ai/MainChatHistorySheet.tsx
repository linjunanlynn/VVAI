import * as React from "react"
import { ScrollArea } from "../ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet"
import { cn } from "../ui/utils"
import type { MainChatHistoryEntry } from "./mainChatHistoryTypes"

function startOfLocalDay(d: Date): number {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x.getTime()
}

function groupEntriesByTime(entries: MainChatHistoryEntry[]) {
  const now = new Date()
  const today = startOfLocalDay(now)
  const sevenDaysAgo = today - 7 * 86400000

  const groups = {
    today: [] as MainChatHistoryEntry[],
    within7Days: [] as MainChatHistoryEntry[],
    earlier: [] as MainChatHistoryEntry[],
  }

  for (const e of entries) {
    const day = startOfLocalDay(new Date(e.updatedAt))
    if (day >= today) {
      groups.today.push(e)
    } else if (day >= sevenDaysAgo) {
      groups.within7Days.push(e)
    } else {
      groups.earlier.push(e)
    }
  }

  return groups
}

function formatEntryTime(updatedAt: number): string {
  const msgDate = new Date(updatedAt)
  const now = new Date()
  const dayDiff = Math.floor((startOfLocalDay(now) - startOfLocalDay(msgDate)) / 86400000)
  if (dayDiff <= 0) {
    return msgDate.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false })
  }
  if (dayDiff === 1) return "昨天"
  if (msgDate.getFullYear() === now.getFullYear()) {
    return `${msgDate.getMonth() + 1}月${msgDate.getDate()}日`
  }
  return `${msgDate.getFullYear()}/${msgDate.getMonth() + 1}/${msgDate.getDate()}`
}

type MainChatHistorySheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  entries: MainChatHistoryEntry[]
  onSelectEntry: (entryId: string) => void
}

export function MainChatHistorySheet({
  open,
  onOpenChange,
  entries,
  onSelectEntry,
}: MainChatHistorySheetProps) {
  const sorted = React.useMemo(
    () => [...entries].sort((a, b) => b.updatedAt - a.updatedAt),
    [entries]
  )
  const grouped = React.useMemo(() => groupEntriesByTime(sorted), [sorted])

  const renderSection = (label: string, list: MainChatHistoryEntry[]) => {
    if (list.length === 0) return null
    return (
      <div className="flex w-full min-w-0 flex-col gap-[var(--space-150)]">
        <div className="px-[var(--space-200)] pt-[var(--space-200)] pb-0">
          <span className="text-[length:var(--font-size-xs)] font-[var(--font-weight-regular)] leading-normal text-text-secondary">
            {label}
          </span>
        </div>
        {list.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => onSelectEntry(entry.id)}
            className={cn(
              "box-border flex w-full min-w-0 max-w-full cursor-pointer touch-manipulation items-start justify-between gap-[var(--space-200)] rounded-[var(--radius-md)] border-none px-[var(--space-200)] py-[var(--space-200)] text-left transition-colors",
              "hover:bg-[var(--black-alpha-11)] active:bg-[var(--black-alpha-11)]"
            )}
          >
            <span className="min-w-0 flex-1 truncate text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] leading-normal text-text">
              {entry.title}
            </span>
            <span className="shrink-0 whitespace-nowrap text-[length:var(--font-size-xxs)] font-[var(--font-weight-regular)] tabular-nums leading-none text-text-tertiary pt-[3px]">
              {formatEntryTime(entry.updatedAt)}
            </span>
          </button>
        ))}
      </div>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-[min(100vw,400px)] border-border bg-cui-bg p-0 gap-0 sm:max-w-[400px]"
      >
        <SheetHeader className="border-b border-border px-[max(20px,var(--space-300))] py-[var(--space-300)] text-left">
          <SheetTitle className="text-[length:var(--font-size-lg)] font-[var(--font-weight-semi-bold)] leading-[var(--line-height-lg)] text-text">
            历史消息
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-5rem)] min-h-0 flex-1">
          <div className="flex min-w-0 flex-col gap-[var(--space-200)] px-[var(--space-300)] pb-[var(--space-500)] pt-[var(--space-100)]">
            {sorted.length === 0 ? (
              <p className="px-[var(--space-200)] py-[var(--space-400)] text-[length:var(--font-size-sm)] text-text-secondary">
                暂无历史会话
              </p>
            ) : (
              <>
                {renderSection("今天", grouped.today)}
                {renderSection("7天内", grouped.within7Days)}
                {renderSection("更早", grouped.earlier)}
              </>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
