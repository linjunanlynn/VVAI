import aiAvatar from "figma:asset/5b6944cca1f1ab3d84ca7f9d682db0a94d709b01.png"
import userAvatar from "figma:asset/82646def8a61cdad4e2cbba3209910b1f157760c.png"
import type { VvAssistantPayload } from "../../vv-assistant/types"

export type User = {
  id: string
  name: string
  avatar: string
  status: 'online' | 'offline' | 'away'
}

/** 《全新用户》等演示：助手消息「操作来源」条（与 V2 CUI 对齐） */
export type MessageOperationSource = {
  cardTitle: string
  sourceMessageId: string
  sourceDetailLabel?: string
  sourceConversationId?: string
}

export type Message = {
  id: string
  senderId: string
  content: string
  timestamp: string
  createdAt?: number
  isReadonly?: boolean
  formData?: any
  isAfterPrompt?: boolean
  /** 应用 Agent 回复后：CUI 追问交互业务指令提示（点击即发送） */
  cuiFollowUpPrompts?: string[]
  /** 与 `cuiFollowUpPrompts` 等长时，点击第 i 条发送 `sendTexts[i]` 而非 `prompts[i]`（展示文案与发送内容分离） */
  cuiFollowUpSendTexts?: string[]
  /** 《日历（样板）》迁移：结构化助手卡片（底部「日历」dock 等） */
  vvAssistant?: VvAssistantPayload
  /** 助手卡片已执行写入后，在卡片与底部快捷指令之间的状态一句 */
  vvCardStatusLine?: string
  /** 用户侧：CLI 提示与「识别中」状态（vv 编排） */
  vvMeta?: { commandHint?: string | null; showCommandHint?: boolean; isRecognizing?: boolean }
  /**
   * 《主CUI交互》主 VVAI：组织型应用卡片内容归属的组织 id（多主体时用于卡片顶栏）。
   * 与 `cardAttributionDockAppId` 配合；个人应用范围卡片不应设置二者。
   */
  cardAttributionOrgId?: string
  /** 与 `cardAttributionOrgId` 配套，用于判断是否个人应用范围（不展示组织归属条） */
  cardAttributionDockAppId?: string
  operationSource?: MessageOperationSource
}

export type Conversation = {
  id: string
  user: User
  messages: Message[]
  unread: number
  /** 底部应用 Agent 会话：对应 dock 应用 id */
  dockAppId?: string
  /** dock 会话所属组织，切换组织后用于隔离会话与历史列表 */
  dockOrgId?: string
  /** 历史列表展示标题，优先于末条消息摘要 */
  sessionLabel?: string
}

/** 会话列表、日期聚合、展开消息等路径的防御性读取，避免 `messages` 缺失时出现「is not iterable」 */
export function coerceMessagesList(messages: Message[] | null | undefined): Message[] {
  return Array.isArray(messages) ? messages : []
}

export const currentUser: User = {
  id: 'me',
  name: '我',
  avatar: userAvatar,
  status: 'online'
}

export const users: User[] = [
  {
    id: 'ai-assistant',
    name: 'VVAI',
    avatar: aiAvatar,
    status: 'online'
  },
  {
    id: 'ai-helper',
    name: '智能助手',
    avatar: aiAvatar,
    status: 'online'
  },
  {
    id: 'ai-writer',
    name: '写作助手',
    avatar: aiAvatar,
    status: 'online'
  }
]

export const conversations: Conversation[] = [
  {
    id: 'c1',
    user: users[0],
    unread: 0,
    messages: [
      { id: 'm1', senderId: 'me', content: 'Text Content', timestamp: '14:58', createdAt: Date.now() - 300000 },
      { id: 'm2', senderId: 'ai-assistant', content: 'Text Content', timestamp: '14:59', createdAt: Date.now() - 240000 },
      { id: 'm3', senderId: 'me', content: 'Text Content', timestamp: '15:00', createdAt: Date.now() - 180000 },
      { id: 'm4', senderId: 'ai-assistant', content: 'Text Content', timestamp: '15:01', createdAt: Date.now() - 120000 },
    ]
  },
  {
    id: 'c2',
    user: users[1],
    unread: 1,
    messages: [
      { id: 'm1', senderId: 'me', content: '帮我写一份关于人工智能发展趋势的报告大纲。', timestamp: 'Yesterday', createdAt: Date.now() - 86400000 },
      { id: 'm2', senderId: 'ai-helper', content: '没问题，以下是关于人工智能发展趋势的报告大纲草案：\n\n1. 引言\n2. 技术突破\n3. 行业应用\n4. 伦理与挑战\n5. 未来展望\n\n你需要我针对某一部分详细展开吗？', timestamp: 'Yesterday', createdAt: Date.now() - 86395000 },
    ]
  },
  {
    id: 'c3',
    user: users[2],
    unread: 0,
    messages: [
      { id: 'm1', senderId: 'ai-writer', content: '上次的文章修改建议你看了吗？觉得如何？', timestamp: '2 days ago', createdAt: Date.now() - 172800000 },
    ]
  }
]
