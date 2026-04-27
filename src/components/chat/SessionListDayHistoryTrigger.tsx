import * as React from "react"
import { CalendarDays } from "lucide-react"
import { Calendar } from "../ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { cn } from "../ui/utils"
import { coerceMessagesList, type Conversation, type Message } from "./data"

function localDateKeyFromMs(ms: number): string {
  const d = new Date(ms)
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-")
}

function localDateKeyFromDate(d: Date): string {
  return localDateKeyFromMs(d.getTime())
}

export function collectMessageLocalDayKeys(messages: Message[] | null | undefined): Set<string> {
  const list = coerceMessagesList(messages)
  const s = new Set<string>()
  for (const m of list) {
    if (typeof m.createdAt !== "number" || !Number.isFinite(m.createdAt) || m.createdAt <= 0) continue
    s.add(localDateKeyFromMs(m.createdAt))
  }
  return s
}

function latestDateFromDayKeys(keys: Set<string>): Date {
  let max = 0
  for (const k of keys) {
    const [y, mo, da] = k.split("-").map(Number)
    if (!y || !mo || !da) continue
    const t = new Date(y, mo - 1, da).getTime()
    if (t > max) max = t
  }
  return max > 0 ? new Date(max) : new Date()
}

function messagesOnLocalDay(messages: Message[] | null | undefined, day: Date): Message[] {
  const list = coerceMessagesList(messages)
  const key = localDateKeyFromDate(day)
  return list
    .filter((m) => {
      if (typeof m.createdAt !== "number" || !Number.isFinite(m.createdAt)) return false
      return localDateKeyFromMs(m.createdAt) === key
    })
    .sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0))
}

/** 所选本地日历日当天，按时间排序后的第一条消息 id（供主会话区滚动定位） */
export function getFirstMessageIdOnLocalCalendarDay(
  messages: Message[] | null | undefined,
  day: Date
): string | undefined {
  const list = messagesOnLocalDay(messages, day)
  return list[0]?.id
}

interface SessionListDayHistoryTriggerProps {
  conversation: Conversation
  /** 与当前行选中态一致，用于弱强调 */
  rowSelected?: boolean
  /** 选中日期后：切换到该会话并在主内容区定位到当日首条消息 */
  onJumpToConversationDay?: (conversationId: string, messageId: string) => void
}

/**
 * 会话列表行右侧：紧凑「日历」图标入口（《组织状态》相关列表不展示文案）；
 * Popover 内仅可选有消息的本地日，选中后在主会话区定位当日首条消息。
 */
export function SessionListDayHistoryTrigger({
  conversation,
  rowSelected = false,
  onJumpToConversationDay,
}: SessionListDayHistoryTriggerProps) {
  const dayKeys = React.useMemo(
    () => collectMessageLocalDayKeys(conversation.messages),
    [conversation.messages]
  )

  const [pickerOpen, setPickerOpen] = React.useState(false)

  const defaultMonth = React.useMemo(() => latestDateFromDayKeys(dayKeys), [dayKeys])

  if (dayKeys.size === 0) return null

  const handleCalendarSelect = (d: Date | undefined) => {
    if (!d) return
    if (!dayKeys.has(localDateKeyFromDate(d))) return
    const messageId = getFirstMessageIdOnLocalCalendarDay(conversation.messages, d)
    if (!messageId) return
    setPickerOpen(false)
    onJumpToConversationDay?.(conversation.id, messageId)
  }

  const dayCountLabel = dayKeys.size

  return (
    <>
      <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
        <Tooltip delayDuration={400}>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <button
                type="button"
                data-testid="session-list-day-history-trigger"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                className={cn(
                  "relative inline-flex size-[26px] shrink-0 cursor-pointer items-center justify-center rounded-[var(--radius-md)]",
                  "border transition-[color,background-color,border-color,box-shadow]",
                  rowSelected
                    ? "border-primary/30 bg-[var(--blue-alpha-12)] text-primary ring-1 ring-primary/15"
                    : "border-border/70 bg-bg-secondary/90 text-text-tertiary shadow-xs",
                  "hover:border-primary/35 hover:bg-[var(--black-alpha-11)] hover:text-primary",
                  "active:scale-[0.97]",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                )}
                aria-label={`按日期查看记录，共 ${dayCountLabel} 天有聊天内容`}
              >
                <CalendarDays className="size-[15px]" strokeWidth={2} aria-hidden />
              </button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent side="left" sideOffset={6} className="max-w-[220px] px-2.5 py-2 text-left">
            <p className="m-0 text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] leading-snug text-bg">
              按日期查看
            </p>
            <p className="mt-1 text-[length:var(--font-size-xxs)] font-[var(--font-weight-regular)] leading-snug text-bg/85">
              打开日历选择有记录的日期（{dayCountLabel} 天），定位到该日首条消息
            </p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent
          align="end"
          side="bottom"
          sideOffset={6}
          className="z-[100] w-auto min-w-[288px] max-w-[min(calc(100vw-24px),340px)] border-border p-0 shadow-lg"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="border-b border-border px-3 py-2">
            <p className="m-0 text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-text">
              选择日期
            </p>
            <p className="mt-0.5 text-[length:var(--font-size-xxs)] leading-snug text-text-tertiary">
              灰色日期无记录；点选有记录日期后，在主会话区跳至当日首条
            </p>
          </div>
          <Calendar
            mode="single"
            defaultMonth={defaultMonth}
            disabled={(date) => !dayKeys.has(localDateKeyFromDate(date))}
            onSelect={handleCalendarSelect}
            className="rounded-b-xl px-1 pb-2 pt-1"
          />
        </PopoverContent>
      </Popover>
    </>
  )
}
