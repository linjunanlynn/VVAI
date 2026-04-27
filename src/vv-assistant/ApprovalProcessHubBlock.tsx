import * as React from "react"
import { FileText } from "lucide-react"
import { cn } from "../components/ui/utils"
import { APPROVAL_PROCESS_HUB_SECTIONS } from "./approvalProcessHub"
import type { VvApprovalProcessHubSection, VvApprovalProcessHubTile } from "./types"

type VvActionHandler = (action: string, data?: unknown) => void

const TONE_RING: Record<VvApprovalProcessHubTile["tone"], string> = {
  orange: "bg-orange-500",
  blue: "bg-sky-500",
  navy: "bg-indigo-700",
  emerald: "bg-emerald-500",
  red: "bg-red-500",
  violet: "bg-violet-500",
  rose: "bg-rose-500",
}

export function ApprovalProcessHubBlock({
  sections = APPROVAL_PROCESS_HUB_SECTIONS,
  onVvAction,
}: {
  sections?: VvApprovalProcessHubSection[]
  onVvAction?: VvActionHandler
}) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg shadow-sm">
      <div className="border-b border-border px-4 py-3">
        <div className="text-[length:var(--font-size-base)] font-[var(--font-weight-semibold)] text-text">发起审批</div>
      </div>
      <div className="max-h-[min(480px,60vh)] space-y-5 overflow-y-auto overscroll-contain bg-bg-secondary/30 px-4 py-4">
        {sections.length === 0 ? (
          <p className="py-10 text-center text-[length:var(--font-size-sm)] text-text-secondary">暂无流程数据</p>
        ) : (
          sections.map((sec) => (
            <section key={sec.id}>
              <h3 className="mb-2.5 text-[length:var(--font-size-sm)] text-text-secondary">
                {sec.title}
                <span className="ml-1 text-text-tertiary">（{sec.items.length}）</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {sec.items.map((it) => (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => onVvAction?.("approval-process-pick", { label: it.label })}
                    className="flex min-h-[52px] items-center gap-2 rounded-lg border border-border bg-bg px-2.5 py-2 text-left shadow-xs transition-colors hover:border-primary/30 hover:bg-bg"
                  >
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full text-white shadow-sm",
                        TONE_RING[it.tone]
                      )}
                    >
                      <FileText className="size-4 opacity-95" strokeWidth={2} />
                    </span>
                    <span className="min-w-0 flex-1 text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] leading-snug text-text">
                      {it.label}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  )
}
