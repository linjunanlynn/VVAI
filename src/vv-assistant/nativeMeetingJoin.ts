/**
 * 演示：宿主在壳层监听 `window.addEventListener("vv:native-meeting-join", …)`，
 * 在回调里唤起真实会议组件（传入 detail.meetingCode 等）。
 */
export const NATIVE_MEETING_JOIN_EVENT = "vv:native-meeting-join" as const

export type NativeMeetingJoinDetail = {
  meetingCode: string
  displayName: string
  micOn: boolean
  camOn: boolean
}

export function dispatchNativeMeetingJoin(detail: NativeMeetingJoinDetail): void {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(NATIVE_MEETING_JOIN_EVENT, { detail }))
}
