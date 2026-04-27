import type {
  VvColleagueCalendarHit,
  VvDocItem,
  VvDriveItem,
  VvFreeSlot,
  VvMailItem,
  VvMeetingItem,
  VvMeetingRecordHubItem,
  VvRecordItem,
  VvScheduleItem,
  VvSubscribedCalendar,
  VvTodoItem,
  VvUserCalendarType,
} from "./types"

export const CURRENT_USER = "我"

/** 日程演示中与当前用户对应的姓名（组织人、参与人；与 scheduleSeed.organizerName 一致） */
export const SCHEDULE_CURRENT_USER_NAME = "陈廷凯"

export const CAL_DEFAULT_ID = "cal-default"
export const CAL_FITNESS_ID = "cal-fitness"

/** 默认可选日历类型（可在「全部日程」侧栏增删，与 UserCalendarsProvider 同步） */
export const DEFAULT_USER_CALENDAR_TYPES: VvUserCalendarType[] = [
  { id: CAL_DEFAULT_ID, name: "我的日程", color: "#1890ff" },
  { id: CAL_FITNESS_ID, name: "健身日历", color: "#fa8c16" },
]

/** 演示：订阅他人日历，日视图对比忙碌（无标题） */
export const subscribedCalendarsSeed: VvSubscribedCalendar[] = [
  {
    id: "sub-chentingkai",
    displayName: "陈廷凯",
    color: "#ff4d4f",
    busyIntervals: [
      { calendarDate: "2026-04-08", start: "14:00", end: "15:30" },
      { calendarDate: "2026-04-08", start: "16:00", end: "17:00" },
    ],
  },
]

/** 同事 id → 日视图忙碌条颜色（与「我订阅的」勾选列一致） */
const colleagueSubscribedColors: Record<string, string> = {
  "col-liban": "#722ed1",
  "col-lisi": "#13c2c2",
  "col-wangwu": "#eb2f96",
  "col-zhaoliu": "#52c41a",
}

/** 同事 id → 演示用忙碌区间（与 scheduleSeed 演示日对齐） */
const colleagueSubscribedBusy: Record<string, VvSubscribedCalendar["busyIntervals"]> = {
  "col-liban": [
    { calendarDate: "2026-04-08", start: "09:00", end: "10:30" },
    { calendarDate: "2026-04-08", start: "15:00", end: "16:00" },
  ],
  "col-lisi": [
    { calendarDate: "2026-04-08", start: "10:00", end: "11:30" },
    { calendarDate: "2026-04-08", start: "13:00", end: "14:00" },
  ],
  "col-wangwu": [
    { calendarDate: "2026-04-08", start: "11:00", end: "12:00" },
    { calendarDate: "2026-04-08", start: "17:00", end: "18:00" },
  ],
  "col-zhaoliu": [{ calendarDate: "2026-04-08", start: "08:30", end: "09:30" }],
}

const defaultColleagueSubscribedBusy: VvSubscribedCalendar["busyIntervals"] = [
  { calendarDate: "2026-04-08", start: "11:00", end: "12:00" },
]

/** 将通讯录中的同事转为「我订阅的」日历项（与 UserCalendarsProvider.subscribedColleagueIds 联动） */
export function subscribedCalendarFromColleagueId(colleagueId: string, displayName: string): VvSubscribedCalendar {
  const color = colleagueSubscribedColors[colleagueId] ?? "#8c8c8c"
  const busy = colleagueSubscribedBusy[colleagueId] ?? defaultColleagueSubscribedBusy
  return {
    id: `sub-${colleagueId}`,
    displayName,
    color,
    busyIntervals: [...busy],
  }
}

/** 同事日历订阅检索演示数据 */
export const colleagueCalendarDirectorySeed: VvColleagueCalendarHit[] = [
  { id: "col-liban", name: "李老板", orgShortName: "VV AI教育" },
  { id: "col-lisi", name: "李四", orgShortName: "微微集团" },
  { id: "col-wangwu", name: "王五", orgShortName: "商业化中心" },
  { id: "col-zhaoliu", name: "赵六", orgShortName: "研发部" },
]

/** 合并种子订阅与流程中新增的订阅同事，供「全部日程」与底栏筛选共用 */
export function mergeSubscribedCalendarsForUser(subscribedColleagueIds: string[]): VvSubscribedCalendar[] {
  const fromFlow: VvSubscribedCalendar[] = []
  for (const cid of subscribedColleagueIds) {
    if (cid.startsWith("nl:")) {
      const displayName = cid.slice(3).trim() || cid
      fromFlow.push(subscribedCalendarFromColleagueId(cid, displayName))
    } else {
      const hit = colleagueCalendarDirectorySeed.find((c) => c.id === cid)
      const displayName = hit?.name ?? cid
      fromFlow.push(subscribedCalendarFromColleagueId(cid, displayName))
    }
  }
  const seen = new Set(fromFlow.map((s) => s.id))
  return [...subscribedCalendarsSeed.filter((s) => !seen.has(s.id)), ...fromFlow]
}

export function findColleagueDirectoryEntryByName(name: string): VvColleagueCalendarHit | undefined {
  const t = name.trim()
  return colleagueCalendarDirectorySeed.find((c) => c.name === t)
}

