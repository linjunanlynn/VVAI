import * as React from "react"

/** 日程等弹窗仅覆盖该区域（对话滚动区），底部输入条保持可点 */
export const VvChatInsetDialogPortalContext = React.createContext<HTMLElement | null>(null)

export function useVvChatInsetDialogPortal(): HTMLElement | null {
  return React.useContext(VvChatInsetDialogPortalContext)
}
