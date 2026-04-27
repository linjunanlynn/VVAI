export type IMConversation = {
  id: string
  name: string
  snippet: string
  time: string
  muted?: boolean
  unread?: number
  isGroup?: boolean
  memberAvatars?: string[]
  /** 单聊头像 */
  avatar?: string
}

export type IMChatMessage = {
  id: string
  sender: string
  time: string
  lines: string[]
  /** 会话内时间分隔 */
  separator?: string
}

export const IM_MOCK_CONVERSATIONS: IMConversation[] = [
  {
    id: "c1",
    name: "产研核心群（需求&资源协调）",
    snippet: "王默：1、需求评审时间已定…",
    time: "18:43",
    muted: true,
    isGroup: true,
    memberAvatars: [],
  },
  {
    id: "c2",
    name: "产品设计组",
    snippet: "李华：新版交互稿已上传",
    time: "17:20",
    isGroup: true,
  },
  {
    id: "c3",
    name: "张三",
    snippet: "好的，明天对齐一下",
    time: "昨天",
    avatar: "",
  },
]

export const IM_MOCK_MESSAGES: Record<string, IMChatMessage[]> = {
  c1: [
    {
      id: "m1",
      sender: "王默",
      time: "17:50",
      lines: [
        "各位，本周需求评审安排如下：",
        "1、需求评审时间已定，请各业务方准时参加；",
        "2、请提前阅读 PRD 文档中的变更点；",
        "3、若有阻塞问题请在会前同步到群里。",
      ],
    },
    {
      id: "m2",
      separator: "18:43",
      sender: "系统",
      time: "",
      lines: [],
    },
    {
      id: "m3",
      sender: "李华",
      time: "18:43",
      lines: ["收到，文档我已看过，没有疑问。"],
    },
  ],
  c2: [
    {
      id: "m1",
      sender: "李华",
      time: "16:00",
      lines: ["新版交互稿已上传至微盘，请大家查阅。"],
    },
  ],
  c3: [
    {
      id: "m1",
      sender: "张三",
      time: "09:12",
      lines: ["好的，明天对齐一下进度。"],
    },
  ],
}
