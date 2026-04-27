/**
 * 应用内自然语言 → 跨应用 dock handoff（演示规则，接入 NLU 后替换）
 */

/** 在「课程管理」会话中，与作业/教学强相关、宜由「教学管理」承接的表述 */
const COURSE_TO_TEACHING_HOMEWORK_KEYWORDS = [
  "布置作业",
  "发作业",
  "布置课后",
  "课后作业",
  "批改作业",
  "收作业",
  "作业提交",
  "我要布置作业",
  "需要布置作业",
  "发布作业",
  "学生作业",
  "作业通知",
] as const

export function matchCourseToTeachingHomeworkIntent(userText: string): boolean {
  const t = userText.trim()
  if (!t) return false
  return COURSE_TO_TEACHING_HOMEWORK_KEYWORDS.some((k) => t.includes(k))
}

export const COURSE_TO_TEACHING_HANDOFF = {
  targetAppId: "teaching",
  targetAppName: "教学管理",
  fromAppName: "课程管理",
  intentLabel: "作业与教学",
} as const

export function isCourseDockConversation(conversation: { id: string; dockAppId?: string }): boolean {
  if (conversation.dockAppId === "course") return true
  const m = conversation.id.match(/^dock:[^:]+:(.+)$/)
  return m?.[1] === "course"
}
