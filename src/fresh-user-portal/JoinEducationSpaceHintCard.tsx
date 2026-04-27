import * as React from "react"
import { GenericCard } from "../components/main-ai/GenericCard"
import { ChatPromptButton } from "../components/chat/ChatPromptButton"

export interface JoinEducationSpaceHintCardProps {
  onUseInviteCode: () => void
}

/**
 * 加入教育空间：说明 + 跳转邀请码流程（演示与加入组织表单共用能力）
 */
export function JoinEducationSpaceHintCard({ onUseInviteCode }: JoinEducationSpaceHintCardProps) {
  return (
    <div className="w-full max-w-[min(100%,720px)]">
      <GenericCard title="加入教育空间">
        <p className="text-[length:var(--font-size-base)] text-text-secondary leading-relaxed m-0 mb-[var(--space-300)]">
          加入教育空间通常需要管理员提供的<strong className="text-text font-[var(--font-weight-medium)]"> 邀请码或邀请链接 </strong>
          。演示环境中与「加入组织」共用同一套邀请码表单。
        </p>
        <div className="flex flex-wrap justify-start gap-[var(--space-200)]">
          <ChatPromptButton type="button" onClick={onUseInviteCode}>
            使用邀请码加入
          </ChatPromptButton>
        </div>
      </GenericCard>
    </div>
  )
}
