/**
 * 「教学管理」dock 内自然语言 → 业务指令 + GUI 反馈（演示规则，接入 NLU 后替换）
 */

const GRADE_TOPIC = /成绩|分数|考分|学业|考试情况|考了多少|分值/
const QUERY_ACTION = /查|看|了解|多少|情况|查询|需要|想看|要知道|查看|掌握/

export function isTeachingDockConversation(conversation: { id: string; dockAppId?: string }): boolean {
  if (conversation.dockAppId === "teaching") return true
  const m = conversation.id.match(/^dock:[^:]+:(.+)$/)
  return m?.[1] === "teaching"
}

/** 是否为「查某生成绩」类表述（须在「教学管理」会话中触发） */
export function matchTeachingStudentGradeQuery(text: string): boolean {
  const t = text.trim()
  if (!t) return false
  return GRADE_TOPIC.test(t) && QUERY_ACTION.test(t)
}

/** 从用户话术中尽量抽取学生姓名；无法识别时返回 null */
export function extractStudentNameFromGradeQuery(text: string): string | null {
  const t = text.trim()
  let m = t.match(/([\u4e00-\u9fa5]{2,8})同学/)
  if (m) return m[1]
  m = t.match(/学生[「『]([\u4e00-\u9fa5]{2,8})[」』]/)
  if (m) return m[1]
  m = t.match(/(?:查询|查看|了解|看)(?:一下)?[\u4e00-\u9fa5]{0,2}([\u4e00-\u9fa5]{2,8})(?:同学)?的?(?:成绩|分数|考分|学业)/)
  if (m) return m[1]
  m = t.match(/(?:成绩|分数|考分)(?:情况)?(?:为|是|关于)?[「『]?([\u4e00-\u9fa5]{2,8})[」』]?/)
  if (m) return m[1]
  return null
}
