import * as React from "react"
import { Building2 } from "lucide-react"
import { cn } from "../ui/utils"

export interface CreateOrgSuccessCardProps {
  /** 卡片主标题：一般为简称或全称 */
  orgName: string
  country: string
  industry: string
}

/** 创建成功后的企业/组织摘要卡（与产品稿：企业/组织 + 名称 + 地区/行业标签） */
export function CreateOrgSuccessCard({ orgName, country, industry }: CreateOrgSuccessCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-[min(520px,100%)] overflow-hidden rounded-[var(--radius-200)] border border-border bg-bg shadow-xs",
      )}
    >
      <div className="flex items-center gap-[var(--space-200)] border-b border-border-divider px-[var(--space-400)] py-[var(--space-300)]">
        <span className="h-4 w-[3px] shrink-0 rounded-full bg-primary" aria-hidden />
        <span className="text-[length:var(--font-size-sm)] text-text-secondary">企业/组织</span>
      </div>
      <div className="flex flex-col gap-[var(--space-300)] p-[var(--space-400)]">
        <div className="flex items-start gap-[var(--space-300)]">
          <div
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-[var(--radius-md)]",
              "border border-border bg-bg-secondary",
            )}
          >
            <Building2 className="size-6 text-text-tertiary" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] text-text">
              {orgName}
            </p>
            <div className="mt-[var(--space-200)] flex flex-wrap gap-[var(--space-150)]">
              <span className="rounded-full border border-border bg-bg-secondary px-[var(--space-250)] py-[var(--space-100)] text-[length:var(--font-size-xs)] text-text-secondary">
                {country}
              </span>
              <span className="rounded-full border border-border bg-bg-secondary px-[var(--space-250)] py-[var(--space-100)] text-[length:var(--font-size-xs)] text-text-secondary">
                {industry}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