export const scheduleSeed: VvScheduleItem[] = [
  {
    id: "s2",
    title: "增长策略评审日程",
    start: "14:00",
    end: "15:00",
    time: "14:00 - 15:00",
    location: "线上协作",
    attendees: ["李四", "王五", "陈廷凯", "商业化团队"],
    reminder: "开始时提醒，5 分钟前提醒",
    notes: "评审新增投放方案、留存实验与预算调配。",
    status: "attention",
    dateLabel: "今天",
    linkedMeetingId: "m1",
    organization: "微微集团",
    organizerName: "陈廷凯",
    calendarDate: "2026-04-08",
    calendarTypeId: CAL_DEFAULT_ID,
    meetingNumber: "715168009",
    attendeeRsvp: {
      李四: "accepted",
      王五: "pending",
      商业化团队: "pending",
    },
  },
  {
    id: "s-invite-self-pending",
    title: "季度材料预审（待你确认）",
    start: "15:30",
    end: "16:00",
    time: "15:30 - 16:00",
    location: "线上",
    attendees: ["陈廷凯", "王五"],
    reminder: "",
    notes: "李四发起，请确认是否参与。",
    status: "confirmed",
    dateLabel: "今天",
    linkedMeetingId: null,
    organization: "微微集团",
    organizerName: "李四",
    calendarDate: "2026-04-08",
    calendarTypeId: CAL_DEFAULT_ID,
    attendeeRsvp: {
      王五: "accepted",
    },
  },
  {
    id: "s3",
    title: "设计评审日程",
    start: "16:00",
    end: "16:30",
    time: "16:00 - 16:30",
    location: "线上协作",
    attendees: ["李四", "设计组"],
    reminder: "开始前 10 分钟",
    notes: "确认新版本首页交互和卡片规范。",
    status: "confirmed",
    dateLabel: "今天",
    linkedMeetingId: "m2",
    organization: "微微集团",
    organizerName: "陈廷凯",
    calendarDate: "2026-04-08",
    calendarTypeId: CAL_DEFAULT_ID,
    meetingNumber: "892441256",
    attendeeRsvp: {
      李四: "accepted",
      设计组: "tentative",
    },
  },
  {
    id: "s-mar-1",
    title: "S4 迭代规划会",
    start: "13:30",
    end: "15:00",
    time: "13:30 - 15:00",
    location: "会议室 A",
    attendees: ["产品组", "研发组"],
    reminder: "开始前提醒",
    notes: "",
    status: "confirmed",
    dateLabel: "周一",
    linkedMeetingId: null,
    organization: "微微集团",
    organizerName: "陈廷凯",
    calendarDate: "2026-03-02",
    calendarTypeId: CAL_DEFAULT_ID,
    attendeeRsvp: {
      产品组: "accepted",
      研发组: "pending",
    },
  },
  {
    id: "s-mar-1b",
    title: "站会同步",
    start: "09:30",
    end: "10:00",
    time: "09:30 - 10:00",
    location: "工位区",
    attendees: ["研发组"],
    reminder: "",
    notes: "",
    status: "confirmed",
    dateLabel: "周一",
    linkedMeetingId: null,
    organization: "微微集团",
    organizerName: "陈廷凯",
    calendarDate: "2026-03-02",
    calendarTypeId: CAL_DEFAULT_ID,
    attendeeRsvp: {
      研发组: "accepted",
    },
  },
  {
    id: "s-mar-1c",
    title: "设计稿补充评审",
    start: "16:00",
    end: "17:00",
    time: "16:00 - 17:00",
    location: "会议室 B",
    attendees: ["设计组", "产品组"],
    reminder: "",
    notes: "",
    status: "confirmed",
    dateLabel: "周一",
    linkedMeetingId: null,
    organization: "微微集团",
    organizerName: "陈廷凯",
    calendarDate: "2026-03-02",
    calendarTypeId: CAL_DEFAULT_ID,
    attendeeRsvp: {
      设计组: "accepted",
      产品组: "pending",
    },
  },
  {
    id: "s-mar-2",
    title: "周会同步",
    start: "10:00",
    end: "11:00",
    time: "10:00 - 11:00",
    location: "线上",
    attendees: ["李四", "王五"],
    reminder: "",
    notes: "",
    status: "confirmed",
    dateLabel: "周三",
    linkedMeetingId: null,
    organization: "微微集团",
    organizerName: "陈廷凯",
    calendarDate: "2026-03-03",
    calendarTypeId: CAL_DEFAULT_ID,
    attendeeRsvp: {
      李四: "accepted",
      王五: "accepted",
    },
  },
  {
    id: "s-mar-2b",
    title: "需求澄清短会",
    start: "15:00",
    end: "15:30",
    time: "15:00 - 15:30",
    location: "线上",
    attendees: ["产品组", "李四"],
    reminder: "",
    notes: "",
    status: "confirmed",
    dateLabel: "周三",
    linkedMeetingId: null,
    organization: "微微集团",
    organizerName: "陈廷凯",
    calendarDate: "2026-03-03",
    calendarTypeId: CAL_DEFAULT_ID,
    attendeeRsvp: {
      产品组: "accepted",
      李四: "tentative",
    },
  },
  {
    id: "s-mar-5a",
    title: "账单支持多商品支付底层逻辑框架沟通",
    start: "13:30",
    end: "14:30",
    time: "13:30 - 14:30",
    location: "会议室",
    attendees: ["支付组", "产品组"],
    reminder: "",
    notes: "",
    status: "confirmed",
    dateLabel: "周四",
    linkedMeetingId: null,
    organization: "微微集团",
    organizerName: "陈廷凯",
    calendarDate: "2026-03-05",
    calendarTypeId: CAL_DEFAULT_ID,
    attendeeRsvp: {
      支付组: "accepted",
      产品组: "accepted",
    },
  },
  {
    id: "s-mar-5b",
    title: "open claw接入飞书能力分享",
    start: "15:00",
    end: "16:00",
    time: "15:00 - 16:00",
    location: "线上",
    attendees: ["研发组", "产品组"],
    reminder: "",
    notes: "",
    status: "confirmed",
    dateLabel: "周四",
    linkedMeetingId: null,
    organization: "微微集团",
    organizerName: "陈廷凯",
    calendarDate: "2026-03-05",
    calendarTypeId: CAL_DEFAULT_ID,
    attendeeRsvp: {
      研发组: "accepted",
      产品组: "accepted",
    },
  },
  {
    id: "s-mar-3",
    title: "模板上线走查",
    start: "14:00",
    end: "15:30",
    time: "14:00 - 15:30",
    location: "线上协作",
    attendees: ["设计组", "研发组"],
    reminder: "",
    notes: "",
    status: "cancelled",
    dateLabel: "周四",
    linkedMeetingId: null,
    organization: "微微集团",
    organizerName: "陈廷凯",
    calendarDate: "2026-03-06",
    calendarTypeId: CAL_DEFAULT_ID,
  },
  /** 2026 年 4 月：分散在工作日的演示日程（4/4 为周六「今天」，不计入工作日；此处覆盖 ≥10 个工作日） */
  {
    id: "s-apr-wd-0401",
    title: "Q2 目标对齐短会",
    start: "10:00",
    end: "11:00",
    time: "10:00 - 11:00",
    location: "会议室 201",
    attendees: ["产品组", "李四"],
    reminder: "",
    notes: "已结束：对齐北极星指标与资源边界。",
    status: "confirmed",
    dateLabel: "周三",
    linkedMeetingId: null,
    organization: "微微集团",
    organizerName: "陈廷凯",
    calendarDate: "2026-04-01",
    calendarTypeId: CAL_DEFAULT_ID,
    attendeeRsvp: { 产品组: "accepted", 李四: "accepted" },
  },
  {
    id: "s-apr-wd-0402",
    title: "支付接口联调窗口",
    start: "14:30",
    end: "16:00",
    time: "14:30 - 16:00",
    location: "线上",
    attendees: ["研发组", "支付组"],
    reminder: "",
    notes: "已结束：联调环境与回调地址确认。",
    status: "confirmed",
    dateLabel: "周四",
    linkedMeetingId: null,
    organization: "微微集团",
    organizerName: "陈廷凯",
    calendarDate: "2026-04-02",
    calendarTypeId: CAL_DEFAULT_ID,
    attendeeRsvp: { 研发组: "accepted", 支付组: "accepted" },
  },
  {
    id: "s-apr-wd-0403",
    title: "周报汇总与风险提示",
    start: "15:00",
    end: "15:45",
    time: "15:00 - 15:45",
    location: "飞书会议",
    attendees: ["商业化团队", "王五"],
    reminder: "",
    notes: "已结束：收口本周投放与线索波动。",
    status: "confirmed",
    dateLabel: "周五",
    linkedMeetingId: null,
    organization: "微微集团",
    organizerName: "陈廷凯",
    calendarDate: "2026-04-03",
    calendarTypeId: CAL_DEFAULT_ID,
    attendeeRsvp: { 商业化团队: "accepted", 王五: "accepted" },
  },
  {
    id: "s-apr-wd-0406",
    title: "迭代 Kickoff",
    start: "09:30",
    end: "10:30",
    time: "09:30 - 10:30",
    location: "大会议室",
    attendees: ["研发组", "产品组", "设计组"],
    reminder: "开始前 10 分钟",
    notes: "范围、里程碑与风险登记。",
    status: "confirmed",
    dateLabel: "周一",
    linkedMeetingId: null,
    organization: "微微集团",
    organizerName: "陈廷凯",
    calendarDate: "2026-04-06",
    calendarTypeId: CAL_DEFAULT_ID,
    attendeeRsvp: { 研发组: "accepted", 产品组: "pending", 设计组: "tentative" },
  },
  {
    id: "s-apr-wd-0407",
    title: "数据看板需求评审",
    start: "11:00",
    end: "12:00",
    time: "11:00 - 12:00",
    location: "线上文档",
    attendees: ["数据组", "产品组"],
    reminder: "",
    notes: "指标口径与刷新频率。",
    status: "confirmed",
    dateLabel: "周二",
    linkedMeetingId: null,
    organization: "微微集团",
    organizerName: "陈廷凯",
    calendarDate: "2026-04-07",
    calendarTypeId: CAL_DEFAULT_ID,
    attendeeRsvp: { 数据组: "accepted", 产品组: "accepted" },
  },
  {
    id: "s-apr-wd-0408-a",
    title: "合规培训（全员）",
    start: "09:00",
    end: "10:30",
    time: "09:00 - 10:30",
    location: "线上直播",
    attendees: ["全员"],
    reminder: "",
    notes: "与订阅日历演示日对齐，上午场。",
    status: "confirmed",
    dateLabel: "周三",
    linkedMeetingId: null,
    organization: "微微集团",
    organizerName: "陈廷凯",
    calendarDate: "2026-04-08",
    calendarTypeId: CAL_DEFAULT_ID,
    attendeeRsvp: { 全员: "accepted" },
  },
  {
    id: "s-apr-wd-0408-b",
    title: "客户方案预演",
    start: "18:00",
    end: "19:00",
    time: "18:00 - 19:00",
    location: "会议室 C",
    attendees: ["商务组", "售前组"],
    reminder: "",
    notes: "晚间场，演示材料终稿。",
    status: "attention",
    dateLabel: "周三",
    linkedMeetingId: null,
    organization: "微微集团",
    organizerName: "陈廷凯",
    calendarDate: "2026-04-08",
    calendarTypeId: CAL_DEFAULT_ID,
    attendeeRsvp: { 商务组: "accepted", 售前组: "pending" },
  },
  {
    id: "s-apr-wd-0409",
    title: "招聘面试：资深前端",
    start: "14:00",
    end: "15:00",
    time: "14:00 - 15:00",
    location: "线上面试",
    attendees: ["HR", "研发组"],
    reminder: "",
    notes: "候选人作品集与系统设计题。",
    status: "confirmed",
    dateLabel: "周四",
    linkedMeetingId: null,
    organization: "微微集团",
    organizerName: "陈廷凯",
    calendarDate: "2026-04-09",
    calendarTypeId: CAL_DEFAULT_ID,
    attendeeRsvp: { HR: "accepted", 研发组: "accepted" },
  },
  {
    id: "s-apr-wd-0410",
    title: "版本冻结前回归清单确认",
    start: "16:30",
    end: "17:30",
    time: "16:30 - 17:30",
    location: "工位区",
    attendees: ["测试组", "研发组"],
    reminder: "",
    notes: "P0/P1 用例与发布窗口。",
    status: "confirmed",
    dateLabel: "周五",
    linkedMeetingId: null,
    organization: "微微集团",
    organizerName: "陈廷凯",
    calendarDate: "2026-04-10",
    calendarTypeId: CAL_DEFAULT_ID,
    attendeeRsvp: { 测试组: "accepted", 研发组: "pending" },
  },
  {
    id: "s-apr-wd-0413",
    title: "跨部门资源协调会",
    start: "10:30",
    end: "11:30",
    time: "10:30 - 11:30",
    location: "会议室 A",
    attendees: ["李四", "王五", "财务BP"],
    reminder: "",
    notes: "人力与预算占位对齐。",
    status: "confirmed",
    dateLabel: "周一",
    linkedMeetingId: null,
    organization: "微微集团",
    organizerName: "陈廷凯",
    calendarDate: "2026-04-13",
    calendarTypeId: CAL_DEFAULT_ID,
    attendeeRsvp: { 李四: "accepted", 王五: "tentative", 财务BP: "pending" },
  },
  {
    id: "s-apr-wd-0414",
    title: "健身：私教课",
    start: "19:00",
    end: "20:00",
    time: "19:00 - 20:00",
    location: "健身房",
    attendees: [],
    reminder: "",
    notes: "未发生：晚间个人安排。",
    status: "confirmed",
    dateLabel: "周二",
    linkedMeetingId: null,
    organization: "微微集团",
    organizerName: "陈廷凯",
    calendarDate: "2026-04-14",
    calendarTypeId: CAL_FITNESS_ID,
  },
  {
    id: "s-apr-wd-0422",
    title: "季度业务复盘（封闭）",
    start: "13:00",
    end: "17:00",
    time: "13:00 - 17:00",
    location: "总部报告厅",
    attendees: ["管理层", "各业务负责人"],
    reminder: "开始前 1 小时",
    notes: "未发生：4 月下旬封闭复盘。",
    status: "confirmed",
    dateLabel: "周三",
    linkedMeetingId: null,
    organization: "微微集团",
    organizerName: "陈廷凯",
    calendarDate: "2026-04-22",
    calendarTypeId: CAL_DEFAULT_ID,
    attendeeRsvp: { 管理层: "accepted", 各业务负责人: "pending" },
  },
  {
    id: "s-apr-wd-0429",
    title: "五一前安全与值班宣导",
    start: "15:00",
    end: "16:00",
    time: "15:00 - 16:00",
    location: "线上",
    attendees: ["全员"],
    reminder: "",
    notes: "未发生：节前值班表与安全检查。",
    status: "confirmed",
    dateLabel: "周三",
    linkedMeetingId: null,
    organization: "微微集团",
    organizerName: "陈廷凯",
    calendarDate: "2026-04-29",
    calendarTypeId: CAL_DEFAULT_ID,
    attendeeRsvp: { 全员: "accepted" },
  },
  {
    id: "s-apr-am",
    title: "客户回访（华东）",
    start: "10:00",
    end: "10:30",
    time: "10:00 - 10:30",
    location: "电话",
    attendees: ["商务组"],
    reminder: "开始前 5 分钟",
    notes: "",
    status: "confirmed",
    dateLabel: "今天",
    linkedMeetingId: null,
    organization: "微微集团",
    organizerName: "陈廷凯",
    calendarDate: "2026-04-08",
    calendarTypeId: CAL_DEFAULT_ID,
    attendeeRsvp: {
      商务组: "accepted",
    },
  },
  {
    id: "s-apr-pm",
    title: "文档规范同步",
    start: "11:00",
    end: "11:45",
    time: "11:00 - 11:45",
    location: "线上文档",
    attendees: ["文档组", "研发组"],
    reminder: "",
    notes: "",
    status: "confirmed",
    dateLabel: "今天",
    linkedMeetingId: null,
    organization: "微微集团",
    organizerName: "陈廷凯",
    calendarDate: "2026-04-08",
    calendarTypeId: CAL_FITNESS_ID,
    attendeeRsvp: {
      文档组: "accepted",
      研发组: "pending",
    },
  },
  {
    id: "s-apr-run",
    title: "跑步",
    start: "23:00",
    end: "23:30",
    time: "23:00 - 23:30",
    location: "户外",
    attendees: [],
    reminder: "",
    notes: "",
    status: "confirmed",
    dateLabel: "今天",
    linkedMeetingId: null,
    organization: "微微集团",
    organizerName: "陈廷凯",
    calendarDate: "2026-04-08",
    calendarTypeId: CAL_FITNESS_ID,
  },
]

