import * as React from "react"
import { Building2, Home } from "lucide-react"
import { cn } from "../ui/utils"
import { GenericCard } from "./GenericCard"

export interface EduWelcomeWeiweiCardProps {
  onSelectFamily: () => void
  onSelectInstitution: () => void
}

/**
 * 教育应用默认首条：欢迎使用微微教育 + 家庭 / 机构空间类型选择（与产品稿对齐）
 */
export function EduWelcomeWeiweiCard({
  onSelectFamily,
  onSelectInstitution,
}: EduWelcomeWeiweiCardProps) {
  return (
    <div className="w-full max-w-[min(560px,100%)]">
      <GenericCard title="欢迎使用微微教育">
        <p className="m-0 text-[length:var(--font-size-sm)] font-[var(--font-weight-regular)] leading-relaxed text-text-secondary">
          AI 帮助家庭与教育机构更高效地管理学习、课程与成长。请先选择您需要创建的空间类型：
        </p>
        <div className="mt-[var(--space-400)] flex flex-col gap-[var(--space-300)]">
          <button
            type="button"
            onClick={onSelectFamily}
            className={cn(
              "flex w-full cursor-pointer items-stretch gap-[var(--space-300)] rounded-[var(--radius-200)] border border-border bg-bg p-[var(--space-400)] text-left shadow-xs",
              "transition-colors hover:border-primary/35 hover:bg-bg-secondary/60",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
            )}
          >
            <div
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-[var(--radius-md)]",
                "border border-border bg-bg-secondary",
              )}
            >
              <Home className="size-6 text-primary" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] text-text">
                家庭教育空间
              </p>
              <p className="mt-[var(--space-100)] text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-primary">
                家庭场景与轻量协作
              </p>
              <p className="mt-[var(--space-150)] text-[length:var(--font-size-sm)] font-[var(--font-weight-regular)] leading-relaxed text-text-secondary">
                侧重成员陪伴、课程与奖励等日常协作。
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={onSelectInstitution}
            className={cn(
              "flex w-full cursor-pointer items-stretch gap-[var(--space-300)] rounded-[var(--radius-200)] border border-border bg-bg p-[var(--space-400)] text-left shadow-xs",
              "transition-colors hover:border-primary/35 hover:bg-bg-secondary/60",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
            )}
          >
            <div
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-[var(--radius-md)]",
                "border border-border bg-bg-secondary",
              )}
            >
              <Building2 className="size-6 text-primary" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] text-text">
                机构教育空间
              </p>
              <p className="mt-[var(--space-100)] text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-primary">
                完整教务与经营能力
              </p>
              <p className="mt-[var(--space-150)] text-[length:var(--font-size-sm)] font-[var(--font-weight-regular)] leading-relaxed text-text-secondary">
                提供经营、管理、教学全方面能力。
              </p>
            </div>
          </button>
        </div>
      </GenericCard>
    </div>
  )
}
