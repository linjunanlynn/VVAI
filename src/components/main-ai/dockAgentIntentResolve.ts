/**
 * 各应用 Agent dock 会话：自然语言 → 本应用执行 / 跨应用 handoff（规则演示，接入 NLU 后替换）
 */

import { DOCK_APP_SHORTCUTS } from "./dockAppShortcuts"
import { getDockAppMeta } from "./organizationDockConfig"
import { matchTeachingStudentGradeQuery } from "./teachingDockIntents"

export function getConversationDockAppId(conversation: {
  id: string
  dockAppId?: string
}): string | null {
  if (conversation.dockAppId) return conversation.dockAppId
  const m = conversation.id.match(/^dock:[^:]+:(.+)$/)
  return m?.[1] ?? null
}

export type DockIntentResolution =
  | { kind: "execute_local"; appId: string; matchedPhrase: string; score: number }
  | { kind: "handoff"; targetAppId: string; matchedPhrase: string; score: number }

type RawMatch = { appId: string; phrase: string; score: number }

/**
 * 学校组织「教育」门户内二级：老师管理 / 学员管理 / 教学管理 / 后勤管理。
 * 仅为能力分类，非独立 dock 会话；在教育应用对话中命中时应留在「教育」会话处理。
 */
const EDUCATION_PORTAL_SCHOOL_CATEGORY_APP_IDS = new Set([
  "teacher_mgmt",
  "student_mgmt",
  "teaching",
  "logistics",
])

/** 「查成绩」类：仅教学管理有完整能力，其它应用命中则建议跳转教学 */
const TEACHING_GRADE_HINT_SCORE = 540

