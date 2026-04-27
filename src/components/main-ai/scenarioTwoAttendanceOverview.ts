export const SCENARIO_TWO_ATTENDANCE_OVERVIEW_MARKER = "<<<SCENARIO_TWO_ATTENDANCE_OVERVIEW>>>"

export type ScenarioTwoAttendanceOverviewPayload = {
  v: 1
  monthId: string
  exceptionsOnly: boolean
  archived: boolean
}

export function defaultScenarioTwoAttendanceOverviewPayload(): ScenarioTwoAttendanceOverviewPayload {
  return {
    v: 1,
    monthId: "2026-04",
    exceptionsOnly: false,
    archived: false,
  }
}

export function parseScenarioTwoAttendanceOverviewPayload(
  raw: string
): ScenarioTwoAttendanceOverviewPayload | null {
  try {
    const p = JSON.parse(raw) as ScenarioTwoAttendanceOverviewPayload
    if (p?.v !== 1) return null
    return {
      v: 1,
      monthId: typeof p.monthId === "string" ? p.monthId : "2026-04",
      exceptionsOnly: Boolean(p.exceptionsOnly),
      archived: Boolean(p.archived),
    }
  } catch {
    return null
  }
}

export const SCENARIO_TWO_ATTENDANCE_MONTH_OPTIONS = [
  { id: "2026-04", label: "2026 年 4 月" },
  { id: "2026-03", label: "2026 年 3 月" },
  { id: "2026-02", label: "2026 年 2 月" },
] as const
