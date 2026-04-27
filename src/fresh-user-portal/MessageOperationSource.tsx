import * as React from "react"
import { CornerDownRight, ArrowUp } from "lucide-react"
import { cn } from "../components/ui/utils"
import type { Message } from "../components/chat/data"
import { resolveOperationSourceLabel, scrollToMessageById } from "./operationSource"

export type OperationSourceNavigationContextValue = {
  /** 点击操作来源条时滚动到来源消息；无则只读不展示按钮语义 */
  onNavigateToOperationSource?: () => void
}

export const OperationSourceNavigationContext =
  React.createContext<OperationSourceNavigationContextValue>({})

export function MessageOperationSourceBar({ label }: { label: string }) {
  const { onNavigateToOperationSource } = React.useContext(OperationSourceNavigationContext)
  const interactive = Boolean(onNavigateToOperationSource)

  return (
    <div className="flex w-full justify-end mb-[6px]">
      <button
        type="button"
        disabled={!interactive}
        onClick={interactive ? onNavigateToOperationSource : undefined}
        className={cn(
          "inline-flex h-[28px] max-w-full min-w-0 items-center gap-[6px] rounded-full border border-border/60 bg-[var(--black-alpha-11)] px-[10px] py-0 text-left text-[length:var(--font-size-xs)] text-text-secondary transition-colors",
          interactive &&
            "cursor-pointer hover:bg-[var(--black-alpha-15)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          !interactive && "cursor-default opacity-80",
        )}
      >
        <CornerDownRight className="size-[14px] shrink-0 text-text-tertiary" aria-hidden />
        <span className="min-w-0 flex-1 truncate font-[var(--font-weight-medium)]">{label}</span>
        <span
          className={cn(
            "inline-flex size-[20px] shrink-0 items-center justify-center rounded-full border border-border bg-bg",
            interactive && "text-text-secondary",
          )}
          aria-hidden
        >
          <ArrowUp className="size-[12px]" />
        </span>
      </button>
    </div>
  )
}

type ShellProps = {
  msg: Message
  index: number
  messages: Message[]
  currentConversationId: string | undefined
  children: React.ReactNode
}

/** 每条助手卡片消息外：解析 operationSource、提供 Context、条件渲染操作来源条 */
export function MessageOperationSourceShell({ msg, index, messages, currentConversationId, children }: ShellProps) {
  const label = resolveOperationSourceLabel(msg, index, messages, currentConversationId)
  const op = msg.operationSource
  const hasId = Boolean(label && op?.sourceMessageId)

  const onNavigateToOperationSource = React.useCallback(() => {
    if (op?.sourceMessageId) scrollToMessageById(op.sourceMessageId)
  }, [op?.sourceMessageId])

  const contextValue = React.useMemo<OperationSourceNavigationContextValue>(
    () => ({
      onNavigateToOperationSource: hasId ? onNavigateToOperationSource : undefined,
    }),
    [hasId, onNavigateToOperationSource],
  )

  return (
    <OperationSourceNavigationContext.Provider value={contextValue}>
      <div className="flex w-full min-w-0 flex-col items-stretch">
        {label ? <MessageOperationSourceBar label={label} /> : null}
        {children}
      </div>
    </OperationSourceNavigationContext.Provider>
  )
}

type ColumnProps = {
  msg: Message
  messageIndex: number
  messages: Message[]
  currentConversationId: string | undefined
  className?: string
  children: React.ReactNode
}

/** 助手消息右侧内容列：保留原有 w-full / max-w 等 class，内层统一包 Shell */
export function AssistantMessageContentColumn({
  msg,
  messageIndex,
  messages,
  currentConversationId,
  className,
  children,
}: ColumnProps) {
  return (
    <div className={cn("min-w-0", className ?? "w-full")}>
      <MessageOperationSourceShell
        msg={msg}
        index={messageIndex}
        messages={messages}
        currentConversationId={currentConversationId}
      >
        {children}
      </MessageOperationSourceShell>
    </div>
  )
}