export const todoSeed: VvTodoItem[] = [
  {
    id: "td1",
    title: "审批：采购 2 台设计师笔记本",
    summary: "张三提交了设备采购申请，预算和配置已补齐，等待你审批。",
    detail: "申请部门为设计组，设备用于新成员入职，预计总额 36998 元，需要在本周内完成采购。",
    type: "approval",
    status: "pending",
    sender: "张三",
    owner: "设计组",
    approvers: [CURRENT_USER, "财务BP"],
    time: "今天 09:20",
    amount: "36998 元",
    tags: ["审批", "采购"],
    metaVerb: "推送",
    sourceLabel: "微微集团",
    sourceScope: "company",
    listTone: "rose",
    fullHubSourceCategory: "流程",
  },
  {
    id: "td2",
    title: "事项：补充 Q2 预算说明",
    summary: "财务 BP 需要你补充预算说明，下午结项会前处理。",
    detail: "请补充投放预算的实验假设、分渠道拆解和 ROI 预估，财务会据此锁定下周预算口径。",
    type: "task",
    status: "pending",
    sender: "财务BP",
    owner: "商业化团队",
    assignees: [CURRENT_USER],
    time: "今天 11:10",
    amount: null,
    tags: ["事项", "预算"],
    metaVerb: "推送",
    sourceLabel: "微微集团",
    sourceScope: "company",
    listTone: "emerald",
    fullHubSourceCategory: "任务",
  },
  {
    id: "td3",
    title: "抄送：差旅报销审批已通过",
    summary: "王五的差旅报销流程已结束，你被抄送知会。",
    detail: "本次报销金额 2480 元，审批链路已完成，财务将在 2 个工作日内打款。",
    type: "approval",
    status: "cc",
    sender: "财务共享中心",
    owner: "市场组",
    approvers: [],
    time: "今天 13:40",
    amount: "2480 元",
    tags: ["抄送我", "报销"],
    metaVerb: "完成",
    sourceLabel: "财务共享中心",
    sourceScope: "company",
    listTone: "rose",
    fullHubSourceCategory: "流程",
  },
  {
    id: "td4",
    title: "事项：渠道周报已确认",
    summary: "上周渠道周报已完成确认并归档。",
    detail: "市场组已根据你的反馈更新渠道周报并归档，后续只需在周会里同步核心结论。",
    type: "task",
    status: "done",
    sender: "市场组",
    owner: "增长团队",
    assignees: [CURRENT_USER],
    time: "昨天 18:30",
    amount: null,
    tags: ["已处理", "周报"],
    metaVerb: "完成",
    sourceLabel: "VV-EDU",
    sourceScope: "company",
    fullHubSourceCategory: "任务",
  },
  {
    id: "td5",
    title: "请评价任务-CUI和新用户引导文案",
    summary: "该任务已撤销。",
    detail: "发起人已撤回，无需再处理。",
    type: "task",
    status: "revoked",
    sender: "系统",
    owner: "深圳易企微",
    assignees: [],
    time: "03-27 19:37",
    amount: null,
    tags: ["评价"],
    metaVerb: "推送",
    sourceLabel: "深圳易企微",
    sourceScope: "company",
    listTone: "rose",
    fullHubSourceCategory: "任务",
  },
  {
    id: "td6",
    title: "审批：Q2 市场预算初审",
    summary: "草稿尚未提交。",
    detail: "完善说明后可提交审批。",
    type: "approval",
    status: "draft",
    sender: CURRENT_USER,
    owner: "个人",
    approvers: [],
    time: "今天 08:00",
    amount: null,
    tags: ["草稿"],
    metaVerb: "推送",
    sourceLabel: "个人",
    sourceScope: "personal",
    listTone: "rose",
    fullHubSourceCategory: "流程",
  },
  {
    id: "td7",
    title: "审批：供应商续约申请未通过",
    summary: "审批人驳回，请根据意见修改后重新提交。",
    detail: "驳回原因：合同条款与法务标准模板不一致，请修订第 3.2 条后重新发起。",
    type: "approval",
    status: "rejected",
    sender: "采购部",
    owner: "法务组",
    approvers: [],
    time: "今天 15:05",
    amount: null,
    tags: ["审批", "驳回"],
    metaVerb: "推送",
    sourceLabel: "微微集团",
    sourceScope: "company",
    listTone: "rose",
    fullHubSourceCategory: "流程",
  },
]

