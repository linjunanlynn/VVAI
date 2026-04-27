import * as React from "react"
import { Building2, Check, ChevronDown, ChevronUp, FileCheck, Search, User } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { cn } from "../components/ui/utils"
import { canCurrentUserProcessTodo, SCHEDULE_CURRENT_USER_NAME } from "./seeds"
import type { VvTodoHubTab, VvTodoItem } from "./types"
import { TODO_FULL_HUB_TABS, todosForHubTab } from "./todoHub"

export type VvActionHandler = (action: string, data?: unknown) => void

const PAGE = 8
const LOAD_EDGE = 96

const SOURCE_CATEGORIES = ["考勤", "流程", "任务", "入职", "调岗", "物资"] as const

type StatusFilterKey = "all" | "processing" | "completed" | "rejected" | "revoked"

const STATUS_OPTIONS: { key: StatusFilterKey; label: string }[] = [
  { key: "processing", label: "处理中" },
  { key: "completed", label: "已完成" },
  { key: "rejected", label: "已拒绝" },
  { key: "revoked", label: "已撤销" },
]

function clockFromTime(time: string): number {
  const matches = time.match(/(\d{1,2}):(\d{2})/g)
  if (!matches?.length) return 0
  const last = matches[matches.length - 1]!
  const [h, m] = last.split(":").map((x) => parseInt(x, 10))
  return (Number.isFinite(h) ? h : 0) * 60 + (Number.isFinite(m) ? m : 0)
}

/** 可比较的时间权重：越大越新，用于排序与筛选 */
function timeRank(item: VvTodoItem): number {
  if (typeof item.fullHubSortKey === "number") return item.fullHubSortKey
  const t = item.time
  if (t.includes("今天")) return 900_000 + clockFromTime(t)
  if (t.includes("昨天")) return 800_000 + clockFromTime(t)
  const m = t.match(/(\d{2})-(\d{2})\s+(\d{1,2}):(\d{2})/)
  if (m) {
    const mo = parseInt(m[1]!, 10)
    const da = parseInt(m[2]!, 10)
    const hh = parseInt(m[3]!, 10)
    const mm = parseInt(m[4]!, 10)
    return mo * 50_000 + da * 1_200 + hh * 60 + mm
  }
  return clockFromTime(t)
}

function itemSourceCategory(item: VvTodoItem): string {
  return item.fullHubSourceCategory ?? (item.type === "approval" ? "流程" : "任务")
}

function matchesStatusFilter(item: VvTodoItem, key: StatusFilterKey): boolean {
  if (key === "all") return true
  if (key === "processing") return item.status === "pending"
  if (key === "completed") return item.status === "done"
  if (key === "rejected") return item.status === "rejected"
  if (key === "revoked") return item.status === "revoked"
  return true
}

function todoRowMetaVerb(item: VvTodoItem): string {
  if (item.metaVerb) return item.metaVerb
  if (item.status === "done") return "完成"
  return "推送"
}

function todoRowStatusBadge(item: VvTodoItem): { label: string; tone: "orange" | "gray" } | null {
  if (item.status === "pending") return { label: "处理中", tone: "orange" }
  if (item.status === "rejected") return { label: "已拒绝", tone: "gray" }
  if (item.status === "revoked") return { label: "已撤销", tone: "gray" }
  if (item.status === "done") return { label: "已完成", tone: "gray" }
  if (item.status === "cc") return { label: "已抄送", tone: "gray" }
  if (item.status === "draft") return { label: "草稿", tone: "gray" }
  return null
}

function assigneeSuffix(item: VvTodoItem): string | null {
  if (item.assigneeLine) return item.assigneeLine
  const names = item.assignees?.filter(Boolean) ?? []
  if (!names.length) return null
  const me = names.find((n) => n === "我")
  if (me) return `${SCHEDULE_CURRENT_USER_NAME} (我)`
  return names[0] ?? null
}