/** 自然语言补充：短语未覆盖时的兜底（分不宜过高，避免压过精确快捷指令） */
const SUPPLEMENTAL_INTENTS: ReadonlyArray<{
  appId: string
  label: string
  score: number
  test: (t: string) => boolean
}> = [
  { appId: "goods", label: "商品与订单", score: 88, test: (t) => /商品订单|课程商品|物料商品|库存|退款|售后/.test(t) },
  {
    appId: "members",
    label: "成员与师生",
    score: 88,
    test: (t) =>
      (/学员|分班|家长联系方式|师生/.test(t) ||
        /(老师|教师)(档案|名单|名册|信息|录入|查询|管理|考核|培训|任课)/.test(t)) &&
      !/成绩|作业/.test(t),
  },
  { appId: "finance", label: "财务与报表", score: 88, test: (t) => /财务报表|对账单|收入|支出|开票|费用科目/.test(t) },
  { appId: "calendar", label: "日程", score: 86, test: (t) => /日程|日程提醒|今日安排|本周安排/.test(t) },
  { appId: "meeting", label: "会议", score: 86, test: (t) => /预约会议|会议室|会议纪要|会议提醒|会议列表/.test(t) },
  { appId: "todo", label: "待办任务", score: 86, test: (t) => /待办|待办清单|任务提醒|标记已完成/.test(t) },
  { appId: "document", label: "文档", score: 84, test: (t) => /新建文档|协作文档|文档权限|最近编辑的文档/.test(t) },
  { appId: "disk", label: "微盘文件", score: 84, test: (t) => /微盘|上传文件|共享文件夹|存储空间/.test(t) },
  { appId: "mail", label: "邮件", score: 84, test: (t) => /写邮件|收件箱|邮件规则|邮件签名/.test(t) },
  { appId: "salary", label: "薪酬", score: 84, test: (t) => /工资条|薪酬|报销|个税|社保|公积金|薪资条/.test(t) },
  {
    appId: "recruitment",
    label: "招聘",
    score: 84,
    test: (t) => /招聘|职位发布|简历|面试|候选人|Offer/.test(t),
  },
  { appId: "teaching", label: "教学与作业", score: 90, test: (t) => /教学课表|布置作业|录入成绩|听课评课|教研活动/.test(t) },
  { appId: "logistics", label: "后勤工单", score: 82, test: (t) => /报修|耗材|后勤工单|教室巡检|维修进度/.test(t) },
  { appId: "assets", label: "资产", score: 82, test: (t) => /资产盘点|领用设备|报废|资产台账|折旧/.test(t) },
  {
    appId: "attendance",
    label: "考勤",
    score: 88,
    test: (t) =>
      /考勤|请假|补卡|加班|外出登记/.test(t) ||
      (/(?:老师|教师|员工|同事)/.test(t) &&
        /来了[吗么]|到没到|有没有来|到岗|出勤|到课|到了吗|在不在/.test(t)) ||
      (/(?:老师|教师)/.test(t) && /今天|今日/.test(t) && /来了|到了|到没|有没有/.test(t)),
  },
  { appId: "education", label: "教务综合", score: 80, test: (t) => /教务|课时统计|点名|教务通知/.test(t) },
  { appId: "company", label: "组织信息", score: 78, test: (t) => /公司信息|组织架构|公告通知|制度查询/.test(t) },
  { appId: "profile", label: "个人设置", score: 78, test: (t) => /个人信息|账号安全|通知设置|偏好设置/.test(t) },
  { appId: "organization", label: "组织管理", score: 78, test: (t) => /切换组织|组织成员|组织设置|邀请成员/.test(t) },
  { appId: "employee", label: "人事流程", score: 78, test: (t) => /花名册|入职|转正|离职交接/.test(t) },
  {
    appId: "surgery",
    label: "手术排班与围术期",
    score: 90,
    test: (t) =>
      /手术|手术室|术前|术后|麻醉|排台|术式|切口|病理标本|手术同意/.test(t) &&
      !/药品|采购|药库|集采|供应商/.test(t),
  },
  {
    appId: "pharma_procurement",
    label: "药品采购与供应",
    score: 90,
    test: (t) =>
      /药品采购|集采|药库|供应商|冷链|近效期|采购单|到货验收|采购申请/.test(t) ||
      (/采购/.test(t) && /药|耗材/.test(t)),
  },
  { appId: "hospital", label: "医院门户", score: 86, test: (t) => /入院|医护排班|病区|床位|候床|高值耗材|病历|随访/.test(t) },
  { appId: "patient_mgmt", label: "患者管理", score: 88, test: (t) => /患者|入院|出院|病历|复诊|随访/.test(t) },
  { appId: "staff_schedule", label: "医护排班", score: 88, test: (t) => /医护排班|调班|替班|夜班/.test(t) },
  { appId: "medical_supplies", label: "医疗耗材", score: 88, test: (t) => /医疗耗材|高值耗材|科室申领|效期/.test(t) },
  { appId: "bed_mgmt", label: "床位管理", score: 88, test: (t) => /床位|空床|转床|转科|候床/.test(t) },
  { appId: "teacher_mgmt", label: "老师管理", score: 86, test: (t) => /老师档案|任课老师|老师考核|老师培训/.test(t) },
  { appId: "student_mgmt", label: "学员管理", score: 86, test: (t) => /学员花名册|学员分班|学员升级|家长联系/.test(t) },
  { appId: "performance", label: "绩效", score: 82, test: (t) => /绩效|OKR|自评|面谈/.test(t) },
  { appId: "policy", label: "制度", score: 80, test: (t) => /制度|合规|签收|规章/.test(t) },
  { appId: "supplies", label: "物资", score: 80, test: (t) => /物资申领|库存|调拨|低库存/.test(t) },
  { appId: "onboarding", label: "入职", score: 80, test: (t) => /入职清单|入职材料|试用期/.test(t) },
  { appId: "regularization", label: "转正", score: 80, test: (t) => /转正申请|转正答辩/.test(t) },
  { appId: "transfer", label: "调岗", score: 80, test: (t) => /调岗|岗位调整/.test(t) },
  { appId: "offboarding", label: "离职", score: 80, test: (t) => /离职交接|离职证明/.test(t) },
  { appId: "contract", label: "合同", score: 80, test: (t) => /合同台账|续签|合同到期/.test(t) },
  { appId: "objectives", label: "目标", score: 80, test: (t) => /OKR|关键结果|目标分解/.test(t) },
  { appId: "project", label: "项目", score: 80, test: (t) => /项目里程碑|项目风险|项目周报/.test(t) },
  { appId: "work_task", label: "工作任务", score: 80, test: (t) => /工作任务|任务指派|任务验收/.test(t) },
  { appId: "feedback", label: "反馈", score: 78, test: (t) => /意见箱|满意度|工单/.test(t) },
  { appId: "meeting_room", label: "会议室", score: 82, test: (t) => /预定会议室|会议室占用|会议室签到/.test(t) },
  { appId: "workflow", label: "流程", score: 80, test: (t) => /审批流程|待审批|催办/.test(t) },
  { appId: "permission", label: "权限", score: 78, test: (t) => /申请权限|权限变更|审计/.test(t) },
  { appId: "customer", label: "客户", score: 80, test: (t) => /客户档案|商机|跟进记录/.test(t) },
]