/** 「全部待办」演示：时间更早的归档行，用于无限下滑加载 */
export const todoHistoryArchiveSeed: VvTodoItem[] = (() => {
  const rows: VvTodoItem[] = []
  const titles = [
    "陈廷凯-加班申请",
    "请评价任务-CUI和新用户引导文案",
    "采购合同用印-华南区",
    "差旅报销 · 三月批次",
    "用印申请-品牌升级物料",
    "访客登记 · 总部接待",
    "会议室改造验收",
    "固定资产盘点-研发",
    "信息安全自查表",
    "外包人员入场审批",
    "办公用品集中采购",
    "年会预算初审",
    "客户礼品领用登记",
    "名片加印申请",
    "班车线路调整征询",
    "停车位续费",
    "健身房合作续约",
    "员工体检预约",
    "团建费用预提",
    "专利年费缴纳提醒",
    "商标续展材料",
    "软件许可续费",
    "云资源降配评估",
    "客服质检周报",
    "工单 SLA 复盘",
    "销售提成核对",
    "渠道返点结算",
    "门店巡检问题闭环",
    "新品试销复盘会材料",
    "合同归档编号申请",
  ]
  const statuses = ["pending", "done", "rejected", "cc", "pending", "done", "revoked"] as const
  const categories = ["考勤", "流程", "任务", "入职", "调岗", "物资"] as const
  for (let i = 0; i < titles.length; i++) {
    const st = statuses[i % statuses.length]
    const mo = String((i % 9) + 1).padStart(2, "0")
    const da = String(5 + (i % 24)).padStart(2, "0")
    const isAppr = i % 3 !== 1
    rows.push({
      id: `td-arch-${i}`,
      title: titles[i]!,
      summary: "演示归档待办。",
      detail: "此为演示数据，用于「全部待办」下滑加载更早记录。",
      type: isAppr ? "approval" : "task",
      status: st,
      sender: i % 2 === 0 ? "人事共享中心" : "行政服务台",
      owner: "深圳易企微",
      approvers: isAppr && st === "pending" ? [CURRENT_USER, "部门负责人"] : [],
      assignees: !isAppr && st === "pending" ? [CURRENT_USER] : [],
      time: `${mo}-${da} ${String(9 + (i % 8)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`,
      amount: null,
      tags: ["归档"],
      metaVerb: st === "done" ? "完成" : "推送",
      sourceLabel: "深圳易企微",
      sourceScope: "company",
      listTone: isAppr ? "rose" : "emerald",
      assigneeLine: st === "pending" && i % 4 === 0 ? `${SCHEDULE_CURRENT_USER_NAME} (我)` : undefined,
      fullHubSourceCategory: categories[i % categories.length],
    })
  }
  return rows
})()

