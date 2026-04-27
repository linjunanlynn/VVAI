import * as React from "react"
import {
  Search,
  Plus,
  Settings,
  Bot,
  Filter,
  BellOff,
  MoreHorizontal,
  Mic,
  Smile,
  AtSign,
  Scissors,
  Paperclip,
  Video,
  Maximize2,
  Volume2,
  Reply,
} from "lucide-react"
import { cn } from "../ui/utils"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
  IM_MOCK_CONVERSATIONS,
  IM_MOCK_MESSAGES,
  type IMConversation,
  type IMChatMessage,
} from "./im-mock-data"

const COL = {
  listBg: "#F5F5F5",
  chatBg: "#FFFFFF",
  border: "#E8E8E8",
  text: "#1a1a1a",
  secondary: "#888888",
  blue: "#3d7eff",
  activeList: "#E8F1FF",
  bubble: "#FFFFFF",
  tabInactive: "#666666",
} as const

const LIST_MIN = 220
const LIST_MAX_RATIO = 0.55
const RESIZER_HIT = 6

function IMGlobalTopBar() {
  return (
    <header
      className="flex h-[48px] shrink-0 items-center justify-between border-b px-4"
      style={{ borderColor: COL.border, backgroundColor: COL.chatBg }}
    >
      <div className="flex-1 flex justify-center px-8">
        <div
          className="flex h-[32px] w-full max-w-[480px] items-center rounded-md border px-3"
          style={{ borderColor: COL.border, backgroundColor: "#fafafa" }}
        >
          <Search className="h-4 w-4 shrink-0" style={{ color: COL.secondary }} strokeWidth={1.5} />
          <input
            type="search"
            placeholder="搜索"
            className="ml-2 h-full min-w-0 flex-1 border-none bg-transparent text-[13px] outline-none placeholder:text-[#bbb]"
          />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full border-none transition-opacity hover:opacity-80"
          style={{ backgroundColor: COL.blue }}
          aria-label="新建"
        >
          <Plus className="h-[18px] w-[18px] text-white" strokeWidth={2} />
        </button>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md border-none bg-transparent hover:bg-black/[0.04]"
          aria-label="设置"
        >
          <Settings className="h-[18px] w-[18px]" style={{ color: COL.secondary }} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md border-none bg-transparent hover:bg-black/[0.04]"
          aria-label="AI"
        >
          <Bot className="h-[18px] w-[18px]" style={{ color: COL.secondary }} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  )
}

function GroupAvatarPlaceholder({ size = 40 }: { size?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-px overflow-hidden rounded-md bg-[#ddd] p-px"
      style={{ width: size, height: size }}
    >
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="rounded-[1px] bg-gradient-to-br from-[#c9d6ff] to-[#e2e2e2]" />
      ))}
    </div>
  )
}

function IMListTabs({ unreadTotal }: { unreadTotal: number }) {
  const tabs = [
    { id: "all", label: "全部" },
    { id: "unread", label: `未读 ${unreadTotal}` },
  ] as const
  const [active, setActive] = React.useState<string>("all")
  return (
    <div className="flex items-center justify-between border-b px-3 pt-2" style={{ borderColor: COL.border }}>
      <div className="flex gap-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            className="relative border-none bg-transparent pb-2 text-[13px] transition-colors"
            style={{
              color: active === t.id ? COL.blue : COL.tabInactive,
              fontWeight: active === t.id ? 600 : 400,
            }}
          >
            {t.label}
            {active === t.id && (
              <span
                className="absolute bottom-0 left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full"
                style={{ backgroundColor: COL.blue }}
              />
            )}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1 pb-1">
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-md border-none bg-transparent hover:bg-black/[0.05]"
          aria-label="筛选"
        >
          <Filter className="h-4 w-4" style={{ color: COL.secondary }} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-md border-none bg-transparent hover:bg-black/[0.05]"
          aria-label="发起会话"
        >
          <Plus className="h-4 w-4" style={{ color: COL.secondary }} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )
}

