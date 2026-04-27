import type { Message } from "../chat/data"

/** 《主CUI交互》内 CUI 卡片规则演示专用消息载荷（仅 `cui-card-rules` scenario） */
export const CUI_RULES_INTERACTION_MARKER = "<<<CUI_RULES_INTERACTION>>>"

export type MeetingParticipant = { name: string; conflict?: boolean }

/** 统一为「创建/编辑日程」GUI（参考设计：左侧表单 + 右侧忙闲侧栏；日历与联系人在此卡片内 Popover 演示） */
export type CuiRulesInteractionPayload = {
  v: 1
  variant: "meeting_schedule"
  /** 创建日程 vs 编辑日程 顶栏文案 */
  windowMode: "create" | "edit"
  uiPhase: "form" | "saved"
  title: string
  description: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  allDay: boolean
  locked: boolean
  repeat: string
  participants: MeetingParticipant[]
  locationOrg: string
  locationDetail: string
  meetingRoom: string
  visibility: string
  reminder: string
  calendarScope: string
  /** 规则 3：右侧忙闲与冲突侧栏 */
  showRightPanel: boolean
  /** 规则 5：日期选择 — 在卡片内 Popover 打开 */
  datePickerOpen: null | "start" | "end"
  /** 规则 5：参与人 — 在卡片内 Popover */
  contactsPopoverOpen: boolean
  /** 规则 5：点击「完成/创建」时先走二次确认 */
  confirmBeforeSave: boolean
  savedAt?: string
  savedNotice?: string
  /** 主卡片演示：展示「发起调课 → 新卡片」 */
  showHandoffCta?: boolean
}

export function serializeCuiRulesPayload(p: CuiRulesInteractionPayload): string {
  return `${CUI_RULES_INTERACTION_MARKER}:${JSON.stringify(p)}`
}

export function parseCuiRulesPayload(content: string): CuiRulesInteractionPayload | null {
  if (!content.startsWith(`${CUI_RULES_INTERACTION_MARKER}:`)) return null
  try {
    return JSON.parse(content.slice(CUI_RULES_INTERACTION_MARKER.length + 1)) as CuiRulesInteractionPayload
  } catch {
    return null
  }
}

export function patchCuiRulesMessage(
  messages: Message[],
  messageId: string,
  mutator: (p: CuiRulesInteractionPayload) => CuiRulesInteractionPayload
): Message[] {
  return messages.map((m) => {
    if (m.id !== messageId) return m
    const cur = parseCuiRulesPayload(m.content)
    if (!cur) return m
    return { ...m, content: serializeCuiRulesPayload(mutator(cur)) }
  })
}

const DEMO_FOLLOW_UPS = [
  "生成会议日程卡片",
  "创建空白会议日程",
  "打开日历选择演示",
  "添加参与人演示",
  "二次确认演示",
  "演示非操作指令回复",
  "演示非业务问题回复",
] as const

export function buildMeetingEditPayload(): CuiRulesInteractionPayload {
  return {
    v: 1,
    variant: "meeting_schedule",
    windowMode: "edit",
    uiPhase: "form",
    title: "4-5月产研核心工作项目及任务安排",
    description: "",
    startDate: "2026-04-15",
    endDate: "2026-04-15",
    startTime: "15:00",
    endTime: "16:00",
    allDay: false,
    locked: false,
    repeat: "不重复",
    participants: [
      { name: "林俊安" },
      { name: "陈廷凯" },
      { name: "刘艳平" },
      { name: "贾曙光", conflict: true },
    ],
    locationOrg: "微微集团",
    locationDetail: "",
    meetingRoom: "",
    visibility: "仅显示忙碌",
    reminder: "跟随参与人日程设置发送提醒",
    calendarScope: "个人",
    showRightPanel: true,
    datePickerOpen: null,
    contactsPopoverOpen: false,
    confirmBeforeSave: false,
    showHandoffCta: true,
  }
}

/** @deprecated 兼容旧调用方，等价于 buildMeetingEditPayload */
export function buildInlinePlanPayload(): CuiRulesInteractionPayload {
  return buildMeetingEditPayload()
}

export function buildMeetingCreatePayload(): CuiRulesInteractionPayload {
  return {
    v: 1,
    variant: "meeting_schedule",
    windowMode: "create",
    uiPhase: "form",
    title: "",
    description: "",
    startDate: "2026-04-15",
    endDate: "2026-04-15",
    startTime: "15:00",
    endTime: "16:00",
    allDay: false,
    locked: false,
    repeat: "不重复",
    participants: [{ name: "lynn" }],
    locationOrg: "个人",
    locationDetail: "",
    meetingRoom: "",
    visibility: "仅显示忙碌",
    reminder: "跟随参与人日程设置发送提醒",
    calendarScope: "个人",
    showRightPanel: true,
    datePickerOpen: null,
    contactsPopoverOpen: false,
    confirmBeforeSave: false,
    showHandoffCta: false,
  }
}