export const mailSeed: VvMailItem[] = [
  {
    id: "mail1",
    subject: "设计评审纪要待补充",
    sender: "王五",
    recipients: [CURRENT_USER],
    cc: ["设计组"],
    time: "今天 10:18",
    preview: "请补充首页卡片交互的结论，今晚发版本邮件前需要同步。",
    body: "李四，你好，设计评审会里关于首页卡片交互的结论还缺一段，请补充到纪要里，今晚发版本邮件前需要同步给设计组。",
    status: "unread",
    folder: "inbox",
  },
  {
    id: "mail2",
    subject: "Q2 预算说明已回收",
    sender: "财务BP",
    recipients: [CURRENT_USER],
    cc: ["商业化团队"],
    time: "今天 13:05",
    preview: "预算说明已回收，财务会按当前版本进入审批口径。",
    body: "预算说明已回收，财务会按当前版本进入审批口径。如后续还有新增投放实验，请单独补邮件说明。",
    status: "read",
    folder: "inbox",
  },
  {
    id: "mail3",
    subject: "渠道周报请确认",
    sender: "市场组",
    recipients: [CURRENT_USER],
    cc: [],
    time: "昨天 18:42",
    preview: "本周渠道周报已整理完毕，请确认是否可以归档。",
    body: "本周渠道周报已整理完毕，请确认是否可以归档。如果没有补充意见，我们会在今晚同步到部门周报库。",
    status: "unread",
    folder: "inbox",
  },
]

