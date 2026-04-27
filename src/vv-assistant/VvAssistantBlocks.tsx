import * as React from "react"
import {
  Bell,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock3,
  Copy,
  FileCheck,
  FileText,
  HardDrive,
  Info,
  Link2,
  ListTodo,
  Loader2,
  Lock,
  MapPin,
  Pencil,
  Mic,
  MicOff,
  MoreHorizontal,
  Palette,
  Paperclip,
  Plus,
  Search,
  Settings,
  Trash2,
  User,
  UserPlus,
  Users,
  Video,
  VideoOff,
  BarChart3,
  X,
} from "lucide-react"
import { SecondaryAppGlyph } from "../components/icons/SecondaryAppGlyph"
import { ChatPromptButton } from "../components/chat/ChatPromptButton"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Dialog, DialogClose, DialogContent, DialogTitle } from "../components/ui/dialog"
import { Sheet, SheetClose, SheetContent } from "../components/ui/sheet"
import { Checkbox } from "../components/ui/checkbox"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { Switch } from "../components/ui/switch"
import { Textarea } from "../components/ui/textarea"
import { cn } from "../components/ui/utils"
import { currentUser } from "../components/chat/data"
import { useVvChatInsetDialogPortal } from "./vvChatInsetDialogPortalContext"
import {
  useVvScheduleSideSheetOptional,
  type VvScheduleSideSheetSurface,
} from "./vvScheduleSideSheetContext"
import { vvDemoNativeCapabilityToast } from "./vvDemoToast"
import type {
  VvApprovalStartFormDraft,
  VvAssistantPayload,
  VvCalendarCreateDraft,
  VvCalendarVisibilityScope,
  VvDocItem,
  VvDriveItem,
  VvFreeSlot,
  VvMailComposeFormDraft,
  VvMailItem,
  VvMeetingItem,
  VvMeetingRecordHubItem,
  VvMeetingRecordHubTab,
  VvMeetingStartFormDraft,
  VvRecordItem,
  VvScheduleAttendeeRsvp,
  VvScheduleCalendarPrefs,
  VvScheduleCreateDraft,
  VvScheduleEditDraft,
  VvScheduleItem,
  VvSuccessAction,
  VvTodoHubTab,
  VvTodoItem,
  VvUserCalendarType,
  VvWeekStartChoice,
} from "./types"
import {
  CAL_DEFAULT_ID,
  canCurrentUserProcessTodo,
  DEFAULT_USER_CALENDAR_TYPES,
  meetingStatusText,
  colleagueCalendarDirectorySeed,
  SCHEDULE_CURRENT_USER_NAME,
  sortByStart,
  todoStatusText,
  todoTypeText,
} from "./seeds"
import {
  buildUpdatedScheduleFromEdit,
  composeScheduleCreateSlotLabel,
  isoToday,
  normalizeScheduleCreateTimeParts,
  parseScheduleCreateSlotParts,
  scheduleEditDraftFromItem,
} from "./scheduleFlow"
import { ScheduleBatchAddParticipantsDialog } from "./ScheduleBatchAddParticipantsDialog"
import { ApprovalProcessHubBlock } from "./ApprovalProcessHubBlock"
import { defaultApprovalStartDraft } from "./approvalFlow"
import { TodoFullHubBlock } from "./TodoFullHubBlock"
import { TODO_HUB_TABS, todosForHubTab } from "./todoHub"
import { defaultScheduleCalendarPrefs, SCHEDULE_REMINDER_OPTION_LABELS } from "./scheduleCalendarPrefs"
import { useUserCalendars, useUserCalendarsSafe } from "./userCalendarsContext"

export type VvActionHandler = (action: string, data?: unknown) => void

/** 对齐 ComponentShowcase + Guidelines：语义 token，不用零散 tailwind 色 */
const vvCardSurface = "rounded-[var(--radius-lg)] w-full border border-border bg-bg shadow-xs"
const vvCardListRow = cn(vvCardSurface, "gap-0")
const vvCardForm = "rounded-[var(--radius-lg)] w-full border border-border bg-bg-secondary shadow-xs"
/** CUI 内「确认取消日程 / 取消订阅」等中性底确认卡（对齐设计稿浅灰容器） */
const vvCardCuiConfirmShell =
  "rounded-[var(--radius-lg)] w-full border border-border bg-[#eef2f7] shadow-xs"
const vvCardDestructive = "rounded-[var(--radius-lg)] w-full border-[var(--red-10)] bg-[var(--red-12)] shadow-xs"
const vvCardSuccess = "rounded-[var(--radius-lg)] w-full border-[var(--green-10)] bg-[var(--green-12)] shadow-xs"
const vvCardSuccessWarn = "rounded-[var(--radius-lg)] w-full border-[var(--red-10)] bg-[var(--red-12)] shadow-xs"
const vvCardTitle = "text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] text-text leading-snug"
const vvCardDesc = "text-[length:var(--font-size-sm)] text-text-secondary leading-normal"
const vvFieldLabel = "text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text"
const vvFieldStack = "space-y-[var(--space-200)]"
const vvInput = "rounded-[var(--radius-md)] bg-bg"
const vvHintPanel =
  "text-[length:var(--font-size-xs)] text-text-secondary border border-dashed border-border rounded-[var(--radius-md)] bg-bg px-[var(--space-300)] py-[var(--space-200)] leading-relaxed"
const vvFormFooter = "flex flex-wrap gap-[var(--space-200)] pt-[var(--space-100)]"

export type VvFollowupChip = { label: string; sendText: string }

/** 结果卡片下方推荐快捷入口（与 vvPlan 一致）；按钮样式对齐通用首页置顶 ChatPromptButton 默认外观 */
export function vvFollowupsForPayload(payload: VvAssistantPayload): VvFollowupChip[] {
  switch (payload.kind) {
    case "schedule-agenda":
      return [
        { label: "新建日程", sendText: "新建日程" },
        { label: "全部日程", sendText: "全部日程" },
      ]
    case "schedule-all":
      return [{ label: "新建日程", sendText: "新建日程" }]
    case "schedule-detail": {
      const pastDetail = isScheduleItemPast(payload.item)
      if (pastDetail) {
        return [{ label: "新建日程", sendText: "新建日程" }]
      }
      return [
        { label: "新建日程", sendText: "新建日程" },
        { label: "修改日程", sendText: "修改日程" },
        { label: "取消日程", sendText: "取消日程" },
      ]
    }
    case "meeting-list":
      if (payload.variant === "join") {
        return [
          { label: "发起会议", sendText: "发起会议" },
          { label: "会议记录", sendText: "会议记录" },
        ]
      }
      return [
        { label: "加入会议", sendText: "加入会议" },
        { label: "发起会议", sendText: "发起会议" },
      ]
    case "meeting-agenda":
      return [
        { label: "发起会议", sendText: "发起会议" },
        { label: "预约会议", sendText: "预约会议" },
        { label: "加入会议", sendText: "加入会议" },
      ]
    case "meeting-join-card":
      return [
        { label: "发起会议", sendText: "发起会议" },
        { label: "会议记录", sendText: "会议记录" },
      ]
    case "meeting-detail":
      return [
        { label: "加入会议", sendText: "加入会议" },
        { label: "会议记录", sendText: "会议记录" },
        { label: "今日日程", sendText: "今日日程" },
      ]
    case "record-list":
      return [{ label: "发起会议", sendText: "发起会议" }, { label: "加入会议", sendText: "加入会议" }]
    case "meeting-record-hub":
      return [{ label: "发起会议", sendText: "发起会议" }, { label: "预约会议", sendText: "预约会议" }, { label: "今日日程", sendText: "今日日程" }]
    case "record-detail":
      return [{ label: "会议记录", sendText: "会议记录" }, { label: "今日日程", sendText: "今日日程" }]
    case "todo-list":
      if (payload.hub && payload.allItems) {
        const cross =
          payload.hubMode === "full"
            ? ({ label: "我的待办", sendText: "我的待办" } as const)
            : ({ label: "全部待办", sendText: "全部待办" } as const)
        return [cross, { label: "发起审批", sendText: "发起审批" }]
      }
      return [
        { label: "我的待办", sendText: "我的待办" },
        { label: "发起审批", sendText: "发起审批" },
      ]
    case "todo-detail":
      return [
        { label: "我的待办", sendText: "我的待办" },
        { label: "全部待办", sendText: "全部待办" },
      ]
    case "mail-list": {
      const chips: VvFollowupChip[] = [
        { label: "新建邮件", sendText: "新建邮件" },
        { label: "我的待办", sendText: "我的待办" },
        { label: "全部待办", sendText: "全部待办" },
      ]
      if (payload.title !== "收件箱") {
        chips.splice(1, 0, { label: "收件箱", sendText: "收件箱" })
      }
      return chips
    }
    case "mail-detail":
      return [
        { label: "收件箱", sendText: "收件箱" },
        { label: "新建邮件", sendText: "新建邮件" },
      ]
    case "drive-list":
      return [
        { label: "下载文件", sendText: "下载文件" },
        { label: "共享文件", sendText: "共享文件" },
      ]
    case "doc-list":
      return [
        { label: "我的文件", sendText: "我的文件" },
        { label: "收件箱", sendText: "收件箱" },
      ]
    case "doc-detail":
      return [
        { label: "全部文档", sendText: "全部文档" },
        { label: "我的文件", sendText: "我的文件" },
      ]
    case "free-slots":
      if (payload.purpose === "meeting-book") {
        return [
          { label: "发起会议", sendText: "发起会议" },
          { label: "加入会议", sendText: "加入会议" },
        ]
      }
      return [
        { label: "新建日程", sendText: "新建日程" },
        { label: "今日日程", sendText: "今日日程" },
      ]
    case "schedule-create":
      return [
        { label: "今日日程", sendText: "查询今日日程" },
        { label: "全部日程", sendText: "全部日程" },
      ]
    case "schedule-edit":
      return [
        { label: "今日日程", sendText: "查询今日日程" },
        { label: "取消日程", sendText: "取消日程" },
      ]
    case "schedule-calendar-settings":
    case "schedule-calendar-settings-summary":
      return [
        { label: "今日日程", sendText: "查询今日日程" },
        { label: "全部日程", sendText: "全部日程" },
        { label: "新建日程", sendText: "新建日程" },
      ]
    case "schedule-calendar-create":
      return []
    case "approval-process-hub":
      return [
        { label: "发起审批", sendText: "发起审批" },
        { label: "我的待办", sendText: "我的待办" },
      ]
    case "approval-start-form":
      return [
        { label: "全部流程", sendText: "全部流程" },
        { label: "我的待办", sendText: "我的待办" },
      ]
    case "vv-success":
      return payload.actions.length === 0 ? [{ label: "今日日程", sendText: "今日日程" }] : []
    default:
      return []
  }
}

function VvNextStepsStrip({
  steps,
  onVvAction,
  className,
  containerRef,
}: {
  steps: VvFollowupChip[]
  onVvAction?: VvActionHandler
  className?: string
  containerRef?: React.Ref<HTMLDivElement>
}) {
  if (steps.length === 0) return null
  return (
    <div ref={containerRef} className={cn("flex flex-wrap gap-[var(--space-200)] min-w-0 w-full", className)}>
      {steps.map((s) => (
        <ChatPromptButton
          key={`${s.label}-${s.sendText}`}
          type="button"
          promptAppearance="default"
          onClick={() => onVvAction?.("vv-suggested-followup", { sendText: s.sendText })}
        >
          {s.label}
        </ChatPromptButton>
      ))}
    </div>
  )
}

const VV_CARD_COMMIT_SHIMMER_MS = 500

export function vvAssistantWithFollowups(
  payload: VvAssistantPayload,
  inner: React.ReactNode,
  onVvAction?: VvActionHandler,
  cardStatusLine?: string | null,
  options?: {
    hideFollowups?: boolean
    followupsClassName?: string
    followupsRef?: React.Ref<HTMLDivElement>
  }
): React.ReactNode {
  const steps = options?.hideFollowups ? [] : vvFollowupsForPayload(payload)
  const statusEl =
    cardStatusLine && cardStatusLine.trim() ? (
      <div className="pt-2 mt-1">
        <p className="text-[11px] leading-snug text-text-secondary/55 pl-0.5 tracking-wide">{cardStatusLine}</p>
        {steps.length > 0 ? <div className="mt-2.5 border-b border-border/40" aria-hidden /> : null}
      </div>
    ) : null
  if (steps.length === 0) {
    if (!statusEl) return inner
    return (
      <div className="w-full space-y-2">
        {inner}
        {statusEl}
      </div>
    )
  }
  return (
    <div className="w-full space-y-2">
      {inner}
      {statusEl}
      <div className={statusEl ? "pt-3" : ""}>
        <VvNextStepsStrip
          steps={steps}
          onVvAction={onVvAction}
          className={options?.followupsClassName}
          containerRef={options?.followupsRef}
        />
      </div>
    </div>
  )
}

export function VvUserBubble({
  content,
  vvMeta,
  className,
}: {
  content: string
  vvMeta?: { commandHint?: string | null; showCommandHint?: boolean; isRecognizing?: boolean }
  className?: string
}) {
  return (
    <div className={cn("flex flex-col items-end gap-[var(--space-150)] max-w-full", className)}>
      <div
        className={cn(
          "p-[var(--space-300)_var(--space-350)] text-[length:var(--font-size-base)] leading-normal break-words",
          "bg-gradient-to-r from-[#9187FF] to-[#2C98FC] text-[var(--color-white)] rounded-tl-[var(--radius-lg)] rounded-tr-[var(--radius-sm)] rounded-bl-[var(--radius-lg)] rounded-br-[var(--radius-lg)] shadow-elevation-sm"
        )}
      >
        {content}
      </div>
      {vvMeta?.isRecognizing ? (
        <div className="text-[length:var(--font-size-xs)] text-text-secondary">正在识别意图与可执行指令…</div>
      ) : null}
      {vvMeta?.showCommandHint && vvMeta.commandHint ? (
        <div className="w-full max-w-[min(100%,520px)] rounded-[var(--radius-md)] border border-dashed border-border bg-bg-secondary px-[var(--space-300)] py-[var(--space-200)] text-left">
          <div className="text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-text-secondary mb-[var(--space-100)]">
          推测 CLI
        </div>
          <code className="text-[length:var(--font-size-xs)] text-text-secondary break-all whitespace-pre-wrap font-mono">
            {vvMeta.commandHint}
          </code>
        </div>
      ) : null}
    </div>
  )
}

function AssistantIntro({
  children,
  icon: Icon,
  leading,
}: {
  children: React.ReactNode
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>
  leading?: React.ReactNode
}) {
  return (
    <div className="rounded-tl-[var(--radius-sm)] rounded-tr-[var(--radius-lg)] rounded-bl-[var(--radius-lg)] rounded-br-[var(--radius-lg)] border border-border bg-bg p-[var(--space-400)] shadow-xs">
      <div className="flex items-start gap-[var(--space-300)]">
        {leading ?? (Icon ? <Icon className="size-[18px] text-text-secondary shrink-0 mt-0.5" strokeWidth={2} /> : null)}
        <div className="space-y-[var(--space-150)] text-[length:var(--font-size-base)] text-text-secondary leading-normal min-w-0">{children}</div>
      </div>
    </div>
  )
}

function scheduleAgendaTimeRange(item: VvScheduleItem): string {
  if (item.start && item.end) return `${item.start}–${item.end}`
  const m = (item.time || "").match(/(\d{1,2}:\d{2})\s*[-–—]\s*(\d{1,2}:\d{2})/)
  if (m) return `${m[1]}–${m[2]}`
  return item.time || "—"
}

/** 非「今天」的条目在列表中显示 M月d日 + 时段 */
function scheduleAgendaTimeDisplay(item: VvScheduleItem): string {
  const range = scheduleAgendaTimeRange(item)
  const today = isoToday()
  if (item.dateLabel === "今天") return range
  if (item.calendarDate) {
    if (item.calendarDate === today) return range
    const m = item.calendarDate.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (m) {
      const month = parseInt(m[2], 10)
      const day = parseInt(m[3], 10)
      return `${month}月${day}日 ${range}`
    }
  }
  if (item.dateLabel && item.dateLabel !== "今天") return `${item.dateLabel} ${range}`
  return range
}

/** 与今日会议行右侧一致：挂会日程在「今日日程」里复用 */
function LinkedMeetingRowActionButtons({
  meeting,
  onVvAction,
  onViewDetail,
}: {
  meeting: VvMeetingItem
  onVvAction?: VvActionHandler
  /** 日程列表里可覆盖为打开日程详情；会议列表保持会议详情 */
  onViewDetail?: () => void
}) {
  const isLive = meeting.status === "live"
  const isScheduled = meeting.status === "scheduled"
  const handleViewDetail = () => {
    if (onViewDetail) {
      onViewDetail()
      return
    }
    onVvAction?.("meeting-detail", meeting)
  }
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
      {isScheduled ? (
        <>
          <Button
            size="sm"
            className="rounded-[var(--radius-md)]"
            onClick={() => vvDemoNativeCapabilityToast("开始会议")}
          >
            开始会议
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="rounded-[var(--radius-md)]"
            onClick={handleViewDetail}
          >
            查看详情
          </Button>
        </>
      ) : null}
      {isLive ? (
        <>
          <Button
            size="sm"
            variant="secondary"
            className="rounded-[var(--radius-md)]"
            onClick={() => vvDemoNativeCapabilityToast("进入会议")}
          >
            进入会议
          </Button>
          <Button size="sm" variant="secondary" className="rounded-[var(--radius-md)]" onClick={handleViewDetail}>
            查看详情
          </Button>
        </>
      ) : null}
      {!isLive && !isScheduled ? (
        <Button size="sm" variant="secondary" className="rounded-[var(--radius-md)]" onClick={handleViewDetail}>
          查看详情
        </Button>
      ) : null}
    </div>
  )
}

/** 与 `MeetingAgendaRow` 左段一致：时段 + 标题（进行中时紧跟状态与图标） */
function ScheduleRowTitleWithOptionalLiveState({
  scheduleTitle,
  isLive,
}: {
  scheduleTitle: string
  isLive: boolean
}) {
  if (isLive) {
    return (
      <div className="flex min-w-0 flex-1 items-center pl-6 md:pl-10">
        <div className="flex min-w-0 max-w-full items-center gap-1.5">
          <span className="min-w-0 truncate text-[length:var(--font-size-base)] text-text">{scheduleTitle}</span>
          <span className="shrink-0 whitespace-nowrap font-[var(--font-weight-medium)] text-primary">进行中</span>
          <BarChart3 className="size-3.5 shrink-0 text-primary" strokeWidth={2} aria-hidden />
        </div>
      </div>
    )
  }
  return (
    <span className="min-w-0 flex-1 truncate pl-6 text-[length:var(--font-size-base)] text-text md:pl-10">{scheduleTitle}</span>
  )
}

