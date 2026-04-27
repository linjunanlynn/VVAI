/** 参与人响应状态（日程详情卡片 Tab / 角标） */
export type VvScheduleAttendeeRsvp = "accepted" | "declined" | "tentative" | "pending"

/** 新建日历：公开范围（演示） */
export type VvCalendarVisibilityScope = "busy_only" | "details" | "private"

/** 新建日历表单草稿 */
export type VvCalendarCreateDraft = {
  name: string
  visibility: VvCalendarVisibilityScope
  /** 色值，如 #1890ff */
  color: string
  description: string
}

/** 用户自建日历类型（颜色用于各视图中的日程条） */
export type VvUserCalendarType = {
  id: string
  name: string
  /** 用于日程条/色点，如 #2563eb */
  color: string
  /** 新建日历时可选说明 */
  description?: string
  visibility?: VvCalendarVisibilityScope
}

/** 订阅日历：仅展示忙碌时段，无标题详情 */
export type VvSubscribedCalendar = {
  id: string
  displayName: string
  color: string
  busyIntervals: { calendarDate: string; start: string; end: string }[]
}

/** 同事日历订阅：通讯录检索结果（演示） */
export type VvColleagueCalendarHit = {
  id: string
  name: string
  /** 组织简称，如「VV AI教育」 */
  orgShortName: string
}

/** 日历设置卡片 / 自然语言修改的演示状态（与 UserCalendarsProvider 同步） */
export type VvWeekStartChoice = "mon" | "sun" | "sat"

export type VvScheduleCalendarSubscriber = {
  id: string
  name: string
}

export type VvScheduleCalendarPrefs = {
  weekStart: VvWeekStartChoice
  /** 默认提醒标签，如「开始时提醒」「5分钟前提醒」 */
  defaultReminderLabels: string[]
  requireSubscribeAuth: boolean
  subscribers: VvScheduleCalendarSubscriber[]
}

export type VvScheduleItem = {
  id: string
  title: string
  start: string
  end: string
  time: string
  location: string
  attendees: string[]
  reminder: string
  notes: string
  status: string
  dateLabel: string
  linkedMeetingId: string | null
  /** 展示用组织名，默认「微微集团」 */
  organization?: string
  /** 组织人展示名 */
  organizerName?: string
  /** 展示用日历日期 YYYY-MM-DD，与 start/end 一起拼详情时间行 */
  calendarDate?: string
  /** 归属的用户日历类型 id，默认 cal-default */
  calendarTypeId?: string
  /** 会议号（可含空格，复制时会去掉空格） */
  meetingNumber?: string
  /** 参与人 RSVP；未写到的成员由界面按规则推断 */
  attendeeRsvp?: Partial<Record<string, VvScheduleAttendeeRsvp>>
}

export type VvTodoItem = {
  id: string
  title: string
  summary: string
  detail: string
  type: "approval" | "task"
  status: string
  sender: string
  owner: string
  approvers?: string[]
  assignees?: string[]
  time: string
  amount: string | null
  tags: string[]
  /** 列表第二行「动作」文案，如 推送、完成 */
  metaVerb?: string
  /** 列表第二行来源展示，默认用 owner */
  sourceLabel?: string
  /** 来源图标：公司 / 个人 */
  sourceScope?: "company" | "personal"
  /** 左侧色块：审批偏红、事项偏绿 */
  listTone?: "rose" | "emerald"
  /** 「全部待办」大列表排序：越大越靠前（越新） */
  fullHubSortKey?: number
  /** 列表行展示用经办人短文案，如 陈廷凯 (我) */
  assigneeLine?: string
  /** 「全部待办」来源类型：考勤 / 流程 / 任务 / 入职 / 调岗 / 物资 */
  fullHubSourceCategory?: string
}

export type VvMailItem = {
  id: string
  subject: string
  sender: string
  recipients: string[]
  cc: string[]
  time: string
  preview: string
  body: string
  status: string
  folder: string
}

export type VvMeetingItem = {
  id: string
  title: string
  start: string
  end: string
  time: string
  room: string
  participants: string[]
  status: string
  agenda: string
  linkedScheduleId: string | null
  recordId: string | null
}

