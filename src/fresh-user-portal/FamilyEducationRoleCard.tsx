import * as React from "react"
import { GenericCard } from "../components/main-ai/GenericCard"
import { Users, GraduationCap } from "lucide-react"
import { cn } from "../components/ui/utils"
import type { FamilyCreatorRole } from "./educationSpaceTypes"

interface FamilyEducationRoleCardProps {
  onSelectRole: (role: FamilyCreatorRole) => void
  className?: string
}

const OPTIONS: {
  role: FamilyCreatorRole
  title: string
  subtitle: string
  hint: string
  icon: React.ReactNode
}[] = [
  {
    role: "parent",
    title: "我是家长",
    subtitle: "为孩子创建家庭教育空间",
    hint: "适用于监护人代孩子管理学习计划、课程与奖励，你可邀请孩子加入协作。",
    icon: <Users className="w-[22px] h-[22px] text-primary shrink-0" aria-hidden />,
  },
  {
    role: "student",
    title: "我是学生",
    subtitle: "为自己创建学习空间",
    hint: "适用于本人自主学习与成长记录；后续仍可邀请家长参与。",
    icon: <GraduationCap className="w-[22px] h-[22px] text-primary shrink-0" aria-hidden />,
  },
]

export function FamilyEducationRoleCard({ onSelectRole, className }: FamilyEducationRoleCardProps) {
  const [hovered, setHovered] = React.useState<FamilyCreatorRole | null>(null)

  return (
    <GenericCard title="选择你的身份" className={cn("max-w-full md:max-w-[560px]", className)}>
      <p className="text-[length:var(--font-size-base)] text-text-secondary leading-relaxed m-0 mb-[var(--space-400)]">
        创建家庭教育空间前，请先确认身份，以便我们为你匹配合适的能力与引导。
      </p>
      <div className="flex flex-col gap-[var(--space-300)] w-full">
        {OPTIONS.map((opt) => (
          <button
            key={opt.role}
            type="button"
            onClick={() => onSelectRole(opt.role)}
            onMouseEnter={() => setHovered(opt.role)}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              "flex gap-[var(--space-300)] items-start w-full text-left rounded-[var(--radius-lg)] border p-[var(--space-400)] transition-colors",
              "bg-bg hover:bg-bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
              hovered === opt.role ? "border-primary/45 shadow-elevation-sm" : "border-border",
            )}
          >
            <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-bg-secondary border border-border">
              {opt.icon}
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-[var(--space-100)]">
              <div>
                <span className="text-[length:var(--font-size-md)] font-[var(--font-weight-medium)] text-text block">
                  {opt.title}
                </span>
                <span className="text-[length:var(--font-size-sm)] text-primary font-[var(--font-weight-medium)]">
                  {opt.subtitle}
                </span>
              </div>
              <p className="text-[length:var(--font-size-sm)] text-text-tertiary leading-relaxed m-0">{opt.hint}</p>
            </div>
          </button>
        ))}
      </div>
    </GenericCard>
  )
}
