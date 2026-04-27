/**
 * 应用 dock 在会话列表、顶栏等处展示的短名称（不含行政主体；与底部应用条 / getDockAppMeta 文案一致）
 */
const EDU_APP_SHORT: Record<string, string> = {
  goods: "商品管理",
  members: "成员管理",
  finance: "财务管理",
  teacher_mgmt: "老师管理",
  student_mgmt: "学员管理",
  patient_mgmt: "患者管理",
  staff_schedule: "排班管理",
  medical_supplies: "医疗耗材管理",
  bed_mgmt: "床位管理",
}

const EXTRA_SHORT: Record<string, string> = {
  education: "教育",
  /** 与底部条、门户顶栏「教育」入口一致；会话历史等列表同显「教育」 */
  personal_edu_space: "教育",
  hospital: "医院",
  calendar: "日历",
  meeting: "会议",
  todo: "待办",
  document: "文档",
  disk: "微盘",
  mail: "邮箱",
  profile: "我的",
  company: "公司",
  organization: "组织",
  employee: "员工",
  salary: "薪酬",
  performance: "绩效",
  recruitment: "招聘",
  teaching: "教学管理",
  logistics: "后勤管理",
  assets: "资产管理",
  attendance: "考勤",
  policy: "制度",
  supplies: "物资",
  onboarding: "入职",
  regularization: "转正",
  transfer: "调岗",
  offboarding: "离职",
  contract: "合同",
  objectives: "目标",
  project: "项目",
  work_task: "任务",
  feedback: "反馈",
  meeting_room: "会议室",
  workflow: "流程",
  permission: "权限",
  customer: "客户",
  surgery: "手术",
  pharma_procurement: "药品采购",
}

export function getDockAppShortName(appId: string): string {
  return EDU_APP_SHORT[appId] ?? EXTRA_SHORT[appId] ?? appId
}

/** 去掉「组织名 ·」前缀与「· 组织名」后缀（历史 sessionLabel 可能带行政主体） */
export function stripOrgDecoratorsFromLabel(label: string, orgNames: readonly string[] | undefined): string {
  let t = label.trim()
  if (!orgNames?.length) return t
  for (const org of orgNames) {
    const n = org.trim()
    if (!n) continue
    const prefix = `${n} · `
    const suffix = ` · ${n}`
    if (t.startsWith(prefix)) t = t.slice(prefix.length).trim()
    if (t.endsWith(suffix)) t = t.slice(0, -suffix.length).trim()
  }
  return t
}
