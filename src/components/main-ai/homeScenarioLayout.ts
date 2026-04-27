/**
 * 场景零（首页 `?scenario=no-org`）：**未加入任何组织**时的演示态。
 * 与「仅路由为 no-org、但已在流程中加入组织/教育主体」区分；后者应保持与其它 Home 场景一致的对话体验。
 */
export function isHomeScenarioZeroNoOrg(
  scenario: string | undefined,
  hasJoinedOrganizations: boolean
): boolean {
  return scenario === "no-org" && !hasJoinedOrganizations
}

/**
 * 首页 `?scenario=no-org` 路由（含后续已加入组织）：主 VVAI 输入「查看考勤」等时与场景二同构复用演示分流。
 * 其它 Home 入口不变。
 */
export function isNoOrgHomeScenarioRoute(scenario: string | undefined): boolean {
  return scenario === "no-org"
}

/** 场景二：首页「加入一个教育机构」入口（`edu-one`） */
export function isScenarioTwo(scenario: string | undefined): boolean {
  return scenario === "edu-one"
}

/** 首页「场景二（加入多个组织）」入口；与 `edu-one` 拆分后可单独演进 */
export const SCENARIO_TWO_MULTI_ORGS = "scenario-two-multi" as const

export function isScenarioTwoMultiOrgs(scenario: string | undefined): boolean {
  return scenario === SCENARIO_TWO_MULTI_ORGS
}

/** 场景二两条 Home 入口（单机构 + 多组织）：共享 dock 镜像、考勤等演示；仅动单机构时用 `isScenarioTwo` */
export function isScenarioTwoFamily(scenario: string | undefined): boolean {
  return isScenarioTwo(scenario) || isScenarioTwoMultiOrgs(scenario)
}

/** 首页「CUI卡片交互场景及规则」专用入口；后续只影响本入口的体验请用 `isCuiCardRulesScenario` 分支 */
export const SCENARIO_CUI_CARD_RULES = "cui-card-rules" as const

export function isCuiCardRulesScenario(scenario: string | undefined): boolean {
  return scenario === SCENARIO_CUI_CARD_RULES
}

/** 与场景二同构的单教育机构 Home 演示（`edu-one` + 本入口；共享逻辑用本函数，差异化用 `isCuiCardRulesScenario`） */
export function isScenarioTwoLike(scenario: string | undefined): boolean {
  return isScenarioTwoFamily(scenario) || isCuiCardRulesScenario(scenario)
}

/**
 * 场景二（`edu-one` / `scenario-two-multi`）主 VVAI 固定追问与《应用承接引导》（考勤等）演示流。
 * 多组织差异对齐 `isScenarioTwoMultiOrgs` / `isScenarioFourOrMainEntry` 等分支。
 */
export function isSingleOrgEduAttendanceScenarioFlow(scenario: string | undefined): boolean {
  return isScenarioTwoFamily(scenario)
}

/** 《主入口》：无 `scenario`（地址栏无 `?scenario=`）；交互与场景二一致，仅组织为两个默认通用主体 */
export function isMainEntryScenario(scenario: string | undefined): boolean {
  return scenario == null || scenario === ""
}

/** 场景二（多组织）：分栏会话、快捷条间距等与多所教育主体演示一致（原独立 `edu-multi` 入口已移除） */
export function isScenarioFourOrMainEntry(scenario: string | undefined): boolean {
  return isScenarioTwoMultiOrgs(scenario)
}

/** Home 场景：与场景五相同的《主CUI交互》布局与数据 */
export function isScenarioFiveLike(scenario: string | undefined): boolean {
  return scenario === "scenario-five"
}

/**
 * 主《主CUI交互》顶栏右侧「历史消息」时钟按钮是否隐藏。
 * 场景0（`no-org`）、场景五，以及《主入口》、场景二与本入口（与既有逻辑一致）均不展示。
 */
export function hideMainCuiNavHistoryIcon(scenario: string | undefined): boolean {
  if (isMainEntryScenario(scenario)) return true
  if (isScenarioTwoLike(scenario)) return true
  if (scenario === "no-org") return true
  if (isScenarioFiveLike(scenario)) return true
  return false
}
