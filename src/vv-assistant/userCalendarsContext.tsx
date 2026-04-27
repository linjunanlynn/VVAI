import * as React from "react"
import type { VvScheduleCalendarPrefs, VvSubscribedCalendar, VvUserCalendarType } from "./types"
import { DEFAULT_USER_CALENDAR_TYPES, mergeSubscribedCalendarsForUser } from "./seeds"
import { defaultScheduleCalendarPrefs } from "./scheduleCalendarPrefs"

type Ctx = {
  calendarTypes: VvUserCalendarType[]
  setCalendarTypes: React.Dispatch<React.SetStateAction<VvUserCalendarType[]>>
  scheduleCalendarPrefs: VvScheduleCalendarPrefs
  setScheduleCalendarPrefs: React.Dispatch<React.SetStateAction<VvScheduleCalendarPrefs>>
  /** 已通过「订阅同事日历」流程订阅的通讯录 id（演示） */
  subscribedColleagueIds: string[]
  addSubscribedColleague: (id: string) => void
  removeSubscribedColleague: (id: string) => void
  /** 合并后的「我订阅的」日历行（种子 + 流程订阅）；「全部日程」卡片内订阅勾选为各卡片本地状态 */
  subscribedCalendars: VvSubscribedCalendar[]
  /**
   * 「今日日程」等共用：我管理的日历是否在时间轴上显示（false = 隐藏该类型下的日程）
   */
  ownCalendarsVisible: Record<string, boolean>
  setOwnCalendarsVisible: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
}

const UserCalendarsContext = React.createContext<Ctx | null>(null)

export function UserCalendarsProvider({ children }: { children: React.ReactNode }) {
  const [calendarTypes, setCalendarTypes] = React.useState<VvUserCalendarType[]>(() => [...DEFAULT_USER_CALENDAR_TYPES])
  const [scheduleCalendarPrefs, setScheduleCalendarPrefs] = React.useState<VvScheduleCalendarPrefs>(defaultScheduleCalendarPrefs)
  const [subscribedColleagueIds, setSubscribedColleagueIds] = React.useState<string[]>([])
  const [ownCalendarsVisible, setOwnCalendarsVisible] = React.useState<Record<string, boolean>>(() => {
    const o: Record<string, boolean> = {}
    for (const c of DEFAULT_USER_CALENDAR_TYPES) o[c.id] = true
    return o
  })

  React.useEffect(() => {
    setOwnCalendarsVisible((prev) => {
      const next = { ...prev }
      for (const c of calendarTypes) {
        if (next[c.id] === undefined) next[c.id] = true
      }
      return next
    })
  }, [calendarTypes])

  const addSubscribedColleague = React.useCallback((id: string) => {
    if (!id) return
    setSubscribedColleagueIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }, [])

  const removeSubscribedColleague = React.useCallback((id: string) => {
    if (!id) return
    setSubscribedColleagueIds((prev) => prev.filter((x) => x !== id))
  }, [])

  const subscribedCalendars = React.useMemo(
    () => mergeSubscribedCalendarsForUser(subscribedColleagueIds),
    [subscribedColleagueIds]
  )

  const value = React.useMemo(
    () => ({
      calendarTypes,
      setCalendarTypes,
      scheduleCalendarPrefs,
      setScheduleCalendarPrefs,
      subscribedColleagueIds,
      addSubscribedColleague,
      removeSubscribedColleague,
      subscribedCalendars,
      ownCalendarsVisible,
      setOwnCalendarsVisible,
    }),
    [
      calendarTypes,
      scheduleCalendarPrefs,
      subscribedColleagueIds,
      addSubscribedColleague,
      removeSubscribedColleague,
      subscribedCalendars,
      ownCalendarsVisible,
    ]
  )
  return <UserCalendarsContext.Provider value={value}>{children}</UserCalendarsContext.Provider>
}

export function useUserCalendars(): Ctx {
  const v = React.useContext(UserCalendarsContext)
  if (!v) {
    throw new Error("useUserCalendars must be used within UserCalendarsProvider")
  }
  return v
}

/** 未包裹 Provider 时（如单测）回退为只读默认列表 */
export function useUserCalendarsSafe(): Ctx | null {
  return React.useContext(UserCalendarsContext)
}
