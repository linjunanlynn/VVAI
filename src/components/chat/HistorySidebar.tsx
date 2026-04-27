import * as React from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Badge } from "../ui/badge"
import { coerceMessagesList, Conversation, type Message } from "./data"
import { cn } from "../ui/utils"
import { getConversationSessionListIconSrc } from "./conversationSessionListIcon"
import { getConversationDockAppId } from "../main-ai/dockAgentIntentResolve"
import { getDockAppShortName, stripOrgDecoratorsFromLabel } from "../main-ai/dockAppShortNames"
import { SessionListDayHistoryTrigger } from "./SessionListDayHistoryTrigger"
import type { MainChatHistoryEntry } from "../main-ai/mainChatHistoryTypes"
import {
  SessionListOrgHeader,
  SESSION_LIST_ORG_SLOT_CLASS,
  type SessionListInteractionContext,
  type SessionListOrgItem,
} from "./SessionListOrgHeader"
/** 主 VVAI 历史列表默认展示条数；超出后「显示全部」展开 */
const VVAI_MAIN_HISTORY_PREVIEW = 5

function lastMessageInHistoryEntry(entry: MainChatHistoryEntry): Message | undefined {
  const list = coerceMessagesList(entry.messages)
  if (list.length === 0) return undefined
  return list.reduce((best, m) => {
    const t = typeof m.createdAt === "number" && Number.isFinite(m.createdAt) ? m.createdAt : 0
    const bt =
      typeof best.createdAt === "number" && Number.isFinite(best.createdAt) ? best.createdAt : 0
    return t >= bt ? m : best
  })
}

type SessionListOrgLookup = { id: string; name: string }

function startOfLocalDay(d: Date): number {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x.getTime()
}

function formatSessionListLastActiveTime(last: Message | undefined, now: Date = new Date()): string {
  if (!last) return ""
  const ms = typeof last.createdAt === "number" && Number.isFinite(last.createdAt) && last.createdAt > 0 ? last.createdAt : null
  if (ms != null) {
    const msgDate = new Date(ms)
    const dayDiff = Math.floor((startOfLocalDay(now) - startOfLocalDay(msgDate)) / 86400000)
    if (dayDiff <= 0) {
      return msgDate.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false })
    }
    if (dayDiff === 1) return "昨天"
    if (dayDiff >= 2 && dayDiff < 7) {
      const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
      return weekdays[msgDate.getDay()]
    }
    if (msgDate.getFullYear() === now.getFullYear()) {
      return `${msgDate.getMonth() + 1}月${msgDate.getDate()}日`
    }
    return `${msgDate.getFullYear()}/${msgDate.getMonth() + 1}/${msgDate.getDate()}`
  }
  const fallback = last.timestamp?.trim()
  return fallback ?? ""
}

function isDockConversation(c: Conversation): boolean {
  return Boolean(c.dockAppId) || c.id.startsWith("dock:") || c.id.startsWith("dock-app-")
}

function conversationListAgentTitle(
  c: Conversation,
  organizations: SessionListOrgLookup[] | undefined
): string {
  const orgNames = organizations?.map((o) => o.name)
  const isDock = isDockConversation(c)
  if (isDock) {
    const appId = getConversationDockAppId(c)
    let title: string
    if (appId) {
      title = getDockAppShortName(appId)
    } else {
      const raw = c.sessionLabel?.trim()
      if (raw) {
        const cleaned = stripOrgDecoratorsFromLabel(raw, orgNames).replace(/^VVAI\s+/i, "").trim()
        title = cleaned || raw
      } else {
        title = "助手"
      }
    }
    return stripOrgDecoratorsFromLabel(title, orgNames)
  }
  return c.user?.name?.trim() || "VVAI"
}

function conversationDockOrgIdForSessionList(c: Conversation): string | null {
  if (c.dockOrgId != null && c.dockOrgId !== "") return c.dockOrgId
  const m = c.id.match(/^dock:([^:]+):(.+)$/)
  if (!m) return null
  if (m[1] === "app") return null
  return m[1]
}

