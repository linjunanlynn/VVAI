/**
 * 与 ai生成/助手 App.jsx 中 handleCommand 关键字一致的可发送文案。
 * 待办分栏在「我的待办」卡片内切换；「示例指令」避免与底栏快捷指令重复，侧重自然语言演示。
 */
export type GeneralQuickCommand = {
  label: string
  sendText: string
}

/** 输入栏「示例指令」：展示文案 + 实际发送内容（与 vvPlan / 演示数据一致） */
export type NaturalExampleCommand = {
  label: string
  sendText: string
  /** 列表中的补充说明 */
  hint?: string
}

const todo: GeneralQuickCommand[] = [
  { label: "我的待办", sendText: "我的待办" },
  { label: "发起审批", sendText: "发起审批" },
  { label: "全部流程", sendText: "全部流程" },
]

/** 通用首页置顶卡下方快捷（已按产品要求移除，保留空数组避免误用旧入口） */
export const HOME_PINNED_QUICK_COMMANDS: GeneralQuickCommand[] = []

/** 主 AI 底栏与二级应用内「切换应用」中可进入的二级应用，其余入口仅展示、点击无响应 */
export const INTERACTIVE_SECONDARY_APP_IDS = new Set<string>(["schedule", "meeting", "education"])

/** 待办二级应用底栏 */
export const TODO_APP_QUICK_COMMANDS: GeneralQuickCommand[] = [
  { label: "我的待办", sendText: "我的待办" },
  { label: "全部待办", sendText: "全部待办" },
  { label: "发起审批", sendText: "发起审批" },
  { label: "全部流程", sendText: "全部流程" },
]

/** 会议二级应用底栏 */
export const MEETING_APP_QUICK_COMMANDS: GeneralQuickCommand[] = [
  { label: "发起会议", sendText: "发起会议" },
  { label: "预约会议", sendText: "预约会议" },
  { label: "加入会议", sendText: "加入会议" },
  { label: "会议记录", sendText: "会议记录" },
]

/** 日程二级应用底栏（发送对话）；「我的日程」对应原「全部日程」语义 */
export const SCHEDULE_APP_QUICK_COMMANDS: GeneralQuickCommand[] = [
  { label: "我的日程", sendText: "全部日程" },
  { label: "今日日程", sendText: "查询今日日程" },
  { label: "新建日程", sendText: "新建日程" },
]

/** @deprecated 已由 MainAIChatWindow 内 ScheduleToolbarCalendarFilters（Popover 筛选）替代，保留标签字面量供文案/检索 */
export const SCHEDULE_APP_TOOLBAR_PLACEHOLDER_LABELS = ["我管理的", "我订阅的"] as const

export const MAIL_APP_QUICK_COMMANDS: GeneralQuickCommand[] = [
  { label: "收件箱", sendText: "收件箱" },
  { label: "新建邮件", sendText: "新建邮件" },
]

export const DRIVE_APP_QUICK_COMMANDS: GeneralQuickCommand[] = [
  { label: "我的文件", sendText: "我的文件" },
  { label: "上传文件", sendText: "上传文件" },
  { label: "下载文件", sendText: "下载文件" },
  { label: "共享文件", sendText: "共享文件" },
]

export const DOCS_APP_QUICK_COMMANDS: GeneralQuickCommand[] = [
  { label: "全部文档", sendText: "全部文档" },
  { label: "我创建的", sendText: "我创建的" },
  { label: "与我共享", sendText: "与我共享" },
  { label: "我收藏的", sendText: "我收藏的" },
]

/** 会议二级应用：自然语言演示 */
export const MEETING_NATURAL_EXAMPLE_COMMANDS: NaturalExampleCommand[] = [
  { label: "我现在要发起一场会议", sendText: "我现在要发起会议", hint: "含「发起会议」→ 预约/表单（与底栏「预约会议」同类）" },
  { label: "预约明天下午的评审会", sendText: "预约会议", hint: "与「新建日程」同款创建卡片，地点默认微微会议" },
  { label: "怎么加入进行中的会议？", sendText: "我想加入会议", hint: "含「加入会议」→ 会议号加入卡片" },
  { label: "上一场会的记录在哪看？", sendText: "查看会议记录", hint: "含「会议记录」→ 记录列表" },
]

