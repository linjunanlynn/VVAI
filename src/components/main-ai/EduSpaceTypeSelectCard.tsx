import * as React from "react"
import { Building2, Home } from "lucide-react"
import { cn } from "../ui/utils"

export interface EduSpaceTypeSelectCardProps {
  onSelectFamily: () => void
  onSelectInstitution: () => void
}

/**
 * 创建教育组织成功后，选择「家庭教育空间」或「机构教育空间」的表卡。
 * 对齐产品稿：标题条、说明文案、两条可点击大卡片（图标 + 主副标题 + 描述）。
 */
export function EduSpaceTypeSelectCard({
  onSelectFamily,
  onSelectInstitution,
}: EduSpaceTypeSelectCardProps) {
  return (
    <div className="w-full max-w-[min(560px,100%)]">
      <div className="mb-[var(--space-300)] flex flex-col gap-[var(--space-150)]">
        <div className="flex items-center gap-[var(--space-200)]">
          <span className="h-4 w-[3px] shrink-0 rounded-full bg-primary" aria-hidden />
          <h3 className="text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] text-text">
            选择教育空间类型
          </h3>
        </div>
        <p className="pl-[calc(var(--space-200)+3px+var(--space-200))] text-[length:var(--font-size-sm)] font-[var(--font-weight-regular)] leading-relaxed text-text-secondary">
          请先选择一种空间类型，我们将进入对应的创建步骤。
        </p>
      </div>

      <div className="flex flex-col gap-[var(--space-300)]">
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
              侧重成员陪伴、课程与奖励等日常协作，适合家庭自建学习空间。
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
              提供课程履约、商品与财务等管理能力，适合学校与培训机构。
            </p>
          </div>
        </button>
      </div>
    </div>
  )
}
