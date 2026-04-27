import * as React from "react"
import type { Message } from "../components/chat/data"
import type { VvScheduleItem } from "./types"

/** 从当前线程消息中提取各日程 id 的最新快照（后出现的消息覆盖先出现的） */
export function collectLatestScheduleItemsById(messages: Message[]): Map<string, VvScheduleItem> {
  const map = new Map<string, VvScheduleItem>()
  for (const msg of messages) {
    const p = msg.vvAssistant
    if (!p) continue
    if (p.kind === "schedule-agenda") {
      for (const it of p.items) map.set(it.id, it)
    } else if (p.kind === "schedule-all") {
      for (const it of p.items) map.set(it.id, it)
    } else if (p.kind === "schedule-detail") {
      map.set(p.item.id, p.item)
    } else if (p.kind === "schedule-edit") {
      map.set(p.item.id, p.item)
    } else if (p.kind === "schedule-cancel-confirm") {
      map.set(p.item.id, p.item)
    }
  }
  return map
}

export type VvScheduleSideSheetSurface = "main" | "floating"

export type VvScheduleSideSheetOpenOpts = {
  /** 与 getMessagesForApp 一致，用于从对话中同步该线程的最新日程数据 */
  appId: string | null
  /** 主列或浮动窗，侧栏挂在对应全高 Portal 上 */
  surface: VvScheduleSideSheetSurface
  /** surface 为 floating 时：侧栏挂在哪一个浮动窗（多窗并存时必传，通常等于 appId） */
  floatingHostAppId?: string | null
  /** 今日日程列表为 true；全部日程等为 false */
  treatDateLabelTodayAsNotPast?: boolean
  /** 侧栏内日程面板初始模式；如 "cancel" 表示已点开删除确认（演示用） */
  initialSidePanelMode?: "detail" | "edit" | "cancel"
}

export type VvScheduleSideSheetContextValue = {
  /** 同一时间只保留一个侧栏；再次打开会替换为新的日程 */
  openScheduleSideSheet: (item: VvScheduleItem, opts: VvScheduleSideSheetOpenOpts) => void
  closeScheduleSideSheet: () => void
}

export const VvScheduleSideSheetContext = React.createContext<VvScheduleSideSheetContextValue | null>(null)

export function useVvScheduleSideSheet(): VvScheduleSideSheetContextValue {
  const c = React.useContext(VvScheduleSideSheetContext)
  if (!c) throw new Error("useVvScheduleSideSheet must be used within VvScheduleSideSheetContext.Provider")
  return c
}

export function useVvScheduleSideSheetOptional(): VvScheduleSideSheetContextValue | null {
  return React.useContext(VvScheduleSideSheetContext)
}
