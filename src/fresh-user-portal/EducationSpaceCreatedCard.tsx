import * as React from "react"
import { GenericCard } from "../components/main-ai/GenericCard"
import { ChatPromptButton } from "../components/chat/ChatPromptButton"
import educationIcon from "figma:asset/8449365f45bb140bf269f6769f74387249864ed8.png"
import companyIcon from "figma:asset/bc4adf9e89b5ade28461d7ae6da09053ea8bf0e1.png"

const familyEducationIcon = educationIcon

export interface EducationSpaceCreatedCardProps {
  spaceName: string
  kind: "family" | "institutional"
  onInviteMembers: () => void
  onCreatePlan: () => void
  /** 全新用户仅在主对话创建时传入：进入教育应用并定位该空间；已在教育应用内则不展示对应按钮 */
  onGoToEducationSpace?: () => void
}

/**
 * 教育空间创建成功后的空间卡片 + 行动建议（邀请成员、创建计划）
 */
export function EducationSpaceCreatedCard({
  spaceName,
  kind,
  onInviteMembers,
  onCreatePlan,
  onGoToEducationSpace,
}: EducationSpaceCreatedCardProps) {
  const icon = kind === "family" ? familyEducationIcon : companyIcon
  const kindLabel = kind === "family" ? "家庭教育空间" : "机构教育空间"

  return (
    <div className="flex flex-col gap-[var(--space-300)] w-full max-w-[min(100%,720px)]">
      <div className="rounded-[var(--radius-md)] border border-border bg-bg-secondary px-[var(--space-350)] py-[var(--space-250)]">
        <p className="text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text m-0">
          创建成功，已为你开通教育空间
        </p>
      </div>

      <div className="w-full flex flex-col items-stretch">
        <GenericCard title="我的教育空间">
          <div className="flex flex-col sm:flex-row sm:items-center gap-[var(--space-300)] w-full">
            <div className="flex items-center gap-[var(--space-250)] min-w-0 flex-1">
              <div className="h-[48px] w-[48px] shrink-0 rounded-[var(--radius-md)] overflow-hidden border border-border bg-bg-secondary flex items-center justify-center">
                <img src={icon} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex flex-col gap-[var(--space-100)]">
                <p className="text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] text-text truncate m-0">
                  {spaceName}
                </p>
                <p className="text-[length:var(--font-size-xs)] text-text-tertiary m-0">{kindLabel}</p>
              </div>
            </div>
          </div>
        </GenericCard>

        {/* 行动建议在卡片外，距卡片底 10px，与卡片左缘对齐 */}
        <div className="mt-[10px] flex flex-wrap justify-start gap-[var(--space-200)] w-full">
          <ChatPromptButton type="button" onClick={onInviteMembers}>
            邀请成员
          </ChatPromptButton>
          <ChatPromptButton type="button" onClick={onCreatePlan}>
            创建计划
          </ChatPromptButton>
          {onGoToEducationSpace ? (
            <ChatPromptButton type="button" onClick={onGoToEducationSpace}>
              查看教育空间
            </ChatPromptButton>
          ) : null}
        </div>
      </div>
    </div>
  )
}
