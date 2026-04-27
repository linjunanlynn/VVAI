import * as React from "react"
import { Building2, Home } from "lucide-react"
import { GenericCard } from "../components/main-ai/GenericCard"
import { ChatPromptButton } from "../components/chat/ChatPromptButton"
import { cn } from "../components/ui/utils"
import type { EducationSpaceKind } from "./educationSpaceTypes"

export interface EducationWithSpaceWelcomeCardProps {
  kind: EducationSpaceKind
  spaceName: string
  /** 填入输入框并发送，用于快捷行动建议 */
  onQuickPrompt: (text: string) => void
  onWatchVideo: () => void
  className?: string
}

/**
 * 全新用户已拥有教育空间：按家庭 / 机构展示差异化欢迎语与行动建议。
 */
export function EducationWithSpaceWelcomeCard({
  kind,
  spaceName,
  onQuickPrompt,
  onWatchVideo,
  className,
}: EducationWithSpaceWelcomeCardProps) {
  const displayName = spaceName.trim() || "当前空间"

  const familyCopy = {
    titleIcon: (
      <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-border bg-bg-secondary">
        <Home className="h-[22px] w-[22px] text-primary" aria-hidden />
      </div>
    ),
    title: "家庭教育空间已就绪",
    lead: (
      <>
        你已在使用「<span className="font-[var(--font-weight-medium)] text-text">{displayName}</span>
        」。这里侧重成员陪伴、课程与奖励等轻量协作，适合与家人一起完成学习计划。
      </>
    ),
    hint: "可从下方任选一项开始；需要整体了解时也可先看介绍视频。",
    prompts: ["今日课程", "查看奖励", "邀请家庭成员", "查看教育视频介绍"] as const,
  }

  const institutionalCopy = {
    titleIcon: (
      <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-border bg-bg-secondary">
        <Building2 className="h-[22px] w-[22px] text-primary" aria-hidden />
      </div>
    ),
    title: "机构教育空间已就绪",
    lead: (
      <>
        你已在使用「<span className="font-[var(--font-weight-medium)] text-text">{displayName}</span>
        」。这里提供课程履约、学员/师资与财务等完整经营能力，可按角色分工使用。
      </>
    ),
    hint: "建议从课程与学生侧开始核对日常运营，需要全貌时也可观看介绍视频。",
    prompts: ["今日课程", "学生管理", "财务报表", "查看教育视频介绍"] as const,
  }

  const copy = kind === "family" ? familyCopy : institutionalCopy

  return (
    <div className={cn("flex w-full max-w-[min(100%,720px)] flex-col", className)}>
      <GenericCard title={copy.title}>
        <div className="flex w-full flex-col gap-[var(--space-400)] sm:flex-row sm:items-start">
          {copy.titleIcon}
          <div className="min-w-0 flex-1">
            <p className="m-0 text-[length:var(--font-size-base)] leading-relaxed text-text-secondary">
              {copy.lead}
            </p>
            <p className="mt-[var(--space-200)] m-0 text-[length:var(--font-size-sm)] leading-relaxed text-text-tertiary">
              {copy.hint}
            </p>
          </div>
        </div>
      </GenericCard>
      <div className="mt-[6px] flex w-full flex-wrap justify-start gap-[var(--space-200)]">
        {copy.prompts.map((label) =>
          label === "查看教育视频介绍" ? (
            <ChatPromptButton key={label} type="button" onClick={onWatchVideo}>
              {label}
            </ChatPromptButton>
          ) : (
            <ChatPromptButton key={label} type="button" onClick={() => onQuickPrompt(label)}>
              {label}
            </ChatPromptButton>
          ),
        )}
      </div>
    </div>
  )
}
