import type {
  VvAssistantPayload,
  VvChoiceFollowUp,
  VvContext,
  VvFlow,
  VvScheduleItem,
  VvTodoHubTab,
} from "./types"
import {
  CURRENT_USER,
  freeSlotsSeed,
  freeSlotsWithAttendeeSummary,
  meetingRecordHubSeed,
  normalizeText,
  resolveChoiceFromText,
  SCHEDULE_CURRENT_USER_NAME,
  sortByStart,
  todoHistoryArchiveSeed,
} from "./seeds"
import { tryParseSubscribeColleagueName, tryParseUnsubscribeColleagueName } from "./subscribeColleagueParse"
import {
  defaultScheduleCreateDraft,
  defaultScheduleCreateDraftForBookMeeting,
  findItemByTitle,
  scheduleEditDraftFromItem,
} from "./scheduleFlow"
import { defaultApprovalStartDraft } from "./approvalFlow"
import { defaultMailComposeDraft, parseMailComposeDraftFromUserText } from "./mailComposeFlow"
import { defaultMeetingStartDraft } from "./meetingFlow"

export const VV_PLAN_DEMO_FALLBACK_TEXT =
  "这个 Demo 目前覆盖通用工作台与二级应用：底部进入「日程」可管理今日日程；进入「会议」可即时发起、预约会议、加入会议与查看记录。也可输入：我的待办、全部待办、全部流程、发起审批、收件箱、我的文件、全部文档等。"

/** @deprecated 使用 `VV_PLAN_DEMO_FALLBACK_TEXT` */
const FALLBACK_TEXT = VV_PLAN_DEMO_FALLBACK_TEXT

/** 用户输入在 vv 编排中仅命中 Demo 兜底说明（无结构化业务卡），与 dock 全局业务意图检测配合可判定「非业务自然语言」 */
export function planIsDemoCatalogFallback(text: string, ctx: VvContext, flow: VvFlow): boolean {
  const { payload } = planGeneralVvInteraction(text, ctx, flow)
  return payload.kind === "assistant-text" && payload.text === VV_PLAN_DEMO_FALLBACK_TEXT
}

/** 解析「A和B什么时候方便开会」→ 新建日程预填参与人 */
function tryParseFreeBusySchedulePeers(text: string): { attendees: string; title: string; summaryLabel: string } | null {
  const m = text.match(/(?:这周|本周)?\s*(.+?)和(.+?)什么时候方便开会/)
  if (!m) return null
  const a = m[1].trim().replace(/^(这周|本周)\s*/, "").trim()
  const b = m[2].trim()
  if (!a || !b) return null
  const attendees = `${a}、${b}`
  return {
    attendees,
    title: `与${a}、${b}开会`,
    summaryLabel: attendees,
  }
}

export function todoHubPayload(ctx: VvContext, initialTab: VvTodoHubTab): VvAssistantPayload {
  return {
    kind: "todo-list",
    hub: true,
    hubMode: "compact",
    title: "我的待办",
    description: "在下方分栏筛选待办，点击条目可处理或查看详情。",
    allItems: ctx.todoItems,
    initialTab,
  }
}

/** 「全部待办」大列表：含归档演示数据，支持下滑加载更早记录 */
export function todoFullHubPayload(ctx: VvContext, initialTab: VvTodoHubTab): VvAssistantPayload {
  const recent = ctx.todoItems.map((item, i) => ({
    ...item,
    fullHubSortKey: 900_000 + (ctx.todoItems.length - i) * 100,
  }))
  const older = todoHistoryArchiveSeed.map((item, i) => ({
    ...item,
    fullHubSortKey: 200_000 - i * 50,
  }))
  const allItems = [...recent, ...older].sort((a, b) => (b.fullHubSortKey ?? 0) - (a.fullHubSortKey ?? 0))
  return {
    kind: "todo-list",
    hub: true,
    hubMode: "full",
    title: "全部待办",
    description: "按分栏与关键字筛选；列表底部继续下滑可加载更早待办（演示数据）。",
    allItems,
    initialTab,
  }
}

