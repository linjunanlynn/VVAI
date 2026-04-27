/**
 * 《空间状态栏》：教育应用顶栏触发器；样式与 ChatNavBar 无组织「创建/加入组织」胶囊一致，文案为「创建/加入教育空间」。
 */
import * as React from "react"
import { Building2, ChevronDown, GraduationCap, Home } from "lucide-react"
import { cn } from "../ui/utils"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

/** 与 ChatNavBar 无组织「创建/加入组织」顶栏胶囊一致（白底、浅灰边、圆角、字重） */
const EDU_SPACE_STATUS_TRIGGER = cn(
  "h-[var(--space-800)]",
  "inline-flex max-w-[min(280px,44vw)] min-w-0 shrink-0 items-center gap-[6px] rounded-[var(--radius-md)] border border-border bg-bg px-[var(--space-200)]",
  "text-left text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-text transition-colors hover:bg-[var(--black-alpha-11)]",
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
)

export interface SessionListEduSpaceHeaderProps {
  onCreateInstitutional: () => void
  onCreateFamily: () => void
  onJoinSpace: () => void
  className?: string
  popoverAlign?: "start" | "center" | "end"
}

export function SessionListEduSpaceHeader({
  onCreateInstitutional,
  onCreateFamily,
  onJoinSpace,
  className,
  popoverAlign = "end",
}: SessionListEduSpaceHeaderProps) {
  const [open, setOpen] = React.useState(false)
  const close = () => setOpen(false)

  const rowBtn =
    "flex w-full cursor-pointer items-stretch gap-[var(--space-300)] border-0 border-b border-border bg-transparent p-[var(--space-350)] text-left transition-colors last:border-b-0 hover:bg-[var(--black-alpha-11)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(EDU_SPACE_STATUS_TRIGGER, className)}
          aria-expanded={open}
          aria-label={open ? "收起教育空间入口" : "创建或加入教育空间"}
        >
          <span className="min-w-0 flex-1 truncate">创建/加入教育空间</span>
          <ChevronDown
            className={cn(
              "h-[14px] w-[14px] shrink-0 text-text-tertiary transition-transform",
              open && "rotate-180"
            )}
            strokeWidth={2}
            aria-hidden
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align={popoverAlign}
        side="bottom"
        sideOffset={6}
        className="w-[min(320px,calc(100vw-2rem))] border-border p-0 shadow-md"
      >
        <div className="overflow-hidden rounded-[var(--radius-md)] border border-border bg-bg">
          <button
            type="button"
            className={rowBtn}
            onClick={() => {
              onCreateInstitutional()
              close()
            }}
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-border bg-bg-secondary">
              <Building2 className="size-[22px] text-text-secondary" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="m-0 text-[length:var(--font-size-sm)] font-[var(--font-weight-semi-bold)] text-text">
                创建机构教育空间
              </p>
              <p className="m-0 mt-[var(--space-100)] text-[length:var(--font-size-xs)] font-[var(--font-weight-regular)] leading-relaxed text-primary/90">
                适合教育机构、学校、培训组织
              </p>
            </div>
          </button>
          <button
            type="button"
            className={rowBtn}
            onClick={() => {
              onCreateFamily()
              close()
            }}
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-border bg-bg-secondary">
              <Home className="size-[22px] text-text-secondary" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="m-0 text-[length:var(--font-size-sm)] font-[var(--font-weight-semi-bold)] text-text">
                创建家庭教育空间
              </p>
              <p className="m-0 mt-[var(--space-100)] text-[length:var(--font-size-xs)] font-[var(--font-weight-regular)] leading-relaxed text-primary/90">
                适合学生、家长的个人学习场景
              </p>
            </div>
          </button>
          <button
            type="button"
            className={cn(rowBtn, "border-b-0")}
            onClick={() => {
              onJoinSpace()
              close()
            }}
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-border bg-bg-secondary">
              <GraduationCap className="size-[22px] text-text-secondary" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="m-0 text-[length:var(--font-size-sm)] font-[var(--font-weight-semi-bold)] text-text">
                加入教育空间
              </p>
              <p className="m-0 mt-[var(--space-100)] text-[length:var(--font-size-xs)] font-[var(--font-weight-regular)] leading-relaxed text-primary/90">
                使用邀请码加入已有空间
              </p>
            </div>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

/** 与会话列表顶栏槽位对齐（略加宽以容纳「创建/加入教育空间」） */
export const SESSION_LIST_EDU_SPACE_SLOT_CLASS = "w-[min(200px,46%)] shrink-0 max-w-full"
