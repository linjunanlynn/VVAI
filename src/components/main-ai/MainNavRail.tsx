import * as React from "react"
import {
  MessageCircle,
  LayoutGrid,
  User,
  GraduationCap,
  CheckSquare,
  MoreHorizontal,
  Settings,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { cn } from "../ui/utils"
import { Button } from "../ui/button"
import { Switch } from "../ui/switch"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet"
/** 与《主CUI交互》微微 AI 会话头像一致 */
import weiweiAiAvatar from "figma:asset/5b6944cca1f1ab3d84ca7f9d682db0a94d709b01.png"

/** 与截图一致：侧栏与图标色 */
const COL = {
  railBg: "#f2f3f5",
  railBorder: "#e8e8e8",
  icon: "#8c8c8c",
  label: "#8c8c8c",
  badge: "#ff4d4f",
  hover: "rgba(0,0,0,0.045)",
  active: "rgba(0,0,0,0.06)",
  accentBlue: "#3d7eff",
  accentBg: "#e8f1ff",
  trafficRed: "#ff5f57",
  trafficYellow: "#febc2e",
  trafficGreen: "#28c840",
} as const

const RAIL_W = 60
const ICON_TOP = 22
const ICON_BOTTOM = 18
const AVATAR = 32
const AI_SIZE = 40
const STROKE_TOP = 1.35
const STROKE_BOTTOM = 1.2

/** 《主导航栏》底部一级菜单项（工作台、教育、待办、日历、更多），顺序与显隐可持久化 */
const BOTTOM_MENU_IDS = ["workbench", "education", "todo", "calendar", "more"] as const
type BottomMenuId = (typeof BOTTOM_MENU_IDS)[number]

const BOTTOM_MENU_LABELS: Record<BottomMenuId, string> = {
  workbench: "工作台",
  education: "教育",
  todo: "待办",
  calendar: "日历",
  more: "更多",
}

const MAIN_NAV_BOTTOM_MENU_STORAGE_KEY = "mainNavRail.bottomMenu.v1"

interface BottomMenuConfig {
  order: BottomMenuId[]
  hidden: BottomMenuId[]
}

function isBottomMenuId(s: unknown): s is BottomMenuId {
  return typeof s === "string" && (BOTTOM_MENU_IDS as readonly string[]).includes(s)
}

function readBottomMenuConfig(): BottomMenuConfig {
  const fallback: BottomMenuConfig = { order: [...BOTTOM_MENU_IDS], hidden: [] }
  if (typeof window === "undefined") return fallback
  try {
    const raw = JSON.parse(localStorage.getItem(MAIN_NAV_BOTTOM_MENU_STORAGE_KEY) ?? "null")
    if (!raw || typeof raw !== "object") return fallback
    const orderIn = Array.isArray(raw.order) ? raw.order.filter(isBottomMenuId) : []
    const hiddenIn = Array.isArray(raw.hidden) ? raw.hidden.filter(isBottomMenuId) : []
    const orderedUnique = [...new Set(orderIn)]
    const missing = BOTTOM_MENU_IDS.filter((id) => !orderedUnique.includes(id))
    const order = [...orderedUnique, ...missing]
    if (order.length !== BOTTOM_MENU_IDS.length) return fallback
    const hidden = [...new Set(hiddenIn)]
    return { order, hidden }
  } catch {
    return fallback
  }
}

function writeBottomMenuConfig(c: BottomMenuConfig) {
  try {
    localStorage.setItem(
      MAIN_NAV_BOTTOM_MENU_STORAGE_KEY,
      JSON.stringify({ order: c.order, hidden: c.hidden })
    )
  } catch {
    /* ignore */
  }
}

export type MainNavRailTopTab = "messages" | "workbench" | "ai" | "contacts" | "me"
export type MainNavRailBottomTab = "education" | "todo" | "calendar" | "more"

interface MainNavRailProps {
  userAvatar: string
  userName?: string
  messageUnread?: number
  activeApp: string | null
  /** im=消息/会话视图；cui=《主CUI交互》 */
  mainView: "im" | "cui"
  onSelectMessages: () => void
  /** 《主AI入口》：进入《主CUI交互》主对话 */
  onSelectMainCui: () => void
  /** 通讯录等：需切换主内容区，否则仅高亮主导航易被认为「点了没反应」（尤其触控） */
  onSelectContacts?: () => void
  onSelectMe?: () => void
  onSelectWorkbench?: () => void
  onEducation: () => void
  onOpenAllApps: () => void
  onTodoQuick?: () => void
  onCalendarQuick?: () => void
  className?: string
}

function WindowTrafficLights() {
  return (
    <div className="flex w-full items-center justify-center pt-[12px] pb-[10px] shrink-0" style={{ gap: 7 }} aria-hidden>
      <span
        className="block rounded-full shrink-0"
        style={{ width: 12, height: 12, backgroundColor: COL.trafficRed }}
      />
      <span
        className="block rounded-full shrink-0"
        style={{ width: 12, height: 12, backgroundColor: COL.trafficYellow }}
      />
      <span
        className="block rounded-full shrink-0"
        style={{ width: 12, height: 12, backgroundColor: COL.trafficGreen }}
      />
    </div>
  )
}

/** 通讯录：人像轮廓 + 右侧三条横线（与截图一致） */
function ContactsRailIcon({ size = ICON_TOP }: { size?: number }) {
  const c = COL.icon
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="8.25" cy="9" r="3.1" stroke={c} strokeWidth={STROKE_TOP} />
      <path
        d="M3.75 19.25c0-2.35 1.85-4.1 4.5-4.1s4.5 1.75 4.5 4.1"
        stroke={c}
        strokeWidth={STROKE_TOP}
        strokeLinecap="round"
      />
      <line x1="14.75" y1="6.75" x2="20.25" y2="6.75" stroke={c} strokeWidth={STROKE_TOP} strokeLinecap="round" />
      <line x1="14.75" y1="11" x2="20.25" y2="11" stroke={c} strokeWidth={STROKE_TOP} strokeLinecap="round" />
      <line x1="14.75" y1="15.25" x2="20.25" y2="15.25" stroke={c} strokeWidth={STROKE_TOP} strokeLinecap="round" />
    </svg>
  )
}

