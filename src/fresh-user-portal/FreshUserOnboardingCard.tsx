import * as React from "react"
import { GenericCard } from "../components/main-ai/GenericCard"
import { ChatPromptButton } from "../components/chat/ChatPromptButton"

export interface FreshUserOnboardingCardProps {
  onCreateOrg: () => void
  onJoinOrg: () => void
  onCreateEducationSpace: () => void
  onJoinEducationSpace: () => void
}

/**
 * 全新用户：说明产品价值 + 四个入口（CUI：卡片正文 + 卡片外行动建议，见 docs/cui-action-suggestions.md）
 */
export function FreshUserOnboardingCard({
  onCreateOrg,
  onJoinOrg,
  onCreateEducationSpace,
  onJoinEducationSpace,
}: FreshUserOnboardingCardProps) {
  return (
    <div className="flex flex-col w-full max-w-[min(100%,720px)]">
      <GenericCard title="欢迎使用V V AI">
        <p className="text-[length:var(--font-size-base)] text-text-secondary leading-relaxed m-0 mb-[var(--space-200)]">
          V V AI 是面向<strong className="text-text font-[var(--font-weight-medium)]"> 企业、家庭与教育机构 </strong>
          的一体化智能平台。
        </p>
        <p className="text-[length:var(--font-size-base)] text-text-secondary leading-relaxed m-0 mb-[var(--space-200)]">
          覆盖企业协同办公与人财物管理，支持家庭教育、成长陪伴与家校协同，并为教育机构提供招生、教务、教学、财务等全场景解决方案。
        </p>
        <p className="text-[length:var(--font-size-base)] text-text-secondary leading-relaxed m-0 mb-[var(--space-200)]">
          您可以创建或加入<strong className="text-text font-[var(--font-weight-medium)]"> 企业/组织 </strong>
          ，也可以开启<strong className="text-text font-[var(--font-weight-medium)]"> 家庭或机构教育空间 </strong>
          ，体验AI时代的智能化协同管理。
        </p>
        <p className="text-[length:var(--font-size-sm)] text-text-tertiary leading-relaxed m-0">
          选择你的入口，我将一步步带你开始使用。
        </p>
      </GenericCard>
      {/* 行动建议在卡片外，与卡片左缘对齐，距卡片底 6px */}
      <div className="mt-[6px] flex flex-wrap justify-start gap-[var(--space-200)] w-full">
        <ChatPromptButton type="button" onClick={onCreateOrg}>
          创建组织
        </ChatPromptButton>
        <ChatPromptButton type="button" onClick={onJoinOrg}>
          加入组织
        </ChatPromptButton>
        <ChatPromptButton type="button" onClick={onCreateEducationSpace}>
          创建教育空间
        </ChatPromptButton>
        <ChatPromptButton type="button" onClick={onJoinEducationSpace}>
          加入教育空间
        </ChatPromptButton>
      </div>
    </div>
  )
}
