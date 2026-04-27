import type { Message, MessageOperationSource } from "../components/chat/data"

export type { MessageOperationSource }

export function resolveOperationSourceLabel(
  msg: Message,
  index: number,
  messages: Message[],
  currentConversationId: string | undefined,
): string | undefined {
  const op = msg.operationSource
  if (!op) return undefined
  const titleRaw = op.cardTitle?.trim()
  if (!titleRaw || !op.sourceMessageId) return undefined
  if (
    currentConversationId !== undefined &&
    op.sourceConversationId !== undefined &&
    op.sourceConversationId !== currentConversationId
  ) {
    return undefined
  }
  if (index > 0 && messages[index - 1]?.id === op.sourceMessageId) {
    return undefined
  }
  const title = titleRaw
  const detail = op.sourceDetailLabel?.trim()
  if (detail) {
    return `${title}  ${detail}`
  }
  return title
}

function escapeMessageIdForSelector(id: string): string {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(id)
  }
  return id.replace(/\\/g, "\\\\").replace(/"/g, '\\"')
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * 将列表滚动到含 `data-message-id` 的消息行顶对齐；尽量避开顶栏遮挡。
 */
export function scrollToMessageById(messageId: string): void {
  const safe = escapeMessageIdForSelector(messageId)
  const el = document.querySelector(`[data-message-id="${safe}"]`) as HTMLElement | null
  if (!el) return

  const scrollParent = el.closest(".overflow-y-auto") as HTMLElement | null
  const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth"

  if (!scrollParent) {
    el.scrollIntoView({ block: "start", behavior })
    return
  }

  const headerEl = scrollParent.previousElementSibling as HTMLElement | null
  let headerReserve = 0
  if (headerEl) {
    const tag = headerEl.tagName.toLowerCase()
    if (tag === "header" || headerEl.classList.contains("flex-none")) {
      headerReserve = headerEl.getBoundingClientRect().height
    }
  }

  const parentRect = scrollParent.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()
  const relativeTop = elRect.top - parentRect.top + scrollParent.scrollTop
  const top = Math.max(0, relativeTop - headerReserve - 4)
  scrollParent.scrollTo({ top, behavior })
}