/** 日历：方框 + 顶部分割线 + 内嵌日期 31（与截图一致） */
function CalendarRailIcon({ size = ICON_BOTTOM }: { size?: number }) {
  const c = COL.icon
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4.5" y="4.75" width="15" height="14.5" rx="1.75" stroke={c} strokeWidth={STROKE_BOTTOM} />
      <line x1="4.5" y1="9.35" x2="19.5" y2="9.35" stroke={c} strokeWidth={STROKE_BOTTOM} />
      <text
        x="12"
        y="16.85"
        textAnchor="middle"
        fill={c}
        style={{
          fontSize: 8,
          fontWeight: 600,
          fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        31
      </text>
    </svg>
  )
}

function RailItemWithLabel({
  label,
  active,
  accentActive,
  onClick,
  children,
  badge,
}: {
  label: string
  active?: boolean
  /** 选中时使用品牌蓝（消息 Tab 与截图一致） */
  accentActive?: boolean
  onClick?: () => void
  children: React.ReactNode
  badge?: number
}) {
  const bgBase = active ? (accentActive ? COL.accentBg : COL.active) : "transparent"
  const fg = active && accentActive ? COL.accentBlue : COL.icon
  const labelColor = active && accentActive ? COL.accentBlue : COL.label

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full min-h-[44px] touch-manipulation flex-col items-center border-none bg-transparent cursor-pointer rounded-[6px] transition-colors select-none",
        "py-[5px] px-0"
      )}
      style={{
        backgroundColor: bgBase,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = active
          ? accentActive
            ? COL.accentBg
            : COL.active
          : COL.hover
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = bgBase
      }}
    >
      <span
        className="relative flex items-center justify-center shrink-0 [&_svg]:stroke-current"
        style={{ width: 26, height: 26, color: fg }}
      >
        {children}
        {badge !== undefined && badge > 0 && (
          <span
            className="absolute flex items-center justify-center rounded-full text-white font-medium tabular-nums leading-none"
            style={{
              minWidth: 15,
              height: 15,
              paddingLeft: 3,
              paddingRight: 3,
              fontSize: 9,
              lineHeight: "15px",
              backgroundColor: COL.badge,
              top: -2,
              right: -5,
              boxSizing: "border-box",
            }}
          >
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </span>
      <span
        className="mt-[3px] w-full text-center font-normal truncate px-[2px]"
        style={{
          fontSize: 10,
          lineHeight: "12px",
          color: labelColor,
        }}
      >
        {label}
      </span>
    </button>
  )
}

function RailItemIconOnly({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean
  onClick?: () => void
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="flex min-h-11 min-w-11 touch-manipulation items-center justify-center border-none bg-transparent cursor-pointer rounded-[6px] transition-colors"
      style={{
        color: COL.icon,
        backgroundColor: active ? COL.active : "transparent",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = active ? COL.active : COL.hover
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = active ? COL.active : "transparent"
      }}
    >
      {children}
    </button>
  )
}

