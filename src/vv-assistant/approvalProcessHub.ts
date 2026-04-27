import type { VvApprovalProcessHubSection, VvApprovalProcessHubTile } from "./types"

const t = (
  id: string,
  label: string,
  tone: VvApprovalProcessHubTile["tone"]
): VvApprovalProcessHubTile => ({ id, label, tone })

/** 「全部流程」演示：与设计稿分类一致 */
export const APPROVAL_PROCESS_HUB_SECTIONS: VvApprovalProcessHubSection[] = [
  {
    id: "attendance",
    title: "考勤流程",
    items: [
      t("p-clock", "补卡申请", "orange"),
      t("p-leave", "请假申请", "blue"),
      t("p-leave-cancel", "销假申请", "navy"),
      t("p-ot", "加班申请", "emerald"),
      t("p-trip-cancel", "销出差申请", "blue"),
      t("p-out", "外出申请", "red"),
      t("p-out-cancel", "销外出申请", "violet"),
      t("p-trip", "出差申请", "red"),
    ],
  },
  {
    id: "hr",
    title: "人事流程",
    items: [
      t("p-probation", "转正申请", "emerald"),
      t("p-transfer", "调岗申请", "orange"),
      t("p-resign", "离职申请", "blue"),
    ],
  },
  {
    id: "pay",
    title: "薪酬流程",
    items: [t("p-salary", "调薪申请", "red")],
  },
  {
    id: "material",
    title: "物资流程",
    items: [t("p-mat-out", "物资领用", "rose"), t("p-mat-in", "物资归还", "emerald")],
  },
  {
    id: "other",
    title: "其他",
    items: [t("p-generic", "发起审批", "orange")],
  },
]