function collectShortcutMatches(t: string): RawMatch[] {
  const out: RawMatch[] = []
  for (const [appId, phrases] of Object.entries(DOCK_APP_SHORTCUTS)) {
    for (const phrase of phrases) {
      const p = phrase.trim()
      if (p.length < 2) continue
      if (t.includes(p)) {
        out.push({ appId, phrase: p, score: p.length * 10 + Math.min(p.length, 20) })
      }
    }
  }
  return out
}

function collectSupplementalMatches(t: string): RawMatch[] {
  const out: RawMatch[] = []
  for (const row of SUPPLEMENTAL_INTENTS) {
    if (row.test(t)) {
      out.push({ appId: row.appId, phrase: row.label, score: row.score })
    }
  }
  return out
}

/**
 * 是否与任意底部应用快捷指令 / 全局补充意图 / 教学查成绩等「业务向」表述相关。
 * 用于 dock 会话：与 `planGeneralVvInteraction` 的 Demo 兜底回复组合，识别「非业务自然语言」。
 */
export function hasAnyGlobalDockBusinessIntent(userText: string): boolean {
  const t = userText.trim()
  if (!t) return false
  if (matchTeachingStudentGradeQuery(t)) return true
  const merged = dedupeMatches([...collectShortcutMatches(t), ...collectSupplementalMatches(t)])
  return merged.length > 0
}

function pickBest(matches: RawMatch[], currentAppId: string | null): RawMatch | null {
  if (matches.length === 0) return null
  const sorted = [...matches].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    if (currentAppId) {
      if (a.appId === currentAppId && b.appId !== currentAppId) return -1
      if (b.appId === currentAppId && a.appId !== currentAppId) return 1
    }
    if (a.phrase.length !== b.phrase.length) return b.phrase.length - a.phrase.length
    return a.appId.localeCompare(b.appId)
  })
  return sorted[0] ?? null
}

function dedupeMatches(matches: RawMatch[]): RawMatch[] {
  const map = new Map<string, RawMatch>()
  for (const m of matches) {
    const key = `${m.appId}::${m.phrase}`
    const prev = map.get(key)
    if (!prev || m.score > prev.score) map.set(key, m)
  }
  return [...map.values()]
}

/**
 * 在 dock 会话中解析用户输入：应在本应用执行，还是跳转其它应用 Agent。
 * @param userText 用户原文
 * @param currentAppId 当前 dock 应用 id；无法解析时为 null（不做意图分流）
 */
export function resolveDockAgentIntent(
  userText: string,
  currentAppId: string | null
): DockIntentResolution | null {
  const t = userText.trim()
  if (!t || !currentAppId) return null

  const matches: RawMatch[] = []

  matches.push(...collectShortcutMatches(t))
  matches.push(...collectSupplementalMatches(t))

  if (matchTeachingStudentGradeQuery(t)) {
    matches.push({
      appId: "teaching",
      phrase: "查询学生成绩",
      score: TEACHING_GRADE_HINT_SCORE,
    })
  }

  const merged = dedupeMatches(matches)
  const best = pickBest(merged, currentAppId)
  if (!best) return null

  if (best.appId === currentAppId) {
    return { kind: "execute_local", appId: best.appId, matchedPhrase: best.phrase, score: best.score }
  }

  if (
    currentAppId === "education" &&
    EDUCATION_PORTAL_SCHOOL_CATEGORY_APP_IDS.has(best.appId)
  ) {
    return { kind: "execute_local", appId: "education", matchedPhrase: best.phrase, score: best.score }
  }

  return {
    kind: "handoff",
    targetAppId: best.appId,
    matchedPhrase: best.phrase,
    score: best.score,
  }
}

