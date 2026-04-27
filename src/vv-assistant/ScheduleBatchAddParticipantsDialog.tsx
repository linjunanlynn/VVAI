"use client"

import * as React from "react"
import { Building2, Search, User, Users, X } from "lucide-react"
import { Avatar, AvatarFallback } from "../components/ui/avatar"
import { Button } from "../components/ui/button"
import { Checkbox } from "../components/ui/checkbox"
import { Dialog, DialogContent, DialogTitle } from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { cn } from "../components/ui/utils"

const pickerSearchFieldClass =
  "h-9 w-full min-w-0 rounded-[var(--radius-md)] border border-border bg-bg px-2.5 text-[length:var(--font-size-sm)] text-text placeholder:text-text-secondary shadow-none outline-none focus-visible:ring-2 focus-visible:ring-ring/30"

/** 与新建日程「批量添加参与人」一致：居中宽屏弹窗 */
export const SCHEDULE_PARTICIPANT_PICKER_DIALOG_CONTENT_CLASS =
  "z-[240] flex h-[min(90dvh,640px)] max-h-[min(90dvh,640px)] w-[min(96vw,920px)] max-w-[min(96vw,calc(100vw-24px))] flex-col gap-0 overflow-hidden rounded-[var(--radius-xl)] border border-border bg-bg p-0 shadow-[0px_12px_48px_rgba(22,24,30,0.14)]"

const BATCH_PICKER_CONTACTS: { id: string; name: string; tag?: string }[] = [
  { id: "p1", name: "陈廷凯" },
  { id: "p2", name: "林俊安" },
  { id: "p3", name: "贾曙光" },
  { id: "p4", name: "吴倚慧" },
  { id: "p5", name: "祝力", tag: "主管" },
  { id: "p6", name: "黄琪雯" },
]

function attendeeInitials(name: string) {
  const t = name.slice(0, 2)
  return t || "?"
}