/** 演示数据：time 以「今天」开头的视为今日会议 */
export function isMeetingToday(m: VvMeetingItem): boolean {
  return (m.time || "").trim().startsWith("今天")
}

export function meetingAgendaSortKey(m: VvMeetingItem): number {
  const src = (m.start && /^\d/.test(m.start) ? m.start : m.time) || ""
  const match = String(src).match(/(\d{1,2}):(\d{2})/)
  if (!match) return 99_999
  return parseInt(match[1], 10) * 60 + parseInt(match[2], 10)
}

export function sortMeetingsForTodayAgenda(items: VvMeetingItem[]): VvMeetingItem[] {
  return [...items].filter(isMeetingToday).sort((a, b) => meetingAgendaSortKey(a) - meetingAgendaSortKey(b))
}

export const meetingSeed: VvMeetingItem[] = [
  {
    id: "m0",
    title: "晨间站会",
    start: "09:00",
    end: "09:15",
    time: "今天 09:00 - 09:15",
    room: "飞书会议",
    participants: ["研发一组", "产品组"],
    status: "ended",
    agenda: "同步昨日进度与当日风险项。",
    linkedScheduleId: null,
    recordId: null,
  },
  {
    id: "m1",
    title: "增长策略评审会",
    start: "14:00",
    end: "15:00",
    time: "今天 14:00 - 15:00",
    room: "飞书会议 / 302",
    participants: ["李四", "王五", "商业化团队"],
    status: "scheduled",
    agenda: "评审新增投放方案、留存实验与预算调配。",
    linkedScheduleId: "s2",
    recordId: null,
  },
  {
    id: "m2",
    title: "设计评审会",
    start: "16:00",
    end: "16:30",
    time: "今天 16:00 - 16:30",
    room: "飞书会议进行中",
    participants: ["李四", "设计组"],
    status: "live",
    agenda: "确认新版本首页交互和卡片规范。",
    linkedScheduleId: "s3",
    recordId: null,
  },
  {
    id: "m-demo-rec",
    title: "测试日程",
    start: "18:00",
    end: "19:00",
    time: "今天 18:00 - 19:00",
    room: "微微会议",
    participants: ["陈廷凯", "李四"],
    status: "scheduled",
    agenda: "联调会议记录中心卡片演示。",
    linkedScheduleId: null,
    recordId: null,
  },
  {
    id: "m3",
    title: "渠道复盘会",
    start: "18:00",
    end: "19:00",
    time: "昨天 18:00 - 19:00",
    room: "飞书会议",
    participants: ["市场组", "销售组"],
    status: "ended",
    agenda: "复盘上周渠道投放与线索转化情况。",
    linkedScheduleId: null,
    recordId: "r1",
  },
]