/** 跨应用 handoff 卡片 JSON（与 DOCK_CROSS_HANDOFF_MARKER 解析字段一致） */
export function buildCrossDockHandoffCardPayload(opts: {
  raw: string
  targetAppId: string
  targetAppName: string
  fromAppName: string
  matchedPhrase: string
  /** 已在当前应用内自动同步目标应用与主 VVAI 时，弱化「仅按钮才同步」的文案 */
  autoSynced?: boolean
}) {
  const label =
    opts.matchedPhrase.length > 22 ? `${opts.matchedPhrase.slice(0, 20)}…` : opts.matchedPhrase
  const handoffLine = opts.autoSynced
    ? `演示：你的原话、跨应用引导卡及「${opts.targetAppName}」侧业务结果卡已写入对应应用会话，并追加到主 VVAI 时间线。仍可点击下方在目标应用中继续补充。`
    : `点击下方按钮将切换到「${opts.targetAppName}」会话，并带上你的原话（前缀为「【从「${opts.fromAppName}」转入】」），减少重复输入。`
  return {
    targetAppId: opts.targetAppId,
    targetAppName: opts.targetAppName,
    fromAppName: opts.fromAppName,
    intentLabel: label,
    cardTitle: `「${opts.targetAppName}」更适合处理这类需求`,
    confirmLine: `当前你在「${opts.fromAppName}」对话中；根据你的描述，这类业务在「${opts.targetAppName}」中能力更完整，也有对应快捷指令。`,
    handoffLine,
    carryOverText: opts.raw,
  }
}

/** GenericCard 内与业务相关的操作区（JSON `cardActions`，由《主CUI交互》解析渲染） */
export type GenericCardActionsPayload = {
  primary?: { label: string; sendText: string }
  secondary?:
    | { label: string; sendText: string }
    /** 教育门户欢迎卡等：保留「换一批推荐」的演示交互 */
    | { label: string; preset: "more_recommend" }
}

