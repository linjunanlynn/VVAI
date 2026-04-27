import * as React from "react"
import { ArrowUpDown, ChevronDown, Loader2, MoreHorizontal, Plus, SlidersHorizontal, UserCog, UserPlus } from "lucide-react"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { cn } from "../ui/utils"
import {
  AddTeacherInviteDialog,
  INVITE_RECORDS_UPDATE_MS,
  methodToInviteTag,
  formatInviteRecordTime,
  TeacherInviteRecordCard,
  type InviteMethod,
  type TeacherInviteRecordModel,
} from "./EducationTeacherManagementPanel"

type EmployeeRowModel = {
  id: string
  displayName: string
  employeeNo: string
  categoryLabel: string
  statusLabel: string
  gender: string
  entryDate: string
  positionTitle: string
  positionBadge?: string
  jobLevel: string
  orgUnit: string
  adminCompany: string
}

const EMPLOYEE_INVITE_SOURCE = "员工"

/** 与 MainAIChatWindow 顶栏组织 id 对齐（personal / xiaoce / default / test / org-*） */
function employeeDemoRowsForOrganization(orgId: string | undefined): EmployeeRowModel[] {
  const id = orgId?.trim() || "default"

  if (id === "personal") {
    return [
      {
        id: "e1",
        displayName: "本人账号",
        employeeNo: "VV900001",
        categoryLabel: "全职员工",
        statusLabel: "在职",
        gender: "男",
        entryDate: "2026-03-01",
        positionTitle: "个人事务",
        jobLevel: "—",
        orgUnit: "个人",
        adminCompany: "个人空间",
      },
      {
        id: "e2",
        displayName: "协作者A",
        employeeNo: "VV900014",
        categoryLabel: "外部协作",
        statusLabel: "在职",
        gender: "女",
        entryDate: "2025-11-18",
        positionTitle: "项目协同",
        jobLevel: "P3",
        orgUnit: "共享日历",
        adminCompany: "个人空间",
      },
    ]
  }

  if (id === "xiaoce") {
    return [
      {
        id: "e1",
        displayName: "林教研",
        employeeNo: "VV200008",
        categoryLabel: "全职员工",
        statusLabel: "试用中",
        gender: "男",
        entryDate: "2026-01-22",
        positionTitle: "学科带头人",
        positionBadge: "骨干",
        jobLevel: "—",
        orgUnit: "名师教研中心",
        adminCompany: "名师教育演示主体",
      },
      {
        id: "e2",
        displayName: "周讲师",
        employeeNo: "VV200021",
        categoryLabel: "兼职讲师",
        statusLabel: "在职",
        gender: "女",
        entryDate: "2025-08-01",
        positionTitle: "大班主讲",
        jobLevel: "P5",
        orgUnit: "教学部",
        adminCompany: "名师教育演示主体",
      },
    ]
  }

  if (id === "test") {
    return [
      {
        id: "e1",
        displayName: "孙运营",
        employeeNo: "VV300003",
        categoryLabel: "全职员工",
        statusLabel: "在职",
        gender: "男",
        entryDate: "2026-02-10",
        positionTitle: "增长运营",
        positionBadge: "主管",
        jobLevel: "M1",
        orgUnit: "创新业务组",
        adminCompany: "未来教育演示主体",
      },
      {
        id: "e2",
        displayName: "钱顾问",
        employeeNo: "VV300018",
        categoryLabel: "兼职讲师",
        statusLabel: "在职",
        gender: "女",
        entryDate: "2025-09-15",
        positionTitle: "课程顾问",
        jobLevel: "P4",
        orgUnit: "学员服务",
        adminCompany: "未来教育演示主体",
      },
    ]
  }

  if (id.startsWith("org-")) {
    return [
      {
        id: "e1",
        displayName: "新组织成员甲",
        employeeNo: "VV800101",
        categoryLabel: "全职员工",
        statusLabel: "试用中",
        gender: "男",
        entryDate: "2026-04-01",
        positionTitle: "筹备组",
        jobLevel: "—",
        orgUnit: "筹建中",
        adminCompany: "新建组织演示主体",
      },
      {
        id: "e2",
        displayName: "新组织成员乙",
        employeeNo: "VV800118",
        categoryLabel: "兼职讲师",
        statusLabel: "在职",
        gender: "女",
        entryDate: "2025-12-20",
        positionTitle: "试点讲师",
        jobLevel: "P3",
        orgUnit: "试点组",
        adminCompany: "新建组织演示主体",
      },
    ]
  }

  // default — 卓越教育
  return [
    {
      id: "e1",
      displayName: "王教务",
      employeeNo: "VV100002",
      categoryLabel: "全职员工",
      statusLabel: "试用中",
      gender: "男",
      entryDate: "2026-01-22",
      positionTitle: "测试1",
      positionBadge: "主管",
      jobLevel: "—",
      orgUnit: "教务处",
      adminCompany: "卓越教育演示主体",
    },
    {
      id: "e2",
      displayName: "赵老师",
      employeeNo: "VV100015",
      categoryLabel: "兼职讲师",
      statusLabel: "在职",
      gender: "女",
      entryDate: "2025-08-01",
      positionTitle: "教学岗",
      jobLevel: "P5",
      orgUnit: "教研组",
      adminCompany: "卓越教育演示主体",
    },
  ]
}

