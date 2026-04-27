import type { VvAssistantPayload } from "./types"

/** 主 VVAI 侧 vv 轮次是否应同步到「日历」dock 会话历史（日程 + 与日程同壳的会议卡等） */
export function isVvPayloadCalendarConversationSyncDomain(payload: VvAssistantPayload): boolean {
  switch (payload.kind) {
    case "schedule-agenda":
    case "schedule-all":
    case "schedule-detail":
    case "schedule-edit":
    case "schedule-create":
    case "schedule-notify-draft":
    case "schedule-cancel-confirm":
    case "schedule-calendar-settings":
    case "schedule-calendar-settings-summary":
    case "schedule-calendar-create":
    case "schedule-subscribe-colleague":
    case "schedule-subscribe-confirm":
    case "schedule-unsubscribe-confirm":
    case "schedule-side-session-link":
    case "free-slots":
      return true
    case "meeting-agenda":
    case "meeting-detail":
    case "meeting-list":
    case "meeting-start-form":
    case "meeting-join-card":
    case "meeting-record-hub":
      return true
    case "choice":
      return payload.followUp === "schedule-edit" || payload.followUp === "schedule-cancel"
    default:
      return false
  }
}