function listDocs(ctx: VvContext, filter: string) {
  const { docItems } = ctx
  if (filter === "created") return docItems.filter((d) => d.owner === CURRENT_USER)
  if (filter === "shared") return docItems.filter((d) => d.sharedWithMe)
  if (filter === "favorite") return docItems.filter((d) => d.favorite)
  return docItems
}

/** 与 App.jsx startScheduleSelect：仅「今天」且未取消 */
function scheduleCandidates(ctx: VvContext): VvScheduleItem[] {
  return ctx.scheduleItems.filter((s) => s.dateLabel === "今天" && s.status !== "cancelled")
}

function buildScheduleChoice(ctx: VvContext, mode: "edit" | "cancel") {
  const list = scheduleCandidates(ctx)
  if (!list.length) {
    return {
      payload: {
        kind: "assistant-text",
        text: "没有找到符合条件的日程（今天暂无未取消的日程可修改或取消）。",
      },
      nextFlow: null,
    }
  }
  const ids = list.map((s) => s.id)
  const items = list.map((s) => ({
    id: s.id,
    title: s.title,
    meta: `${s.time} · ${s.location}`,
    scheduleItem: s,
  }))
  const nextFlow: VvFlow = { type: "select-schedule", mode, candidateIds: ids }
  const payload: VvAssistantPayload =
    mode === "edit"
      ? {
          kind: "choice",
          title: "候选日程",
          description: "请选择你要修改的那一条日程。也可以直接回复日程名称或「第一条」。",
          items,
          followUp: "schedule-edit",
        }
      : {
          kind: "choice",
          title: "候选日程",
          description: "请选择你要取消的那一条日程。也可以直接回复日程名称或「第一条」。",
          items,
          followUp: "schedule-cancel",
        }
  return { payload, nextFlow }
}

function scheduleResolvedEdit(choice: VvScheduleItem) {
  const draft = scheduleEditDraftFromItem(choice)
  return {
    payload: { kind: "schedule-edit" as const, item: choice, draft },
    nextFlow: { type: "schedule-edit" as const, scheduleId: choice.id, draft },
  }
}

function scheduleResolvedCancel(choice: VvScheduleItem) {
  const reason = "需求变更"
  return {
    payload: { kind: "schedule-cancel-confirm" as const, item: choice, reason },
    nextFlow: { type: "schedule-cancel" as const, scheduleId: choice.id, reason },
  }
}

/** 如「新建客户回访日程」「创建xx日程」→ 主题预填，表单内由用户确认创建 */
function tryParseNlScheduleTitleForCreate(text: string): string | null {
  const t = text.trim()
  for (const re of [/新建\s*(.+?)\s*日程/, /创建\s*(.+?)\s*日程/]) {
    const m = t.match(re)
    if (m?.[1]) {
      const title = m[1].trim()
      if (title) return title
    }
  }
  return null
}

/** 如「取消产品评审日程」→ 确认删除卡（不直接删库） */
function tryParseNlScheduleTitleForCancel(text: string): string | null {
  const t = text.trim()
  for (const re of [/取消\s*(.+?)\s*日程/, /删除\s*(.+?)\s*日程/]) {
    const m = t.match(re)
    if (m?.[1]) {
      const title = m[1].trim()
      if (title) return title
    }
  }
  return null
}

/** 如「修改产品评审日程」→ 编辑表单内确认 */
function tryParseNlScheduleTitleForEdit(text: string): string | null {
  const m = text.trim().match(/修改\s*(.+?)\s*日程/)
  if (m?.[1]) {
    const title = m[1].trim()
    if (title) return title
  }
  return null
}