function lastActivityMs(c: Conversation): number {
  const list = coerceMessagesList(c.messages)
  let max = 0
  for (const m of list) {
    const t = typeof m.createdAt === "number" ? m.createdAt : 0
    if (t > max) max = t
  }
  return max
}

function lastMessageForSessionList(c: Conversation): Message | undefined {
  const list = coerceMessagesList(c.messages)
  if (list.length === 0) return undefined
  return list.reduce((best, m) => {
    const t = typeof m.createdAt === "number" && Number.isFinite(m.createdAt) ? m.createdAt : 0
    const bt =
      typeof best.createdAt === "number" && Number.isFinite(best.createdAt) ? best.createdAt : 0
    return t >= bt ? m : best
  })
}

function sessionListRowTitles(
  c: Conversation,
  organizations: SessionListOrgLookup[] | undefined
): { primary: string; orgCaption: string | null } {
  const agentTitle = conversationListAgentTitle(c, organizations)
  if (!isDockConversation(c)) {
    return { primary: agentTitle, orgCaption: null }
  }
  const oid = conversationDockOrgIdForSessionList(c)
  if (oid == null || oid === "") {
    return { primary: agentTitle, orgCaption: null }
  }
  const orgName = organizations?.find((o) => o.id === oid)?.name?.trim()
  return { primary: agentTitle, orgCaption: orgName || oid }
}

type SessionListScrollEntry = { kind: "conv"; c: Conversation }

function buildSessionListScrollEntries(scrollable: Conversation[]): SessionListScrollEntry[] {
  return [...scrollable]
    .sort((a, b) => lastActivityMs(b) - lastActivityMs(a))
    .map((c) => ({ kind: "conv", c }))
}

/* ─── 统一会话行组件 ─── */

