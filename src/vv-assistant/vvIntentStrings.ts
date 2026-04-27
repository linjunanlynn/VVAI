import type { VvApprovalStartFormDraft, VvMailComposeFormDraft, VvMeetingStartFormDraft } from "./types"

/** 与 cliHints 中 inferUserCommand 的正则一致，使用弯引号 「」式 */
function Q(s: string) {
  return `\u201c${s}\u201d`
}

export function intentLineMeetingInstant(draft: VvMeetingStartFormDraft): string {
  return `请现在发起一场会议：标题${Q(draft.title)}，参会人${Q(draft.participants)}，会议方式${Q(draft.room)}。`
}

export function intentLineMeetingBook(draft: VvMeetingStartFormDraft, timeLabel: string): string {
  return `请预约一场会议：标题${Q(draft.title)}，时间${Q(timeLabel)}，参会人${Q(draft.participants)}，会议方式${Q(draft.room)}。`
}

export function intentLineApprovalCreate(draft: VvApprovalStartFormDraft): string {
  const org = (draft.organization ?? "").trim()
  const title = (draft.title ?? "").trim() || "（无标题）"
  const template = (draft.processType ?? draft.template ?? "").trim() || "通用审批"
  const approvers = (draft.approvers ?? "").trim() || "（未指定）"
  const cc = (draft.cc ?? "").trim()
  const amount = (draft.amount ?? "").trim()
  const detail = (draft.content ?? draft.detail ?? "").trim() || "（无说明）"
  const link = (draft.link ?? "").trim()
  const proc = (draft.process ?? "").trim()
  const orgPart = org ? `组织${Q(org)}，` : ""
  const ccPart = cc ? `抄送${Q(cc)}，` : ""
  const amtPart = amount ? `金额${Q(amount)}，` : ""
  const linkPart = link ? `链接${Q(link)}，` : ""
  const procPart = proc ? `流程${Q(proc)}，` : ""
  return `请发起一条审批：${orgPart}标题${Q(title)}，类型${Q(template)}，审批人${Q(approvers)}，${ccPart}${amtPart}${linkPart}${procPart}说明${Q(detail)}。`
}

/** 与 cliHints inferUserCommand 中 createMail 正则一致（弯引号 “ ”） */
export function intentLineMailCreate(draft: VvMailComposeFormDraft): string {
  return `请新建一封邮件：收件人${Q(draft.to)}，抄送${Q(draft.cc)}，主题${Q(draft.subject)}，内容${Q(draft.body)}。`
}