const DOCK_INTENT_FOLLOWUPS: Record<string, string[]> = {
  attendance: [
    "今天未到岗的是哪些人？请按部门列一下。",
    "帮我发起一条补卡审批，说明需要填的字段。",
    "统计本周迟到、早退、缺卡各有多少人次。",
  ],
  goods: [
    "把待发货的 3 单按收货地址合并成发货批次。",
    "素描纸库存预警：建议补货数量与预计到货日。",
    "生成一张今日发货单草稿给我确认。",
  ],
  members: [
    "导出当前检索到的学员名单（含家长联系方式列）。",
    "最近更新的 2 条家长联系方式具体改了什么？",
    "按班级拆分这份名单并发给班主任。",
  ],
  finance: [
    "打开待对账的 2 笔，列出差异项。",
    "把本月收入按科目拆成简要说明。",
    "导出对账单 PDF 给我预览。",
  ],
  calendar: [
    "把下一场「需求评审」提前 15 分钟并通知参会人。",
    "今天剩余日程里有没有冲突？",
    "给下午的会议加一个会前提醒。",
  ],
  meeting: [
    "给已预约的会议发会前提醒，附上议程链接占位。",
    "把参会人里未回复邀请的列出来。",
    "会议室 B 若占用冲突，推荐备选时段。",
  ],
  todo: [
    "把逾期的那 1 条标为高优并建议处理顺序。",
    "按项目维度汇总今日待办。",
    "帮我把其中 2 条委派给对应负责人（演示）。",
  ],
  document: [
    "把最近编辑的 3 个文档里权限最敏感的那个标出来。",
    "给「产品需求说明」开协作者只读链接（演示）。",
    "列出需要我补全元数据的文档。",
  ],
  disk: [
    "把命中文件里最大的 2 个列出来。",
    "新建共享文件夹并设置部门可见（演示）。",
    "按文件名规则批量整理检索结果。",
  ],
  mail: [
    "把草稿补全主题与正文要点，我再改口吻。",
    "推荐收件人分组：按项目 / 按角色。",
    "检查签名与抄送是否符合公司规范（演示）。",
  ],
  salary: [
    "打开最近一条工资条的个税明细结构说明。",
    "对比上月实发差异项（演示）。",
    "生成给员工看的工资条说明话术。",
  ],
  recruitment: [
    "把待面试的 3 人按岗位排优先级。",
    "生成面试邀约邮件模板（含时间占位）。",
    "在招职位的 JD 里补一条硬性技能要求。",
  ],
  teaching: [
    "本周听课记录还差哪几位老师？",
    "把教学计划同步到家长端的摘要话术。",
    "录入一条听课反馈：课堂互动偏少（演示）。",
  ],
  logistics: [
    "报修单 #1024 当前进度与预计完成时间？",
    "追加现场照片与故障描述到工单。",
    "把同类报修合并处理是否合适？",
  ],
  assets: [
    "打印资产标签前需要核对哪些字段？",
    "盘点任务里差异最大的 5 件资产是哪些？",
    "生成盘点小结给财务备案（演示）。",
  ],
  education: [
    "本周课消异常班级有哪些？",
    "教务通知拟一版群发摘要（含截止时间）。",
    "把课时统计导出为周报表头格式。",
  ],
  company: [
    "最近一条公告的要点摘要。",
    "组织架构里新调整的部门路径说明。",
    "制度查询：考勤相关条目入口在哪（演示）？",
  ],
  profile: [
    "检查账号安全项里是否有异地登录提示。",
    "把通知偏好改成仅工作日推送（演示）。",
    "导出个人资料变更记录。",
  ],
  organization: [
    "生成邀请成员链接与有效期说明。",
    "按角色统计成员分布。",
    "列出待审批的加入申请（演示）。",
  ],
  employee: [
    "试用期内 5 人的转正节点分别是什么时候？",
    "办理转正需要哪些材料清单？",
    "把其中 1 人标记为「需延长试用」（演示）。",
  ],
  surgery: [
    "今日 3 台手术的术前核对项逐项确认。",
    "麻醉会诊申请需要附哪些检验（演示）？",
    "高值耗材申领与手术排台的关联说明。",
  ],
  pharma_procurement: [
    "在途采购单预计到货窗口与联系人。",
    "冷链验收记录模板里必填字段有哪些？",
    "发起供应商比价：需要上传哪些附件（演示）？",
  ],
  course: [
    "课表冲突检测里若改教室，推荐备选教室。",
    "发布调课通知的接收人范围怎么定？",
    "把 A-301 占用情况同步给教务（演示）。",
  ],
  hospital: [
    "今日入院与出院各有多少？病区床位占用率？",
    "候床名单里优先级最高的是谁、预计何时有床？",
    "高值耗材与病历随访分别需要我确认什么？",
  ],
  patient_mgmt: [
    "列出今日待复诊患者及上次诊断摘要占位。",
    "某位患者的出院带药与随访计划怎么查？",
    "入院手续还差哪些材料（演示）？",
  ],
  staff_schedule: [
    "本周夜班排班是否有人连续顶班？",
    "调班申请当前待审批有几条？",
    "替班规则与合规校验要点说明。",
  ],
  medical_supplies: [
    "科室申领里近效期预警有哪些 SKU？",
    "高值耗材追溯码绑定流程演示步骤。",
    "本周申领峰值出现在哪个科室？",
  ],
  bed_mgmt: [
    "当前空床分布按病区列一下。",
    "转床/转科流程里需要谁审批（演示）？",
    "候床队列里预计明日可安排几人？",
  ],
}