function inviteDemoContextForOrganization(orgId: string | undefined): { inviter: string; orgName: string } {
  const id = orgId?.trim() || "default"
  if (id === "personal") return { inviter: "本人", orgName: "个人空间" }
  if (id === "xiaoce") return { inviter: "林教研", orgName: "名师教育演示主体" }
  if (id === "test") return { inviter: "孙运营", orgName: "未来教育演示主体" }
  if (id.startsWith("org-")) return { inviter: "组织管理员", orgName: "新建组织演示主体" }
  return { inviter: "王教务", orgName: "卓越教育演示主体" }
}

function TableHeaderSortFilter({
  label,
  sort,
  filter,
}: {
  label: string
  /** 表头排序箭头（演示） */
  sort?: boolean
  /** 表头筛选箭头（演示） */
  filter?: boolean
}) {
  return (
    <span className="inline-flex items-center gap-1">
      <span>{label}</span>
      {sort ? <ArrowUpDown className="size-3 shrink-0 text-text-tertiary" strokeWidth={2} aria-hidden /> : null}
      {filter ? <ChevronDown className="size-3 shrink-0 text-text-tertiary" strokeWidth={2} aria-hidden /> : null}
    </span>
  )
}

function RowActionIcon({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex size-7 items-center justify-center rounded-full border border-border bg-bg text-text-secondary transition-colors hover:bg-[var(--black-alpha-11)] hover:text-text"
    >
      {children}
    </button>
  )
}