export const recordSeed: VvRecordItem[] = [
  {
    id: "r1",
    title: "渠道复盘会记录",
    meetingId: "m3",
    time: "昨天 18:00 - 19:00",
    speakers: ["市场组", "销售组"],
    summary: "确认 3 个渠道优化项，收敛 2 个低效投放方向。",
    actions: ["下周补充投放素材", "复核销售跟进链路", "更新线索分层规则"],
  },
]

/** 会议记录中心：Tab 筛选 + 时间轴卡片演示数据 */
export const meetingRecordHubSeed: VvMeetingRecordHubItem[] = [
  {
    id: "mr-1",
    title: "测试日程",
    dateKey: "05-01",
    timeRange: "18:00–19:00",
    meetingCode: "194891268",
    organizerName: "李四",
    participants: ["陈廷凯", "李四"],
    participantCount: 2,
    status: "upcoming",
    cardAccent: "emerald",
    organizationLabel: "微微集团",
    attendedCount: 2,
    iAmOrganizer: true,
    iParticipated: true,
    fromSubordinate: false,
    meetingId: "m-demo-rec",
  },
  {
    id: "mr-2",
    title: "周例会",
    dateKey: "04-13",
    timeRange: "10:00–10:45",
    meetingCode: "883102456",
    organizerName: "王五",
    participants: ["陈廷凯", "王五", "产品组"],
    participantCount: 6,
    status: "ended",
    cardAccent: "violet",
    organizationLabel: "微微集团",
    attendedCount: 3,
    notAttendedCount: 3,
    attendanceLine: "参会时长 10:02–10:41 | 共 39 分钟",
    iAmOrganizer: false,
    iParticipated: true,
    fromSubordinate: false,
    recordDetail: {
      id: "r-mr-2",
      title: "周例会纪要",
      meetingId: "mr-2",
      time: "04-13 10:00 - 10:45",
      speakers: ["王五", "陈廷凯"],
      summary: "对齐版本节奏与风险项，确认接口冻结时间。",
      actions: ["补充埋点文档", "周三前回归测试"],
    },
  },
  {
    id: "mr-3",
    title: "跨部门评审",
    dateKey: "04-10",
    timeRange: "15:30–16:30",
    meetingCode: "551928437",
    organizerName: "赵六",
    participants: ["陈廷凯", "商业化团队"],
    participantCount: 2,
    status: "cancelled",
    cardAccent: "violet",
    organizationLabel: "微微集团",
    iAmOrganizer: false,
    iParticipated: true,
    fromSubordinate: false,
  },
  {
    id: "mr-4",
    title: "一组站会",
    dateKey: "04-08",
    timeRange: "09:00–09:20",
    meetingCode: "662003918",
    organizerName: "张下属",
    participants: ["张下属", "研发一组"],
    participantCount: 8,
    status: "ended",
    cardAccent: "emerald",
    organizationLabel: "微微集团",
    attendedCount: 5,
    attendanceLine: "参会时长 09:01–09:18 | 共 17 分钟",
    iAmOrganizer: false,
    iParticipated: false,
    fromSubordinate: true,
    recordDetail: {
      id: "r-mr-4",
      title: "一组站会纪要",
      meetingId: "mr-4",
      time: "04-08 09:00 - 09:20",
      speakers: ["张下属"],
      summary: "同步阻塞项与当日排期。",
      actions: [],
    },
  },
]