function ScheduleRow({
  item,
  onOpenDetail,
  onSelectRow,
  linkedMeeting,
  onVvAction,
}: {
  item: VvScheduleItem
  onOpenDetail: () => void
  /** 修改/取消候选：点击左侧时段与标题区域即选中该条 */
  onSelectRow?: () => void
  /** 已解析的关联会议；无则不展示会议态与会议按钮 */
  linkedMeeting?: VvMeetingItem | null
  onVvAction?: VvActionHandler
}) {
  const meeting = linkedMeeting ?? null
  const hasMeeting = Boolean(meeting)
  const isLive = meeting?.status === "live"

  const bar = <span className="h-5 w-[3px] shrink-0 rounded-full bg-primary" aria-hidden />
  const timeEl = (
    <span className="shrink-0 text-[length:var(--font-size-base)] tabular-nums text-text">{scheduleAgendaTimeDisplay(item)}</span>
  )
  const titleEl = <ScheduleRowTitleWithOptionalLiveState scheduleTitle={item.title} isLive={Boolean(hasMeeting && isLive)} />

  if (onSelectRow) {
    return (
      <div className="flex items-center gap-3 py-[var(--space-300)]">
        <button
          type="button"
          className="-my-1 flex min-w-0 flex-1 items-center gap-3 rounded-[var(--radius-md)] py-1 text-left outline-none transition-colors hover:bg-[var(--black-alpha-11)] focus-visible:ring-2 focus-visible:ring-ring"
          onClick={onSelectRow}
        >
          {bar}
          {timeEl}
          {titleEl}
        </button>
        {hasMeeting && meeting && onVvAction ? (
          <LinkedMeetingRowActionButtons meeting={meeting} onVvAction={onVvAction} onViewDetail={onOpenDetail} />
        ) : (
          <Button
            size="sm"
            variant="secondary"
            className="shrink-0 rounded-[var(--radius-md)]"
            onClick={(e) => {
              e.stopPropagation()
              onOpenDetail()
            }}
          >
            查看详情
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 py-[var(--space-300)]">
      {bar}
      {timeEl}
      {titleEl}
      {hasMeeting && meeting && onVvAction ? (
        <LinkedMeetingRowActionButtons meeting={meeting} onVvAction={onVvAction} onViewDetail={onOpenDetail} />
      ) : (
        <Button size="sm" variant="secondary" className="shrink-0 rounded-[var(--radius-md)]" onClick={onOpenDetail}>
          查看详情
        </Button>
      )}
    </div>
  )
}

/** 确认取消等卡片内只读摘要：与今日日程行左段一致 */
function ScheduleSummaryRowStatic({ item }: { item: VvScheduleItem }) {
  return (
    <div className="flex items-center gap-3 py-[var(--space-300)]">
      <span className="h-5 w-[3px] shrink-0 rounded-full bg-primary" aria-hidden />
      <span className="shrink-0 text-[length:var(--font-size-base)] tabular-nums text-text">{scheduleAgendaTimeDisplay(item)}</span>
      <span className="min-w-0 flex-1 truncate pl-6 text-[length:var(--font-size-base)] text-text md:pl-10">{item.title}</span>
    </div>
  )
}

/** 日程详情/编辑：今日日程与「全部日程」点开后，在 MainAIChatWindow 侧边对话窗内展示 */
export function ScheduleAgendaModalPanel({
  item,
  onItemUpdated,
  onVvAction,
  onRequestClose,
  /** 今日日程列表为 true；全部日程等多日视图为 false，按真实时间判断已结束 */
  treatDateLabelTodayAsNotPast = true,
  /** 打开侧栏时的初始面板模式（如同步演示「已点删除」则传 "cancel"） */
  initialPanelMode,
}: {
  item: VvScheduleItem
  onItemUpdated: (u: VvScheduleItem) => void
  onVvAction?: VvActionHandler
  onRequestClose: () => void
  treatDateLabelTodayAsNotPast?: boolean
  initialPanelMode?: "detail" | "edit" | "cancel"
}) {
  const [liveItem, setLiveItem] = React.useState(item)
  const [panelMode, setPanelMode] = React.useState<"detail" | "edit" | "cancel">(
    () => initialPanelMode ?? "detail"
  )
  const [cardStatusLine, setCardStatusLine] = React.useState<string | null>(null)
  const [commitShimmer, setCommitShimmer] = React.useState(false)

  React.useEffect(() => {
    setLiveItem(item)
  }, [item])

  React.useEffect(() => {
    setPanelMode(initialPanelMode ?? "detail")
  }, [item.id, initialPanelMode])

  React.useEffect(() => {
    setCardStatusLine(null)
    setCommitShimmer(false)
  }, [item.id])

  const modalOnVvAction = React.useCallback<VvActionHandler>(
    (action, data) => {
      if (action === "schedule-cancel-confirm-do") {
        const base =
          data && typeof data === "object" && data !== null && !Array.isArray(data)
            ? { ...(data as Record<string, unknown>), _vvModalSilent: true, _vvRemainDetailCard: true }
            : { _vvModalSilent: true, _vvRemainDetailCard: true }
        onVvAction?.(action, base)
        const it = (data as { item: VvScheduleItem }).item
        setLiveItem({ ...it, status: "cancelled" })
        onItemUpdated({ ...it, status: "cancelled" })
        setPanelMode("detail")
        setCardStatusLine("已删除")
        setCommitShimmer(true)
        window.setTimeout(() => setCommitShimmer(false), VV_CARD_COMMIT_SHIMMER_MS)
        return
      }
      const payload: Record<string, unknown> =
        data && typeof data === "object" && data !== null && !Array.isArray(data)
          ? { ...(data as Record<string, unknown>), _vvModalSilent: true }
          : { _vvModalSilent: true }
      onVvAction?.(action, payload)
      if (action === "schedule-cancel-back") {
        setPanelMode("detail")
        return
      }
      /** 侧栏内发起群聊后关闭；删除/取消日程后留在子对话，不关侧栏 */
      if (action === "schedule-direct-group-chat" && payload._vvModalSilent === true) {
        queueMicrotask(() => onRequestClose())
      }
    },
    [onVvAction, onRequestClose, onItemUpdated]
  )

  const pastOpts = treatDateLabelTodayAsNotPast ? { treatDateLabelTodayAsNotPast: true } : undefined
  const agendaItemPast = isScheduleItemPast(liveItem, new Date(), pastOpts)
  const agendaCanOrganizerEdit = isScheduleSelfOrganizer(liveItem)
  const cancelDialogOpen = panelMode === "cancel"

  const panelInner = (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      <div className="relative isolate min-h-0 flex-1 overflow-y-auto overflow-x-hidden rounded-[var(--radius-lg)]">
        {panelMode === "edit" && !agendaItemPast && agendaCanOrganizerEdit && liveItem.status !== "cancelled" ? (
          <ScheduleEditFormBlock
            key={`agenda-modal-edit-${liveItem.id}`}
            payload={{
              kind: "schedule-edit",
              item: liveItem,
              draft: scheduleEditDraftFromItem(liveItem),
            }}
            embedded
            onBackOverride={() => setPanelMode("detail")}
            onConfirmOverride={({ item: it, draft }) => {
              const updated = buildUpdatedScheduleFromEdit(it, draft)
              setLiveItem(updated)
              onItemUpdated(updated)
              modalOnVvAction("schedule-edit-confirm-inline", { item: it, draft })
              setPanelMode("detail")
              setCardStatusLine("日程已修改")
              setCommitShimmer(true)
              window.setTimeout(() => setCommitShimmer(false), VV_CARD_COMMIT_SHIMMER_MS)
            }}
          />
        ) : (
          <div
            className={cn(
              "min-h-0 flex-1",
              cancelDialogOpen && "pointer-events-none select-none opacity-[0.42]"
            )}
            aria-hidden={cancelDialogOpen ? true : undefined}
          >
            <ScheduleDetailCard
              item={liveItem}
              embedded
              {...(treatDateLabelTodayAsNotPast ? { treatDateLabelTodayAsNotPast: true } : {})}
              onRequestEditInline={
                agendaItemPast || !agendaCanOrganizerEdit ? undefined : () => setPanelMode("edit")
              }
              onRequestCancelInline={agendaCanOrganizerEdit ? () => setPanelMode("cancel") : undefined}
              onVvAction={modalOnVvAction}
            />
          </div>
        )}
        {commitShimmer ? (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center rounded-[var(--radius-lg)] bg-bg/50 backdrop-blur-[1px]"
            aria-hidden
            aria-busy="true"
          >
            <Loader2 className="size-7 animate-spin text-primary" strokeWidth={2} />
          </div>
        ) : null}
      </div>
      <Dialog
        open={cancelDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setPanelMode("detail")
            modalOnVvAction("schedule-cancel-back", {})
          }
        }}
      >
        <DialogContent showCloseButton={false} className={VV_SCHEDULE_DELETE_OVERLAY_DIALOG_CONTENT}>
          <ScheduleCancelConfirmBlock
            variant="delete-modal"
            payload={{ kind: "schedule-cancel-confirm", item: liveItem, reason: "需求变更" }}
            onVvAction={modalOnVvAction}
            showHeaderClose
            onHeaderClose={() => {
              setPanelMode("detail")
              modalOnVvAction("schedule-cancel-back", {})
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )

  return vvAssistantWithFollowups(
    { kind: "schedule-detail", item: liveItem },
    panelInner,
    modalOnVvAction,
    cardStatusLine,
    { hideFollowups: true }
  )
}

/** 独立「日程详情」消息：修改日程在同卡片内切换为编辑表单；取消/删除与侧栏一致走确认卡片，确认后保留置灰详情卡 */
function ScheduleDetailMessageBlock({
  payload,
  onVvAction,
}: {
  payload: Extract<VvAssistantPayload, { kind: "schedule-detail" }>
  onVvAction?: VvActionHandler
}) {
  const [liveItem, setLiveItem] = React.useState(() => payload.item)
  const [panelMode, setPanelMode] = React.useState<"detail" | "edit" | "cancel">("detail")
  const [commitShimmer, setCommitShimmer] = React.useState(false)

  React.useEffect(() => {
    setLiveItem(payload.item)
    setPanelMode("detail")
    setCommitShimmer(false)
  }, [
    payload.item.id,
    payload.item.title,
    payload.item.calendarDate,
    payload.item.start,
    payload.item.end,
    payload.item.status,
    payload.item.location,
    payload.item.reminder,
    payload.item.organizerName,
    (payload.item.attendees ?? []).join("\u0001"),
  ])

  const detailPast = isScheduleItemPast(liveItem)
  const canOrganizerInlineEdit = isScheduleSelfOrganizer(liveItem)
  const detailReadonlyRemoved = liveItem.status === "cancelled"
  const cancelDialogOpen = panelMode === "cancel"

  const wrappedAction = React.useCallback<VvActionHandler>(
    (action, data) => {
      if (action === "schedule-cancel-confirm-do") {
        const base =
          data && typeof data === "object" && data !== null && !Array.isArray(data)
            ? { ...(data as Record<string, unknown>) }
            : {}
        onVvAction?.(action, { ...base, _vvRemainDetailCard: true })
        setPanelMode("detail")
        setCommitShimmer(true)
        window.setTimeout(() => setCommitShimmer(false), VV_CARD_COMMIT_SHIMMER_MS)
        return
      }
      if (action === "schedule-cancel-back") {
        setPanelMode("detail")
        onVvAction?.(action, { _vvModalSilent: true })
        return
      }
      onVvAction?.(action, data)
    },
    [onVvAction],
  )

  return (
    <div className="w-full min-w-0">
      <div className="relative isolate overflow-hidden rounded-[var(--radius-lg)]">
        {detailReadonlyRemoved ? (
          <ScheduleDetailCard item={liveItem} embedded onVvAction={onVvAction} />
        ) : panelMode === "edit" && !detailPast && liveItem.status !== "cancelled" ? (
          <ScheduleEditFormBlock
            key={`schedule-detail-inline-${liveItem.id}`}
            payload={{
              kind: "schedule-edit",
              item: liveItem,
              draft: scheduleEditDraftFromItem(liveItem),
            }}
            embedded
            onBackOverride={() => setPanelMode("detail")}
            onConfirmOverride={({ item: it, draft }) => {
              const updated = buildUpdatedScheduleFromEdit(it, draft)
              setLiveItem(updated)
              onVvAction?.("schedule-edit-confirm-inline", { item: it, draft })
              setPanelMode("detail")
              setCommitShimmer(true)
              window.setTimeout(() => setCommitShimmer(false), VV_CARD_COMMIT_SHIMMER_MS)
            }}
          />
        ) : (
          <div
            className={cn(cancelDialogOpen && "pointer-events-none select-none opacity-[0.42]")}
            aria-hidden={cancelDialogOpen ? true : undefined}
          >
            <ScheduleDetailCard
              item={liveItem}
              embedded
              onRequestEditInline={detailPast || !canOrganizerInlineEdit ? undefined : () => setPanelMode("edit")}
              onRequestCancelInline={
                canOrganizerInlineEdit ? () => setPanelMode("cancel") : undefined
              }
              onVvAction={onVvAction}
            />
          </div>
        )}
        {commitShimmer ? (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center rounded-[var(--radius-lg)] bg-bg/50 backdrop-blur-[1px]"
            aria-hidden
            aria-busy="true"
          >
            <Loader2 className="size-7 animate-spin text-primary" strokeWidth={2} />
          </div>
        ) : null}
      </div>
      <Dialog
        open={cancelDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setPanelMode("detail")
            onVvAction?.("schedule-cancel-back", { _vvModalSilent: true })
          }
        }}
      >
        <DialogContent showCloseButton={false} className={VV_SCHEDULE_DELETE_OVERLAY_DIALOG_CONTENT}>
          <ScheduleCancelConfirmBlock
            variant="delete-modal"
            payload={{ kind: "schedule-cancel-confirm", item: liveItem, reason: "需求变更" }}
            onVvAction={wrappedAction}
            showHeaderClose
            onHeaderClose={() => {
              setPanelMode("detail")
              onVvAction?.("schedule-cancel-back", { _vvModalSilent: true })
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ScheduleAgendaBlock({
  items,
  heading = "今日日程如下",
  onVvAction,
  schedulePanelAppId,
  schedulePanelSurface,
  meetingItems = [],
}: {
  items: VvScheduleItem[]
  heading?: string
  onVvAction?: VvActionHandler
  schedulePanelAppId: string | null
  schedulePanelSurface: VvScheduleSideSheetSurface
  /** 用于解析 `linkedMeetingId`，与会议列表状态、按钮对齐 */
  meetingItems?: VvMeetingItem[]
}) {
  /** 与消息内快照解耦：修改后不因父级重渲染把列表打回旧数据 */
  const [liveItems, setLiveItems] = React.useState<VvScheduleItem[]>(() => items)
  const sideSheet = useVvScheduleSideSheetOptional()

  React.useEffect(() => {
    setLiveItems(items)
  }, [items])

  const calCtx = useUserCalendarsSafe()
  const visibleOwnTypeIds = React.useMemo(() => {
    const types = calCtx?.calendarTypes ?? DEFAULT_USER_CALENDAR_TYPES
    const vis = calCtx?.ownCalendarsVisible
    const ids = new Set<string>()
    if (!vis) {
      for (const c of types) ids.add(c.id)
      return ids
    }
    for (const c of types) {
      if (vis[c.id] !== false) ids.add(c.id)
    }
    return ids
  }, [calCtx?.calendarTypes, calCtx?.ownCalendarsVisible])

  const displayedItems = React.useMemo(
    () =>
      sortByStart(
        liveItems.filter((it) => {
          if (it.status === "cancelled") return false
          const tid = it.calendarTypeId?.trim() || CAL_DEFAULT_ID
          return visibleOwnTypeIds.has(tid)
        })
      ),
    [liveItems, visibleOwnTypeIds]
  )

  const openDetail = (item: VvScheduleItem) => {
    sideSheet?.openScheduleSideSheet(item, {
      appId: schedulePanelAppId,
      surface: schedulePanelSurface,
      floatingHostAppId: schedulePanelSurface === "floating" ? schedulePanelAppId : undefined,
      treatDateLabelTodayAsNotPast: true,
    })
  }

  const meetingById = React.useMemo(() => {
    const map = new Map<string, VvMeetingItem>()
    for (const m of meetingItems) map.set(m.id, m)
    return map
  }, [meetingItems])

  return (
    <div className={cn(vvCardSurface, "w-full overflow-hidden px-[var(--space-400)] py-[var(--space-400)]")}>
      <p className="mb-[var(--space-300)] text-[length:var(--font-size-base)] leading-relaxed text-text">{heading}</p>
      <div>
        {displayedItems.length === 0 ? (
          <p className="py-2 text-[length:var(--font-size-sm)] text-text-secondary">今日暂无日程。</p>
        ) : null}
        {displayedItems.map((item, index) => (
          <div key={item.id} className={cn(index > 0 && "mt-2 border-t border-border pt-3")}>
            <ScheduleRow
              item={item}
              onOpenDetail={() => openDetail(item)}
              linkedMeeting={item.linkedMeetingId ? meetingById.get(item.linkedMeetingId) ?? null : null}
              onVvAction={onVvAction}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function meetingAgendaTimeRange(m: VvMeetingItem): string {
  if (m.start && m.end && /^\d/.test(m.start) && /^\d/.test(m.end)) {
    return `${m.start}–${m.end}`
  }
  const raw = (m.time || "").replace(/^今天\s*/, "").trim()
  const match = raw.match(/(\d{1,2}:\d{2})\s*[-–—]\s*(\d{1,2}:\d{2})/)
  if (match) return `${match[1]}–${match[2]}`
  return raw || "—"
}

/** 与今日日程 `ScheduleRow`（挂会时）同构：左条 + 时段 + 标题 + 右侧会议操作 */
function MeetingAgendaRow({ item, onVvAction }: { item: VvMeetingItem; onVvAction?: VvActionHandler }) {
  const range = meetingAgendaTimeRange(item)
  return (
    <div className="flex items-center gap-3 py-[var(--space-300)]">
      <span className="h-5 w-[3px] shrink-0 rounded-full bg-primary" aria-hidden />
      <span className="shrink-0 text-[length:var(--font-size-base)] tabular-nums text-text">{range}</span>
      <ScheduleRowTitleWithOptionalLiveState scheduleTitle={item.title} isLive={item.status === "live"} />
      <LinkedMeetingRowActionButtons meeting={item} onVvAction={onVvAction} />
    </div>
  )
}

function MeetingAgendaBlock({
  items,
  heading = "今日会议如下",
  onVvAction,
}: {
  items: VvMeetingItem[]
  heading?: string
  onVvAction?: VvActionHandler
}) {
  const [liveItems, setLiveItems] = React.useState<VvMeetingItem[]>(() => items)
  React.useEffect(() => {
    setLiveItems(items)
  }, [items])

  return (
    <div className={cn(vvCardSurface, "w-full overflow-hidden px-[var(--space-400)] py-[var(--space-400)]")}>
      <p className="mb-[var(--space-300)] text-[length:var(--font-size-base)] leading-relaxed text-text">{heading}</p>
      <div>
        {liveItems.length === 0 ? (
          <p className="py-2 text-[length:var(--font-size-sm)] text-text-secondary">今日暂无会议。</p>
        ) : null}
        {liveItems.map((it, index) => (
          <div key={it.id} className={cn(index > 0 && "mt-2 border-t border-border pt-3")}>
            <MeetingAgendaRow item={it} onVvAction={onVvAction} />
          </div>
        ))}
      </div>
    </div>
  )
}

const WEEKDAYS_MINI_CAL = ["日", "一", "二", "三", "四", "五", "六"]

function pad2Cal(n: number) {
  return String(n).padStart(2, "0")
}

function parseYmCal(y: number, m: number) {
  return `${y}-${pad2Cal(m)}`
}

function formatListDayHeaderCal(iso: string): { day: string; week: string } {
  const [y, mo, da] = iso.split("-").map(Number)
  const dt = new Date(y, mo - 1, da)
  const w = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][dt.getDay()]
  return { day: pad2Cal(da), week: w }
}

/** 日历列表「未响应」：仅表示「别人邀我、我本人尚未接受/拒绝」，不含「他人未响应」 */
function hasPendingRsvpCal(item: VvScheduleItem): boolean {
  const self = SCHEDULE_CURRENT_USER_NAME
  const org = item.organizerName?.trim() || item.attendees[0]
  if (org === self) return false
  if (!item.attendees.includes(self)) return false
  const r = item.attendeeRsvp?.[self] ?? "pending"
  return r === "pending"
}

/** 组织人若在参与人列表中，固定排在第一位（其余保持原顺序） */
function orderedScheduleAttendees(item: VvScheduleItem): string[] {
  const names = [...item.attendees]
  const org = item.organizerName?.trim() || names[0]
  if (!org) return names
  const i = names.indexOf(org)
  if (i <= 0) return names
  const next = [...names]
  next.splice(i, 1)
  return [org, ...next]
}

/** 日视图时间轴：0–24 点，与周视图一致 */
const DAY_VIEW_START_H = 0
const DAY_VIEW_END_H = 24
/** 单行约 18px，4 行字 + 内边距 */
const DAY_VIEW_PX_PER_HOUR = 80
const DAY_VIEW_HOUR_ROWS = Array.from({ length: DAY_VIEW_END_H - DAY_VIEW_START_H }, (_, i) => DAY_VIEW_START_H + i)
/** 周视图时间轴：0–24 点，与常见周历一致 */
const WEEK_VIEW_START_H = 0
const WEEK_VIEW_END_H = 24
const WEEK_VIEW_HOUR_ROWS = Array.from({ length: WEEK_VIEW_END_H - WEEK_VIEW_START_H }, (_, i) => WEEK_VIEW_START_H + i)
/** 块高度低于此（px）时只展示标题，不展示时段行 */
const DAY_VIEW_MIN_HEIGHT_FOR_TIME = 52
/** 日/周视图初次进入时默认滚到该整点（0–8 点仍可向上滚动查看） */
const CALENDAR_DEFAULT_SCROLL_HOUR = 8

function scheduleMidnightMinutes(hm: string): number {
  const parts = hm.split(":")
  const h = Number(parts[0])
  const mi = Number(parts[1] ?? 0)
  return h * 60 + mi
}

function shiftCalendarDay(y: number, m: number, d: number, delta: number): { y: number; m: number; d: number } {
  const dt = new Date(y, m - 1, d + delta)
  return { y: dt.getFullYear(), m: dt.getMonth() + 1, d: dt.getDate() }
}

function ymdToIsoCal(y: number, m: number, d: number) {
  return `${y}-${pad2Cal(m)}-${pad2Cal(d)}`
}

/** 以周日为一周起始（与截图「周日…周六」一致） */
function startOfWeekSundayYmd(y: number, m: number, d: number): { y: number; m: number; d: number } {
  const dt = new Date(y, m - 1, d)
  const dow = dt.getDay()
  const s = new Date(dt)
  s.setDate(dt.getDate() - dow)
  return { y: s.getFullYear(), m: s.getMonth() + 1, d: s.getDate() }
}

function buildMonthGridCells(
  year: number,
  month: number
): { iso: string; inCurrentMonth: boolean; display: number }[] {
  const first = new Date(year, month - 1, 1)
  const startPad = first.getDay()
  const iter = new Date(year, month - 1, 1 - startPad)
  const cells: { iso: string; inCurrentMonth: boolean; display: number }[] = []
  for (let i = 0; i < 42; i++) {
    const y = iter.getFullYear()
    const m = iter.getMonth() + 1
    const d = iter.getDate()
    cells.push({
      iso: ymdToIsoCal(y, m, d),
      inCurrentMonth: m === month && y === year,
      display: d,
    })
    iter.setDate(iter.getDate() + 1)
  }
  return cells
}

function weekRangeTitle(ws: { y: number; m: number; d: number }): string {
  const we = shiftCalendarDay(ws.y, ws.m, ws.d, 6)
  if (ws.y === we.y && ws.m === we.m) {
    return `${ws.y}年${ws.m}月`
  }
  if (ws.y === we.y) {
    return `${ws.y}年${ws.m}月${ws.d}日 – ${we.m}月${we.d}日`
  }
  return `${ws.y}年${ws.m}月${ws.d}日 – ${we.y}年${we.m}月${we.d}日`
}

const WEEK_HEADER_LABELS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]

function scheduleResolvedTypeId(item: VvScheduleItem): string {
  return item.calendarTypeId?.trim() || CAL_DEFAULT_ID
}

function scheduleColorForType(typeId: string, types: VvUserCalendarType[]): string {
  return types.find((t) => t.id === typeId)?.color ?? "#1890ff"
}

/** 将 #RRGGBB 转为 rgba，用于日程块浅底、描边 */
function scheduleHexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "")
  if (h.length !== 6) return hex
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export type IsScheduleItemPastOptions = {
  /** 「今日日程」卡片：带「今天」标签的条目一律视为未结束（不置灰、可修改） */
  treatDateLabelTodayAsNotPast?: boolean
}

/** 日程结束时间早于当前时刻则视为「已过去」 */
export function isScheduleItemPast(
  item: VvScheduleItem,
  ref: Date = new Date(),
  opts?: IsScheduleItemPastOptions
): boolean {
  if (item.status === "cancelled") return false
  if (opts?.treatDateLabelTodayAsNotPast && item.dateLabel === "今天") return false
  const dateStr = item.calendarDate?.trim()
  const endHm = item.end?.trim() || "23:59"
  const [eh, em] = endHm.split(":").map((x) => Number(x) || 0)
  if (dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [yy, mm, dd] = dateStr.split("-").map(Number)
    const endMs = new Date(yy, mm - 1, dd, eh, em, 59, 999).getTime()
    return endMs < ref.getTime()
  }
  if (item.dateLabel === "今天") {
    const now = ref
    const endToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), eh, em, 59, 999).getTime()
    return endToday < now.getTime()
  }
  if (item.dateLabel === "昨天") return true
  return false
}

/** 当前用户是否可视为组织人：显式 organizerName 优先；否则以参与人首位为准（与新建日程「当前用户在首位」一致） */
export function isScheduleSelfOrganizer(item: VvScheduleItem): boolean {
  const trimmed = item.organizerName?.trim() ?? ""
  return (
    (trimmed !== "" && trimmed === SCHEDULE_CURRENT_USER_NAME) ||
    (trimmed === "" && item.attendees[0] === SCHEDULE_CURRENT_USER_NAME)
  )
}

/** 「全部日程」标题栏：月份下拉内的月历（与设计稿一致：YYYY-MM 抬头、选中蓝底、今） */
function ScheduleAllListMonthPickerPanel({
  viewY,
  viewM,
  selectedIso,
  todayIso,
  hasEventOnDate,
  onPrevMonth,
  onNextMonth,
  onSelectIso,
}: {
  viewY: number
  viewM: number
  selectedIso: string | null
  todayIso: string
  hasEventOnDate: (iso: string) => boolean
  onPrevMonth: () => void
  onNextMonth: () => void
  onSelectIso: (iso: string) => void
}) {
  const cells = buildMonthGridCells(viewY, viewM)
  return (
    <div className="w-[min(100vw-2rem,296px)] rounded-xl border border-[#e3e8ef] bg-white p-3 shadow-[0_8px_28px_rgba(15,23,42,0.12)]">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[length:var(--font-size-sm)] font-[var(--font-weight-semibold)] text-[#1e293b]">
          {viewY}-{pad2Cal(viewM)}
        </span>
        <div className="flex shrink-0 gap-0.5">
          <button
            type="button"
            className="rounded-md p-1 text-[#64748b] transition-colors hover:bg-[#e8f0fe] hover:text-[#1890ff]"
            onClick={onPrevMonth}
            aria-label="上一月"
          >
            <ChevronLeft className="size-4" strokeWidth={2} />
          </button>
          <button
            type="button"
            className="rounded-md p-1 text-[#64748b] transition-colors hover:bg-[#e8f0fe] hover:text-[#1890ff]"
            onClick={onNextMonth}
            aria-label="下一月"
          >
            <ChevronRight className="size-4" strokeWidth={2} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] font-[var(--font-weight-medium)] text-[#94a3b8]">
        {WEEKDAYS_MINI_CAL.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-0.5">
        {cells.map((cell) => {
          const isSelected = selectedIso === cell.iso
          const isToday = cell.iso === todayIso && cell.inCurrentMonth
          return (
            <div key={cell.iso} className="aspect-square p-px">
              <button
                type="button"
                onClick={() => onSelectIso(cell.iso)}
                className="flex size-full flex-col items-center justify-center gap-0.5 rounded-lg py-0.5 text-[11px] transition-colors"
              >
                <span
                  className={cn(
                    "flex size-7 items-center justify-center rounded-lg leading-none transition-colors",
                    isSelected && "bg-[#1890ff] font-[var(--font-weight-medium)] text-white shadow-sm",
                    !isSelected && isToday && "bg-[#e8f4ff] font-[var(--font-weight-medium)] text-[#1890ff]",
                    !isSelected && !isToday && cell.inCurrentMonth && "text-[#334155] hover:bg-[#e8f0fe]",
                    !cell.inCurrentMonth && "text-[#cbd5e1] hover:bg-[#f1f5f9]"
                  )}
                >
                  {isToday && !isSelected ? "今" : cell.display}
                </span>
                {hasEventOnDate(cell.iso) ? (
                  <span
                    className={cn(
                      "h-1 w-1 shrink-0 rounded-full",
                      isSelected ? "bg-white/90" : "bg-[#c5cdd9]"
                    )}
                    aria-hidden
                  />
                ) : null}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** 列表中无 preferred 当日条目时：滚到不早于该日的最近一天，否则滚到不晚于该日的最近一天 */
function listScrollNearestDayIso(preferredIso: string, sortedDayIsos: string[]): string | null {
  if (!sortedDayIsos.length) return null
  if (sortedDayIsos.includes(preferredIso)) return preferredIso
  const next = sortedDayIsos.find((d) => d >= preferredIso)
  if (next) return next
  for (let i = sortedDayIsos.length - 1; i >= 0; i--) {
    if (sortedDayIsos[i] < preferredIso) return sortedDayIsos[i]
  }
  return sortedDayIsos[0]
}

function scheduleAllDefaultOwnVisible(types: VvUserCalendarType[]): Record<string, boolean> {
  const o: Record<string, boolean> = {}
  for (const c of types) o[c.id] = true
  return o
}

function scheduleAllDefaultSubVisible(subs: { id: string }[]): Record<string, boolean> {
  const o: Record<string, boolean> = {}
  for (const s of subs) o[s.id] = true
  return o
}

/** 聊天内「全部日程」卡片：布局与独立弹层一致，套 vvCardSurface */
function ScheduleAllListBlock({
  items: initialItems,
  initialViewMode,
  initialOwnCalendarsVisible,
  initialSubscribedCalendarsVisible,
  onVvAction,
  schedulePanelAppId,
  schedulePanelSurface,
}: {
  items: VvScheduleItem[]
  initialViewMode?: "list" | "day" | "week" | "month"
  /** 本卡片独立：与消息 payload 绑定，不与其他卡片或底栏同步 */
  initialOwnCalendarsVisible?: Record<string, boolean>
  initialSubscribedCalendarsVisible?: Record<string, boolean>
  onVvAction?: VvActionHandler
  schedulePanelAppId: string | null
  schedulePanelSurface: VvScheduleSideSheetSurface
}) {
  const [liveItems, setLiveItems] = React.useState<VvScheduleItem[]>(() => initialItems)
  const sideSheet = useVvScheduleSideSheetOptional()

  React.useEffect(() => {
    setLiveItems(initialItems)
  }, [initialItems])

  const openDetail = (ev: VvScheduleItem) => {
    sideSheet?.openScheduleSideSheet(ev, {
      appId: schedulePanelAppId,
      surface: schedulePanelSurface,
      floatingHostAppId: schedulePanelSurface === "floating" ? schedulePanelAppId : undefined,
      treatDateLabelTodayAsNotPast: false,
    })
  }

  const [{ y: viewY, m: viewM }, setYm] = React.useState(() => {
    const n = new Date()
    return { y: n.getFullYear(), m: n.getMonth() + 1 }
  })
  const [viewMode, setViewMode] = React.useState<"list" | "day" | "week" | "month">(
    () => initialViewMode ?? "list"
  )
  /** 月历下拉点选日期：列表模式下用于滚动定位；日视图与 focus 同步；列表默认选中「今天」便于首次打开锚定到今天 */
  const [selectedDay, setSelectedDay] = React.useState<number | null>(() => {
    if ((initialViewMode ?? "list") !== "list") return null
    return new Date().getDate()
  })
  const [weekStart, setWeekStart] = React.useState(() => {
    const n = new Date()
    return startOfWeekSundayYmd(n.getFullYear(), n.getMonth() + 1, n.getDate())
  })

  const calCtx = useUserCalendars()
  const userCalendarTypes = calCtx.calendarTypes
  const subscribedCalendars = calCtx.subscribedCalendars

  const hadOwnPreset = initialOwnCalendarsVisible != null
  const hadSubPreset = initialSubscribedCalendarsVisible != null

  const [ownCalendarsVisible, setOwnCalendarsVisible] = React.useState<Record<string, boolean>>(() =>
    initialOwnCalendarsVisible ?? scheduleAllDefaultOwnVisible(userCalendarTypes)
  )
  const [subscribedVisible, setSubscribedVisible] = React.useState<Record<string, boolean>>(() =>
    initialSubscribedCalendarsVisible ?? scheduleAllDefaultSubVisible(subscribedCalendars)
  )

  React.useEffect(() => {
    setOwnCalendarsVisible((prev) => {
      const next = { ...prev }
      let changed = false
      for (const c of userCalendarTypes) {
        if (next[c.id] === undefined) {
          next[c.id] = !hadOwnPreset
          changed = true
        }
      }
      return changed ? next : prev
    })
  }, [userCalendarTypes, hadOwnPreset])

  React.useEffect(() => {
    setSubscribedVisible((prev) => {
      const next = { ...prev }
      let changed = false
      for (const s of subscribedCalendars) {
        if (next[s.id] === undefined) {
          next[s.id] = !hadSubPreset
          changed = true
        }
      }
      return changed ? next : prev
    })
  }, [subscribedCalendars, hadSubPreset])

  const listScrollRef = React.useRef<HTMLDivElement>(null)
  const dayGridScrollRef = React.useRef<HTMLDivElement>(null)
  const weekGridScrollRef = React.useRef<HTMLDivElement>(null)
  const prevViewModeRef = React.useRef(viewMode)
  const listMonthScrollSyncRef = React.useRef<{ y: number; m: number } | null>(null)
  const [monthPickerOpen, setMonthPickerOpen] = React.useState(false)
  const [managedFilterOpen, setManagedFilterOpen] = React.useState(false)
  const [subscribedFilterOpen, setSubscribedFilterOpen] = React.useState(false)

  React.useEffect(() => {
    if (viewMode !== "day") return
    if (selectedDay !== null) return
    const n = new Date()
    if (viewY === n.getFullYear() && viewM === n.getMonth() + 1) {
      setSelectedDay(n.getDate())
    } else {
      setSelectedDay(1)
    }
  }, [viewMode, selectedDay, viewY, viewM])

  const prefix = parseYmCal(viewY, viewM)
  const focusIsoForDay = React.useMemo(() => {
    if (selectedDay !== null) return `${viewY}-${pad2Cal(viewM)}-${pad2Cal(selectedDay)}`
    const n = new Date()
    if (viewY === n.getFullYear() && viewM === n.getMonth() + 1) return `${viewY}-${pad2Cal(viewM)}-${pad2Cal(n.getDate())}`
    return `${viewY}-${pad2Cal(viewM)}-01`
  }, [viewY, viewM, selectedDay])

  const focusYmd = React.useMemo(() => {
    const [y, mo, d] = focusIsoForDay.split("-").map(Number)
    return { y, m: mo, d }
  }, [focusIsoForDay])

  const visibleOwnTypeIds = React.useMemo(() => {
    const ids = new Set<string>()
    for (const c of userCalendarTypes) {
      if (ownCalendarsVisible[c.id] !== false) ids.add(c.id)
    }
    return ids
  }, [userCalendarTypes, ownCalendarsVisible])

  const filteredByCalendar = React.useMemo(
    () => liveItems.filter((it) => visibleOwnTypeIds.has(scheduleResolvedTypeId(it))),
    [liveItems, visibleOwnTypeIds]
  )

  const activeSubscribed = React.useMemo(
    () => subscribedCalendars.filter((s) => subscribedVisible[s.id] !== false),
    [subscribedCalendars, subscribedVisible]
  )

  const dayColumnEvents = React.useMemo(
    () => sortByStart(filteredByCalendar.filter((i) => i.calendarDate === focusIsoForDay)),
    [filteredByCalendar, focusIsoForDay]
  )

  const allByDay = React.useMemo(() => {
    const m = new Map<string, VvScheduleItem[]>()
    for (const it of filteredByCalendar) {
      const k = it.calendarDate?.trim()
      if (!k) continue
      if (!m.has(k)) m.set(k, [])
      m.get(k)!.push(it)
    }
    const keys = [...m.keys()].sort()
    return keys.map((k) => ({ date: k, events: sortByStart(m.get(k)!) }))
  }, [filteredByCalendar])

  /** 列表视图：只展示当前所选年月（与标题栏月份、月历下拉一致） */
  const listByDayForMonth = React.useMemo(
    () => allByDay.filter((b) => b.date.startsWith(prefix)),
    [allByDay, prefix]
  )

  const today = new Date()
  const todayIso = `${today.getFullYear()}-${pad2Cal(today.getMonth() + 1)}-${pad2Cal(today.getDate())}`

  const eventsByDate = React.useMemo(() => {
    const m = new Map<string, VvScheduleItem[]>()
    for (const it of filteredByCalendar) {
      const k = it.calendarDate?.trim()
      if (!k) continue
      if (!m.has(k)) m.set(k, [])
      m.get(k)!.push(it)
    }
    for (const k of [...m.keys()]) {
      m.set(k, sortByStart(m.get(k)!))
    }
    return m
  }, [filteredByCalendar])

  /**
   * 列表内滚动：首次打开 / 当前月且未选手动日期时锚定到今天（无当日日程则最近一日）；
   * 月历点选日期时定位；从其他 tab 切回「列表」不改变滚动位置。
   */
  React.useEffect(() => {
    const prev = prevViewModeRef.current
    if (viewMode !== "list") {
      prevViewModeRef.current = viewMode
      return
    }
    const enteredListFromOtherTab = prev !== "list"
    prevViewModeRef.current = viewMode
    if (enteredListFromOtherTab) return

    const datesInList = listByDayForMonth.map((b) => b.date)
    if (!datesInList.length) return

    const n = new Date()
    const isViewingCurrentMonth = viewY === n.getFullYear() && viewM === n.getMonth() + 1

    let preferredIso: string | null = null
    if (selectedDay !== null) {
      preferredIso = `${viewY}-${pad2Cal(viewM)}-${pad2Cal(selectedDay)}`
    } else if (isViewingCurrentMonth) {
      preferredIso = todayIso
    }

    if (!preferredIso) return

    const scrollIso = listScrollNearestDayIso(preferredIso, datesInList)
    if (!scrollIso) return

    requestAnimationFrame(() => {
      const id = `schedule-day-${scrollIso}`
      const el = listScrollRef.current?.querySelector(`#${CSS.escape(id)}`)
      if (!el) return
      el.scrollIntoView({ block: "start", behavior: "auto" })
    })
  }, [viewMode, selectedDay, viewY, viewM, listByDayForMonth, todayIso])

  /** 切换列表所属月份时滚回顶部，与标题栏月份一致 */
  React.useEffect(() => {
    if (viewMode !== "list") return
    const prev = listMonthScrollSyncRef.current
    listMonthScrollSyncRef.current = { y: viewY, m: viewM }
    if (prev !== null && (prev.y !== viewY || prev.m !== viewM)) {
      listScrollRef.current?.scrollTo({ top: 0, behavior: "auto" })
    }
  }, [viewY, viewM, viewMode])

  React.useEffect(() => {
    if (viewMode !== "day") return
    const el = dayGridScrollRef.current
    if (!el) return
    const targetTop = CALENDAR_DEFAULT_SCROLL_HOUR * DAY_VIEW_PX_PER_HOUR
    requestAnimationFrame(() => {
      const max = Math.max(0, el.scrollHeight - el.clientHeight)
      el.scrollTop = Math.min(targetTop, max)
    })
  }, [viewMode, focusIsoForDay])

  React.useEffect(() => {
    if (viewMode !== "week") return
    const el = weekGridScrollRef.current
    if (!el) return
    const targetTop = CALENDAR_DEFAULT_SCROLL_HOUR * DAY_VIEW_PX_PER_HOUR
    requestAnimationFrame(() => {
      const max = Math.max(0, el.scrollHeight - el.clientHeight)
      el.scrollTop = Math.min(targetTop, max)
    })
  }, [viewMode, weekStart])

  const listSelectedIso =
    selectedDay !== null ? `${viewY}-${pad2Cal(viewM)}-${pad2Cal(selectedDay)}` : null

  const hasEventOnDate = React.useCallback(
    (iso: string) => (eventsByDate.get(iso)?.length ?? 0) > 0,
    [eventsByDate]
  )

  const handleMonthPickerSelectIso = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number)
    setYm({ y, m })
    setSelectedDay(d)
    if (viewMode === "week") {
      setWeekStart(startOfWeekSundayYmd(y, m, d))
    }
    setMonthPickerOpen(false)
  }

  const shiftMonth = (delta: number) => {
    setYm(({ y, m }) => {
      let nm = m + delta
      let ny = y
      while (nm > 12) {
        nm -= 12
        ny += 1
      }
      while (nm < 1) {
        nm += 12
        ny -= 1
      }
      return { y: ny, m: nm }
    })
    setSelectedDay(null)
  }

  const goToday = () => {
    const d = new Date()
    setYm({ y: d.getFullYear(), m: d.getMonth() + 1 })
    setSelectedDay(d.getDate())
    setWeekStart(startOfWeekSundayYmd(d.getFullYear(), d.getMonth() + 1, d.getDate()))
  }

  const shiftWeek = (delta: number) => {
    setWeekStart((ws) => shiftCalendarDay(ws.y, ws.m, ws.d, delta * 7))
  }

  const weekDayCells = React.useMemo(() => {
    const out: { iso: string; d: number; wdLabel: string }[] = []
    let cur = { ...weekStart }
    for (let i = 0; i < 7; i++) {
      const dt = new Date(cur.y, cur.m - 1, cur.d)
      out.push({
        iso: ymdToIsoCal(cur.y, cur.m, cur.d),
        d: cur.d,
        wdLabel: WEEK_HEADER_LABELS[dt.getDay()],
      })
      cur = shiftCalendarDay(cur.y, cur.m, cur.d, 1)
    }
    return out
  }, [weekStart])

  const monthGridCells = React.useMemo(() => buildMonthGridCells(viewY, viewM), [viewY, viewM])

  const shiftFocusDay = (delta: number) => {
    const next = shiftCalendarDay(focusYmd.y, focusYmd.m, focusYmd.d, delta)
    setYm({ y: next.y, m: next.m })
    setSelectedDay(next.d)
  }

  const gridBodyHeight = (DAY_VIEW_END_H - DAY_VIEW_START_H) * DAY_VIEW_PX_PER_HOUR
  const weekGridBodyHeight = (WEEK_VIEW_END_H - WEEK_VIEW_START_H) * DAY_VIEW_PX_PER_HOUR

  const monthPickerSelectedIso =
    viewMode === "list" || viewMode === "month" ? listSelectedIso : focusIsoForDay

  const monthPickerPanel = (
    <ScheduleAllListMonthPickerPanel
      viewY={viewY}
      viewM={viewM}
      selectedIso={monthPickerSelectedIso}
      todayIso={todayIso}
      hasEventOnDate={hasEventOnDate}
      onPrevMonth={() => shiftMonth(-1)}
      onNextMonth={() => shiftMonth(1)}
      onSelectIso={handleMonthPickerSelectIso}
    />
  )

  const managedCalendarsFilterPopover = (
    <Popover open={managedFilterOpen} onOpenChange={setManagedFilterOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-0.5 rounded-lg border-[#e2e8f0] bg-white px-2.5 text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-[#334155] shadow-none hover:bg-[#f8fafc]"
        >
          我管理的
          <ChevronDown
            className={cn("size-3.5 opacity-70 transition-transform", managedFilterOpen && "rotate-180")}
            strokeWidth={2}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="z-[80] w-[min(92vw,288px)] max-h-[min(72vh,400px)] overflow-y-auto rounded-xl border border-[#e3e8ef] p-0 shadow-lg"
      >
        <div className="p-3">
          <div className="rounded-lg border border-[#e8ecf2] bg-white">
            <div className="px-2.5 py-2 text-[11px] font-[var(--font-weight-semibold)] text-[#334155]">我管理的</div>
            <div className="space-y-1.5 border-t border-[#f1f5f9] px-2.5 py-2.5">
              {userCalendarTypes.map((cal) => (
                <div key={cal.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={ownCalendarsVisible[cal.id] !== false}
                    onChange={() =>
                      setOwnCalendarsVisible((prev) => ({
                        ...prev,
                        [cal.id]: prev[cal.id] === false ? true : false,
                      }))
                    }
                    className="size-3.5 shrink-0 rounded border-[#cbd5e1]"
                    style={{ accentColor: cal.color }}
                    aria-label={`显示 ${cal.name}`}
                  />
                  <span
                    className="size-2.5 shrink-0 rounded-full ring-1 ring-black/[0.06]"
                    style={{ backgroundColor: cal.color }}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1 truncate text-[11px] text-[#334155]">{cal.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )

  const subscribedCalendarsFilterPopover = (
    <Popover open={subscribedFilterOpen} onOpenChange={setSubscribedFilterOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-0.5 rounded-lg border-[#e2e8f0] bg-white px-2.5 text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-[#334155] shadow-none hover:bg-[#f8fafc]"
        >
          我订阅的
          <ChevronDown
            className={cn("size-3.5 opacity-70 transition-transform", subscribedFilterOpen && "rotate-180")}
            strokeWidth={2}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="z-[80] w-[min(92vw,288px)] max-h-[min(72vh,400px)] overflow-y-auto rounded-xl border border-[#e3e8ef] p-0 shadow-lg"
      >
        <div className="p-3">
          <div className="rounded-lg border border-[#e8ecf2] bg-white">
            <div className="px-2.5 py-2 text-[11px] font-[var(--font-weight-semibold)] text-[#334155]">我订阅的</div>
            <div className="space-y-1.5 border-t border-[#f1f5f9] px-2.5 py-2.5">
              {subscribedCalendars.length === 0 ? (
                <p className="py-2 text-center text-[11px] text-[#94a3b8]">暂无订阅</p>
              ) : (
                subscribedCalendars.map((sub) => (
                  <div key={sub.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={subscribedVisible[sub.id] !== false}
                      onChange={() =>
                        setSubscribedVisible((prev) => ({
                          ...prev,
                          [sub.id]: prev[sub.id] === false ? true : false,
                        }))
                      }
                      className="size-3.5 shrink-0 rounded border-[#cbd5e1]"
                      style={{ accentColor: sub.color }}
                      aria-label={`显示 ${sub.displayName} 忙碌`}
                    />
                    <span
                      className="size-2.5 shrink-0 rounded-full ring-1 ring-black/[0.06]"
                      style={{ backgroundColor: sub.color }}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1 truncate text-[11px] text-[#334155]">{sub.displayName}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )

  const scheduleToolbarCalendarFilters = (
    <>
      {managedCalendarsFilterPopover}
      {subscribedCalendarsFilterPopover}
    </>
  )

  return (
    <div className="w-full max-w-full overflow-hidden rounded-[12px] border border-[#e2e8f0] bg-white shadow-[0_4px_24px_rgba(15,23,42,0.06)]">
      <div className="border-b border-[#e8ecf2] bg-gradient-to-r from-[#eef6ff] via-white to-[#f8fafc] px-[var(--space-400)] py-[var(--space-300)]">
        <p className="text-[length:var(--font-size-lg)] font-[var(--font-weight-semibold)] tracking-tight text-[#1e293b]">
          全部日程
        </p>
      </div>
      <div className="flex h-[min(88vh,820px)] min-h-[min(88vh,820px)] max-h-[min(88vh,820px)] min-w-0 shrink-0">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#f8fafc]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e8ecf2] bg-white/95 px-3 py-2.5 backdrop-blur-[2px] md:px-4 md:py-3">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              {viewMode === "day" ? (
                <>
                  <Popover open={monthPickerOpen} onOpenChange={setMonthPickerOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex max-w-[min(100%,14rem)] items-center gap-1 truncate rounded-lg border border-transparent px-1 py-0.5 text-left text-[length:var(--font-size-base)] font-[var(--font-weight-semibold)] text-[#1e293b] transition-colors hover:bg-[#f1f5f9]"
                        aria-expanded={monthPickerOpen}
                      >
                        <span className="truncate tabular-nums">
                          {focusYmd.y}/{pad2Cal(focusYmd.m)}/{pad2Cal(focusYmd.d)}
                        </span>
                        <ChevronDown
                          className={cn("size-4 shrink-0 text-[#64748b] transition-transform", monthPickerOpen && "rotate-180")}
                          strokeWidth={2}
                        />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="start" sideOffset={8} className="z-[80] w-auto border-0 bg-transparent p-0 shadow-none">
                      {monthPickerPanel}
                    </PopoverContent>
                  </Popover>
                  <button
                    type="button"
                    className="rounded-md p-1 text-[#64748b] transition-colors hover:bg-[#e8f0fe] hover:text-[#1890ff]"
                    onClick={() => shiftFocusDay(-1)}
                    aria-label="上一天"
                  >
                    <ChevronLeft className="size-4" strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    className="rounded-md p-1 text-[#64748b] transition-colors hover:bg-[#e8f0fe] hover:text-[#1890ff]"
                    onClick={() => shiftFocusDay(1)}
                    aria-label="下一天"
                  >
                    <ChevronRight className="size-4" strokeWidth={2} />
                  </button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-lg border-[#d9e7ff] bg-[#f0f7ff] text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-[#1890ff] shadow-none hover:bg-[#e6f2ff]"
                    onClick={goToday}
                  >
                    今天
                  </Button>
                  {scheduleToolbarCalendarFilters}
                </>
              ) : viewMode === "week" ? (
                <>
                  <Popover open={monthPickerOpen} onOpenChange={setMonthPickerOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex max-w-[min(100%,16rem)] items-center gap-1 truncate rounded-lg border border-transparent px-1 py-0.5 text-left text-[length:var(--font-size-base)] font-[var(--font-weight-semibold)] text-[#1e293b] transition-colors hover:bg-[#f1f5f9]"
                        aria-expanded={monthPickerOpen}
                      >
                        <span className="truncate">{weekRangeTitle(weekStart)}</span>
                        <ChevronDown
                          className={cn("size-4 shrink-0 text-[#64748b] transition-transform", monthPickerOpen && "rotate-180")}
                          strokeWidth={2}
                        />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="start" sideOffset={8} className="z-[80] w-auto border-0 bg-transparent p-0 shadow-none">
                      {monthPickerPanel}
                    </PopoverContent>
                  </Popover>
                  <button
                    type="button"
                    className="rounded-md p-1 text-[#64748b] transition-colors hover:bg-[#e8f0fe] hover:text-[#1890ff]"
                    onClick={() => shiftWeek(-1)}
                    aria-label="上一周"
                  >
                    <ChevronLeft className="size-4" strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    className="rounded-md p-1 text-[#64748b] transition-colors hover:bg-[#e8f0fe] hover:text-[#1890ff]"
                    onClick={() => shiftWeek(1)}
                    aria-label="下一周"
                  >
                    <ChevronRight className="size-4" strokeWidth={2} />
                  </button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-lg border-[#d9e7ff] bg-[#f0f7ff] text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-[#1890ff] shadow-none hover:bg-[#e6f2ff]"
                    onClick={goToday}
                  >
                    今天
                  </Button>
                  {scheduleToolbarCalendarFilters}
                </>
              ) : (
                <>
                  <Popover open={monthPickerOpen} onOpenChange={setMonthPickerOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-lg border border-transparent px-1 py-0.5 text-[length:var(--font-size-base)] font-[var(--font-weight-semibold)] text-[#1e293b] transition-colors hover:bg-[#f1f5f9] tabular-nums"
                        aria-expanded={monthPickerOpen}
                      >
                        {viewY}/{pad2Cal(viewM)}
                        <ChevronDown
                          className={cn("size-4 text-[#64748b] transition-transform", monthPickerOpen && "rotate-180")}
                          strokeWidth={2}
                        />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="start" sideOffset={8} className="z-[80] w-auto border-0 bg-transparent p-0 shadow-none">
                      {monthPickerPanel}
                    </PopoverContent>
                  </Popover>
                  <button
                    type="button"
                    className="rounded-md p-1 text-[#64748b] transition-colors hover:bg-[#e8f0fe] hover:text-[#1890ff]"
                    onClick={() => shiftMonth(-1)}
                    aria-label="上一月"
                  >
                    <ChevronLeft className="size-4" strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    className="rounded-md p-1 text-[#64748b] transition-colors hover:bg-[#e8f0fe] hover:text-[#1890ff]"
                    onClick={() => shiftMonth(1)}
                    aria-label="下一月"
                  >
                    <ChevronRight className="size-4" strokeWidth={2} />
                  </button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-lg border-[#d9e7ff] bg-[#f0f7ff] text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-[#1890ff] shadow-none hover:bg-[#e6f2ff]"
                    onClick={goToday}
                  >
                    今天
                  </Button>
                  {scheduleToolbarCalendarFilters}
                </>
              )}
            </div>
            <div className="flex gap-0.5 rounded-[10px] bg-[#eef2f7] p-1">
              {(
                [
                  { id: "list" as const, label: "列表" },
                  { id: "day" as const, label: "日" },
                  { id: "week" as const, label: "周" },
                  { id: "month" as const, label: "月" },
                ] as const
              ).map((t) => {
                const active = viewMode === t.id
                const underlineTab = t.id === "day" || t.id === "week" || t.id === "month"
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      if (t.id === "list") setViewMode("list")
                      if (t.id === "day") setViewMode("day")
                      if (t.id === "week") {
                        const n = new Date()
                        const d =
                          selectedDay !== null
                            ? selectedDay
                            : viewY === n.getFullYear() && viewM === n.getMonth() + 1
                              ? n.getDate()
                              : 1
                        setWeekStart(startOfWeekSundayYmd(viewY, viewM, d))
                        setViewMode("week")
                      }
                      if (t.id === "month") setViewMode("month")
                    }}
                    className={cn(
                      "px-2.5 py-1.5 text-[length:var(--font-size-xs)] transition-colors md:px-3",
                      t.id === "list" && active && "rounded-lg bg-white font-[var(--font-weight-semibold)] text-[#1e293b] shadow-sm",
                      t.id === "list" && !active && "rounded-lg text-[#64748b] hover:text-[#1e293b]",
                      underlineTab &&
                        active &&
                        "rounded-lg border-b-[3px] border-[#1890ff] bg-transparent pb-[calc(0.375rem-3px)] font-[var(--font-weight-semibold)] text-[#1890ff] shadow-none",
                      underlineTab &&
                        !active &&
                        "rounded-lg border-b-[3px] border-transparent pb-[calc(0.375rem-3px)] text-[#64748b] hover:text-[#334155]"
                    )}
                  >
                    {t.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div ref={listScrollRef} className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
            {viewMode === "list" ? (
              listByDayForMonth.length === 0 ? (
                <p className="p-8 text-center text-[length:var(--font-size-sm)] text-[#94a3b8]">该月暂无日程</p>
              ) : (
                listByDayForMonth.map(({ date, events }) => {
                  const { day, week } = formatListDayHeaderCal(date)
                  const isTodayCol = date === todayIso
                  return (
                    <div key={date} id={`schedule-day-${date}`} className="scroll-mt-2 border-b border-[#eef2f6]">
                      <div className="flex gap-0">
                        <div
                          className={cn(
                            "flex w-[5.25rem] shrink-0 flex-col items-center justify-start border-r border-[#e8ecf2] py-3 md:w-24 md:py-4",
                            isTodayCol ? "bg-[#e8f4ff]/90" : "bg-[#f8fafc]"
                          )}
                        >
                          <span
                            className={cn(
                              "flex size-9 items-center justify-center rounded-full text-[length:var(--font-size-sm)] font-[var(--font-weight-semibold)]",
                              isTodayCol ? "bg-[#1890ff] text-white shadow-sm" : "text-[#334155]"
                            )}
                          >
                            {day}
                          </span>
                          <span className="mt-1 text-[11px] text-[#64748b]">{week}</span>
                        </div>
                        <div className="min-w-0 flex-1 space-y-2 bg-white py-2 pr-2 pl-1 md:py-3 md:pr-3">
                          {events.map((ev) => {
                            const accent = scheduleColorForType(scheduleResolvedTypeId(ev), userCalendarTypes)
                            const cancelled = ev.status === "cancelled"
                            const past = !cancelled && isScheduleItemPast(ev)
                            return (
                              <button
                                key={ev.id}
                                type="button"
                                onClick={() => openDetail(ev)}
                                className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-[#f8fafc] md:px-3 md:py-3"
                              >
                                <span
                                  className={cn(
                                    "h-10 w-1 shrink-0 self-center rounded-full",
                                    cancelled && "bg-[#cbd5e1]",
                                    past && !cancelled && "bg-[#cbd5e1]"
                                  )}
                                  style={!cancelled && !past ? { backgroundColor: accent } : undefined}
                                  aria-hidden
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                    <span
                                      className={cn(
                                        "tabular-nums text-[length:var(--font-size-sm)]",
                                        past || cancelled ? "text-[#94a3b8]" : "text-[#64748b]"
                                      )}
                                    >
                                      {ev.start}–{ev.end}
                                    </span>
                                    <span
                                      className={cn(
                                        "text-[length:var(--font-size-sm)] font-[var(--font-weight-semibold)]",
                                        cancelled && "text-[#94a3b8] line-through",
                                        past && !cancelled && "text-[#94a3b8]"
                                      )}
                                    >
                                      {ev.title}
                                    </span>
                                    {cancelled ? (
                                      <span className="rounded-md bg-[#f1f5f9] px-1.5 py-0.5 text-[10px] text-[#64748b]">
                                        已取消
                                      </span>
                                    ) : null}
                                    {past ? (
                                      <span className="rounded-md bg-[#f1f5f9] px-1.5 py-0.5 text-[10px] text-[#94a3b8]">
                                        已结束
                                      </span>
                                    ) : null}
                                    {!cancelled && !past && hasPendingRsvpCal(ev) ? (
                                      <span className="rounded-md bg-[#fff7e6] px-1.5 py-0.5 text-[10px] text-[#d46b08]">
                                        未响应
                                      </span>
                                    ) : null}
                                  </div>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )
                })
              )
            ) : viewMode === "day" ? (
              <div className="flex h-full min-h-0 flex-col bg-white">
                <div className="flex shrink-0 border-b border-[#e8ecf2] bg-[#fafbfd] text-[length:var(--font-size-xs)] text-[#64748b]">
                  <div className="flex w-[3.25rem] shrink-0 items-center py-2 pl-2 tabular-nums">GMT+08</div>
                  <div className="flex min-w-0 flex-1">
                    <div className="min-w-0 flex-1 truncate py-2 text-center text-[length:var(--font-size-sm)] font-[var(--font-weight-semibold)] text-[#334155]">
                      我的
                    </div>
                    {activeSubscribed.map((sub) => (
                      <div
                        key={sub.id}
                        className="min-w-0 max-w-[5.5rem] flex-1 truncate border-l border-[#e8ecf2] py-2 px-0.5 text-center text-[11px] font-[var(--font-weight-semibold)] text-[#334155]"
                        title={sub.displayName}
                      >
                        {sub.displayName}
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  ref={dayGridScrollRef}
                  className="relative flex min-h-0 flex-1 overflow-y-auto overflow-x-hidden"
                >
                  <div className="sticky left-0 z-[1] flex w-[3.25rem] shrink-0 flex-col border-r border-[#eef2f6] bg-[#f8fafc]">
                    {DAY_VIEW_HOUR_ROWS.map((h) => (
                      <div
                        key={h}
                        className="box-border flex shrink-0 items-start justify-end border-b border-[#f1f5f9] pr-2 pt-1.5 text-[11px] leading-[1.25] text-[#94a3b8] tabular-nums"
                        style={{ minHeight: DAY_VIEW_PX_PER_HOUR }}
                      >
                        {pad2Cal(h)}:00
                      </div>
                    ))}
                  </div>
                  <div className="flex min-h-0 min-w-0 flex-1 bg-white">
                    <div className="relative min-h-0 min-w-0 flex-1" style={{ minHeight: gridBodyHeight }}>
                      {DAY_VIEW_HOUR_ROWS.map((h) => (
                        <div
                          key={`grid-${h}`}
                          className="pointer-events-none absolute left-0 right-0 box-border border-b border-[#f1f5f9]"
                          style={{ top: (h - DAY_VIEW_START_H) * DAY_VIEW_PX_PER_HOUR, minHeight: DAY_VIEW_PX_PER_HOUR }}
                        />
                      ))}
                      {dayColumnEvents.map((ev) => {
                        const startM = scheduleMidnightMinutes(ev.start)
                        const endM = scheduleMidnightMinutes(ev.end)
                        const grid0 = DAY_VIEW_START_H * 60
                        const durMin = Math.max(endM - startM, 15)
                        let top = ((startM - grid0) / 60) * DAY_VIEW_PX_PER_HOUR
                        let height = (durMin / 60) * DAY_VIEW_PX_PER_HOUR
                        top = Math.max(0, top)
                        height = Math.max(height, 32)
                        const maxPx = gridBodyHeight
                        if (top + height > maxPx) height = Math.max(32, maxPx - top)
                        const showTime = height >= DAY_VIEW_MIN_HEIGHT_FOR_TIME
                        const cancelled = ev.status === "cancelled"
                        const accent = scheduleColorForType(scheduleResolvedTypeId(ev), userCalendarTypes)
                        return (
                          <button
                            key={ev.id}
                            type="button"
                            onClick={() => openDetail(ev)}
                            className={cn(
                              "absolute left-2 right-3 flex min-h-0 flex-col overflow-hidden rounded-[8px] border py-1.5 pl-2.5 pr-2 text-left shadow-[0_1px_4px_rgba(15,23,42,0.06)] transition-all hover:shadow-[0_2px_10px_rgba(15,23,42,0.08)]",
                              showTime ? "gap-0.5" : "justify-center gap-0",
                              cancelled && "border-[#e2e8f0] bg-[#f8fafc] text-[#94a3b8] line-through"
                            )}
                            style={
                              cancelled
                                ? { top, height, minHeight: 32 }
                                : {
                                    top,
                                    height,
                                    minHeight: 32,
                                    borderColor: scheduleHexToRgba(accent, 0.35),
                                    backgroundColor: scheduleHexToRgba(accent, 0.14),
                                  }
                            }
                          >
                            <span
                              className={cn(
                                "min-h-0 border-l-[4px] pl-2 text-left text-[length:var(--font-size-sm)] font-[var(--font-weight-semibold)] leading-snug text-[#1e293b]",
                                showTime ? "line-clamp-3" : "line-clamp-4",
                                cancelled && "border-[#cbd5e1]"
                              )}
                              style={!cancelled ? { borderLeftColor: accent } : undefined}
                            >
                              {ev.title}
                            </span>
                            {showTime ? (
                              <span className="shrink-0 pl-[12px] text-[11px] tabular-nums leading-tight text-[#64748b]">
                                {ev.start} — {ev.end}
                              </span>
                            ) : null}
                          </button>
                        )
                      })}
                    </div>
                    {activeSubscribed.map((sub) => (
                      <div
                        key={sub.id}
                        className="relative min-h-0 w-[4.25rem] shrink-0 border-l border-[#eef2f6] sm:w-[5.25rem]"
                        style={{ minHeight: gridBodyHeight }}
                      >
                        {DAY_VIEW_HOUR_ROWS.map((h) => (
                          <div
                            key={`subgrid-${sub.id}-${h}`}
                            className="pointer-events-none absolute left-0 right-0 box-border border-b border-[#f1f5f9]"
                            style={{ top: (h - DAY_VIEW_START_H) * DAY_VIEW_PX_PER_HOUR, minHeight: DAY_VIEW_PX_PER_HOUR }}
                          />
                        ))}
                        {sub.busyIntervals
                          .filter((b) => b.calendarDate === focusIsoForDay)
                          .map((b, bi) => {
                            const startM = scheduleMidnightMinutes(b.start)
                            const endM = scheduleMidnightMinutes(b.end)
                            const grid0 = DAY_VIEW_START_H * 60
                            const durMin = Math.max(endM - startM, 15)
                            let top = ((startM - grid0) / 60) * DAY_VIEW_PX_PER_HOUR
                            let height = (durMin / 60) * DAY_VIEW_PX_PER_HOUR
                            top = Math.max(0, top)
                            height = Math.max(height, 24)
                            const maxPx = gridBodyHeight
                            if (top + height > maxPx) height = Math.max(24, maxPx - top)
                            return (
                              <div
                                key={`${sub.id}-busy-${bi}`}
                                className="pointer-events-none absolute left-0.5 right-0.5 flex items-center justify-center overflow-hidden rounded-md border text-[9px] font-[var(--font-weight-medium)] text-text-secondary"
                                style={{
                                  top,
                                  height,
                                  minHeight: 24,
                                  borderColor: `${sub.color}66`,
                                  backgroundColor: `${sub.color}30`,
                                }}
                                title={`${b.start}–${b.end} 忙碌`}
                              >
                                忙碌
                              </div>
                            )
                          })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : viewMode === "week" ? (
              <div className="flex h-full min-h-0 flex-col bg-white">
                <div className="flex shrink-0 border-b border-[#e8ecf2] bg-[#fafbfd]">
                  <div className="flex w-[3.25rem] shrink-0 items-end py-2 pl-2 text-[length:var(--font-size-xs)] tabular-nums text-[#94a3b8]">
                    GMT+08
                  </div>
                  <div className="grid min-w-0 flex-1 grid-cols-7">
                    {weekDayCells.map((cell) => {
                      const isTodayCol = cell.iso === todayIso
                      return (
                        <div
                          key={cell.iso}
                          className="border-l border-[#eef2f6] px-0.5 py-2 text-center md:px-1"
                        >
                          <div className="text-[11px] text-[#64748b]">{cell.wdLabel}</div>
                          <div className="mt-1 flex items-center justify-center gap-1">
                            <span
                              className={cn(
                                "flex size-7 items-center justify-center rounded-full text-[length:var(--font-size-xs)] font-[var(--font-weight-semibold)] tabular-nums",
                                isTodayCol ? "bg-[#1890ff] text-white shadow-sm" : "text-[#334155]"
                              )}
                            >
                              {cell.d}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div
                  ref={weekGridScrollRef}
                  className="relative flex min-h-0 flex-1 overflow-y-auto overflow-x-auto"
                >
                  <div className="sticky left-0 z-[1] flex w-[3.25rem] shrink-0 flex-col border-r border-[#eef2f6] bg-[#f8fafc]">
                    {WEEK_VIEW_HOUR_ROWS.map((h) => (
                      <div
                        key={h}
                        className="box-border flex shrink-0 items-start justify-end border-b border-[#f1f5f9] pr-2 pt-1.5 text-[11px] leading-[1.25] text-[#94a3b8] tabular-nums"
                        style={{ minHeight: DAY_VIEW_PX_PER_HOUR }}
                      >
                        {pad2Cal(h)}:00
                      </div>
                    ))}
                  </div>
                  <div className="grid min-h-0 min-w-[560px] flex-1 grid-cols-7 bg-white">
                    {weekDayCells.map((cell) => {
                      const colEvents = eventsByDate.get(cell.iso) ?? []
                      return (
                        <div
                          key={cell.iso}
                          className="relative min-h-0 min-w-0 border-l border-[#eef2f6]"
                          style={{ minHeight: weekGridBodyHeight }}
                        >
                          {WEEK_VIEW_HOUR_ROWS.map((h) => (
                            <div
                              key={`w-${cell.iso}-${h}`}
                              className="pointer-events-none absolute left-0 right-0 box-border border-b border-[#f1f5f9]"
                              style={{
                                top: (h - WEEK_VIEW_START_H) * DAY_VIEW_PX_PER_HOUR,
                                minHeight: DAY_VIEW_PX_PER_HOUR,
                              }}
                            />
                          ))}
                          {colEvents.map((ev) => {
                            const startM = scheduleMidnightMinutes(ev.start)
                            const endM = scheduleMidnightMinutes(ev.end)
                            const grid0 = WEEK_VIEW_START_H * 60
                            const durMin = Math.max(endM - startM, 15)
                            let top = ((startM - grid0) / 60) * DAY_VIEW_PX_PER_HOUR
                            let height = (durMin / 60) * DAY_VIEW_PX_PER_HOUR
                            top = Math.max(0, top)
                            height = Math.max(height, 28)
                            const maxPx = weekGridBodyHeight
                            if (top + height > maxPx) height = Math.max(28, maxPx - top)
                            const showTime = height >= DAY_VIEW_MIN_HEIGHT_FOR_TIME
                            const cancelled = ev.status === "cancelled"
                            const accent = scheduleColorForType(scheduleResolvedTypeId(ev), userCalendarTypes)
                            return (
                              <button
                                key={ev.id}
                                type="button"
                                onClick={() => openDetail(ev)}
                                className={cn(
                                  "absolute left-0.5 right-0.5 flex min-h-0 flex-col overflow-hidden rounded-[6px] border px-1 py-1 text-left text-[10px] shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-all hover:shadow-[0_2px_8px_rgba(15,23,42,0.08)] md:left-1 md:right-1",
                                  showTime ? "gap-0.5" : "justify-center gap-0",
                                  cancelled && "border-[#e2e8f0] bg-[#f8fafc] text-[#94a3b8] line-through"
                                )}
                                style={
                                  cancelled
                                    ? { top, height, minHeight: 28 }
                                    : {
                                        top,
                                        height,
                                        minHeight: 28,
                                        borderColor: scheduleHexToRgba(accent, 0.35),
                                        backgroundColor: scheduleHexToRgba(accent, 0.14),
                                      }
                                }
                              >
                                <span
                                  className={cn(
                                    "min-h-0 border-l-[3px] pl-1 font-[var(--font-weight-semibold)] leading-tight text-[#1e293b]",
                                    showTime ? "line-clamp-2" : "line-clamp-3",
                                    cancelled && "border-[#cbd5e1]"
                                  )}
                                  style={!cancelled ? { borderLeftColor: accent } : undefined}
                                >
                                  {ev.title}
                                </span>
                                {showTime ? (
                                  <span className="shrink-0 pl-[7px] text-[9px] tabular-nums leading-tight text-[#64748b]">
                                    {ev.start}
                                  </span>
                                ) : null}
                              </button>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="min-h-full bg-white p-2 md:p-3">
                <div className="grid grid-cols-7 border-b border-[#e8ecf2] py-2 text-center text-[11px] font-[var(--font-weight-medium)] text-[#64748b]">
                  {WEEK_HEADER_LABELS.map((w) => (
                    <span key={w}>{w}</span>
                  ))}
                </div>
                <div className="grid grid-cols-7 border-l border-t border-[#e8ecf2]">
                  {monthGridCells.map((cell) => {
                    const rowEvents = eventsByDate.get(cell.iso) ?? []
                    const isTodayCell = cell.iso === todayIso
                    const visible = rowEvents.slice(0, 4)
                    const more = rowEvents.length - visible.length
                    return (
                      <div
                        key={cell.iso}
                        className={cn(
                          "flex min-h-[7.5rem] flex-col border-b border-r border-[#eef2f6] p-1 md:min-h-[8.5rem]",
                          !cell.inCurrentMonth && "bg-[#f8fafc]/80",
                          isTodayCell && "bg-[#e8f4ff]/50"
                        )}
                      >
                        <div className="flex flex-wrap items-start justify-end gap-1">
                          <span
                            className={cn(
                              "flex size-6 items-center justify-center rounded-full text-[11px] font-[var(--font-weight-semibold)] tabular-nums md:size-7 md:text-xs",
                              !cell.inCurrentMonth && "text-[#cbd5e1]",
                              cell.inCurrentMonth && !isTodayCell && "text-[#334155]",
                              isTodayCell && "bg-[#1890ff] text-white shadow-sm"
                            )}
                          >
                            {cell.display}
                          </span>
                          {isTodayCell ? (
                            <span className="text-[10px] leading-6 text-[#1890ff] md:leading-7">今天</span>
                          ) : null}
                        </div>
                        <div className="mt-1 flex min-h-0 flex-1 flex-col gap-0.5">
                          {visible.map((ev) => {
                            const cancelled = ev.status === "cancelled"
                            const evAccent = scheduleColorForType(scheduleResolvedTypeId(ev), userCalendarTypes)
                            return (
                              <button
                                key={ev.id}
                                type="button"
                                onClick={() => openDetail(ev)}
                                className="flex w-full min-w-0 items-center gap-0.5 rounded-md px-0.5 py-0.5 text-left transition-colors hover:bg-[#f1f5f9]"
                              >
                                <span
                                  className={cn("h-3 w-1 shrink-0 rounded-full", cancelled && "bg-[#cbd5e1]")}
                                  style={!cancelled ? { backgroundColor: evAccent } : undefined}
                                  aria-hidden
                                />
                                {cancelled ? (
                                  <span className="shrink-0 rounded bg-[#f1f5f9] px-1 py-px text-[9px] text-[#64748b]">
                                    已取消
                                  </span>
                                ) : null}
                                <span className="shrink-0 tabular-nums text-[10px] text-[#64748b]">{ev.start}</span>
                                <span
                                  className={cn(
                                    "min-w-0 truncate text-[10px] font-[var(--font-weight-semibold)] text-[#1e293b] md:text-[11px]",
                                    cancelled && "text-[#94a3b8] line-through"
                                  )}
                                >
                                  {ev.title}
                                </span>
                                {!cancelled && hasPendingRsvpCal(ev) ? (
                                  <span className="shrink-0 rounded bg-[#fff7e6] px-1 py-px text-[9px] text-[#d46b08]">
                                    未响应
                                  </span>
                                ) : null}
                              </button>
                            )
                          })}
                          {more > 0 ? (
                            <span className="px-0.5 text-[10px] text-[#94a3b8]">还有 {more} 项</span>
                          ) : null}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function todoRowMetaVerb(item: VvTodoItem): string {
  if (item.metaVerb) return item.metaVerb
  if (item.status === "done") return "完成"
  return "推送"
}

function todoRowStatusBadge(item: VvTodoItem): { label: string; tone: "orange" | "gray" } | null {
  if (item.status === "pending") return { label: "处理中", tone: "orange" }
  if (item.status === "rejected") return { label: "已拒绝", tone: "gray" }
  if (item.status === "revoked") return { label: "已撤销", tone: "gray" }
  if (item.status === "done") return { label: "已完成", tone: "gray" }
  if (item.status === "cc") return { label: "已抄送", tone: "gray" }
  if (item.status === "draft") return { label: "草稿", tone: "gray" }
  return null
}

function TodoRow({ item, onAction }: { item: VvTodoItem; onAction?: VvActionHandler }) {
  const canProcess = canCurrentUserProcessTodo(item)
  const badge = todoRowStatusBadge(item)
  const tone = item.listTone ?? (item.type === "approval" ? "rose" : "emerald")
  const source = item.sourceLabel ?? item.owner
  const metaLead = `${item.time} · ${todoRowMetaVerb(item)}`
  const IconGlyph = item.type === "approval" ? FileCheck : Check
  const showDetail = item.status !== "revoked"
  const processBtnClass =
    "h-8 shrink-0 rounded-full border border-border bg-bg px-4 text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-text hover:bg-[var(--black-alpha-11)]"

  return (
    <div className="flex min-w-0 items-center gap-3 px-2 py-3">
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg",
          tone === "rose" ? "bg-rose-100" : "bg-emerald-100"
        )}
      >
        <IconGlyph className={cn("size-[18px]", tone === "rose" ? "text-rose-500" : "text-emerald-600")} strokeWidth={2} />
      </div>
        <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <span className="min-w-0 truncate text-[length:var(--font-size-sm)] font-[var(--font-weight-semibold)] text-text">
            {item.title}
          </span>
          {badge ? (
            <span
              className={cn(
                "shrink-0 rounded px-1.5 py-0.5 text-[11px] font-[var(--font-weight-medium)] leading-tight",
                badge.tone === "orange" ? "bg-orange-100 text-orange-700" : "bg-[var(--black-alpha-11)] text-text-secondary"
              )}
            >
              {badge.label}
            </span>
          ) : null}
          </div>
        <div className="mt-1 flex min-w-0 items-center gap-1 truncate text-[length:var(--font-size-xs)] text-text-secondary">
          <span className="shrink-0">{metaLead}</span>
          <span className="shrink-0">·</span>
          {(item.sourceScope ?? "company") === "personal" ? (
            <User className="size-3 shrink-0 opacity-70" strokeWidth={2} />
          ) : (
            <Building2 className="size-3 shrink-0 opacity-70" strokeWidth={2} />
          )}
          <span className="min-w-0 truncate">{source}</span>
        </div>
      </div>
      {canProcess ? (
        <Button type="button" variant="outline" size="sm" className={processBtnClass} onClick={() => onAction?.("todo-detail", item)}>
          处理
        </Button>
      ) : showDetail ? (
        <Button type="button" variant="outline" size="sm" className={processBtnClass} onClick={() => onAction?.("todo-detail", item)}>
          查看详情
        </Button>
      ) : null}
    </div>
  )
}

function MailRow({ item, onAction }: { item: VvMailItem; onAction?: VvActionHandler }) {
  return (
    <Card className={vvCardListRow}>
      <CardContent className="flex items-center justify-between gap-[var(--space-400)] p-[var(--space-400)]">
        <div className="min-w-0 flex-1">
          <div className="truncate text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text">{item.subject}</div>
          <div className="mt-[var(--space-100)] truncate text-[length:var(--font-size-xs)] text-text-secondary">
            {item.time} / {item.sender} / {item.status === "unread" ? "未读" : "已读"}
          </div>
        </div>
        <Button size="sm" variant="secondary" className="shrink-0 rounded-[var(--radius-md)]" onClick={() => onAction?.("mail-detail", item)}>
          查看详情
        </Button>
      </CardContent>
    </Card>
  )
}

function MeetingRow({ item, variant, onAction }: { item: VvMeetingItem; variant?: "join" | "default"; onAction?: VvActionHandler }) {
  const label = variant === "join" ? "加入" : "查看详情"
  return (
    <Card className={vvCardListRow}>
      <CardContent className="flex items-center justify-between gap-[var(--space-400)] p-[var(--space-400)]">
        <div className="min-w-0 flex-1">
          <div className="truncate text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text">{item.title}</div>
          <div className="mt-[var(--space-100)] truncate text-[length:var(--font-size-xs)] text-text-secondary">
            {item.time} · {meetingStatusText(item.status)} · {item.room}
          </div>
        </div>
        <Button
          size="sm"
          variant="secondary"
          className="shrink-0 rounded-[var(--radius-md)]"
          onClick={() => onAction?.(variant === "join" ? "meeting-join" : "meeting-detail", item)}
        >
          {label}
        </Button>
      </CardContent>
    </Card>
  )
}

function RecordRow({ item, onAction }: { item: VvRecordItem; onAction?: VvActionHandler }) {
  return (
    <Card className={vvCardListRow}>
      <CardContent className="flex items-center justify-between gap-[var(--space-400)] p-[var(--space-400)]">
        <div className="min-w-0 flex-1">
          <div className="truncate text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text">{item.title}</div>
          <div className="mt-[var(--space-100)] truncate text-[length:var(--font-size-xs)] text-text-secondary">{item.time}</div>
        </div>
        <Button size="sm" variant="secondary" className="shrink-0 rounded-[var(--radius-md)]" onClick={() => onAction?.("record-detail", item)}>
          查看详情
        </Button>
      </CardContent>
    </Card>
  )
}

function DriveRow({ item, onAction }: { item: VvDriveItem; onAction?: VvActionHandler }) {
  return (
    <Card className={vvCardListRow}>
      <CardContent className="flex items-center justify-between gap-[var(--space-400)] p-[var(--space-400)]">
        <div className="min-w-0 flex-1">
          <div className="truncate text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text">{item.name}</div>
          <div className="mt-[var(--space-100)] truncate text-[length:var(--font-size-xs)] text-text-secondary">
            {item.size} · {item.location}
          </div>
        </div>
        <Button size="sm" variant="secondary" className="shrink-0 rounded-[var(--radius-md)]" onClick={() => onAction?.("drive-focus", item)}>
          查看
        </Button>
      </CardContent>
    </Card>
  )
}

function DocRow({ item, onAction }: { item: VvDocItem; onAction?: VvActionHandler }) {
  return (
    <Card className={vvCardListRow}>
      <CardContent className="flex items-center justify-between gap-[var(--space-400)] p-[var(--space-400)]">
        <div className="min-w-0 flex-1">
          <div className="truncate text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text">{item.title}</div>
          <div className="mt-[var(--space-100)] truncate text-[length:var(--font-size-xs)] text-text-secondary">
            {item.updatedAt} · {item.location}
          </div>
        </div>
        <Button size="sm" variant="secondary" className="shrink-0 rounded-[var(--radius-md)]" onClick={() => onAction?.("doc-detail", item)}>
          查看详情
        </Button>
      </CardContent>
    </Card>
  )
}

function ChoiceBlock({
  payload,
  onVvAction,
  schedulePanelAppId,
  schedulePanelSurface,
  meetingItems = [],
}: {
  payload: Extract<VvAssistantPayload, { kind: "choice" }>
  onVvAction?: VvActionHandler
  schedulePanelAppId: string | null
  schedulePanelSurface: VvScheduleSideSheetSurface
  meetingItems?: VvMeetingItem[]
}) {
  const sideSheet = useVvScheduleSideSheetOptional()
  const scheduleChoice =
    payload.followUp === "schedule-edit" || payload.followUp === "schedule-cancel"

  const openScheduleDetail = (item: VvScheduleItem) => {
    sideSheet?.openScheduleSideSheet(item, {
      appId: schedulePanelAppId,
      surface: schedulePanelSurface,
      floatingHostAppId: schedulePanelSurface === "floating" ? schedulePanelAppId : undefined,
      treatDateLabelTodayAsNotPast: true,
    })
  }

  const meetingById = React.useMemo(() => {
    const map = new Map<string, VvMeetingItem>()
    for (const m of meetingItems) map.set(m.id, m)
    return map
  }, [meetingItems])

  return (
    <Card className={cn(vvCardSurface, "gap-0")}>
      <CardHeader>
        <CardTitle className={vvCardTitle}>{payload.title}</CardTitle>
        <CardDescription className={vvCardDesc}>{payload.description}</CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-0">
        <div>
          {payload.items.map((it, index) => {
            const sch = it.scheduleItem
            if (scheduleChoice && sch) {
              return (
                <div key={it.id} className={cn(index > 0 && "mt-2 border-t border-border pt-3")}>
                  <ScheduleRow
                    item={sch}
                    onOpenDetail={() => openScheduleDetail(sch)}
                    onSelectRow={() => onVvAction?.("vv-choice", { followUp: payload.followUp, id: it.id })}
                    linkedMeeting={sch.linkedMeetingId ? meetingById.get(sch.linkedMeetingId) ?? null : null}
                    onVvAction={onVvAction}
                  />
                </div>
              )
            }
            return (
              <div key={it.id} className={cn(index > 0 && "mt-2 border-t border-border pt-3")}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-[var(--space-300)] rounded-[var(--radius-md)] border border-border bg-bg-secondary px-[var(--space-400)] py-[var(--space-300)] text-left transition-colors hover:bg-[var(--black-alpha-11)]"
                  onClick={() => onVvAction?.("vv-choice", { followUp: payload.followUp, id: it.id })}
                >
                  <div className="min-w-0">
                    <div className="font-[var(--font-weight-medium)] text-text text-[length:var(--font-size-sm)]">{it.title}</div>
                    <div className="mt-[var(--space-100)] text-[length:var(--font-size-xs)] text-text-secondary">{it.meta}</div>
                  </div>
                  <span className="shrink-0 text-xs text-text-tertiary">›</span>
                </button>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function FreeSlotsBlock({
  payload,
  onVvAction,
}: {
  payload: Extract<VvAssistantPayload, { kind: "free-slots" }>
  onVvAction?: VvActionHandler
}) {
  const purpose = payload.purpose
  const conciseTitle = payload.title.replace(/（.+?）/g, "").trim()

  return (
    <Card className={vvCardSurface}>
      <CardHeader className="border-b border-border bg-bg px-[var(--space-400)] py-[var(--space-300)]">
        <div className="flex items-center gap-[var(--space-250)]">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-border bg-[var(--blue-alpha-11)] text-primary">
            <CalendarDays className="size-[18px]" strokeWidth={2} />
          </div>
          <CardTitle className={vvCardTitle}>{conciseTitle}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="px-[var(--space-300)] py-[var(--space-200)]">
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg-secondary">
            {payload.slots.map((slot: VvFreeSlot, index) => (
              <div
                key={slot.id}
                className={cn(
                  "flex items-center gap-[var(--space-300)] px-[var(--space-400)] py-[var(--space-300)] transition-colors hover:bg-[var(--black-alpha-11)]",
                  index > 0 && "border-t border-border"
                )}
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-bg text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-text-secondary shadow-xs">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] text-text">
                    {slot.label}
                  </div>
                </div>
                {purpose ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0 rounded-[var(--radius-md)] px-[var(--space-300)]"
                    onClick={() => onVvAction?.("free-slot-pick", { slot, purpose })}
                  >
                    选择时段
                  </Button>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const WEEKDAY_ZH = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"] as const

function weekdayZhFromIso(iso: string): string {
  const d = new Date(`${iso}T12:00:00`)
  return WEEKDAY_ZH[d.getDay()] ?? ""
}

function formatScheduleDetailTimeLine(item: VvScheduleItem): string {
  if (item.calendarDate) {
    const wd = weekdayZhFromIso(item.calendarDate)
    return `${item.calendarDate} ${wd} ${item.start}\u2013${item.end}`
  }
  return `${item.dateLabel} ${item.start}\u2013${item.end}`
}

function formatMeetingNumberDisplay(raw?: string | null): string {
  if (!raw) return ""
  const clean = raw.replace(/\s/g, "")
  if (!clean) return ""
  const parts: string[] = []
  let i = clean.length
  while (i > 0) {
    parts.unshift(clean.slice(Math.max(0, i - 3), i))
    i -= 3
  }
  return parts.join(" ")
}

function resolveAttendeeRsvpMap(item: VvScheduleItem): Record<string, VvScheduleAttendeeRsvp> {
  const out: Record<string, VvScheduleAttendeeRsvp> = {}
  const org = item.organizerName?.trim() || item.attendees[0] || ""
  for (const name of item.attendees) {
    out[name] = item.attendeeRsvp?.[name] ?? (name === org ? "accepted" : "pending")
  }
  return out
}

type ScheduleAttendeeTab = "all" | "accepted" | "declined" | "tentative" | "pending"

const SCHEDULE_ATTENDEE_TABS: { id: ScheduleAttendeeTab; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "accepted", label: "接受" },
  { id: "declined", label: "拒绝" },
  { id: "tentative", label: "待定" },
  { id: "pending", label: "未响应" },
]

function ScheduleDetailCard({
  item,
  onVvAction,
  embedded,
  onRequestEditInline,
  onRequestCancelInline,
  treatDateLabelTodayAsNotPast,
  showDialogClose,
  sheetToolbar,
  onToolbarDismiss,
  sheetToolbarShowBack = true,
  sheetToolbarShowDelete = true,
  sheetToolbarShowClose = true,
}: {
  item: VvScheduleItem
  onVvAction?: VvActionHandler
  /** 嵌在「今日日程」列表内展开时占满宽度 */
  embedded?: boolean
  /** 在今日日程卡片内：点「修改日程」进入同卡片编辑态，不向对话发新消息 */
  onRequestEditInline?: () => void
  /** 弹窗内：组织人取消未结束日程时在本弹窗展示确认，不往对话推取消卡片 */
  onRequestCancelInline?: () => void
  /** 为 true 时：`dateLabel === "今天"` 的条目不视为已结束（不隐藏修改等） */
  treatDateLabelTodayAsNotPast?: boolean
  /** 弹窗内：与「我的日程」同一行右侧显示关闭 */
  showDialogClose?: boolean
  /** 侧栏模式：顶栏返回 / 状态 / 复制·删除·关闭（参考设计稿） */
  sheetToolbar?: boolean
  /** 非 Sheet 容器（如侧边对话窗）时用按钮替代 Radix SheetClose */
  onToolbarDismiss?: () => void
  /** `sheetToolbar` 时是否显示左上角返回（侧栏子对话可关，用外层标题栏关闭） */
  sheetToolbarShowBack?: boolean
  /** `sheetToolbar` 时是否显示删除/取消日程 */
  sheetToolbarShowDelete?: boolean
  /** `sheetToolbar` 时是否显示右上角关闭（侧栏子对话可用外层标题栏关闭） */
  sheetToolbarShowClose?: boolean
}) {
  const [tab, setTab] = React.useState<ScheduleAttendeeTab>("all")
  const [attendeesSectionOpen, setAttendeesSectionOpen] = React.useState(true)
  const orgName = item.organization?.trim() || "微微集团"
  const trimmedOrganizerName = item.organizerName?.trim() ?? ""
  const organizer = trimmedOrganizerName || item.attendees[0] || "—"
  const orderedAttendees = React.useMemo(() => orderedScheduleAttendees(item), [item])
  const rsvpMap = React.useMemo(() => resolveAttendeeRsvpMap(item), [item])
  const counts = React.useMemo(() => {
    const list = orderedAttendees
    const c = (t: ScheduleAttendeeTab) =>
      t === "all" ? list.length : list.filter((n) => rsvpMap[n] === t).length
    return {
      all: c("all"),
      accepted: c("accepted"),
      declined: c("declined"),
      tentative: c("tentative"),
      pending: c("pending"),
    }
  }, [orderedAttendees, rsvpMap])

  const filteredNames = React.useMemo(() => {
    if (tab === "all") return orderedAttendees
    return orderedAttendees.filter((n) => rsvpMap[n] === tab)
  }, [orderedAttendees, tab, rsvpMap])

  const notesForDetail = React.useMemo(() => {
    const t = item.notes?.trim() ?? ""
    if (!t || t === "由统一飞书助手创建。") return ""
    return t
  }, [item.notes])
  const descriptionText = notesForDetail || "暂无描述"
  const descriptionMuted = !notesForDetail

  const meetingIdDisplay = formatMeetingNumberDisplay(item.meetingNumber)
  const showMeetingBlock = Boolean(item.linkedMeetingId || meetingIdDisplay)
  const itemPast = isScheduleItemPast(item, new Date(), {
    treatDateLabelTodayAsNotPast: Boolean(treatDateLabelTodayAsNotPast),
  })
  const selfName = SCHEDULE_CURRENT_USER_NAME
  const isSelfOrganizer = isScheduleSelfOrganizer(item)
  const isSelfInvitedOnly = item.attendees.includes(selfName) && !isSelfOrganizer
  const mySelfRsvp: VvScheduleAttendeeRsvp =
    item.attendeeRsvp?.[selfName] ?? (isSelfOrganizer ? "accepted" : "pending")
  const selfRsvpFinalized = mySelfRsvp === "accepted" || mySelfRsvp === "declined"
  const detailInertRemoved = item.status === "cancelled"
  const copyMeetingId = () => {
    const digits = (item.meetingNumber || "").replace(/\s/g, "")
    if (!digits) return
    void navigator.clipboard?.writeText(digits)
  }

  const copyScheduleSummary = () => {
    void navigator.clipboard?.writeText(
      [item.title, formatScheduleDetailTimeLine(item), orgName].filter(Boolean).join("\n"),
    )
  }

  const toolbarTrash = () => {
    if (detailInertRemoved) return
    if (onRequestCancelInline) {
      onRequestCancelInline()
      return
    }
    itemPast
      ? onVvAction?.("schedule-direct-delete", { id: item.id, title: item.title })
      : onVvAction?.("schedule-start-cancel", item)
  }

  const toolbarStatusLabel =
    item.status === "cancelled" ? "已取消" : itemPast ? "已结束" : "进行中"

  const detailRowIcon = "size-[18px] shrink-0 text-text-secondary mt-0.5"

  const iconBtnToolbar =
    "flex size-9 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-[var(--black-alpha-11)] hover:text-text"

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg shadow-xs",
        embedded ? "max-w-none" : "max-w-[min(100%,420px)]",
        sheetToolbar && !onToolbarDismiss && "rounded-none border-0 shadow-none",
        detailInertRemoved && "pointer-events-none select-none opacity-[0.58] saturate-0",
      )}
      aria-disabled={detailInertRemoved || undefined}
    >
      {sheetToolbar ? (
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-2 py-2 sm:px-3">
          <div className="flex min-w-0 flex-1 items-center gap-1">
            {sheetToolbarShowBack ? (
              onToolbarDismiss ? (
                <button
                  type="button"
                  className={iconBtnToolbar}
                  aria-label="返回"
                  onClick={onToolbarDismiss}
                >
                  <ChevronLeft className="size-5" strokeWidth={2} />
                </button>
              ) : (
                <SheetClose asChild>
                  <button type="button" className={iconBtnToolbar} aria-label="返回">
                    <ChevronLeft className="size-5" strokeWidth={2} />
                  </button>
                </SheetClose>
              )
            ) : null}
            <span
              className={cn(
                "truncate text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)]",
                itemPast || item.status === "cancelled" ? "text-text-secondary" : "text-text",
              )}
            >
              {toolbarStatusLabel}
            </span>
          </div>
          <div className="flex shrink-0 items-center">
            <button type="button" className={iconBtnToolbar} aria-label="复制日程摘要" onClick={copyScheduleSummary}>
              <Copy className="size-[18px]" strokeWidth={2} />
            </button>
            {sheetToolbarShowDelete && isSelfOrganizer && !detailInertRemoved ? (
              <button
                type="button"
                className={cn(iconBtnToolbar, "text-error hover:text-error")}
                aria-label={itemPast ? "删除日程" : "取消日程"}
                onClick={toolbarTrash}
              >
                <Trash2 className="size-[18px]" strokeWidth={2} />
              </button>
            ) : null}
            {sheetToolbarShowClose ? (
              onToolbarDismiss ? (
                <button type="button" className={iconBtnToolbar} aria-label="关闭" onClick={onToolbarDismiss}>
                  <X className="size-[18px]" strokeWidth={2} />
                </button>
              ) : (
                <SheetClose asChild>
                  <button type="button" className={iconBtnToolbar} aria-label="关闭">
                    <X className="size-[18px]" strokeWidth={2} />
                  </button>
                </SheetClose>
              )
            ) : null}
          </div>
        </div>
      ) : null}
      <div className={cn("px-5 pt-5 pb-2", sheetToolbar && "pt-4")}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2 text-primary">
            <span className="h-4 w-[3px] shrink-0 rounded-full bg-primary" aria-hidden />
            <span className="text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)]">我的日程</span>
          </div>
          {showDialogClose && !sheetToolbar ? (
            <DialogClose asChild>
              <button
                type="button"
                className="flex size-8 shrink-0 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-[var(--black-alpha-11)] hover:text-text"
                aria-label="关闭"
              >
                <X className="size-[18px]" strokeWidth={2} />
              </button>
            </DialogClose>
          ) : null}
        </div>
        <h2 className="mt-2.5 text-[length:var(--font-size-xl)] font-[var(--font-weight-semi-bold)] leading-snug tracking-tight text-text">
          {item.title}
        </h2>
        <p className="mt-1 text-[length:var(--font-size-sm)] text-text-secondary leading-normal">{orgName}</p>
      </div>

      {/* 与参考稿一致：时间 → 会议 → 地点 → 组织人 → 提醒 → 描述 */}
      <div className="space-y-5 px-5 pb-4 pt-1 text-[length:var(--font-size-sm)]">
        <div className="flex gap-3.5">
          <Clock3 className={detailRowIcon} strokeWidth={1.5} />
          <span className="min-w-0 flex-1 leading-relaxed text-text pt-0.5">{formatScheduleDetailTimeLine(item)}</span>
        </div>

        {showMeetingBlock ? (
          <div className="flex gap-3.5">
            <Video className={detailRowIcon} strokeWidth={1.5} />
            <div className="min-w-0 flex-1 space-y-2.5 pt-0.5">
              <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  disabled={!item.linkedMeetingId}
                  className="h-8 shrink-0 rounded-full border border-[var(--blue-alpha-8)] bg-[var(--blue-alpha-11)] px-4 text-[length:var(--font-size-sm)] font-normal text-primary shadow-none hover:bg-[var(--blue-alpha-10)] disabled:opacity-50"
                  onClick={() => {}}
                >
                  开始微微会议
                </Button>
                <button
                  type="button"
                  className="inline-flex shrink-0 items-center gap-0.5 text-[length:var(--font-size-xs)] text-text-secondary transition-colors hover:text-text"
                >
                  更多信息
                  <ChevronRight className="size-3.5 opacity-70" strokeWidth={2} />
                </button>
              </div>
              {meetingIdDisplay ? (
                <div className="flex flex-wrap items-center gap-1.5 text-[length:var(--font-size-xs)] text-text-secondary">
                  <span>
                    会议号 {meetingIdDisplay}
                  </span>
                  <button
                    type="button"
                    className="inline-flex rounded p-0.5 text-text-secondary transition-colors hover:bg-[var(--black-alpha-11)] hover:text-text"
                    aria-label="复制会议号"
                    onClick={copyMeetingId}
                  >
                    <Copy className="size-3.5" strokeWidth={2} />
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {item.location ? (
          <div className="flex gap-3.5">
            <MapPin className={detailRowIcon} strokeWidth={1.5} />
            <div className="min-w-0 flex-1 pt-0.5">
              <span className="inline-flex max-w-full items-center gap-1 rounded-full border border-border/70 bg-[var(--black-alpha-9)] px-2.5 py-1 text-[length:var(--font-size-xs)] text-text-secondary">
                <MapPin className="size-3 shrink-0 opacity-80" strokeWidth={2} />
                <span className="truncate">{item.location}</span>
              </span>
            </div>
          </div>
        ) : null}

        <div className="flex gap-3.5">
          <User className={detailRowIcon} strokeWidth={1.5} />
          <div className="flex min-w-0 flex-1 items-center gap-2.5 pt-0.5">
            <Avatar className="size-8 shrink-0 rounded-full ring-1 ring-border/40">
              <AvatarFallback className="size-8 rounded-full bg-[var(--blue-alpha-11)] text-[11px] font-medium text-primary">
                {attendeeInitials(organizer)}
              </AvatarFallback>
            </Avatar>
            <span className="text-[length:var(--font-size-sm)] text-text">
              {organizer}
              <span className="text-text-secondary">（组织人）</span>
            </span>
          </div>
        </div>

        <div className="flex gap-3.5">
          <Bell className={detailRowIcon} strokeWidth={1.5} />
          <span className="min-w-0 flex-1 leading-relaxed text-text pt-0.5">{item.reminder}</span>
        </div>

        <div className="flex gap-3.5">
          <FileText className={detailRowIcon} strokeWidth={1.5} />
          <p
            className={cn(
              "min-w-0 flex-1 whitespace-pre-wrap pt-0.5 text-[length:var(--font-size-sm)] leading-relaxed",
              descriptionMuted ? "text-text-tertiary" : "text-text-secondary"
            )}
          >
            {descriptionText}
          </p>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="flex items-end justify-between gap-2 border-b border-border px-3 pt-2">
          <div className="flex min-w-0 flex-1 gap-5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {SCHEDULE_ATTENDEE_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "relative shrink-0 pb-2.5 text-[length:var(--font-size-sm)] whitespace-nowrap transition-colors",
                  tab === t.id
                    ? "font-[var(--font-weight-semi-bold)] text-text"
                    : "font-[var(--font-weight-regular)] text-text-secondary"
                )}
              >
                {t.label} {counts[t.id]}
                {tab === t.id ? (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-sm bg-text" aria-hidden />
                ) : null}
              </button>
            ))}
          </div>
          {!detailInertRemoved ? (
            <button
              type="button"
              className="mb-1 flex size-8 shrink-0 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-[var(--black-alpha-11)] hover:text-text"
              aria-expanded={attendeesSectionOpen}
              aria-label={attendeesSectionOpen ? "收起参与人" : "展开参与人"}
              onClick={() => setAttendeesSectionOpen((o) => !o)}
            >
              <ChevronUp
                className={cn("size-4 transition-transform duration-200", !attendeesSectionOpen && "rotate-180")}
                strokeWidth={2}
              />
            </button>
          ) : null}
        </div>

        {detailInertRemoved || attendeesSectionOpen ? (
          <div className="flex items-start gap-4 overflow-x-auto px-3 py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {isSelfOrganizer && !detailInertRemoved ? (
              <button
                type="button"
                className="flex w-[52px] shrink-0 flex-col items-center gap-1.5 text-[length:var(--font-size-xs)] text-text-secondary transition-colors hover:text-text"
              >
                <span className="flex size-11 items-center justify-center rounded-xl border border-dashed border-border bg-[var(--black-alpha-11)] text-text-secondary">
                  <Plus className="size-5" strokeWidth={2} />
                </span>
                添加
              </button>
            ) : null}
            {filteredNames.map((name) => (
              <div key={name} className="flex w-[52px] shrink-0 flex-col items-center gap-1.5">
                <div className="relative">
                  <Avatar className="size-11 rounded-full ring-1 ring-border/30">
                    <AvatarFallback className="size-11 rounded-full bg-[var(--blue-alpha-11)] text-[12px] font-medium text-primary">
                      {attendeeInitials(name)}
                    </AvatarFallback>
                  </Avatar>
                  {rsvpMap[name] === "accepted" ? (
                    <span
                      className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-[var(--color-success)] text-[var(--color-success-foreground)] shadow-sm ring-2 ring-bg"
                      aria-label="已接受"
                    >
                      <Check className="size-2.5" strokeWidth={3} />
                    </span>
                  ) : null}
                </div>
                <span className="max-w-[52px] truncate text-center text-[length:var(--font-size-xs)] text-text">{name}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-[var(--space-200)] border-t border-border px-4 py-3",
          detailInertRemoved && "hidden",
        )}
      >
        <div className="flex flex-wrap gap-[var(--space-200)]">
          {isSelfInvitedOnly && !itemPast ? (
            selfRsvpFinalized ? (
              mySelfRsvp === "accepted" ? (
                <Button size="sm" variant="secondary" disabled className="rounded-[var(--radius-md)]">
                  已接受
                </Button>
              ) : (
                <Button size="sm" variant="secondary" disabled className="rounded-[var(--radius-md)]">
                  已拒绝
                </Button>
              )
            ) : (
              <>
                <Button
                  size="sm"
                  className="rounded-[var(--radius-md)]"
                  onClick={() =>
                    onVvAction?.("schedule-self-rsvp", { scheduleId: item.id, status: "accepted" })
                  }
                >
                  接受
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-[var(--radius-md)]"
                  onClick={() =>
                    onVvAction?.("schedule-self-rsvp", { scheduleId: item.id, status: "declined" })
                  }
                >
                  拒绝
                </Button>
              </>
            )
          ) : null}
          {isSelfInvitedOnly && itemPast && selfRsvpFinalized ? (
            mySelfRsvp === "accepted" ? (
              <Button size="sm" variant="secondary" disabled className="rounded-[var(--radius-md)]">
                已接受
              </Button>
            ) : (
              <Button size="sm" variant="secondary" disabled className="rounded-[var(--radius-md)]">
                已拒绝
              </Button>
            )
          ) : null}
          <div className="flex flex-wrap items-center gap-[var(--space-200)]">
            {isSelfOrganizer && !itemPast ? (
              <Button
                size="sm"
                className="rounded-[var(--radius-md)]"
                onClick={() => (onRequestEditInline ? onRequestEditInline() : onVvAction?.("schedule-start-edit", item))}
              >
                修改日程
              </Button>
            ) : null}
            <Button
              size="sm"
              variant="secondary"
              type="button"
              className="rounded-[var(--radius-md)]"
              onClick={() => {
                vvDemoNativeCapabilityToast("发起群聊")
                onVvAction?.("schedule-direct-group-chat", { id: item.id, title: item.title })
              }}
            >
              发起群聊
            </Button>
          </div>
        </div>
        {isSelfOrganizer && !detailInertRemoved ? (
          <Button
            size="icon-sm"
            type="button"
            variant="outline"
            className="rounded-[var(--radius-md)] text-error hover:border-error hover:bg-[var(--red-alpha-11)] hover:text-error"
            aria-label={itemPast ? "删除日程" : "取消日程"}
            onClick={() => {
              if (onRequestCancelInline) {
                onRequestCancelInline()
                return
              }
              itemPast
                ? onVvAction?.("schedule-direct-delete", { id: item.id, title: item.title })
                : onVvAction?.("schedule-start-cancel", item)
            }}
          >
            <Trash2 className="size-4" strokeWidth={2} />
          </Button>
        ) : null}
      </div>
    </div>
  )
}

function timePartsFromScheduleEdit(item: VvScheduleItem, draft: VvScheduleEditDraft) {
  const iso = (draft.calendarDate?.trim() || item.calendarDate?.trim()) ?? ""
  const slotLabel = iso
    ? `${iso} ${draft.start} - ${draft.end}`
    : `${item.dateLabel} ${draft.start} - ${draft.end}`
  const p = parseScheduleCreateSlotParts(slotLabel)
  const allDay = draft.start === "00:00" && (draft.end === "23:59" || draft.end === "24:00")
  return { ...p, allDay }
}

type ScheduleTimePartsState = ReturnType<typeof parseScheduleCreateSlotParts>

const scheduleFullSelectClass =
  "h-9 w-full min-w-0 rounded-[var(--radius-md)] border border-border bg-bg px-2 text-[length:var(--font-size-sm)] text-text outline-none focus-visible:ring-2 focus-visible:ring-ring/30"

const SCHEDULE_REMINDER_PRESETS = [
  "跟随参与人日程设置发送提醒",
  "开始时提醒",
  "15 分钟前提醒",
  "不提醒",
] as const

function formatSchedulePreviewHeadline(iso: string, relLabel: string | null): string {
  if (iso && /^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    const [y, m, d] = iso.split("-").map(Number)
    const dt = new Date(y, m - 1, d)
    const wk = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][dt.getDay()]
    return `${m}月${d}日 ${wk}`
  }
  if (relLabel) return `${relLabel} · 预览`
  return "日程预览"
}

function hmToMinutes(hm: string): number {
  const m = (hm || "").trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?/)
  if (!m) return 9 * 60
  return Number(m[1]) * 60 + Number(m[2])
}

function ScheduleFullCalendarPreview({
  headline,
  attendeeColumns,
  startMinutes,
  endMinutes,
}: {
  headline: string
  attendeeColumns: string[]
  startMinutes: number
  endMinutes: number
}) {
  const startHour = 8
  const endHour = 20
  const totalMin = (endHour - startHour) * 60
  const slotStart = Math.max(startHour * 60, Math.min(endHour * 60, startMinutes))
  const slotEnd = Math.max(slotStart + 30, Math.min(endHour * 60, endMinutes))
  const topPct = ((slotStart - startHour * 60) / totalMin) * 100
  const heightPct = ((slotEnd - slotStart) / totalMin) * 100
  const otherStart = 16 * 60
  const otherEnd = 17 * 60
  const otherTopPct = ((otherStart - startHour * 60) / totalMin) * 100
  const otherHeightPct = ((otherEnd - otherStart) / totalMin) * 100
  const nowTopPct = ((16 * 60 + 12 - startHour * 60) / totalMin) * 100
  const cols = attendeeColumns.filter(Boolean).length ? attendeeColumns.slice(0, 2) : ["日程", ""]

  const columnBody = (
    <div className="relative min-h-[120px] w-full flex-1 overflow-hidden">
      <div
        className="absolute left-1 right-1 z-[1] rounded-md bg-[#b3d9ff]/95 px-1 py-0.5 text-[10px] leading-tight text-text shadow-sm"
        style={{ top: `${otherTopPct}%`, height: `${Math.max(otherHeightPct, 6)}%` }}
      >
        测试日程2
      </div>
      <div
        className="absolute left-1 right-1 z-[2] rounded-md border border-[#ff9f43] bg-[#ffecd9] px-1 py-0.5 text-[10px] font-medium leading-tight text-[#b45309] shadow-sm"
        style={{ top: `${topPct}%`, height: `${Math.max(heightPct, 8)}%` }}
      >
        当前时段
      </div>
      <div
        className="pointer-events-none absolute left-0 right-0 z-[3] border-t-2 border-[#ff9f43]"
        style={{ top: `${nowTopPct}%` }}
      />
    </div>
  )

  return (
    <div className="flex h-full min-h-[280px] min-w-0 flex-1 flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-[#f6f8fb] shadow-xs">
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border bg-bg px-3 py-2.5">
        <span className="text-[length:var(--font-size-sm)] font-[var(--font-weight-semi-bold)] text-text">{headline}</span>
        <Button type="button" size="xs" variant="outline" className="h-7 rounded-md px-2.5 text-[11px] font-normal">
          今天
        </Button>
        <div className="ml-auto flex items-center gap-0.5">
          <button
            type="button"
            className="rounded p-1 text-text-secondary hover:bg-[var(--black-alpha-11)]"
            aria-label="上一日"
          >
            <ChevronLeft className="size-4" strokeWidth={2} />
          </button>
          <button
            type="button"
            className="rounded p-1 text-text-secondary hover:bg-[var(--black-alpha-11)]"
            aria-label="下一日"
          >
            <ChevronRight className="size-4" strokeWidth={2} />
          </button>
        </div>
        <div className="flex w-full items-center justify-end gap-1 sm:ml-2 sm:w-auto">
          <span className="rounded-md border border-primary/35 bg-[var(--blue-alpha-11)] px-2 py-0.5 text-[11px] font-medium text-primary">
            日
          </span>
          <span className="rounded-md px-2 py-0.5 text-[11px] text-text-secondary">周</span>
        </div>
      </div>
      <div className="flex min-h-0 min-w-0 flex-1">
        <div className="flex w-11 shrink-0 flex-col border-r border-border/80 bg-bg py-2 pr-1">
          {Array.from({ length: 7 }, (_, i) => startHour + i * 2).map((h) => (
            <div
              key={h}
              className="flex min-h-[22px] flex-1 items-start justify-end text-[10px] leading-tight text-text-tertiary tabular-nums"
            >
              {h}:00
            </div>
          ))}
        </div>
        <div className="grid min-h-0 min-w-0 flex-1" style={{ gridTemplateColumns: `repeat(${cols.length}, minmax(0,1fr))` }}>
          {cols.map((name, i) => (
            <div
              key={i}
              className={cn("flex min-h-0 min-w-0 flex-col border-l border-border/70 first:border-l-0", "bg-bg/40")}
            >
              <div className="shrink-0 border-b border-border/80 bg-bg px-2 py-1.5 text-center text-[11px] font-[var(--font-weight-medium)] text-text">
                {name || " "}
              </div>
              <div className="flex min-h-0 min-w-0 flex-1 flex-col">{columnBody}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** 与发起会议表单一致；日程「地点」与此共用，用于视频会议行展示与切换 */
const VIDEO_MEETING_LOCATION_OPTIONS = ["微微会议", "飞书会议", "腾讯会议", "Teams 会议"] as const

function isVideoMeetingLocation(loc: string): boolean {
  return (VIDEO_MEETING_LOCATION_OPTIONS as readonly string[]).includes(loc.trim())
}

/** 已选视频会议方式时展示下拉；否则展示「+ 添加会议」并默认写入微微会议 */
function ScheduleVideoMeetingRow({
  location,
  onLocation,
  clearToLocation = "线上协作",
}: {
  location: string
  onLocation: (v: string) => void
  clearToLocation?: string
}) {
  if (isVideoMeetingLocation(location)) {
    return (
      <div className="flex min-w-0 flex-1 items-center gap-1 rounded-[var(--radius-md)] border border-primary/40 bg-bg px-2 py-1.5 shadow-none focus-within:ring-2 focus-within:ring-ring/30">
        <select
          value={location.trim()}
          onChange={(e) => onLocation(e.target.value)}
          className="min-w-0 flex-1 cursor-pointer border-0 bg-transparent py-1 text-[length:var(--font-size-sm)] text-text outline-none"
        >
          {VIDEO_MEETING_LOCATION_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="size-8 shrink-0 text-text-secondary hover:text-text"
          aria-label="移除视频会议"
          onClick={() => onLocation(clearToLocation)}
        >
          <X className="size-4" strokeWidth={2} />
        </Button>
      </div>
    )
  }
  return (
    <Button
      type="button"
      size="sm"
      variant="secondary"
      className="h-9 rounded-[var(--radius-md)] px-3 font-normal"
      onClick={() => onLocation("微微会议")}
    >
      + 添加会议
    </Button>
  )
}

function ScheduleFullEditorFormBody({
  title,
  onTitle,
  description,
  onDescription,
  timeParts,
  setTimeParts,
  location,
  onLocation,
  reminder,
  onReminder,
  recurrence,
  onRecurrence,
  notAdjustable,
  onNotAdjustable,
  organization,
  onOrganization,
  visibility,
  onVisibility,
  calendarTypeId,
  onCalendarTypeId,
  calendarTypeOptions,
  attendeesSlot,
  onBatchAdd,
}: {
  title: string
  onTitle: (v: string) => void
  description: string
  onDescription: (v: string) => void
  timeParts: ScheduleTimePartsState
  setTimeParts: React.Dispatch<React.SetStateAction<ScheduleTimePartsState>>
  location: string
  onLocation: (v: string) => void
  reminder: string
  onReminder: (v: string) => void
  recurrence: string
  onRecurrence: (v: string) => void
  notAdjustable: boolean
  onNotAdjustable: (v: boolean) => void
  organization: string
  onOrganization: (v: string) => void
  visibility: string
  onVisibility: (v: string) => void
  calendarTypeId: string
  onCalendarTypeId: (id: string) => void
  calendarTypeOptions: VvUserCalendarType[]
  attendeesSlot: React.ReactNode
  /** 参与人「批量添加」→ 全屏选人 */
  onBatchAdd?: () => void
}) {
  const calDot = calendarTypeOptions.find((c) => c.id === calendarTypeId) ?? calendarTypeOptions[0]
  return (
    <div className="space-y-4 text-[length:var(--font-size-sm)]">
      <Input
        value={title}
        onChange={(e) => onTitle(e.target.value)}
        placeholder="添加主题"
        className={cn(scheduleCreateField, "h-11 border-0 border-b border-border/80 bg-transparent px-0 text-[length:var(--font-size-lg)] font-[var(--font-weight-medium)] shadow-none focus-visible:ring-0 rounded-none")}
      />

      <div className="flex items-start gap-3">
        <FileText className={scheduleCreateRowIcon} strokeWidth={2} />
        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-start">
          <Textarea
            value={description}
            onChange={(e) => onDescription(e.target.value)}
            placeholder="添加描述"
            rows={2}
            className={cn(
              scheduleCreateField,
              "min-h-[72px] flex-1 resize-y py-2"
            )}
          />
          <button
            type="button"
            className="inline-flex shrink-0 items-center gap-1 text-[length:var(--font-size-xs)] text-primary hover:underline"
          >
            <Paperclip className="size-3.5" strokeWidth={2} />
            上传附件
          </button>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Clock3 className={scheduleCreateRowIcon} strokeWidth={2} />
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={timeParts.date}
              onChange={(e) =>
                setTimeParts((p) => ({
                  ...p,
                  date: e.target.value,
                  relDateLabel: e.target.value ? null : p.relDateLabel,
                }))
              }
              className={cn(scheduleCreateField, "w-[140px] shrink-0")}
            />
            {!timeParts.allDay ? (
              <>
                <input
                  type="time"
                  value={timeParts.start}
                  onChange={(e) => setTimeParts((p) => ({ ...p, start: e.target.value }))}
                  className={cn(scheduleCreateField, "w-[92px] shrink-0")}
                />
                <span className="text-text-secondary">—</span>
                <input
                  type="date"
                  value={timeParts.date}
                  onChange={(e) =>
                    setTimeParts((p) => ({
                      ...p,
                      date: e.target.value,
                      relDateLabel: e.target.value ? null : p.relDateLabel,
                    }))
                  }
                  className={cn(scheduleCreateField, "w-[140px] shrink-0")}
                />
                <input
                  type="time"
                  value={timeParts.end}
                  onChange={(e) => setTimeParts((p) => ({ ...p, end: e.target.value }))}
                  className={cn(scheduleCreateField, "w-[92px] shrink-0")}
                />
              </>
            ) : null}
            <div className="ml-auto flex shrink-0 items-center gap-2">
              <span className="whitespace-nowrap text-text-secondary">全天</span>
              <Switch
                checked={timeParts.allDay}
                hideLabels
                onCheckedChange={(checked) => setTimeParts((p) => ({ ...p, allDay: checked }))}
                className="shrink-0"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={recurrence}
              onChange={(e) => onRecurrence(e.target.value)}
              className={cn(scheduleFullSelectClass, "w-[120px]")}
            >
              <option value="不重复">不重复</option>
              <option value="每天">每天</option>
              <option value="每周">每周</option>
            </select>
            <label className="flex cursor-pointer items-center gap-2 text-[length:var(--font-size-xs)] text-text-secondary">
              <input
                type="checkbox"
                checked={notAdjustable}
                onChange={(e) => onNotAdjustable(e.target.checked)}
                className="rounded border-border"
              />
              不可调整
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <UserPlus className={scheduleCreateRowIcon} strokeWidth={2} />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-end gap-2">
            <button
              type="button"
              className="text-[length:var(--font-size-xs)] text-primary hover:underline"
              onClick={() => onBatchAdd?.()}
            >
              批量添加
            </button>
          </div>
          {attendeesSlot}
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Video className={scheduleCreateRowIcon} strokeWidth={2} />
        <ScheduleVideoMeetingRow location={location} onLocation={onLocation} />
      </div>

      <div className="flex items-start gap-3">
        <Building2 className={scheduleCreateRowIcon} strokeWidth={2} />
        <select
          value={organization}
          onChange={(e) => onOrganization(e.target.value)}
          className={scheduleFullSelectClass}
        >
          <option value="微微集团">微微集团</option>
          <option value="默认组织">默认组织</option>
        </select>
      </div>

      <div className="flex items-start gap-3">
        <Lock className={scheduleCreateRowIcon} strokeWidth={2} />
        <select
          value={visibility}
          onChange={(e) => onVisibility(e.target.value)}
          className={scheduleFullSelectClass}
        >
          <option value="仅显示忙碌">仅显示忙碌</option>
          <option value="公开详情">公开详情</option>
        </select>
      </div>

      <div className="flex items-start gap-3">
        <MapPin className={scheduleCreateRowIcon} strokeWidth={2} />
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[var(--radius-md)] border border-border bg-bg px-2 py-1 focus-within:ring-2 focus-within:ring-ring/30">
          <input
            value={location}
            onChange={(e) => onLocation(e.target.value)}
            placeholder="添加地点"
            className="min-w-0 flex-1 border-0 bg-transparent py-1.5 pl-1 text-[length:var(--font-size-sm)] text-text placeholder:text-text-secondary outline-none"
          />
          <Button
            type="button"
            size="xs"
            variant="outline"
            className="h-8 shrink-0 rounded-[var(--radius-md)] border-border px-2.5 text-[length:var(--font-size-xs)] font-normal text-text"
          >
            + 添加会议室
          </Button>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Bell className={scheduleCreateRowIcon} strokeWidth={2} />
        <select value={reminder} onChange={(e) => onReminder(e.target.value)} className={scheduleFullSelectClass}>
          {SCHEDULE_REMINDER_PRESETS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-start gap-3">
        <CalendarDays className={scheduleCreateRowIcon} strokeWidth={2} />
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[var(--radius-md)] border border-border bg-bg px-2 py-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: calDot?.color ?? "#2563eb" }}
            aria-hidden
          />
          <select
            value={calendarTypeId}
            onChange={(e) => onCalendarTypeId(e.target.value)}
            className="min-w-0 flex-1 border-0 bg-transparent text-[length:var(--font-size-sm)] text-text outline-none"
          >
            {calendarTypeOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

function ScheduleEditFormBlock({
  payload,
  onVvAction,
  embedded,
  onBackOverride,
  onConfirmOverride,
  assistantMessageId,
}: {
  payload: Extract<VvAssistantPayload, { kind: "schedule-edit" }>
  onVvAction?: VvActionHandler
  embedded?: boolean
  onBackOverride?: () => void
  onConfirmOverride?: (data: { item: VvScheduleItem; draft: VvScheduleEditDraft }) => void
  assistantMessageId?: string
}) {
  const [draft, setDraft] = React.useState<VvScheduleEditDraft>(() => ({ ...payload.draft }))
  const [timeParts, setTimeParts] = React.useState(() => timePartsFromScheduleEdit(payload.item, payload.draft))
  const [fullOptionsOpen, setFullOptionsOpen] = React.useState(true)
  const [fullDescription, setFullDescription] = React.useState("")
  const [recurrence, setRecurrence] = React.useState("不重复")
  const [notAdjustable, setNotAdjustable] = React.useState(false)
  const [organization, setOrganization] = React.useState(() => payload.item.organization ?? "微微集团")
  const [visibility, setVisibility] = React.useState("仅显示忙碌")
  const calCtxEdit = useUserCalendarsSafe()
  const calendarTypesListEdit = calCtxEdit?.calendarTypes ?? DEFAULT_USER_CALENDAR_TYPES

  React.useEffect(() => {
    setDraft({ ...payload.draft })
    setTimeParts(timePartsFromScheduleEdit(payload.item, payload.draft))
  }, [
    payload.item.id,
    payload.draft.title,
    payload.draft.location,
    payload.draft.start,
    payload.draft.end,
    payload.draft.reminder,
    payload.draft.calendarDate,
    payload.draft.calendarTypeId,
    payload.item.calendarDate,
    payload.item.dateLabel,
    payload.item.calendarTypeId,
  ])

  React.useEffect(() => {
    setFullDescription(payload.item.notes ?? "")
    setOrganization(payload.item.organization ?? "微微集团")
  }, [payload.item.id, payload.item.notes, payload.item.organization])

  const onField = (field: keyof VvScheduleEditDraft, value: string) => {
    setDraft((d) => ({ ...d, [field]: value }))
  }

  const onConfirm = () => {
    const start = timeParts.allDay ? "00:00" : timeParts.start
    const end = timeParts.allDay ? "23:59" : timeParts.end
    const bundle = {
      item: payload.item,
      draft: { ...draft, start, end, calendarDate: timeParts.date } as VvScheduleEditDraft,
    }
    if (onConfirmOverride) {
      onConfirmOverride(bundle)
      return
    }
    onVvAction?.("schedule-edit-confirm", {
      ...bundle,
      ...(assistantMessageId ? { _vvSourceMessageId: assistantMessageId } : {}),
    })
  }

  const reminderSelectValue = (SCHEDULE_REMINDER_PRESETS as readonly string[]).includes(draft.reminder)
    ? draft.reminder
    : "跟随参与人日程设置发送提醒"

  const editAttendeesSlot = (
    <div
      className={cn(
        "flex min-h-10 min-w-0 flex-1 flex-wrap items-center gap-2 rounded-[var(--radius-md)] border border-border bg-bg px-2 py-1.5",
        "text-[length:var(--font-size-sm)] text-text-secondary"
      )}
    >
      {payload.item.attendees.length ? (
        payload.item.attendees.map((name) => (
          <span
            key={name}
            className="inline-flex max-w-full items-center gap-1.5 rounded-md bg-[var(--black-alpha-11)] py-1 pl-1 pr-1.5 text-text"
          >
            <Avatar className="size-6 rounded-full">
              <AvatarFallback className="size-6 rounded-full bg-[var(--blue-alpha-11)] text-[10px] font-medium text-primary">
                {attendeeInitials(name)}
              </AvatarFallback>
            </Avatar>
            <span className="max-w-[140px] truncate">{name}</span>
          </span>
        ))
      ) : (
        <span className="py-1 pl-1">暂无参与人</span>
      )}
    </div>
  )

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg shadow-xs",
        embedded ? "max-w-none" : fullOptionsOpen ? "max-w-[min(100%,960px)]" : "max-w-[min(100%,520px)]"
      )}
    >
      <div className="relative flex items-center justify-between gap-3 border-b border-border bg-[#eef2f7] px-4 py-3 pr-11">
        <h2 className="text-[length:var(--font-size-base)] font-[var(--font-weight-semi-bold)] text-text">修改日程</h2>
        <button
          type="button"
          className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-[var(--black-alpha-11)] hover:text-text"
          aria-label="关闭"
          onClick={() => {
            if (onBackOverride) onBackOverride()
            else onVvAction?.("schedule-edit-back")
          }}
        >
          <X className="size-[18px]" strokeWidth={2} />
        </button>
          </div>

      <div className={cn("px-4 py-4", fullOptionsOpen && "min-h-0")}>
        {!fullOptionsOpen ? (
          <div className="space-y-4 text-[length:var(--font-size-sm)]">
            <Input
              value={draft.title}
              onChange={(e) => onField("title", e.target.value)}
              placeholder="添加主题"
              className={cn(scheduleCreateField, "h-10")}
            />

            <div className="flex items-start gap-3">
              <Clock3 className={scheduleCreateRowIcon} strokeWidth={2} />
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                <input
                  type="date"
                  value={timeParts.date}
                  onChange={(e) =>
                    setTimeParts((p) => ({
                      ...p,
                      date: e.target.value,
                      relDateLabel: e.target.value ? null : p.relDateLabel,
                    }))
                  }
                  className={cn(scheduleCreateField, "w-[132px] shrink-0")}
                />
                {!timeParts.allDay ? (
                  <>
                    <input
                      type="time"
                      value={timeParts.start}
                      onChange={(e) => setTimeParts((p) => ({ ...p, start: e.target.value }))}
                      className={cn(scheduleCreateField, "w-[88px] shrink-0")}
                    />
                    <span className="text-text-secondary">—</span>
                    <input
                      type="time"
                      value={timeParts.end}
                      onChange={(e) => setTimeParts((p) => ({ ...p, end: e.target.value }))}
                      className={cn(scheduleCreateField, "w-[88px] shrink-0")}
                    />
                  </>
                ) : null}
                <div className="ml-auto flex shrink-0 items-center gap-2">
                  <span className="whitespace-nowrap text-text-secondary">全天</span>
                  <Switch
                    checked={timeParts.allDay}
                    hideLabels
                    onCheckedChange={(checked) => setTimeParts((p) => ({ ...p, allDay: checked }))}
                    className="shrink-0"
                  />
          </div>
          </div>
          </div>

            <div className="flex items-start gap-3">
              <UserPlus className={scheduleCreateRowIcon} strokeWidth={2} />
              {editAttendeesSlot}
          </div>

            <div className="flex items-start gap-3">
              <Video className={scheduleCreateRowIcon} strokeWidth={2} />
              <ScheduleVideoMeetingRow location={draft.location} onLocation={(v) => onField("location", v)} />
        </div>

            <div className="flex items-start gap-3">
              <MapPin className={scheduleCreateRowIcon} strokeWidth={2} />
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[var(--radius-md)] border border-border bg-bg px-2 py-1 focus-within:ring-2 focus-within:ring-ring/30">
                <input
                  value={draft.location}
                  onChange={(e) => onField("location", e.target.value)}
                  placeholder="添加地点"
                  className="min-w-0 flex-1 border-0 bg-transparent py-1.5 pl-1 text-[length:var(--font-size-sm)] text-text placeholder:text-text-secondary outline-none"
                />
                <Button
                  type="button"
                  size="xs"
                  variant="outline"
                  className="h-8 shrink-0 rounded-[var(--radius-md)] border-border px-2.5 text-[length:var(--font-size-xs)] font-normal text-text"
                >
                  + 添加会议室
          </Button>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Bell className={scheduleCreateRowIcon} strokeWidth={2} />
              <Input
                value={draft.reminder}
                onChange={(e) => onField("reminder", e.target.value)}
                placeholder="提醒"
                className={cn(scheduleCreateField, "flex-1")}
              />
            </div>
          </div>
        ) : (
          <div className="grid min-h-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:items-stretch">
            <ScheduleFullEditorFormBody
              title={draft.title}
              onTitle={(v) => onField("title", v)}
              description={fullDescription}
              onDescription={setFullDescription}
              timeParts={timeParts}
              setTimeParts={setTimeParts}
              location={draft.location}
              onLocation={(v) => onField("location", v)}
              reminder={reminderSelectValue}
              onReminder={(v) => onField("reminder", v)}
              recurrence={recurrence}
              onRecurrence={setRecurrence}
              notAdjustable={notAdjustable}
              onNotAdjustable={setNotAdjustable}
              organization={organization}
              onOrganization={setOrganization}
              visibility={visibility}
              onVisibility={setVisibility}
              calendarTypeId={draft.calendarTypeId ?? CAL_DEFAULT_ID}
              onCalendarTypeId={(id) => onField("calendarTypeId", id)}
              calendarTypeOptions={calendarTypesListEdit}
              attendeesSlot={editAttendeesSlot}
            />
            <div className="flex h-full min-h-0 min-w-0 flex-col lg:sticky lg:top-2">
              <ScheduleFullCalendarPreview
                headline={formatSchedulePreviewHeadline(timeParts.date, timeParts.relDateLabel)}
                attendeeColumns={payload.item.attendees}
                startMinutes={
                  timeParts.allDay ? 9 * 60 : hmToMinutes(timeParts.start || "09:00")
                }
                endMinutes={
                  timeParts.allDay ? 18 * 60 : hmToMinutes(timeParts.end || "10:00")
                }
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-9 rounded-full px-4 font-normal"
          onClick={() => setFullOptionsOpen((o) => !o)}
        >
          {fullOptionsOpen ? "收起选项" : "更多选项"}
        </Button>
        <Button type="button" size="sm" variant="primary" className="h-9 rounded-full px-5 font-normal" onClick={onConfirm}>
          确认修改
          </Button>
        </div>
    </div>
  )
}

function splitAttendeeNames(raw: string) {
  return raw
    .split(/[、,，]/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function attendeeInitials(name: string) {
  const t = name.slice(0, 2)
  return t || "?"
}

function formatMeetingCodeForDisplay(code: string) {
  const d = code.replace(/\D/g, "")
  if (d.length <= 3) return d
  return d.replace(/(\d{3})(?=\d)/g, "$1 ")
}

function meetingRecordCardAccentClass(accent?: "violet" | "emerald") {
  return accent === "violet" ? "bg-[#7c3aed]" : "bg-emerald-500"
}

function MeetingRecordHubInfoRow({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-2.5">
      <Icon className="mt-[3px] size-[15px] shrink-0 text-text-secondary" strokeWidth={2} aria-hidden />
      <div className="min-w-0 flex-1 text-[length:var(--font-size-sm)] leading-relaxed">{children}</div>
    </div>
  )
}

function meetingRecordHubParticipantSummary(it: VvMeetingRecordHubItem): string {
  if (it.attendedCount != null && it.notAttendedCount != null && it.notAttendedCount > 0) {
    return `${it.attendedCount} 人已参会 … ${it.notAttendedCount} 人未参会`
  }
  if (it.attendedCount != null) return `${it.attendedCount} 人已参会`
  return `共 ${it.participantCount} 人`
}

function meetingRecordHubTabCounts(items: VvMeetingRecordHubItem[]) {
  const all = items.length
  const mine = items.filter((it) => it.iAmOrganizer || it.iParticipated).length
  const organized = items.filter((it) => it.iAmOrganizer).length
  const participated = items.filter((it) => it.iParticipated && !it.iAmOrganizer).length
  const subordinate = items.filter((it) => it.fromSubordinate).length
  return { all, mine, organized, participated, subordinate }
}

function meetingRecordHubFilterItems(items: VvMeetingRecordHubItem[], tab: VvMeetingRecordHubTab): VvMeetingRecordHubItem[] {
  if (tab === "all") return items
  if (tab === "mine") return items.filter((it) => it.iAmOrganizer || it.iParticipated)
  if (tab === "organized") return items.filter((it) => it.iAmOrganizer)
  if (tab === "participated") return items.filter((it) => it.iParticipated && !it.iAmOrganizer)
  return items.filter((it) => it.fromSubordinate)
}

function MeetingRecordHubBlock({ items, onVvAction }: { items: VvMeetingRecordHubItem[]; onVvAction?: VvActionHandler }) {
  const [tab, setTab] = React.useState<VvMeetingRecordHubTab>("all")
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  const counts = React.useMemo(() => meetingRecordHubTabCounts(items), [items])
  const filtered = React.useMemo(() => meetingRecordHubFilterItems(items, tab), [items, tab])
  const upcoming = React.useMemo(
    () => [...filtered].filter((it) => it.status === "upcoming").sort((a, b) => a.dateKey.localeCompare(b.dateKey)),
    [filtered]
  )
  const historical = React.useMemo(
    () =>
      [...filtered]
        .filter((it) => it.status !== "upcoming")
        .sort((a, b) => b.dateKey.localeCompare(a.dateKey)),
    [filtered]
  )

  const tabs: { id: VvMeetingRecordHubTab; label: string; n: number }[] = [
    { id: "all", label: "全部", n: counts.all },
    { id: "mine", label: "我的", n: counts.mine },
    { id: "organized", label: "我组织的", n: counts.organized },
    { id: "participated", label: "我参与的", n: counts.participated },
    { id: "subordinate", label: "下属的", n: counts.subordinate },
  ]

  const copyCode = (id: string, raw: string) => {
    const text = raw.replace(/\D/g, "")
    void navigator.clipboard?.writeText(text).then(() => {
      setCopiedId(id)
      window.setTimeout(() => setCopiedId((x) => (x === id ? null : x)), 1600)
    })
  }

  const renderCard = (it: VvMeetingRecordHubItem, showDate: boolean, isLastInGroup: boolean) => {
    const accentDot = meetingRecordCardAccentClass(it.cardAccent)
    const orgLabel = it.organizationLabel ?? "微微集团"
    const participantSummary = meetingRecordHubParticipantSummary(it)

    const statusInline =
      it.status === "cancelled" ? (
        <span className="shrink-0 text-text-secondary">已取消</span>
      ) : it.status === "ended" ? (
        <span className="shrink-0 text-text-secondary">已结束</span>
      ) : it.status === "upcoming" ? (
        <span className="shrink-0 text-primary">待开始</span>
      ) : null

    return (
      <div key={it.id} className="flex gap-0">
        <div className="flex w-[42px] shrink-0 flex-col items-center pt-1">
          {showDate ? (
            <span className="text-[11px] font-[var(--font-weight-medium)] tabular-nums text-text-secondary">{it.dateKey}</span>
          ) : (
            <span className="text-[11px] text-transparent"> </span>
          )}
          <div className="mt-1 flex flex-1 flex-col items-center">
            <span className="size-2 shrink-0 rounded-full bg-primary/70" aria-hidden />
            {!isLastInGroup ? <span className="mt-0.5 w-px flex-1 min-h-[12px] bg-border" aria-hidden /> : null}
          </div>
        </div>
        <div
          className={cn(
            "mb-3 min-w-0 flex-1 rounded-xl border border-border/90 bg-bg px-4 py-3.5 shadow-[0_1px_3px_rgba(15,23,42,0.06)]"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-start gap-2">
              <span className={cn("mt-1.5 size-2.5 shrink-0 rounded-sm", accentDot)} aria-hidden />
              <h3 className="min-w-0 flex-1 truncate text-[15px] font-[var(--font-weight-semi-bold)] leading-snug text-text">{it.title}</h3>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <div className="flex max-w-[132px] items-center gap-1 text-[length:var(--font-size-xs)] text-text-secondary">
                <Building2 className="size-3.5 shrink-0 opacity-80" strokeWidth={2} aria-hidden />
                <span className="truncate">{orgLabel}</span>
              </div>
              <button
                type="button"
                className="rounded-md p-1.5 text-text-secondary transition-colors hover:bg-[var(--black-alpha-11)] hover:text-text"
                aria-label="删除"
                onClick={() => onVvAction?.("meeting-record-remove", it)}
              >
                <Trash2 className="size-4" strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="mt-3.5 space-y-2.5 text-text">
            <MeetingRecordHubInfoRow icon={Clock3}>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="tabular-nums text-text">{it.timeRange}</span>
                {statusInline}
                <span className="hidden text-text-secondary/40 sm:inline" aria-hidden>
                  ·
                </span>
                <span className="inline-flex flex-wrap items-center gap-1.5 font-mono text-[13px] tabular-nums text-text">
                  {formatMeetingCodeForDisplay(it.meetingCode)}
                  <button
                    type="button"
                    className="inline-flex items-center gap-0.5 rounded p-0.5 text-text-secondary hover:bg-[var(--black-alpha-11)] hover:text-text"
                    aria-label="复制会议号"
                    onClick={() => copyCode(it.id, it.meetingCode)}
                  >
                    <Copy className="size-3.5" strokeWidth={2} />
                    {copiedId === it.id ? <span className="font-sans text-[11px] text-primary">已复制</span> : null}
                  </button>
                </span>
              </div>
            </MeetingRecordHubInfoRow>

            <MeetingRecordHubInfoRow icon={User}>
              <div className="flex items-center gap-2">
                <Avatar className="size-7 shrink-0 border border-border/60">
                  <AvatarFallback className="size-7 bg-[var(--blue-alpha-11)] text-[11px] font-medium text-primary">
                    {attendeeInitials(it.organizerName)}
                  </AvatarFallback>
                </Avatar>
                <span>
                  {it.organizerName}
                  <span className="text-text-secondary">（组织人）</span>
                </span>
              </div>
            </MeetingRecordHubInfoRow>

            <MeetingRecordHubInfoRow icon={Users}>
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
                  {it.participants.slice(0, 6).map((name, i) => (
                    <span
                      key={`${name}-${i}`}
                      className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-[var(--black-alpha-11)] py-0.5 pl-0.5 pr-2 text-[11px] text-text"
                    >
                      <Avatar className="size-5">
                        <AvatarFallback className="size-5 bg-[var(--blue-alpha-11)] text-[9px] font-medium text-primary">
                          {attendeeInitials(name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="max-w-[80px] truncate">{name}</span>
                    </span>
                  ))}
                </div>
                <p className="shrink-0 text-[length:var(--font-size-xs)] leading-snug text-text-secondary sm:pt-0.5">
                  {participantSummary}
                </p>
              </div>
            </MeetingRecordHubInfoRow>

            {it.attendanceLine ? (
              <MeetingRecordHubInfoRow icon={Clock3}>
                <span className="text-[length:var(--font-size-xs)] text-text-secondary">{it.attendanceLine}</span>
              </MeetingRecordHubInfoRow>
            ) : null}

            {it.recordDetail ? (
              <div className="pt-0.5">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="h-8 rounded-[var(--radius-md)] px-3 text-[length:var(--font-size-xs)]"
                  onClick={() => onVvAction?.("record-detail", it.recordDetail!)}
                >
                  查看纪要
                </Button>
              </div>
            ) : null}
          </div>

          {it.status === "upcoming" ? (
            <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-3">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-9 rounded-[var(--radius-md)] border-primary/50 px-4 font-normal text-primary hover:bg-[var(--blue-alpha-11)]"
                disabled={!it.meetingId}
                onClick={() => {
                  if (!it.meetingId) return
                  vvDemoNativeCapabilityToast("开始会议")
                  onVvAction?.("meeting-record-start", { meetingId: it.meetingId })
                }}
              >
                开始会议
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="h-9 rounded-[var(--radius-md)] px-4 font-normal"
                onClick={() => onVvAction?.("meeting-record-add-members", { title: it.title })}
              >
                添加成员
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  const renderList = (list: VvMeetingRecordHubItem[]) =>
    list.map((it, idx) => {
      const prev = list[idx - 1]
      const showDate = !prev || prev.dateKey !== it.dateKey
      const next = list[idx + 1]
      const isLastInGroup = !next || next.dateKey !== it.dateKey
      return renderCard(it, showDate, isLastInGroup)
    })

  return (
    <div className={cn(vvCardSurface, "w-full overflow-hidden px-[var(--space-400)] py-[var(--space-400)]")}>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2 border-b border-border pb-2">
        <div className="flex min-w-0 flex-1 flex-wrap gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "shrink-0 rounded-md px-2.5 py-1.5 text-[length:var(--font-size-sm)] transition-colors",
                tab === t.id
                  ? "bg-[var(--blue-alpha-11)] font-[var(--font-weight-medium)] text-primary"
                  : "text-text-secondary hover:bg-[var(--black-alpha-11)] hover:text-text"
              )}
            >
              {t.label}
              <span className="ml-1 tabular-nums opacity-80">{t.n}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-text-secondary transition-colors hover:bg-[var(--black-alpha-11)] hover:text-text"
          aria-label="预约会议"
          onClick={() => onVvAction?.("vv-suggested-followup", { sendText: "预约会议" })}
        >
          <Pencil className="size-[18px]" strokeWidth={2} />
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="py-6 text-center text-[length:var(--font-size-sm)] text-text-secondary">当前筛选下暂无会议。</p>
      ) : (
        <div className="max-h-[min(70vh,640px)] overflow-y-auto pr-1">
          {upcoming.length ? (
            <div className="space-y-0">
              <div className="mb-2 pl-12 text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-text-secondary">待开始</div>
              {renderList(upcoming)}
            </div>
          ) : null}
          {upcoming.length > 0 && historical.length > 0 ? (
            <div className="my-4 flex items-center gap-3 pl-10">
              <span className="h-px flex-1 bg-border" />
              <span className="shrink-0 text-[length:var(--font-size-xs)] text-text-secondary">以下为历史会议</span>
              <span className="h-px flex-1 bg-border" />
            </div>
          ) : null}
          {historical.length ? (
            <div className="space-y-0">
              {upcoming.length === 0 && historical.length > 0 ? (
                <div className="mb-2 pl-12 text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-text-secondary">历史会议</div>
              ) : null}
              {renderList(historical)}
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

const scheduleCreateField =
  "h-9 w-full min-w-0 rounded-[var(--radius-md)] border border-border bg-bg px-2.5 text-[length:var(--font-size-sm)] text-text placeholder:text-text-secondary shadow-none outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
const scheduleCreateRowIcon = "size-[18px] text-text-secondary shrink-0 mt-2"

/** 删除日程确认：蒙层 + 透明内容区，居中白卡片（由子组件绘制） */
const VV_SCHEDULE_DELETE_OVERLAY_DIALOG_CONTENT =
  "!fixed !inset-0 !left-0 !top-0 z-[240] flex h-[100dvh] max-h-[100dvh] w-full max-w-none !translate-x-0 !translate-y-0 items-center justify-center border-0 bg-transparent p-4 shadow-none gap-0 overflow-y-auto"

function ScheduleCreateFormBlock({
  payload,
  onVvAction,
  assistantMessageId,
}: {
  payload: Extract<VvAssistantPayload, { kind: "schedule-create" }>
  onVvAction?: VvActionHandler
  assistantMessageId?: string
}) {
  const calCtxCreate = useUserCalendarsSafe()
  const calendarTypesListCreate = calCtxCreate?.calendarTypes ?? DEFAULT_USER_CALENDAR_TYPES
  const [draft, setDraft] = React.useState<VvScheduleCreateDraft>(() => ({ ...payload.draft }))
  const [timeParts, setTimeParts] = React.useState(() =>
    normalizeScheduleCreateTimeParts(parseScheduleCreateSlotParts(payload.draft.slotLabel))
  )
  const [participantInput, setParticipantInput] = React.useState("")
  const [fullOptionsOpen, setFullOptionsOpen] = React.useState(true)
  const [fullDescription, setFullDescription] = React.useState("")
  const [recurrence, setRecurrence] = React.useState("不重复")
  const [notAdjustable, setNotAdjustable] = React.useState(false)
  const [organization, setOrganization] = React.useState("微微集团")
  const [visibility, setVisibility] = React.useState("仅显示忙碌")
  const [createFullReminder, setCreateFullReminder] = React.useState<string>(SCHEDULE_REMINDER_PRESETS[0])
  const [batchPickerOpen, setBatchPickerOpen] = React.useState(false)

  React.useEffect(() => {
    setDraft({ ...payload.draft })
    setTimeParts(normalizeScheduleCreateTimeParts(parseScheduleCreateSlotParts(payload.draft.slotLabel)))
    setParticipantInput("")
  }, [payload.draft.title, payload.draft.slotLabel, payload.draft.location, payload.draft.attendees, payload.draft.calendarTypeId])

  React.useEffect(() => {
    if (payload.openBatchAttendees) {
      setBatchPickerOpen(true)
    }
  }, [assistantMessageId, payload.openBatchAttendees])

  const onField = (field: keyof VvScheduleCreateDraft, value: string) => {
    setDraft((d) => ({ ...d, [field]: value }))
  }

  const attendeeNames = splitAttendeeNames(draft.attendees)

  const removeAttendee = (index: number) => {
    const next = attendeeNames.filter((_, i) => i !== index)
    onField("attendees", next.join("、"))
  }

  const commitParticipantInput = () => {
    const parts = splitAttendeeNames(participantInput)
    if (!parts.length) return
    const base = draft.attendees.trim()
    const merged = base ? `${base}、${parts.join("、")}` : parts.join("、")
    onField("attendees", merged)
    setParticipantInput("")
  }

  const mergeBatchAttendeeNames = (names: string[]) => {
    const existing = splitAttendeeNames(draft.attendees)
    const next = [...existing]
    for (const n of names) {
      if (n && !next.includes(n)) next.push(n)
    }
    onField("attendees", next.join("、"))
  }

  const onConfirm = () => {
    const slotLabel = composeScheduleCreateSlotLabel(timeParts)
    const pending = splitAttendeeNames(participantInput)
    const attendeesMerged =
      pending.length === 0
        ? draft.attendees
        : draft.attendees.trim()
          ? `${draft.attendees.trim()}、${pending.join("、")}`
          : pending.join("、")
    onVvAction?.("schedule-create-confirm", {
      draft: { ...draft, slotLabel, attendees: attendeesMerged },
      viaFreeSlots: payload.viaFreeSlots,
      ...(assistantMessageId ? { _vvSourceMessageId: assistantMessageId } : {}),
    })
  }

  const createAttendeesSlot = (
    <div
      className={cn(
        "flex min-h-10 min-w-0 flex-1 flex-wrap items-center gap-2 rounded-[var(--radius-md)] border border-border bg-bg px-2 py-1.5",
        "focus-within:ring-2 focus-within:ring-ring/30"
      )}
    >
      {attendeeNames.map((name, i) => (
        <span
          key={`${name}-${i}`}
          className="inline-flex max-w-full items-center gap-1.5 rounded-md bg-[var(--black-alpha-11)] py-1 pl-1 pr-1.5 text-[length:var(--font-size-sm)] text-text"
        >
          <Avatar className="size-6 rounded-full">
            <AvatarFallback className="size-6 rounded-full bg-[var(--blue-alpha-11)] text-[10px] font-medium text-primary">
              {attendeeInitials(name)}
            </AvatarFallback>
          </Avatar>
          <span className="max-w-[140px] truncate">{name}</span>
          <button
            type="button"
            className="rounded p-0.5 text-text-secondary hover:bg-[var(--black-alpha-9)] hover:text-text"
            aria-label={`移除 ${name}`}
            onClick={() => removeAttendee(i)}
          >
            <X className="size-3.5" strokeWidth={2} />
          </button>
        </span>
      ))}
      <input
        value={participantInput}
        onChange={(e) => setParticipantInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            commitParticipantInput()
          }
        }}
        onBlur={() => commitParticipantInput()}
        placeholder={attendeeNames.length ? "" : "添加参与人"}
        className="min-w-[120px] flex-1 border-0 bg-transparent py-1 text-[length:var(--font-size-sm)] text-text placeholder:text-text-secondary outline-none"
      />
    </div>
  )

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg shadow-xs",
        fullOptionsOpen ? "max-w-[min(100%,960px)]" : "max-w-[min(100%,520px)]"
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border bg-[#eef2f7] px-4 py-3">
        <h2 className="text-[length:var(--font-size-base)] font-[var(--font-weight-semi-bold)] text-text">创建日程</h2>
      </div>

      <div className={cn("px-4 py-4", fullOptionsOpen && "min-h-0")}>
        {!fullOptionsOpen ? (
          <div className="space-y-4 text-[length:var(--font-size-sm)]">
            <Input
              value={draft.title}
              onChange={(e) => onField("title", e.target.value)}
              placeholder="添加主题"
              className={cn(scheduleCreateField, "h-10")}
            />

            <div className="flex items-start gap-3">
              <Clock3 className={scheduleCreateRowIcon} strokeWidth={2} />
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                <input
                  type="date"
                  value={timeParts.date}
                  onChange={(e) =>
                    setTimeParts((p) => ({
                      ...p,
                      date: e.target.value,
                      relDateLabel: e.target.value ? null : p.relDateLabel,
                    }))
                  }
                  className={cn(scheduleCreateField, "w-[132px] shrink-0")}
                />
                {!timeParts.allDay ? (
                  <>
                    <input
                      type="time"
                      value={timeParts.start}
                      onChange={(e) => setTimeParts((p) => ({ ...p, start: e.target.value }))}
                      className={cn(scheduleCreateField, "w-[88px] shrink-0")}
                    />
                    <span className="text-text-secondary">—</span>
                    <input
                      type="time"
                      value={timeParts.end}
                      onChange={(e) => setTimeParts((p) => ({ ...p, end: e.target.value }))}
                      className={cn(scheduleCreateField, "w-[88px] shrink-0")}
                    />
                  </>
                ) : null}
                <div className="ml-auto flex shrink-0 items-center gap-2">
                  <span className="whitespace-nowrap text-text-secondary">全天</span>
                  <Switch
                    checked={timeParts.allDay}
                    hideLabels
                    onCheckedChange={(checked) => setTimeParts((p) => ({ ...p, allDay: checked }))}
                    className="shrink-0"
                  />
          </div>
          </div>
          </div>

            <div className="flex items-start gap-3">
              <UserPlus className={scheduleCreateRowIcon} strokeWidth={2} />
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex justify-end">
                  <button
                    type="button"
                    className="text-[length:var(--font-size-xs)] text-primary hover:underline"
                    onClick={() => setBatchPickerOpen(true)}
                  >
                    批量添加
                  </button>
                </div>
                {createAttendeesSlot}
              </div>
        </div>

            <div className="flex items-start gap-3">
              <Video className={scheduleCreateRowIcon} strokeWidth={2} />
              <ScheduleVideoMeetingRow location={draft.location} onLocation={(v) => onField("location", v)} />
            </div>

            <div className="flex items-start gap-3">
              <MapPin className={scheduleCreateRowIcon} strokeWidth={2} />
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[var(--radius-md)] border border-border bg-bg px-2 py-1 focus-within:ring-2 focus-within:ring-ring/30">
                <input
                  value={draft.location}
                  onChange={(e) => onField("location", e.target.value)}
                  placeholder="添加地点"
                  className="min-w-0 flex-1 border-0 bg-transparent py-1.5 pl-1 text-[length:var(--font-size-sm)] text-text placeholder:text-text-secondary outline-none"
                />
                <Button
                  type="button"
                  size="xs"
                  variant="outline"
                  className="h-8 shrink-0 rounded-[var(--radius-md)] border-border px-2.5 text-[length:var(--font-size-xs)] font-normal text-text"
                >
                  + 添加会议室
          </Button>
        </div>
            </div>

            <div className="flex items-start gap-3">
              <CalendarDays className={scheduleCreateRowIcon} strokeWidth={2} />
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[var(--radius-md)] border border-border bg-bg px-2 py-2">
                <select
                  value={draft.calendarTypeId ?? CAL_DEFAULT_ID}
                  onChange={(e) => onField("calendarTypeId", e.target.value)}
                  className="min-w-0 flex-1 border-0 bg-transparent text-[length:var(--font-size-sm)] text-text outline-none"
                >
                  {calendarTypesListCreate.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid min-h-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:items-stretch">
            <ScheduleFullEditorFormBody
              title={draft.title}
              onTitle={(v) => onField("title", v)}
              description={fullDescription}
              onDescription={setFullDescription}
              timeParts={timeParts}
              setTimeParts={setTimeParts}
              location={draft.location}
              onLocation={(v) => onField("location", v)}
              reminder={createFullReminder}
              onReminder={setCreateFullReminder}
              recurrence={recurrence}
              onRecurrence={setRecurrence}
              notAdjustable={notAdjustable}
              onNotAdjustable={setNotAdjustable}
              organization={organization}
              onOrganization={setOrganization}
              visibility={visibility}
              onVisibility={setVisibility}
              calendarTypeId={draft.calendarTypeId ?? CAL_DEFAULT_ID}
              onCalendarTypeId={(id) => onField("calendarTypeId", id)}
              calendarTypeOptions={calendarTypesListCreate}
              attendeesSlot={createAttendeesSlot}
              onBatchAdd={() => setBatchPickerOpen(true)}
            />
            <div className="flex h-full min-h-0 min-w-0 flex-col lg:sticky lg:top-2">
              <ScheduleFullCalendarPreview
                headline={formatSchedulePreviewHeadline(timeParts.date, timeParts.relDateLabel)}
                attendeeColumns={attendeeNames}
                startMinutes={
                  timeParts.allDay ? 9 * 60 : hmToMinutes(timeParts.start || "09:00")
                }
                endMinutes={
                  timeParts.allDay ? 18 * 60 : hmToMinutes(timeParts.end || "10:00")
                }
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-9 rounded-full px-4 font-normal"
          onClick={() => setFullOptionsOpen((o) => !o)}
        >
          {fullOptionsOpen ? "收起选项" : "更多选项"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="h-9 rounded-full px-5 font-normal"
          onClick={() => onVvAction?.("schedule-create-back", { viaFreeSlots: payload.viaFreeSlots })}
        >
          取消
        </Button>
        <Button type="button" size="sm" variant="primary" className="h-9 rounded-full px-5 font-normal" onClick={onConfirm}>
          创 建
        </Button>
      </div>

      <ScheduleBatchAddParticipantsDialog
        open={batchPickerOpen}
        onOpenChange={setBatchPickerOpen}
        initialNames={attendeeNames}
        onConfirm={mergeBatchAttendeeNames}
      />
    </div>
  )
}

function ScheduleNotifyDraftBlock({
  payload,
  onVvAction,
}: {
  payload: Extract<VvAssistantPayload, { kind: "schedule-notify-draft" }>
  onVvAction?: VvActionHandler
}) {
  const [text, setText] = React.useState(payload.text)
  return (
    <Card className={vvCardForm}>
      <CardHeader>
        <CardTitle className={vvCardTitle}>通知草稿</CardTitle>
        <CardDescription className={vvCardDesc}>接收人：{payload.targetText}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-[var(--space-400)] px-6 pb-6">
        <Textarea value={text} onChange={(e) => setText(e.target.value)} className={cn("min-h-[100px] text-[length:var(--font-size-sm)]", vvInput)} />
        <div className={vvFormFooter}>
          <Button size="sm" className="rounded-[var(--radius-md)]" onClick={() => onVvAction?.("schedule-notify-send", { text, targetText: payload.targetText })}>
            确认发送
          </Button>
          <Button size="sm" variant="secondary" className="rounded-[var(--radius-md)]" onClick={() => onVvAction?.("schedule-notify-skip")}>
            暂不发送
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function MeetingJoinCardBlock({
  payload,
  onVvAction,
}: {
  payload: Extract<VvAssistantPayload, { kind: "meeting-join-card" }>
  onVvAction?: VvActionHandler
}) {
  const [code, setCode] = React.useState("")
  const [micOn, setMicOn] = React.useState(true)
  const [camOn, setCamOn] = React.useState(false)
  const [err, setErr] = React.useState<string | null>(null)

  const onCodeChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 9)
    setCode(digits)
    if (err) setErr(null)
  }

  const submit = () => {
    if (!/^\d{9}$/.test(code)) {
      setErr("请输入 9 位数字会议号")
      return
    }
    setErr(null)
    onVvAction?.("meeting-join-card-submit", {
      meetingCode: code,
      displayName: payload.displayName,
      micOn,
      camOn,
    })
  }

  return (
    <Card className={cn(vvCardForm, "border-border bg-bg-secondary shadow-xs")}>
      <CardHeader className="pb-2 text-center">
        <CardTitle className={cn(vvCardTitle, "w-full text-center")}>加入会议</CardTitle>
      </CardHeader>
      <CardContent className="space-y-[var(--space-400)] px-6 pb-6">
        <div className={vvFieldStack}>
          <div className={vvFieldLabel}>会议号</div>
          <Input
            inputMode="numeric"
            autoComplete="off"
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            placeholder="请输入 9 位会议号"
            maxLength={9}
            className={cn(vvInput, "h-11 text-center font-mono text-[length:var(--font-size-base)] tracking-[0.2em]")}
          />
          {err ? <p className="text-[length:var(--font-size-xs)] text-[var(--red-10)]">{err}</p> : null}
        </div>
        <div className={vvFieldStack}>
          <div className={vvFieldLabel}>会议中的昵称</div>
          <div
            className={cn(
              "flex min-h-[52px] items-center gap-3 rounded-[var(--radius-md)] border border-border bg-bg px-[var(--space-300)] py-[var(--space-200)]"
            )}
          >
            <Avatar className="size-9 shrink-0">
              <AvatarImage src={currentUser.avatar} alt="" />
              <AvatarFallback>{payload.displayName.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <span className="text-[length:var(--font-size-sm)] text-text-secondary">{payload.displayName}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-[var(--space-100)]">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="icon"
              variant={micOn ? "default" : "secondary"}
              className="size-10 shrink-0 rounded-full"
              aria-label={micOn ? "麦克风已开" : "麦克风已关"}
              aria-pressed={micOn}
              onClick={() => setMicOn((v) => !v)}
            >
              {micOn ? <Mic className="size-5" strokeWidth={2} /> : <MicOff className="size-5 opacity-80" strokeWidth={2} />}
            </Button>
            <Button
              type="button"
              size="icon"
              variant={camOn ? "default" : "secondary"}
              className="size-10 shrink-0 rounded-full"
              aria-label={camOn ? "摄像头已开" : "摄像头已关"}
              aria-pressed={camOn}
              onClick={() => setCamOn((v) => !v)}
            >
              {camOn ? (
                <Video className="size-5" strokeWidth={2} />
              ) : (
                <VideoOff className="size-5 text-[var(--red-10)]" strokeWidth={2} />
              )}
            </Button>
          </div>
          <Button
            type="button"
            className="h-10 min-w-[140px] flex-1 rounded-[var(--radius-md)] bg-[#9ca3af] font-[var(--font-weight-medium)] text-white hover:bg-[#8b939d] sm:max-w-[240px]"
            onClick={submit}
          >
            加入会议
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function MeetingStartFormBlock({
  payload,
  onVvAction,
}: {
  payload: Extract<VvAssistantPayload, { kind: "meeting-start-form" }>
  onVvAction?: VvActionHandler
}) {
  const calCtxMeeting = useUserCalendarsSafe()
  const calendarTypesMeeting = calCtxMeeting?.calendarTypes ?? DEFAULT_USER_CALENDAR_TYPES

  const [draft, setDraft] = React.useState<VvMeetingStartFormDraft>(() => ({ ...payload.draft }))
  const [participantInput, setParticipantInput] = React.useState("")
  const [meetingMoreOptions, setMeetingMoreOptions] = React.useState(false)

  React.useEffect(() => {
    setDraft({ ...payload.draft })
    setParticipantInput("")
  }, [
    payload.draft.title,
    payload.draft.participants,
    payload.draft.room,
    payload.draft.timeMode,
    payload.draft.customDate,
    payload.draft.startTime,
    payload.draft.endTime,
    payload.draft.calendarTypeId,
  ])
  const onField = <K extends keyof VvMeetingStartFormDraft>(field: K, value: VvMeetingStartFormDraft[K]) => {
    setDraft((d) => ({ ...d, [field]: value }))
  }

  const attendeeNames = splitAttendeeNames(draft.participants)
  const removeMeetingAttendee = (index: number) => {
    const next = attendeeNames.filter((_, i) => i !== index)
    onField("participants", next.join("、"))
  }
  const commitMeetingParticipantInput = () => {
    const parts = splitAttendeeNames(participantInput)
    if (!parts.length) return
    const base = draft.participants.trim()
    onField("participants", base ? `${base}、${parts.join("、")}` : parts.join("、"))
    setParticipantInput("")
  }

  const meetingAttendeesSlot = (
    <div
      className={cn(
        "flex min-h-10 min-w-0 flex-1 flex-wrap items-center gap-2 rounded-[var(--radius-md)] border border-border bg-bg px-2 py-1.5",
        "focus-within:ring-2 focus-within:ring-ring/30"
      )}
    >
      {attendeeNames.map((name, i) => (
        <span
          key={`${name}-${i}`}
          className="inline-flex max-w-full items-center gap-1.5 rounded-md bg-[var(--black-alpha-11)] py-1 pl-1 pr-1.5 text-[length:var(--font-size-sm)] text-text"
        >
          <Avatar className="size-6 rounded-full">
            <AvatarFallback className="size-6 rounded-full bg-[var(--blue-alpha-11)] text-[10px] font-medium text-primary">
              {attendeeInitials(name)}
            </AvatarFallback>
          </Avatar>
          <span className="max-w-[140px] truncate">{name}</span>
          <button
            type="button"
            className="rounded p-0.5 text-text-secondary hover:bg-[var(--black-alpha-9)] hover:text-text"
            aria-label={`移除 ${name}`}
            onClick={() => removeMeetingAttendee(i)}
          >
            <X className="size-3.5" strokeWidth={2} />
          </button>
        </span>
      ))}
      <input
        value={participantInput}
        onChange={(e) => setParticipantInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            commitMeetingParticipantInput()
          }
        }}
        onBlur={() => commitMeetingParticipantInput()}
        placeholder={attendeeNames.length ? "" : "添加参与人"}
        className="min-w-[120px] flex-1 border-0 bg-transparent py-1 text-[length:var(--font-size-sm)] text-text placeholder:text-text-secondary outline-none"
      />
      <button
        type="button"
        className="ml-auto shrink-0 text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-primary hover:underline"
      >
        批量添加
      </button>
    </div>
  )

  if (draft.timeMode === "scheduled") {
    return (
      <div
        className={cn(
          "w-full overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg shadow-xs",
          meetingMoreOptions ? "max-w-[min(100%,960px)]" : "max-w-[min(100%,520px)]"
        )}
      >
        <div className="relative flex items-center justify-between gap-3 border-b border-border bg-[#eef2f7] px-4 py-3 pr-11">
          <h2 className="text-[length:var(--font-size-base)] font-[var(--font-weight-semi-bold)] text-text">预约会议</h2>
          <button
            type="button"
            className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-[var(--black-alpha-11)] hover:text-text"
            aria-label="关闭"
            onClick={() => onVvAction?.("meeting-start-back")}
          >
            <X className="size-[18px]" strokeWidth={2} />
          </button>
        </div>

        <div className="space-y-4 px-4 py-4 text-[length:var(--font-size-sm)]">
          <div className="flex flex-wrap gap-2 pb-1">
            <Button
              type="button"
              size="sm"
              variant={draft.timeMode === "instant" ? "default" : "outline"}
              className="h-8 rounded-full px-3 font-normal"
              onClick={() => onField("timeMode", "instant")}
            >
              立即发起
            </Button>
            <Button
              type="button"
              size="sm"
              variant={draft.timeMode === "scheduled" ? "default" : "outline"}
              className="h-8 rounded-full px-3 font-normal"
              onClick={() => onField("timeMode", "scheduled")}
            >
              预约时间
            </Button>
          </div>

          <Input
            value={draft.title}
            onChange={(e) => onField("title", e.target.value)}
            placeholder="添加主题"
            className={cn(scheduleCreateField, "h-10")}
          />

          <div className="flex items-start gap-3">
            <Clock3 className={scheduleCreateRowIcon} strokeWidth={2} />
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
              <input
                type="date"
                value={draft.customDate}
                onChange={(e) => onField("customDate", e.target.value)}
                className={cn(scheduleCreateField, "w-[132px] shrink-0")}
              />
              <input
                type="time"
                value={draft.startTime}
                onChange={(e) => onField("startTime", e.target.value)}
                className={cn(scheduleCreateField, "w-[88px] shrink-0")}
              />
              <span className="text-text-secondary">—</span>
              <input
                type="time"
                value={draft.endTime}
                onChange={(e) => onField("endTime", e.target.value)}
                className={cn(scheduleCreateField, "w-[88px] shrink-0")}
              />
            </div>
          </div>

          <div className="flex items-start gap-3">
            <UserPlus className={scheduleCreateRowIcon} strokeWidth={2} />
            {meetingAttendeesSlot}
          </div>

          <div className="flex items-start gap-3">
            <Video className={scheduleCreateRowIcon} strokeWidth={2} />
            <div className="flex min-w-0 flex-1 items-center gap-1 rounded-[var(--radius-md)] border border-primary/40 bg-bg px-2 py-1.5 shadow-none focus-within:ring-2 focus-within:ring-ring/30">
              <select
                value={draft.room}
                onChange={(e) => onField("room", e.target.value)}
                className="min-w-0 flex-1 cursor-pointer border-0 bg-transparent py-1 text-[length:var(--font-size-sm)] text-text outline-none"
              >
                {VIDEO_MEETING_LOCATION_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-8 shrink-0 text-text-secondary hover:text-text"
                aria-label="会议设置"
                onClick={() => {}}
              >
                <Settings className="size-4" strokeWidth={2} />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-8 shrink-0 text-text-secondary hover:text-text"
                aria-label="恢复为微微会议"
                onClick={() => onField("room", "微微会议")}
              >
                <X className="size-4" strokeWidth={2} />
              </Button>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CalendarDays className={scheduleCreateRowIcon} strokeWidth={2} />
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[var(--radius-md)] border border-border bg-bg px-2 py-2">
              <select
                value={draft.calendarTypeId ?? CAL_DEFAULT_ID}
                onChange={(e) => onField("calendarTypeId", e.target.value)}
                className="min-w-0 flex-1 border-0 bg-transparent text-[length:var(--font-size-sm)] text-text outline-none"
              >
                {calendarTypesMeeting.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {meetingMoreOptions ? <div className="min-h-8" aria-hidden /> : null}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-9 rounded-full px-4 font-normal"
            onClick={() => setMeetingMoreOptions((o) => !o)}
          >
            {meetingMoreOptions ? "收起选项" : "更多选项"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="primary"
            className="h-9 rounded-full px-5 font-normal"
            onClick={() => {
              const pending = splitAttendeeNames(participantInput)
              const attendeesMerged =
                pending.length === 0
                  ? draft.participants
                  : draft.participants.trim()
                    ? `${draft.participants.trim()}、${pending.join("、")}`
                    : pending.join("、")
              onVvAction?.("meeting-start-confirm", { draft: { ...draft, participants: attendeesMerged } })
            }}
          >
            创 建
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card className={vvCardForm}>
      <CardHeader>
        <CardTitle className={vvCardTitle}>发起会议</CardTitle>
        <CardDescription className={vvCardDesc}>
          选择立即开始或预约时间；确认后将写入演示会议列表（预约会同步关联日程）。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-[var(--space-400)] text-[length:var(--font-size-sm)] px-6 pb-6">
        <div className={vvFieldStack}>
          <div className={vvFieldLabel}>时间</div>
          <div className="flex flex-wrap gap-[var(--space-200)]">
            <Button
              type="button"
              size="sm"
              variant={draft.timeMode === "instant" ? "default" : "outline"}
              className="rounded-[var(--radius-md)]"
              onClick={() => onField("timeMode", "instant")}
            >
              立即发起
            </Button>
            <Button
              type="button"
              size="sm"
              variant={draft.timeMode === "scheduled" ? "default" : "outline"}
              className="rounded-[var(--radius-md)]"
              onClick={() => onField("timeMode", "scheduled")}
            >
              预约时间
            </Button>
          </div>
        </div>
        <div className="grid gap-[var(--space-400)] md:grid-cols-2">
          <div className={cn(vvFieldStack, "md:col-span-2")}>
            <div className={vvFieldLabel}>会议标题</div>
            <Input value={draft.title} onChange={(e) => onField("title", e.target.value)} className={vvInput} />
          </div>
          <div className={cn(vvFieldStack, "md:col-span-2")}>
            <div className={vvFieldLabel}>参会人</div>
            <Input value={draft.participants} onChange={(e) => onField("participants", e.target.value)} className={vvInput} />
          </div>
          <div className={cn(vvFieldStack, "md:col-span-2")}>
            <div className={vvFieldLabel}>会议方式</div>
            <select
              value={draft.room}
              onChange={(e) => onField("room", e.target.value)}
              className={cn(vvInput, "h-9 w-full cursor-pointer")}
            >
              {VIDEO_MEETING_LOCATION_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={vvFormFooter}>
          <Button size="sm" className="rounded-[var(--radius-md)]" onClick={() => onVvAction?.("meeting-start-confirm", { draft })}>
            <Video className="mr-1 size-4" />
            确认发起
          </Button>
          <Button size="sm" variant="secondary" className="rounded-[var(--radius-md)]" onClick={() => onVvAction?.("meeting-start-back")}>
            返回
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function MailComposeFormBlock({
  payload,
  onVvAction,
}: {
  payload: Extract<VvAssistantPayload, { kind: "mail-compose-form" }>
  onVvAction?: VvActionHandler
}) {
  const [draft, setDraft] = React.useState<VvMailComposeFormDraft>(() => ({ ...payload.draft }))
  React.useEffect(() => {
    setDraft({ ...payload.draft })
  }, [payload.draft.to, payload.draft.cc, payload.draft.subject, payload.draft.body])
  const onField = <K extends keyof VvMailComposeFormDraft>(field: K, value: VvMailComposeFormDraft[K]) => {
    setDraft((d) => ({ ...d, [field]: value }))
  }
  return (
    <Card className={vvCardForm}>
      <CardHeader>
        <CardTitle className={cn(vvCardTitle, "flex items-center gap-[var(--space-200)]")}>
          <SecondaryAppGlyph iconKey="mail" className="size-[18px] shrink-0" />
          新建邮件
        </CardTitle>
        <CardDescription className={vvCardDesc}>
          填写后点确认，将生成与识别逻辑一致的自然语言指令，并展示对应 vvcli mail send。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-[var(--space-400)] text-[length:var(--font-size-sm)] px-6 pb-6">
        <div className="grid gap-[var(--space-400)] md:grid-cols-2">
          <div className={cn(vvFieldStack, "md:col-span-2")}>
            <div className={vvFieldLabel}>收件人</div>
            <Input
              value={draft.to}
              onChange={(e) => onField("to", e.target.value)}
              placeholder="多个用顿号或逗号分隔，如：设计组、研发组"
              className={vvInput}
            />
          </div>
          <div className={cn(vvFieldStack, "md:col-span-2")}>
            <div className={vvFieldLabel}>抄送</div>
            <Input value={draft.cc} onChange={(e) => onField("cc", e.target.value)} placeholder="可选" className={vvInput} />
          </div>
          <div className={cn(vvFieldStack, "md:col-span-2")}>
            <div className={vvFieldLabel}>主题</div>
            <Input value={draft.subject} onChange={(e) => onField("subject", e.target.value)} className={vvInput} />
          </div>
          <div className={cn(vvFieldStack, "md:col-span-2")}>
            <div className={vvFieldLabel}>正文</div>
            <Textarea value={draft.body} onChange={(e) => onField("body", e.target.value)} className={cn("min-h-[120px]", vvInput)} />
          </div>
        </div>
        <div className={vvFormFooter}>
          <Button size="sm" className="rounded-[var(--radius-md)]" onClick={() => onVvAction?.("mail-compose-confirm", { draft })}>
            <SecondaryAppGlyph iconKey="mail" className="mr-1 size-4" />
            确认发送
          </Button>
          <Button size="sm" variant="secondary" className="rounded-[var(--radius-md)]" onClick={() => onVvAction?.("mail-compose-back")}>
            取消
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const APPROVAL_ORG_OPTIONS = ["陈廷凯测试公司", "微微集团", "VV 演示企业"] as const

function ApprovalFieldLabel({ required, children }: { required?: boolean; children: React.ReactNode }) {
  return (
    <div className="mb-1.5 text-[length:var(--font-size-sm)] text-text">
      {children}
      {required ? <span className="ml-0.5 text-red-500">*</span> : null}
    </div>
  )
}

function ApprovalStartFormBlock({
  payload,
  onVvAction,
}: {
  payload: Extract<VvAssistantPayload, { kind: "approval-start-form" }>
  onVvAction?: VvActionHandler
}) {
  const [draft, setDraft] = React.useState<VvApprovalStartFormDraft>(() => ({
    ...defaultApprovalStartDraft(),
    ...payload.draft,
  }))
  React.useEffect(() => {
    setDraft({ ...defaultApprovalStartDraft(), ...payload.draft })
  }, [payload.draft])
  const onField = <K extends keyof VvApprovalStartFormDraft>(field: K, value: VvApprovalStartFormDraft[K]) => {
    setDraft((d) => ({ ...d, [field]: value }))
  }
  const orgValue = (draft.organization ?? "").trim() || APPROVAL_ORG_OPTIONS[0]
  const contentLen = (draft.content ?? draft.detail ?? "").length

  const submit = () => {
    const merged: VvApprovalStartFormDraft = {
      ...draft,
      organization: orgValue,
      template: (draft.processType ?? draft.template ?? "").trim() || "通用审批",
      processType: (draft.processType ?? draft.template ?? "").trim(),
      detail: (draft.content ?? draft.detail ?? "").trim(),
      content: (draft.content ?? draft.detail ?? "").trim(),
    }
    onVvAction?.("approval-start-confirm", { draft: merged })
  }

  return (
    <Card className={cn(vvCardForm, "border-border shadow-sm")}>
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className={vvCardTitle}>发起审批</CardTitle>
        <CardDescription className={vvCardDesc}>带 * 为必填；提交后将写入演示待办并生成 vvcli 风格指令。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-6 pb-6 text-[length:var(--font-size-sm)]">
        <div className={vvFieldStack}>
          <ApprovalFieldLabel required>组织</ApprovalFieldLabel>
          <Select value={orgValue} onValueChange={(v) => onField("organization", v)}>
            <SelectTrigger className={cn(vvInput, "h-9")}>
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent>
              {APPROVAL_ORG_OPTIONS.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className={vvFieldStack}>
            <ApprovalFieldLabel required>标题</ApprovalFieldLabel>
            <Input
              value={draft.title}
              onChange={(e) => onField("title", e.target.value)}
              placeholder="请输入"
              className={cn(vvInput, "h-9")}
            />
          </div>
          <div className={vvFieldStack}>
            <ApprovalFieldLabel required>类型</ApprovalFieldLabel>
            <Input
              value={draft.processType ?? draft.template ?? ""}
              onChange={(e) => {
                const v = e.target.value
                onField("processType", v)
                onField("template", v)
              }}
              placeholder="请输入或者选择"
              className={cn(vvInput, "h-9")}
            />
          </div>
        </div>

        <div className={vvFieldStack}>
          <ApprovalFieldLabel required>内容</ApprovalFieldLabel>
          <div className="relative">
            <Textarea
              value={draft.content ?? draft.detail ?? ""}
              onChange={(e) => {
                const v = e.target.value
                onField("content", v)
                onField("detail", v)
              }}
              maxLength={1000}
              placeholder="请输入"
              className={cn("min-h-[120px] resize-y pr-14", vvInput)}
            />
            <span className="pointer-events-none absolute bottom-2 right-2 text-[11px] text-text-tertiary">
              {contentLen} / 1000
            </span>
          </div>
        </div>

        <div className={vvFieldStack}>
          <ApprovalFieldLabel>链接</ApprovalFieldLabel>
          <Input
            value={draft.link ?? ""}
            onChange={(e) => onField("link", e.target.value)}
            placeholder="请输入"
            className={cn(vvInput, "h-9")}
          />
        </div>

        <div className={vvFieldStack}>
          <ApprovalFieldLabel>附件</ApprovalFieldLabel>
          <button
            type="button"
            className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-primary/50 bg-primary/[0.06] py-8 text-primary transition-colors hover:bg-primary/[0.1]"
            onClick={() => onVvAction?.("approval-attach-demo", {})}
          >
            <Paperclip className="size-6" strokeWidth={2} />
            <span className="text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)]">上传附件</span>
            <span className="text-[length:var(--font-size-xs)] text-text-tertiary">最多上传 10 个文件</span>
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="text-[length:var(--font-size-sm)] text-text">
              流程<span className="ml-0.5 text-red-500">*</span>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-[length:var(--font-size-sm)] text-primary hover:underline"
              onClick={() =>
                onVvAction?.(
                  "vv-suggested-followup",
                  { sendText: "流程节点说明" }
                )
              }
            >
              节点说明
              <Info className="size-3.5 shrink-0 opacity-80" strokeWidth={2} />
            </button>
          </div>
          <Input
            value={draft.process ?? ""}
            onChange={(e) => onField("process", e.target.value)}
            placeholder="请选择或输入审批流程"
            className={cn(vvInput, "h-9")}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className={vvFieldStack}>
            <ApprovalFieldLabel>审批人</ApprovalFieldLabel>
            <Input value={draft.approvers} onChange={(e) => onField("approvers", e.target.value)} className={cn(vvInput, "h-9")} />
          </div>
          <div className={vvFieldStack}>
            <ApprovalFieldLabel>抄送</ApprovalFieldLabel>
            <Input value={draft.cc} onChange={(e) => onField("cc", e.target.value)} placeholder="可选" className={cn(vvInput, "h-9")} />
          </div>
          <div className={cn(vvFieldStack, "md:col-span-2")}>
            <ApprovalFieldLabel>金额</ApprovalFieldLabel>
            <Input value={draft.amount} onChange={(e) => onField("amount", e.target.value)} placeholder="可选" className={cn(vvInput, "h-9")} />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-4">
          <Button size="sm" variant="outline" className="rounded-[var(--radius-md)]" onClick={() => onVvAction?.("approval-start-back")}>
            取消
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="rounded-[var(--radius-md)]"
            onClick={() =>
              onVvAction?.("approval-start-save-draft", {
                draft: { ...draft, organization: orgValue },
              })
            }
          >
            保存草稿
          </Button>
          <Button size="sm" className="rounded-[var(--radius-md)]" onClick={submit}>
            提交
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function TodoHubBlock({
  payload,
  onVvAction,
}: {
  payload: Extract<VvAssistantPayload, { kind: "todo-list" }>
  onVvAction?: VvActionHandler
}) {
  const all = payload.allItems ?? []
  const [tab, setTab] = React.useState<VvTodoHubTab>(() => payload.initialTab ?? "all")
  React.useEffect(() => {
    setTab(payload.initialTab ?? "all")
  }, [payload.initialTab])
  const filtered = React.useMemo(() => todosForHubTab(all, tab), [all, tab])
  const pendingCount = React.useMemo(() => all.filter((item) => canCurrentUserProcessTodo(item)).length, [all])

  return (
    <div className={cn(vvCardSurface, "gap-0 overflow-hidden")}>
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <button
          type="button"
          className="flex items-center gap-0.5 text-left text-[length:var(--font-size-base)] font-[var(--font-weight-semibold)] text-text hover:opacity-80"
        >
          {payload.title}
          <ChevronRight className="size-4 shrink-0 text-text-tertiary" strokeWidth={2} aria-hidden />
        </button>
        <button
          type="button"
          className="rounded-md p-1.5 text-text-tertiary hover:bg-[var(--black-alpha-11)]"
          aria-label="更多选项"
        >
          <MoreHorizontal className="size-5" strokeWidth={2} />
        </button>
        </div>
      <div className="flex gap-6 overflow-x-auto border-b border-border px-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TODO_HUB_TABS.map((t) => {
          const active = tab === t.id
          const label = t.id === "pending" ? `待处理 ${pendingCount}` : t.label
          return (
            <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
              className={cn(
                "relative shrink-0 pb-3 text-[length:var(--font-size-sm)] transition-colors",
                active
                  ? "font-[var(--font-weight-semibold)] text-text"
                  : "font-[var(--font-weight-regular)] text-text-secondary hover:text-text"
              )}
            >
              {label}
              {active ? <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" /> : null}
            </button>
          )
        })}
      </div>
      <div className="px-2 pb-4 pt-1">
        {filtered.length === 0 ? (
          <p className="py-6 text-center text-[length:var(--font-size-sm)] text-text-secondary">当前分栏下暂无待办。</p>
        ) : (
          filtered.map((item, i) => (
            <div key={item.id}>
              {i > 0 ? <div className="mx-3 h-px bg-border" /> : null}
              <TodoRow item={item} onAction={onVvAction} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function ScheduleCancelConfirmBlock({
  payload,
  onVvAction,
  showHeaderClose,
  onHeaderClose,
  cardClassName,
  variant = "full",
}: {
  payload: Extract<VvAssistantPayload, { kind: "schedule-cancel-confirm" }>
  onVvAction?: VvActionHandler
  /** 弹窗内：标题行右侧关闭 */
  showHeaderClose?: boolean
  /** 非 Dialog 容器（如侧边议程）必须传入，用普通按钮关闭，避免 DialogClose 无上下文崩溃 */
  onHeaderClose?: () => void
  /** 全屏弹窗内可加宽卡片容器 */
  cardClassName?: string
  /** full：对话内完整取消卡（含原因）；delete-modal：删除确认轻量弹窗 */
  variant?: "full" | "delete-modal"
}) {
  const [reason, setReason] = React.useState(payload.reason)
  React.useEffect(() => {
    setReason(payload.reason)
  }, [payload.reason])

  const done = payload.completed === true
  const confirmReason = variant === "delete-modal" ? (reason.trim() || payload.reason || "用户确认删除") : reason

  const closeBtn =
    showHeaderClose && onHeaderClose ? (
      <button
        type="button"
        className="absolute right-4 top-4 flex size-9 shrink-0 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-[var(--black-alpha-11)] hover:text-text"
        aria-label="关闭"
        onClick={onHeaderClose}
      >
        <X className="size-[18px]" strokeWidth={2} />
      </button>
    ) : showHeaderClose ? (
      <DialogClose asChild>
        <button
          type="button"
          className="absolute right-4 top-4 flex size-9 shrink-0 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-[var(--black-alpha-11)] hover:text-text"
          aria-label="关闭"
        >
          <X className="size-[18px]" strokeWidth={2} />
        </button>
      </DialogClose>
    ) : null

  if (variant === "delete-modal") {
    return (
      <div
        className={cn(
          "relative w-full max-w-[440px] rounded-[var(--radius-xl)] border border-border bg-bg shadow-[0px_12px_48px_rgba(22,24,30,0.14)]",
          done && "pointer-events-none select-none opacity-[0.52]",
          cardClassName
        )}
        aria-disabled={done ? true : undefined}
      >
        {closeBtn}
        <div className="flex gap-3 p-6 pr-14 pt-6">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#ff9f43] text-white shadow-sm"
            aria-hidden
          >
            <span className="text-[17px] font-bold leading-none">!</span>
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <h2 className="text-[length:var(--font-size-base)] font-[var(--font-weight-semibold)] leading-snug text-text">
              确定删除此日程？
            </h2>
            <p className="mt-2 text-[length:var(--font-size-sm)] leading-relaxed text-text-secondary">
              删除后将从你的日历中移除，无法查看
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-9 min-w-[88px] rounded-full border-border px-5 font-normal"
            disabled={done}
            onClick={() => onVvAction?.("schedule-cancel-back")}
          >
            取消
          </Button>
          <Button
            type="button"
            size="sm"
            variant="primary"
            className="h-9 min-w-[88px] rounded-full px-5 font-normal"
            disabled={done}
            onClick={() =>
              onVvAction?.("schedule-cancel-confirm-do", { item: payload.item, reason: confirmReason })
            }
          >
            确定
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card
      className={cn(
        vvCardCuiConfirmShell,
        done &&
          "pointer-events-none select-none opacity-[0.52] saturate-[0.65] contrast-[0.95]",
        cardClassName
      )}
      aria-disabled={done ? true : undefined}
    >
      <CardHeader className={showHeaderClose ? "flex flex-row items-start justify-between gap-3 space-y-0" : undefined}>
        <div className="min-w-0 flex-1 space-y-1.5">
        <CardTitle className={vvCardTitle}>确认取消日程</CardTitle>
        <CardDescription className={vvCardDesc}>取消后将从列表移除，并模拟通知参与人。</CardDescription>
        </div>
        {showHeaderClose ? (
          onHeaderClose ? (
            <button
              type="button"
              className="flex size-8 shrink-0 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-[var(--black-alpha-11)] hover:text-text"
              aria-label="关闭"
              onClick={onHeaderClose}
            >
              <X className="size-[18px]" strokeWidth={2} />
            </button>
          ) : (
            <DialogClose asChild>
              <button
                type="button"
                className="flex size-8 shrink-0 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-[var(--black-alpha-11)] hover:text-text"
                aria-label="关闭"
              >
                <X className="size-[18px]" strokeWidth={2} />
              </button>
            </DialogClose>
          )
        ) : null}
      </CardHeader>
      <CardContent className="space-y-[var(--space-400)] px-6 pb-6">
        <div className="rounded-[var(--radius-md)] border border-border bg-bg px-[var(--space-400)] py-[var(--space-200)] text-[length:var(--font-size-sm)] shadow-xs">
          <ScheduleSummaryRowStatic item={payload.item} />
        </div>
        <div className={vvFieldStack}>
          <div className={vvFieldLabel}>取消原因</div>
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            readOnly={done}
            className={cn(vvInput, done && "cursor-default bg-bg-secondary text-text-secondary")}
          />
        </div>
        <div className={vvFormFooter}>
          <Button
            size="sm"
            variant="destructive"
            className="rounded-[var(--radius-md)]"
            disabled={done}
            onClick={() => onVvAction?.("schedule-cancel-confirm-do", { item: payload.item, reason })}
          >
            确认取消
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="rounded-[var(--radius-md)]"
            disabled={done}
            onClick={() => onVvAction?.("schedule-cancel-back")}
          >
            返回
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function defaultCalendarCreateDraft(): VvCalendarCreateDraft {
  return {
    name: "",
    visibility: "busy_only",
    color: "#925647",
    description: "",
  }
}

const CALENDAR_CREATE_VISIBILITY_ROWS: { value: VvCalendarVisibilityScope; label: string }[] = [
  { value: "busy_only", label: "仅显示忙碌" },
  { value: "details", label: "显示日程详情" },
  { value: "private", label: "仅自己可见" },
]

const CALENDAR_CREATE_COLOR_ROWS: { value: string; label: string }[] = [
  { value: "#925647", label: "棕色" },
  { value: "#1890ff", label: "蓝色" },
  { value: "#fa8c16", label: "橙色" },
  { value: "#52c41a", label: "绿色" },
  { value: "#722ed1", label: "紫色" },
  { value: "#13c2c2", label: "青色" },
  { value: "#eb2f96", label: "品红" },
]

function calendarCreateVisibilityLabel(v: VvCalendarVisibilityScope): string {
  return CALENDAR_CREATE_VISIBILITY_ROWS.find((r) => r.value === v)?.label ?? v
}

function calendarCreateColorLabel(hex: string): string {
  return CALENDAR_CREATE_COLOR_ROWS.find((r) => r.value === hex)?.label ?? hex
}

function ScheduleCalendarCreateBlock({
  payload,
  onVvAction,
  assistantMessageId,
}: {
  payload: Extract<VvAssistantPayload, { kind: "schedule-calendar-create" }>
  onVvAction?: VvActionHandler
  assistantMessageId?: string
}) {
  const created = payload.completed === true
  const merged = React.useMemo(
    () => ({ ...defaultCalendarCreateDraft(), ...payload.draft }),
    [payload.draft?.name, payload.draft?.visibility, payload.draft?.color, payload.draft?.description]
  )
  const [panel, setPanel] = React.useState<"form" | "summary">(() => (created ? "summary" : "form"))
  const [draft, setDraft] = React.useState(merged)

  React.useEffect(() => {
    if (created) setPanel("summary")
  }, [created, payload.createdCalendarId])

  React.useEffect(() => {
    if (!created) setDraft(merged)
  }, [merged, created])

  const [commitShimmer, setCommitShimmer] = React.useState(false)
  const src = assistantMessageId ? { _vvSourceMessageId: assistantMessageId } : {}

  const sectionTitle = "text-[15px] font-[var(--font-weight-semibold)] text-[#1e293b] mb-3"
  const labelCls = "text-[length:var(--font-size-sm)] text-[#64748b] mb-2 block"

  const enterEdit = () => {
    setDraft({ ...merged })
    setPanel("form")
  }

  const onCreate = () => {
    if (created) return
    const name = draft.name.trim()
    if (!name) return
    setCommitShimmer(true)
    onVvAction?.("schedule-calendar-create-submit", {
      name,
      visibility: draft.visibility,
      color: draft.color,
      description: draft.description.trim(),
      ...src,
    })
    window.setTimeout(() => setCommitShimmer(false), VV_CARD_COMMIT_SHIMMER_MS)
  }

  const onConfirmUpdate = () => {
    const name = draft.name.trim()
    const calId = payload.createdCalendarId?.trim()
    if (!name || !calId) return
    setCommitShimmer(true)
    onVvAction?.("schedule-calendar-create-update", {
      calendarId: calId,
      name,
      visibility: draft.visibility,
      color: draft.color,
      description: draft.description.trim(),
      ...src,
    })
    setPanel("summary")
    window.setTimeout(() => setCommitShimmer(false), VV_CARD_COMMIT_SHIMMER_MS)
  }

  const onDismiss = () => {
    if (created) return
    onVvAction?.("schedule-calendar-create-dismiss", { ...src })
  }

  if (created && panel === "summary") {
    return (
      <div className="w-full max-w-[min(100%,480px)] overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg shadow-xs">
        <div className="relative flex items-center justify-between gap-3 border-b border-border bg-[#eef2f7] px-4 py-3">
          <h2 className="text-[length:var(--font-size-base)] font-[var(--font-weight-semibold)] text-text">日历详情</h2>
        </div>
        <div className="max-h-[min(70vh,560px)] overflow-y-auto overflow-x-hidden scrollbar-hide px-4 py-4 md:py-5 space-y-8">
          <section>
            <h3 className={sectionTitle}>基本信息</h3>
            <span className={labelCls}>日历名称</span>
            <p className="text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-[#334155]">{merged.name}</p>
          </section>
          <section>
            <span className={labelCls}>公开范围</span>
            <p className="text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-[#334155]">
              {calendarCreateVisibilityLabel(merged.visibility)}
            </p>
          </section>
          <section>
            <span className={labelCls}>日历颜色</span>
            <div className="flex items-center gap-2">
              <span
                className="size-4 shrink-0 rounded border border-[#e2e8f0]"
                style={{ backgroundColor: merged.color }}
                aria-hidden
              />
              <span className="text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-[#334155]">
                {calendarCreateColorLabel(merged.color)}
              </span>
            </div>
          </section>
          <section>
            <span className={labelCls}>描述</span>
            <p className="text-[length:var(--font-size-sm)] text-[#334155] leading-relaxed whitespace-pre-wrap">
              {merged.description.trim() ? merged.description : "—"}
            </p>
          </section>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="h-9 rounded-full px-5 font-normal"
            onClick={enterEdit}
          >
            修改
          </Button>
        </div>
      </div>
    )
  }

  const reedit = created && panel === "form"

  return (
    <div className="relative isolate w-full max-w-[min(100%,480px)] overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg shadow-xs">
      <div className="relative flex items-center justify-between gap-3 border-b border-border bg-[#eef2f7] px-4 py-3 pr-11">
        <h2 className="text-[length:var(--font-size-base)] font-[var(--font-weight-semibold)] text-text">
          {reedit ? "编辑日历" : "创建日历"}
        </h2>
        {!created ? (
          <button
            type="button"
            className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-[var(--black-alpha-11)] hover:text-text"
            aria-label="关闭"
            onClick={onDismiss}
          >
            <X className="size-[18px]" strokeWidth={2} />
          </button>
        ) : null}
      </div>

      <div className="space-y-4 px-4 py-4">
        <div className="flex items-start gap-3">
          <CalendarDays className={scheduleCreateRowIcon} strokeWidth={2} />
          <Input
            value={draft.name}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            placeholder="日历名称（必填）"
            className={cn(scheduleCreateField, "h-10")}
          />
        </div>

        <div className="flex items-start gap-3">
          <Lock className={scheduleCreateRowIcon} strokeWidth={2} />
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className={vvFieldLabel}>公开范围</div>
            <select
              value={draft.visibility}
              onChange={(e) =>
                setDraft((d) => ({ ...d, visibility: e.target.value as VvCalendarVisibilityScope }))
              }
              className={scheduleFullSelectClass}
            >
              {CALENDAR_CREATE_VISIBILITY_ROWS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Palette className={scheduleCreateRowIcon} strokeWidth={2} />
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className={vvFieldLabel}>日历颜色</div>
            <div className="flex min-w-0 items-center gap-2 rounded-[var(--radius-md)] border border-border bg-bg px-2 py-1.5">
              <span
                className="size-4 shrink-0 rounded border border-border/80"
                style={{ backgroundColor: draft.color }}
                aria-hidden
              />
              <select
                value={draft.color}
                onChange={(e) => setDraft((d) => ({ ...d, color: e.target.value }))}
                className="min-w-0 flex-1 border-0 bg-transparent text-[length:var(--font-size-sm)] text-text outline-none"
              >
                {CALENDAR_CREATE_COLOR_ROWS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <FileText className={scheduleCreateRowIcon} strokeWidth={2} />
          <Textarea
            value={draft.description}
            onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
            placeholder="简单描述一下你的日历"
            rows={3}
            className={cn(scheduleCreateField, "min-h-[88px] resize-y")}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3">
        {reedit ? (
          <>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="h-9 rounded-full px-5 font-normal"
              onClick={() => {
                setDraft({ ...merged })
                setPanel("summary")
              }}
            >
              返回
            </Button>
            <Button
              type="button"
              size="sm"
              className="h-9 rounded-full px-6 font-normal"
              disabled={!draft.name.trim()}
              onClick={onConfirmUpdate}
            >
              确认修改
            </Button>
          </>
        ) : (
          <Button
            type="button"
            size="sm"
            className="h-9 rounded-full px-6 font-normal"
            disabled={!draft.name.trim()}
            onClick={onCreate}
          >
            创建
          </Button>
        )}
      </div>

      {commitShimmer ? (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center rounded-[var(--radius-lg)] bg-bg/50 backdrop-blur-[1px]"
          aria-hidden
          aria-busy="true"
        >
          <Loader2 className="size-7 animate-spin text-primary" strokeWidth={2} />
        </div>
      ) : null}
    </div>
  )
}

const weekStartChoices: { value: VvWeekStartChoice; label: string }[] = [
  { value: "mon", label: "周一" },
  { value: "sun", label: "周日" },
  { value: "sat", label: "周六" },
]

function schedulePrefsWeekStartLabel(ws: VvWeekStartChoice): string {
  return weekStartChoices.find((x) => x.value === ws)?.label ?? ws
}

/** 保存后的只读快照；「修改设置」进入表单；确认后由主窗口在同一条消息上更新为摘要 + vvCardStatusLine（与日程卡一致） */
function ScheduleCalendarSettingsSummaryBlock({
  prefs: initialPrefs,
  onVvAction,
  assistantMessageId,
}: {
  prefs: VvScheduleCalendarPrefs
  onVvAction?: VvActionHandler
  assistantMessageId?: string
}) {
  const calCtx = useUserCalendarsSafe()
  const [prefs, setPrefs] = React.useState(initialPrefs)
  const [mode, setMode] = React.useState<"summary" | "edit">("summary")

  React.useEffect(() => {
    setPrefs(initialPrefs)
  }, [initialPrefs])

  const sectionTitle = "text-[15px] font-[var(--font-weight-semibold)] text-[#1e293b] mb-3"
  const labelCls = "text-[length:var(--font-size-sm)] text-[#64748b] mb-2 block"
  const cardInner = "rounded-[12px] border border-[#e2e8f0] bg-white shadow-[0_4px_24px_rgba(15,23,42,0.06)] overflow-hidden"

  const enterEdit = () => {
    calCtx?.setScheduleCalendarPrefs(prefs)
    setMode("edit")
  }

  if (mode === "edit") {
    return (
      <ScheduleCalendarSettingsBlock
        onVvAction={(action, data) => {
          if (action === "schedule-calendar-settings-confirm") {
            const p = (data as { prefs: VvScheduleCalendarPrefs }).prefs
            calCtx?.setScheduleCalendarPrefs(p)
            setPrefs(p)
            onVvAction?.("schedule-calendar-settings-confirm", {
              prefs: p,
              _vvSummaryReconfirm: true,
              _vvSourceMessageId: assistantMessageId,
            })
            return
          }
          if (action === "schedule-calendar-settings-back") {
            setMode("summary")
            return
          }
          onVvAction?.(action, data)
        }}
      />
    )
  }

  return (
    <div className="w-full max-w-[min(100%,520px)] overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg shadow-xs">
      <div className="relative flex items-center justify-between gap-3 border-b border-border bg-[#eef2f7] px-4 py-3">
        <h2 className="text-[length:var(--font-size-base)] font-[var(--font-weight-semi-bold)] text-text">日历设置</h2>
      </div>
      <div className="max-h-[min(70vh,640px)] overflow-y-auto overflow-x-hidden scrollbar-hide px-4 py-4 md:py-5 space-y-8">
        <section>
          <h3 className={sectionTitle}>基础设置</h3>
          <span className={labelCls}>每星期的第一天</span>
          <p className="text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-[#334155]">
            {schedulePrefsWeekStartLabel(prefs.weekStart)}
          </p>
        </section>

        <section>
          <h3 className={sectionTitle}>个性化设置</h3>
          <span className={labelCls}>日程开始前默认提醒</span>
          <div className="flex flex-wrap gap-2 min-h-[40px] rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-2 py-2">
            {prefs.defaultReminderLabels.length ? (
              prefs.defaultReminderLabels.map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center rounded-md border border-[#e2e8f0] bg-white px-2 py-1 text-[length:var(--font-size-xs)] text-[#334155]"
                >
                  {label}
                </span>
              ))
            ) : (
              <span className="text-[length:var(--font-size-sm)] text-[#94a3b8]">无</span>
            )}
          </div>
        </section>

        <section>
          <h3 className={sectionTitle}>订阅设置</h3>
          <p className="text-[length:var(--font-size-sm)] text-[#334155] leading-relaxed">
            他人订阅我的日历时需经我授权：{prefs.requireSubscribeAuth ? "已开启" : "已关闭（演示）"}
          </p>
          <div className={cn(cardInner, "mt-4")}>
            <div className="flex items-center justify-between gap-2 border-b border-[#eef2f6] bg-[#f8fafc] px-3 py-2.5">
              <span className="text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-[#334155]">订阅人管理</span>
              <span className="text-[length:var(--font-size-xs)] text-[#64748b] shrink-0">
                {prefs.subscribers.length} 人已订阅
              </span>
            </div>
            <ul className="space-y-2 p-3">
              {prefs.subscribers.map((s) => (
                <li key={s.id} className="flex items-center gap-2.5">
                  <Avatar className="size-9 border border-[#e2e8f0]">
                    <AvatarFallback className="bg-[#e0e7ff] text-[length:var(--font-size-xs)] text-[#4338ca]">
                      {s.name.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-[length:var(--font-size-sm)] text-[#1e293b]">{s.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3">
        <Button type="button" size="sm" variant="secondary" className="h-9 rounded-full px-5 font-normal" onClick={enterEdit}>
          修改设置
        </Button>
      </div>
    </div>
  )
}

function ScheduleSubscribeConfirmBlock({
  payload,
  onVvAction,
  assistantMessageId,
}: {
  payload: Extract<VvAssistantPayload, { kind: "schedule-subscribe-confirm" }>
  onVvAction?: VvActionHandler
  assistantMessageId?: string
}) {
  const { colleagueName } = payload
  const done = payload.completed === true
  const src = assistantMessageId ? { _vvSourceMessageId: assistantMessageId } : {}
  return (
    <Card
      className={cn(
        vvCardCuiConfirmShell,
        "max-w-[min(100%,440px)]",
        done && "pointer-events-none select-none opacity-[0.52] saturate-[0.65] contrast-[0.95]"
      )}
      aria-disabled={done ? true : undefined}
    >
      <CardHeader className="pb-2">
        <CardTitle className={vvCardTitle}>订阅同事日历</CardTitle>
        <CardDescription className={vvCardDesc}>
          将订阅「{colleagueName}」的日历；确认后对方忙碌时段会出现在你的「全部日程」中（演示环境）。
        </CardDescription>
      </CardHeader>
      <CardContent className={cn(vvFormFooter, "px-6 pb-6")}>
        <Button
          type="button"
          size="sm"
          className="rounded-[var(--radius-md)]"
          disabled={done}
          onClick={() =>
            onVvAction?.("schedule-subscribe-confirm-ok", {
              colleagueName,
              ...src,
            })
          }
        >
          确认订阅
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="rounded-[var(--radius-md)]"
          disabled={done}
          onClick={() => onVvAction?.("schedule-subscribe-confirm-cancel", { ...src })}
        >
          暂不订阅
        </Button>
      </CardContent>
    </Card>
  )
}

function ScheduleUnsubscribeConfirmBlock({
  payload,
  onVvAction,
  assistantMessageId,
}: {
  payload: Extract<VvAssistantPayload, { kind: "schedule-unsubscribe-confirm" }>
  onVvAction?: VvActionHandler
  assistantMessageId?: string
}) {
  const { colleagueName } = payload
  const done = payload.completed === true
  const src = assistantMessageId ? { _vvSourceMessageId: assistantMessageId } : {}
  return (
    <Card
      className={cn(
        vvCardCuiConfirmShell,
        "max-w-[min(100%,440px)]",
        done && "pointer-events-none select-none opacity-[0.52] saturate-[0.65] contrast-[0.95]"
      )}
      aria-disabled={done ? true : undefined}
    >
      <CardHeader className="pb-2">
        <CardTitle className={vvCardTitle}>取消订阅同事日历</CardTitle>
        <CardDescription className={vvCardDesc}>
          将解除对「{colleagueName}」的日历订阅；确认后对方会从「我订阅的」中移除，日视图不再对比其忙碌时段（演示环境）。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-[var(--space-400)] px-6 pb-6">
        <div className="rounded-[var(--radius-md)] border border-border bg-bg px-[var(--space-400)] py-[var(--space-200)] text-[length:var(--font-size-sm)] shadow-xs">
          <div className="flex items-center gap-3 py-[var(--space-300)]">
            <span className="h-5 w-[3px] shrink-0 rounded-full bg-primary" aria-hidden />
            <span className="min-w-0 flex-1 truncate text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] text-text">
              「{colleagueName}」的日历
            </span>
          </div>
        </div>
        <div className={vvFormFooter}>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            className="rounded-[var(--radius-md)]"
            disabled={done}
            onClick={() =>
              onVvAction?.("schedule-unsubscribe-confirm-ok", {
                colleagueName,
                ...src,
              })
            }
          >
            确认取消订阅
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="rounded-[var(--radius-md)]"
            disabled={done}
            onClick={() => onVvAction?.("schedule-unsubscribe-confirm-cancel", { ...src })}
          >
            保留订阅
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function ScheduleSubscribeColleagueBlock({
  payload,
  onVvAction,
  assistantMessageId,
}: {
  payload: Extract<VvAssistantPayload, { kind: "schedule-subscribe-colleague" }>
  onVvAction?: VvActionHandler
  assistantMessageId?: string
}) {
  const calCtx = useUserCalendarsSafe()
  const subscribedIds = calCtx?.subscribedColleagueIds ?? []
  const [commitShimmer, setCommitShimmer] = React.useState(false)

  const [query, setQuery] = React.useState(() => (payload.initialQuery ?? "").trim())
  React.useEffect(() => {
    setQuery((payload.initialQuery ?? "").trim())
  }, [payload.initialQuery])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return colleagueCalendarDirectorySeed.filter(
      (c) => c.name.toLowerCase().includes(q) || c.orgShortName.toLowerCase().includes(q)
    )
  }, [query])

  const hasQuery = query.trim().length > 0

  const src = assistantMessageId ? { _vvSourceMessageId: assistantMessageId } : {}

  const runSubscribeAction = (fn: () => void) => {
    setCommitShimmer(true)
    fn()
    window.setTimeout(() => setCommitShimmer(false), VV_CARD_COMMIT_SHIMMER_MS)
  }

    return (
    <div className="relative isolate w-full max-w-[min(100%,560px)] overflow-hidden rounded-[var(--radius-lg)] border border-[#e2e8f0] bg-white shadow-[0_4px_24px_rgba(15,23,42,0.06)]">
      <div className="flex items-center gap-2 border-b border-[#e8ecf2] px-3 py-3 md:px-4">
        <div className="relative flex min-w-0 flex-1 items-center">
          <Search className="pointer-events-none absolute left-3 size-4 text-[#94a3b8]" aria-hidden />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="输入姓名或组织关键词搜索"
            className="h-10 border-[#2563eb]/35 bg-[#f8fafc] pl-9 pr-9 text-[length:var(--font-size-sm)] focus-visible:border-[#2563eb]"
          />
          {query ? (
            <button
              type="button"
              className="absolute right-2 rounded-full p-1 text-[#94a3b8] hover:bg-[#eef2f6]"
              aria-label="清除"
              onClick={() => setQuery("")}
            >
              <X className="size-4" />
            </button>
          ) : null}
          </div>
        </div>
      <div className="px-4 pb-4 pt-3">
        <h3 className="mb-1 text-[length:var(--font-size-base)] font-[var(--font-weight-semibold)] text-[#1e293b]">同事日历</h3>
        {!hasQuery ? (
          <p className="py-8 text-center text-[length:var(--font-size-sm)] leading-relaxed text-[#64748b]">
            在上方输入姓名或组织关键词搜索同事；未订阅显示「订阅」，已订阅的同事显示「解除订阅」。通过自然语言说明要订阅谁时，会先出现确认卡片，点「确认订阅」后一步完成。
          </p>
        ) : filtered.length === 0 ? (
          <p className="py-8 text-center text-[length:var(--font-size-sm)] text-[#94a3b8]">未找到匹配的同事，请尝试其它关键词。</p>
        ) : (
          <ul className="divide-y divide-[#eef2f6]">
            {filtered.map((c) => {
              const isSubscribed = subscribedIds.includes(c.id)
              return (
                <li key={c.id} className="flex items-center gap-3 py-3 first:pt-0">
                  <Avatar className="size-11 shrink-0 border border-[#e2e8f0]">
                    <AvatarFallback className="bg-[#dbeafe] text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-[#1d4ed8]">
                      {c.name.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-[#2563eb]">
                      {c.name}（姓名：{c.name}）
                    </p>
                    <p className="text-[length:var(--font-size-xs)] text-[#64748b]">
                      {c.orgShortName}（组织简称）
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-8 rounded-full border-[#2563eb] px-3 text-[length:var(--font-size-xs)] font-normal text-[#2563eb] hover:bg-[#eff6ff]"
                      onClick={() => onVvAction?.("schedule-subscribe-view", { id: c.id, name: c.name, ...src })}
                    >
                      查看
                    </Button>
                    {isSubscribed ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-full border-[#fca5a5] px-3 text-[length:var(--font-size-xs)] font-normal text-[#dc2626] hover:bg-[#fef2f2]"
                        onClick={() =>
                          runSubscribeAction(() =>
                            onVvAction?.("schedule-subscribe-uncommit", { id: c.id, name: c.name, ...src })
                          )
                        }
                      >
                        解除订阅
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        className="h-8 rounded-full bg-[#2563eb] px-3 text-[length:var(--font-size-xs)] font-normal hover:bg-[#1d4ed8]"
                        onClick={() =>
                          runSubscribeAction(() =>
                            onVvAction?.("schedule-subscribe-commit", { id: c.id, name: c.name, ...src })
                          )
                        }
                      >
                        订阅
                      </Button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
      {commitShimmer ? (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center rounded-[var(--radius-lg)] bg-bg/50 backdrop-blur-[1px]"
          aria-hidden
          aria-busy="true"
        >
          <Loader2 className="size-7 animate-spin text-primary" strokeWidth={2} />
        </div>
      ) : null}
    </div>
    )
  }

function ScheduleCalendarSettingsBlock({
  onVvAction,
  initialPrefs,
  assistantMessageId,
}: {
  onVvAction?: VvActionHandler
  /** 自然语言预填：表单为本地草稿，点「确认修改」后再由主窗口写入全局 */
  initialPrefs?: VvScheduleCalendarPrefs
  assistantMessageId?: string
}) {
  const calCtx = useUserCalendarsSafe()
  const draftFromNl = initialPrefs !== undefined
  const [localPrefs, setLocalPrefs] = React.useState(defaultScheduleCalendarPrefs)
  const [nlDraft, setNlDraft] = React.useState<VvScheduleCalendarPrefs>(() =>
    draftFromNl ? { ...initialPrefs } : defaultScheduleCalendarPrefs()
  )

  React.useEffect(() => {
    if (draftFromNl && initialPrefs) setNlDraft({ ...initialPrefs })
  }, [draftFromNl, initialPrefs])

  const prefs = draftFromNl ? nlDraft : calCtx?.scheduleCalendarPrefs ?? localPrefs
  const setPrefs = draftFromNl
    ? setNlDraft
    : calCtx?.setScheduleCalendarPrefs ?? setLocalPrefs
  const [subscriberDraft, setSubscriberDraft] = React.useState("")
  const [reminderOpen, setReminderOpen] = React.useState(false)

  const setWeekStart = (value: VvWeekStartChoice) => {
    setPrefs((p) => ({ ...p, weekStart: value }))
  }

  const removeReminder = (label: string) => {
    setPrefs((p) => ({
      ...p,
      defaultReminderLabels: p.defaultReminderLabels.filter((x) => x !== label),
    }))
  }

  const addReminder = (label: string) => {
    setPrefs((p) => {
      if (p.defaultReminderLabels.includes(label)) return p
      return { ...p, defaultReminderLabels: [...p.defaultReminderLabels, label] }
    })
    setReminderOpen(false)
  }

  const addSubscriber = () => {
    const name = subscriberDraft.trim()
    if (!name) return
    setPrefs((p) => ({
      ...p,
      subscribers: [...p.subscribers, { id: `sub-${Date.now()}`, name }],
    }))
    setSubscriberDraft("")
  }

  const sectionTitle = "text-[15px] font-[var(--font-weight-semibold)] text-[#1e293b] mb-3"
  const labelCls = "text-[length:var(--font-size-sm)] text-[#64748b] mb-2 block"
  const cardInner = "rounded-[12px] border border-[#e2e8f0] bg-white shadow-[0_4px_24px_rgba(15,23,42,0.06)] overflow-hidden"

  const onConfirm = () => {
    onVvAction?.("schedule-calendar-settings-confirm", {
      prefs,
      _vvSourceMessageId: assistantMessageId,
    })
  }

    return (
    <div className="w-full max-w-[min(100%,520px)] overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg shadow-xs">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-[#eef2f7] px-4 py-3">
        <div className="min-w-0">
          <h2 className="text-[length:var(--font-size-base)] font-[var(--font-weight-semi-bold)] text-text">修改日历设置</h2>
          {draftFromNl ? (
            <p className="mt-1 text-[length:var(--font-size-xs)] leading-snug text-text-secondary">
              已根据你的说法预填下列项，可继续修改；点「确认修改」后生效。
            </p>
          ) : null}
        </div>
      </div>
      <div className="max-h-[min(70vh,640px)] overflow-y-auto overflow-x-hidden scrollbar-hide px-4 py-4 md:py-5 space-y-8">
        <section>
          <h3 className={sectionTitle}>基础设置</h3>
          <span className={labelCls}>每星期的第一天</span>
          <div className="flex flex-col gap-2">
            {weekStartChoices.map(({ value, label }) => {
              const sel = prefs.weekStart === value
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setWeekStart(value)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-[length:var(--font-size-sm)] transition-colors",
                    sel ? "border-primary bg-primary/5 text-[#1e293b]" : "border-[#e2e8f0] bg-white text-[#334155] hover:bg-[#f8fafc]"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded border",
                      sel ? "border-primary bg-primary text-white" : "border-[#cbd5e1] bg-white"
                    )}
                  >
                    {sel ? <Check className="size-3" strokeWidth={3} /> : null}
              </span>
                  {label}
                </button>
              )
            })}
            </div>
        </section>

        <section>
          <h3 className={sectionTitle}>个性化设置</h3>
          <span className={labelCls}>日程开始前默认提醒</span>
          <div className="flex flex-wrap items-center gap-2 min-h-[40px] rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-2 py-2">
            {prefs.defaultReminderLabels.map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-1 rounded-md border border-[#e2e8f0] bg-white px-2 py-1 text-[length:var(--font-size-xs)] text-[#334155]"
              >
                {label}
                <button
                  type="button"
                  className="rounded p-0.5 text-[#94a3b8] hover:text-[#64748b] hover:bg-[#f1f5f9]"
                  aria-label={`移除 ${label}`}
                  onClick={() => removeReminder(label)}
                >
                  <X className="size-3.5" />
                </button>
              </span>
            ))}
            <Popover open={reminderOpen} onOpenChange={setReminderOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="ml-auto flex size-8 items-center justify-center rounded-md text-[#64748b] hover:bg-[#eef2f6]"
                  aria-label="添加提醒"
                >
                  <ChevronDown className="size-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-1" align="end">
                <div className="flex flex-col py-1">
                  {SCHEDULE_REMINDER_OPTION_LABELS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      disabled={prefs.defaultReminderLabels.includes(opt)}
                      onClick={() => addReminder(opt)}
                      className={cn(
                        "rounded-md px-3 py-2 text-left text-[length:var(--font-size-sm)] hover:bg-[var(--black-alpha-11)]",
                        prefs.defaultReminderLabels.includes(opt) && "opacity-40 pointer-events-none"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
            </div>
              </PopoverContent>
            </Popover>
          </div>
        </section>

        <section>
          <h3 className={sectionTitle}>订阅设置</h3>
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-transparent py-1">
            <Checkbox
              checked={prefs.requireSubscribeAuth}
              onCheckedChange={(c) => setPrefs((p) => ({ ...p, requireSubscribeAuth: c === true }))}
              className="mt-0.5"
            />
            <span className="text-[length:var(--font-size-sm)] text-[#334155] leading-snug">
              他人订阅我的日历时需经我授权
              </span>
          </label>

          <div className={cn(cardInner, "mt-4")}>
            <div className="flex items-center justify-between gap-2 border-b border-[#eef2f6] bg-[#f8fafc] px-3 py-2.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-[#334155]">订阅人管理</span>
                <Info className="size-3.5 shrink-0 text-[#94a3b8]" aria-hidden />
            </div>
              <span className="text-[length:var(--font-size-xs)] text-[#64748b] shrink-0">
                {prefs.subscribers.length} 人已订阅
              </span>
            </div>
            <div className="p-3 space-y-3">
              <Input
                value={subscriberDraft}
                onChange={(e) => setSubscriberDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addSubscriber()
                  }
                }}
                placeholder="添加订阅人"
                className="rounded-lg border-[#e2e8f0] bg-white text-[length:var(--font-size-sm)]"
              />
              <ul className="space-y-2">
                {prefs.subscribers.map((s) => (
                  <li key={s.id} className="flex items-center gap-2.5">
                    <Avatar className="size-9 border border-[#e2e8f0]">
                      <AvatarFallback className="bg-[#e0e7ff] text-[length:var(--font-size-xs)] text-[#4338ca]">
                        {s.name.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[length:var(--font-size-sm)] text-[#1e293b]">{s.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="h-9 rounded-full px-5 font-normal"
          onClick={() => onVvAction?.("schedule-calendar-settings-back")}
        >
          返回
        </Button>
        <Button type="button" size="sm" variant="primary" className="h-9 rounded-full px-5 font-normal" onClick={onConfirm}>
          确认修改
        </Button>
      </div>
    </div>
  )
}

export function VvAssistantBlocks({
  payload,
  onVvAction,
  schedulePanelAppId = null,
  schedulePanelSurface = "main",
  scheduleMeetingItems,
  messageId,
  cardStatusLine = null,
  highlightFollowups = false,
  followupsContainerRef,
}: {
  payload: VvAssistantPayload
  onVvAction?: VvActionHandler
  /** 侧栏从该应用线程消息中同步日程快照 */
  schedulePanelAppId?: string | null
  schedulePanelSurface?: VvScheduleSideSheetSurface
  /** 今日日程等按 `linkedMeetingId` 对齐会议态与按钮；缺省不传则仅展示日程「查看详情」 */
  scheduleMeetingItems?: VvMeetingItem[]
  /** 当前助手消息 id：新建/修改日程确认时用于原地更新同一条气泡 */
  messageId?: string
  /** 写入完成后展示在卡片与快捷指令之间 */
  cardStatusLine?: string | null
  /** 演示规则面板可临时高亮卡片下方推荐按钮 */
  highlightFollowups?: boolean
  followupsContainerRef?: React.Ref<HTMLDivElement>
}) {
  const payloadKindPrevRef = React.useRef<VvAssistantPayload["kind"] | null>(null)
  const [cardCommitShimmer, setCardCommitShimmer] = React.useState(false)

  React.useEffect(() => {
    const prev = payloadKindPrevRef.current
    const k = payload.kind
    const hasStatus = Boolean(cardStatusLine?.trim())
    const scheduleDetailCommit =
      prev !== null &&
      (prev === "schedule-create" || prev === "schedule-edit") &&
      k === "schedule-detail" &&
      hasStatus
    const calendarSummaryCommit =
      prev !== null && prev === "schedule-calendar-settings" && k === "schedule-calendar-settings-summary" && hasStatus
    if (scheduleDetailCommit || calendarSummaryCommit) {
      setCardCommitShimmer(true)
      const tid = window.setTimeout(() => setCardCommitShimmer(false), VV_CARD_COMMIT_SHIMMER_MS)
      payloadKindPrevRef.current = k
      return () => window.clearTimeout(tid)
    }
    payloadKindPrevRef.current = k
  }, [payload.kind, cardStatusLine])

  if (payload.kind === "schedule-side-session-link") {
    const timeStr = new Date(payload.closedAtMs).toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    return (
      <div className="flex w-full justify-center px-[var(--space-100)] py-1">
        <button
          type="button"
          onClick={() =>
            onVvAction?.("schedule-reopen-side-session", {
              scheduleId: payload.scheduleId,
              panelAppId: payload.panelAppId,
              panelSurface: payload.panelSurface,
              floatingHostAppId: payload.floatingHostAppId,
            })
          }
          className="inline-flex max-w-full justify-center text-center text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-primary underline-offset-2 hover:underline"
        >
          日程详情子对话 {timeStr}
        </button>
      </div>
    )
  }

  if (payload.kind === "assistant-text") {
    return (
      <div className="rounded-tl-[var(--radius-sm)] rounded-tr-[var(--radius-lg)] rounded-bl-[var(--radius-lg)] rounded-br-[var(--radius-lg)] border border-border bg-bg p-[var(--space-400)] shadow-xs text-[length:var(--font-size-base)] text-text leading-relaxed whitespace-pre-wrap">
        {payload.text}
      </div>
    )
  }

  if (payload.kind === "meeting-agenda") {
    return vvAssistantWithFollowups(
      payload,
      <MeetingAgendaBlock items={payload.items} heading={payload.heading} onVvAction={onVvAction} />,
      onVvAction,
      cardStatusLine
    )
  }

  if (payload.kind === "meeting-start-form") {
    return <MeetingStartFormBlock payload={payload} onVvAction={onVvAction} />
  }

  if (payload.kind === "approval-process-hub") {
    return vvAssistantWithFollowups(
      payload,
      <ApprovalProcessHubBlock sections={payload.sections} onVvAction={onVvAction} />,
      onVvAction,
      cardStatusLine
    )
  }

  if (payload.kind === "approval-start-form") {
    return <ApprovalStartFormBlock payload={payload} onVvAction={onVvAction} />
  }

  if (payload.kind === "mail-compose-form") {
    return <MailComposeFormBlock payload={payload} onVvAction={onVvAction} />
  }

  if (payload.kind === "schedule-agenda") {
    return vvAssistantWithFollowups(
      payload,
      <ScheduleAgendaBlock
        items={payload.items}
        heading={payload.heading}
        onVvAction={onVvAction}
        schedulePanelAppId={schedulePanelAppId}
        schedulePanelSurface={schedulePanelSurface}
        meetingItems={scheduleMeetingItems}
      />,
      onVvAction,
      cardStatusLine,
      {
        followupsClassName: highlightFollowups ? "demo-highlight-focus demo-highlight-pulse rounded-[20px]" : undefined,
        followupsRef: followupsContainerRef,
      }
    )
  }

  if (payload.kind === "schedule-all") {
    return vvAssistantWithFollowups(
      payload,
      <ScheduleAllListBlock
        items={payload.items}
        initialViewMode={payload.initialViewMode}
        initialOwnCalendarsVisible={payload.initialOwnCalendarsVisible}
        initialSubscribedCalendarsVisible={payload.initialSubscribedCalendarsVisible}
        onVvAction={onVvAction}
        schedulePanelAppId={schedulePanelAppId}
        schedulePanelSurface={schedulePanelSurface}
      />,
      onVvAction,
      cardStatusLine
    )
  }

  if (payload.kind === "schedule-detail") {
    const detailBlock = (
      <div className="relative overflow-hidden rounded-[var(--radius-lg)] isolate">
        <ScheduleDetailMessageBlock payload={payload} onVvAction={onVvAction} />
        {cardCommitShimmer ? (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center rounded-[var(--radius-lg)] bg-bg/50 backdrop-blur-[1px]"
            aria-hidden
            aria-busy="true"
          >
            <Loader2 className="size-7 animate-spin text-primary" strokeWidth={2} />
          </div>
        ) : null}
      </div>
    )
    return vvAssistantWithFollowups(payload, detailBlock, onVvAction, cardStatusLine)
  }

  if (payload.kind === "schedule-edit") {
    const initial = payload
    return vvAssistantWithFollowups(
      payload,
      <ScheduleEditFormBlock
        payload={initial}
        onVvAction={onVvAction}
        assistantMessageId={messageId}
      />,
      onVvAction,
      cardStatusLine
    )
  }

  if (payload.kind === "schedule-create") {
    return vvAssistantWithFollowups(
      payload,
      <ScheduleCreateFormBlock payload={payload} onVvAction={onVvAction} assistantMessageId={messageId} />,
      onVvAction,
      cardStatusLine
    )
  }

  if (payload.kind === "schedule-notify-draft") {
    return <ScheduleNotifyDraftBlock payload={payload} onVvAction={onVvAction} />
  }

  if (payload.kind === "schedule-cancel-confirm") {
    const block = <ScheduleCancelConfirmBlock payload={payload} onVvAction={onVvAction} />
    if (cardStatusLine && cardStatusLine.trim()) {
      return (
        <div className="w-full space-y-2">
          {block}
          <div className="mt-1 pt-2">
            <p className="pl-0.5 text-[11px] leading-snug tracking-wide text-text-secondary/55">{cardStatusLine}</p>
          </div>
        </div>
      )
    }
    return block
  }

  if (payload.kind === "schedule-calendar-settings") {
    return vvAssistantWithFollowups(
      payload,
      <ScheduleCalendarSettingsBlock
        onVvAction={onVvAction}
        initialPrefs={payload.initialPrefs}
        assistantMessageId={messageId}
      />,
      onVvAction,
      cardStatusLine
    )
  }

  if (payload.kind === "schedule-calendar-settings-summary") {
    const summaryBlock = (
      <div className="relative overflow-hidden rounded-[var(--radius-lg)] isolate">
        <ScheduleCalendarSettingsSummaryBlock
          prefs={payload.prefs}
          onVvAction={onVvAction}
          assistantMessageId={messageId}
        />
        {cardCommitShimmer ? (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center rounded-[var(--radius-lg)] bg-bg/50 backdrop-blur-[1px]"
            aria-hidden
            aria-busy="true"
          >
            <Loader2 className="size-7 animate-spin text-primary" strokeWidth={2} />
          </div>
        ) : null}
      </div>
    )
    return vvAssistantWithFollowups(payload, summaryBlock, onVvAction, cardStatusLine)
  }

  if (payload.kind === "schedule-calendar-create") {
    return vvAssistantWithFollowups(
      payload,
      <ScheduleCalendarCreateBlock
        payload={payload}
        onVvAction={onVvAction}
        assistantMessageId={messageId}
      />,
      onVvAction,
      cardStatusLine,
      { hideFollowups: true }
    )
  }

  if (payload.kind === "schedule-subscribe-confirm") {
    return vvAssistantWithFollowups(
      payload,
      <ScheduleSubscribeConfirmBlock
        payload={payload}
        onVvAction={onVvAction}
        assistantMessageId={messageId}
      />,
      onVvAction,
      cardStatusLine
    )
  }

  if (payload.kind === "schedule-subscribe-colleague") {
    return vvAssistantWithFollowups(
      payload,
      <ScheduleSubscribeColleagueBlock
        payload={payload}
        onVvAction={onVvAction}
        assistantMessageId={messageId}
      />,
      onVvAction,
      cardStatusLine
    )
  }

  if (payload.kind === "schedule-unsubscribe-confirm") {
    return vvAssistantWithFollowups(
      payload,
      <ScheduleUnsubscribeConfirmBlock
        payload={payload}
        onVvAction={onVvAction}
        assistantMessageId={messageId}
      />,
      onVvAction,
      cardStatusLine
    )
  }

  if (payload.kind === "vv-success") {
    const tone = payload.tone === "red" ? "red" : "default"
    const shell = tone === "red" ? vvCardSuccessWarn : vvCardSuccess
    const inner = (
      <div className={cn(shell, "p-[var(--space-400)]")}>
        <div className="text-[length:var(--font-size-base)] font-[var(--font-weight-semibold)] text-text">{payload.title}</div>
        <p className="mt-1 text-[length:var(--font-size-sm)] leading-relaxed text-text-secondary">{payload.description}</p>
        {payload.summary ? (
          <p className="mt-2 text-[length:var(--font-size-xs)] text-text-secondary/80">{payload.summary}</p>
        ) : null}
        {payload.actions.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {payload.actions.map((a) => (
              <Button
                key={a.label}
                type="button"
                size="sm"
                variant={tone === "red" ? "destructive" : "default"}
                className="rounded-[var(--radius-md)]"
                onClick={() => onVvAction?.("vv-success-nav", a.action)}
              >
                {a.label}
              </Button>
            ))}
          </div>
        ) : null}
      </div>
    )
    return vvAssistantWithFollowups(payload, inner, onVvAction, cardStatusLine)
  }

  return (
    <div className="rounded-[var(--radius-md)] border border-dashed border-border p-4 text-[length:var(--font-size-sm)] text-text-secondary">
      未渲染的助手卡片类型：{payload.kind}
    </div>
  )
}
