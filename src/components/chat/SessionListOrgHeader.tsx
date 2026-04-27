/**
 * 《组织状态》：侧栏顶栏栅格固定列宽内展示；触发条小号常规字重，文案与 Chevron 在槽内右对齐（text-end + justify-end）。
 */
import * as React from "react"
import { Check, ChevronDown, GripVertical } from "lucide-react"
import { cn } from "../ui/utils"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

/** 顶栏槽内弱样式：小字、不加粗 */
const ORG_TRIGGER_TEXT =
  "text-[length:var(--font-size-xs)] font-[var(--font-weight-regular)] leading-[var(--line-height-sm)] text-text-tertiary"

export type SessionListOrgItem = {
  id: string
  name: string
  icon?: string
  memberCount?: number
}

/** 下拉面板内：说明当前这条会话实际对应的交互组织主体 */
export type SessionListInteractionContext = {
  caption: string
  orgName: string
  hint?: string
}

function SessionListOrgActionPills({
  onCreateOrg,
  onJoinOrg,
  onAfterAction,
}: {
  onCreateOrg?: () => void
  onJoinOrg?: () => void
  onAfterAction: () => void
}) {
  if (!onCreateOrg && !onJoinOrg) return null
  return (
    <div className="flex gap-[var(--space-100)]">
      {onCreateOrg ? (
        <button
          type="button"
          className={cn(
            "min-h-[36px] min-w-0 flex-1 rounded-full border border-primary/55 bg-bg px-[var(--space-200)]",
            "text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-primary",
            "transition-colors hover:border-primary hover:bg-[var(--blue-alpha-11)]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
          onClick={() => {
            onCreateOrg()
            onAfterAction()
          }}
        >
          创建
        </button>
      ) : null}
      {onJoinOrg ? (
        <button
          type="button"
          className={cn(
            "min-h-[36px] min-w-0 flex-1 rounded-full border border-primary/55 bg-bg px-[var(--space-200)]",
            "text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-primary",
            "transition-colors hover:border-primary hover:bg-[var(--blue-alpha-11)]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
          onClick={() => {
            onJoinOrg()
            onAfterAction()
          }}
        >
          加入
        </button>
      ) : null}
    </div>
  )
}

interface SessionListOrgHeaderProps {
  organizations: SessionListOrgItem[]
  currentOrgId: string
  onSelectOrg: (orgId: string) => void
  onCreateOrg?: () => void
  onJoinOrg?: () => void
  /** 展开下拉时展示：当前对话（主对话 / 应用会话）所对应的交互主体 */
  interactionContext?: SessionListInteractionContext | null
  className?: string
  popoverContentClassName?: string
  /** 顶栏右侧槽位内对齐 Popover 锚点 */
  popoverAlign?: "start" | "end"
}

export function SessionListOrgHeader({
  organizations,
  currentOrgId,
  onSelectOrg,
  onCreateOrg,
  onJoinOrg,
  interactionContext,
  className,
  popoverContentClassName,
  popoverAlign = "end",
}: SessionListOrgHeaderProps) {
  const [open, setOpen] = React.useState(false)
  const current = organizations.find((o) => o.id === currentOrgId)
  const inOrganization = Boolean(current)
  const orderedOrgs = inOrganization
    ? [
        ...(current ? [current] : []),
        ...organizations.filter((o) => o.id !== currentOrgId),
      ]
    : []

  const close = () => setOpen(false)

  /** 槽内文案与 Chevron 作为一组靠右（栅格单元内右对齐） */
  const triggerBase =
    "flex min-h-[var(--space-800)] w-full min-w-0 max-w-full items-center justify-end gap-[var(--space-100)] rounded-[var(--radius-sm)] px-0 py-0 text-end transition-colors hover:bg-[var(--black-alpha-11)] hover:text-text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {inOrganization && current ? (
          <button
            type="button"
            className={cn(triggerBase, ORG_TRIGGER_TEXT, className)}
            aria-label={`${current.name}，${open ? "收起" : "切换主体"}`}
          >
            <span className="min-w-0 max-w-full flex-1 truncate text-end text-text-secondary">{current.name}</span>
            <ChevronDown
              className={cn(
                "h-3 w-3 shrink-0 text-text-tertiary opacity-60 transition-transform",
                open && "rotate-180"
              )}
              strokeWidth={2}
              aria-hidden
            />
          </button>
        ) : (
          <button
            type="button"
            className={cn(triggerBase, ORG_TRIGGER_TEXT, className)}
            aria-label="创建或加入组织"
          >
            <span className="min-w-0 max-w-full flex-1 truncate text-end">创建/加入组织</span>
            <ChevronDown
              className={cn(
                "h-3 w-3 shrink-0 text-text-tertiary opacity-60 transition-transform",
                open && "rotate-180"
              )}
              strokeWidth={2}
              aria-hidden
            />
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent
        align={popoverAlign}
        side="bottom"
        sideOffset={6}
        className={cn(
          "w-[min(280px,calc(100vw-2rem))] border-border p-0 shadow-md",
          popoverContentClassName
        )}
      >
        <div className="overflow-hidden rounded-[var(--radius-md)] border border-border bg-bg">
          {inOrganization && current ? (
            <>
              <div className="px-[var(--space-250)] pt-[var(--space-250)] pb-[var(--space-100)]">
                <p className="m-0 text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-text-tertiary">
                  选择主体
                </p>
              </div>
              {interactionContext ? (
                <div
                  className="mx-[var(--space-200)] mb-[var(--space-150)] rounded-[var(--radius-md)] border border-border bg-bg-secondary px-[var(--space-250)] py-[var(--space-200)]"
                  role="status"
                >
                  <p className="m-0 text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-text-tertiary">
                    {interactionContext.caption}
                  </p>
                  <p className="m-0 mt-[var(--space-100)] truncate text-[length:var(--font-size-sm)] font-[var(--font-weight-semi-bold)] text-text">
                    {interactionContext.orgName}
                  </p>
                  {interactionContext.hint ? (
                    <p className="m-0 mt-[var(--space-100)] text-[length:var(--font-size-xxs)] font-[var(--font-weight-regular)] leading-normal text-text-tertiary">
                      {interactionContext.hint}
                    </p>
                  ) : null}
                </div>
              ) : null}
              <div className="max-h-[min(220px,40vh)] overflow-y-auto border-t border-border">
                {orderedOrgs.map((org) => {
                  const selected = org.id === currentOrgId
                  return (
                    <button
                      key={org.id}
                      type="button"
                      onClick={() => {
                        onSelectOrg(org.id)
                        close()
                      }}
                      className={cn(
                        "flex w-full items-center gap-[var(--space-150)] border-none bg-transparent px-[var(--space-250)] py-[var(--space-200)] text-left transition-colors hover:bg-[var(--black-alpha-11)]",
                        selected ? "text-primary" : "text-text"
                      )}
                    >
                      <GripVertical className="h-4 w-4 shrink-0 text-text-tertiary" aria-hidden />
                      {selected ? (
                        <Check className="h-4 w-4 shrink-0 text-primary" strokeWidth={2.5} aria-hidden />
                      ) : org.icon ? (
                        <img
                          src={org.icon}
                          alt=""
                          className="h-7 w-7 shrink-0 rounded-full border border-border object-cover"
                        />
                      ) : (
                        <span
                          className="h-7 w-7 shrink-0 rounded-full border border-border bg-bg-secondary"
                          aria-hidden
                        />
                      )}
                      <span
                        className={cn(
                          "min-w-0 flex-1 truncate text-[length:var(--font-size-sm)]",
                          selected ? "font-[var(--font-weight-medium)]" : "font-[var(--font-weight-regular)]"
                        )}
                      >
                        {org.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="px-[var(--space-250)] pt-[var(--space-250)] pb-[var(--space-200)]">
              <p className="m-0 text-[length:var(--font-size-xs)] font-[var(--font-weight-regular)] leading-[var(--line-height-sm)] text-text-secondary">
                创建或加入组织后，即可在组织内使用 AI 协作。
              </p>
              <p className="m-0 mt-[var(--space-150)] text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-text-tertiary">
                暂无组织
              </p>
            </div>
          )}

          {onCreateOrg || onJoinOrg ? (
            <div className="border-t border-border px-[var(--space-250)] py-[var(--space-250)]">
              <SessionListOrgActionPills
                onCreateOrg={onCreateOrg}
                onJoinOrg={onJoinOrg}
                onAfterAction={close}
              />
            </div>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  )
}

/** 侧栏顶栏《组织状态》槽位宽度（与标题同行） */
export const SESSION_LIST_ORG_SLOT_CLASS = "w-[132px] shrink-0"
