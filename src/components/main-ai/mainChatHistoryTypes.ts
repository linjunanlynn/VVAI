import type { Message } from "../chat/data"

/** 主 VVAI 对话归档条目（顶栏「历史消息」列表） */
export type MainChatHistoryEntry = {
  id: string
  title: string
  updatedAt: number
  messages: Message[]
}