function IMConversationRow({
  conv,
  active,
  onClick,
}: {
  conv: IMConversation
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full cursor-pointer border-b px-3 py-2.5 text-left transition-colors"
      style={{
        borderColor: "rgba(0,0,0,0.06)",
        backgroundColor: active ? COL.activeList : "transparent",
        boxShadow: active ? `inset 3px 0 0 0 ${COL.blue}` : undefined,
      }}
    >
      <div className="mr-2.5 shrink-0">
        {conv.isGroup ? (
          <GroupAvatarPlaceholder />
        ) : (
          <Avatar className="h-10 w-10 rounded-md border border-[#eee]">
            <AvatarImage src={conv.avatar || undefined} />
            <AvatarFallback className="rounded-md text-xs">{conv.name.slice(0, 1)}</AvatarFallback>
          </Avatar>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <span className="truncate text-[14px] font-semibold leading-tight" style={{ color: COL.text }}>
            {conv.name}
          </span>
          <span className="shrink-0 text-[11px]" style={{ color: COL.secondary }}>
            {conv.time}
          </span>
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <span className="truncate text-[12px] leading-snug" style={{ color: COL.secondary }}>
            {conv.snippet}
          </span>
          {conv.muted && (
            <BellOff className="h-3.5 w-3.5 shrink-0 opacity-60" style={{ color: COL.secondary }} strokeWidth={1.5} />
          )}
        </div>
      </div>
    </button>
  )
}

function MessageBubble({ msg }: { msg: IMChatMessage }) {
  const [hover, setHover] = React.useState(false)
  if (msg.separator) {
    return (
      <div className="flex justify-center py-3">
        <span className="rounded-full bg-black/[0.04] px-3 py-1 text-[12px]" style={{ color: COL.secondary }}>
          {msg.separator}
        </span>
      </div>
    )
  }
  if (!msg.lines.length) return null
  return (
    <div
      className="group relative flex gap-2 px-4 py-1"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Avatar className="mt-0.5 h-9 w-9 shrink-0 rounded-md border border-[#eee]">
        <AvatarFallback className="rounded-md text-xs">{msg.sender.slice(0, 1)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-baseline gap-2">
          <span className="text-[13px] font-medium" style={{ color: COL.text }}>
            {msg.sender}
          </span>
          <span className="text-[11px]" style={{ color: COL.secondary }}>
            {msg.time}
          </span>
        </div>
        <div
          className="relative inline-block max-w-[min(560px,85%)] rounded-md border px-3 py-2 shadow-sm"
          style={{
            backgroundColor: COL.bubble,
            borderColor: COL.border,
            borderRadius: 6,
          }}
        >
          <div className="space-y-1.5 text-[14px] leading-relaxed" style={{ color: COL.text }}>
            {msg.lines.map((line, i) => (
              <p key={i} className="m-0">
                {line}
              </p>
            ))}
          </div>
          {hover && (
            <div
              className="absolute -bottom-2 right-2 flex items-center gap-0.5 rounded-md border bg-white px-1 py-0.5 shadow-md"
              style={{ borderColor: COL.border }}
            >
              <button type="button" className="rounded p-1 hover:bg-black/[0.04]" title="表情">
                <Smile className="h-3.5 w-3.5" style={{ color: COL.secondary }} />
              </button>
              <button type="button" className="rounded p-1 hover:bg-black/[0.04]" title="回复">
                <Reply className="h-3.5 w-3.5" style={{ color: COL.secondary }} />
              </button>
              <button type="button" className="rounded p-1 hover:bg-black/[0.04]" title="更多">
                <MoreHorizontal className="h-3.5 w-3.5" style={{ color: COL.secondary }} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function IMChatPanel({ conversation }: { conversation: IMConversation | undefined }) {
  const messages = conversation ? IM_MOCK_MESSAGES[conversation.id] ?? [] : []
  const title =
    conversation?.name ?? "会话"
  const count = conversation?.isGroup ? 24 : undefined

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-white" style={{ backgroundColor: COL.chatBg }}>
      <div
        className="flex h-[52px] shrink-0 items-center justify-between border-b px-4"
        style={{ borderColor: COL.border }}
      >
        <div className="flex min-w-0 items-center gap-2">
          {conversation?.isGroup ? <GroupAvatarPlaceholder size={36} /> : null}
          {!conversation?.isGroup && (
            <Avatar className="h-9 w-9 rounded-md border">
              <AvatarFallback>{conversation?.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
          )}
          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold" style={{ color: COL.text }}>
              {title}
              {count != null && (
                <span className="font-normal" style={{ color: COL.secondary }}>
                  {" "}
                  ({count})
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <IconBtn title="静音">
            <Volume2 className="h-[18px] w-[18px]" style={{ color: COL.secondary }} strokeWidth={1.5} />
          </IconBtn>
          <IconBtn title="搜索">
            <Search className="h-[18px] w-[18px]" style={{ color: COL.secondary }} strokeWidth={1.5} />
          </IconBtn>
          <IconBtn title="添加成员">
            <Plus className="h-[18px] w-[18px]" style={{ color: COL.secondary }} strokeWidth={1.5} />
          </IconBtn>
          <IconBtn title="更多">
            <MoreHorizontal className="h-[18px] w-[18px]" style={{ color: COL.secondary }} strokeWidth={1.5} />
          </IconBtn>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto py-2">
        {messages.map((m) => (
          <MessageBubble key={m.id} msg={m} />
        ))}
      </div>

      <div className="shrink-0 border-t px-3 pb-3 pt-2" style={{ borderColor: COL.border }}>
        <div className="mb-1 flex items-center gap-0.5 px-1">
          <TinyTool icon={<Mic className="h-4 w-4" />} title="语音" />
          <TinyTool icon={<Smile className="h-4 w-4" />} title="表情" />
          <TinyTool icon={<AtSign className="h-4 w-4" />} title="@提及" />
          <TinyTool icon={<Scissors className="h-4 w-4" />} title="截图" />
          <TinyTool icon={<Paperclip className="h-4 w-4" />} title="附件" />
          <TinyTool icon={<Video className="h-4 w-4" />} title="视频" />
          <TinyTool icon={<MoreHorizontal className="h-4 w-4" />} title="更多" />
          <TinyTool icon={<Maximize2 className="h-4 w-4" />} title="全屏输入" />
        </div>
        <textarea
          rows={3}
          placeholder="请输入消息，Shift+Enter换行，Enter发送"
          className="w-full resize-none rounded-md border px-3 py-2 text-[14px] outline-none focus:border-[#3d7eff]/50"
          style={{ borderColor: COL.border, minHeight: 72 }}
        />
      </div>
    </div>
  )
}

function IconBtn({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <button
      type="button"
      title={title}
      className="flex h-8 w-8 items-center justify-center rounded-md border-none bg-transparent hover:bg-black/[0.04]"
    >
      {children}
    </button>
  )
}

function TinyTool({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <button
      type="button"
      title={title}
      className="flex h-8 w-8 items-center justify-center rounded-md border-none bg-transparent hover:bg-black/[0.04]"
      style={{ color: COL.secondary }}
    >
      {icon}
    </button>
  )
}

/**
 * 《主CUI交互》右侧为消息时的 IM：会话列表 + 可拖拽分隔 + 会话详情
 */
export function IMWorkspace() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [listWidth, setListWidth] = React.useState(280)
  const [selectedId, setSelectedId] = React.useState(IM_MOCK_CONVERSATIONS[0]?.id ?? "")
  const dragRef = React.useRef<{ startX: number; startW: number } | null>(null)

  const selected = IM_MOCK_CONVERSATIONS.find((c) => c.id === selectedId)
  const unreadTotal = 5

  const onResizerDown = (e: React.MouseEvent) => {
    e.preventDefault()
    dragRef.current = { startX: e.clientX, startW: listWidth }
    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"
    const onMove = (ev: MouseEvent) => {
      const d = dragRef.current
      const el = containerRef.current
      if (!d || !el) return
      const rect = el.getBoundingClientRect()
      const maxW = Math.max(LIST_MIN, rect.width * LIST_MAX_RATIO)
      const next = Math.min(maxW, Math.max(LIST_MIN, d.startW + (ev.clientX - d.startX)))
      setListWidth(next)
    }
    const onUp = () => {
      dragRef.current = null
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }

  return (
    <div ref={containerRef} className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white">
      <IMGlobalTopBar />
      <div className="flex min-h-0 flex-1 flex-row">
        <div
          className="flex min-h-0 shrink-0 flex-col border-r"
          style={{ width: listWidth, backgroundColor: COL.listBg, borderColor: COL.border }}
        >
          <IMListTabs unreadTotal={unreadTotal} />
          <div className="min-h-0 flex-1 overflow-y-auto">
            {IM_MOCK_CONVERSATIONS.map((c) => (
              <IMConversationRow key={c.id} conv={c} active={c.id === selectedId} onClick={() => setSelectedId(c.id)} />
            ))}
          </div>
        </div>

        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="调整会话列表宽度"
          onMouseDown={onResizerDown}
          className="group relative z-10 shrink-0 select-none"
          style={{
            width: RESIZER_HIT,
            cursor: "col-resize",
            marginLeft: -Math.floor(RESIZER_HIT / 2) + 1,
            marginRight: -Math.floor(RESIZER_HIT / 2) + 1,
          }}
        >
          <div
            className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[#e8e8e8] group-hover:bg-[#3d7eff]/40"
            style={{ top: 0, bottom: 0 }}
          />
        </div>

        <IMChatPanel conversation={selected} />
      </div>
    </div>
  )
}