export const driveSeed: VvDriveItem[] = [
  {
    id: "drv1",
    name: "Q2-增长复盘.pdf",
    owner: CURRENT_USER,
    updatedAt: "今天 10:40",
    location: "/我的文件/复盘",
    size: "12.4 MB",
    type: "PDF",
    sharedWith: ["商业化团队"],
  },
  {
    id: "drv2",
    name: "首页改版交互稿.fig",
    owner: CURRENT_USER,
    updatedAt: "今天 09:15",
    location: "/我的文件/设计协作",
    size: "28.7 MB",
    type: "FIG",
    sharedWith: ["设计组", "研发组"],
  },
  {
    id: "drv3",
    name: "预算审批附件.xlsx",
    owner: CURRENT_USER,
    updatedAt: "昨天 17:20",
    location: "/我的文件/审批材料",
    size: "1.8 MB",
    type: "XLSX",
    sharedWith: [],
  },
]

export const docsSeed: VvDocItem[] = [
  {
    id: "doc1",
    title: "Q2 增长复盘",
    owner: CURRENT_USER,
    updatedAt: "今天 11:20",
    location: "增长团队 / 复盘",
    summary: "沉淀 Q2 投放结果、留存实验表现和下季度优化方向。",
    access: "团队可见",
    favorite: true,
    sharedWithMe: false,
  },
  {
    id: "doc2",
    title: "首页改版需求说明",
    owner: "设计组",
    updatedAt: "今天 09:45",
    location: "产品设计 / 需求",
    summary: "整理首页改版目标、交互草图和交付节奏。",
    access: "与我共享",
    favorite: false,
    sharedWithMe: true,
  },
  {
    id: "doc3",
    title: "预算审批材料",
    owner: CURRENT_USER,
    updatedAt: "昨天 16:10",
    location: "财务协作 / 审批材料",
    summary: "汇总采购预算、审批依据和补充说明。",
    access: "仅审批链可见",
    favorite: false,
    sharedWithMe: false,
  },
  {
    id: "doc4",
    title: "渠道投放周报模板",
    owner: "市场组",
    updatedAt: "昨天 14:35",
    location: "市场组 / 模板",
    summary: "统一渠道投放周报字段和展示格式。",
    access: "与我共享",
    favorite: true,
    sharedWithMe: true,
  },
]

export const freeSlotsSeed = [
  {
    id: "slot1",
    label: "下周二 10:00 - 11:00",
    detail: "李四 / 王五 / 商业化团队均有空，冲突最低",
    confidence: "推荐",
  },
  {
    id: "slot2",
    label: "下周二 15:00 - 16:00",
    detail: "王五 16:00 前需要离开，建议控制时长",
    confidence: "可选",
  },
  {
    id: "slot3",
    label: "下周三 11:00 - 12:00",
    detail: "与另一个跨组同步相邻，节奏稍紧",
    confidence: "备选",
  },
]

/** 共同空闲卡片：时段说明与当前查询的参与人一致 */
export function freeSlotsWithAttendeeSummary(summary: string): VvFreeSlot[] {
  return freeSlotsSeed.map((s, idx) => ({
    ...s,
    detail:
      idx === 0
        ? `${summary} 在该时段均可参加，冲突最低`
        : idx === 1
          ? `${summary} 可参加；注意该时段结束时间`
          : `${summary} 可参加；与相邻安排略紧`,
  }))
}

export function resolveChoiceFromText<T extends { title: string }>(text: string, items: T[]): T | null {
  const normalized = normalizeText(text)
  const patterns: { list: string[]; index: number }[] = [
    { list: ["第一个", "第一条", "第1个", "第一项"], index: 0 },
    { list: ["第二个", "第二条", "第2个", "第二项"], index: 1 },
    { list: ["第三个", "第三条", "第3个", "第三项"], index: 2 },
  ]
  for (const pattern of patterns) {
    if (pattern.list.some((keyword) => normalized.includes(normalizeText(keyword))) && items[pattern.index]) {
      return items[pattern.index]
    }
  }
  return items.find((item) => normalized.includes(normalizeText(item.title))) || null
}

export function meetingStatusText(status: string) {
  if (status === "live") return "进行中"
  if (status === "scheduled") return "已预约"
  if (status === "ended") return "已结束"
  if (status === "cancelled") return "已取消"
  return "正常"
}

export function toMinutes(value: string) {
  const [h, m] = value.split(":").map(Number)
  return h * 60 + m
}

export function sortByStart(items: VvScheduleItem[]) {
  return [...items].sort((a, b) => toMinutes(a.start) - toMinutes(b.start))
}

export function normalizeText(text: string) {
  return (text || "").replace(/\s+/g, "").toLowerCase()
}

export function canCurrentUserProcessTodo(item: VvTodoItem) {
  if (!item || item.status !== "pending") return false
  if (item.type === "task") {
    const assignees = item.assignees || [CURRENT_USER]
    return assignees.includes(CURRENT_USER)
  }
  const approvers = item.approvers || []
  return approvers.includes(CURRENT_USER)
}

export function isTodoInitiatedByCurrentUser(item: VvTodoItem) {
  return item?.type === "approval" && item?.sender === CURRENT_USER
}

export function todoTypeText(type: string) {
  return type === "approval" ? "审批" : "事项"
}

export function todoStatusText(status: string) {
  if (status === "pending") return "待处理"
  if (status === "done") return "已处理"
  if (status === "cc") return "抄送我"
  if (status === "rejected") return "已拒绝"
  if (status === "revoked") return "已撤销"
  if (status === "draft") return "草稿"
  return "其他"
}