const DOCK_CARD_ACTIONS: Record<string, (matched: string) => GenericCardActionsPayload> = {
  attendance: () => ({
    primary: { label: "查看未到人员", sendText: "请列出今日未到岗人员名单，并标注缺卡、请假或外勤原因。" },
    secondary: { label: "发起补卡审批", sendText: "我要为今日漏打卡的同事发起补卡审批，请引导我填写必要信息。" },
  }),
  goods: () => ({
    primary: { label: "处理待发货", sendText: "请带我处理待发货订单：合并批次、核对地址并生成发货单草稿。" },
    secondary: { label: "处理库存预警", sendText: "针对「素描纸」库存预警，给出补货建议数量与采购占位流程。" },
  }),
  members: () => ({
    primary: { label: "导出学员名单", sendText: "导出当前检索到的学员名单，含家长联系方式与所在班级。" },
    secondary: { label: "查看最近更新", sendText: "展开最近更新的家长联系方式变更明细。" },
  }),
  finance: () => ({
    primary: { label: "查看待对账", sendText: "打开待对账的明细，列出每笔的差异原因占位。" },
    secondary: { label: "导出对账单", sendText: "导出本月对账单（演示），并说明可对接的真实系统字段。" },
  }),
  calendar: () => ({
    primary: { label: "管理今日日程", sendText: "基于今日日程，标出冲突与空档，并建议调整。" },
    secondary: { label: "添加提醒", sendText: "给下一场会议添加会前提醒与议程占位。" },
  }),
  meeting: () => ({
    primary: { label: "发送会前提醒", sendText: "给已预约会议发送会前提醒，附上议程与资料链接占位。" },
    secondary: { label: "检查会议室", sendText: "确认会议室占用与备选方案。" },
  }),
  todo: () => ({
    primary: { label: "处理逾期待办", sendText: "优先处理逾期待办：列出建议顺序与依赖。" },
    secondary: { label: "按项目筛选", sendText: "按项目维度筛选今日待办并汇总进度。" },
  }),
  document: () => ({
    primary: { label: "设置协作权限", sendText: "为最近编辑的文档设置合适的协作权限并说明风险。" },
    secondary: { label: "查看最近文档", sendText: "列出最近编辑文档及最后修改人。" },
  }),
  disk: () => ({
    primary: { label: "打开命中文件", sendText: "展示微盘检索命中的文件列表与路径。" },
    secondary: { label: "创建共享文件夹", sendText: "创建共享文件夹并设置部门可见（演示步骤）。" },
  }),
  mail: () => ({
    primary: { label: "完善并发送", sendText: "完善邮件草稿：补主题、正文要点与收件人建议。" },
    secondary: { label: "检查邮件规则", sendText: "检查当前草稿是否符合邮件规则与签名规范（演示）。" },
  }),
  salary: () => ({
    primary: { label: "查看个税明细", sendText: "打开最近工资条的个税与五险一金明细说明。" },
    secondary: { label: "对比上月实发", sendText: "对比上月实发差异项并解释常见变动原因（演示）。" },
  }),
  recruitment: () => ({
    primary: { label: "安排面试", sendText: "为待面试候选人安排时间并生成邀约话术。" },
    secondary: { label: "查看在招职位", sendText: "汇总在招职位与候选人漏斗（演示）。" },
  }),
  teaching: () => ({
    primary: { label: "同步本周课时", sendText: "确认本周课时同步结果并列出异常班级。" },
    secondary: { label: "录入听课记录", sendText: "我要录入一条听课记录，请给出表单要点。" },
  }),
  logistics: () => ({
    primary: { label: "查看工单进度", sendText: "查询报修单 #1024 的当前进度与预计完成时间。" },
    secondary: { label: "补充工单信息", sendText: "为工单补充现场照片与故障描述字段。" },
  }),
  assets: () => ({
    primary: { label: "继续盘点", sendText: "继续当前盘点任务并列出下一批待扫资产。" },
    secondary: { label: "打印资产标签", sendText: "生成资产标签打印预览与字段核对清单。" },
  }),
  education: () => ({
    primary: { label: "查看课消异常", sendText: "列出本周课消异常班级与可能原因（演示）。" },
    secondary: { label: "群发教务通知", sendText: "起草一条教务通知群发摘要，含截止时间与联系人。" },
  }),
  company: () => ({
    primary: { label: "查看公告", sendText: "打开最新组织公告并生成要点摘要。" },
    secondary: { label: "查看组织架构", sendText: "展示组织架构最近变更说明（演示）。" },
  }),
  profile: () => ({
    primary: { label: "账号安全检查", sendText: "逐项说明账号安全检查结果与建议操作。" },
    secondary: { label: "通知偏好", sendText: "把通知偏好改为仅工作日推送（演示流程）。" },
  }),
  organization: () => ({
    primary: { label: "邀请成员", sendText: "生成邀请成员链接与有效期说明。" },
    secondary: { label: "成员统计", sendText: "按角色统计当前组织成员分布（演示）。" },
  }),
  employee: () => ({
    primary: { label: "筛选试用期", sendText: "列出试用期内人员及转正节点。" },
    secondary: { label: "办理转正", sendText: "发起转正流程并列出所需材料清单。" },
  }),
  surgery: () => ({
    primary: { label: "术前核对", sendText: "按台次列出术前核对项完成情况（演示）。" },
    secondary: { label: "麻醉会诊", sendText: "发起麻醉会诊申请并说明附件要求（演示）。" },
  }),
  pharma_procurement: () => ({
    primary: { label: "在途采购单", sendText: "展示在途采购单与预计到货窗口。" },
    secondary: { label: "冷链验收", sendText: "打开冷链验收记录模板并标必填字段。" },
  }),
  course: () => ({
    primary: { label: "发布调课通知", sendText: "基于当前课表结果，起草调课通知接收范围与文案。" },
    secondary: { label: "调整教室", sendText: "若 A-301 不可用，推荐备选教室与冲突检测（演示）。" },
  }),
  hospital: () => ({
    primary: { label: "病区与床位概览", sendText: "汇总今日入院/出院与病区床位占用（演示）。" },
    secondary: { label: "候床与高值耗材", sendText: "打开候床优先级说明与高值耗材关联流程（演示）。" },
  }),
  patient_mgmt: () => ({
    primary: { label: "患者列表", sendText: "列出在院患者关键字段与下次处置时间占位。" },
    secondary: { label: "随访计划", sendText: "生成某位患者的随访计划草稿（演示）。" },
  }),
  staff_schedule: () => ({
    primary: { label: "查看排班冲突", sendText: "检查本周夜班与调班是否存在冲突或连续值班风险。" },
    secondary: { label: "调班审批", sendText: "列出待审批调班申请及建议处理顺序（演示）。" },
  }),
  medical_supplies: () => ({
    primary: { label: "近效期预警", sendText: "展示科室申领中的近效期耗材清单与处理建议。" },
    secondary: { label: "高值耗材追溯", sendText: "走一遍高值耗材追溯码绑定步骤说明（演示）。" },
  }),
  bed_mgmt: () => ({
    primary: { label: "空床与转床", sendText: "按病区列出空床与转床/转科待办（演示）。" },
    secondary: { label: "候床队列", sendText: "展示候床队列与预计安排窗口（演示）。" },
  }),
}

