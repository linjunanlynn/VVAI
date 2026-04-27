import React, { useMemo, useState } from "react"
import { Minus } from "lucide-react"
import { type AppItem } from "./MainAIChatWindow"
import { AppIcon } from "./AppIcon"
import { cn } from "../ui/utils"
import { getDockAppMeta } from "./organizationDockConfig"

interface AllAppsDrawerProps {
  apps: AppItem[]
  /** 当前上下文下可配置进条的应用 id 全集 */
  catalogAppIds: string[]
  isOpen: boolean
  onClose: () => void
  onReorder: (reorderedApps: AppItem[]) => void
  onRemoveFromDock: (appId: string) => void
  onAddToDock: (appId: string) => void
  /** 与 `getDockAppMeta` 一致，用于「可添加应用」列表文案 */
  scenario?: string | null
}

/** 与底部输入区左右留白一致，网格列宽固定便于图标与文案纵向对齐 */
const GRID_COL = "repeat(auto-fill, minmax(76px, 1fr))"

/**
 * 须放在与「应用条 + ChatSender」相同的 `position: relative` 容器内。
 * 抽屉左右与输入行同宽（相对《主CUI交互》主列，而非整个视口），避免与《主导航栏》错位。
 */
export function AllAppsDrawer({
  apps,
  catalogAppIds,
  isOpen,
  onClose,
  onReorder,
  onRemoveFromDock,
  onAddToDock,
  scenario,
}: AllAppsDrawerProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [longPressIndex, setLongPressIndex] = useState<number | null>(null)
  const longPressTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const addableIds = useMemo(
    () => catalogAppIds.filter((id) => !apps.some((a) => a.id === id)),
    [catalogAppIds, apps]
  )

  const canRemoveAny = apps.length > 1

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (longPressIndex !== index) {
      e.preventDefault()
      return
    }
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move"
      e.dataTransfer.setData("text/plain", index.toString())
    }
    setDraggedIndex(index)
  }

  const handleDragEnter = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return

    const newApps = [...apps]
    const draggedApp = newApps[draggedIndex]
    newApps.splice(draggedIndex, 1)
    newApps.splice(index, 0, draggedApp)

    const reorderedApps = newApps.map((app, i) => ({
      ...app,
      order: i + 1,
    }))

    onReorder(reorderedApps)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setLongPressIndex(null)
  }

  const startLongPress = (index: number) => {
    longPressTimerRef.current = setTimeout(() => {
      setLongPressIndex(index)
    }, 500)
  }

  const endLongPress = () => {
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current)
  }

  return (
    <>
      {/* 全屏点击关闭（遮罩相对视口，避免挡住抽屉内操作） */}
      <div
        className={cn(
          "fixed inset-0 z-[100] bg-transparent transition-opacity duration-300",
          isOpen ? "visible" : "invisible pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* 相对父级（应用条+输入区容器）水平铺满，与 ChatSender 整行左右对齐 */}
      <div
        className={cn(
          "pointer-events-none absolute left-0 right-0 z-[101] min-w-0 origin-bottom transition-all duration-[350ms] ease-out",
          "bottom-full mb-[var(--space-200)]",
          isOpen ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-2 scale-95 opacity-0"
        )}
      >
        <div
          className={cn(
            "flex w-full min-w-0 flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-bg-secondary shadow-[var(--shadow-md)]",
            isOpen ? "pointer-events-auto" : "pointer-events-none"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex shrink-0 items-center justify-between gap-[var(--space-300)] border-b border-border px-[var(--space-400)] py-[var(--space-300)]">
            <div className="flex min-w-0 flex-wrap items-center gap-x-[var(--space-300)] gap-y-[var(--space-100)]">
              <span className="text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] leading-normal text-text">
                全部应用
              </span>
              <span className="text-[length:var(--font-size-xs)] leading-normal text-text-muted whitespace-nowrap">
                长按拖拽排序；点 − 移除；下方可添加
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-[var(--space-500)] w-[var(--space-500)] shrink-0 items-center justify-center rounded-sm text-text-muted transition-colors hover:bg-[var(--black-alpha-11)] hover:text-text"
              aria-label="关闭"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M12 4L4 12M4 4L12 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="max-h-[min(50vh,420px)] min-h-0 overflow-x-hidden overflow-y-auto overscroll-contain px-[var(--space-400)] py-[var(--space-400)] scrollbar-hide">
            <p className="mb-[var(--space-200)] text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-text-secondary">
              底部应用条
            </p>
            <div
              className="mb-[var(--space-400)] grid w-full gap-x-[var(--space-200)] gap-y-[var(--space-400)]"
              style={{ gridTemplateColumns: GRID_COL }}
            >
              {apps.map((app, index) => (
                <div
                  key={app.id}
                  draggable={longPressIndex === index}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.dataTransfer.dropEffect = "move"
                  }}
                  onMouseDown={() => startLongPress(index)}
                  onMouseUp={endLongPress}
                  onMouseLeave={endLongPress}
                  onTouchStart={() => startLongPress(index)}
                  onTouchEnd={endLongPress}
                  className={cn(
                    "relative flex min-h-[92px] w-full min-w-0 flex-col items-center justify-start gap-[var(--space-150)] rounded-[var(--radius-md)] px-[var(--space-100)] py-[var(--space-200)] transition-all duration-300 ease-out select-none",
                    longPressIndex === index
                      ? "cursor-grab bg-[var(--black-alpha-11)] shadow-elevation-sm ring-1 ring-primary/10 active:cursor-grabbing"
                      : "cursor-pointer",
                    draggedIndex === index && "scale-95 opacity-30"
                  )}
                >
                  <button
                    type="button"
                    disabled={!canRemoveAny}
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveFromDock(app.id)
                    }}
                    className={cn(
                      "absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-bg text-text-muted transition-colors",
                      canRemoveAny
                        ? "hover:border-primary/30 hover:bg-[var(--black-alpha-11)] hover:text-text"
                        : "cursor-not-allowed opacity-40"
                    )}
                    title={canRemoveAny ? `从底部应用条移除「${app.name}」` : "至少保留一个应用"}
                    aria-label={canRemoveAny ? `从底部应用条移除${app.name}` : "至少保留一个应用"}
                  >
                    <Minus className="size-3" strokeWidth={2.5} aria-hidden />
                  </button>
                  <div className="relative size-9 shrink-0 overflow-hidden rounded-[var(--radius-sm)]">
                    <AppIcon imageSrc={app.icon.imageSrc} className="size-9" />
                  </div>
                  <p
                    className="line-clamp-2 min-h-[2.5rem] w-full max-w-full text-center text-[length:var(--font-size-xs)] leading-[1.25] text-text-secondary break-words [overflow-wrap:anywhere]"
                    title={app.name}
                  >
                    {app.name}
                  </p>
                </div>
              ))}
            </div>

            {addableIds.length > 0 ? (
              <>
                <p className="mb-[var(--space-200)] text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-text-secondary">
                  可添加应用
                </p>
                <div
                  className="grid w-full gap-x-[var(--space-200)] gap-y-[var(--space-400)]"
                  style={{ gridTemplateColumns: GRID_COL }}
                >
                  {addableIds.map((id) => {
                    const m = getDockAppMeta(id, scenario)
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => onAddToDock(id)}
                        className="flex min-h-[92px] w-full min-w-0 flex-col items-center justify-start gap-[var(--space-150)] rounded-[var(--radius-md)] px-[var(--space-100)] py-[var(--space-200)] transition-colors hover:bg-[var(--black-alpha-11)]"
                      >
                        <div className="relative size-9 shrink-0 overflow-hidden rounded-[var(--radius-sm)] border border-dashed border-border">
                          <AppIcon imageSrc={m.imageSrc} className="size-9" />
                        </div>
                        <p
                          className="line-clamp-2 min-h-[2.5rem] w-full max-w-full text-center text-[length:var(--font-size-xs)] leading-[1.25] text-text-secondary break-words [overflow-wrap:anywhere]"
                          title={m.name}
                        >
                          {m.name}
                        </p>
                        <span className="text-[length:var(--font-size-xs)] text-primary">点击添加</span>
                      </button>
                    )
                  })}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}
