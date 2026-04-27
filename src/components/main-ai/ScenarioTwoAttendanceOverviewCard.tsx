import {
  SCENARIO_TWO_ATTENDANCE_MONTH_OPTIONS,
  type ScenarioTwoAttendanceOverviewPayload,
} from "./scenarioTwoAttendanceOverview"
import {
  AttendanceStatisticsSnapshotCard,
  formatAttendanceMonthTitle,
} from "./AttendanceStatisticsSnapshotCard"

type ScenarioTwoAttendanceOverviewCardProps = {
  payload: ScenarioTwoAttendanceOverviewPayload
  onPatch: (next: ScenarioTwoAttendanceOverviewPayload) => void
}

function shiftMonthId(current: string, delta: -1 | 1): string {
  const ids = SCENARIO_TWO_ATTENDANCE_MONTH_OPTIONS.map((o) => o.id)
  const i = ids.indexOf(current)
  const base = i >= 0 ? i : 0
  const next = Math.min(ids.length - 1, Math.max(0, base + delta))
  return ids[next] ?? current
}

export function ScenarioTwoAttendanceOverviewCard({
  payload,
  onPatch,
}: ScenarioTwoAttendanceOverviewCardProps) {
  return (
    <div className="relative flex w-full flex-col items-start gap-[var(--space-250)] rounded-[var(--radius-card)] bg-bg p-[var(--space-350)] shadow-elevation-sm">
      {payload.archived ? (
        <div
          className="rounded-[var(--radius-md)] border border-border bg-bg-secondary px-[var(--space-300)] py-[var(--space-250)] text-[length:var(--font-size-sm)] text-text"
          role="status"
        >
          月度汇总已归档。可在左侧会话列表打开「考勤」查看同步记录。
        </div>
      ) : null}

      <AttendanceStatisticsSnapshotCard
        monthTitle={formatAttendanceMonthTitle(payload.monthId)}
        onMonthNavigate={
          payload.archived
            ? undefined
            : (delta) => {
                onPatch({
                  ...payload,
                  monthId: shiftMonthId(payload.monthId, delta),
                  archived: false,
                })
              }
        }
      />
    </div>
  )
}
