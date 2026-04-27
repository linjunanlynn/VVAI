import * as React from "react"
import {
  AlertCircle,
  Paperclip,
  ChevronLeft,
  ChevronRight,
  Video,
  Lock,
  MapPin,
  X,
} from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Switch } from "../ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { cn } from "../ui/utils"
import type { CuiRulesInteractionPayload, MeetingParticipant } from "./cuiCardRulesDemo"
import {
  buildMeetingCreatePayload,
  buildMeetingEditPayload,
  buildMeetingHandoffPayload,
  serializeCuiRulesPayload,
} from "./cuiCardRulesDemo"

function MiniMonthCalendar({
  selectedDay,
  onPick,
}: {
  selectedDay: number
  onPick: (day: number) => void
}) {
  const days = ["一", "二", "三", "四", "五", "六", "日"]
  const leading = 2
  const cells: (number | null)[] = []
  for (let i = 0; i < leading; i++) cells.push(null)
  for (let d = 1; d <= 30; d++) cells.push(d)

  return (
    <div className="w-[260px]">
      <div className="flex items-center justify-between px-1 pb-2">
        <button type="button" className="p-1 rounded-md hover:bg-muted text-text-secondary text-xs">
          ‹
        </button>
        <span className="text-[length:var(--font-size-sm)] font-medium">2026年 4月</span>
        <button type="button" className="p-1 rounded-md hover:bg-muted text-text-secondary text-xs">
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] text-text-secondary mb-1">
        {days.map((d) => (
          <div key={d} className="py-0.5">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((d, i) =>
          d == null ? (
            <div key={`e-${i}`} />
          ) : (
            <button
              key={d}
              type="button"
              className={cn(
                "aspect-square rounded-md text-[length:var(--font-size-xs)]",
                d === selectedDay
                  ? "bg-primary text-primary-foreground font-medium"
                  : "hover:bg-muted text-text"
              )}
              onClick={() => onPick(d)}
            >
              {d}
            </button>
          )
        )}
      </div>
    </div>
  )
}

function BusySidebar({
  conflictName,
  showConflict,
}: {
  conflictName: string
  showConflict: boolean
}) {
  const hours = ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]
  return (
    <div className="flex flex-col h-full min-h-[320px] border-l border-border bg-bg shrink-0 w-[200px] md:w-[228px]">
      <div className="shrink-0 px-2 py-2 border-b border-border flex flex-col gap-1">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[length:var(--font-size-xs)] font-medium text-text">4月15日 星期三</span>
          <button type="button" className="text-[10px] px-1.5 py-0.5 rounded bg-bg-secondary text-text-secondary">
            今天
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-0.5">
            <button type="button" className="p-0.5 rounded hover:bg-muted" aria-label="prev">
              <ChevronLeft className="size-3.5" />
            </button>
            <button type="button" className="p-0.5 rounded hover:bg-muted" aria-label="next">
              <ChevronRight className="size-3.5" />
            </button>
          </div>
          <div className="flex rounded-md border border-border overflow-hidden text-[10px]">
            <span className="px-1.5 py-0.5 bg-primary text-primary-foreground">日</span>
            <span className="px-1.5 py-0.5 text-text-secondary">周</span>
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-0 relative px-2 py-1">
        <div className="absolute left-8 top-2 bottom-2 w-px bg-border" />
        <div className="relative pl-9 space-y-0">
          {hours.map((h, idx) => (
            <div key={h} className="h-10 text-[10px] text-text-secondary relative">
              <span className="absolute -left-8 w-7 text-right pr-1">{h}</span>
              {idx === 2 ? (
                <div className="absolute left-0 right-0 top-6 h-px bg-orange-400/80 z-10" title="当前时间" />
              ) : null}
            </div>
          ))}
        </div>
        {showConflict ? (
          <div
            className="absolute left-9 right-1 top-[calc(2.5rem*3+0.25rem)] h-[calc(2.5rem)] rounded-md bg-orange-500/90 text-white text-[10px] leading-tight px-1.5 py-1 flex items-center shadow-sm"
            title="日程冲突"
          >
            15:00 - 16:00 与{conflictName}存在日程冲突
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function MeetingScheduleCardBody({
  payload,
  messageId,
  onPatch,
  onAppendHandoffCard,
}: {
  payload: CuiRulesInteractionPayload
  messageId: string
  onPatch: (id: string, mutator: (p: CuiRulesInteractionPayload) => CuiRulesInteractionPayload) => void
  onAppendHandoffCard?: () => void
}) {
  const [saveConfirmOpen, setSaveConfirmOpen] = React.useState(false)
  const conflictParticipant = payload.participants.find((p) => p.conflict)?.name ?? "贾曙光"
  const showConflictBlock =
    payload.showRightPanel && payload.participants.some((p) => p.conflict) && !payload.allDay

  const patch = (mutator: (p: CuiRulesInteractionPayload) => CuiRulesInteractionPayload) =>
    onPatch(messageId, mutator)

  const parseDay = (iso: string) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
    return m ? Number(m[3]) : 15
  }

  const removeParticipant = (name: string) => {
    patch((p) => ({
      ...p,
      participants: p.participants.filter((x) => x.name !== name),
    }))
  }

  const addParticipant = (name: string) => {
    patch((p) => ({
      ...p,
      participants: p.participants.some((x) => x.name === name)
        ? p.participants
        : [...p.participants, { name }],
      contactsPopoverOpen: false,
    }))
  }

  if (payload.uiPhase === "saved") {
    return (
      <div className="rounded-[var(--radius-card)] border border-border bg-bg shadow-elevation-sm overflow-hidden w-full max-w-[920px]">
        <div className="px-[var(--space-350)] py-[var(--space-250)] border-b border-border bg-bg-secondary/40">
          <span className="text-[length:var(--font-size-sm)] font-medium text-text">
            {payload.windowMode === "create" ? "创建日程" : "编辑日程"}
          </span>
        </div>
        <div className="p-[var(--space-400)] space-y-2">
          <p className="text-[length:var(--font-size-sm)] text-success font-medium">
            {payload.savedNotice ?? "已在本卡片内保存（规则 4）"}
          </p>
          <p className="text-[length:var(--font-size-sm)] text-text">
            <span className="text-text-secondary">主题：</span>
            {payload.title || "（无主题）"}
          </p>
          <p className="text-[length:var(--font-size-sm)] text-text">
            <span className="text-text-secondary">时间：</span>
            {payload.startDate} {payload.startTime} — {payload.endTime}
          </p>
        </div>
      </div>
    )
  }

  const primaryAction = payload.windowMode === "create" ? "创建" : "完成"

  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-bg shadow-elevation-sm overflow-hidden w-full max-w-[920px]">
      <div className="px-[var(--space-350)] py-[var(--space-250)] border-b border-border flex items-center justify-between gap-2 bg-bg-secondary/30">
        <span className="text-[length:var(--font-size-sm)] font-medium text-text">
          {payload.windowMode === "create" ? "创建日程" : "编辑日程"}
        </span>
        <span className="text-[length:var(--font-size-xs)] text-text-secondary">示范 GUI · 会议/日程</span>
      </div>

      <div className="flex min-h-[360px] max-w-full">
        <div
          className={cn(
            "flex-1 min-w-0 p-[var(--space-350)] space-y-[var(--space-300)] border-r border-border",
            !payload.showRightPanel && "border-r-0"
          )}
        >
          <div className="space-y-1">
            <Input
              className="text-[length:var(--font-size-md)] font-medium border-0 border-b rounded-none px-0 focus-visible:ring-0 shadow-none placeholder:text-text-secondary/70"
              placeholder="添加主题"
              value={payload.title}
              onChange={(e) => patch((p) => ({ ...p, title: e.target.value }))}
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-start justify-between gap-2">
              <Textarea
                placeholder="添加描述"
                rows={2}
                className="resize-none text-[length:var(--font-size-sm)] min-h-[52px]"
                value={payload.description}
                onChange={(e) => patch((p) => ({ ...p, description: e.target.value }))}
              />
              <Button type="button" variant="ghost" size="icon" className="shrink-0 text-text-secondary" title="上传附件">
                <Paperclip className="size-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[length:var(--font-size-sm)]">
            <Popover
              open={payload.datePickerOpen === "start"}
              onOpenChange={(o) => patch((p) => ({ ...p, datePickerOpen: o ? "start" : null }))}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="rounded-md border border-border px-2 py-1 text-left hover:bg-muted min-w-[108px]"
                >
                  {payload.startDate}
                </button>
              </PopoverTrigger>
              <PopoverContent className="p-3 w-auto" align="start">
                <MiniMonthCalendar
                  selectedDay={parseDay(payload.startDate)}
                  onPick={(day) => {
                    const d = `2026-04-${String(day).padStart(2, "0")}`
                    patch((p) => ({
                      ...p,
                      startDate: d,
                      endDate: p.endDate < d ? d : p.endDate,
                      datePickerOpen: null,
                    }))
                  }}
                />
              </PopoverContent>
            </Popover>

            <Input
              className="w-[72px] h-8 text-center"
              value={payload.startTime}
              onChange={(e) => patch((p) => ({ ...p, startTime: e.target.value }))}
            />
            <span className="text-text-secondary">—</span>

            <Popover
              open={payload.datePickerOpen === "end"}
              onOpenChange={(o) => patch((p) => ({ ...p, datePickerOpen: o ? "end" : null }))}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="rounded-md border border-border px-2 py-1 text-left hover:bg-muted min-w-[108px]"
                >
                  {payload.endDate}
                </button>
              </PopoverTrigger>
              <PopoverContent className="p-3 w-auto" align="start">
                <MiniMonthCalendar
                  selectedDay={parseDay(payload.endDate)}
                  onPick={(day) => {
                    const d = `2026-04-${String(day).padStart(2, "0")}`
                    patch((p) => ({ ...p, endDate: d, datePickerOpen: null }))
                  }}
                />
              </PopoverContent>
            </Popover>

            <Input
              className="w-[72px] h-8 text-center"
              value={payload.endTime}
              onChange={(e) => patch((p) => ({ ...p, endTime: e.target.value }))}
            />

            <Select value={payload.repeat} onValueChange={(v) => patch((p) => ({ ...p, repeat: v }))}>
              <SelectTrigger className="h-8 w-[100px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="不重复">不重复</SelectItem>
                <SelectItem value="每周">每周</SelectItem>
                <SelectItem value="每月">每月</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[length:var(--font-size-sm)]">
            <label className="flex items-center gap-2 cursor-pointer">
              <Switch checked={payload.allDay} onCheckedChange={(c) => patch((p) => ({ ...p, allDay: Boolean(c) }))} />
              <span>全天</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-border"
                checked={payload.locked}
                onChange={(e) => patch((p) => ({ ...p, locked: e.target.checked }))}
              />
              <span>不可调整</span>
            </label>
          </div>

          <div className="space-y-2">
            <Label className="text-text-secondary text-xs">参与人</Label>
            <div className="flex flex-wrap items-center gap-2">
              {payload.participants.map((p: MeetingParticipant) => (
                <span
                  key={p.name}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-bg-secondary px-2 py-0.5 text-[length:var(--font-size-xs)]"
                >
                  {p.conflict ? <AlertCircle className="size-3.5 text-orange-500 shrink-0" /> : null}
                  {p.name}
                  <button
                    type="button"
                    className="p-0.5 rounded-full hover:bg-black/10"
                    aria-label={`移除 ${p.name}`}
                    onClick={() => removeParticipant(p.name)}
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
              <Popover
                open={payload.contactsPopoverOpen}
                onOpenChange={(o) => patch((p) => ({ ...p, contactsPopoverOpen: o }))}
              >
                <PopoverTrigger asChild>
                  <button type="button" className="text-xs text-primary hover:underline">
                    添加参与人
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2" align="start">
                  <p className="text-[10px] text-text-secondary mb-2">规则 5 · 联系人（卡片内 Popover）</p>
                  {["王磊", "赵琦", "陈晨", "王芳"].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className="w-full text-left text-xs py-1.5 px-2 rounded hover:bg-muted"
                      onClick={() => addParticipant(n)}
                    >
                      + {n}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
              <button type="button" className="text-xs text-text-secondary hover:underline">
                批量添加
              </button>
            </div>
          </div>

          <Button type="button" variant="outline" size="sm" className="gap-1 h-8 text-xs">
            <Video className="size-3.5" />
            添加会议
          </Button>

          <div className="flex flex-wrap items-center gap-2 text-[length:var(--font-size-xs)]">
            <span className="text-text-secondary shrink-0">日历</span>
            <Select value={payload.calendarScope} onValueChange={(v) => patch((p) => ({ ...p, calendarScope: v }))}>
              <SelectTrigger className="h-8 w-[120px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="个人">个人</SelectItem>
                <SelectItem value="组织">组织</SelectItem>
              </SelectContent>
            </Select>
            <Select value={payload.visibility} onValueChange={(v) => patch((p) => ({ ...p, visibility: v }))}>
              <SelectTrigger className="h-8 min-w-[140px] text-xs gap-1">
                <Lock className="size-3 shrink-0 opacity-60" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="仅显示忙碌">仅显示忙碌</SelectItem>
                <SelectItem value="公开详情">公开详情</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Select value={payload.locationOrg} onValueChange={(v) => patch((p) => ({ ...p, locationOrg: v }))}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="微微集团">微微集团</SelectItem>
                <SelectItem value="示范教育机构">示范教育机构</SelectItem>
                <SelectItem value="个人">个人</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-text-secondary" />
                <Input
                  placeholder="添加地点"
                  className="h-9 pl-8 text-xs"
                  value={payload.locationDetail}
                  onChange={(e) => patch((p) => ({ ...p, locationDetail: e.target.value }))}
                />
              </div>
            </div>
            <Button type="button" variant="outline" size="sm" className="h-9 text-xs w-fit sm:col-span-2">
              + 添加会议室
            </Button>
          </div>

          <Select value={payload.reminder} onValueChange={(v) => patch((p) => ({ ...p, reminder: v }))}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="跟随参与人日程设置发送提醒">跟随参与人日程设置发送提醒</SelectItem>
              <SelectItem value="会前 15 分钟">会前 15 分钟</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => patch((p) => ({ ...p, showRightPanel: !p.showRightPanel }))}
              >
                {payload.showRightPanel ? "隐藏忙闲侧栏" : "查看忙闲侧栏（规则 3）"}
              </Button>
              {payload.showHandoffCta ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="text-xs"
                  onClick={() => onAppendHandoffCard?.()}
                >
                  发起调课申请（新卡片）
                </Button>
              ) : null}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => patch((p) => ({ ...p, title: p.title }))}>
                取消
              </Button>
              <Button
                type="button"
                variant="chat-submit"
                size="sm"
                onClick={() => {
                  if (payload.confirmBeforeSave) {
                    setSaveConfirmOpen(true)
                    return
                  }
                  const ts = new Date().toLocaleString("zh-CN", { hour12: false })
                  patch((p) => ({
                    ...p,
                    uiPhase: "saved",
                    savedAt: ts,
                    savedNotice: `已于 ${ts} 保存日程（演示）。规则 4：仍在同一条对话卡片内展示完成态。`,
                    datePickerOpen: null,
                    contactsPopoverOpen: false,
                  }))
                }}
              >
                {primaryAction}
              </Button>
            </div>
          </div>
        </div>

        {payload.showRightPanel ? (
          <div className="relative flex shrink-0">
            <button
              type="button"
              className="absolute left-0 top-1/2 -translate-x-1/2 z-20 flex size-6 items-center justify-center rounded-full border border-border bg-bg shadow-sm text-text-secondary hover:bg-muted"
              title="收起/展开侧栏"
              onClick={() => patch((p) => ({ ...p, showRightPanel: false }))}
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <BusySidebar conflictName={conflictParticipant} showConflict={showConflictBlock} />
          </div>
        ) : (
          <button
            type="button"
            className="hidden sm:flex w-5 shrink-0 items-center justify-center border-l border-border bg-bg-secondary/50 hover:bg-muted text-text-secondary"
            title="展开忙闲侧栏"
            onClick={() => patch((p) => ({ ...p, showRightPanel: true }))}
          >
            <ChevronRight className="size-3.5" />
          </button>
        )}
      </div>

      <AlertDialog open={saveConfirmOpen} onOpenChange={setSaveConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认{primaryAction}日程？</AlertDialogTitle>
            <AlertDialogDescription>
              规则 5：二次确认使用统一弹窗组件。确认后将写入本卡片完成态（演示数据）。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const ts = new Date().toLocaleString("zh-CN", { hour12: false })
                patch((p) => ({
                  ...p,
                  uiPhase: "saved",
                  savedAt: ts,
                  savedNotice: `已确认并于 ${ts} 保存（演示）。`,
                  confirmBeforeSave: false,
                  datePickerOpen: null,
                  contactsPopoverOpen: false,
                }))
                setSaveConfirmOpen(false)
              }}
            >
              确认
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export function createMeetingCardMessage(
  kind: "edit" | "create" | "handoff"
): { id: string; content: string } {
  const id = `cui-schedule-${Date.now()}`
  const payload =
    kind === "edit" ? buildMeetingEditPayload() : kind === "create" ? buildMeetingCreatePayload() : buildMeetingHandoffPayload()
  return { id, content: serializeCuiRulesPayload(payload) }
}

/** @deprecated 使用 createMeetingCardMessage("edit") */
export function createPlanCardMessage(): { id: string; content: string } {
  return createMeetingCardMessage("edit")
}

/** @deprecated 使用 createMeetingCardMessage("handoff") */
export function createHandoffCardMessage(): { id: string; content: string } {
  return createMeetingCardMessage("handoff")
}

/** @deprecated 兼容旧命名，改用 MeetingScheduleCardBody */
export const CuiRulesPlanCardBody = MeetingScheduleCardBody

/** @deprecated 兼容旧命名，改用 MeetingScheduleCardBody */
export const CuiRulesInlinePlanBody = MeetingScheduleCardBody

/** @deprecated 兼容旧命名，改用 MeetingScheduleCardBody */
export const CuiRulesHandoffCardBody = MeetingScheduleCardBody

/** @deprecated 兼容旧命名，模态层已并入主卡片 */
export function CuiRulesModalsHost(): null {
  return null
}

/** @deprecated 兼容旧命名，次级侧栏已移除 */
export function CuiRulesSecondaryPanel(): null {
  return null
}
