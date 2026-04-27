import * as React from "react"
import { GenericCard } from "../components/main-ai/GenericCard"
import { Field } from "../components/ui/field"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Home } from "lucide-react"
import type { FamilyCreatorRole } from "./educationSpaceTypes"

interface CreateFamilyEducationSpaceCardProps {
  creatorRole: FamilyCreatorRole
  onSubmit: (data: { name: string; creatorRole: FamilyCreatorRole }) => void
}

export function CreateFamilyEducationSpaceCard({ creatorRole, onSubmit }: CreateFamilyEducationSpaceCardProps) {
  const [name, setName] = React.useState("")
  const [error, setError] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const t = name.trim()
    if (!t) {
      setError("请填写空间名称")
      return
    }
    setError("")
    onSubmit({ name: t, creatorRole })
  }

  const roleLine =
    creatorRole === "parent"
      ? "当前以家长身份为孩子创建空间，便于你管理学习计划并邀请家庭成员。"
      : "当前以学生身份为自己创建空间，专注于个人学习与成长记录。"

  return (
    <GenericCard title={creatorRole === "parent" ? "为孩子创建家庭教育空间" : "为自己创建家庭教育空间"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-[var(--space-300)] w-full">
        <div className="flex items-start gap-[var(--space-200)]">
          <Home className="w-[18px] h-[18px] text-primary shrink-0 mt-[2px]" />
          <p className="text-[length:var(--font-size-sm)] text-text-secondary m-0 leading-relaxed">
            {roleLine} 创建后即可在顶部切换该空间，并使用家庭视角下的课程与奖励等能力。
          </p>
        </div>
        <Field label="空间名称" required error={error}>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (error) setError("")
            }}
            placeholder={creatorRole === "parent" ? "例如：孩子的家庭学习空间" : "例如：我的学习空间"}
            className="w-full"
          />
        </Field>
        <div className="flex justify-end gap-[var(--space-200)]">
          <Button type="submit" variant="primary">
            创建空间
          </Button>
        </div>
      </form>
    </GenericCard>
  )
}
