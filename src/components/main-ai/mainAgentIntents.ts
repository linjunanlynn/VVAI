/**
 * 主会话「VVAI」自然语言意图 → dock 应用承接（演示用规则匹配）
 * 命中后展示确认卡片，用户点击后进入对应应用会话并带入原文摘要
 */

export type MainAgentIntentDefinition = {
  keywords: readonly string[]
  appId: string
  appName: string
  /** 按钮上展示的动作名 */
  intentLabel: string
  /** 卡片标题 */
  cardTitle: string
  /** 对用户意图的一句话确认 */
  confirmLine: string
  /** 说明为何要到应用里继续 */
  handoffLine: string
}

export const MAIN_AGENT_INTENTS: readonly MainAgentIntentDefinition[] = [
  {
    keywords: ["创建订单", "新订单", "修改订单", "查订单", "课程商品", "物料商品", "账单设置"],
    appId: "goods",
    appName: "商品管理",
    intentLabel: "订单与商品",
    cardTitle: "识别到商品或订单相关需求",
    confirmLine: "你可能需要处理商品、订单或账单相关操作。",
    handoffLine: "这些能力在「商品管理」中统一处理，切换到该助手后继续说明即可。",
  },
  {
    keywords: [
      "学员",
      "学生",
      "录入学员",
      "查询学员",
      "录入老师",
      "查询老师",
      "老师档案",
      "老师名册",
      "任课老师",
    ],
    appId: "members",
    appName: "成员管理",
    intentLabel: "成员管理",
    cardTitle: "识别到成员管理需求",
    confirmLine: "听起来你要处理学员或老师等成员信息。",
    handoffLine: "成员录入与查询在「成员管理」中完成，切换到该助手后继续。",
  },
  {
    keywords: ["收入", "支出", "财务报表", "账单", "对账"],
    appId: "finance",
    appName: "财务管理",
    intentLabel: "财务",
    cardTitle: "识别到财务相关需求",
    confirmLine: "你可能要查看收入、支出或财务报表。",
    handoffLine: "财务数据在「财务管理」中查看与配置更合适，切换到该助手后继续。",
  },
  {
    keywords: ["待办", "待办事项", "今天待办"],
    appId: "todo",
    appName: "待办",
    intentLabel: "待办",
    cardTitle: "识别到待办相关需求",
    confirmLine: "你想处理待办或任务相关的事情。",
    handoffLine: "在「待办」应用里可以更好地列出与跟进任务。",
  },
  {
    keywords: ["日历", "日程", "会议安排", "约会议"],
    appId: "calendar",
    appName: "日历",
    intentLabel: "日程",
    cardTitle: "识别到日程相关需求",
    confirmLine: "你想查看或安排日程、会议等时间相关事项。",
    handoffLine: "在「日历」里管理日程更直观，切换到该助手后继续。",
  },
]

export type MainAgentIntentMatch = MainAgentIntentDefinition & {
  /** 用户原话，用于带入应用会话 */
  carryOverText: string
}

/** 按关键词长度降序尝试，减少短词误伤（如「课」匹配过多）— 在单条意图内先匹配长词 */
export function matchMainAgentIntent(userText: string): MainAgentIntentMatch | null {
  const t = userText.trim()
  if (!t) return null
  for (const def of MAIN_AGENT_INTENTS) {
    const sorted = [...def.keywords].sort((a, b) => b.length - a.length)
    for (const kw of sorted) {
      if (t.includes(kw)) {
        return { ...def, carryOverText: t }
      }
    }
  }
  return null
}