/** 通用工作台：自然语言演示（会议相关已迁至「会议」应用） */
export const GENERAL_NATURAL_EXAMPLE_COMMANDS: NaturalExampleCommand[] = [
  {
    label: "微微 AI 是做什么的？",
    sendText: "微微 AI 是做什么的？",
    hint: "微微科技与 V V AI 产品介绍",
  },
  { label: "打开我的待办中心", sendText: "打开我的全部待办", hint: "与「我的待办」一致 → 我的待办卡片" },
  { label: "打开全部待办列表", sendText: "全部待办", hint: "含「全部待办」→ 归档大列表，可下滑加载更早" },
  { label: "待处理事项", sendText: "待处理", hint: "待办 · 待处理分栏" },
  { label: "抄送我的待办", sendText: "抄送我", hint: "待办 · 抄送我" },
  { label: "待办草稿", sendText: "草稿", hint: "待办 · 草稿分栏" },
  { label: "帮我走一条审批", sendText: "帮我发起审批", hint: "含「发起审批」→ 审批表单" },
  { label: "查看全部审批流程", sendText: "全部流程", hint: "打开流程中心，点选后进入发起审批" },
]

/** 待办二级应用：自然语言演示（与通用待办类指令一致） */
export const TODO_NATURAL_EXAMPLE_COMMANDS: NaturalExampleCommand[] = GENERAL_NATURAL_EXAMPLE_COMMANDS

/** 日程二级应用：展示标题 label 与发送内容 sendText 一致（ChatSender 黑体行展示 label） */
export const SCHEDULE_NATURAL_EXAMPLE_COMMANDS: NaturalExampleCommand[] = [
  {
    label: "微微 AI 是做什么的？",
    sendText: "微微 AI 是做什么的？",
    hint: "微微科技与 V V AI 产品介绍（自然语言直答）",
  },
  {
    label: "我想查看本周的全部日程",
    sendText: "我想查看本周的全部日程",
    hint: "全部日程卡片，默认周视图",
  },
  {
    label:
      "请新建一条日程：标题\u201c客户回访（华东）预演\u201d，时间\u201c下周五 14:00 - 15:00\u201d，地点\u201c线上\u201d，参与人\u201c李四、王五\u201d。",
    sendText:
      "请新建一条日程：标题\u201c客户回访（华东）预演\u201d，时间\u201c下周五 14:00 - 15:00\u201d，地点\u201c线上\u201d，参与人\u201c李四、王五\u201d。",
    hint: "parseDirectScheduleIntent 新建句式 → 预填新建表单，确认后创建",
  },
  {
    label:
      "请取消\u201c设计评审日程\u201d这条日程，取消原因是\u201c时间冲突\u201d，并且通知相关参与人。",
    sendText:
      "请取消\u201c设计评审日程\u201d这条日程，取消原因是\u201c时间冲突\u201d，并且通知相关参与人。",
    hint: "parseDirectScheduleIntent 取消句式 → 确认删除卡片，确认后执行",
  },
  {
    label:
      "请把\u201c增长策略评审日程\u201d这条日程修改为：标题\u201c增长策略评审日程\u201d，时间 17:00 - 18:00，地点\u201c线上协作\u201d，提醒\u201c开始时提醒，5 分钟前提醒\u201d。",
    sendText:
      "请把\u201c增长策略评审日程\u201d这条日程修改为：标题\u201c增长策略评审日程\u201d，时间 17:00 - 18:00，地点\u201c线上协作\u201d，提醒\u201c开始时提醒，5 分钟前提醒\u201d。",
    hint: "parseDirectScheduleIntent 修改句式 → 预填编辑表单，确认后保存",
  },
  {
    label: "这周王总和陈总什么时候方便开会，帮我找共同空闲时间",
    sendText: "这周王总和陈总什么时候方便开会，帮我找共同空闲时间",
    hint: "共同空闲卡片 → 选时段 → 新建日程（王总、陈总）",
  },
  {
    label: "把每周第一天改为周一",
    sendText: "把每周第一天改为周一",
    hint: "预填日历基础设置卡片，确认后写入",
  },
  { label: "订阅日历", sendText: "订阅日历", hint: "同事日历搜索卡片" },
  { label: "订阅李老板的日历", sendText: "订阅李老板的日历", hint: "确认卡片上完成订阅" },
  {
    label: "取消订阅李老板的日历",
    sendText: "取消订阅李老板的日历",
    hint: "确认后从「我订阅的」移除，日视图不再对比其忙碌",
  },
]

