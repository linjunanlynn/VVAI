import * as React from "react"

/** 侧栏等：挂载到主列（顶栏 + 内容 + 底栏）全高区域，相对该列 `absolute inset-y-0` */
export const VvChatFullInsetPortalContext = React.createContext<HTMLElement | null>(null)

export function useVvChatFullInsetPortal(): HTMLElement | null {
  return React.useContext(VvChatFullInsetPortalContext)
}
