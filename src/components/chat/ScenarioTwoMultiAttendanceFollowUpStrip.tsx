import * as React from "react"
import { DockCuiFollowUpStrip } from "./DockCuiFollowUpStrip"
import { ScenarioTwoMultiFollowUpGrid } from "./ScenarioTwoMultiFollowUpGrid"
import {
  ScenarioTwoMultiOrgPickControl,
  type ScenarioTwoMultiOrgPickLabelMode,
} from "./ScenarioTwoMultiOrgPickControl"

export type ScenarioTwoMultiAttendanceFollowUpOrg = { id: string; name: string }

export type { ScenarioTwoMultiOrgPickLabelMode }

type ScenarioTwoMultiAttendanceFollowUpStripProps = {
  prompts?: string[] | null
  sendTexts?: string[] | null
  organizations: ScenarioTwoMultiAttendanceFollowUpOrg[]
  currentOrgId: string
  onSendChip: (text: string) => void
  /** 与发送「还可以针对「{name}」查看考勤」或「…打开任务列表」一致 */
  onNavigateOtherOrgAttendance: (orgName: string) => void
  /** 右侧「另一组织」入口的文案模式 */
  orgPickLabelMode?: ScenarioTwoMultiOrgPickLabelMode
  /** 为 true 时不在底部展示组织切换（已合并到卡片顶栏《组织归属》条） */
  hideOrgSwitcher?: boolean
}

export function ScenarioTwoMultiAttendanceFollowUpStrip({
  prompts,
  sendTexts,
  organizations,
  currentOrgId,
  onSendChip,
  onNavigateOtherOrgAttendance,
  orgPickLabelMode,
  hideOrgSwitcher,
}: ScenarioTwoMultiAttendanceFollowUpStripProps) {
  const extras = Array.isArray(prompts) ? prompts : []
  const hasExtras = extras.length > 0
  const hasOthers = organizations.some((o) => o.id !== currentOrgId)
  const showBottomOrgSwitch = !hideOrgSwitcher && hasOthers

  if (!hasExtras && !showBottomOrgSwitch) return null

  const rightSlot = showBottomOrgSwitch ? (
    <ScenarioTwoMultiOrgPickControl
      organizations={organizations}
      currentOrgId={currentOrgId}
      onNavigateOtherOrgAttendance={onNavigateOtherOrgAttendance}
      orgPickLabelMode={orgPickLabelMode}
    />
  ) : null

  return (
    <ScenarioTwoMultiFollowUpGrid
      left={
        hasExtras ? (
          <DockCuiFollowUpStrip
            prompts={extras}
            sendTexts={sendTexts}
            onSend={onSendChip}
            className="min-w-0 justify-start"
          />
        ) : null
      }
      right={rightSlot}
    />
  )
}
