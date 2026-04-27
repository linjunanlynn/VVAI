/** 与 MainAIChatWindow 中助手气泡标记一致 */
export const EMPLOYEE_MGMT_MARKER = "<<<RENDER_EMPLOYEE_MGMT>>>"

/** 场景二多组织：承接卡片下追问，勿与「查看员工」指令子串命中混淆 */
const EMPLOYEE_OTHER_ORG_FOLLOW_UP = /^还可以针对「([^」]+)」查看员工$/

export const EMPLOYEE_MGMT_COMMANDS = [
  "员工管理",
  "打开员工管理",
  "查看员工",
  "打开员工列表",
  "员工列表",
  "管理人员",
  "管理员工",
  "人事列表",
  "employee management",
  "staff management",
]

export function matchesEmployeeMgmtIntent(text: string): boolean {
  if (EMPLOYEE_OTHER_ORG_FOLLOW_UP.test(text.trim())) return false
  const t = text.toLowerCase()
  return EMPLOYEE_MGMT_COMMANDS.some((cmd) => t.includes(cmd.toLowerCase()))
}

/** 日程子对话内：与底栏「我的日程 / 今日日程 / 新建日程」等价的自然说法 */
/** 可内嵌展示员工管理卡片的应用 id（主 AI 为 null） */
export const EMPLOYEE_MGMT_CARD_APP_IDS = new Set<string>([
  "employee",
  "schedule",
  "meeting",
  "education",
  /** 本工程 dock 应用 id 为「日历」 */
  "calendar",
])

export function matchesSideScheduleIntent(text: string): boolean {
  const t = text.trim()
  if (matchesEmployeeMgmtIntent(t)) return false
  return (
    t.includes("新建日程") ||
    t.includes("创建日程") ||
    t.includes("今日日程") ||
    t.includes("查询今日日程") ||
    t.includes("全部日程") ||
    t.includes("我的日程")
  )
}
