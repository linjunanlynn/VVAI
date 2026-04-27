import { coerceMessagesList, type Conversation } from "../chat/data"
import type { MainChatHistoryEntry } from "./mainChatHistoryTypes"

export const PAIRED_BOOTSTRAP_STORAGE_KEY = "vvai-paired-bootstrap"

/** 与独立窗口之间实时同步的 BroadcastChannel 名（同 origin 下多标签页） */
export const PAIRED_BROADCAST_CHANNEL = "vvai-main-ai-paired-sync-v1"

export type PairedMainAiBootstrap = {
  conversations: Conversation[]
  mainChatHistory: MainChatHistoryEntry[]
  selectedId: string
}

export type PairedSyncBroadcastPayload = PairedMainAiBootstrap & {
  source: string
}

export function cloneConversationDeep(c: Conversation): Conversation {
  return {
    ...c,
    messages: coerceMessagesList(c.messages).map((m) => ({ ...m })),
  }
}

export function cloneConversationsList(list: Conversation[]): Conversation[] {
  return list.map(cloneConversationDeep)
}

export function cloneMainChatHistory(entries: MainChatHistoryEntry[]): MainChatHistoryEntry[] {
  return entries.map((e) => ({
    ...e,
    messages: coerceMessagesList(e.messages).map((m) => ({ ...m })),
  }))
}

let pairedInitCache: PairedMainAiBootstrap | null | undefined

/**
 * 独立窗口 `?standalone=1&paired=1` 首次初始化时读取 opener 写入的 bootstrap（仅消费一次，兼容 StrictMode 双调用）。
 */
export function consumePairedMainAiInit(search: string): PairedMainAiBootstrap | null {
  if (pairedInitCache !== undefined) return pairedInitCache
  if (typeof window === "undefined") {
    pairedInitCache = null
    return null
  }
  const params = new URLSearchParams(search)
  if (params.get("standalone") !== "1" || params.get("paired") !== "1") {
    pairedInitCache = null
    return null
  }
  try {
    const raw = sessionStorage.getItem(PAIRED_BOOTSTRAP_STORAGE_KEY)
    if (!raw) {
      pairedInitCache = null
      return null
    }
    sessionStorage.removeItem(PAIRED_BOOTSTRAP_STORAGE_KEY)
    const data = JSON.parse(raw) as {
      conversations?: unknown
      mainChatHistory?: unknown
      selectedId?: unknown
    }
    if (!Array.isArray(data.conversations) || data.conversations.length === 0) {
      pairedInitCache = null
      return null
    }
    const conversations = cloneConversationsList(data.conversations as Conversation[])
    const mainChatHistory = Array.isArray(data.mainChatHistory)
      ? cloneMainChatHistory(data.mainChatHistory as MainChatHistoryEntry[])
      : []
    const selectedId =
      typeof data.selectedId === "string" && data.selectedId.length > 0
        ? data.selectedId
        : conversations[0]?.id ?? "c1"
    pairedInitCache = { conversations, mainChatHistory, selectedId }
    return pairedInitCache
  } catch {
    pairedInitCache = null
    return null
  }
}

export function pairedStateFingerprint(
  conversations: Conversation[],
  mainChatHistory: MainChatHistoryEntry[],
  selectedId: string
): string {
  try {
    return JSON.stringify({
      s: selectedId,
      h: mainChatHistory.map((e) => ({ id: e.id, t: e.title, u: e.updatedAt })),
      c: conversations.map((c) => ({
        id: c.id,
        m: c.messages.map((x) => ({
          id: x.id,
          sid: x.senderId,
          ct: x.content,
          ca: x.createdAt,
        })),
      })),
    })
  } catch {
    return String(Date.now())
  }
}