/** Dock 本应用执行成功后的追问推荐（用户口吻，非提示词工程话术） */
export function buildDockIntentFollowUpPrompts(appId: string, matchedPhrase: string): string[] {
  const fixed = DOCK_INTENT_FOLLOWUPS[appId]
  if (fixed?.length) return [...fixed]
  const short = matchedPhrase.length > 24 ? `${matchedPhrase.slice(0, 22)}…` : matchedPhrase
  return [
    `围绕「${short}」，下一步具体可以帮我做什么？`,
    "把上面结果用三五句话写成可转发给同事的同步文案。",
    "还有哪些信息需要我补充（时间范围、部门、人员名单）？",
  ]
}

/** Dock 执行结果卡片底部主/次操作（与 buildDockIntentResultDetail 同一意图域） */
export function buildDockGenericCardInlineActions(
  appId: string,
  matchedPhrase: string
): GenericCardActionsPayload {
  const builder = DOCK_CARD_ACTIONS[appId]
  if (builder) return builder(matchedPhrase)
  const short = matchedPhrase.length > 18 ? `${matchedPhrase.slice(0, 16)}…` : matchedPhrase
  return {
    primary: { label: "继续办理", sendText: `请基于「${short}」继续给出可执行步骤与所需输入项。` },
    secondary: { label: "换种问法", sendText: `我换个说法：请用清单形式列出与「${short}」相关的下一步操作选项。` },
  }
}