export function buildMeetingHandoffPayload(): CuiRulesInteractionPayload {
  return {
    v: 1,
    variant: "meeting_schedule",
    windowMode: "edit",
    uiPhase: "form",
    title: "调课协调 · 会议室与课表备案",
    description: "由上一张日程卡片发起的新业务指令（演示）：与教研计划为不同域，故使用新卡片承载。",
    startDate: "2026-04-16",
    endDate: "2026-04-16",
    startTime: "09:00",
    endTime: "10:00",
    allDay: false,
    locked: true,
    repeat: "不重复",
    participants: [{ name: "教务处" }, { name: "年级组长" }],
    locationOrg: "示范教育机构",
    locationDetail: "教务处会议室",
    meetingRoom: "B102",
    visibility: "仅显示忙碌",
    reminder: "会前 15 分钟",
    calendarScope: "组织",
    showRightPanel: true,
    datePickerOpen: null,
    contactsPopoverOpen: false,
    confirmBeforeSave: false,
    showHandoffCta: false,
  }
}

export function buildMeetingPayloadWithUi(opts: {
  datePickerOpen?: null | "start" | "end"
  contactsPopoverOpen?: boolean
  confirmBeforeSave?: boolean
}): CuiRulesInteractionPayload {
  const base = buildMeetingEditPayload()
  return {
    ...base,
    datePickerOpen: opts.datePickerOpen ?? null,
    contactsPopoverOpen: opts.contactsPopoverOpen ?? false,
    confirmBeforeSave: opts.confirmBeforeSave ?? false,
    showHandoffCta: false,
  }
}

export type CuiCardRulesMatchResult =
  | { kind: "meeting_edit" }
  | { kind: "meeting_create" }
  | { kind: "meeting_ui"; datePickerOpen?: null | "start" | "end"; contactsPopoverOpen?: boolean; confirmBeforeSave?: boolean }
  | { kind: "nl"; content: string; followLabel: string }

export function matchCuiCardRulesDemo(raw: string): CuiCardRulesMatchResult {
  const t = raw.trim()

  if (
    t.includes("生成会议日程") ||
    t.includes("生成学期教研计划") ||
    (t.includes("教研计划") && t.includes("卡片")) ||
    t.includes("会议日程卡片")
  ) {
    return { kind: "meeting_edit" }
  }
  if (
    t.includes("创建空白会议") ||
    t.includes("可调字段") ||
    t.includes("卡片内编辑") ||
    t.includes("规则4") ||
    t.includes("规则 4")
  ) {
    return { kind: "meeting_create" }
  }
  if (t.includes("日历演示") || t.includes("打开日历") || t.includes("日历选择演示")) {
    return { kind: "meeting_ui", datePickerOpen: "start" }
  }
  if (t.includes("联系人演示") || t.includes("选择联系人") || t.includes("添加参与人演示")) {
    return { kind: "meeting_ui", contactsPopoverOpen: true }
  }
  if (t.includes("二次确认")) {
    return { kind: "meeting_ui", confirmBeforeSave: true }
  }

  if (/谢谢|好的知道|辛苦了|演示非操作/.test(t)) {
    return {
      kind: "nl",
      followLabel: "非操作类自然语言",
      content:
        "不客气。这类属于非操作指令的轻量回复：我不会生成新的业务卡片，只在对话里说明与承接。需要体验「创建/编辑日程」GUI 时，可用下方推荐指令。",
    }
  }

  if (/天气|笑话|闲聊|演示非业务/.test(t)) {
    return {
      kind: "nl",
      followLabel: "非业务相关问题",
      content:
        "我当前连接的是「示范教育机构」教务与协作场景，天气、笑话等不在本业务域内，因此仅作简短说明。若要体验会议日程卡片、侧栏忙闲与弹层组件，请用下方演示指令。",
    }
  }

  return {
    kind: "nl",
    followLabel: "引导与范围说明",
    content: `已收到「${t.length > 60 ? `${t.slice(0, 58)}…` : t}」。在本演示中，GUI 统一为「创建/编辑日程」卡片（含日历 Popover、参与人、右侧忙闲侧栏）；也可通过推荐指令逐项体验规则。`,
  }
}

export function demoFollowUpPrompts(): string[] {
  return [...DEMO_FOLLOW_UPS]
}
