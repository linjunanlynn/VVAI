import { getDockAppMeta } from "./organizationDockConfig"

/** 场景二（`edu-one` / `scenario-two-multi`）主 VVAI 追问命中后的引导卡片载荷 */
export type SchoolSceneAppGuidancePayload = {
  /** 展示在卡片中的说明（含「对应应用」变量已代入） */
  guidanceBody: string
  targetAppId: string
  targetAppName: string
  instruction: string
  /** 跳转应用会话后，演示用 AI 回复全文 */
  assistantReply: string
}

function attendanceAppMeta() {
  return getDockAppMeta("attendance")
}

function employeeAppMeta() {
  return getDockAppMeta("employee")
}

/**
 * 主会话中与欢迎追问一致的指令（演示用精确匹配，避免与通用主会话意图「老师」等交叉命中）。
 * 「查看考勤」落在考勤应用（仍兼容用户输入「查看A老师的考勤」）。
 */
export function matchSchoolScenarioMainCuiGuidance(userText: string): SchoolSceneAppGuidancePayload | null {
  const t = userText.trim()
  if (t === "查看考勤" || t === "查看A老师的考勤") {
    return buildSchoolSceneAttendanceGuidancePayload(t)
  }
  if (t === "查看员工" || t === "打开员工列表") {
    return buildSchoolSceneEmployeeGuidancePayload(t)
  }
  return null
}

function buildSchoolSceneAttendanceGuidancePayload(instruction: string): SchoolSceneAppGuidancePayload {
  const att = attendanceAppMeta()
  return {
    targetAppId: "attendance",
    targetAppName: att.name,
    instruction,
    guidanceBody: `根据你的描述，**教师考勤记录、异常与统计**这类业务更适合在「${att.name}」应用中完成；主 VVAI 侧重通用协作与入口，具体打卡数据、异常与统计请在「${att.name}」对话中处理。

请点击下方按钮，将切换到「${att.name}」的会话，并在其中继续完成你交代的指令。`,
    assistantReply: `已收到指令「${instruction}」。（演示）

当前在「${att.name}」助手内，可查到的摘要如下：
• **本月出勤**：正常 18 天，迟到 1 天（4 月 12 日 08:06 打卡），请假 0 天；
• **异常说明**：迟到已关联「第一节有课」日程，可按制度发起补卡/说明（如需我可生成说明草稿）；
• **下一步**：可指定月份或切换「只看异常」筛选，也可导出为表格。

以上数据为演示占位，接入真实系统后将来自考勤数据源。`,
  }
}

function buildSchoolSceneEmployeeGuidancePayload(instruction: string): SchoolSceneAppGuidancePayload {
  const emp = employeeAppMeta()
  return {
    targetAppId: "employee",
    targetAppName: emp.name,
    instruction,
    guidanceBody: `根据你的描述，**员工档案、花名册与入转调离**这类业务更适合在「${emp.name}」应用中完成；主 VVAI 侧重通用协作与入口，具体名单、角色与邀请状态请在「${emp.name}」对话中处理。

请点击下方按钮，将切换到「${emp.name}」的会话，并在其中继续完成你交代的指令。`,
    assistantReply: `已收到指令「${instruction}」。（演示）

当前在「${emp.name}」助手内，可查到的摘要如下：
• **在职成员**：演示 12 人，含教师 9 人、行政 3 人；
• **待处理**：演示 2 条邀请待确认、1 条信息待完善；
• **下一步**：可按部门筛选、导出花名册，或发起邀请/调整角色。

以上数据为演示占位，接入真实系统后将来自人事数据源。`,
  }
}

/**
 * 场景二：在「教育」应用会话中输入「查看考勤」时，与主 VVAI 同构的《应用承接引导》（用户原文带入考勤会话）。
 */
export function matchSchoolScenarioEducationDockAttendanceGuidance(userText: string): SchoolSceneAppGuidancePayload | null {
  if (userText.trim() !== "查看考勤") return null
  return buildSchoolSceneAttendanceGuidancePayload("查看考勤")
}

/**
 * 场景二：在「教育」应用会话中输入「查看员工 / 打开员工列表」时，与「查看考勤」同构的《应用承接引导》。
 */
export function matchSchoolScenarioEducationDockEmployeeGuidance(userText: string): SchoolSceneAppGuidancePayload | null {
  const t = userText.trim()
  if (t === "查看员工" || t === "打开员工列表") {
    return buildSchoolSceneEmployeeGuidancePayload(t)
  }
  return null
}