/** 邮箱域：与 vvPlan 收件箱 / 新建邮件 / 主题命中一致 */
export const MAIL_NATURAL_EXAMPLE_COMMANDS: NaturalExampleCommand[] = [
  { label: "打开收件箱", sendText: "收件箱", hint: "收件箱列表" },
  { label: "新建邮件（说明）", sendText: "新建邮件", hint: "打开表单；确认后生成 vvcli mail send" },
  {
    label: "新建邮件（完整示例）",
    sendText:
      "请新建邮件：收件人「设计组,研发组」，抄送「王五」，主题「设计评审结论同步」，内容「首页改版交互已确认，今晚发版前请同步结论。」",
    hint: "打开新建邮件表单并预填；确认后识别 vvcli mail send",
  },
  {
    label: "查看邮件「设计评审纪要待补充」",
    sendText: "设计评审纪要待补充",
    hint: "主题命中 → 邮件详情",
  },
]

/** 微盘：列表 / 上传说明 / 下载与共享选择 / 文件名命中 */
export const DRIVE_NATURAL_EXAMPLE_COMMANDS: NaturalExampleCommand[] = [
  { label: "我的文件", sendText: "我的文件", hint: "微盘文件列表" },
  { label: "上传文件（说明）", sendText: "上传文件", hint: "提示上传话术模板" },
  {
    label: "上传文件（完整示例）",
    sendText:
      "上传文件。请上传一个文件：文件名「新版本发布说明.pdf」，目录「/我的文件/版本发布」，文件类型「PDF」。",
    hint: "含「上传文件」→ 助手提示 vvcli drive upload 模板",
  },
  { label: "下载文件", sendText: "下载文件", hint: "选择文件 → 模拟下载指令" },
  { label: "共享文件", sendText: "共享文件", hint: "选择文件 → 共享说明" },
  {
    label: "定位文件「Q2-增长复盘.pdf」",
    sendText: "Q2-增长复盘.pdf",
    hint: "文件名命中 → 列表聚焦",
  },
]

/** 文档：筛选列表 + 标题打开详情 */
export const DOCS_NATURAL_EXAMPLE_COMMANDS: NaturalExampleCommand[] = [
  { label: "全部文档", sendText: "全部文档", hint: "文档列表" },
  { label: "我创建的文档", sendText: "我创建的", hint: "我创建的筛选" },
  { label: "与我共享的文档", sendText: "与我共享", hint: "共享筛选" },
  { label: "我收藏的文档", sendText: "我收藏的", hint: "收藏筛选" },
  {
    label: "打开「首页改版需求说明」",
    sendText: "首页改版需求说明",
    hint: "标题命中 → 文档详情",
  },
  {
    label: "打开「Q2 增长复盘」",
    sendText: "Q2 增长复盘",
    hint: "标题命中 → 文档详情",
  },
]

export function naturalExampleCommandsForApp(activeAppId: string | null): NaturalExampleCommand[] {
  if (activeAppId === "schedule") return SCHEDULE_NATURAL_EXAMPLE_COMMANDS
  if (activeAppId === "meeting") return MEETING_NATURAL_EXAMPLE_COMMANDS
  if (activeAppId === "todo") return TODO_NATURAL_EXAMPLE_COMMANDS
  if (activeAppId === "mail") return MAIL_NATURAL_EXAMPLE_COMMANDS
  if (activeAppId === "disk") return DRIVE_NATURAL_EXAMPLE_COMMANDS
  if (activeAppId === "document") return DOCS_NATURAL_EXAMPLE_COMMANDS
  if (activeAppId === null || activeAppId === "general") return GENERAL_NATURAL_EXAMPLE_COMMANDS
  return []
}

/** 走 vv 规划、与演示数据交互的二级应用 id */
export const VV_SECONDARY_APP_IDS = ["schedule", "meeting", "todo", "mail", "disk", "document"] as const
export type VvSecondaryAppId = (typeof VV_SECONDARY_APP_IDS)[number]

export function isVvSecondaryApp(appId: string | null): appId is VvSecondaryAppId {
  return appId !== null && (VV_SECONDARY_APP_IDS as readonly string[]).includes(appId)
}