export type VvRecordItem = {
  id: string
  title: string
  meetingId: string
  time: string
  speakers: string[]
  summary: string
  actions: string[]
}

/** 会议记录中心：列表卡片 Tab 筛选项 */
export type VvMeetingRecordHubTab = "all" | "mine" | "organized" | "participated" | "subordinate"

/** 会议记录中心单条（与会议列表/纪要联动演示） */
export type VvMeetingRecordHubItem = {
  id: string
  title: string
  /** 左侧时间轴展示用，如 05-01 */
  dateKey: string
  timeRange: string
  /** 纯数字会议号，界面格式化为分段展示 */
  meetingCode: string
  organizerName: string
  /** 右上角短标签，可省略 */
  organizerTag?: string
  participants: string[]
  participantCount: number
  status: "upcoming" | "ended" | "cancelled"
  /** 已结束：参会时长等说明 */
  attendanceLine?: string
  iAmOrganizer: boolean
  iParticipated: boolean
  fromSubordinate: boolean
  /** 待开始：可「开始会议」时关联的会议 id */
  meetingId?: string
  /** 已结束：可打开纪要详情 */
  recordDetail?: VvRecordItem
  /** 卡片标题左侧色块：紫 / 绿（默认 emerald） */
  cardAccent?: "violet" | "emerald"
  /** 右上角组织文案（默认微微集团） */
  organizationLabel?: string
  /** 已参会人数；与 `notAttendedCount` 组合为「3 人已参会 … 2 人未参会」 */
  attendedCount?: number
  /** 未参会人数 */
  notAttendedCount?: number
}

export type VvDriveItem = {
  id: string
  name: string
  owner: string
  updatedAt: string
  location: string
  size: string
  type: string
  sharedWith: string[]
}

export type VvDocItem = {
  id: string
  title: string
  owner: string
  updatedAt: string
  location: string
  summary: string
  access: string
  favorite: boolean
  sharedWithMe: boolean
}

export type VvScheduleEditDraft = {
  title: string
  location: string
  start: string
  end: string
  reminder: string
  /** 展示用日历日期 YYYY-MM-DD，可与日程详情一致 */
  calendarDate?: string
  /** 归属日历类型 */
  calendarTypeId?: string
}

export type VvScheduleCreateDraft = {
  title: string
  slotLabel: string
  location: string
  attendees: string
  /** 新建时归属的日历类型 */
  calendarTypeId?: string
}

/** 发起会议表单（立即 / 预约日期时间） */
export type VvMeetingStartFormDraft = {
  title: string
  participants: string
  room: string
  timeMode: "instant" | "scheduled"
  customDate: string
  startTime: string
  endTime: string
  /** 预约会议卡片：归属日历（与创建日程一致） */
  calendarTypeId?: string
}

export type VvTodoHubTab = "all" | "pending" | "initiated" | "done" | "cc" | "draft"

/** 发起审批表单 */
export type VvApprovalStartFormDraft = {
  /** 组织 */
  organization?: string
  title: string
  /** 类型（与审批模板/流程名称联动） */
  processType?: string
  template: string
  /** 正文，与 detail 同步用于演示待办 */
  content?: string
  link?: string
  /** 流程说明 */
  process?: string
  approvers: string
  cc: string
  amount: string
  detail: string
}

/** 「全部流程」中心：单格入口 */
export type VvApprovalProcessHubTile = {
  id: string
  label: string
  tone: "orange" | "blue" | "navy" | "emerald" | "red" | "violet" | "rose"
}

export type VvApprovalProcessHubSection = {
  id: string
  title: string
  items: VvApprovalProcessHubTile[]
}

/** 新建邮件表单（GUI → 与 inferUserCommand 中「请新建一封邮件…」正则一致的自然语言） */
export type VvMailComposeFormDraft = {
  to: string
  cc: string
  subject: string
  body: string
}

export type VvSuccessAction =
  | { kind: "noop" }
  | { kind: "open-schedule-detail"; scheduleId: string }
  | { kind: "open-today-agenda" }
  | { kind: "start-meeting-freebusy" }
  | { kind: "open-meeting-detail"; meetingId: string }
  | { kind: "open-record-by-meeting"; meetingId: string }
  | { kind: "open-todo-detail"; todoId: string }