/** 本应用执行结果的演示说明文案（GenericCard detail） */
export function buildDockIntentResultDetail(appId: string, matchedPhrase: string): string {
  const line = (s: string) => `· ${s}`
  const common = [
    line(`已匹配业务意图：${matchedPhrase}`),
    line("以下为演示占位结果，接入业务系统后将展示实时数据与可操作表单。"),
  ]
  const byApp: Record<string, string[]> = {
    course: ["课表冲突检测：未发现冲突", "已选教室：A-301", "可继续：发布调课通知"],
    goods: ["订单状态：待发货 3 单", "库存预警：物料「素描纸」低于阈值", "可继续：生成发货单"],
    members: ["检索到学员：12 人（演示）", "最近更新：家长联系方式 2 条", "可继续：导出名单"],
    finance: ["本月收入：¥128,400（演示）", "待对账：2 笔", "可继续：导出对账单"],
    calendar: ["今日日程：4 条", "下一场：15:00 需求评审", "可继续：添加提醒"],
    meeting: ["已预约会议室：B-会议室（演示）", "参会人：已发送邀请", "可继续：发送会前提醒"],
    todo: ["今日待办：6 条，逾期 1 条（演示）", "可继续：按项目筛选"],
    document: ["最近编辑：3 个文档", "可继续：设置协作权限"],
    disk: ["微盘检索：命中 5 个文件（演示）", "可继续：创建共享文件夹"],
    mail: ["草稿已生成（演示）", "可继续：选择收件人并发送"],
    salary: ["最近一条工资条：已发放（演示）", "可继续：查看个税明细"],
    recruitment: ["在招职位：2 个", "待面试：3 人（演示）", "可继续：安排面试"],
    teaching: ["教学计划：已同步本周课时（演示）", "可继续：录入听课记录"],
    logistics: ["工单：已创建报修单 #1024（演示）", "可继续：查看维修进度"],
    assets: ["盘点任务：进行中（演示）", "可继续：打印资产标签"],
    attendance: ["今日考勤：应到 42 人，实到 40 人（演示）", "可继续：发起补卡审批"],
    education: ["教务概览：本周课消正常（演示）", "可继续：群发教务通知"],
    company: ["组织信息已加载（演示）", "可继续：查看公告"],
    profile: ["账号安全项：正常（演示）", "可继续：修改通知偏好"],
    organization: ["当前组织成员：120 人（演示）", "可继续：邀请成员"],
    employee: ["花名册：已筛选试用期内 5 人（演示）", "可继续：办理转正"],
    surgery: [
      "今日手术台次：3（演示）· 手术室 OR-2 已预留 14:00",
      "术前核对：血常规/凝血已关联（演示）",
      "可继续：推送麻醉会诊或申领高值耗材",
    ],
    pharma_procurement: [
      "在途采购单：2 笔（演示）· 头孢类预计明日到货",
      "集采目录：本次申请已自动匹配编码（演示）",
      "可继续：发起供应商比价或冷链验收记录",
    ],
  }
  const extra = byApp[appId] ?? ["处理请求已入队（演示）", "可继续：使用底部快捷指令细化操作"]
  return [...common, ...extra.map(line)].join("\n")
}

/** 与《主CUI交互》内 dock 本应用执行卡一致的 `<<<RENDER_GENERIC_CARD>>>:…` 序列化内容 */
export function buildDockGenericCardSerializedContent(appId: string, matchedPhrase: string): string {
  const meta = getDockAppMeta(appId)
  const detail = buildDockIntentResultDetail(appId, matchedPhrase)
  const cardActions = buildDockGenericCardInlineActions(appId, matchedPhrase)
  const cardData = JSON.stringify({
    title: `${meta.name} · 执行结果（演示）`,
    description: `已根据你的描述在「${meta.name}」上下文中解析业务意图，并生成下列演示反馈。`,
    detail,
    imageSrc: meta.imageSrc,
    cardActions,
  })
  return `<<<RENDER_GENERIC_CARD>>>:${cardData}`
}

/** 未命中任何业务规则：视为「非业务自然语言」，走通用对话并镜像主 VVAI（规则演示，接入 NLU 后替换） */
export function isDockNonBusinessNaturalLanguage(resolution: DockIntentResolution | null): boolean {
  return resolution == null
}