function SessionRow({
  conversation,
  selected,
  onSelect,
  organizations,
  showTypeTag,
  onJumpToConversationDay,
  vvaiHistoryCollapseToggle,
}: {
  conversation: Conversation
  selected: boolean
  onSelect: (id: string) => void
  organizations?: SessionListOrgLookup[]
  showTypeTag: boolean
  onJumpToConversationDay?: (conversationId: string, messageId: string) => void
  /** 《主AI》置顶行：历史对话展开/收起（与时间戳同列，时间下方） */
  vvaiHistoryCollapseToggle?: { open: boolean; onToggle: () => void }
}) {
  const dockRow = isDockConversation(conversation)
  const last = lastMessageForSessionList(conversation)
  const { primary: rowTitle, orgCaption } = sessionListRowTitles(conversation, organizations)
  const lastActiveLabel = formatSessionListLastActiveTime(last)
  const iconSrc = getConversationSessionListIconSrc(conversation)

  return (
    <div
      data-testid={dockRow ? "session-list-dock-app-org-row" : undefined}
      className={cn(
        "box-border flex w-full min-w-0 max-w-full items-start gap-[var(--space-100)] rounded-[var(--radius-md)] p-[var(--space-100)] text-left transition-colors",
        "hover:bg-[var(--black-alpha-11)]",
        selected ? "bg-[var(--blue-alpha-12)] text-primary" : "text-text"
      )}
    >
      <button
        type="button"
        onClick={() => onSelect(conversation.id)}
        className="flex min-w-0 flex-1 cursor-pointer touch-manipulation gap-[var(--space-200)] rounded-[var(--radius-sm)] border-none bg-transparent p-[var(--space-100)] text-left"
      >
        <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[var(--radius-md)] border border-border bg-bg-secondary">
          <img src={iconSrc} alt="" className="h-full w-full object-cover" draggable={false} />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-[var(--space-50)]">
          <span className="flex min-w-0 items-center gap-[var(--space-100)]">
            <span className="min-w-0 truncate text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] leading-normal">
              {rowTitle}
            </span>
            {showTypeTag ? (
              <Badge
                variant="outline"
                className={cn(
                  "h-[18px] shrink-0 px-[5px] py-0 text-[length:var(--font-size-xxs)] font-[var(--font-weight-medium)] leading-none",
                  "border-primary/35 text-primary bg-[var(--blue-alpha-12)]"
                )}
              >
                {dockRow ? "应用" : "主AI"}
              </Badge>
            ) : null}
          </span>
          {orgCaption ? (
            <span className="block w-full truncate text-[length:var(--font-size-xxs)] leading-normal text-text-tertiary">
              {orgCaption}
            </span>
          ) : null}
        </span>
      </button>
      <div className="flex shrink-0 flex-col items-end gap-0.5 self-stretch pt-[var(--space-100)] pr-[var(--space-50)]">
        {lastActiveLabel ? (
          <span
            className={cn(
              "whitespace-nowrap text-[length:var(--font-size-xxs)] font-[var(--font-weight-regular)] leading-none tabular-nums",
              selected ? "text-primary/70" : "text-text-tertiary"
            )}
          >
            {lastActiveLabel}
          </span>
        ) : null}
        {dockRow ? (
          /* 应用历史：日历选日后在主会话区内定位到该日首条消息 */
          <SessionListDayHistoryTrigger
            conversation={conversation}
            rowSelected={selected}
            onJumpToConversationDay={onJumpToConversationDay}
          />
        ) : vvaiHistoryCollapseToggle ? (
          <button
            type="button"
            data-testid="session-list-vvai-history-toggle"
            onClick={(e) => {
              e.stopPropagation()
              vvaiHistoryCollapseToggle.onToggle()
            }}
            aria-expanded={vvaiHistoryCollapseToggle.open}
            aria-label={vvaiHistoryCollapseToggle.open ? "收起历史对话" : "展开历史对话"}
            title={vvaiHistoryCollapseToggle.open ? "收起历史对话" : "展开历史对话"}
            className={cn(
              "flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-[var(--radius-md)] border-none bg-transparent p-0",
              "text-text-tertiary transition-colors hover:bg-[var(--black-alpha-11)] hover:text-text-secondary"
            )}
          >
            {vvaiHistoryCollapseToggle.open ? (
              <ChevronUp className="size-3.5" strokeWidth={2} aria-hidden />
            ) : (
              <ChevronDown className="size-3.5" strokeWidth={2} aria-hidden />
            )}
          </button>
        ) : null}
      </div>
    </div>
  )
}

/* ─── HistorySidebar ─── */

interface HistorySidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  conversations: Conversation[]
  selectedId: string
  onSelect: (id: string) => void
  /** overlay：首次进入等场景下的浮层侧栏；split：与主内容并排常驻 */
  layout?: "overlay" | "split"
  /** split 下由父级控制宽度；overlay 固定 280px */
  widthPx?: number
  /** split 且为 true 时不展示关闭按钮，且不因选会话而关闭侧栏 */
  persistent?: boolean
  /** overlay 下选中会话后仍保持侧栏展开（场景五：多应用切换不中断） */
  keepOpenOnSessionSelect?: boolean
  /** 指定 id 的会话固定在列表顶部（不随滚动离开视野），一般为《主AI入口》主会话 */
  pinnedSessionId?: string
  /** 合并行副文案、下拉等解析组织名（主标题不再拼「主体 · 应用」） */
  organizations?: SessionListOrgLookup[]
  /** 保留兼容 */
  sessionListPreferredOrgId?: string
  /** 在会话标题旁展示类型标签（主AI / 应用），便于 IM 式扫视 */
  showConversationTypeTags?: boolean
  /** 「按日期查看」选中后：切换会话并在主内容区定位到该日首条消息 */
  onJumpToConversationDay?: (conversationId: string, messageId: string) => void
  /** 主 VVAI 顶栏「开启新会话」归档的会话列表 */
  mainChatHistory?: MainChatHistoryEntry[]
  /** 选中某条归档，恢复主会话内容 */
  onPickMainChatHistoryEntry?: (entryId: string) => void
  /** 当前与主会话内容一致的归档条目 id */
  activeMainChatHistoryEntryId?: string | null
  /** 侧栏顶栏标题右侧《组织状态》（可选；与顶栏组织列表同源字段时传入 icon / memberCount） */
  sessionListOrgHeader?: {
    organizations: SessionListOrgItem[]
    currentOrgId: string
    onSelectOrg: (orgId: string) => void
    onCreateOrg?: () => void
    onJoinOrg?: () => void
    interactionContext?: SessionListInteractionContext | null
  }
}