function FullTodoSwipeRow({
  item,
  onAction,
}: {
  item: VvTodoItem
  onAction?: VvActionHandler
}) {
  const canProcess = canCurrentUserProcessTodo(item)
  const badge = todoRowStatusBadge(item)
  const tone = item.listTone ?? (item.type === "approval" ? "rose" : "emerald")
  const source = item.sourceLabel ?? item.owner
  const metaLead = `${item.time} · ${todoRowMetaVerb(item)}`
  const assignee = assigneeSuffix(item)
  const IconGlyph = item.type === "approval" ? FileCheck : Check
  const showDetail = item.status !== "revoked"
  const [dx, setDx] = React.useState(0)
  const drag = React.useRef<{ x: number; active: boolean }>({ x: 0, active: false })
  const maxReveal = 88

  const endDrag = () => {
    drag.current.active = false
    setDx((cur) => (cur < -maxReveal * 0.35 ? -maxReveal : 0))
  }

  const openDetail = () => {
    setDx(0)
    onAction?.("todo-detail", item)
  }

  return (
    <div className="relative overflow-hidden rounded-[var(--radius-md)] border border-border bg-bg shadow-xs">
      <div
        className="absolute inset-y-0 right-0 z-0 flex w-[92px] items-stretch gap-0 border-l border-border bg-bg-secondary"
        aria-hidden
      >
        <button
          type="button"
          className="flex flex-1 items-center justify-center text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-text-secondary hover:bg-[var(--black-alpha-11)]"
          onClick={() => {
            setDx(0)
          }}
        >
          忽略
        </button>
        <button
          type="button"
          className="flex flex-1 items-center justify-center bg-primary/10 text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-primary hover:bg-primary/15"
          onClick={openDetail}
        >
          处理
        </button>
      </div>
      <div
        className="relative z-[1] bg-bg transition-transform duration-200 ease-out"
        style={{ transform: `translateX(${dx}px)` }}
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, active: true }
          ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
        }}
        onPointerMove={(e) => {
          if (!drag.current.active) return
          const next = e.clientX - drag.current.x
          setDx(Math.max(-maxReveal, Math.min(0, next)))
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="flex min-w-0 items-start gap-3 p-3">
          <div
            className={cn(
              "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full",
              tone === "rose" ? "bg-rose-100" : "bg-sky-100"
            )}
          >
            <IconGlyph className={cn("size-[18px]", tone === "rose" ? "text-rose-500" : "text-sky-600")} strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="min-w-0 flex-1 text-[length:var(--font-size-sm)] font-[var(--font-weight-semibold)] text-text">
                {item.title}
              </span>
              {badge ? (
                <span
                  className={cn(
                    "shrink-0 rounded px-1.5 py-0.5 text-[11px] font-[var(--font-weight-medium)] leading-tight",
                    badge.tone === "orange" ? "bg-orange-100 text-orange-700" : "bg-[var(--black-alpha-11)] text-text-secondary"
                  )}
                >
                  {badge.label}
                </span>
              ) : null}
            </div>
            <div className="mt-1.5 flex min-w-0 flex-wrap items-center gap-x-1 gap-y-0.5 text-[length:var(--font-size-xs)] text-text-secondary">
              <span className="shrink-0">{metaLead}</span>
              <span className="shrink-0">·</span>
              {(item.sourceScope ?? "company") === "personal" ? (
                <User className="size-3 shrink-0 opacity-70" strokeWidth={2} />
              ) : (
                <Building2 className="size-3 shrink-0 opacity-70" strokeWidth={2} />
              )}
              <span className="min-w-0 truncate">{source}</span>
              {assignee ? (
                <>
                  <span className="shrink-0">·</span>
                  <span className="shrink-0 text-text">{assignee}</span>
                </>
              ) : null}
            </div>
          </div>
          {canProcess ? (
            <Button
              type="button"
              size="sm"
              className="mt-0.5 h-8 shrink-0 rounded-full border-0 bg-primary px-4 text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-white hover:bg-primary/90"
              onClick={openDetail}
            >
              处理
            </Button>
          ) : showDetail ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-0.5 h-8 shrink-0 rounded-full px-3 text-[length:var(--font-size-xs)]"
              onClick={openDetail}
            >
              查看
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function filterMenuRow(
  active: boolean,
  onClick: () => void,
  children: React.ReactNode,
  className?: string
) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center px-3 py-2.5 text-left text-[length:var(--font-size-sm)] transition-colors hover:bg-[var(--black-alpha-11)]",
        active && "bg-[var(--black-alpha-11)] font-[var(--font-weight-medium)] text-text",
        !active && "text-text",
        className
      )}
    >
      {children}
    </button>
  )
}