export function ScheduleBatchAddParticipantsDialog({
  open,
  onOpenChange,
  initialNames,
  onConfirm,
  overlayClassName,
  contentClassName,
}: {
  open: boolean
  onOpenChange: (next: boolean) => void
  initialNames: string[]
  onConfirm: (names: string[]) => void
  /** 嵌套在其它 Dialog 上时提高蒙层层级并加深遮罩 */
  overlayClassName?: string
  /** 追加到内容容器 className */
  contentClassName?: string
}) {
  const [q, setQ] = React.useState("")
  const [subTab, setSubTab] = React.useState<"contacts" | "groups">("contacts")
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())

  React.useEffect(() => {
    if (!open) return
    setQ("")
    setSubTab("contacts")
    const next = new Set<string>()
    for (const c of BATCH_PICKER_CONTACTS) {
      if (initialNames.includes(c.name)) next.add(c.id)
    }
    setSelectedIds(next)
  }, [open, initialNames])

  const filtered = BATCH_PICKER_CONTACTS.filter((c) => !q.trim() || c.name.includes(q.trim()))

  const toggle = (id: string) => {
    setSelectedIds((prev) => {
      const n = new Set(prev)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  }

  const selectedList = BATCH_PICKER_CONTACTS.filter((c) => selectedIds.has(c.id))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName={overlayClassName}
        showCloseButton={false}
        className={cn(SCHEDULE_PARTICIPANT_PICKER_DIALOG_CONTENT_CLASS, contentClassName)}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3 md:px-5">
          <DialogTitle className="text-[length:var(--font-size-md)] font-[var(--font-weight-semibold)] text-text">
            添加参与人
          </DialogTitle>
          <button
            type="button"
            className="flex size-9 shrink-0 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-[var(--black-alpha-11)] hover:text-text"
            aria-label="关闭"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-[18px]" strokeWidth={2} />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col border-border md:border-r md:pr-0">
            <div className="shrink-0 px-3 py-2 md:px-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-text-tertiary" strokeWidth={2} />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="请选择"
                  className={cn(pickerSearchFieldClass, "h-9 pl-9")}
                />
              </div>
            </div>
            <div className="flex shrink-0 gap-2 border-b border-border px-3 py-2 text-[length:var(--font-size-xs)] text-text-secondary md:px-4">
              <button type="button" className="flex flex-1 flex-col items-center gap-1 rounded-md py-2 hover:bg-[var(--black-alpha-11)]">
                <Building2 className="size-5 text-text-secondary" strokeWidth={2} />
                <span>组织架构</span>
              </button>
              <button type="button" className="flex flex-1 flex-col items-center gap-1 rounded-md py-2 hover:bg-[var(--black-alpha-11)]">
                <Users className="size-5 text-text-secondary" strokeWidth={2} />
                <span>我的群组</span>
              </button>
              <button type="button" className="flex flex-1 flex-col items-center gap-1 rounded-md py-2 hover:bg-[var(--black-alpha-11)]">
                <User className="size-5 text-text-secondary" strokeWidth={2} />
                <span>我的好友</span>
              </button>
            </div>
            <div className="flex shrink-0 gap-4 border-b border-border px-4 py-2 text-[length:var(--font-size-sm)]">
              <button
                type="button"
                className={cn(
                  "pb-2",
                  subTab === "contacts"
                    ? "border-b-2 border-primary font-[var(--font-weight-semibold)] text-text"
                    : "text-text-secondary"
                )}
                onClick={() => setSubTab("contacts")}
              >
                最近联系人
              </button>
              <button
                type="button"
                className={cn(
                  "pb-2",
                  subTab === "groups"
                    ? "border-b-2 border-primary font-[var(--font-weight-semibold)] text-text"
                    : "text-text-secondary"
                )}
                onClick={() => setSubTab("groups")}
              >
                最近群聊
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2 md:px-3">
              {subTab === "groups" ? (
                <p className="px-2 py-8 text-center text-[length:var(--font-size-sm)] text-text-secondary">暂无最近群聊</p>
              ) : (
                <ul className="space-y-0.5">
                  {filtered.map((c) => (
                    <li key={c.id}>
                      <label className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2.5 hover:bg-[var(--black-alpha-11)]">
                        <Checkbox
                          checked={selectedIds.has(c.id)}
                          onCheckedChange={() => toggle(c.id)}
                          className="shrink-0"
                        />
                        <Avatar className="size-9 shrink-0 rounded-full">
                          <AvatarFallback className="size-9 rounded-full bg-[var(--blue-alpha-11)] text-xs font-medium text-primary">
                            {attendeeInitials(c.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="min-w-0 flex-1 text-[length:var(--font-size-sm)] text-text">{c.name}</span>
                        {c.tag ? (
                          <span className="shrink-0 rounded bg-[#ffecd9] px-1.5 py-0.5 text-[10px] font-medium text-[#b45309]">
                            {c.tag}
                          </span>
                        ) : null}
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex min-h-[200px] min-w-0 shrink-0 flex-col border-t border-border bg-bg-secondary/50 md:w-[min(100%,320px)] md:border-l md:border-t-0">
            <div className="shrink-0 border-b border-border px-4 py-3 text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text">
              已选：{selectedList.length} 人
            </div>
            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
              {selectedList.length === 0 ? (
                <p className="py-6 text-center text-[length:var(--font-size-xs)] text-text-secondary">在左侧勾选参与人</p>
              ) : (
                selectedList.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-2 rounded-lg border border-border bg-bg px-2 py-2 shadow-xs"
                  >
                    <Avatar className="size-8 shrink-0 rounded-full">
                      <AvatarFallback className="size-8 rounded-full bg-[var(--blue-alpha-11)] text-[10px] font-medium text-primary">
                        {attendeeInitials(c.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="min-w-0 flex-1 truncate text-[length:var(--font-size-sm)]">{c.name}</span>
                    <button
                      type="button"
                      className="shrink-0 rounded p-1 text-text-secondary hover:bg-[var(--black-alpha-11)]"
                      aria-label={`移除 ${c.name}`}
                      onClick={() => toggle(c.id)}
                    >
                      <X className="size-4" strokeWidth={2} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 justify-end gap-2 border-t border-border px-4 py-3 md:px-5">
          <Button type="button" variant="outline" className="h-9 min-w-[88px] rounded-md" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            type="button"
            variant="primary"
            className="h-9 min-w-[88px] rounded-md"
            onClick={() => {
              onConfirm(selectedList.map((x) => x.name))
              onOpenChange(false)
            }}
          >
            确定
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