export type VvFreeSlot = {
  id: string
  label: string
  detail: string
  confidence: string
}

export type VvChoiceItem = {
  id: string
  title: string
  meta: string
  /** 修改/取消日程候选：用于与「今日日程」列表同一行样式，并可打开侧栏详情 */
  scheduleItem?: VvScheduleItem
}

export type VvChoiceFollowUp =
  | "schedule-edit"
  | "schedule-cancel"
  | "meeting-join"
  | "drive-download"
  | "drive-share"

export type VvAssistantPayload =
  | { kind: "schedule-agenda"; items: VvScheduleItem[]; /** 默认「今日日程如下」；单条回显时用「日程已更新」等 */ heading?: string }
  /** 全部日程：聊天内大卡片（左月历 + 右列表），与 CUI+GUI 一致 */
  | {
      kind: "schedule-all"
      items: VvScheduleItem[]
      /** 从助手打开时默认视图；缺省为列表 */
      initialViewMode?: "list" | "day" | "week" | "month"
      /** 本卡片独立筛选初值（与底栏入口/其他卡片互不同步） */
      initialOwnCalendarsVisible?: Record<string, boolean>
      initialSubscribedCalendarsVisible?: Record<string, boolean>
    }
  | {
      kind: "todo-list"
      title: string
      description: string
      /** 卡片内 Tab 聚合视图 */
      hub?: true
      /** compact=我的待办；full=全部待办（搜索、归档、滑动行） */
      hubMode?: "compact" | "full"
      allItems?: VvTodoItem[]
      initialTab?: VvTodoHubTab
      /** 旧版单列表（非 hub） */
      items?: VvTodoItem[]
      filter?: string
    }
  | { kind: "meeting-start-form"; draft: VvMeetingStartFormDraft }
  | { kind: "approval-start-form"; draft: VvApprovalStartFormDraft }
  /** 全部流程：按分类展示审批入口 */
  | { kind: "approval-process-hub"; sections?: VvApprovalProcessHubSection[] }
  | { kind: "mail-compose-form"; draft: VvMailComposeFormDraft }
  | { kind: "todo-detail"; item: VvTodoItem }
  | { kind: "mail-list"; title: string; description: string; items: VvMailItem[] }
  | { kind: "mail-detail"; item: VvMailItem }
  | { kind: "meeting-list"; title: string; description: string; items: VvMeetingItem[]; variant?: "join" | "default" }
  /** 加入会议：会议号 + 昵称 + 媒体开关，确认后唤起客户端（演示为 CustomEvent） */
  | { kind: "meeting-join-card"; displayName: string }
  /** 今日会议列表（会议二级应用进入时与日程「今日日程」对应） */
  | { kind: "meeting-agenda"; items: VvMeetingItem[]; heading?: string }
  | { kind: "meeting-detail"; item: VvMeetingItem }
  | { kind: "record-list"; title: string; description: string; items: VvRecordItem[] }
  /** 会议记录：Tab 筛选 + 时间轴会议卡片（替代旧版 record-list 主入口） */
  | { kind: "meeting-record-hub"; items: VvMeetingRecordHubItem[] }
  | { kind: "record-detail"; item: VvRecordItem }
  | { kind: "drive-list"; title: string; description: string; items: VvDriveItem[] }
  | { kind: "doc-list"; title: string; description: string; items: VvDocItem[] }
  | { kind: "doc-detail"; item: VvDocItem }
  | {
      kind: "choice"
      title: string
      description: string
      items: VvChoiceItem[]
      followUp: VvChoiceFollowUp
    }
  | {
      kind: "free-slots"
      title: string
      description: string
      slots: VvFreeSlot[]
      /** 点选时段后的分支：新建日程 vs 预约会议 */
      purpose?: "schedule-create" | "meeting-book"
    }
  | { kind: "schedule-detail"; item: VvScheduleItem }
  /** 从日程详情侧栏关闭返回后追加：可再次点开同一日程的子对话 */
  | {
      kind: "schedule-side-session-link"
      scheduleId: string
      closedAtMs: number
      /** 打开侧栏时的线程上下文，与 `openScheduleSideSheet` 一致 */
      panelAppId: string | null
      panelSurface: "main" | "floating"
      floatingHostAppId?: string | null
    }
  | { kind: "schedule-edit"; item: VvScheduleItem; draft: VvScheduleEditDraft }
  | {
      kind: "schedule-create"
      draft: VvScheduleCreateDraft
      viaFreeSlots?: boolean
      /** 演示：打开新建日程后自动弹出「批量添加参与人」全屏选人 */
      openBatchAttendees?: boolean
    }
  | { kind: "schedule-notify-draft"; text: string; targetText: string }
  | {
      kind: "schedule-cancel-confirm"
      item: VvScheduleItem
      reason: string
      /** 已在对话内确认取消：卡片置灰且不可再操作 */
      completed?: boolean
    }
  /** 日历基础设置：表单状态与全局 prefs 同步，可用自然语言修改 */
  /** initialPrefs：自然语言预填后的草稿，确认前不写全局；缺省则与侧栏/口令打开一致，直接绑全局 */
  | { kind: "schedule-calendar-settings"; initialPrefs?: VvScheduleCalendarPrefs }
  /** 确认保存后的只读快照；「修改设置」进入表单，确认后回到本卡展示态 */
  | { kind: "schedule-calendar-settings-summary"; prefs: VvScheduleCalendarPrefs }
  /** 新建日历：表单内完成创建或关闭，不追加新对话气泡 */
  | {
      kind: "schedule-calendar-create"
      draft?: VvCalendarCreateDraft
      completed?: boolean
      createdCalendarId?: string
    }
  /** 订阅同事日历：搜索 + 查看/订阅（菜单「订阅日历」或确认后进入） */
  | { kind: "schedule-subscribe-colleague"; initialQuery?: string }
  /** 自然语言指定姓名时：先确认再进入订阅卡片 */
  | { kind: "schedule-subscribe-confirm"; colleagueName: string; completed?: boolean }
  /** 取消订阅指定同事日历（确认后从「我订阅的」移除） */
  | { kind: "schedule-unsubscribe-confirm"; colleagueName: string; completed?: boolean }
  | {
      kind: "vv-success"
      title: string
      description: string
      /** 省略则不展示摘要行 */
      summary?: string
      tone?: "default" | "red"
      actions: { label: string; action: VvSuccessAction }[]
    }
  | { kind: "assistant-text"; text: string }

