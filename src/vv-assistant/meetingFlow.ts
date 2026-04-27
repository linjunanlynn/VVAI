import { CAL_DEFAULT_ID, SCHEDULE_CURRENT_USER_NAME } from "./seeds"
import type { VvMeetingItem, VvMeetingStartFormDraft, VvScheduleItem } from "./types"
import { createRange } from "./scheduleFlow"

export function getTodayDateInputValue() {
  return new Date().toISOString().slice(0, 10)
}

export function formatMeetingDateLabel(dateValue: string) {
  if (!dateValue) return "今天"
  const today = new Date()
  const todayValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
  if (dateValue === todayValue) return "今天"
  return dateValue
}

export function resolveMeetingScheduledBase(draft: VvMeetingStartFormDraft) {
  if (draft.timeMode !== "scheduled") return null
  if (!draft.customDate || !draft.startTime || !draft.endTime) return null
  return {
    dateLabel: formatMeetingDateLabel(draft.customDate),
    start: draft.startTime,
    end: draft.endTime,
  }
}

export function defaultMeetingStartDraft(): VvMeetingStartFormDraft {
  return {
    title: "临时讨论会",
    participants: SCHEDULE_CURRENT_USER_NAME,
    room: "微微会议",
    timeMode: "instant",
    customDate: getTodayDateInputValue(),
    startTime: "15:00",
    endTime: "15:30",
    calendarTypeId: CAL_DEFAULT_ID,
  }
}

export function buildInstantMeeting(draft: VvMeetingStartFormDraft): VvMeetingItem {
  return {
    id: `m${Date.now()}`,
    title: draft.title,
    start: "现在",
    end: "进行中",
    time: "现在起立即开始",
    room: draft.room,
    participants: draft.participants
      .split(/[、,，]/)
      .map((s) => s.trim())
      .filter(Boolean),
    status: "live",
    agenda: "由统一飞书助手发起的即时会议。",
    linkedScheduleId: null,
    recordId: null,
  }
}

export function buildBookedMeetingAndSchedule(
  draft: VvMeetingStartFormDraft,
  base: { dateLabel: string; start: string; end: string }
): { newMeeting: VvMeetingItem; newSchedule: VvScheduleItem } {
  const scheduleId = `s${Date.now()}`
  const meetingId = `m${Date.now()}1`
  const participants = draft.participants
    .split(/[、,，]/)
    .map((s) => s.trim())
    .filter(Boolean)
  const newSchedule: VvScheduleItem = {
    id: scheduleId,
    title: draft.title.replace("会", "日程"),
    start: base.start,
    end: base.end,
    time: createRange(base.start, base.end),
    location: draft.room,
    attendees: participants,
    reminder: "开始前 10 分钟",
    notes: "由会议预约流程同步生成的关联日程。",
    status: "draft",
    dateLabel: base.dateLabel,
    linkedMeetingId: meetingId,
    calendarTypeId: draft.calendarTypeId?.trim() || CAL_DEFAULT_ID,
  }
  const newMeeting: VvMeetingItem = {
    id: meetingId,
    title: draft.title,
    start: base.start,
    end: base.end,
    time: `${base.dateLabel} ${base.start} - ${base.end}`,
    room: draft.room,
    participants,
    status: "scheduled",
    agenda: "由统一飞书助手预约生成的会议。",
    linkedScheduleId: scheduleId,
    recordId: null,
  }
  return { newMeeting, newSchedule }
}
