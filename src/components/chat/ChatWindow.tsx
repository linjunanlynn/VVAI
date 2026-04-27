import * as React from "react"
import { ScrollArea } from "../ui/scroll-area"
import { useSidebar } from "../ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Input } from "../ui/input"
import { Conversation, currentUser, Message } from "./data"
import { cn } from "../ui/utils"
import { PersonalInfoManager } from "./PersonalInfoManager"
import { HistorySidebar } from "./HistorySidebar"
import { 
  TimestampSeparator
} from "./ChatComponents"
import { SidebarIcon } from "./SidebarIcons"
import { ChatNavBar } from "./ChatNavBar"
import { ChatWelcome } from "./ChatWelcome"
import chipWelcome1 from "figma:asset/8f3d961604e71dc986f84219e4385ec8ddbb9390.png"
import chipWelcome2 from "figma:asset/9c6ade6293dd93b2c95d2803f6fde312b07e0200.png"
import chipWelcome3 from "figma:asset/9d2cc7fac2d909a359d4c845c882543b2770c891.png"
import { ChatMessageBubble } from "./ChatMessageBubble"
import { ChatSender } from "./ChatSender"
import { Button } from "../ui/button"

interface ChatWindowProps {
  conversation: Conversation
  onToggleHistory: () => void
  onClose?: () => void
  historyOpen?: boolean
  onHistoryOpenChange?: (open: boolean) => void
  conversations?: Conversation[]
  selectedId?: string
  onSelect?: (id: string) => void
}

const PERSONAL_INFO_COMMANDS = [
  "管理个人信息",
  "manage personal information",
  "个人信息",
  "personal info",
  "个人信息管理"
]

const CREATE_EMAIL_COMMANDS = [
  "创建业务邮箱",
  "create business email",
  "业务邮箱",
  "新增邮箱"
]

const PERSONAL_INFO_MARKER = "<<<RENDER_PERSONAL_INFO_MANAGER>>>"
const CREATE_EMAIL_MARKER = "<<<RENDER_CREATE_EMAIL_FORM>>>"
const CONTINUE_EMAIL_MARKER = "<<<RENDER_CONTINUE_EMAIL>>>"

/** 与 MainAIChatWindow 顶栏模型列表一致（演示用） */
const CHAT_WINDOW_MODELS = [
  { id: "gpt-4", name: "ChatGPT", description: "最强大的通用AI模型" },
  { id: "gpt-3.5", name: "GPT-3.5", description: "快速响应的轻量级模型" },
  { id: "claude-3", name: "Claude 3", description: "Anthropic 的先进 AI 助手" },
  { id: "gemini-pro", name: "Gemini Pro", description: "Google 的多模态 AI 模型" },
] as const

function parseTime(timeStr: string): Date | null {
  const today = new Date();
  // Try parsing "HH:mm" or "HH:mm AM/PM"
  const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (timeMatch) {
    let [_, h, m, amp] = timeMatch;
    let hours = parseInt(h);
    let minutes = parseInt(m);
    
    if (amp) {
      amp = amp.toUpperCase();
      if (amp === 'PM' && hours < 12) hours += 12;
      if (amp === 'AM' && hours === 12) hours = 0;
    }
    
    const date = new Date(today);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }
  return null;
}

function shouldShowTimestamp(current: Message, previous: Message | null): boolean {
  if (!previous) return true;
  
  const curDate = parseTime(current.timestamp);
  const prevDate = parseTime(previous.timestamp);
  
  if (!curDate || !prevDate) {
    // Fallback for non-standard times like "Yesterday" - show if string differs
    return current.timestamp !== previous.timestamp;
  }
  
  const diffInMs = Math.abs(curDate.getTime() - prevDate.getTime());
  const diffInMins = diffInMs / (1000 * 60);
  
  return diffInMins > 20;
}