/** 员工二级应用：员工管理列表 + 与老师管理一致的邀请弹窗（CUI 5.3） */
export function EmployeeManagementPanel({
  className,
  organizationId,
  inviteRecords,
  onInviteRecordsChange,
}: {
  className?: string
  /** 当前组织 id（与顶栏一致），用于切换演示员工姓名与行政公司 */
  organizationId?: string
  /** 最近邀请记录：由外层按「会话 + 组织」持久化，避免切换聊天记录后丢失 */
  inviteRecords: TeacherInviteRecordModel[]
  onInviteRecordsChange: React.Dispatch<React.SetStateAction<TeacherInviteRecordModel[]>>
}) {
  const [inviteOpen, setInviteOpen] = React.useState(false)
  const [inviteRecordsUpdating, setInviteRecordsUpdating] = React.useState(false)
  const inviteUpdateTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const demoEmployees = React.useMemo(() => employeeDemoRowsForOrganization(organizationId), [organizationId])
  const inviteDemoContext = React.useMemo(
    () => inviteDemoContextForOrganization(organizationId),
    [organizationId]
  )

  React.useEffect(() => {
    return () => {
      if (inviteUpdateTimerRef.current) clearTimeout(inviteUpdateTimerRef.current)
    }
  }, [])

  const handleInviteSuccess = React.useCallback(
    (payload: { method: InviteMethod; displayName: string }) => {
      if (inviteUpdateTimerRef.current) {
        clearTimeout(inviteUpdateTimerRef.current)
        inviteUpdateTimerRef.current = null
      }
      setInviteRecordsUpdating(true)
      const orgName = inviteDemoContext.orgName
      const inviter = inviteDemoContext.inviter
      inviteUpdateTimerRef.current = setTimeout(() => {
        const now = new Date()
        const id = `emp-inv-${now.getTime()}`
        const avatarFallback = payload.displayName.slice(0, 1) || "?"
        onInviteRecordsChange((prev) =>
          [
            {
              id,
              displayName: payload.displayName,
              methodTag: methodToInviteTag(payload.method),
              orgName,
              status: "pending",
              inviter,
              inviteTime: formatInviteRecordTime(now),
              source: EMPLOYEE_INVITE_SOURCE,
              avatarFallback,
            },
            ...prev,
          ].slice(0, 20)
        )
        setInviteRecordsUpdating(false)
        inviteUpdateTimerRef.current = null
      }, INVITE_RECORDS_UPDATE_MS)
    },
    [inviteDemoContext.inviter, inviteDemoContext.orgName, onInviteRecordsChange]
  )

  return (
    <>
      <div
        className={cn(
          "w-full max-w-[min(100%,960px)] overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg shadow-xs",
          className
        )}
      >
        <div className="flex items-center justify-between border-b border-border bg-[#eef2f7] px-4 py-3">
          <h2 className="text-[length:var(--font-size-base)] font-[var(--font-weight-semi-bold)] text-text">
            员工管理
          </h2>
          <button
            type="button"
            className="inline-flex size-8 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-[var(--black-alpha-11)] hover:text-text"
            aria-label="列设置"
          >
            <SlidersHorizontal className="size-4" strokeWidth={2} />
          </button>
        </div>

        <div className="p-[var(--space-300)] sm:p-[var(--space-400)]">
          <div className="overflow-x-auto rounded-[var(--radius-md)] border border-border">
            <table className="w-full min-w-[800px] border-collapse text-left text-[length:var(--font-size-xs)]">
              <thead>
                <tr className="border-b border-border bg-[var(--black-alpha-11)] text-text-secondary">
                  <th className="w-10 px-2 py-2.5 text-center font-[var(--font-weight-medium)]">
                    <Checkbox aria-label="全选" className="inline-flex" />
                  </th>
                  <th className="min-w-[120px] px-2 py-2.5 font-[var(--font-weight-medium)]">姓名/工号</th>
                  <th className="min-w-[48px] px-2 py-2.5 font-[var(--font-weight-medium)]">性别</th>
                  <th className="min-w-[72px] px-2 py-2.5 font-[var(--font-weight-medium)]">类别</th>
                  <th className="min-w-[64px] px-2 py-2.5 font-[var(--font-weight-medium)]">状态</th>
                  <th className="min-w-[96px] px-2 py-2.5 font-[var(--font-weight-medium)]">
                    <TableHeaderSortFilter label="入职日期" sort />
                  </th>
                  <th className="min-w-[100px] px-2 py-2.5 font-[var(--font-weight-medium)]">
                    <TableHeaderSortFilter label="岗位" filter />
                  </th>
                  <th className="min-w-[100px] px-2 py-2.5 font-[var(--font-weight-medium)]">
                    <TableHeaderSortFilter label="职位职级" sort filter />
                  </th>
                  <th className="min-w-[72px] px-2 py-2.5 font-[var(--font-weight-medium)]">
                    <TableHeaderSortFilter label="组织机构" filter />
                  </th>
                  <th className="min-w-[120px] px-2 py-2.5 font-[var(--font-weight-medium)]">
                    <TableHeaderSortFilter label="行政公司" filter />
                  </th>
                  <th className="min-w-[120px] px-2 py-2.5 text-center font-[var(--font-weight-medium)]">操作</th>
                </tr>
              </thead>
              <tbody className="text-text">
                {demoEmployees.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-b-0">
                    <td className="px-2 py-2.5 text-center align-middle">
                      <Checkbox aria-label={`选择 ${row.displayName}`} className="inline-flex" />
                    </td>
                    <td className="px-2 py-2.5 align-middle">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-[var(--font-weight-medium)] text-text">{row.displayName}</span>
                        <span className="text-[length:var(--font-size-xs)] text-text-secondary">{row.employeeNo}</span>
                      </div>
                    </td>
                    <td className="px-2 py-2.5 align-middle">{row.gender}</td>
                    <td className="px-2 py-2.5 align-middle">{row.categoryLabel}</td>
                    <td className="px-2 py-2.5 align-middle">
                      <span className="inline-flex rounded-full bg-[var(--blue-alpha-11)] px-2 py-0.5 text-[10px] font-[var(--font-weight-medium)] text-primary">
                        {row.statusLabel}
                      </span>
                    </td>
                    <td className="px-2 py-2.5 align-middle tabular-nums">{row.entryDate}</td>
                    <td className="px-2 py-2.5 align-middle">
                      <span className="inline-flex flex-wrap items-center gap-1">
                        <span>{row.positionTitle}</span>
                        {row.positionBadge ? (
                          <span className="inline-flex shrink-0 rounded bg-[#ffecd9] px-1.5 py-0.5 text-[10px] font-[var(--font-weight-medium)] text-[#b45309]">
                            {row.positionBadge}
                          </span>
                        ) : null}
                      </span>
                    </td>
                    <td className="px-2 py-2.5 align-middle text-text-secondary">{row.jobLevel}</td>
                    <td className="px-2 py-2.5 align-middle">{row.orgUnit}</td>
                    <td className="max-w-[160px] px-2 py-2.5 align-middle">
                      <span className="line-clamp-2">{row.adminCompany}</span>
                    </td>
                    <td className="px-2 py-2.5 align-middle">
                      <div className="flex items-center justify-end gap-1.5">
                        <RowActionIcon label="人事加人">
                          <UserPlus className="size-3.5" strokeWidth={2} />
                        </RowActionIcon>
                        <RowActionIcon label="员工设置">
                          <UserCog className="size-3.5" strokeWidth={2} />
                        </RowActionIcon>
                        <RowActionIcon label="更多">
                          <MoreHorizontal className="size-3.5" strokeWidth={2} />
                        </RowActionIcon>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Button
            type="button"
            variant="secondary"
            className="mt-4 flex h-auto w-full min-h-11 items-center justify-center gap-2 rounded-[var(--radius-lg)] py-2.5"
            onClick={() => setInviteOpen(true)}
          >
            <span className="flex size-6 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Plus className="size-3.5" strokeWidth={2.5} />
            </span>
            添加员工
          </Button>

          <div className="mt-4 space-y-2 border-t border-border pt-4">
            <p className="text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-text-secondary">
              最近邀请记录
            </p>
            <div className="relative min-h-[88px]">
              {inviteRecords.length > 0 ? (
                <div
                  className={cn(
                    "space-y-2 transition-opacity duration-150",
                    inviteRecordsUpdating && "pointer-events-none opacity-45"
                  )}
                >
                  {inviteRecords.map((r) => (
                    <TeacherInviteRecordCard key={r.id} record={r} />
                  ))}
                </div>
              ) : !inviteRecordsUpdating ? (
                <p className="rounded-[var(--radius-md)] border border-dashed border-border bg-[var(--black-alpha-11)] px-3 py-2.5 text-[length:var(--font-size-xs)] text-text-tertiary">
                  确认邀请后将在此展示记录
                </p>
              ) : null}

              {inviteRecordsUpdating ? (
                <div
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 rounded-[var(--radius-md)] border border-dashed border-border bg-[var(--black-alpha-11)] py-8",
                    inviteRecords.length > 0 &&
                      "absolute inset-0 z-[1] min-h-full bg-bg/85 py-6 backdrop-blur-[2px]"
                  )}
                  role="status"
                  aria-live="polite"
                >
                  <Loader2 className="size-5 shrink-0 animate-spin text-primary" strokeWidth={2} aria-hidden />
                  <p className="text-[length:var(--font-size-xs)] text-text-secondary">正在更新最近邀请记录…</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <AddTeacherInviteDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onInviteSuccess={handleInviteSuccess}
        dialogTitle="添加员工"
        fieldIdPrefix="employee-invite"
      />
    </>
  )
}
