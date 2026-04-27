/**
 * 首页场景按钮旁的说明文案；与《主CUI交互》顶栏「场景说明」抽屉共用，避免两处漂移。
 */

/** `scenario-five`：首页入口与「场景说明」中小节标题 */
export const HOME_SCENARIO_FIVE_ENTRY_LABEL =
  "场景五（学校 + 教育机构 + 医院 · 底部并集）" as const

export const HOME_SCENARIO_COPY = {
  mainNoOrg:
    "当用户还未加入任何组织时，默认应用除了主VVAI之外，剩下的只有个人应用（待办、日历、会议、文档、邮箱、微盘）。",
  scenarioTwoEduOne:
    "在主AI给具体指令后，直接在主AI给出具体业务卡片，完成业务指令操作，不跳出主AI。但同步信息到指令对应的应用对话中。",
  scenarioTwoMultiOrgs:
    "用户加入多个组织时，直接在主AI出具体业务卡片完成所有业务指令操作，不跳出主AI，同时给出可对其他所在组织操作的推荐指令。同步信息到指令对应的应用对话中。",
  multiOrgPersonal:
    "当用户加入多个组织时，在主VVAI和个人应用对话时，顶部组织的默认定位在上一次组织选择中，点击展开可以切换。",
  multiOrgDock:
    "对于组织应用而言，如果进入应用对话之前是哪个组织，则会选定在对应组织进行对话，用户切换组织后，则等于切换的对应组织的应用进行对话。",
} as const
