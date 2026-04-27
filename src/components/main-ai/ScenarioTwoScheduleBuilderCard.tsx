import { GenericCard } from "./GenericCard"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { cn } from "../ui/utils"
import {
  SCENARIO_TWO_CLASS_OPTIONS,
  SCENARIO_TWO_COURSE_OPTIONS,
  SCENARIO_TWO_SEMESTER_OPTIONS,
  type ScenarioTwoScheduleBuilderPayload,
} from "./scenarioTwoScheduleBuilder"

type ScenarioTwoScheduleBuilderCardProps = {
  payload: ScenarioTwoScheduleBuilderPayload
  onPatch: (next: ScenarioTwoScheduleBuilderPayload) => void
  /** 发布后在「教育」dock 会话中追加一条与主 VVAI 同步的说明 */
  onMirrorPublish: (args: { userLine: string; assistantLine: string }) => void
}

function semesterLabel(id: string): string {
  return SCENARIO_TWO_SEMESTER_OPTIONS.find((o) => o.id === id)?.label ?? id
}

const selectClassName =
  "h-[var(--space-900)] w-full rounded-md border border-border bg-bg px-[var(--space-300)] py-[var(--space-200)] text-[length:var(--font-size-base)] text-text focus:border-ring focus:outline-none focus:ring-[2px] focus:ring-[var(--blue-alpha-3)]"

export function ScenarioTwoScheduleBuilderCard({
  payload,
  onPatch,
  onMirrorPublish,
}: ScenarioTwoScheduleBuilderCardProps) {
  const canRunConflict =
    Boolean(payload.semesterId) && Boolean(payload.classLabel) && payload.selectedCourses.length > 0
  const canPublish = payload.conflictChecked && !payload.published

  const toggleCourse = (name: string) => {
    const has = payload.selectedCourses.includes(name)
    onPatch({
      ...payload,
      selectedCourses: has
        ? payload.selectedCourses.filter((c) => c !== name)
        : [...payload.selectedCourses, name],
      conflictChecked: false,
      conflictSummary: "",
      published: false,
    })
  }

  const runConflict = () => {
    onPatch({
      ...payload,
      conflictChecked: true,
      conflictSummary:
        "未检测到教师、教室与节次的三方硬冲突；已预选 12 节课次。建议人工复核：周二第 4 节体育馆是否与其他年级共用。",
      published: false,
    })
  }

  const publish = () => {
    const sem = semesterLabel(payload.semesterId)
    const courses = payload.selectedCourses.join("、")
    onPatch({ ...payload, published: true })
    onMirrorPublish({
      userLine: "已在主 VVAI 排课工作台发布课表",
      assistantLine: `（与主 VVAI 同步）课表已向教务侧归档：${sem} · ${payload.classLabel} · 已排课程：${courses} · 状态：已发布（演示占位，接入系统后将写入真实课表）。`,
    })
  }

  return (
    <GenericCard title="排课工作台（演示）">
      <p className="m-0 text-[length:var(--font-size-sm)] leading-relaxed text-text-secondary">
        本卡片仅在主 VVAI 会话中展示完整排课流程；意图归属「教育」应用，相关指令与回复会同步到会话列表中的「教育」会话，无需离开当前窗口。
      </p>

      {payload.published ? (
        <div
          className="rounded-[var(--radius-md)] border border-border bg-bg-secondary px-[var(--space-300)] py-[var(--space-250)] text-[length:var(--font-size-sm)] text-text"
          role="status"
        >
          课表已发布。你可在左侧会话列表打开「教育」查看同步记录，或在本卡片继续微调后再次发布（演示将追加同步条）。
        </div>
      ) : null}

      <div className="flex w-full flex-col gap-[var(--space-350)]">
        <div className="grid w-full gap-[var(--space-250)] sm:grid-cols-2">
          <div className="flex flex-col gap-[var(--space-100)]">
            <Label className="text-[length:var(--font-size-xs)] text-text-secondary">学期</Label>
            <select
              className={selectClassName}
              value={payload.semesterId}
              aria-label="选择学期"
              onChange={(e) => {
                const semesterId = e.target.value
                onPatch({
                  ...payload,
                  semesterId,
                  conflictChecked: false,
                  conflictSummary: "",
                  published: false,
                })
              }}
            >
              {SCENARIO_TWO_SEMESTER_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-[var(--space-100)]">
            <Label className="text-[length:var(--font-size-xs)] text-text-secondary">年级 / 班级</Label>
            <select
              className={selectClassName}
              value={payload.classLabel}
              aria-label="选择班级"
              onChange={(e) => {
                const classLabel = e.target.value
                onPatch({
                  ...payload,
                  classLabel,
                  conflictChecked: false,
                  conflictSummary: "",
                  published: false,
                })
              }}
            >
              {SCENARIO_TWO_CLASS_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-[var(--space-150)]">
          <Label className="text-[length:var(--font-size-xs)] text-text-secondary">待排课程（可多选）</Label>
          <div className="flex flex-wrap gap-[var(--space-200)]">
            {SCENARIO_TWO_COURSE_OPTIONS.map((name) => {
              const on = payload.selectedCourses.includes(name)
              return (
                <label
                  key={name}
                  className={cn(
                    "flex cursor-pointer items-center gap-[var(--space-100)] rounded-[var(--radius-md)] border px-[var(--space-200)] py-[var(--space-100)] text-[length:var(--font-size-sm)] transition-colors",
                    on ? "border-primary bg-primary/10 text-text" : "border-border text-text-secondary"
                  )}
                >
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 accent-primary"
                    checked={on}
                    onChange={() => toggleCourse(name)}
                  />
                  {name}
                </label>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-[var(--space-150)] sm:flex-row sm:flex-wrap sm:items-center">
          <Button
            type="button"
            variant="outline"
            disabled={!canRunConflict || payload.published}
            onClick={runConflict}
          >
            运行冲突检测
          </Button>
          <Button type="button" variant="chat-submit" disabled={!canPublish} onClick={publish}>
            发布课表
          </Button>
        </div>

        {payload.conflictChecked && payload.conflictSummary ? (
          <div className="rounded-[var(--radius-md)] border border-border bg-bg-secondary p-[var(--space-250)]">
            <p className="m-0 text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-text-secondary">
              冲突检测结果
            </p>
            <p className="mt-[var(--space-100)] whitespace-pre-wrap text-[length:var(--font-size-sm)] leading-relaxed text-text">
              {payload.conflictSummary}
            </p>
          </div>
        ) : null}
      </div>
    </GenericCard>
  )
}
