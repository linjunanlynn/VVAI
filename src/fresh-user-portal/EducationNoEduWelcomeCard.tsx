import * as React from "react"
import { Building2, Home } from "lucide-react"
import { GenericCard } from "../components/main-ai/GenericCard"
import { ChatPromptButton } from "../components/chat/ChatPromptButton"
import { cn } from "../components/ui/utils"

interface EducationNoEduWelcomeCardProps {
  onCreateFamily: () => void
  onCreateInstitutional: () => void
  onWatchVideo: () => void
  className?: string
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
    hint: "侧重成员陪伴、课程与奖励等日常协作。",
    icon: <Home className="h-[22px] w-[22px] shrink-0 text-primary" aria-hidden />,
  },
  {
    key: "institutional",
    title: "机构教育空间",
    subtitle: "完整教务与经营能力",
    hint: "提供经营、管理、教学全方面能力。",
    icon: <Building2 className="h-[22px] w-[22px] shrink-0 text-primary" aria-hidden />,
  },
]

/**
 * 尚未创建教育空间：在卡片内选择类型；行动建议为「什么是微微教育」。
 */
export function EducationNoEduWelcomeCard({
  onCreateFamily,
  onCreateInstitutional,
  onWatchVideo,
  className,
}: EducationNoEduWelcomeCardProps) {
  const [hovered, setHovered] = React.useState<"family" | "institutional" | null>(null)

  const handlers: Record<"family" | "institutional", () => void> = {
    family: onCreateFamily,
    institutional: onCreateInstitutional,
  }

  return (
    <div className={cn("flex w-full max-w-[min(100%,720px)] flex-col", className)}>
      <GenericCard title="欢迎使用微微教育">
        <p className="m-0 mb-[var(--space-400)] text-[length:var(--font-size-base)] leading-relaxed text-text-secondary">
          AI 帮助家庭与教育机构更高效地管理学习、课程与成长。 请先选择您需要创建的空间类型：
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
          什么是微微教育
        </ChatPromptButton>
      </div>
    </div>
  )
}
