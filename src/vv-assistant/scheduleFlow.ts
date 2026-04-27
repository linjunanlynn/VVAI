import type { VvMeetingItem, VvScheduleCreateDraft, VvScheduleEditDraft, VvScheduleItem } from "./types"
import { CAL_DEFAULT_ID, normalizeText, SCHEDULE_CURRENT_USER_NAME } from "./seeds"

function pad2(n: number) {
  return String(n).padStart(2, "0")
}

/** 部分浏览器 `<input type="time">` 会产出 `12:30:00`；解析与落库统一为 `HH:mm`，避免 slotLabel 无法匹配 */
export function normalizeSlotClock(t: string): string {
  const raw = (t || "").trim()
  const m = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?/)
  if (!m) return raw || "09:00"
  const h = Math.min(23, Math.max(0, parseInt(m[1], 10) || 0))
  const min = Math.min(59, Math.max(0, parseInt(m[2], 10) || 0))
  return `${pad2(h)}:${pad2(min)}`
}

export function isoToday(): string {
  const d = new Date()
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

export function createRange(start: string, end: string) {
  return `${start} - ${end}`
}

/** 与 App.jsx resolveSlotBase 一致：今天/下周x + HH:mm - HH:mm */
export function resolveSlotBase(slotLabel: string) {
  const match = (slotLabel || "").match(
    /(今天|下周[一二三四五六日天])\s*(\d{1,2}:\d{2})(?::\d{2})?\s*-\s*(\d{1,2}:\d{2})(?::\d{2})?/
  )
  if (!match) return null
  return {
    dateLabel: match[1],
    start: normalizeSlotClock(match[2]),
    end: normalizeSlotClock(match[3]),
  }
}

/** 创建日程表单：解析 slotLabel → 日期/相对日/起止/全天 */
export function parseScheduleCreateSlotParts(slotLabel: string): {
  date: string
  start: string
  end: string
  allDay: boolean
  relDateLabel: string | null
} {
  const s = (slotLabel || "").trim()
  if (/全天/.test(s)) {
    const d = s.match(/(\d{4}-\d{2}-\d{2})/)
    return { date: d?.[1] ?? "", start: "00:00", end: "23:59", allDay: true, relDateLabel: null }
  }
  const iso = s.match(
    /(\d{4}-\d{2}-\d{2})\s+(\d{1,2}:\d{2})(?::\d{2})?\s*[-—–]\s*(\d{1,2}:\d{2})(?::\d{2})?/
  )
  if (iso) {
    return {
      date: iso[1],
      start: normalizeSlotClock(iso[2]),
      end: normalizeSlotClock(iso[3]),
      allDay: false,
      relDateLabel: null,
    }
  }
  const rel = resolveSlotBase(s)
  if (rel) {
    const relPrefix = s.match(/^(今天|下周[一二三四五六日天])/)
    return {
      date: "",
      start: normalizeSlotClock(rel.start),
      end: normalizeSlotClock(rel.end),
      allDay: false,
      relDateLabel: relPrefix?.[1] ?? rel.dateLabel,
    }
  }
  const times = s.match(/(\d{1,2}:\d{2})(?::\d{2})?\s*[-—–]\s*(\d{1,2}:\d{2})(?::\d{2})?/)
  if (times) {
    return {
      date: "",
      start: normalizeSlotClock(times[1]),
      end: normalizeSlotClock(times[2]),
      allDay: false,
      relDateLabel: null,
    }
  }
  return { date: "", start: "09:00", end: "10:00", allDay: false, relDateLabel: null }
}

/** 无 ISO 日期时默认落到今天（新建表单日期选择器不为空） */
export function normalizeScheduleCreateTimeParts(parts: ReturnType<typeof parseScheduleCreateSlotParts>) {
  if (parts.date) return parts
  if (parts.relDateLabel === null || parts.relDateLabel === "今天") {
    return { ...parts, date: isoToday(), relDateLabel: null }
  }
  return parts
}

export function composeScheduleCreateSlotLabel(parts: {
  date: string
  start: string
  end: string
  allDay: boolean
  relDateLabel: string | null
}): string {
  const start = normalizeSlotClock(parts.start)
  const end = normalizeSlotClock(parts.end)
  if (parts.allDay) {
    if (parts.date) return `${parts.date} 全天`
    return "全天"
  }
  if (parts.date) return `${parts.date} ${start} - ${end}`
  if (parts.relDateLabel) return `${parts.relDateLabel} ${start} - ${end}`
  return `${start} - ${end}`
}

export function findItemByTitle(items: VvScheduleItem[], title: string) {
  const normalized = normalizeText(title)
  return (
    items.find((item) => normalizeText(item.title) === normalized) ||
    items.find((item) => {
      const current = normalizeText(item.title)
      return current.includes(normalized) || normalized.includes(current)
    }) ||
    null
  )
}

export type DirectScheduleIntent =
  | {
      type: "schedule-edit"
      sourceTitle: string
      draft: VvScheduleEditDraft
    }
  | { type: "schedule-cancel"; title: string; reason: string }
  | {
      type: "schedule-create"
      draft: VvScheduleCreateDraft
    }

export function parseDirectScheduleIntent(text: string): DirectScheduleIntent | null {
  const content = text || ""
  const editSchedule = content.match(/请把“(.+?)”这条日程修改为：标题“(.+?)”，时间 (.+?) - (.+?)，地点“(.+?)”，提醒“(.+?)”。/)
  if (editSchedule) {
    const [, sourceTitle, title, start, end, location, reminder] = editSchedule
    return {
      type: "schedule-edit",
      sourceTitle,
      draft: { title, start, end, location, reminder },
    }
  }
  const cancelSchedule = content.match(/请取消“(.+?)”这条日程，取消原因是“(.+?)”(，并且(通知相关参与人|不要通知相关参与人))?。/)
  if (cancelSchedule) {
    const [, title, reason] = cancelSchedule
    return { type: "schedule-cancel", title, reason }
  }
  const createSchedule = content.match(/请新建一条日程：标题“(.+?)”，时间“(.+?)”，地点“(.+?)”，参与人“(.+?)”。/)
  if (createSchedule) {
    const [, title, slotLabel, location, attendees] = createSchedule
    return { type: "schedule-create", draft: { title, slotLabel, location, attendees } }
  }
  return null
}

const OPEN_QUOT = "\u201c"
const CLOSE_QUOT = "\u201d"

/** 与 parseDirectScheduleIntent / inferUserCommand 新建日程正则一致（弯引号 U+201C/U+201D） */
export function scheduleCreateIntentNaturalLine(draft: VvScheduleCreateDraft): string {
  return `请新建一条日程：标题${OPEN_QUOT}${draft.title}${CLOSE_QUOT}，时间${OPEN_QUOT}${draft.slotLabel}${CLOSE_QUOT}，地点${OPEN_QUOT}${draft.location}${CLOSE_QUOT}，参与人${OPEN_QUOT}${draft.attendees}${CLOSE_QUOT}。`
}

export function scheduleEditIntentNaturalLine(sourceTitle: string, draft: VvScheduleEditDraft): string {
  return `请把${OPEN_QUOT}${sourceTitle}${CLOSE_QUOT}这条日程修改为：标题${OPEN_QUOT}${draft.title}${CLOSE_QUOT}，时间 ${draft.start} - ${draft.end}，地点${OPEN_QUOT}${draft.location}${CLOSE_QUOT}，提醒${OPEN_QUOT}${draft.reminder}${CLOSE_QUOT}。`
}

export function scheduleCancelIntentNaturalLine(title: string, reason: string): string {
  return `请取消${OPEN_QUOT}${title}${CLOSE_QUOT}这条日程，取消原因是${OPEN_QUOT}${reason}${CLOSE_QUOT}，并且通知相关参与人。`
}

export function scheduleEditDraftFromItem(item: VvScheduleItem): VvScheduleEditDraft {
  return {
    title: item.title,
    location: item.location,
    start: item.start,
    end: item.end,
    reminder: item.reminder,
    calendarDate: item.calendarDate,
    calendarTypeId: item.calendarTypeId ?? CAL_DEFAULT_ID,
  }
}

export function updateLinkedMeetingFromSchedule(
  meetings: VvMeetingItem[],
  schedule: VvScheduleItem
): VvMeetingItem[] {
  if (!schedule.linkedMeetingId) return meetings
  return meetings.map((m) =>
    m.id === schedule.linkedMeetingId
      ? { ...m, time: schedule.time, start: schedule.start, end: schedule.end }
      : m
  )
}

export function markLinkedMeetingCancelled(meetings: VvMeetingItem[], scheduleItem: VvScheduleItem): VvMeetingItem[] {
  if (!scheduleItem.linkedMeetingId) return meetings
  return meetings.map((m) =>
    m.id === scheduleItem.linkedMeetingId ? { ...m, status: "cancelled" } : m
  )
}

export function defaultScheduleCreateDraft(): VvScheduleCreateDraft {
  return {
    title: "产品评审日程",
    slotLabel: `${isoToday()} 10:00 - 11:00`,
    location: "线上协作",
    attendees: "李四、王五、商业化团队",
    calendarTypeId: CAL_DEFAULT_ID,
  }
}

/** 与「新建日程」同款创建卡片；快捷「预约会议」等入口默认会议方式为微微会议 */
export function defaultScheduleCreateDraftForBookMeeting(): VvScheduleCreateDraft {
  return { ...defaultScheduleCreateDraft(), location: "微微会议" }
}

/** 从创建表单生成日程；支持 ISO 日期行或「今天 / 下周x」文案 */
function scheduleListDateLabel(calendarDate: string): string {
  if (calendarDate === isoToday()) return "今天"
  const m = calendarDate.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return "今天"
  const month = parseInt(m[2], 10)
  const day = parseInt(m[3], 10)
  return `${month}月${day}日`
}

export function buildNewScheduleItemFromCreateDraft(draft: VvScheduleCreateDraft): VvScheduleItem | null {
  const parts = parseScheduleCreateSlotParts(draft.slotLabel)
  let calendarDate: string | undefined
  let start = parts.start
  let end = parts.end

  if (parts.date) {
    calendarDate = parts.date
  } else if (parts.relDateLabel === "今天") {
    calendarDate = isoToday()
  } else {
    const base = resolveSlotBase(draft.slotLabel)
    if (base) {
      start = base.start
      end = base.end
      if (base.dateLabel === "今天") {
        calendarDate = isoToday()
      } else {
        const d = new Date()
        d.setDate(d.getDate() + 7)
        calendarDate = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
      }
    }
  }

  /** 与 `normalizeScheduleCreateTimeParts` 对齐：仅有「HH:mm - HH:mm」而无日期时落到今天，避免确认创建得到 null */
  if (!calendarDate) {
    const t = (draft.slotLabel || "").trim()
    if (/^\d{1,2}:\d{2}(?::\d{2})?\s*[-—–]\s*\d{1,2}:\d{2}(?::\d{2})?$/.test(t)) {
      calendarDate = isoToday()
    }
  }

  if (!calendarDate) return null

  const calId = (draft.calendarTypeId?.trim() || CAL_DEFAULT_ID) as string

  const attendeeParts = (draft.attendees ?? "")
    .split(/[、,，]/)
    .map((s) => s.trim())
    .filter(Boolean)
  const attendees =
    attendeeParts.includes(SCHEDULE_CURRENT_USER_NAME)
      ? attendeeParts
      : [SCHEDULE_CURRENT_USER_NAME, ...attendeeParts]

  const dateLabel = scheduleListDateLabel(calendarDate)
  const ns = normalizeSlotClock(start)
  const ne = normalizeSlotClock(end)

  return {
    id: `s${Date.now()}`,
    title: (draft.title ?? "").trim() || "未命名日程",
    start: ns,
    end: ne,
    time: createRange(ns, ne),
    location: (draft.location ?? "").trim(),
    attendees,
    reminder: "开始前 10 分钟",
    notes: "",
    status: "confirmed",
    dateLabel,
    linkedMeetingId: null,
    organization: "微微集团",
    organizerName: SCHEDULE_CURRENT_USER_NAME,
    calendarDate,
    calendarTypeId: calId,
  }
}

export function notifyTextForSchedule(item: VvScheduleItem) {
  return `各位好，「${item.title}」的时间为 ${item.time}，地点 ${item.location}，请预留时间并准时参加。`
}

export function buildUpdatedScheduleFromEdit(item: VvScheduleItem, draft: VvScheduleEditDraft): VvScheduleItem {
  const next: VvScheduleItem = {
    ...item,
    title: draft.title,
    location: draft.location,
    start: draft.start,
    end: draft.end,
    time: createRange(draft.start, draft.end),
    reminder: draft.reminder,
    status: "confirmed",
  }
  if (draft.calendarDate !== undefined) {
    const d = draft.calendarDate.trim()
    next.calendarDate = d || undefined
  }
  if (draft.calendarTypeId !== undefined) {
    next.calendarTypeId = draft.calendarTypeId.trim() || CAL_DEFAULT_ID
  }
  return next
}
