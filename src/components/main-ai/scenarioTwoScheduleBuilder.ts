export const SCENARIO_TWO_SCHEDULE_BUILDER_MARKER = "<<<SCENARIO_TWO_SCHEDULE_BUILDER>>>"

export type ScenarioTwoScheduleBuilderPayload = {
  v: 1
  semesterId: string
  classLabel: string
  selectedCourses: string[]
  conflictChecked: boolean
  conflictSummary: string
  published: boolean
}

export function defaultScenarioTwoScheduleBuilderPayload(): ScenarioTwoScheduleBuilderPayload {
  return {
    v: 1,
    semesterId: "2025-spring",
    classLabel: "一年级（1）班",
    selectedCourses: ["语文", "数学"],
    conflictChecked: false,
    conflictSummary: "",
    published: false,
  }
}

export function parseScenarioTwoScheduleBuilderPayload(raw: string): ScenarioTwoScheduleBuilderPayload | null {
  try {
    const p = JSON.parse(raw) as ScenarioTwoScheduleBuilderPayload
    if (p?.v !== 1) return null
    return {
      v: 1,
      semesterId: typeof p.semesterId === "string" ? p.semesterId : "",
      classLabel: typeof p.classLabel === "string" ? p.classLabel : "",
      selectedCourses: Array.isArray(p.selectedCourses)
        ? [...p.selectedCourses.filter((x): x is string => typeof x === "string")]
        : [],
      conflictChecked: Boolean(p.conflictChecked),
      conflictSummary: typeof p.conflictSummary === "string" ? p.conflictSummary : "",
      published: Boolean(p.published),
    }
  } catch {
    return null
  }
}

export const SCENARIO_TWO_SEMESTER_OPTIONS = [
  { id: "2025-spring", label: "2025 春季学期" },
  { id: "2025-fall", label: "2025 秋季学期" },
] as const

export const SCENARIO_TWO_CLASS_OPTIONS = [
  "一年级（1）班",
  "一年级（2）班",
  "二年级（1）班",
  "二年级（2）班",
] as const

export const SCENARIO_TWO_COURSE_OPTIONS = ["语文", "数学", "英语", "体育", "科学"] as const
