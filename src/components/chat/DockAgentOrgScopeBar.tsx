import type { ScenarioTwoMultiOrgPickLabelMode } from "./ScenarioTwoMultiOrgPickControl"
import { ScenarioTwoMultiOrgAttributionBarTrigger } from "./ScenarioTwoMultiOrgPickControl"

/**
 * 组织型应用会话中，AI 回复块上方标明所属组织。
 */
export function DockSessionOrgReplyBanner({ orgDisplayName }: { orgDisplayName: string }) {
  const name = orgDisplayName.trim()
  if (!name) return null
  return (
    <div
      className="mb-[var(--space-150)] w-full rounded-[var(--radius-sm)] border border-border bg-bg-secondary/90 px-[var(--space-200)] py-[var(--space-100)]"
      role="status"
    >
      <p className="m-0 text-[length:var(--font-size-xxs)] leading-[var(--line-height-sm)] text-text-secondary">
        <span className="font-[var(--font-weight-medium)] text-text">回复所属组织</span>
        <span className="text-text-tertiary"> · </span>
        <span className="text-text">{name}</span>
      </p>
      <p className="m-0 mt-[var(--space-50)] text-[length:var(--font-size-xxs)] leading-[var(--line-height-sm)] text-text-tertiary">
        以下助手内容基于该组织上下文呈现
      </p>
    </div>
  )
}

function sanitizeMainCuiCardOrgDisplayName(raw: string): string {
  let t = raw.trim()
  t = t.replace(/^内容归属\s*[·•．]\s*/u, "").trim()
  t = t.replace(/^内容归属\s*/u, "").trim()
  return t || raw.trim()
}

export type MainCuiCardOrgAttributionMultiSwitch = {
  organizations: { id: string; name: string }[]
  /** 当前对话所选主体，用于计算「可切换到哪些其它机构」 */
  conversationCurrentOrgId: string
  orgPickLabelMode: ScenarioTwoMultiOrgPickLabelMode
  onNavigateOtherOrg: (orgName: string) => void
}

/** 《主CUI交互》主 VVAI：组织型应用卡片上方，多主体时展示当前所属组织；场景二可在同条内切换其它机构 */
export function MainCuiCardOrgAttributionBanner({
  orgDisplayName,
  multiOrgSwitch,
}: {
  orgDisplayName: string
  multiOrgSwitch?: MainCuiCardOrgAttributionMultiSwitch
}) {
  const name = sanitizeMainCuiCardOrgDisplayName(orgDisplayName)
  if (!name) return null

  return (
    <div
      className="mb-[var(--space-150)] flex w-full min-w-0 items-center gap-[var(--space-150)] rounded-[var(--radius-sm)] border border-border/80 bg-gradient-to-r from-primary/8 via-bg-secondary/95 to-bg-secondary pl-[var(--space-100)] pr-[var(--space-200)] py-[var(--space-100)] shadow-sm"
      role="status"
    >
      <span
        className="h-7 w-[3px] shrink-0 rounded-full bg-primary/70"
        aria-hidden
      />
      {multiOrgSwitch ? (
        <ScenarioTwoMultiOrgAttributionBarTrigger
          cardOrgDisplayName={name}
          organizations={multiOrgSwitch.organizations}
          currentOrgId={multiOrgSwitch.conversationCurrentOrgId}
          onNavigateOtherOrgAttendance={multiOrgSwitch.onNavigateOtherOrg}
          orgPickLabelMode={multiOrgSwitch.orgPickLabelMode}
        />
      ) : (
        <p className="m-0 min-w-0 flex-1 truncate text-[length:var(--font-size-xxs)] leading-[var(--line-height-sm)] font-[var(--font-weight-medium)] text-text">
          {name}
        </p>
      )}
    </div>
  )
}
