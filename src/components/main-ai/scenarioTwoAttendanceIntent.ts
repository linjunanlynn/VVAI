/** 场景二（多组织）卡片下「另一组织」跟进句，由 MainAIChatWindow 专用分支处理 */
const ATTENDANCE_OTHER_ORG_FOLLOW_UP = /^还可以针对「([^」]+)」查看考勤$/

/**
 * 场景二（`edu-one` / `scenario-two-multi`）主 VVAI：自然语言是否应直接出考勤工作台 GUI 卡片。
 * 与 `matchSchoolScenarioMainCuiGuidance` 的精确演示句解耦，避免与场景三/四等共享分支交叉。
 */
export function matchesScenarioTwoViewAttendanceIntent(raw: string): boolean {
  const t = raw.trim()
  if (!t) return false
  if (ATTENDANCE_OTHER_ORG_FOLLOW_UP.test(t)) return false

  if (t === "查看考勤" || t === "查看A老师的考勤") return true

  if (!/考勤/.test(t)) return false

  if (/(?:不要|不想|别(?:看|查)|无需|不用|取消).{0,10}考勤/.test(t)) return false
  if (/考勤.{0,8}(?:不要|不用|别)/.test(t)) return false

  const inquire =
    /(?:查看|看(?:一下|下)?|查(?:询|一下|下)?|瞧|浏览|打开|显示|展示|统计|汇总|导出|掌握|了解)/
  const situation = /(?:怎么样|如何|怎样|如何了|呢|吗|么样)/
  const teacherOrScope =
    /(?:老师|教师|员工|A老师|[\u4e00-\u9fa5]{1,4}老师).{0,12}考勤|考勤.{0,12}(?:老师|教师|员工|记录|数据|明细|情况|报表|表)/

  if (inquire.test(t)) return true
  if (/查.{0,4}考勤|考勤.{0,4}查/.test(t)) return true
  if (situation.test(t)) return true
  if (teacherOrScope.test(t)) return true

  if (/^(想)?看考勤$/.test(t) || t === "考勤") return true

  return false
}
