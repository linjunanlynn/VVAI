import * as React from "react"
import { Building2, Home } from "lucide-react"
import { GenericCard } from "../components/main-ai/GenericCard"
import { ChatPromptButton } from "../components/chat/ChatPromptButton"
import { cn } from "../components/ui/utils"

export interface EducationSpaceTypePickerCardProps {
  onChooseFamily: () => void
  onChooseInstitutional: () => void
  onWatchVideo: () => void
}

const SPACE_OPTIONS: {
  key: "family" | "institutional"
  title: string
  subtitle: string
  hint: string
  icon: React.ReactNode
}[] = [
  {
    key: "family",
    title: "家庭教育空间",
    subtitle: "家庭场景与轻量协作",
    hint: "侧重成员陪伴、课程与奖励等日常协作，适合家庭自建学习空间。",
    icon: <Home className="h-[22px] w-[22px] shrink-0 text-primary" aria-hidden />,
  },
  {
    key: "institutional",
    title: "机构教育空间",
    subtitle: "完整教务与经营能力",
    hint: "提供经营、管理、教学全方面能力，适合学校与培训机构。",
    icon: <Building2 className="h-[22px] w-[22px] shrink-0 text-primary" aria-hidden />,
  },
]

/**
 * 主对话内：先选「家庭教育 / 机构教育」，再进入对应创建流程。
 * 类型选择在卡片内完成；行动建议区仅保留「查看教育视频介绍」。
 */
export function EducationSpaceTypePickerCard({
  onChooseFamily,
  onChooseInstitutional,
  onWatchVideo,
}: EducationSpaceTypePickerCardProps) {
  const [hovered, setHovered] = React.useState<"family" | "institutional" | null>(null)

  const handlers: Record<"family" | "institutional", () => void> = {
    family: onChooseFamily,
    institutional: onChooseInstitutional,
  }

  return (
    <div className="flex w-full max-w-[min(100%,720px)] flex-col">
      <GenericCard title="选择教育空间类型">
        <p className="m-0 mb-[var(--space-400)] text-[length:var(--font-size-base)] leading-relaxed text-text-secondary">
          请先选择一种空间类型，我们将进入对应的创建步骤。
        </p>
        <div className="flex w-full flex-col gap-[var(--space-300)]">
          {SPACE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => handlers[opt.key]()}
              onMouseEnter={() => setHovered(opt.key)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "flex w-full items-start gap-[var(--space-300)] rounded-[var(--radius-lg)] border p-[var(--space-400)] text-left transition-colors",
                "bg-bg hover:bg-bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                hovered === opt.key ? "border-primary/45 shadow-elevation-sm" : "border-border",
              )}
            >
              <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-border bg-bg-secondary">
                {opt.icon}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-[var(--space-100)]">
                <div>
                  <span className="block text-[length:var(--font-size-md)] font-[var(--font-weight-medium)] text-text">
                    {opt.title}
                  </span>
                  <span className="text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-primary">
                    {opt.subtitle}
                  </span>
                </div>
                <p className="m-0 text-[length:var(--font-size-sm)] leading-relaxed text-text-tertiary">{opt.hint}</p>
              </div>
            </button>
          ))}
        </div>
      </GenericCard>
      <div className="mt-[6px] flex w-full flex-wrap justify-start gap-[var(--space-200)]">
        <ChatPromptButton type="button" onClick={onWatchVideo}>
          查看教育视频介绍
        </ChatPromptButton>
      </div>
    </div>
  )
}
