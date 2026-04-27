import * as React from "react"
import { GenericCard } from "./GenericCard"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { Progress } from "../ui/progress"
import { cn } from "../ui/utils"
import type { TaskRow } from "./scenarioDemoTaskAppData"
import { getTaskRowsForFilter } from "./scenarioDemoTaskAppData"
import { TaskListRowActions } from "./task-detail/taskListRowActions"

/** 与 yzhao-workspace `TaskAppCards` 中 `TaskManagementTableCard` 同构（场景二主会话内嵌演示）。 */
export function ScenarioTaskManagementTableCard({
  rows: rowsProp,
  filterHint,
  onRowClick,
  viewedTaskIds,
}: {
  rows?: TaskRow[]
  filterHint?: string
  onRowClick?: (row: TaskRow) => void
  viewedTaskIds?: ReadonlySet<string>
}) {
  const rows = rowsProp ?? getTaskRowsForFilter(filterHint)

  return (
    <GenericCard title="任务管理">
      {filterHint ? (
        <p className="text-[length:var(--font-size-xs)] text-text-secondary mb-[var(--space-300)]">{filterHint}</p>
      ) : null}
      <div className="w-full overflow-x-auto rounded-[var(--radius-md)] border border-border bg-bg-secondary">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-[length:var(--font-size-xs)] text-text-secondary font-[var(--font-weight-medium)] h-9 px-[var(--space-300)]">
                名称
              </TableHead>
              <TableHead className="text-[length:var(--font-size-xs)] text-text-secondary font-[var(--font-weight-medium)] h-9 px-[var(--space-300)]">
                执行人
              </TableHead>
              <TableHead className="text-[length:var(--font-size-xs)] text-text-secondary font-[var(--font-weight-medium)] h-9 px-[var(--space-300)]">
                负责人
              </TableHead>
              <TableHead className="text-[length:var(--font-size-xs)] text-text-secondary font-[var(--font-weight-medium)] h-9 px-[var(--space-300)]">
                状态
              </TableHead>
              <TableHead className="text-[length:var(--font-size-xs)] text-text-secondary font-[var(--font-weight-medium)] h-9 px-[var(--space-300)] min-w-[120px]">
                实际进度
              </TableHead>
              <TableHead className="text-[length:var(--font-size-xs)] text-text-secondary font-[var(--font-weight-medium)] h-9 px-[var(--space-300)]">
                截止时间
              </TableHead>
              <TableHead className="text-[length:var(--font-size-xs)] text-text-secondary font-[var(--font-weight-medium)] h-9 px-[var(--space-300)]">
                风险
              </TableHead>
              <TableHead className="text-[length:var(--font-size-xs)] text-text-secondary font-[var(--font-weight-medium)] h-9 px-[var(--space-300)] w-[1%] text-right whitespace-nowrap">
                操作
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r, i) => (
              <TableRow
                key={r.id || i}
                role={onRowClick ? "button" : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onClick={() => onRowClick?.(r)}
                onKeyDown={(e) => {
                  if (!onRowClick) return
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    onRowClick(r)
                  }
                }}
                className={cn(
                  "border-border hover:bg-[var(--black-alpha-11)]",
                  onRowClick && "cursor-pointer"
                )}
              >
                <TableCell
                  className={cn(
                    "text-[length:var(--font-size-xs)] px-[var(--space-300)] py-[var(--space-250)] max-w-[200px]",
                    viewedTaskIds?.has(r.id) ? "text-text-tertiary" : "text-text"
                  )}
                >
                  {r.name}
                </TableCell>
                <TableCell className="text-[length:var(--font-size-xs)] text-text px-[var(--space-300)]">
                  {r.assignee}
                </TableCell>
                <TableCell className="text-[length:var(--font-size-xs)] text-text px-[var(--space-300)]">
                  {r.owner}
                </TableCell>
                <TableCell className="px-[var(--space-300)]">
                  <span
                    className={cn(
                      "inline-flex rounded-[var(--radius-100)] px-[var(--space-200)] py-[var(--space-50)] text-[length:var(--font-size-xs)]",
                      r.status === "进行中"
                        ? "bg-primary/15 text-primary"
                        : "bg-bg-tertiary text-text-secondary"
                    )}
                  >
                    {r.status}
                  </span>
                </TableCell>
                <TableCell className="px-[var(--space-300)]">
                  <div className="flex items-center gap-[var(--space-200)] min-w-[100px]">
                    <Progress value={r.progress} className="h-[6px] flex-1" />
                    <span className="text-[length:var(--font-size-xs)] text-text-secondary tabular-nums shrink-0">
                      {r.progress}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-[length:var(--font-size-xs)] text-text px-[var(--space-300)] whitespace-nowrap">
                  {r.due}
                </TableCell>
                <TableCell className="px-[var(--space-300)]">
                  <span
                    className={cn(
                      "text-[length:var(--font-size-xs)]",
                      r.risk === "有风险" ? "text-warning" : "text-text-secondary"
                    )}
                  >
                    {r.risk}
                  </span>
                </TableCell>
                <TableCell className="text-[length:var(--font-size-xs)] text-text px-[var(--space-300)] py-[var(--space-250)] text-right align-middle">
                  <TaskListRowActions />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </GenericCard>
  )
}
