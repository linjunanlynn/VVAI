import * as React from "react"
import { cn } from "../ui/utils"
import type { VvScheduleCalendarPrefs, VvUserCalendarType } from "../../vv-assistant/types"
import { useUserCalendars } from "../../vv-assistant/userCalendarsContext"
import { VvChatInsetDialogPortalContext } from "../../vv-assistant/vvChatInsetDialogPortalContext"
import { VvChatFullInsetPortalContext } from "../../vv-assistant/vvChatFullInsetPortalContext"

/** 供父组件在 Provider 外持有 ref，runVvGeneralSend 读取日历偏好（自然语言改设置） */
export function ScheduleCalendarSettingsPrefsSync({
  bridgeRef,
}: {
  bridgeRef: React.MutableRefObject<{
    getPrefs: () => VvScheduleCalendarPrefs
    setPrefs: React.Dispatch<React.SetStateAction<VvScheduleCalendarPrefs>>
  } | null>
}) {
  const { scheduleCalendarPrefs, setScheduleCalendarPrefs } = useUserCalendars()
  React.useLayoutEffect(() => {
    bridgeRef.current = {
      getPrefs: () => scheduleCalendarPrefs,
      setPrefs: setScheduleCalendarPrefs,
    }
  }, [bridgeRef, scheduleCalendarPrefs, setScheduleCalendarPrefs])
  return null
}

export function SubscribedColleagueBridgeSync({
  bridgeRef,
}: {
  bridgeRef: React.MutableRefObject<{
    add: (id: string) => void
    remove: (id: string) => void
    isSubscribed: (id: string) => boolean
  } | null>
}) {
  const { addSubscribedColleague, removeSubscribedColleague, subscribedColleagueIds } = useUserCalendars()
  const idsRef = React.useRef(subscribedColleagueIds)
  idsRef.current = subscribedColleagueIds
  React.useLayoutEffect(() => {
    bridgeRef.current = {
      add: addSubscribedColleague,
      remove: removeSubscribedColleague,
      isSubscribed: (id: string) => idsRef.current.includes(id),
    }
  }, [bridgeRef, addSubscribedColleague, removeSubscribedColleague])
  return null
}

export function UserCalendarTypesBridgeSync({
  bridgeRef,
}: {
  bridgeRef: React.MutableRefObject<{
    appendCalendar: (entry: VvUserCalendarType) => void
    updateCalendar: (
      id: string,
      patch: Partial<Pick<VvUserCalendarType, "name" | "color" | "description" | "visibility">>
    ) => void
  } | null>
}) {
  const { setCalendarTypes } = useUserCalendars()
  React.useLayoutEffect(() => {
    bridgeRef.current = {
      appendCalendar: (entry) => {
        setCalendarTypes((prev) => {
          if (prev.some((c) => c.id === entry.id)) return prev
          return [...prev, entry]
        })
      },
      updateCalendar: (id, patch) => {
        setCalendarTypes((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))
      },
    }
  }, [bridgeRef, setCalendarTypes])
  return null
}

/** 日程等弹窗 Portal 挂载点：仅覆盖本列对话滚动区，底部输入保持可点 */
export function VvChatInsetDialogPortalHost({ children }: { children: React.ReactNode }) {
  const [host, setHost] = React.useState<HTMLElement | null>(null)
  return (
    <VvChatInsetDialogPortalContext.Provider value={host}>
      <div ref={setHost} className="relative z-10 flex min-h-0 flex-1 flex-col">
        {children}
      </div>
    </VvChatInsetDialogPortalContext.Provider>
  )
}

/** 侧栏全高 Portal：相对主列（顶栏 + 滚动区 + 底栏）定位 */
export function VvChatFullInsetPortalHost({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const [host, setHost] = React.useState<HTMLElement | null>(null)
  return (
    <VvChatFullInsetPortalContext.Provider value={host}>
      <div
        ref={setHost}
        className={cn(
          "relative flex min-h-0 h-full w-full flex-1 shrink-0 flex-col bg-cui-bg min-w-0",
          className
        )}
      >
        {children}
      </div>
    </VvChatFullInsetPortalContext.Provider>
  )
}