export function HistorySidebar({
  open,
  onOpenChange,
  conversations,
  selectedId,
  onSelect,
  layout = "overlay",
  widthPx = 280,
  persistent = false,
  pinnedSessionId,
  organizations,
  sessionListPreferredOrgId: _sessionListPreferredOrgId,
  keepOpenOnSessionSelect = false,
  showConversationTypeTags = false,
  onJumpToConversationDay,
  mainChatHistory = [],
  onPickMainChatHistoryEntry,
  activeMainChatHistoryEntryId = null,
  sessionListOrgHeader,
}: HistorySidebarProps) {
  const isSplit = layout === "split"

  const sortedMainHistory = React.useMemo(
    () => [...mainChatHistory].sort((a, b) => b.updatedAt - a.updatedAt),
    [mainChatHistory]
  )
  const historyCount = sortedMainHistory.length
  const [vvaiHistorySectionOpen, setVvaiHistorySectionOpen] = React.useState(
    () => historyCount > 0
  )
  const [mainHistoryExpandedAll, setMainHistoryExpandedAll] = React.useState(false)

  const prevHistoryCountRef = React.useRef<number | null>(null)
  React.useEffect(() => {
    const prev = prevHistoryCountRef.current
    prevHistoryCountRef.current = historyCount
    if (prev === null) return
    if (historyCount === 0) {
      setVvaiHistorySectionOpen(false)
    } else if (prev === 0 && historyCount > 0) {
      setVvaiHistorySectionOpen(true)
    }
  }, [historyCount])
  const hasMoreMainHistory = sortedMainHistory.length > VVAI_MAIN_HISTORY_PREVIEW
  const visibleMainHistory = mainHistoryExpandedAll
    ? sortedMainHistory
    : sortedMainHistory.slice(0, VVAI_MAIN_HISTORY_PREVIEW)

  const pinnedConversation =
    pinnedSessionId != null ? conversations.find((c) => c.id === pinnedSessionId) : undefined

  const showMainVvaiHistoryChrome =
    pinnedSessionId != null &&
    pinnedConversation != null &&
    !isDockConversation(pinnedConversation) &&
    onPickMainChatHistoryEntry != null

  const scrollableConversations = pinnedConversation
    ? conversations.filter((c) => c.id !== pinnedSessionId)
    : conversations

  const scrollEntries = React.useMemo(
    () => buildSessionListScrollEntries(scrollableConversations),
    [scrollableConversations]
  )

  const handleSelect = (id: string) => {
    onSelect(id)
    if (!persistent && !isSplit && !keepOpenOnSessionSelect) {
      onOpenChange(false)
    }
  }

  const panel = (
    <div
      data-testid="session-list-sidebar"
      className={cn(
        "bg-cui-bg box-border flex min-h-0 min-w-0 flex-col overflow-hidden border-border",
        isSplit
          ? "h-full shrink-0 self-stretch rounded-none border-r z-0"
          : cn(
              "absolute top-0 left-0 bottom-0 z-50 min-w-0 rounded-tr-[var(--radius-xl)] rounded-br-[var(--radius-xl)] border-r transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
              open
                ? "translate-x-0 shadow-elevation-sm w-[280px] max-w-[min(280px,100%)]"
                : "-translate-x-full shadow-none w-[280px] max-w-[min(280px,100%)] pointer-events-none"
            )
      )}
      style={
        isSplit
          ? { width: widthPx, minWidth: 0, maxWidth: "100%", boxSizing: "border-box" }
          : { boxSizing: "border-box" }
      }
    >
      {/* 顶栏：标题 +《组织状态》+ 关闭 */}
      <div
        className={cn(
          "flex min-w-0 shrink-0 items-center justify-between gap-x-[var(--space-200)] border-b border-border",
          "px-[max(20px,var(--space-300))] pb-[var(--space-250)] pt-[var(--space-300)]"
        )}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-[var(--space-100)]">
          <h2
            className={cn(
              "m-0 border-l-[3px] border-primary/45 pl-[var(--space-250)]",
              "text-[length:var(--font-size-lg)] font-[var(--font-weight-semi-bold)] leading-[var(--line-height-lg)] tracking-[var(--letter-spacing-xs)] text-text"
            )}
          >
            会话历史
          </h2>
        </div>
        <div className="flex min-w-0 shrink-0 items-center justify-end gap-[var(--space-100)]">
          {sessionListOrgHeader ? (
            <div className={SESSION_LIST_ORG_SLOT_CLASS}>
              <SessionListOrgHeader
                organizations={sessionListOrgHeader.organizations}
                currentOrgId={sessionListOrgHeader.currentOrgId}
                onSelectOrg={sessionListOrgHeader.onSelectOrg}
                onCreateOrg={sessionListOrgHeader.onCreateOrg}
                onJoinOrg={sessionListOrgHeader.onJoinOrg}
                interactionContext={sessionListOrgHeader.interactionContext}
                popoverAlign="end"
              />
            </div>
          ) : null}
          {!persistent ? (
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex h-[var(--space-800)] w-[var(--space-800)] shrink-0 cursor-pointer items-center justify-center rounded-[var(--radius-md)] border-none bg-transparent p-0 text-text-secondary transition-colors hover:bg-[var(--black-alpha-11)]"
              title="关闭"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          ) : null}
        </div>
      </div>

      {/* ── Zone 1：VVAI 置顶行（统一行样式，无内嵌展开按钮） ── */}
      {pinnedConversation ? (
        <div className="min-w-0 shrink-0 bg-cui-bg px-[var(--space-300)] pb-[var(--space-50)] pt-[var(--space-100)]">
          <SessionRow
            conversation={pinnedConversation}
            selected={selectedId === pinnedConversation.id}
            onSelect={handleSelect}
            organizations={organizations}
            showTypeTag={showConversationTypeTags}
            onJumpToConversationDay={onJumpToConversationDay}
            vvaiHistoryCollapseToggle={
              showMainVvaiHistoryChrome
                ? {
                    open: vvaiHistorySectionOpen,
                    onToggle: () => setVvaiHistorySectionOpen((o) => !o),
                  }
                : undefined
            }
          />
        </div>
      ) : null}

      {/* ── Zone 2：历史对话区（标题 + 列表仅在置顶行图标展开时展示） ── */}
      {showMainVvaiHistoryChrome && vvaiHistorySectionOpen ? (
        <div className="min-w-0 shrink-0 border-b border-border bg-cui-bg px-[var(--space-300)]">
          <div
            className={cn(
              "flex w-full min-w-0 items-center gap-[var(--space-150)]",
              "rounded-[var(--radius-md)] px-[var(--space-200)] py-[var(--space-200)]"
            )}
          >
            <span className="text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-text-secondary">
              历史对话
            </span>
            {sortedMainHistory.length > 0 ? (
              <span className="inline-flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full bg-[var(--black-alpha-11)] px-[5px] text-[length:var(--font-size-xxs)] font-[var(--font-weight-medium)] tabular-nums text-text-tertiary">
                {sortedMainHistory.length}
              </span>
            ) : null}
          </div>

          {sortedMainHistory.length > 0 ? (
            <div className="flex flex-col gap-0 pb-[var(--space-200)]">
              {visibleMainHistory.map((entry) => {
                const last = lastMessageInHistoryEntry(entry)
                const timeLabel = formatSessionListLastActiveTime(last)
                const rowOn = entry.id === activeMainChatHistoryEntryId
                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => onPickMainChatHistoryEntry?.(entry.id)}
                    className={cn(
                      "flex w-full min-w-0 items-center gap-[var(--space-150)] rounded-[var(--radius-md)] py-[var(--space-150)] pl-[var(--space-200)] pr-[var(--space-100)] text-left transition-colors",
                      rowOn
                        ? "bg-[var(--blue-alpha-12)] text-primary"
                        : "text-text-secondary hover:bg-[var(--black-alpha-11)] hover:text-text"
                    )}
                  >
                    <span
                      className={cn(
                        "size-[5px] shrink-0 rounded-full",
                        rowOn ? "bg-primary" : "bg-text-tertiary/60"
                      )}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1 truncate text-[length:var(--font-size-xs)] font-[var(--font-weight-regular)] leading-snug">
                      {entry.title}
                    </span>
                    {timeLabel ? (
                      <span
                        className={cn(
                          "shrink-0 whitespace-nowrap text-[length:var(--font-size-xxs)] font-[var(--font-weight-regular)] tabular-nums",
                          rowOn ? "text-primary/60" : "text-text-tertiary"
                        )}
                      >
                        {timeLabel}
                      </span>
                    ) : null}
                  </button>
                )
              })}
              {hasMoreMainHistory && !mainHistoryExpandedAll ? (
                <button
                  type="button"
                  className="mt-[var(--space-50)] flex w-full items-center justify-center gap-[var(--space-100)] rounded-[var(--radius-md)] py-[var(--space-100)] text-[length:var(--font-size-xxs)] text-text-tertiary transition-colors hover:bg-[var(--black-alpha-11)] hover:text-primary"
                  onClick={() => setMainHistoryExpandedAll(true)}
                >
                  显示全部
                  <ChevronDown className="h-3 w-3 shrink-0" strokeWidth={2} aria-hidden />
                </button>
              ) : null}
              {hasMoreMainHistory && mainHistoryExpandedAll ? (
                <button
                  type="button"
                  className="mt-[var(--space-50)] flex w-full items-center justify-center gap-[var(--space-100)] rounded-[var(--radius-md)] py-[var(--space-100)] text-[length:var(--font-size-xxs)] text-text-tertiary transition-colors hover:bg-[var(--black-alpha-11)] hover:text-primary"
                  onClick={() => setMainHistoryExpandedAll(false)}
                >
                  收起
                  <ChevronUp className="h-3 w-3 shrink-0" strokeWidth={2} aria-hidden />
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ── Zone 3：应用会话列表（统一平面行 + 日历图标） ── */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div className="min-h-0 min-w-0 flex-1 touch-manipulation overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]">
          <div className="box-border flex w-full min-w-0 max-w-full flex-col gap-[var(--space-50)] px-[var(--space-300)] pt-[var(--space-100)] pb-[var(--space-500)]">
          {conversations.length === 0 ? (
            <p className="text-[length:var(--font-size-sm)] text-text-secondary px-[var(--space-200)] py-[var(--space-300)]">
              无会话
            </p>
          ) : scrollEntries.length === 0 ? (
            showMainVvaiHistoryChrome ? null : (
              <p className="m-0 px-[var(--space-200)] py-[var(--space-300)] text-[length:var(--font-size-sm)] text-text-secondary">
                暂无可展示的会话。
              </p>
            )
          ) : (
            scrollEntries.map((entry) => (
              <SessionRow
                key={entry.c.id}
                conversation={entry.c}
                selected={selectedId === entry.c.id}
                onSelect={handleSelect}
                organizations={organizations}
                showTypeTag={showConversationTypeTags}
                onJumpToConversationDay={onJumpToConversationDay}
              />
            ))
          )}
          </div>
        </div>
      </div>
    </div>
  )

  if (isSplit) {
    return panel
  }

  return (
    <>
      {open && (
        <div
          className="absolute inset-0 z-40 bg-[var(--black-alpha-4)] backdrop-blur-[2px] transition-opacity"
          onClick={() => onOpenChange(false)}
        />
      )}
      {panel}
    </>
  )
}
