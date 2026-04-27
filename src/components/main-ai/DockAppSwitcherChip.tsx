import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "../ui/utils"
import { AppIcon } from "./AppIcon"
import type { AppItem } from "./MainAIChatWindow"
import { getDockAppMeta } from "./organizationDockConfig"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

interface DockAppSwitcherChipProps {
  currentAppId: string
  apps: AppItem[]
  onSwitchApp: (app: AppItem) => void
  /** 与 `getDockAppMeta` 对齐：`personal_edu_space` 在条上与列表中均展示为「教育」 */
  scenario?: string | null
}

const DOCK_SHELL_SELECTOR = "[data-cui-dock-shell]"

function measureDockShell(triggerEl: HTMLElement | null): {
  width: number
  alignOffset: number
} | null {
  if (!triggerEl) return null
  const shell = triggerEl.closest(DOCK_SHELL_SELECTOR)
  if (!(shell instanceof HTMLElement)) return null
  const sr = shell.getBoundingClientRect()
  const br = triggerEl.getBoundingClientRect()
  return {
    width: Math.max(0, Math.round(sr.width)),
    alignOffset: Math.round(sr.left - br.left),
  }
}

/**
 * 《底部应用条》进入应用二级条后：当前应用入口与切换面板。
 * 面板与 `[data-cui-dock-shell]` 同宽对齐；横向列表带 scroll-snap，打开时自动滚至当前应用。
 */