export function TodoFullHubBlock({
  allItems,
  initialTab,
  onVvAction,
}: {
  allItems: VvTodoItem[]
  initialTab?: VvTodoHubTab
  onVvAction?: VvActionHandler
}) {
  const [tab, setTab] = React.useState<VvTodoHubTab>(() => initialTab ?? "all")
  const [query, setQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<StatusFilterKey>("all")
  const [sourceFilter, setSourceFilter] = React.useState<string | null>(null)
  const [sourceMenuQuery, setSourceMenuQuery] = React.useState("")
  const [statusOpen, setStatusOpen] = React.useState(false)
  const [sourceOpen, setSourceOpen] = React.useState(false)
  const [timeDesc, setTimeDesc] = React.useState(true)
  const [visible, setVisible] = React.useState(PAGE)

  React.useEffect(() => {
    setTab(initialTab ?? "all")
  }, [initialTab])

  const pendingCount = React.useMemo(() => allItems.filter((item) => canCurrentUserProcessTodo(item)).length, [allItems])

  const filtered = React.useMemo(() => {
    let base = todosForHubTab(allItems, tab)
    const q = query.trim()
    if (q) base = base.filter((item) => item.title.includes(q))
    if (statusFilter !== "all") base = base.filter((item) => matchesStatusFilter(item, statusFilter))
    if (sourceFilter) base = base.filter((item) => itemSourceCategory(item) === sourceFilter)
    return base
  }, [allItems, tab, query, statusFilter, sourceFilter])

  const sorted = React.useMemo(() => {
    const rows = [...filtered]
    rows.sort((a, b) => {
      const ra = timeRank(a)
      const rb = timeRank(b)
      const cmp = timeDesc ? rb - ra : ra - rb
      if (cmp !== 0) return cmp
      return a.id.localeCompare(b.id)
    })
    return rows
  }, [filtered, timeDesc])

  React.useEffect(() => {
    setVisible(PAGE)
  }, [tab, query, sorted.length, statusFilter, sourceFilter, timeDesc])

  const slice = sorted.slice(0, visible)
  const exhausted = visible >= sorted.length

  const onScroll = React.useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < LOAD_EDGE
      if (nearBottom && !exhausted) {
        setVisible((n) => Math.min(n + PAGE, sorted.length))
      }
    },
    [exhausted, sorted.length]
  )

  const statusTriggerLabel =
    statusFilter === "all" ? "状态" : STATUS_OPTIONS.find((o) => o.key === statusFilter)?.label ?? "状态"

  const sourceTriggerLabel = sourceFilter ?? "来源"

  const filteredCategories = React.useMemo(() => {
    const q = sourceMenuQuery.trim()
    if (!q) return [...SOURCE_CATEGORIES]
    return SOURCE_CATEGORIES.filter((c) => c.includes(q))
  }, [sourceMenuQuery])

  return (
    <div className={cn("overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg shadow-sm")}>
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="text-[length:var(--font-size-base)] font-[var(--font-weight-semibold)] text-text">全部待办</div>
      </div>
      <div className="flex gap-5 overflow-x-auto border-b border-border px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TODO_FULL_HUB_TABS.map((t) => {
          const active = tab === t.id
          const label = t.id === "pending" ? `待处理 ${pendingCount}` : t.label
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "relative shrink-0 pb-3 pt-1 text-[length:var(--font-size-sm)] transition-colors",
                active
                  ? "font-[var(--font-weight-semibold)] text-text"
                  : "font-[var(--font-weight-regular)] text-text-secondary hover:text-text"
              )}
            >
              {label}
              {active ? <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" /> : null}
            </button>
          )
        })}
      </div>
      <div className="flex flex-wrap items-center gap-3 border-b border-border bg-bg-secondary/40 px-3 py-2.5">
        <div className="relative min-w-[140px] max-w-[240px] flex-1 basis-[min(100%,200px)]">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-text-tertiary" strokeWidth={2} />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索标题"
            className="h-9 rounded-md border-border bg-bg pl-9 text-[length:var(--font-size-sm)]"
          />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Popover open={statusOpen} onOpenChange={setStatusOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "inline-flex h-8 items-center gap-0.5 text-[length:var(--font-size-sm)] transition-colors",
                  statusFilter === "all" ? "text-text-secondary hover:text-text" : "font-[var(--font-weight-medium)] text-primary"
                )}
              >
                {statusTriggerLabel}
                {statusOpen ? <ChevronUp className="size-4" strokeWidth={2} /> : <ChevronDown className="size-4" strokeWidth={2} />}
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-44 p-0 py-1 shadow-md" sideOffset={6}>
              {filterMenuRow(statusFilter === "all", () => {
                setStatusFilter("all")
                setStatusOpen(false)
              }, "不限")}
              {STATUS_OPTIONS.map((opt) => (
                <React.Fragment key={opt.key}>
                  {filterMenuRow(statusFilter === opt.key, () => {
                    setStatusFilter(opt.key)
                    setStatusOpen(false)
                  }, opt.label)}
                </React.Fragment>
              ))}
            </PopoverContent>
          </Popover>

          <Popover
            open={sourceOpen}
            onOpenChange={(o) => {
              setSourceOpen(o)
              if (!o) setSourceMenuQuery("")
            }}
          >
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "inline-flex h-8 items-center gap-0.5 text-[length:var(--font-size-sm)] transition-colors",
                  !sourceFilter ? "text-text-secondary hover:text-text" : "font-[var(--font-weight-medium)] text-primary"
                )}
              >
                {sourceTriggerLabel}
                {sourceOpen ? <ChevronUp className="size-4" strokeWidth={2} /> : <ChevronDown className="size-4" strokeWidth={2} />}
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-52 p-0 shadow-md" sideOffset={6}>
              <div className="border-b border-border p-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-text-tertiary" strokeWidth={2} />
                  <Input
                    value={sourceMenuQuery}
                    onChange={(e) => setSourceMenuQuery(e.target.value)}
                    placeholder="搜索"
                    className="h-8 border-border bg-bg pl-8 text-[length:var(--font-size-xs)]"
                  />
                </div>
              </div>
              <div className="max-h-56 overflow-y-auto py-1">
                {sourceFilter
                  ? filterMenuRow(false, () => {
                      setSourceFilter(null)
                      setSourceOpen(false)
                    }, "全部来源")
                  : null}
                {filteredCategories.length === 0 ? (
                  <p className="px-3 py-4 text-center text-[length:var(--font-size-xs)] text-text-tertiary">无匹配分类</p>
                ) : (
                  filteredCategories.map((cat) => (
                    <React.Fragment key={cat}>
                      {filterMenuRow(sourceFilter === cat, () => {
                        setSourceFilter(cat)
                        setSourceOpen(false)
                      }, cat)}
                    </React.Fragment>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>

          <button
            type="button"
            onClick={() => setTimeDesc((d) => !d)}
            className="inline-flex h-8 items-center gap-1 text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-primary"
            aria-label={timeDesc ? "按时间降序，点击切换升序" : "按时间升序，点击切换降序"}
          >
            时间
            <span className="flex flex-col items-center justify-center leading-[0.55]">
              <span
                className={cn(
                  "text-[9px] leading-none",
                  timeDesc ? "text-text-tertiary" : "text-primary"
                )}
                aria-hidden
              >
                ▲
              </span>
              <span
                className={cn(
                  "text-[9px] leading-none",
                  timeDesc ? "text-primary" : "text-text-tertiary"
                )}
                aria-hidden
              >
                ▼
              </span>
            </span>
          </button>
        </div>
      </div>
      <div
        onScroll={onScroll}
        className="max-h-[min(420px,52vh)] overflow-y-auto overscroll-contain px-3 py-3"
      >
        {sorted.length === 0 ? (
          <p className="py-8 text-center text-[length:var(--font-size-sm)] text-text-secondary">当前条件下暂无待办。</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {slice.map((item) => (
              <FullTodoSwipeRow key={item.id} item={item} onAction={onVvAction} />
            ))}
            {!exhausted ? (
              <p className="py-2 text-center text-[length:var(--font-size-xs)] text-text-tertiary">继续下滑加载更早待办…</p>
            ) : sorted.length > PAGE ? (
              <p className="py-2 text-center text-[length:var(--font-size-xs)] text-text-tertiary">已加载全部演示数据</p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
