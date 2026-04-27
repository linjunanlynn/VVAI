export const SCENARIO_TWO_ATTENDANCE_SUPPLEMENT_MARKER = "<<<SCENARIO_TWO_ATTENDANCE_SUPPLEMENT>>>"

export type ScenarioTwoAttendanceSupplementKind = "makeup" | "leave"

export type ScenarioTwoAttendanceSupplementPayload = {
  kind: ScenarioTwoAttendanceSupplementKind
  /** 演示：日期占位 */
  date: string
  /** 演示：事由说明 */
  reasonDraft: string
  /** 演示：提交后锁定表单 */
  submitted?: boolean
}

export function defaultScenarioTwoAttendanceSupplementPayload(
  kind: ScenarioTwoAttendanceSupplementKind
): ScenarioTwoAttendanceSupplementPayload {
  return {
    kind,
    date: "",
    reasonDraft: "",
    submitted: false,
  }
}

export function parseScenarioTwoAttendanceSupplementPayload(
  raw: string
): ScenarioTwoAttendanceSupplementPayload | null {
  try {
    const p = JSON.parse(raw) as ScenarioTwoAttendanceSupplementPayload
    if (p.kind !== "makeup" && p.kind !== "leave") return null
    if (typeof p.date !== "string") return null
    if (typeof p.reasonDraft !== "string") return null
    return {
      kind: p.kind,
      date: p.date,
      reasonDraft: p.reasonDraft,
      submitted: Boolean(p.submitted),
    }
  } catch {
    return null
  }
}
