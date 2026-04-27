import * as React from "react"
import {
  Copy,
  Download,
  Info,
  Loader2,
  MessageCircle,
  Minus,
  Pencil,
  Plus,
  RotateCw,
  Shield,
  Trash2,
  User,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { cn } from "../ui/utils"
import { ScheduleBatchAddParticipantsDialog } from "../../vv-assistant/ScheduleBatchAddParticipantsDialog"

type TeacherCardModel = {
  id: string
  name: string
  roleLabel: string
  subject: string
  grade: string
  ownerBadge?: boolean
  avatarSrc?: string
  avatarFallback: string
  footerVariant: "shield" | "message"
}

/** 邀请记录（演示数据，确认邀请后追加） */
type TeacherInviteRecordStatus = "pending" | "completed"

export type TeacherInviteRecordModel = {
  id: string
  displayName: string
  methodTag: string
  orgName: string
  status: TeacherInviteRecordStatus
  inviter: string
  inviteTime: string
  source: string
  avatarSrc?: string
  avatarFallback: string
}

const DEMO_INVITER = "chentingkai"
const DEMO_SOURCE = "教育"

/** 弹窗关闭后再展示「更新记录」loading，再写入列表（毫秒） */
export const INVITE_RECORDS_UPDATE_MS = 650

export type InviteMethod = "weiwei" | "whatsapp" | "email" | "qrcode"

export function formatInviteRecordTime(d: Date): string {
  const y = d.getFullYear()
  const mo = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  const h = String(d.getHours()).padStart(2, "0")
  const min = String(d.getMinutes()).padStart(2, "0")
  const sec = String(d.getSeconds()).padStart(2, "0")
  return `${y}-${mo}-${day} ${h}:${min}:${sec}`
}

export function methodToInviteTag(method: InviteMethod): string {
  switch (method) {
    case "weiwei":
      return "微微邀请"
    case "whatsapp":
      return "WhatsApp 邀请"
    case "email":
      return "邮箱邀请"
    case "qrcode":
      return "链接邀请"
    default:
      return "邀请"
  }
}

const DEMO_TEACHERS: TeacherCardModel[] = [
  {
    id: "t1",
    name: "陈廷凯",
    roleLabel: "全职员工",
    subject: "—",
    grade: "—",
    ownerBadge: false,
    avatarFallback: "陈",
    footerVariant: "shield",
  },
  {
    id: "t2",
    name: "李老师",
    roleLabel: "兼职讲师",
    subject: "—",
    grade: "—",
    ownerBadge: true,
    avatarFallback: "李",
    footerVariant: "message",
  },
]

const INVITE_METHOD_OPTIONS: { value: InviteMethod; label: string }[] = [
  { value: "weiwei", label: "微微" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "邮箱" },
  { value: "qrcode", label: "二维码/链接/企业邀请码" },
]

const SENDER_EMAIL_DEMO = "519023989@qq.com"
const ORG_NAME_DEMO = "陈廷凯测试机构129"

function RequiredMark() {
  return <span className="text-destructive">*</span>
}

function splitContactNames(raw: string): string[] {
  return raw
    .split(/[、,，]/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function randomInviteCodeSegment(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ"
  let s = ""
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return `${s.slice(0, 4)} ${s.slice(4)}`
}

function formatInviteValidUntil(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  const h = String(d.getHours()).padStart(2, "0")
  const min = String(d.getMinutes()).padStart(2, "0")
  const sec = String(d.getSeconds()).padStart(2, "0")
  return `${y}-${m}-${day} ${h}:${min}:${sec}`
}

function buildInviteLink(compactCode: string): string {
  return `https://api.vvai.com/common/wake-up?type=invite%26randomCharacter=${encodeURIComponent(compactCode)}`
}

function TinyMinusBadge() {
  return (
    <span
      className="absolute -right-0.5 -top-0.5 flex size-3.5 items-center justify-center rounded-full border border-border bg-bg text-[9px] font-bold leading-none text-text-tertiary"
      aria-hidden
    >
      −
    </span>
  )
}

function FooterIconButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode
  label: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="relative flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-bg text-text-secondary transition-colors hover:bg-[var(--black-alpha-11)] hover:text-text"
    >
      {children}
      <TinyMinusBadge />
    </button>
  )
}

function TeacherProfileCard({ teacher }: { teacher: TeacherCardModel }) {
  const FirstIcon = teacher.footerVariant === "shield" ? Shield : MessageCircle

  return (
    <div className="flex flex-col rounded-[var(--radius-lg)] border border-border bg-bg p-[var(--space-300)] shadow-xs">
      <div className="flex gap-3">
        <Avatar className="size-10 shrink-0 rounded-[10px]">
          {teacher.avatarSrc ? <AvatarImage src={teacher.avatarSrc} alt="" className="object-cover" /> : null}
          <AvatarFallback
            className={cn(
              "rounded-[10px] text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)]",
              teacher.avatarSrc ? "" : "bg-primary/15 text-primary"
            )}
          >
            {teacher.avatarFallback}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[length:var(--font-size-sm)] font-[var(--font-weight-semibold)] text-text leading-snug">
                {teacher.name}
              </p>
              <p className="mt-0.5 text-[length:var(--font-size-xs)] text-text-secondary">{teacher.roleLabel}</p>
            </div>
            {teacher.ownerBadge ? (
              <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-[var(--blue-alpha-11)] px-2 py-0.5 text-[10px] font-[var(--font-weight-medium)] text-primary">
                所有者
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <dl className="mt-3 space-y-2 border-t border-border pt-3">
        <div className="flex justify-between gap-2 text-[length:var(--font-size-xs)]">
          <dt className="shrink-0 text-text-tertiary">科目</dt>
          <dd className="min-w-0 text-right text-text">{teacher.subject}</dd>
        </div>
        <div className="flex justify-between gap-2 text-[length:var(--font-size-xs)]">
          <dt className="shrink-0 text-text-tertiary">授课年级</dt>
          <dd className="min-w-0 text-right text-text">{teacher.grade}</dd>
        </div>
        <div className="flex justify-between gap-2 text-[length:var(--font-size-xs)]">
          <dt className="shrink-0 text-text-tertiary">开放授课时间</dt>
          <dd>
            <button
              type="button"
              className="text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-primary hover:underline"
            >
              查看详情
            </button>
          </dd>
        </div>
      </dl>

      <div className="mt-3 flex justify-end gap-2 border-t border-border pt-3">
        <FooterIconButton label="权限">
          <FirstIcon className="size-3.5" strokeWidth={2} />
        </FooterIconButton>
        <FooterIconButton label="编辑">
          <Pencil className="size-3.5" strokeWidth={2} />
        </FooterIconButton>
        <FooterIconButton label="移除">
          <Minus className="size-3.5" strokeWidth={2} />
        </FooterIconButton>
      </div>
    </div>
  )
}

export function TeacherInviteRecordCard({ record }: { record: TeacherInviteRecordModel }) {
  const pending = record.status === "pending"

  return (
    <div className="flex gap-3 rounded-[var(--radius-lg)] border border-border bg-bg p-3 shadow-xs">
      <Avatar className="size-11 shrink-0 rounded-full">
        {record.avatarSrc ? (
          <AvatarImage src={record.avatarSrc} alt="" className="object-cover" />
        ) : null}
        <AvatarFallback
          className={cn(
            "rounded-full text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)]",
            pending ? "bg-primary/15 text-primary" : "bg-[var(--black-alpha-11)] text-text-secondary"
          )}
        >
          {pending && !record.avatarSrc ? (
            <User className="size-5" strokeWidth={2} aria-hidden />
          ) : (
            record.avatarFallback.slice(0, 1)
          )}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start gap-x-2 gap-y-1">
          <p className="text-[length:var(--font-size-sm)] font-[var(--font-weight-semibold)] text-text leading-snug">
            {record.displayName}
          </p>
          <div className="flex min-w-0 flex-wrap items-center gap-1">
            <span className="inline-flex max-w-[140px] truncate rounded bg-[var(--black-alpha-11)] px-1.5 py-0.5 text-[10px] text-text-secondary">
              {record.methodTag}
            </span>
            <span className="inline-flex max-w-[min(100%,200px)] truncate rounded bg-[var(--black-alpha-11)] px-1.5 py-0.5 text-[10px] text-text-secondary">
              {record.orgName}
            </span>
          </div>
          <span
            className={cn(
              "ml-auto shrink-0 rounded px-2 py-0.5 text-[10px] font-[var(--font-weight-medium)]",
              pending ? "bg-[var(--blue-alpha-11)] text-primary" : "bg-emerald-500/15 text-emerald-800"
            )}
          >
            {pending ? "邀请中" : "已完成"}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
          <p className="min-w-0 flex-1 text-[length:var(--font-size-xs)] leading-relaxed text-text-secondary">
            <span>邀请人:{record.inviter}</span>
            <span className="mx-1.5 inline text-text-tertiary/70" aria-hidden>
              |
            </span>
            <span>邀请时间: {record.inviteTime}</span>
            <span className="mx-1.5 inline text-text-tertiary/70" aria-hidden>
              |
            </span>
            <span>来源: {record.source}</span>
          </p>
          {!pending ? (
            <span className="shrink-0 text-[length:var(--font-size-xs)] text-text-tertiary">已加入</span>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export function AddTeacherInviteDialog({
  open,
  onOpenChange,
  onInviteSuccess,
  dialogTitle = "添加老师",
  fieldIdPrefix = "teacher-invite",
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onInviteSuccess?: (payload: { method: InviteMethod; displayName: string }) => void
  /** 弹窗标题，如「添加员工」 */
  dialogTitle?: string
  /** 表单项 id 前缀，避免多实例 DOM id 冲突 */
  fieldIdPrefix?: string
}) {
  const [method, setMethod] = React.useState<InviteMethod>("weiwei")
  const [weiweiContact, setWeiweiContact] = React.useState("")
  const [whatsapp, setWhatsapp] = React.useState("")
  const [recipientRows, setRecipientRows] = React.useState<string[]>([""])
  const [pickerOpen, setPickerOpen] = React.useState(false)

  const [inviteCodeDisplay, setInviteCodeDisplay] = React.useState("BACL FLXY")
  const [validUntil, setValidUntil] = React.useState(() => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000))

  const inviteLink = React.useMemo(() => {
    const compact = inviteCodeDisplay.replace(/\s/g, "")
    return buildInviteLink(compact)
  }, [inviteCodeDisplay])

  const qrSrc = React.useMemo(
    () =>
      `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(inviteLink)}`,
    [inviteLink]
  )

  const regenerateInvite = React.useCallback(() => {
    setInviteCodeDisplay(randomInviteCodeSegment())
    setValidUntil(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000))
  }, [])

  const reset = React.useCallback(() => {
    setMethod("weiwei")
    setWeiweiContact("")
    setWhatsapp("")
    setRecipientRows([""])
    setPickerOpen(false)
    setInviteCodeDisplay("BACL FLXY")
    setValidUntil(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000))
  }, [])

  React.useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  const setRecipient = (index: number, value: string) => {
    setRecipientRows((rows) => rows.map((r, i) => (i === index ? value : r)))
  }

  const addRecipientRow = () => setRecipientRows((rows) => [...rows, ""])

  const removeRecipientRow = (index: number) => {
    setRecipientRows((rows) => (rows.length <= 1 ? [""] : rows.filter((_, i) => i !== index)))
  }

  const copyToClipboard = (text: string) => {
    void navigator.clipboard.writeText(text).catch(() => {})
  }

  const handleConfirmInvite = () => {
    const displayName =
      method === "weiwei"
        ? splitContactNames(weiweiContact)[0] || "待填写联系人"
        : method === "whatsapp"
          ? whatsapp.trim() || "WhatsApp 联系人"
          : method === "email"
            ? recipientRows.map((r) => r.trim()).find(Boolean) || "邮箱收件人"
            : ORG_NAME_DEMO

    onOpenChange(false)
    onInviteSuccess?.({ method, displayName })
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          overlayClassName="z-[200] bg-[rgba(15,23,42,0.52)] data-[state=open]:animate-in"
          className={cn(
            "gap-0 overflow-hidden p-0 !z-[210]",
            "flex max-h-[min(90dvh,720px)] w-[min(96vw,calc(100vw-32px))] flex-col",
            method === "qrcode" ? "max-w-[min(96vw,920px)]" : "max-w-[min(96vw,480px)]",
            "rounded-[var(--radius-xl)] border border-border bg-bg shadow-[0px_12px_48px_rgba(22,24,30,0.18)]"
          )}
        >
          <DialogHeader className="shrink-0 border-b border-border bg-[#eef2f7] px-5 pb-3 pt-4">
            <DialogTitle className="text-[length:var(--font-size-base)] font-[var(--font-weight-semi-bold)] text-text">
              {dialogTitle}
            </DialogTitle>
            <DialogDescription className="sr-only">选择邀请方式并填写信息后完成添加</DialogDescription>
          </DialogHeader>

          <div
            className={cn(
              "min-h-0 overflow-y-auto overscroll-contain px-5 py-3",
              method === "qrcode"
                ? "max-h-[min(62dvh,calc(90dvh-200px))]"
                : "max-h-[min(55dvh,calc(90dvh-200px))]"
            )}
          >
            <div className="flex flex-col gap-3">
            <div className="space-y-2">
              <Label className="text-[length:var(--font-size-sm)] text-text">
                邀请方式 <RequiredMark />
              </Label>
              <RadioGroup
                value={method}
                onValueChange={(v) => setMethod(v as InviteMethod)}
                className="!flex !flex-row flex-wrap gap-x-4 gap-y-2.5"
              >
                {INVITE_METHOD_OPTIONS.map((opt) => (
                  <div key={opt.value} className="flex items-center gap-2">
                    <RadioGroupItem value={opt.value} id={`${fieldIdPrefix}-${opt.value}`} />
                    <Label
                      htmlFor={`${fieldIdPrefix}-${opt.value}`}
                      className="cursor-pointer font-normal text-[length:var(--font-size-sm)] text-text"
                    >
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* 动态内容区：样式按设计稿分方式 */}
            <div
              className={cn(
                "rounded-[var(--radius-md)] border border-border p-4",
                method === "qrcode" ? "bg-[#f1f5f9]/90" : "bg-[var(--black-alpha-11)]"
              )}
            >
              {method === "weiwei" ? (
                <div className="space-y-2">
                  <Label className="text-[length:var(--font-size-sm)] text-text">
                    微微联系人 <RequiredMark />
                  </Label>
                  <div
                    className={cn(
                      "flex min-h-10 w-full min-w-0 items-stretch overflow-hidden rounded-[var(--radius-md)] border border-border bg-bg",
                      "focus-within:ring-2 focus-within:ring-ring/25"
                    )}
                  >
                    <input
                      value={weiweiContact}
                      onChange={(e) => setWeiweiContact(e.target.value)}
                      placeholder="选择联系人"
                      className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-[length:var(--font-size-sm)] text-text placeholder:text-text-placeholder outline-none"
                    />
                    <button
                      type="button"
                      className="shrink-0 border-l border-border px-3 text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-primary transition-colors hover:bg-[var(--blue-alpha-11)]"
                      onClick={() => setPickerOpen(true)}
                    >
                      + 选择
                    </button>
                  </div>
                </div>
              ) : null}

              {method === "whatsapp" ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Label className="text-[length:var(--font-size-sm)] text-text">WhatsApp 号码</Label>
                    <span title="可在应用内直接填写号码，或留空后在 WhatsApp 中选择联系人" className="inline-flex">
                      <Info className="size-3.5 text-text-tertiary" strokeWidth={2} aria-hidden />
                    </span>
                  </div>
                  <Input
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="若不填写，可在 WhatsApp 选择联系人"
                    className="rounded-[var(--radius-md)] border-border bg-bg text-[length:var(--font-size-sm)]"
                  />
                </div>
              ) : null}

              {method === "email" ? (
                <div className="space-y-4">
                  <div>
                    <span className="text-[length:var(--font-size-sm)] text-text-secondary">发件邮箱</span>
                    <p className="mt-1 text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text">
                      {SENDER_EMAIL_DEMO}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Label className="text-[length:var(--font-size-sm)] text-text">
                        收件邮箱 <RequiredMark />
                      </Label>
                      <span title="邀请将发送至以下邮箱" className="inline-flex">
                        <Info className="size-3.5 text-text-tertiary" strokeWidth={2} aria-hidden />
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {recipientRows.map((row, index) => (
                        <li key={index} className="flex min-w-0 items-center gap-2">
                          <span className="w-5 shrink-0 text-[length:var(--font-size-sm)] text-text-secondary">
                            {index + 1}.
                          </span>
                          <Input
                            value={row}
                            onChange={(e) => setRecipient(index, e.target.value)}
                            placeholder="请输入"
                            className="min-w-0 flex-1 rounded-[var(--radius-md)] border-border bg-bg text-[length:var(--font-size-sm)]"
                          />
                          <button
                            type="button"
                            className="shrink-0 rounded-md p-2 text-text-tertiary transition-colors hover:bg-[var(--black-alpha-11)] hover:text-text"
                            aria-label={`删除第 ${index + 1} 行`}
                            onClick={() => removeRecipientRow(index)}
                          >
                            <Trash2 className="size-4" strokeWidth={2} />
                          </button>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={addRecipientRow}
                      className="flex w-full items-center justify-center gap-1.5 rounded-[var(--radius-md)] border border-dashed border-border bg-bg py-2.5 text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-primary transition-colors hover:bg-[var(--blue-alpha-11)]"
                    >
                      <Plus className="size-4" strokeWidth={2} />
                      添加
                    </button>
                  </div>
                </div>
              ) : null}

              {method === "qrcode" ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[length:var(--font-size-xs)] text-text-secondary">
                    <span>可通过下列任意方式邀请员工加入</span>
                    <span className="hidden sm:inline" aria-hidden>
                      |
                    </span>
                    <span>
                      邀请有效期:3 天, 至 {formatInviteValidUntil(validUntil)}
                    </span>
                    <button
                      type="button"
                      onClick={regenerateInvite}
                      className="inline-flex items-center gap-1 font-[var(--font-weight-medium)] text-primary hover:underline"
                    >
                      <RotateCw className="size-3.5" strokeWidth={2} />
                      重新生成
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    {/* 二维码 */}
                    <div className="flex flex-col rounded-[var(--radius-md)] border border-border bg-bg p-3 shadow-xs">
                      <div className="mb-3 flex min-h-[40px] flex-wrap items-center gap-1.5">
                        <span className="text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text">
                          {ORG_NAME_DEMO}
                        </span>
                        <span className="rounded bg-[#ffecd9] px-1.5 py-0.5 text-[10px] font-medium text-[#b45309]">
                          组织
                        </span>
                      </div>
                      <div className="relative mx-auto aspect-square w-[min(100%,160px)] bg-white p-2">
                        <img src={qrSrc} alt="" className="h-full w-full object-contain" />
                      </div>
                      <button
                        type="button"
                        className="mt-3 flex items-center justify-center gap-1 text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-primary hover:underline"
                        onClick={() => {
                          const a = document.createElement("a")
                          a.href = qrSrc
                          a.download = "invite-qr.png"
                          a.target = "_blank"
                          a.rel = "noopener noreferrer"
                          a.click()
                        }}
                      >
                        <Download className="size-4" strokeWidth={2} />
                        保存二维码
                      </button>
                    </div>

                    {/* 链接 */}
                    <div className="flex flex-col rounded-[var(--radius-md)] border border-border bg-bg p-3 shadow-xs">
                      <div className="flex items-center justify-center px-1 py-2">
                        <p className="break-all text-center text-[length:var(--font-size-xs)] leading-relaxed text-text">
                          {inviteLink}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="mt-1 flex items-center justify-center gap-1 pt-1 text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-primary hover:underline"
                        onClick={() => copyToClipboard(inviteLink)}
                      >
                        <Copy className="size-4" strokeWidth={2} />
                        复制链接
                      </button>
                    </div>

                    {/* 企业邀请码 */}
                    <div className="flex flex-col rounded-[var(--radius-md)] border border-border bg-bg p-3 shadow-xs">
                      <div className="flex items-center justify-center px-2 py-3">
                        <p className="text-center text-[length:var(--font-size-xl)] font-[var(--font-weight-semibold)] tracking-wide text-text">
                          {inviteCodeDisplay}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="mt-1 flex items-center justify-center gap-1 pt-1 text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-primary hover:underline"
                        onClick={() => copyToClipboard(inviteCodeDisplay.replace(/\s/g, ""))}
                      >
                        <Copy className="size-4" strokeWidth={2} />
                        复制邀请码
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-2 border-t border-border bg-bg px-5 py-3 sm:flex-row sm:items-center sm:gap-3">
            <Button
              type="button"
              variant="chat-reset"
              className="h-10 shrink-0 rounded-full px-5 sm:w-auto"
              onClick={reset}
            >
              重置
            </Button>
            <Button type="button" variant="secondary" className="h-10 flex-1 rounded-full" onClick={handleConfirmInvite}>
              确定邀请
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ScheduleBatchAddParticipantsDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        initialNames={splitContactNames(weiweiContact)}
        onConfirm={(names) => setWeiweiContact(names.join("、"))}
        overlayClassName="z-[280] bg-[rgba(15,23,42,0.55)]"
        contentClassName="!z-[290]"
      />
    </>
  )
}

/** 课程管理 · 成员管理 · 老师管理：单卡片 + 添加老师邀请弹窗（演示样板） */
export function EducationTeacherManagementPanel({
  className,
  onAddTeacher,
  openInviteSignal,
}: {
  className?: string
  onAddTeacher?: () => void
  openInviteSignal?: number
}) {
  const [inviteOpen, setInviteOpen] = React.useState(false)

  React.useEffect(() => {
    if (openInviteSignal == null || openInviteSignal < 1) return
    setInviteOpen(true)
  }, [openInviteSignal])

  const [inviteRecords, setInviteRecords] = React.useState<TeacherInviteRecordModel[]>([])
  const [inviteRecordsUpdating, setInviteRecordsUpdating] = React.useState(false)
  const inviteUpdateTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    return () => {
      if (inviteUpdateTimerRef.current) clearTimeout(inviteUpdateTimerRef.current)
    }
  }, [])

  const handleInviteSuccess = React.useCallback((payload: { method: InviteMethod; displayName: string }) => {
    if (inviteUpdateTimerRef.current) {
      clearTimeout(inviteUpdateTimerRef.current)
      inviteUpdateTimerRef.current = null
    }
    setInviteRecordsUpdating(true)
    inviteUpdateTimerRef.current = setTimeout(() => {
      const now = new Date()
      const id = `inv-${now.getTime()}`
      const avatarFallback = payload.displayName.slice(0, 1) || "?"
      setInviteRecords((prev) =>
        [
          {
            id,
            displayName: payload.displayName,
            methodTag: methodToInviteTag(payload.method),
            orgName: ORG_NAME_DEMO,
            status: "pending",
            inviter: DEMO_INVITER,
            inviteTime: formatInviteRecordTime(now),
            source: DEMO_SOURCE,
            avatarFallback,
          },
          ...prev,
        ].slice(0, 20)
      )
      setInviteRecordsUpdating(false)
      inviteUpdateTimerRef.current = null
    }, INVITE_RECORDS_UPDATE_MS)
  }, [])

  const handleAddClick = () => {
    if (onAddTeacher) {
      onAddTeacher()
      return
    }
    setInviteOpen(true)
  }

  return (
    <>
      <div
        className={cn(
          "w-full max-w-[min(100%,720px)] overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg shadow-xs",
          className
        )}
      >
        <div className="border-b border-border bg-[#eef2f7] px-4 py-3">
          <h2 className="text-[length:var(--font-size-base)] font-[var(--font-weight-semi-bold)] text-text">老师管理</h2>
        </div>

        <div className="p-[var(--space-400)]">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {DEMO_TEACHERS.map((t) => (
              <TeacherProfileCard key={t.id} teacher={t} />
            ))}
          </div>

          <Button
            type="button"
            variant="secondary"
            className="mt-4 flex h-auto w-full min-h-11 items-center justify-center gap-2 rounded-[var(--radius-lg)] py-2.5"
            onClick={handleAddClick}
          >
            <span className="flex size-6 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Plus className="size-3.5" strokeWidth={2.5} />
            </span>
            添加老师
          </Button>

          <div className="mt-4 border-t border-border pt-4 space-y-2">
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

      <AddTeacherInviteDialog open={inviteOpen} onOpenChange={setInviteOpen} onInviteSuccess={handleInviteSuccess} />
    </>
  )
}
