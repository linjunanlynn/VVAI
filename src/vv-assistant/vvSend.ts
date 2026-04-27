import type { Dispatch, SetStateAction } from "react"
import type { Message } from "../components/chat/data"
import { currentUser } from "../components/chat/data"
import { inferUserCommand } from "./cliHints"
import { planGeneralVvInteraction } from "./vvPlan"
import type {
  VvAssistantPayload,
  VvContext,
  VvFlow,
  VvMeetingItem,
  VvScheduleCalendarPrefs,
  VvScheduleItem,
} from "./types"
import { parseScheduleCalendarPrefsIntentFromText } from "./scheduleCalendarPrefs"
import {
  findItemByTitle,
  parseDirectScheduleIntent,
  scheduleEditDraftFromItem,
} from "./scheduleFlow"
import { CAL_DEFAULT_ID } from "./seeds"
import { buildInstantMeeting, defaultMeetingStartDraft } from "./meetingFlow"

function ts() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export function vvAssistantMessageFromPayload(payload: VvAssistantPayload, aiSenderId: string): Message {
  if (payload.kind === "assistant-text") {
    return {
      id: `vv-a-${Date.now()}`,
      senderId: aiSenderId,
      content: payload.text,
      timestamp: ts(),
      createdAt: Date.now(),
    }
  }
  return {
    id: `vv-a-${Date.now()}`,
    senderId: aiSenderId,
    content: "\u200b",
    timestamp: ts(),
    createdAt: Date.now(),
    vvAssistant: payload,
  }
}

export type VvSendScheduleBridge = {
  getScheduleItems: () => VvScheduleItem[]
  setScheduleItems: Dispatch<SetStateAction<VvScheduleItem[]>>
  setMeetingItems: Dispatch<SetStateAction<VvMeetingItem[]>>
}

/** 结构化自然语言日程句式：只打开表单/确认卡，由用户在界面内确认后再落库 */
function tryApplyDirectScheduleIntent(
  text: string,
  bridge: VvSendScheduleBridge
): { payload: VvAssistantPayload; nextFlow: VvFlow | null } | null {
  const intent = parseDirectScheduleIntent(text)
  if (!intent) return null

  if (intent.type === "schedule-edit") {
    const item = findItemByTitle(bridge.getScheduleItems(), intent.sourceTitle)
    if (!item) {
      return { payload: { kind: "assistant-text", text: `未找到日程「${intent.sourceTitle}」。` }, nextFlow: null }
    }
    const base = scheduleEditDraftFromItem(item)
    const draft = {
      ...base,
      title: intent.draft.title,
      location: intent.draft.location,
      start: intent.draft.start,
      end: intent.draft.end,
      reminder: intent.draft.reminder,
    }
    return {
      payload: { kind: "schedule-edit", item, draft },
      nextFlow: { type: "schedule-edit", scheduleId: item.id, draft },
    }
  }

  if (intent.type === "schedule-cancel") {
    const item = findItemByTitle(bridge.getScheduleItems(), intent.title)
    if (!item) {
      return { payload: { kind: "assistant-text", text: `未找到日程「${intent.title}」。` }, nextFlow: null }
    }
    const reason = intent.reason
    return {
      payload: { kind: "schedule-cancel-confirm", item, reason },
      nextFlow: { type: "schedule-cancel", scheduleId: item.id, reason },
    }
  }

  if (intent.type === "schedule-create") {
    const draft = {
      ...intent.draft,
      calendarTypeId: intent.draft.calendarTypeId ?? CAL_DEFAULT_ID,
    }
    return {
      payload: { kind: "schedule-create", draft, viaFreeSlots: false },
      nextFlow: { type: "schedule-create", draft, viaFreeSlots: false },
    }
  }

  return null
}

export type RunVvGeneralSendOptions = {
  scheduleBridge?: VvSendScheduleBridge
  /** 仅「日程」应用传入：自然语言修改日历基础设置 */
  scheduleCalendarPrefsBridge?: {
    getPrefs: () => VvScheduleCalendarPrefs
    setPrefs: Dispatch<SetStateAction<VvScheduleCalendarPrefs>>
  }
  /**
   * 为 true 时不再追加「用户气泡」（外层已追加同一条可见输入，如《主CUI交互》底部日历 dock）。
   * 同时跳过「识别中」延迟，避免与外层消息 id 不一致。
   */
  omitUserBubble?: boolean
}

/**
 * 迁移自 助手 App.jsx：dispatchIntent + handleCommand（通用域）。
 */
export function runVvGeneralSend(
  text: string,
  ctx: VvContext,
  setMessages: Dispatch<SetStateAction<Message[]>>,
  aiSenderId: string,
  flow: VvFlow,
  setVvFlow: Dispatch<SetStateAction<VvFlow>>,
  options?: RunVvGeneralSendOptions
) {
  const commandHint = inferUserCommand(text)
  const shouldDelay = Boolean(commandHint) && !options?.omitUserBubble
  const userId = `vv-u-${Date.now()}`
  const userMsg: Message = {
    id: userId,
    senderId: currentUser.id,
    content: text,
    timestamp: ts(),
    createdAt: Date.now(),
    vvMeta: {
      commandHint: commandHint ?? undefined,
      showCommandHint: !shouldDelay && Boolean(commandHint),
      isRecognizing: shouldDelay,
    },
  }

  const pushAssistant = () => {
    if (text.trim() === "发起会议" && options?.scheduleBridge) {
      setVvFlow(null)
      const draft = defaultMeetingStartDraft()
      const newMeeting = buildInstantMeeting(draft)
      options.scheduleBridge.setMeetingItems((prev) => [...prev, newMeeting])
      const bot = vvAssistantMessageFromPayload(
        {
          kind: "vv-success",
          title: "即时会议已发起",
          description: "会议已创建",
          actions: [{ label: "进入会议", action: { kind: "noop" } }],
        },
        aiSenderId
      )
      setMessages((prev) => [...prev, bot])
      return
    }
    if (options?.scheduleCalendarPrefsBridge) {
      const cur = options.scheduleCalendarPrefsBridge.getPrefs()
      const prefsProposed = parseScheduleCalendarPrefsIntentFromText(text, cur)
      if (prefsProposed) {
        setVvFlow(null)
        const bot = vvAssistantMessageFromPayload(
          { kind: "schedule-calendar-settings", initialPrefs: prefsProposed },
          aiSenderId
        )
        setMessages((prev) => [...prev, bot])
        return
      }
    }
    if (options?.scheduleBridge) {
      const direct = tryApplyDirectScheduleIntent(text, options.scheduleBridge)
      if (direct) {
        setVvFlow(direct.nextFlow)
        const bot = vvAssistantMessageFromPayload(direct.payload, aiSenderId)
        setMessages((prev) => [...prev, bot])
        return
      }
    }
    const { payload, nextFlow } = planGeneralVvInteraction(text, ctx, flow)
    setVvFlow(nextFlow)
    const bot = vvAssistantMessageFromPayload(payload, aiSenderId)
    setMessages((prev) => [...prev, bot])
  }

  if (!options?.omitUserBubble) {
    setMessages((prev) => [...prev, userMsg])
  }

  if (!shouldDelay) {
    pushAssistant()
    return
  }

  window.setTimeout(() => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === userId && m.vvMeta
          ? {
              ...m,
              vvMeta: {
                ...m.vvMeta,
                isRecognizing: false,
                showCommandHint: true,
              },
            }
          : m
      )
    )
    window.setTimeout(pushAssistant, 180)
  }, 1000)
}