export function DockAppSwitcherChip({
  currentAppId,
  apps,
  onSwitchApp,
  scenario,
}: DockAppSwitcherChipProps) {
  const currentFromList = apps.find((a) => a.id === currentAppId)
  const metaFallback = React.useMemo(
    () => getDockAppMeta(currentAppId, scenario),
    [currentAppId, scenario]
  )
  /** 当前应用不在 `apps` 条数据里时（如首屏直入门户会话），与其它应用一致展示名称与图标 */
  const displayApp: Pick<AppItem, "id" | "name" | "icon"> = currentFromList ?? {
    id: currentAppId,
    name: metaFallback.name,
    icon: { imageSrc: metaFallback.imageSrc, iconType: currentAppId },
  }
  const [menuOpen, setMenuOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const railRef = React.useRef<HTMLDivElement>(null)
  const [shellLayout, setShellLayout] = React.useState<{
    width: number
    alignOffset: number
  } | null>(null)

  const syncShellLayout = React.useCallback(() => {
    setShellLayout(measureDockShell(triggerRef.current))
  }, [])

  React.useLayoutEffect(() => {
    const btn = triggerRef.current
    if (!btn) return
    const shell = btn.closest(DOCK_SHELL_SELECTOR)
    if (!(shell instanceof HTMLElement)) return

    const ro = new ResizeObserver(() => {
      syncShellLayout()
    })
    ro.observe(shell)
    syncShellLayout()
    return () => ro.disconnect()
  }, [syncShellLayout])

  React.useLayoutEffect(() => {
    if (!menuOpen) return
    syncShellLayout()
    window.addEventListener("resize", syncShellLayout)
    return () => window.removeEventListener("resize", syncShellLayout)
  }, [menuOpen, syncShellLayout])

  /** 打开时把当前应用滚入可视区，避免落在裁切边缘 */
  React.useLayoutEffect(() => {
    if (!menuOpen || !railRef.current) return
    const tile = railRef.current.querySelector(`[data-dock-app-id="${CSS.escape(currentAppId)}"]`)
    if (tile instanceof HTMLElement) {
      requestAnimationFrame(() => {
        tile.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" })
      })
    }
  }, [menuOpen, currentAppId, apps.length])

  const handleOpenChange = (open: boolean) => {
    setMenuOpen(open)
    if (open) {
      requestAnimationFrame(() => syncShellLayout())
    }
  }

  const panelStyle =
    shellLayout && shellLayout.width > 0
      ? ({
          width: shellLayout.width,
          maxWidth: shellLayout.width,
          minWidth: Math.min(280, shellLayout.width),
        } satisfies React.CSSProperties)
      : undefined

  const showScrollHint = apps.length > 6

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          title={`当前：${displayApp.name}`}
          className={cn(
            "group flex h-[var(--space-800)] shrink-0 items-center gap-[6px] rounded-[10px] border border-transparent bg-bg pl-[10px] pr-[10px]",
            "text-text outline-none transition-[transform,box-shadow,background-color,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] select-none",
            "hover:border-border/80 hover:bg-[var(--black-alpha-08)]",
            "focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
            menuOpen &&
              "border-border/70 bg-[var(--black-alpha-09)] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
          )}
        >
          <span className="relative flex size-[18px] shrink-0 items-center justify-center rounded-lg bg-[var(--black-alpha-06)] ring-1 ring-border/30 transition-transform duration-200 group-data-[state=open]:scale-105">
            <AppIcon imageSrc={displayApp.icon.imageSrc} className="size-[15px]" />
          </span>
          <span className="max-w-[76px] truncate text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] leading-none text-text">
            {displayApp.name}
          </span>
          <ChevronDown
            className={cn(
              "size-[13px] shrink-0 text-text-tertiary/90 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
              menuOpen && "-rotate-180"
            )}
            strokeWidth={2}
            aria-hidden
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        align="start"
        alignOffset={shellLayout?.alignOffset ?? 0}
        sideOffset={8}
        collisionPadding={12}
        style={panelStyle}
        className={cn(
          "z-[110] overflow-hidden rounded-2xl border border-border/50 p-0 shadow-none",
          "bg-bg/92 backdrop-blur-xl backdrop-saturate-150",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=open]:slide-in-from-bottom-2 data-[state=closed]:slide-out-to-bottom-1",
          "data-[state=open]:zoom-in-[0.99] data-[state=closed]:zoom-out-[0.99]",
          "duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "ring-1 ring-black/[0.04] dark:ring-white/[0.06]",
          "[box-shadow:0_-12px_48px_-16px_rgba(15,18,28,0.18),0_0_0_1px_rgba(15,18,28,0.04)]",
          !panelStyle &&
            "min-w-[280px] w-[min(1200px,calc(100vw-6.75rem))] max-w-[min(1200px,calc(100vw-6.75rem))]"
        )}
      >
        <div className="relative px-3 pt-3 pb-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="m-0 text-[length:var(--font-size-xxs)] font-[var(--font-weight-medium)] uppercase tracking-[0.06em] text-text-tertiary/80">
              切换应用
            </p>
            {showScrollHint ? (
              <p className="m-0 shrink-0 text-[length:var(--font-size-xxs)] text-text-tertiary/55">侧滑浏览</p>
            ) : null}
          </div>
          {/* 列表左右弱渐变，提示可横滑 */}
          {showScrollHint ? (
            <>
              <div
                className="pointer-events-none absolute bottom-0 left-0 top-8 z-[1] w-5 bg-gradient-to-r from-bg/95 to-transparent"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute bottom-0 right-0 top-8 z-[1] w-5 bg-gradient-to-l from-bg/95 to-transparent"
                aria-hidden
              />
            </>
          ) : null}
        </div>

        <DropdownMenuGroup className="m-0 block p-0">
          <div
            ref={railRef}
            className={cn(
              "flex max-w-full flex-nowrap gap-1 overflow-x-auto overflow-y-hidden px-2 pb-3 pt-1",
              "scroll-smooth overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              "snap-x snap-proximity"
            )}
          >
          {apps.map((app) => {
            const isActive = app.id === currentAppId
            return (
              <DropdownMenuItem
                key={app.id}
                data-dock-app-id={app.id}
                onSelect={() => {
                  if (!isActive) onSwitchApp(app)
                }}
                className={cn(
                  "group/item snap-start !flex h-auto w-[56px] shrink-0 cursor-pointer flex-col items-center justify-start gap-1 rounded-xl py-2 pl-1 pr-1 outline-none",
                  "transition-[transform,background-color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  "focus:bg-transparent data-[highlighted]:bg-[var(--black-alpha-10)]",
                  "hover:bg-[var(--black-alpha-08)] hover:scale-[1.04] active:scale-[0.97]",
                  isActive && "bg-primary/[0.07] data-[highlighted]:bg-primary/[0.09] hover:bg-primary/[0.09]"
                )}
                aria-current={isActive ? "true" : undefined}
              >
                <span
                  className={cn(
                    "relative flex size-10 shrink-0 items-center justify-center rounded-[11px] transition-[box-shadow,transform] duration-200",
                    "bg-[var(--black-alpha-06)] ring-1 ring-border/35",
                    isActive
                      ? "ring-primary/35 shadow-[0_2px_12px_-4px_rgba(59,130,246,0.45)] dark:shadow-[0_2px_14px_-4px_rgba(96,165,250,0.35)]"
                      : "group-hover/item:shadow-sm group-data-[highlighted]/item:shadow-sm"
                  )}
                >
                  <AppIcon imageSrc={app.icon.imageSrc} className="size-[22px]" />
                </span>
                <span
                  className={cn(
                    "line-clamp-2 w-full min-h-[26px] max-w-[56px] text-center text-[length:var(--font-size-xxs)] leading-[var(--line-height-3xs)] transition-colors duration-200",
                    isActive ? "font-[var(--font-weight-medium)] text-primary" : "text-text-secondary"
                  )}
                >
                  {app.name}
                </span>
                <span
                  className={cn(
                    "h-[3px] w-[3px] shrink-0 rounded-full transition-all duration-200",
                    isActive ? "scale-100 bg-primary opacity-100" : "scale-0 bg-primary opacity-0"
                  )}
                  aria-hidden
                />
              </DropdownMenuItem>
            )
          })}
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