export function MainNavRail({
  userAvatar,
  userName = "我",
  messageUnread = 17,
  activeApp,
  mainView,
  onSelectMessages,
  onSelectMainCui,
  onSelectContacts,
  onSelectMe,
  onSelectWorkbench,
  onEducation,
  onOpenAllApps,
  onTodoQuick,
  onCalendarQuick,
  className,
}: MainNavRailProps) {
  const [topTab, setTopTab] = React.useState<MainNavRailTopTab>("ai")
  const [bottomTab, setBottomTab] = React.useState<MainNavRailBottomTab | null>(null)
  const [bottomMenuConfig, setBottomMenuConfig] = React.useState<BottomMenuConfig>(() => readBottomMenuConfig())
  const [bottomMenuSettingsOpen, setBottomMenuSettingsOpen] = React.useState(false)

  const updateBottomMenuConfig = React.useCallback((fn: (prev: BottomMenuConfig) => BottomMenuConfig) => {
    setBottomMenuConfig((prev) => {
      const next = fn(prev)
      writeBottomMenuConfig(next)
      return next
    })
  }, [])

  React.useEffect(() => {
    if (activeApp === "education") {
      setBottomTab("education")
    } else {
      setBottomTab(null)
    }
  }, [activeApp])

  const messagesImActive = mainView === "im"
  const aiCuiActive = mainView === "cui" && activeApp === null
  const educationSelected = bottomTab === "education" && activeApp === "education"

  const visibleBottomMenuIds = bottomMenuConfig.order.filter((id) => !bottomMenuConfig.hidden.includes(id))

  const lucideTop = {
    size: ICON_TOP,
    color: COL.icon,
    strokeWidth: STROKE_TOP,
    absoluteStrokeWidth: true,
  } as const

  const lucideBottom = {
    size: ICON_BOTTOM,
    color: COL.icon,
    strokeWidth: STROKE_BOTTOM,
    absoluteStrokeWidth: true,
  } as const

  return (
    <aside
      className={cn("flex h-full min-h-0 shrink-0 flex-col items-stretch", "z-[60]", className)}
      style={{
        width: RAIL_W,
        minWidth: RAIL_W,
        backgroundColor: COL.railBg,
        borderRight: `1px solid ${COL.railBorder}`,
      }}
      aria-label="主导航"
    >
      <WindowTrafficLights />

      <div className="flex flex-col items-center px-[6px] shrink-0" style={{ gap: 1 }}>
        <button
          type="button"
          className="mb-[6px] flex min-h-11 min-w-11 shrink-0 touch-manipulation items-center justify-center rounded-full border-none bg-transparent cursor-pointer p-0"
          style={{ marginTop: 2 }}
          title="个人资料"
          onClick={() => {
            setTopTab("me")
            onSelectMe?.()
          }}
        >
          <Avatar
            className="overflow-hidden rounded-full shrink-0"
            style={{
              width: AVATAR,
              height: AVATAR,
              border: `1px solid ${COL.railBorder}`,
            }}
          >
            <AvatarImage src={userAvatar} className="object-cover" />
            <AvatarFallback className="text-[11px]" style={{ color: COL.label }}>
              {userName.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
        </button>

        <RailItemWithLabel
          label="消息"
          active={messagesImActive}
          accentActive={messagesImActive}
          badge={messageUnread}
          onClick={() => {
            setTopTab("messages")
            onSelectMessages()
          }}
        >
          <MessageCircle size={ICON_TOP} strokeWidth={STROKE_TOP} absoluteStrokeWidth />
        </RailItemWithLabel>

        <button
          type="button"
          onClick={() => {
            setTopTab("ai")
            onSelectMainCui()
          }}
          title="《主AI入口》"
          className="flex w-full min-h-[44px] touch-manipulation flex-col items-center border-none bg-transparent cursor-pointer rounded-[8px] transition-colors py-[7px] px-0"
          style={{
            backgroundColor: aiCuiActive ? COL.accentBg : "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = aiCuiActive ? COL.accentBg : COL.hover
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = aiCuiActive ? COL.accentBg : "transparent"
          }}
        >
          <Avatar
            className="shrink-0 overflow-hidden rounded-full"
            style={{
              width: AI_SIZE,
              height: AI_SIZE,
              border: `1px solid ${COL.railBorder}`,
              boxShadow: "0 1px 3px rgba(22, 24, 30, 0.06)",
            }}
          >
            <AvatarImage src={weiweiAiAvatar} alt="" className="object-cover" />
            <AvatarFallback className="text-[13px]" style={{ color: COL.accentBlue }}>
              微
            </AvatarFallback>
          </Avatar>
        </button>

        <RailItemWithLabel
          label="通讯录"
          active={topTab === "contacts"}
          onClick={() => {
            setTopTab("contacts")
            onSelectContacts?.()
          }}
        >
          <ContactsRailIcon />
        </RailItemWithLabel>

        <RailItemWithLabel
          label="我的"
          active={topTab === "me"}
          onClick={() => {
            setTopTab("me")
            onSelectMe?.()
          }}
        >
          <User {...lucideTop} />
        </RailItemWithLabel>
      </div>

      <div className="min-h-[8px] flex-1" />

      <div
        className="flex flex-col items-center shrink-0 pb-[14px] pt-[4px] px-[6px]"
        style={{ gap: 2 }}
      >
        {visibleBottomMenuIds.map((id) => (
          <React.Fragment key={id}>
            {id === "workbench" && (
              <RailItemIconOnly
                title="工作台"
                active={topTab === "workbench"}
                onClick={() => {
                  setTopTab("workbench")
                  onSelectWorkbench?.()
                }}
              >
                <LayoutGrid {...lucideBottom} />
              </RailItemIconOnly>
            )}
            {id === "education" && (
              <RailItemIconOnly
                title="教育"
                active={educationSelected}
                onClick={() => {
                  setTopTab("ai")
                  onEducation()
                }}
              >
                <GraduationCap {...lucideBottom} />
              </RailItemIconOnly>
            )}
            {id === "todo" && (
              <RailItemIconOnly
                title="待办"
                active={bottomTab === "todo"}
                onClick={() => {
                  setBottomTab("todo")
                  onTodoQuick?.()
                }}
              >
                <CheckSquare {...lucideBottom} />
              </RailItemIconOnly>
            )}
            {id === "calendar" && (
              <RailItemIconOnly
                title="日历"
                active={bottomTab === "calendar"}
                onClick={() => {
                  setBottomTab("calendar")
                  onCalendarQuick?.()
                }}
              >
                <CalendarRailIcon />
              </RailItemIconOnly>
            )}
            {id === "more" && (
              <RailItemIconOnly
                title="更多"
                active={bottomTab === "more"}
                onClick={() => {
                  setBottomTab("more")
                  onOpenAllApps()
                }}
              >
                <MoreHorizontal {...lucideBottom} />
              </RailItemIconOnly>
            )}
          </React.Fragment>
        ))}
        <div className="mt-[6px] w-full border-t shrink-0" style={{ borderColor: COL.railBorder }} />
        <RailItemIconOnly
          title="设置"
          active={bottomMenuSettingsOpen}
          onClick={() => setBottomMenuSettingsOpen(true)}
        >
          <Settings {...lucideBottom} />
        </RailItemIconOnly>
      </div>

      <Sheet open={bottomMenuSettingsOpen} onOpenChange={setBottomMenuSettingsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>底部菜单</SheetTitle>
            <SheetDescription>
              调整《主导航栏》底部一级图标的顺序与显示；隐藏的项将从侧栏移除，可随时在此恢复。
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-0 px-4 pb-6">
            {bottomMenuConfig.order.map((id, index) => {
              const visible = !bottomMenuConfig.hidden.includes(id)
              return (
                <div
                  key={id}
                  className="flex items-center gap-2 border-b py-3 first:pt-0"
                  style={{ borderColor: COL.railBorder }}
                >
                  <span className="min-w-0 flex-1 text-sm font-medium text-foreground truncate">
                    {BOTTOM_MENU_LABELS[id]}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">显示</span>
                  <Switch
                    checked={visible}
                    onCheckedChange={(on) => {
                      updateBottomMenuConfig((prev) => {
                        const hidden = on
                          ? prev.hidden.filter((x) => x !== id)
                          : prev.hidden.includes(id)
                            ? prev.hidden
                            : [...prev.hidden, id]
                        return { ...prev, hidden }
                      })
                    }}
                  />
                  <div className="flex shrink-0 flex-col gap-0.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      disabled={index === 0}
                      aria-label={`将「${BOTTOM_MENU_LABELS[id]}」上移`}
                      onClick={() => {
                        updateBottomMenuConfig((prev) => {
                          const order = [...prev.order]
                          const i = order.indexOf(id)
                          if (i <= 0) return prev
                          ;[order[i - 1], order[i]] = [order[i], order[i - 1]]
                          return { ...prev, order }
                        })
                      }}
                    >
                      <ChevronUp className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      disabled={index >= bottomMenuConfig.order.length - 1}
                      aria-label={`将「${BOTTOM_MENU_LABELS[id]}」下移`}
                      onClick={() => {
                        updateBottomMenuConfig((prev) => {
                          const order = [...prev.order]
                          const i = order.indexOf(id)
                          if (i < 0 || i >= order.length - 1) return prev
                          ;[order[i + 1], order[i]] = [order[i], order[i + 1]]
                          return { ...prev, order }
                        })
                      }}
                    >
                      <ChevronDown className="size-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </SheetContent>
      </Sheet>
    </aside>
  )
}