function processFlow(text: string, ctx: VvContext, flow: VvFlow): { payload: VvAssistantPayload; nextFlow: VvFlow } | null {
  if (!flow) return null
  const value = text.trim()

  if (flow.type === "select-schedule") {
    const candidates = ctx.scheduleItems.filter((s) => flow.candidateIds.includes(s.id))
    const choice = resolveChoiceFromText(value, candidates) as VvScheduleItem | null
    if (choice) {
      if (flow.mode === "edit") return scheduleResolvedEdit(choice)
      return scheduleResolvedCancel(choice)
    }
    return {
      payload: {
        kind: "assistant-text",
        text: "还没识别要选哪一条日程。请点击卡片，或直接输入日程名称 /「第一条」。",
      },
      nextFlow: flow,
    }
  }

  if (flow.type === "select-meeting-join") {
    const candidates = ctx.meetingItems.filter((m) => flow.candidateIds.includes(m.id))
    const choice = resolveChoiceFromText(value, candidates)
    if (choice) {
      return {
        payload: { kind: "meeting-detail", item: choice },
        nextFlow: null,
      }
    }
    return {
      payload: {
        kind: "assistant-text",
        text: "还没识别要加入哪一场会议。请点击卡片，或直接说会议名称。",
      },
      nextFlow: flow,
    }
  }

  if (flow.type === "select-record") {
    const candidates = ctx.recordItems.filter((r) => flow.candidateIds.includes(r.id))
    const choice = resolveChoiceFromText(value, candidates)
    if (choice) {
      return {
        payload: { kind: "record-detail", item: choice },
        nextFlow: null,
      }
    }
    return {
      payload: { kind: "assistant-text", text: "还没识别要查看哪一条会议记录。" },
      nextFlow: flow,
    }
  }

  if (flow.type === "select-drive-download") {
    const candidates = ctx.driveItems.filter((d) => flow.candidateIds.includes(d.id))
    const choice = resolveChoiceFromText(value, candidates)
    if (choice) {
      return {
        payload: {
          kind: "assistant-text",
          text: `将模拟下载「${choice.name}」到本地：\nvvcli drive files download --file-id file_xxx --target "~/Downloads"\n\n演示环境不会真实下载。`,
        },
        nextFlow: null,
      }
    }
    return {
      payload: { kind: "assistant-text", text: "还没识别要下载哪个文件，请点击列表或说出文件名。" },
      nextFlow: flow,
    }
  }

  if (flow.type === "select-drive-share") {
    const candidates = ctx.driveItems.filter((d) => flow.candidateIds.includes(d.id))
    const choice = resolveChoiceFromText(value, candidates)
    if (choice) {
      return {
        payload: {
          kind: "assistant-text",
          text: `请用自然语言确认共享，例如：\n请共享「${choice.name}」这个文件给「商业化团队」，权限「可查看」。\n\n对应 vvcli drive files share。`,
        },
        nextFlow: null,
      }
    }
    return {
      payload: { kind: "assistant-text", text: "还没识别要共享哪个文件。" },
      nextFlow: flow,
    }
  }

  return null
}

/** 与下方「今日日程」列表意图一致；供输入框 / dock 外层短路复用（须排除「修改/取消今日日程」） */
export function isTodayScheduleAgendaQuery(text: string): boolean {
  const value = text.trim()
  return (
    value.includes("查询今日日程") ||
    value.includes("查看今日日程") ||
    value.includes("今天安排") ||
    (value.includes("今日日程") && !value.includes("修改") && !value.includes("取消"))
  )
}

/** 与「全部日程」同卡：主 AI 自然语言「我的日程」及打开/查看等（排除含修改/取消的句子） */
export function wantsScheduleAllCard(value: string): boolean {
  if (value.includes("全部日程")) return true
  const v = value.trim()
  if (v === "我的日程") return true
  if (
    v.startsWith("打开我的日程") ||
    v.startsWith("查看我的日程") ||
    v.startsWith("进入我的日程")
  ) {
    return true
  }
  if (
    /我想(?:要)?(?:查看|看)我的日程/.test(v) ||
    /我要(?:看|查看)我的日程/.test(v) ||
    /帮我(?:打开|查看)我的日程/.test(v)
  ) {
    return true
  }
  if ((/修改|取消|删除|编辑/.test(v)) && v.includes("我的日程")) {
    return false
  }
  return false
}

/** 与底栏「新建日程」同卡：创建日程表单（含「创建日程」说法） */
export function wantsScheduleCreateToolbarIntent(value: string): boolean {
  return value.includes("新建日程") || value.includes("创建日程")
}