export type VvMessageMeta = {
  commandHint?: string | null
  showCommandHint?: boolean
  isRecognizing?: boolean
}

export type VvFlow =
  | null
  | { type: "select-schedule"; mode: "edit" | "cancel"; candidateIds: string[] }
  | {
      type: "schedule-free-slots"
      /** 选时段后带入新建日程表单（与发起共同空闲的指令一致） */
      defaultCreateDraft?: { title: string; attendees: string; location?: string }
    }
  | {
      type: "meeting-free-slots"
      defaultMeetingDraft: { title: string; participants: string; room: string }
    }
  | { type: "schedule-create"; draft: VvScheduleCreateDraft; viaFreeSlots: boolean }
  | { type: "schedule-edit"; scheduleId: string; draft: VvScheduleEditDraft }
  | { type: "schedule-cancel"; scheduleId: string; reason: string }
  | { type: "meeting-start"; draft: VvMeetingStartFormDraft }
  | { type: "approval-start"; draft: VvApprovalStartFormDraft }
  | { type: "mail-compose" }
  | { type: "select-meeting-join"; candidateIds: string[] }
  | { type: "select-record"; candidateIds: string[] }
  | { type: "select-drive-download"; candidateIds: string[] }
  | { type: "select-drive-share"; candidateIds: string[] }

export type VvContext = {
  scheduleItems: VvScheduleItem[]
  todoItems: VvTodoItem[]
  mailItems: VvMailItem[]
  meetingItems: VvMeetingItem[]
  recordItems: VvRecordItem[]
  driveItems: VvDriveItem[]
  docItems: VvDocItem[]
}
