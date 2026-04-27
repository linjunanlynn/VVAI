/**
 * 场景二（多组织）考勤工作台 GUI 卡片下方：左侧两条推荐指令（点击即发送）。
 * 须避免命中 `matchesScenarioTwoViewAttendanceIntent`（勿含「考勤」等触发词）。
 */
export const SCENARIO_TWO_MULTI_ATTENDANCE_STRIP_CHIPS = ["补卡申请", "请假申请"] as const

export function getScenarioTwoMultiAttendanceStripChipTexts(): string[] {
  return [...SCENARIO_TWO_MULTI_ATTENDANCE_STRIP_CHIPS]
}