/** 日程应用底栏：我的日程 / 今日日程 / 新建日程 — 与 planGeneralVvInteraction 中对应分支一致 */
export function matchesScheduleToolbarQuickIntent(text: string): boolean {
  const value = text.trim()
  return (
    wantsScheduleAllCard(value) ||
    isTodayScheduleAgendaQuery(text) ||
    wantsScheduleCreateToolbarIntent(value)
  )
}

export function planGeneralVvInteraction(text: string, ctx: VvContext, flow: VvFlow): { payload: VvAssistantPayload; nextFlow: VvFlow } {
  const fromFlow = processFlow(text, ctx, flow)
  if (fromFlow) return fromFlow

  const value = text.trim()

  /** 主 AI 示例：微微 / V V AI 产品与公司介绍（自然语言直答） */
  const asksWeiweiAiIntro =
    (/是做什么/.test(value) &&
      ((value.includes("微微") && /AI|ai/.test(value)) || /V\s*V\s*AI/i.test(value))) ||
    (/干什么的/.test(value) && (value.includes("微微") || /V\s*V\s*AI/i.test(value)))
  if (asksWeiweiAiIntro) {
    return {
      payload: {
        kind: "assistant-text",
        text:
          "微微科技创立于2018年，总部位于新加坡，是一家以AI理念和技术为核心，围绕工作、教育、生活、健康等场景，提供精准智能服务的全球化科技公司。微微打造了以自然语言为交互方式的产品——V V AI，致力于用最先进的多模态AI引擎、端到端加密IM和全面的协同能力，重塑企业和个人的生态连接，实现「你说我做」的智能体验。",
      },
      nextFlow: null,
    }
  }

  /** 演示：意图不明时由助手追问引导（与看板 1.2 一致，如用户只说「我想」） */
  if (value.trim() === "我想") {
    return {
      payload: {
        kind: "assistant-text",
        text:
          "我还没听清你想做什么。作为日程助手，我可以帮你查看日程、新建或修改日程、取消日程、查找和同事的共同空闲时间等。\n\n你可以直接说，例如「我想看下今天的日程」「帮我新建一个明天下午三点的会议」。你想先做哪一件？",
      },
      nextFlow: null,
    }
  }

  /** 演示：承接上文的补充说明（可选话术） */
  if (value === "能再详细说明一下吗？" || /^追问[：:]\s*/.test(value)) {
    return {
      payload: {
        kind: "assistant-text",
        text:
          "这是承接上文的追问回复（演示）：若你刚问过「微微是干什么的」，这里会在同一对话里补充——V V AI 侧重工作场景落地，例如日程、会议、待办等可一句话完成；你也可以继续追问具体功能，我会结合对话上下文作答。",
      },
      nextFlow: null,
    }
  }

  /** 演示：CUI 内全屏批量添加参与人（与看板第 5 条一致） */
  if (value === "【演示】CUI内弹窗批量添加参与人") {
    const draft = defaultScheduleCreateDraft()
    return {
      payload: {
        kind: "schedule-create",
        draft,
        viaFreeSlots: false,
        openBatchAttendees: true,
      },
      nextFlow: { type: "schedule-create", draft, viaFreeSlots: false },
    }
  }

  const detailPick = value.match(/查看“(.+?)”详情/)
  if (detailPick) {
    const t = detailPick[1]
    const sched = findItemByTitle(ctx.scheduleItems, t)
    if (sched) return { payload: { kind: "schedule-detail", item: sched }, nextFlow: null }
  }

  const viewBracket = value.match(/查看【(.+?)】日程/)
  if (viewBracket) {
    const t = viewBracket[1].trim()
    const sched = findItemByTitle(ctx.scheduleItems, t)
    if (sched) return { payload: { kind: "schedule-detail", item: sched }, nextFlow: null }
  }

  /** 与示例指令一致：找共同空闲 → 选时段 → 新建日程（非预约会议话术） */
  const wantsScheduleFromFreeBusy =
    value.includes("帮我找共同空闲") ||
    value.includes("找共同空闲时间") ||
    (value.includes("共同空闲") && (value.includes("新建日程") || value.includes("创建日程")))

  if (wantsScheduleFromFreeBusy && (value.includes("空闲") || value.includes("共同空闲"))) {
    const peers = tryParseFreeBusySchedulePeers(value)
    const summary = peers?.summaryLabel ?? "王总、陈总"
    const defaultCreateDraft = peers
      ? { title: peers.title, attendees: peers.attendees, location: "线上协作" }
      : { title: "与王总、陈总开会", attendees: "王总、陈总", location: "线上协作" }
    return {
      payload: {
        kind: "free-slots",
        title: "共同空闲时间（新建日程）",
        description: `已根据「${summary}」的忙闲筛选可预订时段；请选择其一后将打开新建日程表单，主题与参与人已按你的说法预填。`,
        slots: freeSlotsWithAttendeeSummary(summary),
        purpose: "schedule-create",
      },
      nextFlow: { type: "schedule-free-slots", defaultCreateDraft },
    }
  }

  /** 仅当同时提到空闲/共同空闲时走忙闲卡片；单独「预约会议」快捷指令在下面打开创建日程 */
  if (value.includes("预约会议") && (value.includes("空闲") || value.includes("共同空闲"))) {
    return {
      payload: {
        kind: "free-slots",
        title: "共同空闲时间（用于预约会议）",
        description: "我找到几个适合的时间段，你可以直接选一个。",
        slots: freeSlotsSeed,
        purpose: "meeting-book",
      },
      nextFlow: {
        type: "meeting-free-slots",
        defaultMeetingDraft: {
          title: "产品评审会",
          participants: "李四、王五、商业化团队",
          room: "微微会议",
        },
      },
    }
  }

  const meetingFreeBusyHint =
    value.includes("开会") || (value.includes("会议") && (value.includes("空闲") || value.includes("共同空闲")))
  if ((value.includes("空闲") || value.includes("共同空闲")) && meetingFreeBusyHint) {
    return {
      payload: {
        kind: "free-slots",
        title: "共同空闲时间（用于预约会议）",
        description: "我找到几个适合的时间段，你可以直接选一个。",
        slots: freeSlotsSeed,
        purpose: "meeting-book",
      },
      nextFlow: {
        type: "meeting-free-slots",
        defaultMeetingDraft: {
          title: "产品评审会",
          participants: "李四、王五、商业化团队",
          room: "微微会议",
        },
      },
    }
  }

  if (value.includes("空闲") || value.includes("共同空闲")) {
    return {
      payload: {
        kind: "free-slots",
        title: "共同空闲时间（用于新建日程）",
        description: "我找到几个适合的时间段，你可以直接选一个。",
        slots: freeSlotsSeed,
        purpose: "schedule-create",
      },
      nextFlow: { type: "schedule-free-slots" },
    }
  }

  if (value.includes("全部日程")) {
    const initialViewMode =
      value.includes("本周") || value.includes("这周") ? ("week" as const) : undefined
    return {
      payload: {
        kind: "schedule-all",
        items: sortByStart([...ctx.scheduleItems]),
        ...(initialViewMode ? { initialViewMode } : {}),
      },
      nextFlow: null,
    }
  }

  if (
    value.includes("日历设置") ||
    value.includes("日历基础设置") ||
    value.includes("日程日历设置") ||
    value.includes("打开日历基础设置")
  ) {
    return { payload: { kind: "schedule-calendar-settings" }, nextFlow: null }
  }

  if (value.includes("新建日历")) {
    return { payload: { kind: "schedule-calendar-create" }, nextFlow: null }
  }

  const unsubscribeColleagueName = tryParseUnsubscribeColleagueName(value)
  if (unsubscribeColleagueName) {
    return {
      payload: { kind: "schedule-unsubscribe-confirm", colleagueName: unsubscribeColleagueName },
      nextFlow: null,
    }
  }

  const subscribeColleagueName = tryParseSubscribeColleagueName(value)
  if (subscribeColleagueName) {
    return {
      payload: { kind: "schedule-subscribe-confirm", colleagueName: subscribeColleagueName },
      nextFlow: null,
    }
  }

  if (value.includes("订阅日历")) {
    return {
      payload: { kind: "schedule-subscribe-colleague", initialQuery: "" },
      nextFlow: null,
    }
  }

  if (isTodayScheduleAgendaQuery(text)) {
    const items = sortByStart(
      ctx.scheduleItems.filter((item) => item.dateLabel === "今天" && item.status !== "cancelled")
    )
    return { payload: { kind: "schedule-agenda", items }, nextFlow: null }
  }

  const nlEditTitle = tryParseNlScheduleTitleForEdit(value)
  if (nlEditTitle && !(nlEditTitle === "今日" && value.includes("修改今日日程"))) {
    const choice = findItemByTitle(ctx.scheduleItems, nlEditTitle)
    if (choice) return scheduleResolvedEdit(choice)
    return {
      payload: {
        kind: "assistant-text",
        text: `未找到日程「${nlEditTitle}」。可以说「修改日程」从列表中选择要改的那一条。`,
      },
      nextFlow: null,
    }
  }

  if (
    value === "修改日程" ||
    value.includes("修改日程") ||
    value === "修改今日日程" ||
    value.includes("修改今日日程")
  ) {
    const { payload, nextFlow } = buildScheduleChoice(ctx, "edit")
    return { payload, nextFlow }
  }

  const nlCancelTitle = tryParseNlScheduleTitleForCancel(value)
  if (nlCancelTitle && !(nlCancelTitle === "今日" && value.includes("取消今日日程"))) {
    const choice = findItemByTitle(ctx.scheduleItems, nlCancelTitle)
    if (choice) return scheduleResolvedCancel(choice)
    return {
      payload: {
        kind: "assistant-text",
        text: `未找到日程「${nlCancelTitle}」。可以说「取消日程」从列表中选择要取消的那一条。`,
      },
      nextFlow: null,
    }
  }

  if (
    value === "取消日程" ||
    value.includes("取消日程") ||
    value === "取消今日日程" ||
    value.includes("取消今日日程")
  ) {
    const { payload, nextFlow } = buildScheduleChoice(ctx, "cancel")
    return { payload, nextFlow }
  }

  if (value.includes("新建日程") || value.includes("创建日程")) {
    const parsedTitle = tryParseNlScheduleTitleForCreate(value)
    const draft = defaultScheduleCreateDraft()
    if (parsedTitle) draft.title = parsedTitle
    return {
      payload: { kind: "schedule-create", draft, viaFreeSlots: false },
      nextFlow: { type: "schedule-create", draft, viaFreeSlots: false },
    }
  }

  /** 「预约会议」与新建日程同款创建卡片，地点默认微微会议；精确「发起会议」在 vvSend 中直接即时发起 */
  if (value.includes("预约会议")) {
    const parsedTitle = tryParseNlScheduleTitleForCreate(value)
    const draft = defaultScheduleCreateDraftForBookMeeting()
    if (parsedTitle) draft.title = parsedTitle
    return {
      payload: { kind: "schedule-create", draft, viaFreeSlots: false },
      nextFlow: { type: "schedule-create", draft, viaFreeSlots: false },
    }
  }

  if (value.includes("发起会议")) {
    const draft = defaultMeetingStartDraft()
    return {
      payload: { kind: "meeting-start-form", draft },
      nextFlow: { type: "meeting-start", draft },
    }
  }

  if (value.includes("加入会议")) {
    return {
      payload: { kind: "meeting-join-card", displayName: SCHEDULE_CURRENT_USER_NAME },
      nextFlow: null,
    }
  }

  if (value.includes("会议记录")) {
    return {
      payload: { kind: "meeting-record-hub", items: meetingRecordHubSeed },
      nextFlow: null,
    }
  }

  if (value.includes("打开我的全部待办") || value.includes("我的待办")) {
    let initialTab: VvTodoHubTab = "all"
    if (value.includes("待处理") || value.includes("待办事项")) initialTab = "pending"
    else if (value.includes("已处理")) initialTab = "done"
    else if (value.includes("抄送我")) initialTab = "cc"
    else if (value.includes("草稿")) initialTab = "draft"
    else if (value.includes("我发起的") || value.includes("我发起")) initialTab = "initiated"
    return { payload: todoHubPayload(ctx, initialTab), nextFlow: null }
  }

  if (value.includes("全部待办")) {
    return { payload: todoFullHubPayload(ctx, "all"), nextFlow: null }
  }

  if (value.includes("待处理") || value.includes("待办事项")) {
    return { payload: todoHubPayload(ctx, "pending"), nextFlow: null }
  }

  if (value.includes("已处理")) {
    return { payload: todoHubPayload(ctx, "done"), nextFlow: null }
  }

  if (value.includes("抄送我")) {
    return { payload: todoHubPayload(ctx, "cc"), nextFlow: null }
  }

  if (value.includes("草稿")) {
    return { payload: todoHubPayload(ctx, "draft"), nextFlow: null }
  }

  if (value.includes("全部流程")) {
    return {
      payload: { kind: "approval-process-hub" },
      nextFlow: null,
    }
  }

  if (value.includes("发起审批")) {
    const draft = defaultApprovalStartDraft()
    return {
      payload: { kind: "approval-start-form", draft },
      nextFlow: { type: "approval-start", draft },
    }
  }

  if (value.includes("我发起的") || value.includes("我发起")) {
    return { payload: todoHubPayload(ctx, "initiated"), nextFlow: null }
  }

  if (value.includes("收件箱")) {
    const items = ctx.mailItems.filter((item) => item.folder === "inbox")
    return {
      payload: {
        kind: "mail-list",
        title: "收件箱",
        description: "这里展示最近进入收件箱的邮件。",
        items,
      },
      nextFlow: null,
    }
  }

  if (value.includes("新建邮件")) {
    const draft = parseMailComposeDraftFromUserText(value) ?? defaultMailComposeDraft()
    return {
      payload: { kind: "mail-compose-form", draft },
      nextFlow: { type: "mail-compose" },
    }
  }

  if (value.includes("我的文件")) {
    return {
      payload: {
        kind: "drive-list",
        title: "我的文件",
        description: "微盘中的演示文件列表。",
        items: ctx.driveItems,
      },
      nextFlow: null,
    }
  }

  if (value.includes("上传文件")) {
    return {
      payload: {
        kind: "assistant-text",
        text: '请描述上传任务，例如：\n请上传一个文件：文件名「新版本发布说明.pdf」，目录「/我的文件/版本发布」，文件类型「PDF」。\n\n对应 vvcli drive files upload。',
      },
      nextFlow: null,
    }
  }

  if (value.includes("下载文件")) {
    const ids = ctx.driveItems.map((d) => d.id)
    return {
      payload: {
        kind: "choice",
        title: "选择要下载的文件",
        description: "点选或说出文件名。",
        items: ctx.driveItems.map((d) => ({
          id: d.id,
          title: d.name,
          meta: `${d.size} · ${d.location}`,
        })),
        followUp: "drive-download",
      },
      nextFlow: { type: "select-drive-download", candidateIds: ids },
    }
  }

  if (value.includes("共享文件")) {
    const ids = ctx.driveItems.map((d) => d.id)
    return {
      payload: {
        kind: "choice",
        title: "选择要共享的文件",
        description: "点选后可用自然语言补充接收方与权限。",
        items: ctx.driveItems.map((d) => ({
          id: d.id,
          title: d.name,
          meta: d.sharedWith.length ? `已共享：${d.sharedWith.join("、")}` : "尚未共享",
        })),
        followUp: "drive-share",
      },
      nextFlow: { type: "select-drive-share", candidateIds: ids },
    }
  }

  if (value.includes("全部文档")) {
    return {
      payload: {
        kind: "doc-list",
        title: "全部文档",
        description: "当前可见范围内的文档列表。",
        items: listDocs(ctx, "all"),
      },
      nextFlow: null,
    }
  }

  if (value.includes("我创建的")) {
    return {
      payload: {
        kind: "doc-list",
        title: "我创建的",
        description: "由你创建或归你所有的文档。",
        items: listDocs(ctx, "created"),
      },
      nextFlow: null,
    }
  }

  if (value.includes("与我共享")) {
    return {
      payload: {
        kind: "doc-list",
        title: "与我共享",
        description: "他人共享给你的文档。",
        items: listDocs(ctx, "shared"),
      },
      nextFlow: null,
    }
  }

  if (value.includes("我收藏的")) {
    return {
      payload: {
        kind: "doc-list",
        title: "我收藏的",
        description: "已加星标的文档。",
        items: listDocs(ctx, "favorite"),
      },
      nextFlow: null,
    }
  }

  const scheduleHit = ctx.scheduleItems.find((item) => normalizeText(value).includes(normalizeText(item.title)))
  if (scheduleHit) {
    return { payload: { kind: "schedule-detail", item: scheduleHit }, nextFlow: null }
  }

  const meetingHit = ctx.meetingItems.find((item) => normalizeText(value).includes(normalizeText(item.title)))
  if (meetingHit) {
    return {
      payload: { kind: "meeting-detail", item: meetingHit },
      nextFlow: null,
    }
  }

  const recordHit = ctx.recordItems.find((item) => normalizeText(value).includes(normalizeText(item.title)))
  if (recordHit) {
    return {
      payload: { kind: "record-detail", item: recordHit },
      nextFlow: null,
    }
  }

  const todoHit = ctx.todoItems.find((item) => normalizeText(value).includes(normalizeText(item.title)))
  if (todoHit) {
    return { payload: { kind: "todo-detail", item: todoHit }, nextFlow: null }
  }

  const mailHit = ctx.mailItems.find((item) => normalizeText(value).includes(normalizeText(item.subject)))
  if (mailHit) {
    return { payload: { kind: "mail-detail", item: mailHit }, nextFlow: null }
  }

  const driveHit = ctx.driveItems.find((item) => normalizeText(value).includes(normalizeText(item.name)))
  if (driveHit) {
    return {
      payload: {
        kind: "drive-list",
        title: "我的文件",
        description: `已定位「${driveHit.name}」，以下为文件列表。`,
        items: ctx.driveItems,
      },
      nextFlow: null,
    }
  }

  const docHit = ctx.docItems.find((item) => normalizeText(value).includes(normalizeText(item.title)))
  if (docHit) {
    return { payload: { kind: "doc-detail", item: docHit }, nextFlow: null }
  }

  return { payload: { kind: "assistant-text", text: FALLBACK_TEXT }, nextFlow: null }
}

