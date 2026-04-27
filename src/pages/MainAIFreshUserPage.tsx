import * as React from "react"
import { useNavigate } from "react-router"
import { ArrowLeft } from "lucide-react"
import { conversations } from "../components/chat/data"
import { FreshUserMainAIChatWindow } from "../fresh-user-portal/FreshUserMainAIChatWindow"
import { ThemeToggle } from "../components/main-ai/ThemeToggle"

/**
 * 与《VV框架 V2产品0421》`/main-ai-fresh-user` 对齐：全新用户 onboarding 全链路（独立路由，避免与现有 `?scenario=` 主框架强耦合）。
 */
export function MainAIFreshUserPage() {
  const navigate = useNavigate()
  const [historyOpen, setHistoryOpen] = React.useState(false)
  const [selectedId, setSelectedId] = React.useState(conversations[0].id)
  const selectedConversation = conversations.find((c) => c.id === selectedId) ?? conversations[0]

  return (
    <div className="relative flex h-screen w-full bg-bg-secondary">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute left-[var(--space-500)] top-[var(--space-500)] z-50 flex h-[var(--space-900)] w-[var(--space-900)] items-center justify-center rounded-full border border-border bg-bg shadow-elevation-sm transition-colors hover:bg-[var(--black-alpha-11)]"
        aria-label="返回首页"
      >
        <ArrowLeft className="h-[var(--space-400)] w-[var(--space-400)] text-text" />
      </button>
      <div className="absolute right-[var(--space-500)] top-[var(--space-500)] z-50 flex h-[var(--space-900)] w-[var(--space-900)] items-center justify-center rounded-full border border-border bg-bg shadow-elevation-sm transition-colors hover:bg-[var(--black-alpha-11)]">
        <ThemeToggle />
      </div>
      <div className="flex min-h-0 flex-1 items-stretch justify-center p-[var(--space-600)] pt-[76px]">
        <div className="flex h-full min-h-0 w-full max-w-[1200px] flex-1 flex-col">
          <FreshUserMainAIChatWindow
            conversation={selectedConversation}
            onToggleHistory={() => setHistoryOpen((p) => !p)}
            historyOpen={historyOpen}
            onHistoryOpenChange={setHistoryOpen}
            conversations={conversations}
            selectedId={selectedId}
            onSelect={setSelectedId}
            scene="fresh-user"
          />
        </div>
      </div>
    </div>
  )
}