export function ChatWindow({ 
  conversation, 
  onToggleHistory, 
  onClose,
  historyOpen = false,
  onHistoryOpenChange,
  conversations = [],
  selectedId = "",
  onSelect
}: ChatWindowProps) {
  const { toggleSidebar } = useSidebar();
  const [messages, setMessages] = React.useState<Message[]>(conversation.messages)
  const [inputValue, setInputValue] = React.useState("")
  const [currentModel, setCurrentModel] = React.useState<string>("gpt-4")
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const messageListRootRef = React.useRef<HTMLDivElement>(null)
  const pendingDayJumpRef = React.useRef<{ conversationId: string; messageId: string } | null>(null)
  const [dayJumpNonce, setDayJumpNonce] = React.useState(0)

  React.useEffect(() => {
    setMessages(conversation.messages)
  }, [conversation.id, conversation.messages])

  const handleJumpToConversationDay = React.useCallback(
    (conversationId: string, messageId: string) => {
      pendingDayJumpRef.current = { conversationId, messageId }
      if (conversationId !== selectedId && onSelect) {
        onSelect(conversationId)
      }
      setDayJumpNonce((n) => n + 1)
    },
    [selectedId, onSelect]
  )

  React.useLayoutEffect(() => {
    const p = pendingDayJumpRef.current
    if (!p || p.conversationId !== conversation.id) return
    const root = messageListRootRef.current
    if (!root) return
    const mid = p.messageId
    const tryScroll = () => {
      const el = root.querySelector(`[data-cui-message-id="${CSS.escape(mid)}"]`)
      if (el instanceof HTMLElement) {
        el.scrollIntoView({ block: "start", behavior: "smooth" })
        pendingDayJumpRef.current = null
        return true
      }
      return false
    }
    if (!tryScroll()) {
      requestAnimationFrame(() => {
        if (
          pendingDayJumpRef.current?.conversationId === p.conversationId &&
          pendingDayJumpRef.current?.messageId === p.messageId
        ) {
          tryScroll()
        }
      })
    }
  }, [conversation.id, messages, dayJumpNonce])

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newUserMessage: Message = {
      id: `new-${Date.now()}`,
      senderId: currentUser.id,
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now()
    }

    const updatedMessages = [...messages, newUserMessage]
    
    // Check for commands
    const isPersonalInfoCommand = PERSONAL_INFO_COMMANDS.some(cmd => 
      inputValue.toLowerCase().includes(cmd.toLowerCase())
    )
    const isCreateEmailCommand = CREATE_EMAIL_COMMANDS.some(cmd => 
      inputValue.toLowerCase().includes(cmd.toLowerCase())
    )

    if (isPersonalInfoCommand) {
      const botResponse: Message = {
        id: `bot-${Date.now()}`,
        senderId: conversation.user.id,
        content: PERSONAL_INFO_MARKER,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: Date.now()
      }
      setTimeout(() => {
        setMessages(prev => [...prev, botResponse])
      }, 500)
    } else if (isCreateEmailCommand) {
      const botResponse: Message = {
        id: `bot-${Date.now()}`,
        senderId: conversation.user.id,
        content: CREATE_EMAIL_MARKER,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: Date.now()
      }
      setTimeout(() => {
        setMessages(prev => [...prev, botResponse])
      }, 500)
    }

    setMessages(updatedMessages)
    setInputValue("")
  }

  const handleEmailFormSubmit = (msgId: string, data: any) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, isReadonly: true, formData: data } : m))
    
    setTimeout(() => {
      const successMsg: Message = {
        id: `bot-success-${Date.now()}`,
        senderId: conversation.user.id,
        content: `业务邮箱 ${data.emailPrefix}${data.domain} 创建成功，并已分配给 ${data.members.join('、')}。`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: Date.now()
      }
      const continueMsg: Message = {
        id: `bot-continue-${Date.now()+1}`,
        senderId: conversation.user.id,
        content: CONTINUE_EMAIL_MARKER,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: Date.now() + 1
      }
      setMessages(prev => [...prev, successMsg, continueMsg])
    }, 600)
  }

  const handleContinueCreateEmail = () => {
    const newFormMsg: Message = {
      id: `bot-${Date.now()}`,
      senderId: conversation.user.id,
      content: CREATE_EMAIL_MARKER,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now()
    }
    setMessages(prev => [...prev, newFormMsg])
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="absolute inset-0 flex flex-col w-full isolate overflow-hidden bg-cui-bg">
      
      {/* History Sidebar overlay within ChatWindow container */}
      {onHistoryOpenChange && onSelect && (
        <HistorySidebar
          open={historyOpen}
          onOpenChange={onHistoryOpenChange}
          conversations={conversations}
          selectedId={selectedId}
          onSelect={onSelect}
          onJumpToConversationDay={handleJumpToConversationDay}
        />
      )}

      {/* Header - Fixed at top */}
      <ChatNavBar 
        title=""
        showModelSelect
        currentModel={currentModel}
        models={[...CHAT_WINDOW_MODELS]}
        onModelSelect={setCurrentModel}
        onToggleHistory={onToggleHistory}
        onClose={onClose}
        showClose={true}
      />

      {/* Messages - Fills remaining space, scrolls internally */}
      <ScrollArea className="flex-1 min-h-0 relative z-10">
        <div
          ref={messageListRootRef}
          className="flex flex-col gap-[var(--space-600)] w-full px-[max(20px,var(--cui-padding-max))] py-[var(--space-500)] max-w-[1920px] mx-auto min-h-full"
        >
          {/* Welcome Message (Mock/Static as per design) */}
          <ChatWelcome 
            avatarSrc={conversation.user.avatar}
            greeting="下午好，今天你有 31 件要处理的事情 👇"
            chips={[
              {
                iconSrc: chipWelcome1,
                alt: "需求启动会议",
                title: "需求启动会议",
                time: "15:00 - 16:00",
                count: 13
              },
              {
                iconSrc: chipWelcome2,
                alt: "张三—执行内容评价",
                title: "张三—执行内容评价",
                count: 13
              },
              {
                iconSrc: chipWelcome3,
                alt: "学而思教育机构邀请加入",
                title: "学而思教育机构邀请加入"
              }
            ]}
          />

          {/* Conversation Messages */}
          {messages.map((msg, index) => {
            const isMe = msg.senderId === currentUser.id
            const isPersonalInfo = msg.content === PERSONAL_INFO_MARKER
            const isCreateEmailForm = msg.content === CREATE_EMAIL_MARKER
            const isContinueEmail = msg.content === CONTINUE_EMAIL_MARKER
            const isSpecialComponent = isPersonalInfo || isCreateEmailForm || isContinueEmail
            const showTimestamp = shouldShowTimestamp(msg, index > 0 ? messages[index - 1] : null)
            const isSameSender = index > 0 && messages[index - 1].senderId === msg.senderId;
            const isWithin10Seconds = index > 0 && 
              (msg.createdAt !== undefined && messages[index - 1].createdAt !== undefined) 
                ? (msg.createdAt! - messages[index - 1].createdAt!) <= 10000 
                : false;
            const hideAvatar = isSameSender && !showTimestamp && isWithin10Seconds;

            return (
              <div
                key={msg.id}
                data-cui-message-id={msg.id}
                className="flex min-w-0 flex-col gap-[var(--space-200)]"
              >
                {showTimestamp && <TimestampSeparator time={msg.timestamp} />}
                <ChatMessageBubble
                  msg={msg}
                  isMe={isMe}
                  userAvatar={currentUser.avatar}
                  aiAvatar={conversation.user.avatar}
                  userName={isMe ? "Me" : conversation.user.name}
                  isSpecialComponent={isSpecialComponent}
                  isPersonalInfo={isPersonalInfo}
                  isCreateEmailForm={isCreateEmailForm}
                  isContinueEmail={isContinueEmail}
                  hideAvatar={hideAvatar}
                  className={hideAvatar ? "-mt-[var(--space-400)]" : ""}
                  handleEmailFormSubmit={handleEmailFormSubmit}
                  handleContinueCreateEmail={handleContinueCreateEmail}
                />
              </div>
            )
          })}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area - Fixed at bottom */}
      <div className="flex-none relative z-20 w-full pt-[0px] pb-[var(--space-400)] px-[max(20px,var(--cui-padding-max))]">
        <ChatSender
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSendMessage={handleSendMessage}
          handleKeyDown={handleKeyDown}
        />
      </div>
    </div>
  )
}