/** 点击选择卡片时根据 id 解析下一条助手消息（并应清空 vvFlow） */
export function payloadAfterChoicePick(
  followUp: VvChoiceFollowUp,
  choiceId: string,
  ctx: VvContext
): VvAssistantPayload {
  if (followUp === "schedule-edit" || followUp === "schedule-cancel") {
    const item = ctx.scheduleItems.find((s) => s.id === choiceId)
    if (!item) return { kind: "assistant-text", text: "未找到对应日程。" }
    if (followUp === "schedule-edit") {
      const draft = scheduleEditDraftFromItem(item)
      return { kind: "schedule-edit", item, draft }
    }
    return { kind: "schedule-cancel-confirm", item, reason: "需求变更" }
  }
  if (followUp === "meeting-join") {
    const item = ctx.meetingItems.find((m) => m.id === choiceId)
    if (!item) return { kind: "assistant-text", text: "未找到会议。" }
    return { kind: "meeting-detail", item }
  }
  if (followUp === "drive-download") {
    const item = ctx.driveItems.find((d) => d.id === choiceId)
    if (!item) return { kind: "assistant-text", text: "未找到文件。" }
    return {
      kind: "assistant-text",
      text: `将模拟下载「${item.name}」：\nvvcli drive files download --file-id file_xxx --target "~/Downloads"`,
    }
  }
  if (followUp === "drive-share") {
    const item = ctx.driveItems.find((d) => d.id === choiceId)
    if (!item) return { kind: "assistant-text", text: "未找到文件。" }
    return {
      kind: "assistant-text",
      text: `请共享「${item.name}」这个文件给「团队」，权限「可查看」。\n对应 vvcli drive files share。`,
    }
  }
  return { kind: "assistant-text", text: "未知操作。" }
}
