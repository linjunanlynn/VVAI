import { CURRENT_USER } from "./seeds"
import type { VvApprovalStartFormDraft, VvTodoItem } from "./types"

export function defaultApprovalStartDraft(): VvApprovalStartFormDraft {
  return {
    organization: "陈廷凯测试公司",
    title: "",
    processType: "",
    template: "",
    content: "",
    link: "",
    process: "默认审批流（直属经理 → 部门负责人）",
    approvers: "直属经理、部门负责人",
    cc: "",
    amount: "",
    detail: "",
  }
}

export function buildTodoFromApprovalDraft(draft: VvApprovalStartFormDraft): VvTodoItem {
  const approvers = draft.approvers
    .split(/[、,，]/)
    .map((s) => s.trim())
    .filter(Boolean)
  const body = (draft.content ?? draft.detail ?? "").trim() || "（无说明）"
  const tpl = (draft.processType ?? draft.template ?? "通用审批").trim() || "通用审批"
  const amt = (draft.amount ?? "").trim()
  return {
    id: `td${Date.now()}`,
    title: `审批：${draft.title || "未命名申请"}`,
    summary: `${tpl} · 已提交，等待 ${approvers.length ? approvers.join("、") : "审批人"} 处理。`,
    detail: body,
    type: "approval",
    status: "pending",
    sender: CURRENT_USER,
    owner: "我发起的",
    approvers: approvers.length ? approvers : ["直属经理"],
    time: "刚刚",
    amount: amt || null,
    tags: ["审批", "我发起的"],
    metaVerb: "推送",
    sourceLabel: draft.organization ?? "微微集团",
    sourceScope: "company",
    listTone: "rose",
    fullHubSourceCategory: "流程",
  }
}
