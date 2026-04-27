import * as React from "react"
import { X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { ChatSender } from "../chat/ChatSender"
import { cn } from "../ui/utils"
import type { NaturalExampleCommand } from "../../vv-assistant/generalQuickCommands"
import { currentUser, type Message } from "../chat/data"
import { VvAssistantBlocks, VvUserBubble } from "../../vv-assistant/VvAssistantBlocks"
import type { VvScheduleSideSheetSurface } from "../../vv-assistant/vvScheduleSideSheetContext"
import type { VvMeetingItem } from "../../vv-assistant/types"
import type { TeacherInviteRecordModel } from "./EducationTeacherManagementPanel"
import { EmployeeManagementPanel } from "./EmployeeManagementPanel"
import {
  EMPLOYEE_MGMT_MARKER,
  matchesEmployeeMgmtIntent,
  matchesSideScheduleIntent,
} from "./employeeMgmtIntent"

/** 主窗口通过 ref 向日程子对话追加/修补 vv 消息（避免写入通用主列） */
export type ScheduleSideThreadBridge = {
  appendMessage: (m: Message) => void
  patchMessageById: (id: string, updater: (m: Message) => Message) => void
  mapMessages: (mapper: (m: Message) => Message) => void
  /** 与 runVvGeneralSend 的 setMessages 一致，用于子对话内完整日程编排 */
  applyMessagesUpdate: React.Dispatch<React.SetStateAction<Message[]>>
  /** 当前子对话完整消息列表（供主 AI 镜像自然语言对） */
  getMessages: () => Message[]
}

/** 子侧栏内产生的消息同步到「日历」dock 会话（由 MainAIChatWindow 注入） */
export type ScheduleSideThreadMirrorHandler = (messages: ReadonlyArray<Message>) => void

function demoSideAssistantReply(userText: string, scheduleTitle: string): string {
  const t = userText.trim()
  if (/取消|删掉|删除|不要了/.test(t)) {
    return `你可以在上方卡片里用右上角「取消/删除」处理「${scheduleTitle}」；也可以关闭本窗后，在主对话里说「取消今日日程」再选中对应条目。`
  }
  if (/改|修改|换时间|换地点|推迟|提前/.test(t)) {
    return `修改「${scheduleTitle}」可直接在卡片内进入编辑；主对话里回复「修改日程」也能走完整演示流程。`
  }
  if (/会议|入会|微微会议|会议号/.test(t)) {
    return `「${scheduleTitle}」的会议入口与会议号已展示在卡片中；演示环境「开始微微会议」仅为占位，无实际跳转。`
  }
  if (/提醒|闹钟|通知/.test(t)) {
    return `提醒规则见卡片内说明。若要改提醒，可在主对话用「修改日程」打开表单后调整。`
  }
  if (/今日日程|全部日程|空闲/.test(t)) {
    return `查询类指令建议关闭本窗后在主日程对话发送，子窗口主要用来对照本条「${scheduleTitle}」做说明与操作。`
  }
  return `已收到你对「${scheduleTitle}」的补充说明：「${t.length > 80 ? `${t.slice(0, 80)}…` : t}」。优先用上方卡片完成操作，需要串联上下文时可回到主对话继续聊。`
}

/**
 * 日程详情侧边「子对话窗」：含开场用户气泡、助手日程卡片、后续多轮消息与底部输入框。
 */
export function ScheduleSideConversationPanel({
  scheduleId,
  scheduleTitle,
  botAvatarSrc,
  userAvatarSrc,
  userDisplayName = "我",
  aiSenderId,
  onClose,
  naturalExamples = [],
  onSubSend,
  threadBridgeRef,
  onVvAction,
  schedulePanelAppId = null,
  schedulePanelSurface = "main",
  scheduleMeetingItems,
  lockedScheduleOrganizationName,
  employeeDemoOrgId,
  employeeInviteRecords,
  onEmployeeInviteRecordsChange,
  onMirrorEmployeeMgmtToEmployeeApp,
  onSidePanelScheduleIntent,
  onSideThreadMessagesChange,
  /** 子对话线程内每条可展示消息（含 vv 卡更新）同步到日历应用会话历史 */
  onSideThreadMirror,
  children,
}: {
  scheduleId: string
  scheduleTitle: string
  botAvatarSrc: string
  userAvatarSrc: string
  userDisplayName?: string
  /** 助手气泡 senderId，与主会话 vv 消息一致 */
  aiSenderId: string
  onClose: () => void
  /** 与主对话 ChatSender 一致的示例指令 */
  naturalExamples?: NaturalExampleCommand[]
  /** 可选：把子窗口发送内容同步给外层（如埋点、后续接真实编排） */
  onSubSend?: (text: string) => void
  /** 子对话消息变化时同步给主窗口，用于将纯文字对镜像到主 AI 历史 */
  onSideThreadMessagesChange?: (msgs: Message[]) => void
  /** 挂载时注册，供 handleVvAction 将取消确认等消息写入本子对话 */
  threadBridgeRef?: React.MutableRefObject<ScheduleSideThreadBridge | null>
  onVvAction?: (action: string, data?: unknown) => void
  schedulePanelAppId?: string | null
  schedulePanelSurface?: VvScheduleSideSheetSurface
  /** 与主对话一致，用于日程行解析 `linkedMeetingId` 展示会议态 */
  scheduleMeetingItems?: VvMeetingItem[]
  /** 父级对话顶栏当前组织名；新建/编辑日程表单组织字段锁定为该值 */
  lockedScheduleOrganizationName?: string
  /** 与父级顶栏组织 id 一致，用于员工管理演示数据与父对话相同 */
  employeeDemoOrgId?: string
  /** 与主窗口共享的员工邀请记录（按会话+组织持久化） */
  employeeInviteRecords: TeacherInviteRecordModel[]
  onEmployeeInviteRecordsChange: React.Dispatch<React.SetStateAction<TeacherInviteRecordModel[]>>
  /** 子对话内发起员工管理时，同步用户句与卡片到「员工」应用线程 */
  onMirrorEmployeeMgmtToEmployeeApp?: (userText: string) => void
  /** 子对话内发起与主日程一致的 vv 指令（创建/今日/全部日程等） */
  onSidePanelScheduleIntent?: (text: string) => void
  onSideThreadMirror?: ScheduleSideThreadMirrorHandler
  children: React.ReactNode
}) {
  const [draft, setDraft] = React.useState("")
  const [threadMessages, setThreadMessages] = React.useState<Message[]>([])
  const threadMessagesRef = React.useRef<Message[]>([])
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const onSideThreadMirrorRef = React.useRef(onSideThreadMirror)
  onSideThreadMirrorRef.current = onSideThreadMirror

  const mirrorOut = React.useCallback((msgs: ReadonlyArray<Message>) => {
    if (msgs.length === 0) return
    onSideThreadMirrorRef.current?.(msgs)
  }, [])

  React.useEffect(() => {
    threadMessagesRef.current = threadMessages
  }, [threadMessages])

  React.useEffect(() => {
    onSideThreadMessagesChange?.(threadMessages)
  }, [threadMessages, onSideThreadMessagesChange])

  React.useEffect(() => {
    setDraft("")
    setThreadMessages([])
  }, [scheduleId])

  React.useEffect(() => {
    if (!threadBridgeRef) return
    const bridge: ScheduleSideThreadBridge = {
      appendMessage: (m) => {
        setThreadMessages((prev) => [...prev, m])
        mirrorOut([m])
      },
      patchMessageById: (id, u) => {
        setThreadMessages((prev) => {
          const next = prev.map((msg) => (msg.id === id ? u(msg) : msg))
          const updated = next.find((msg) => msg.id === id)
          if (updated) queueMicrotask(() => mirrorOut([updated]))
          return next
        })
      },
      mapMessages: (mapper) => {
        setThreadMessages((prev) => {
          const next = prev.map(mapper)
          const changed: Message[] = []
          for (let i = 0; i < next.length; i++) {
            const a = prev[i]
            const b = next[i]
            if (!a || !b || a.id !== b.id) continue
            if (
              a.content !== b.content ||
              a.vvCardStatusLine !== b.vvCardStatusLine ||
              JSON.stringify(a.vvAssistant) !== JSON.stringify(b.vvAssistant) ||
              JSON.stringify(a.vvMeta) !== JSON.stringify(b.vvMeta)
            ) {
              changed.push(b)
            }
          }
          if (changed.length) queueMicrotask(() => mirrorOut(changed))
          return next
        })
      },
      applyMessagesUpdate: (u) => setThreadMessages(u),
      getMessages: () => [...threadMessagesRef.current],
    }
    threadBridgeRef.current = bridge
    return () => {
      threadBridgeRef.current = null
      onSideThreadMessagesChange?.([])
    }
  }, [threadBridgeRef, mirrorOut, onSideThreadMessagesChange])

  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
  }, [threadMessages.length])

  const commitSend = React.useCallback(
    (raw: string) => {
      const text = raw.trim()
      if (!text) return
      setDraft("")
      onSubSend?.(text)

      if (matchesEmployeeMgmtIntent(text)) {
        const uid = `side-u-${Date.now()}`
        const userMsg: Message = {
          id: uid,
          senderId: currentUser.id,
          content: text,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          createdAt: Date.now(),
        }
        setThreadMessages((prev) => [...prev, userMsg])
        mirrorOut([userMsg])
        window.setTimeout(() => {
          const botMsg: Message = {
            id: `side-emp-${Date.now()}`,
            senderId: aiSenderId,
            content: EMPLOYEE_MGMT_MARKER,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            createdAt: Date.now(),
          }
          setThreadMessages((prev) => [...prev, botMsg])
          mirrorOut([botMsg])
          onMirrorEmployeeMgmtToEmployeeApp?.(text)
        }, 400)
        return
      }

      if (matchesSideScheduleIntent(text) && onSidePanelScheduleIntent) {
        onSidePanelScheduleIntent(text)
        return
      }

      const uid = `side-u-${Date.now()}`
      const userMsg: Message = {
        id: uid,
        senderId: currentUser.id,
        content: text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        createdAt: Date.now(),
      }
      setThreadMessages((prev) => [...prev, userMsg])
      mirrorOut([userMsg])
      window.setTimeout(() => {
        const reply = demoSideAssistantReply(text, scheduleTitle)
        const botMsg: Message = {
          id: `side-a-${Date.now()}`,
          senderId: aiSenderId,
          content: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          createdAt: Date.now(),
        }
        setThreadMessages((prev) => [...prev, botMsg])
        mirrorOut([botMsg])
      }, 380)
    },
    [aiSenderId, mirrorOut, onMirrorEmployeeMgmtToEmployeeApp, onSubSend, onSidePanelScheduleIntent, scheduleTitle]
  )

  const handleSendMessage = React.useCallback(() => {
    commitSend(draft)
  }, [commitSend, draft])

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") return
      if (e.shiftKey) return
      if (e.nativeEvent.isComposing) return
      e.preventDefault()
      commitSend(draft)
    },
    [commitSend, draft]
  )

  /** 子对话线程内卡片与侧栏议程一致：带上静默标记，避免确认取消等动作把气泡推到主列 */
  const threadOnVvAction = React.useCallback(
    (action: string, data?: unknown) => {
      const payload =
        data && typeof data === "object" && data !== null && !Array.isArray(data)
          ? { ...(data as Record<string, unknown>), _vvModalSilent: true }
          : { _vvModalSilent: true }
      onVvAction?.(action, payload)
    },
    [onVvAction]
  )

  return (
    <div
      className={cn(
        "pointer-events-auto flex h-full min-h-0 min-w-0 w-full flex-col border-l border-[#e8ecf0] bg-cui-bg shadow-[-12px_0_32px_rgba(15,23,42,0.08)]"
      )}
    >
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-3 py-2.5">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[length:var(--font-size-sm)] font-[var(--font-weight-semibold)] text-text">
            日程子对话
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex size-9 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-[var(--black-alpha-11)] hover:text-text"
          aria-label="关闭侧边对话"
        >
          <X className="size-[18px]" strokeWidth={2} />
        </button>
      </header>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-[max(12px,16px)] py-4"
      >
        <div className="flex flex-col gap-5">
          <div className="flex w-full flex-row items-start justify-end gap-2">
            <div
              className={cn(
                "max-w-[min(100%,520px)] rounded-tl-[var(--radius-lg)] rounded-tr-[var(--radius-sm)] rounded-bl-[var(--radius-lg)] rounded-br-[var(--radius-lg)] bg-gradient-to-r from-[#9187FF] to-[#2C98FC] px-[var(--space-350)] py-[var(--space-300)] text-left text-[length:var(--font-size-base)] leading-normal text-white shadow-elevation-sm"
              )}
            >
              {`查看「${scheduleTitle}」详情`}
            </div>
            <Avatar className="mt-0.5 size-7 shrink-0 md:size-9">
              <AvatarImage src={userAvatarSrc} />
              <AvatarFallback>{userDisplayName[0] ?? "我"}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex w-full flex-row items-start justify-start gap-2 md:gap-[8px]">
            <Avatar className="mt-0.5 size-7 shrink-0 md:size-9">
              <AvatarImage src={botAvatarSrc} />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">{children}</div>
          </div>

          {threadMessages.map((msg) => {
            const isMe = msg.senderId === currentUser.id
            if (isMe && msg.vvMeta) {
              return (
                <div key={msg.id} className="flex w-full flex-row items-start justify-end gap-2">
                  <div className="flex max-w-[min(100%,520px)] flex-col items-end gap-[var(--space-150)]">
                    <VvUserBubble content={msg.content} vvMeta={msg.vvMeta} />
                  </div>
                  <Avatar className="mt-0.5 size-7 shrink-0 md:size-9">
                    <AvatarImage src={userAvatarSrc} />
                    <AvatarFallback>{userDisplayName[0] ?? "我"}</AvatarFallback>
                  </Avatar>
                </div>
              )
            }
            if (msg.content === EMPLOYEE_MGMT_MARKER) {
              return (
                <div key={msg.id} className="flex w-full flex-row items-start justify-start gap-2 md:gap-[8px]">
                  <Avatar className="mt-0.5 size-7 shrink-0 md:size-9">
                    <AvatarImage src={botAvatarSrc} />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <EmployeeManagementPanel
                      organizationId={employeeDemoOrgId}
                      inviteRecords={employeeInviteRecords}
                      onInviteRecordsChange={onEmployeeInviteRecordsChange}
                    />
                  </div>
                </div>
              )
            }
            if (msg.vvAssistant) {
              const linkOnly = msg.vvAssistant.kind === "schedule-side-session-link"
              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex w-full flex-row items-start justify-start gap-2 md:gap-[8px]",
                    linkOnly && "justify-center"
                  )}
                >
                  {!linkOnly ? (
                    <Avatar className="mt-0.5 size-7 shrink-0 md:size-9">
                      <AvatarImage src={botAvatarSrc} />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  ) : null}
                  <div className={cn("min-w-0", linkOnly ? "w-full flex-1" : "flex-1")}>
                    <VvAssistantBlocks
                      messageId={msg.id}
                      cardStatusLine={msg.vvCardStatusLine}
                      payload={msg.vvAssistant}
                      onVvAction={threadOnVvAction}
                      schedulePanelAppId={schedulePanelAppId}
                      schedulePanelSurface={schedulePanelSurface}
                      scheduleMeetingItems={scheduleMeetingItems}
                      lockedScheduleOrganizationName={lockedScheduleOrganizationName}
                    />
                  </div>
                </div>
              )
            }
            if (isMe) {
              return (
                <div key={msg.id} className="flex w-full flex-row items-start justify-end gap-2">
                  <div
                    className={cn(
                      "max-w-[min(100%,520px)] rounded-tl-[var(--radius-lg)] rounded-tr-[var(--radius-sm)] rounded-bl-[var(--radius-lg)] rounded-br-[var(--radius-lg)] bg-gradient-to-r from-[#9187FF] to-[#2C98FC] px-[var(--space-350)] py-[var(--space-300)] text-left text-[length:var(--font-size-base)] leading-normal text-white shadow-elevation-sm whitespace-pre-wrap break-words"
                    )}
                  >
                    {msg.content}
                  </div>
                  <Avatar className="mt-0.5 size-7 shrink-0 md:size-9">
                    <AvatarImage src={userAvatarSrc} />
                    <AvatarFallback>{userDisplayName[0] ?? "我"}</AvatarFallback>
                  </Avatar>
                </div>
              )
            }
            return (
              <div key={msg.id} className="flex w-full flex-row items-start justify-start gap-2 md:gap-[8px]">
                <Avatar className="mt-0.5 size-7 shrink-0 md:size-9">
                  <AvatarImage src={botAvatarSrc} />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "max-w-[min(100%,520px)] rounded-tl-[var(--radius-sm)] rounded-tr-[var(--radius-lg)] rounded-bl-[var(--radius-lg)] rounded-br-[var(--radius-lg)] border border-border bg-bg px-[var(--space-350)] py-[var(--space-300)] text-left text-[length:var(--font-size-base)] leading-normal text-text shadow-xs whitespace-pre-wrap break-words"
                  )}
                >
                  {msg.content}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-cui-bg px-[max(10px,12px)] pt-[var(--space-200)] pb-[max(var(--space-300),env(safe-area-inset-bottom,0px))]">
        <ChatSender
          inputValue={draft}
          setInputValue={setDraft}
          handleSendMessage={handleSendMessage}
          handleKeyDown={handleKeyDown}
          placeholder={`针对「${scheduleTitle.slice(0, 12)}${scheduleTitle.length > 12 ? "…" : ""}」输入…`}
          naturalExamples={naturalExamples}
          onPickNaturalExample={(sendText) => commitSend(sendText)}
        />
      </div>
    </div>
  )
}
