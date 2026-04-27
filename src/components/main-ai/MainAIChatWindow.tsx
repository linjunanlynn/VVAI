import * as React from "react"
import { ScrollArea } from "../ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Input } from "../ui/input";
import { AllAppsDrawer } from "./AllAppsDrawer";
import { coerceMessagesList, Conversation, currentUser, Message } from "../chat/data"
import { cn } from "../ui/utils"
import { PersonalInfoManager } from "../chat/PersonalInfoManager"
import { HistorySidebar } from "../chat/HistorySidebar"
import { DockCuiFollowUpStrip } from "../chat/DockCuiFollowUpStrip"
import { ScenarioTwoMultiAttendanceFollowUpStrip } from "../chat/ScenarioTwoMultiAttendanceFollowUpStrip"
import { ScenarioTwoMultiFollowUpGrid } from "../chat/ScenarioTwoMultiFollowUpGrid"
import { 
  TimestampSeparator
} from "../chat/ChatComponents"
import { SidebarIcon } from "../chat/SidebarIcons"
import { CreateEmailForm } from "../chat/CreateEmailForm"
import { Button } from "../ui/button"
import { GenericCard } from "./GenericCard"
import {
  AttendanceStatisticsSnapshotCard,
  formatAttendanceMonthTitle,
} from "./AttendanceStatisticsSnapshotCard"

import { AppIcon } from './AppIcon';
import { DockAppSwitcherChip } from './DockAppSwitcherChip';
import { ChatNavBar } from "../chat/ChatNavBar"
import { ChatWelcome } from "../chat/ChatWelcome"
import { MAIN_CUI_GUIDE_GREETING, SCENARIO_ZERO_MAIN_CUI_GUIDE_GREETING } from "./mainCuiGuideGreeting"
import { PinnedTaskCard } from "../chat/PinnedTaskCard"
import { TaskDetailDrawer } from "../chat/TaskDetailDrawer"
import { ChatMessageBubble } from "../chat/ChatMessageBubble"
import { ChatSender } from "../chat/ChatSender"
import {
  DockSessionOrgReplyBanner,
  MainCuiCardOrgAttributionBanner,
} from "../chat/DockAgentOrgScopeBar"
import { OrganizationSwitcherCard, Organization } from "./OrganizationSwitcherCard"
import { ChatPromptButton } from "../chat/ChatPromptButton"
import { CreateOrgFormCard } from "./CreateOrgFormCard"
import { CreateOrgSuccessCard } from "./CreateOrgSuccessCard"
import { EduSpaceTypeSelectCard } from "./EduSpaceTypeSelectCard"
import {
  EDU_WELCOME_WEIWEI_MARKER,
  loadDemoEducationSpaceState,
  saveDemoEducationSpaceState,
  type DemoEducationSpaceRecord,
} from "./educationSpaceDemoPersistence"
import { EduWelcomeWeiweiCard } from "./EduWelcomeWeiweiCard"
import { SessionListEduSpaceHeader } from "../chat/SessionListEduSpaceHeader"
import { FamilyEducationRoleCard } from "../../fresh-user-portal/FamilyEducationRoleCard"
import { CreateFamilyEducationSpaceCard } from "../../fresh-user-portal/CreateFamilyEducationSpaceCard"
import {
  CreateInstitutionalEducationSpaceCard,
  type InstitutionalEducationSpacePayload,
} from "../../fresh-user-portal/CreateInstitutionalEducationSpaceCard"
import { EducationSpaceCreatedCard } from "../../fresh-user-portal/EducationSpaceCreatedCard"
import type { FamilyCreatorRole } from "../../fresh-user-portal/educationSpaceTypes"
import { JoinOrgFormCard } from "./JoinOrgFormCard"
import { JoinOrgConfirmCard } from "./JoinOrgConfirmCard"
import { getDockBarInlineShortcuts } from "./dockAppShortcuts"
import { matchMainAgentIntent } from "./mainAgentIntents"
import {
  matchSchoolScenarioEducationDockAttendanceGuidance,
  matchSchoolScenarioEducationDockEmployeeGuidance,
  matchSchoolScenarioMainCuiGuidance,
  type SchoolSceneAppGuidancePayload,
} from "./schoolScenarioMainCui"
import {
  getConversationDockAppId,
  hasAnyGlobalDockBusinessIntent,
  type GenericCardActionsPayload,
} from "./dockAgentIntentResolve"
import { buildDockNonBusinessNlAssistantBody } from "./dockNonBusinessNlReply"
import { getDockAppShortName } from "./dockAppShortNames"
import {
  extractStudentNameFromGradeQuery,
  isTeachingDockConversation,
  matchTeachingStudentGradeQuery,
} from "./teachingDockIntents"
import {
  TeachingStudentGradeCard,
  buildMockTeachingGradePayload,
  type TeachingStudentGradePayload,
} from "./TeachingStudentGradeCard"
import { SecondaryAppHistorySidebar, SecondaryAppSession } from "./SecondaryAppHistorySidebar"
import { MainChatHistorySheet } from "./MainChatHistorySheet"
import type { MainChatHistoryEntry } from "./mainChatHistoryTypes"
import { MainNavRail } from "./MainNavRail"
import { IMWorkspace } from "../im/IMWorkspace"
import { UserCalendarsProvider } from "../../vv-assistant/userCalendarsContext"
import {
  VvScheduleSideSheetContext,
  type VvScheduleSideSheetOpenOpts,
  type VvScheduleSideSheetSurface,
} from "../../vv-assistant/vvScheduleSideSheetContext"
import {
  ScheduleAgendaModalPanel,
  VvAssistantBlocks,
  VvUserBubble,
} from "../../vv-assistant/VvAssistantBlocks"
import { runVvGeneralSend, vvAssistantMessageFromPayload } from "../../vv-assistant/vvSend"
import { isVvPayloadCalendarConversationSyncDomain } from "../../vv-assistant/vvCalendarMirrorDomain"
import {
  isTodayScheduleAgendaQuery,
  matchesScheduleToolbarQuickIntent,
  planGeneralVvInteraction,
  planIsDemoCatalogFallback,
} from "../../vv-assistant/vvPlan"
import type {
  VvContext,
  VvFlow,
  VvMeetingItem,
  VvScheduleCalendarPrefs,
  VvScheduleItem,
  VvUserCalendarType,
} from "../../vv-assistant/types"
import {
  docsSeed,
  driveSeed,
  mailSeed,
  meetingSeed,
  recordSeed,
  scheduleSeed,
  todoSeed,
} from "../../vv-assistant/seeds"
import { defaultScheduleCalendarPrefs } from "../../vv-assistant/scheduleCalendarPrefs"
import { SCHEDULE_APP_QUICK_COMMANDS } from "../../vv-assistant/generalQuickCommands"
import {
  ScheduleSideConversationPanel,
  type ScheduleSideThreadBridge,
} from "./ScheduleSideConversationPanel"
import {
  EMPLOYEE_MGMT_MARKER,
  EMPLOYEE_MGMT_CARD_APP_IDS,
  matchesEmployeeMgmtIntent,
} from "./employeeMgmtIntent"
import { EmployeeManagementPanel } from "./EmployeeManagementPanel"
import type { TeacherInviteRecordModel } from "./EducationTeacherManagementPanel"
import {
  ScheduleCalendarSettingsPrefsSync,
  SubscribedColleagueBridgeSync,
  UserCalendarTypesBridgeSync,
  VvChatFullInsetPortalHost,
  VvChatInsetDialogPortalHost,
} from "./calendarDockVvBridgeSync"
import { createCalendarDockVvActionHandler } from "./calendarDockVvHandleVvAction"

import aiModelIcon from 'figma:asset/f165fadc65db69eb9ce3d5feeb2f6b4dc2638bd6.png';
import educationIcon from 'figma:asset/8449365f45bb140bf269f6769f74387249864ed8.png';
import calendarIcon from 'figma:asset/e653b0a7cada3ea08e52cb29bc4bd546be59d3d5.png';
import meetingIcon from 'figma:asset/88d3d6e7f0cac8b8bba0a46f8757585fe7cdaf9a.png';
import todoIcon from 'figma:asset/3598e566543c9c6ef7ab3cb268538a29b6bdb58d.png';
import diskIcon from 'figma:asset/78530a18370215c595d4c989d64c188f7450dbda.png';
import companyIcon from 'figma:asset/bc4adf9e89b5ade28461d7ae6da09053ea8bf0e1.png';
import profileIcon from 'figma:asset/a9b0f43698a9015397dc60f26d1ea217390fec97.png';
import organizationIcon from 'figma:asset/737725172f66f16b2662ff1ddc8ab69293de567f.png';
import employeeIcon from 'figma:asset/b07b1535d0d656029e5b3942f78ecf273f5852ee.png';
import recruitmentIcon from 'figma:asset/81759343e3c0735a95d3ee5a5e7cf7a767e83846.png';
import salaryIcon from 'figma:asset/776e838a4088fe446d0c5d29220b88ab1ad922bc.png';
import inventoryIcon from 'figma:asset/1850125514f29104c8f00034a7873528b971a815.png';

import { Calculator, BookA, PenTool, Users, ArrowLeft, MoreHorizontal, Briefcase, ShoppingBag, DollarSign, GripHorizontal, ChevronDown, Boxes, Upload, BadgeDollarSign, Clock, CalendarCheck, BarChart3, UserCog, Receipt, History, PieChart, PanelLeft, Square, X, AppWindow, Maximize2, LayoutGrid } from "lucide-react"
import { motion, AnimatePresence, useDragControls } from "motion/react"
import { usePopper } from "react-popper"
import { createPortal } from "react-dom"

// 统一的应用数据源 - 移自 appData.ts
export interface AppItem {
  id: string;
  name: string;
  icon: {
    gradient?: string;
    iconType?: string;
    imageSrc?: string;
  };
  order: number;
}

interface MainAIChatWindowProps {
  conversation: Conversation
  onToggleHistory: () => void
  historyOpen?: boolean
  onHistoryOpenChange?: (open: boolean) => void
  conversations?: Conversation[]
  selectedId?: string
  onSelect?: (id: string) => void
  /** 切换会话前将上一会话消息写回父级（dock 会话持久化） */
  onPersistConversationMessages?: (conversationId: string, messages: Message[]) => void
  /** 底部应用条点击：打开历史并绑定 dock 会话（个人应用为 dock:app:*，组织应用为 dock:组织:应用） */
  onDockAppActivate?: (
    appId: string,
    appName: string,
    orgId: string,
    hasJoinedOrganizations: boolean
  ) => void
  /** 教育 / 医院门户根入口：写入会话列表但不切换当前选中会话、不进入单应用快捷条 */
  onRegisterPortalRootSession?: (
    appId: string,
    appName: string,
    orgId: string,
    hasJoinedOrganizations: boolean
  ) => void
  /** 主会话意图识别后，跳转到应用会话并带入用户原话；可选先同步当前会话消息到父级（原子更新） */
  onIntentDockHandoff?: (
    appId: string,
    appName: string,
    orgId: string,
    hasJoinedOrganizations: boolean,
    carryOverText: string,
    syncFrom?: { conversationId: string; messages: Message[] },
    /** 场景二：应用会话内首条用户消息为原指令，首条助手为演示业务回复 */
    schoolPlainHandoff?: { plainInstruction: string; assistantReply: string }
  ) => void
  /** 应用 dock → 另一应用 dock（如课程管理 → 教学管理），handoff 文案带「从某应用转入」 */
  onCrossDockHandoff?: (
    targetAppId: string,
    targetAppName: string,
    orgId: string,
    hasJoinedOrganizations: boolean,
    carryOverText: string,
    fromAppName: string,
    syncFrom?: { conversationId: string; messages: Message[] },
    extras?: { targetBootstrapMessages?: Message[]; mainThreadMirrorExtras?: Message[] }
  ) => void
  /** 当前组织变化时通知父级，用于重置快捷条与 dock 会话选中态 */
  onCurrentOrgChange?: (orgId: string, context: { hasJoinedOrganizations: boolean }) => void
  /** 非 null 时底部条展示该应用的快捷指令 */
  shortcutBarAppId?: string | null
  onDockBarBack?: () => void
  /** 顶栏「新消息」回到主对话并收起快捷条 */
  onNewMainChat?: () => void
  /** 主 VVAI 顶栏「历史消息」列表数据 */
  mainChatHistory?: MainChatHistoryEntry[]
  /** 选中历史条目后恢复该轮对话到主会话 */
  onSelectMainChatHistoryEntry?: (entryId: string) => void
  /** 侧栏 VVAI 历史列表当前高亮条目（与主会话消息快照一致时由父级同步） */
  activeMainChatHistoryEntryId?: string | null
  /** 主 VVAI 顶栏「新建对话」：归档当前并清空 */
  onMainChatNewThread?: () => void
  /** 当前为 `?standalone=1` 打开的独立浏览器窗口时置 true：不渲染《主导航栏》、默认进 CUI；顶栏「新建」走 onMainChatNewThread */
  isMainCuiStandaloneWindow?: boolean
  /** 主窗口顶栏「新建对话」：打开与《主CUI交互》同框架的独立窗口（独立 state） */
  onOpenStandaloneMainCui?: () => void
  /** 父级替换主会话消息时递增，驱动子组件同步 messages */
  mainChatSessionRevision?: number
  /** 用户曾进入底部应用对话后，会话列表与主内容区分栏常驻 */
  sessionListPinned?: boolean
  /** 《主AI入口》进入《主CUI交互》时恢复分栏会话列表 */
  onEnterMainCuiSessionLayout?: () => void
  /** 分栏时左侧会话列表宽度（px），须由父级持有以免切换会话重挂载丢失 */
  sessionSidebarWidth?: number
  onSessionSidebarWidthChange?: (width: number) => void
  /** 主 AI 单会话 id（列表中仅展示这一条主对话 + 各应用 Agent） */
  cuiMainChatId?: string
  /** Home 场景入口：no-org / edu-one / scenario-two-multi / cui-card-rules；场景五为三组织数据 */
  scenario?: string
  /** 场景二：主 VVAI 与各 dock 应用会话镜像（不切换当前选中会话） */
  onMirrorDockConversation?: (args: {
    dockAppId: string
    orgId: string
    hasJoinedOrganizations: boolean
    pairs?: { userText: string; assistantText: string }[]
    mirrorExtraMessages?: Message[]
    /** 将对应 dock 会话中末条以此前缀开头的助手消息替换为全文（主会话卡片 onPatch 与考勤镜像对齐） */
    patchLastAssistantContentPrefix?: string
    patchLastAssistantContent?: string
    /** 按 id 合并 dock 镜像消息（与 `toDockMirrorPeerMessageId(主消息id)` 对位） */
    patchMessages?: { id: string; merge: Partial<Message> }[]
  }) => void
  /** dock 会话内「非业务自然语言」：用户句 + 通用回复同步追加到主 VVAI 会话 */
  onAppendMainVvaiNonBusinessMirror?: (args: {
    userText: string
    assistantText: string
    sourceAppName: string
  }) => void
}

const PERSONAL_INFO_MARKER = "<<<RENDER_PERSONAL_INFO>>>"
const CREATE_EMAIL_MARKER = "<<<RENDER_CREATE_EMAIL_FORM>>>"
const CONTINUE_EMAIL_MARKER = "<<<RENDER_CONTINUE_EMAIL_FORM>>>"
const ORG_SWITCHER_MARKER = "<<<RENDER_ORG_SWITCHER>>>"
const CREATE_ORG_FORM_MARKER = "<<<RENDER_CREATE_ORG_FORM>>>"
const CREATE_ORG_SUCCESS_MARKER = "<<<RENDER_CREATE_ORG_SUCCESS>>>"
/** 创建教育组织成功后，选择家庭教育空间 / 机构教育空间（全场景） */
const EDU_SPACE_TYPE_SELECT_MARKER = "<<<RENDER_EDU_SPACE_TYPE_SELECT>>>"
/** 场景零 / 教育组织创建后：家庭教育空间 — 身份选择 */
const EDU_SPACE_FAMILY_ROLE_MARKER = "<<<RENDER_EDU_SPACE_FAMILY_ROLE>>>"
const EDU_SPACE_FAMILY_FORM_MARKER = "<<<RENDER_EDU_SPACE_FAMILY_FORM>>>"
const EDU_SPACE_INST_FORM_MARKER = "<<<RENDER_EDU_SPACE_INST_FORM>>>"
/** 未加入任何组织时不可创建机构教育空间 */
const EDU_SPACE_INST_BLOCKED_MARKER = "<<<RENDER_EDU_SPACE_INST_BLOCKED>>>"
const EDU_SPACE_CREATED_MARKER = "<<<RENDER_EDU_SPACE_CREATED>>>"

function latestEduCreateOrgSuccessOrgName(
  messagesList: ReadonlyArray<{ content: string }>,
): string | null {
  for (let i = messagesList.length - 1; i >= 0; i--) {
    const c = messagesList[i]?.content
    if (!c.startsWith(`${CREATE_ORG_SUCCESS_MARKER}:`)) continue
    try {
      const data = JSON.parse(c.replace(`${CREATE_ORG_SUCCESS_MARKER}:`, "")) as {
        orgName?: string
        industry?: string
        isEducationIndustry?: boolean
      }
      const isEdu = data.isEducationIndustry === true || data.industry === "教育行业"
      if (!isEdu) continue
      return data.orgName?.trim() ? data.orgName : null
    } catch {
      continue
    }
  }
  return null
}

/** 主对话或教育门户内走完整「创建教育空间」表单向导（与创建教育组织成功后的体验一致） */
function shouldOfferFullEducationSpaceCreateFlow(
  scenario: string | undefined,
  hasJoinedOrganizations: boolean,
  educationTranscript: ReadonlyArray<{ content: string }>,
  mainTranscript: ReadonlyArray<{ content: string }>
): boolean {
  if (isHomeScenarioZeroNoOrg(scenario, hasJoinedOrganizations)) return true
  if (latestEduCreateOrgSuccessOrgName(educationTranscript) != null) return true
  if (latestEduCreateOrgSuccessOrgName(mainTranscript) != null) return true
  return false
}

const JOIN_ORG_FORM_MARKER = "<<<RENDER_JOIN_ORG_FORM>>>"
const JOIN_ORG_CONFIRM_MARKER = "<<<RENDER_JOIN_ORG_CONFIRM>>>"
const INTENT_HANDOFF_MARKER = "<<<INTENT_HANDOFF_CARD>>>"
/** 场景二：主 VVAI 追问后的「前往应用继续」引导卡片 */
const SCHOOL_SCENE_APP_GUIDANCE_MARKER = "<<<SCHOOL_SCENE_APP_GUIDANCE>>>"
const DOCK_CROSS_HANDOFF_MARKER = "<<<DOCK_CROSS_HANDOFF_CARD>>>"
const TEACHING_STUDENT_GRADE_MARKER = "<<<TEACHING_STUDENT_GRADE_CARD>>>"
/** 场景二：与 yzhao-workspace 任务欢迎「打开任务列表」一致的《任务管理》表卡 */
const TASK_TABLE_MARKER = "<<<RENDER_TASK_TABLE>>>"

// Command keywords
const PERSONAL_INFO_COMMANDS = [
  "管理个人信息",
  "manage personal information",
  "个人信息",
  "personal info",
  "个人信息管理"
]

const CREATE_EMAIL_COMMANDS = [
  "创建业务邮箱",
  "create business email",
  "业务邮箱",
  "business email",
  "创建邮件",
  "创建一封邮件",
  "帮我创建一封新邮件",
]

const CREATE_ORG_COMMANDS = [
  "创建组织",
  "创建企业",
  "create organization",
  "创建企业/组织"
]

const JOIN_ORG_COMMANDS = [
  "加入组织",
  "加入企业",
  "join organization",
  "加入企业/组织"
]

const SWITCH_ORG_COMMANDS = [
  "切换组织",
  "切换企业",
  "switch organization",
  "组织切换"
]

import orgIcon from 'figma:asset/58a97c06b4ae6edfc613d20add2fb4ead0363c64.png';
import {
  hideMainCuiNavHistoryIcon,
  isCuiCardRulesScenario,
  isHomeScenarioZeroNoOrg,
  isMainEntryScenario,
  isNoOrgHomeScenarioRoute,
  isScenarioFiveLike,
  isScenarioFourOrMainEntry,
  isScenarioTwoFamily,
  isScenarioTwoMultiOrgs,
  isSingleOrgEduAttendanceScenarioFlow,
  SCENARIO_CUI_CARD_RULES,
  SCENARIO_TWO_MULTI_ORGS,
} from "./homeScenarioLayout"
import { ScenarioTwoAttendanceOverviewCard } from "./ScenarioTwoAttendanceOverviewCard"
import { ScenarioTwoAttendanceSupplementCard } from "./ScenarioTwoAttendanceSupplementCard"
import { ScenarioTwoScheduleBuilderCard } from "./ScenarioTwoScheduleBuilderCard"
import { ScenarioTaskManagementTableCard } from "./ScenarioTaskManagementTableCard"
import { getTaskDetailOrFallback } from "./scenarioDemoTaskAppData"
import {
  defaultScenarioTwoAttendanceOverviewPayload,
  parseScenarioTwoAttendanceOverviewPayload,
  SCENARIO_TWO_ATTENDANCE_OVERVIEW_MARKER,
} from "./scenarioTwoAttendanceOverview"
import { matchesScenarioTwoViewAttendanceIntent } from "./scenarioTwoAttendanceIntent"
import { getScenarioTwoMultiAttendanceStripChipTexts } from "./scenarioTwoMultiAttendanceCardStrip"
import {
  defaultScenarioTwoAttendanceSupplementPayload,
  parseScenarioTwoAttendanceSupplementPayload,
  SCENARIO_TWO_ATTENDANCE_SUPPLEMENT_MARKER,
} from "./scenarioTwoAttendanceSupplementRequest"
import {
  defaultScenarioTwoScheduleBuilderPayload,
  parseScenarioTwoScheduleBuilderPayload,
  SCENARIO_TWO_SCHEDULE_BUILDER_MARKER,
} from "./scenarioTwoScheduleBuilder"
import { buildScenarioTwoMainThreadDockBundle } from "./scenarioTwoMainThreadDock"
import { toDockMirrorPeerMessageId } from "./dockMirrorPeerIds"
import {
  CUI_RULES_INTERACTION_MARKER,
  buildMeetingPayloadWithUi,
  demoFollowUpPrompts,
  matchCuiCardRulesDemo,
  parseCuiRulesPayload,
  patchCuiRulesMessage,
  serializeCuiRulesPayload,
} from "./cuiCardRulesDemo"
import {
  createHandoffCardMessage,
  createMeetingCardMessage,
  CuiRulesHandoffCardBody,
  CuiRulesInlinePlanBody,
  CuiRulesModalsHost,
  CuiRulesPlanCardBody,
  CuiRulesSecondaryPanel,
} from "./CuiRulesInteractionDemo"
import {
  CONTENT_SCOPE_ALL_ORGANIZATIONS_ID,
  defaultDockIdsForContext,
  defaultDockIdsUnionAcrossOrgs,
  DOCK_IDS_NO_ORG,
  findPortalAppById,
  getDockAppMeta,
  HOSPITAL_PORTAL_APPS,
  isPersonalScopeDockAppId,
  isPortalRootDockAppId,
  PERSONAL_EDU_SPACE_ACTIONS,
  PERSONAL_EDU_SPACE_APP_ID,
  PORTAL_ROOT_APP_IDS,
  prioritizePortalDockHead,
  resolveEducationPortalApps,
  stableDockConversationId,
  type PortalApp,
} from "./organizationDockConfig"
import { SCENARIO_FOUR_EDU_MULTI_HOME_ORGANIZATIONS } from "./scenarioFourEduMultiHomeOrgs"

// 可用模型列表
const AVAILABLE_MODELS = [
  {
    id: 'gpt-4',
    name: 'ChatGPT',
    description: '最强大的通用AI模型'
  },
  {
    id: 'gpt-3.5',
    name: 'GPT-3.5',
    description: '快速响应的轻量级模型'
  },
  {
    id: 'claude-3',
    name: 'Claude 3',
    description: 'Anthropic的先进AI助���'
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    description: 'Google的多模态AI模型'
  }
]

const NO_ORG_ID = "no-org" as const

function portalRootActiveAppFromConversation(c: Conversation): string | null {
  const d = c.dockAppId
  return d && isPortalRootDockAppId(d) ? d : null
}

/** 进入教育 / 医院门户时解析顶栏「会话主体」：主 VVAI 保留信息筛选态；「全部组织」则落到对应类型的首个主体 */
function resolvePortalEntryOrganizationId(
  portalKind: "education" | "hospital",
  ctx: {
    isNavContentScopeMode: boolean
    dialogueContentOrgScope: string
    currentOrg: string
    organizations: Organization[]
  }
): string {
  const { isNavContentScopeMode, dialogueContentOrgScope, currentOrg, organizations } = ctx
  if (organizations.length === 0) return NO_ORG_ID

  if (isNavContentScopeMode) {
    if (dialogueContentOrgScope === CONTENT_SCOPE_ALL_ORGANIZATIONS_ID) {
      if (portalKind === "hospital") {
        return organizations.find((o) => o.kind === "hospital")?.id ?? organizations[0]!.id
      }
      return (
        organizations.find((o) => o.kind === "school" || o.kind === "education")?.id ??
        organizations[0]!.id
      )
    }
    if (organizations.some((o) => o.id === dialogueContentOrgScope)) {
      return dialogueContentOrgScope
    }
  } else if (organizations.some((o) => o.id === currentOrg)) {
    return currentOrg
  }
  return organizations[0]!.id
}

/** 主入口（无 scenario）：非教育、非医疗的通用测试组织（多主体切换演示） */
const DEFAULT_ORGANIZATIONS: Organization[] = [
  {
    id: "default-test-org",
    name: "默认测试组织",
    icon: orgIcon,
    memberCount: 128,
    description: "通用组织演示主体",
    kind: "general",
  },
  {
    id: "default-test-org-two",
    name: "测试组织二",
    icon: orgIcon,
    memberCount: 56,
    description: "第二个通用演示主体，与默认测试组织并列",
    kind: "general",
  },
]

/** 场景五：学校 + 教育机构 + 医院（底部条为并集时：医院 → 教育 → 通用应用） */
const SCENARIO_FIVE_MULTI_ORGS: Organization[] = [
  ...SCENARIO_FOUR_EDU_MULTI_HOME_ORGANIZATIONS,
  {
    id: "hospital-demo",
    name: "示范医院",
    icon: orgIcon,
    memberCount: 320,
    description: "医院组织",
    kind: "hospital",
  },
]

/** 场景二与「CUI卡片交互场景及规则」入口共用同一套单教育机构 mock */
const EDU_ONE_SCENARIO_ORGS: Organization[] = [
  {
    id: "edu-demo",
    name: "示范教育机构",
    icon: orgIcon,
    memberCount: 120,
    description: "演示用教育机构主体",
    kind: "education",
  },
]

/** Home 场景按钮对应的初始组织列表 */
const SCENARIO_ORGANIZATIONS: Record<string, Organization[]> = {
  "edu-one": EDU_ONE_SCENARIO_ORGS,
  [SCENARIO_TWO_MULTI_ORGS]: [...SCENARIO_FOUR_EDU_MULTI_HOME_ORGANIZATIONS],
  [SCENARIO_CUI_CARD_RULES]: [...EDU_ONE_SCENARIO_ORGS],
  "scenario-five": SCENARIO_FIVE_MULTI_ORGS,
}

/**
 * 邀请码 Demo 对应的完整组织（与 `JoinOrgFormCard` 测试码一致）。
 * 未加入组织时 `organizations` 初始为空，不能仅从当前列表 `find`，否则「验证并加入」后不会出现确认卡、也无法写入列表。
 */
const JOIN_INVITE_CODE_ORGANIZATIONS: Record<string, Organization> = {
  xiaoce: {
    id: "xiaoce",
    name: "小测教育机构",
    icon: orgIcon,
    memberCount: 120,
    description: "演示用教育机构（邀请码加入）",
    kind: "education",
  },
  default: {
    id: "default",
    name: "默认组织",
    icon: orgIcon,
    memberCount: 128,
    description: "演示用通用组织（邀请码加入）",
    kind: "general",
  },
  test: {
    id: "test",
    name: "测试机构",
    icon: orgIcon,
    memberCount: 56,
    description: "演示用测试机构（邀请码加入）",
    kind: "education",
  },
}

/** 底部应用条顺序持久化（按组织上下文签名隔离） */
const DOCK_STORAGE_PREFIX = "main-ai-dock-order::v4::"
/** 用户从条中移除的应用 id（与签名隔离；与顺序持久化配合，避免 hydrate 时把已移除项补回） */
const DOCK_HIDDEN_PREFIX = "main-ai-dock-hidden::v1::"

/** Mock：角色权限 + 使用频率（接入真实权限/埋点后替换） */
const MOCK_DOCK_USER = {
  roleId: "teacher",
  deniedAppIds: [] as string[],
  usageWeight: {
    hospital: 40,
    education: 38,
    personal_edu_space: 36,
    todo: 22,
    calendar: 20,
    meeting: 18,
    mail: 17,
    disk: 16,
    document: 15,
    attendance: 14,
    course: 13,
    teaching: 13,
    recruitment: 11,
    customer: 10,
    workflow: 10,
    project: 9,
    finance: 9,
    employee: 8,
    performance: 8,
    supplies: 7,
    policy: 7,
    meeting_room: 7,
    onboarding: 6,
    contract: 6,
    objectives: 6,
    work_task: 6,
    feedback: 6,
    permission: 5,
    regularization: 5,
    transfer: 5,
    offboarding: 5,
    profile: 12,
    company: 11,
    organization: 11,
    goods: 11,
    members: 10,
    logistics: 9,
    assets: 5,
    salary: 5,
    surgery: 4,
    pharma_procurement: 4,
  } as Record<string, number>,
}

/** Mock：按角色默认禁用的应用 id（接入权限系统后替换） */
const ROLE_DENIED_APPS: Record<string, string[]> = {
  teacher: [],
  admin: [],
  guest: ["finance", "salary", "recruitment"],
}

function createDockAppItem(id: string, order: number, scenario?: string | null): AppItem {
  const m = getDockAppMeta(id, scenario)
  return {
    id,
    name: m.name,
    icon: { imageSrc: m.imageSrc, iconType: id },
    order,
  }
}

function isDockConversationId(id: string): boolean {
  return id.startsWith("dock:") || id.startsWith("dock-app-")
}

function attachDockCuiFollowUps(
  m: Message,
  _replyHint: string,
  conversation: Conversation,
  _dockIntent?: { appId: string; matchedPhrase: string }
): Message {
  const isDock = isDockConversationId(conversation.id) || conversation.dockAppId != null
  /** 应用会话内不展示推荐追问条（仅主 VVAI 等非 dock 会话保留） */
  if (!isDock) return m
  return m
}

const EMPLOYEE_ORG_SWITCH_SEND_PREFIX = "__CUI_EMPLOYEE_ORG_SWITCH__:"

function parseEmployeeOrgSwitchSendText(text: string): string | null {
  const t = text.trim()
  if (!t.startsWith(EMPLOYEE_ORG_SWITCH_SEND_PREFIX)) return null
  const id = t.slice(EMPLOYEE_ORG_SWITCH_SEND_PREFIX.length).trim()
  return id || null
}

function employeeMgmtOrgSwitchFollowUpFields(
  organizations: Organization[],
  currentOrgId: string
): Pick<Message, "cuiFollowUpPrompts" | "cuiFollowUpSendTexts"> | undefined {
  const others = organizations.filter((o) => o.id !== currentOrgId)
  if (!others.length) return undefined
  return {
    cuiFollowUpPrompts: others.map((o) => `切换到${o.name}`),
    cuiFollowUpSendTexts: others.map((o) => `${EMPLOYEE_ORG_SWITCH_SEND_PREFIX}${o.id}`),
  }
}

/** 侧栏《组织状态》：应用会话所属组织 id（`dock:app:*` 无组织段，返回 null） */
function conversationDockOrgIdForSessionInteraction(c: Conversation): string | null {
  if (c.dockOrgId != null && c.dockOrgId !== "") return c.dockOrgId
  const m = c.id.match(/^dock:([^:]+):(.+)$/)
  if (!m || m[1] === "app") return null
  return m[1]
}

/**
 * `MainCuiCardOrgAttributionBanner`：当前 transcript 对应的「对话组织」主体 id（动态随会话 / 顶栏筛选变化）。
 * - 组织型 dock（`dock:{orgId}:{appId}` 或 `dockOrgId`）→ 该会话绑定的行政主体；
 * - 主 VVAI 或个人应用 dock 且为顶栏「信息筛选」态 → `dialogueContentOrgScope`；
 * - 否则 → `currentOrg`。
 * 单条消息上显式的 `cardAttributionOrgId` 仍优先（镜像、切换主体后的新卡等）。
 */
function conversationHostOrganizationIdForAttribution(
  c: Conversation,
  args: {
    cuiMainChatId: string
    isNavContentScopeMode: boolean
    dialogueContentOrgScope: string
    currentOrg: string
    organizations: Organization[]
  }
): string {
  const { cuiMainChatId, isNavContentScopeMode, dialogueContentOrgScope, currentOrg, organizations } = args
  const dockOid = conversationDockOrgIdForSessionInteraction(c)
  if (dockOid != null && dockOid !== "") {
    return dockOid
  }
  const appId = getConversationDockAppId(c)
  const isMainChat = c.id === cuiMainChatId
  const isPersonalDock = appId != null && isPersonalScopeDockAppId(appId)
  if ((isMainChat || isPersonalDock) && isNavContentScopeMode) {
    if (
      dialogueContentOrgScope !== CONTENT_SCOPE_ALL_ORGANIZATIONS_ID &&
      organizations.some((o) => o.id === dialogueContentOrgScope)
    ) {
      return dialogueContentOrgScope
    }
  }
  return organizations.some((o) => o.id === currentOrg) ? currentOrg : organizations[0]?.id ?? currentOrg
}

function lastActivityMs(c: Conversation): number {
  const list = coerceMessagesList(c.messages)
  let max = 0
  for (const m of list) {
    const t = typeof m.createdAt === "number" ? m.createdAt : 0
    if (t > max) max = t
  }
  return max
}

/** IM 式会话列表：按用户维度展示（不随当前组织切换隐藏条目）；主会话固定首位；dock 按最后活动时间倒序 */
function buildImStyleSessionList(conversations: Conversation[], mainChatId: string): Conversation[] {
  const filtered = conversations.filter((c) => {
    if (c.id.startsWith("dock-app-")) return false
    if (c.id === mainChatId) return true
    if (isDockConversationId(c.id) || c.dockAppId != null) return true
    return false
  })
  const main = filtered.find((c) => c.id === mainChatId)
  const rest = filtered
    .filter((c) => c.id !== mainChatId)
    .sort((a, b) => lastActivityMs(b) - lastActivityMs(a))
  return main ? [main, ...rest] : rest
}

/** 多组织并集底部条：按场景隔离 localStorage 签名 */
function computeUnionDockSignature(scenarioKey: string, organizations: Organization[]): string {
  if (organizations.length === 0) return `${scenarioKey}::no-org`
  const orgKey = [...organizations]
    .map((o) => `${o.id}:${o.kind ?? "general"}`)
    .sort()
    .join("|")
  return `${scenarioKey}::union::${orgKey}`
}

function computeDockSignature(
  organizations: Organization[],
  currentOrgId: string,
  scenario?: string | null
): string {
  if (organizations.length === 0) {
    return scenario === "no-org" ? "no-org::scenario-one" : "no-org"
  }
  const org = organizations.find((o) => o.id === currentOrgId)
  const kind = org?.kind ?? "general"
  const orgKey = [...organizations]
    .map((o) => `${o.id}:${o.kind ?? "general"}`)
    .sort()
    .join("|")
  return `${kind}:${currentOrgId}:${orgKey}`
}

function sortDockIdsByUsage(ids: string[], w: Record<string, number>): string[] {
  const base = [...ids]
  return base.sort((a, b) => {
    const d = (w[b] ?? 0) - (w[a] ?? 0)
    if (d !== 0) return d
    return ids.indexOf(a) - ids.indexOf(b)
  })
}

function loadPersistedDockOrder(signature: string): string[] | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(`${DOCK_STORAGE_PREFIX}${signature}`)
    if (!raw) return null
    const parsed = JSON.parse(raw) as string[]
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

function persistDockOrder(signature: string, orderedIds: string[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(`${DOCK_STORAGE_PREFIX}${signature}`, JSON.stringify(orderedIds))
  } catch (e) {
    console.error("persistDockOrder failed", e)
  }
}

function loadPersistedDockHidden(signature: string): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(`${DOCK_HIDDEN_PREFIX}${signature}`)
    if (!raw) return []
    const parsed = JSON.parse(raw) as string[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function persistDockHidden(signature: string, hiddenIds: string[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(`${DOCK_HIDDEN_PREFIX}${signature}`, JSON.stringify(hiddenIds))
  } catch (e) {
    console.error("persistDockHidden failed", e)
  }
}

function resolveFloatingAppLabel(appId: string, scenario?: string | null): { id: string; name: string } {
  const portal = findPortalAppById(appId)
  if (portal) return { id: portal.id, name: portal.name }
  return { id: appId, name: getDockAppMeta(appId, scenario).name }
}

function SecondaryAppButton({ app, onMenuClick }: { app: PortalApp; onMenuClick: (menu: string, appName: string) => void }) {
  const [referenceElement, setReferenceElement] = React.useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = React.useState<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const timeoutRef = React.useRef<any>(null);

  const { styles, attributes, update } = usePopper(referenceElement, popperElement, {
    placement: 'top-start',
    strategy: 'fixed',
    modifiers: [
      { name: 'offset', options: { offset: [0, 10] } },
      { name: 'preventOverflow', options: { padding: 8 } },
      { name: 'flip', options: { fallbackPlacements: ['top-start', 'top-end', 'bottom'] } }
    ],
  });

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsHovered(true);
    // Force popper to update position when it opens
    if (update) update();
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 150);
  };

  // Re-calculate position when hovered state changes, keeping it synced during parent animations
  React.useEffect(() => {
    let rafId: number;
    let startTime: number;

    const animateUpdate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      if (update) update();
      
      // Keep updating for 400ms to catch any layout animations (like slide-ins)
      if (timestamp - startTime < 400) {
        rafId = requestAnimationFrame(animateUpdate);
      }
    };

    if (isHovered) {
      rafId = requestAnimationFrame(animateUpdate);
    }

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isHovered, update]);

  return (
    <div className="relative inline-flex" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button
        ref={setReferenceElement}
        className={cn(
          "bg-bg flex gap-[var(--space-100)] h-[var(--space-800)] items-center px-[var(--space-300)] py-[var(--space-150)] rounded-full shrink-0 transition-all duration-300 ease-out border border-border group/btn",
          isHovered ? "bg-[var(--black-alpha-11)]" : "hover:bg-[var(--black-alpha-11)]"
        )}
      >
        <p className="text-[length:var(--font-size-xs)] leading-none text-[var(--color-text)] whitespace-nowrap font-[var(--font-weight-medium)]">
          {app.name}
        </p>
        <ChevronDown 
          className={cn(
            "size-[12px] text-text-tertiary transition-transform duration-300 ease-in-out",
            isHovered && "rotate-180"
          )} 
        />
      </button>

      {typeof document !== 'undefined' && createPortal(
        <div 
          ref={setPopperElement} 
          style={{ ...styles.popper, zIndex: 9999, pointerEvents: isHovered ? 'auto' : 'none' }} 
          {...attributes.popper}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                style={{ transformOrigin: "bottom left" }}
                className="bg-bg border border-border shadow-[0px_8px_32px_0px_rgba(22,24,30,0.1)] rounded-[8px] p-[6px] min-w-[140px] flex flex-col overflow-hidden"
              >
                {app.menu.map((m: any) => {
                  const name = typeof m === 'string' ? m : m.name;

                  return (
                    <button
                      key={name}
                      onClick={() => {
                        setIsHovered(false);
                        onMenuClick(name, app.name);
                      }}
                      className="group w-full px-[10px] py-[8px] text-left transition-colors hover:bg-[var(--black-alpha-11)] rounded-[6px] flex items-center"
                    >
                      <span className="font-['PingFang_SC:Regular',sans-serif] leading-[20px] overflow-hidden text-text text-[14px] text-ellipsis whitespace-nowrap group-hover:text-primary transition-colors">
                        {name}
                      </span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </div>
  );
}

function parseTime(timeStr: string): Date | null {
  const today = new Date();
  const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (timeMatch) {
    let [_, h, m, amp] = timeMatch;
    let hours = parseInt(h);
    let minutes = parseInt(m);
    
    if (amp) {
      amp = amp.toUpperCase();
      if (amp === 'PM' && hours < 12) hours += 12;
      if (amp === 'AM' && hours === 12) hours = 0;
    }
    
    const date = new Date(today);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }
  return null;
}

function shouldShowTimestamp(current: Message, previous: Message | null): boolean {
  if (!previous) return true;
  
  const curDate = parseTime(current.timestamp);
  const prevDate = parseTime(previous.timestamp);
  
  if (!curDate || !prevDate) {
    return current.timestamp !== previous.timestamp;
  }
  
  const diffInMs = Math.abs(curDate.getTime() - prevDate.getTime());
  const diffInMins = diffInMs / (1000 * 60);
  
  return diffInMins > 20;
}

function FloatingAppWindow({
  appId,
  title,
  onClose,
  children,
  defaultPos
}: {
  appId: string;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  defaultPos?: { x: number, y: number };
}) {
  const controls = useDragControls()
  return (
    <motion.div
      drag
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.9, x: defaultPos?.x || 100, y: defaultPos?.y || 100 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed z-50 w-[min(90vw,1200px)] h-[min(85vh,800px)] bg-cui-bg rounded-[var(--radius-xl)] shadow-md border border-border flex flex-col overflow-hidden pointer-events-auto"
    >
      <div 
        onPointerDown={(e) => controls.start(e)}
        className="flex items-center justify-between px-[var(--space-300)] py-[var(--space-200)] border-b border-border bg-bg-secondary cursor-grab active:cursor-grabbing shrink-0"
      >
        <div className="flex items-center gap-[var(--space-200)] flex-1 min-w-0">
          <span className="text-[length:var(--font-size-md)] font-[var(--font-weight-medium)] text-text truncate">{title}</span>
        </div>
        <div className="flex items-center gap-[var(--space-100)] shrink-0">
          <button
            onClick={onClose}
            className="w-[var(--space-600)] h-[var(--space-600)] flex items-center justify-center text-text-secondary hover:bg-[var(--black-alpha-11)] rounded-[var(--radius-md)] transition-colors border-none bg-transparent cursor-pointer"
            title="关闭独立窗口"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-0 bg-cui-bg relative flex flex-col">
        {children}
      </div>
    </motion.div>
  );
}

export function MainAIChatWindow({ 
  conversation, 
  onToggleHistory, 
  historyOpen = false,
  onHistoryOpenChange,
  conversations = [],
  selectedId = "",
  onSelect,
  onPersistConversationMessages,
  onDockAppActivate,
  onRegisterPortalRootSession,
  onIntentDockHandoff,
  onCrossDockHandoff,
  onCurrentOrgChange,
  shortcutBarAppId = null,
  onDockBarBack,
  onNewMainChat,
  mainChatHistory = [],
  onSelectMainChatHistoryEntry,
  activeMainChatHistoryEntryId = null,
  onMainChatNewThread,
  isMainCuiStandaloneWindow = false,
  onOpenStandaloneMainCui,
  mainChatSessionRevision = 0,
  sessionListPinned = false,
  onEnterMainCuiSessionLayout,
  sessionSidebarWidth: sessionSidebarWidthProp = 280,
  onSessionSidebarWidthChange,
  cuiMainChatId = "c1",
  scenario,
  onMirrorDockConversation,
  onAppendMainVvaiNonBusinessMirror,
}: MainAIChatWindowProps) {
  const [messages, setMessages] = React.useState<Message[]>(() => coerceMessagesList(conversation.messages))
  const [cuiRulesModal, setCuiRulesModal] = React.useState<"calendar" | "contacts" | "confirm" | null>(null)
  const [cuiRulesSidebarMessageId, setCuiRulesSidebarMessageId] = React.useState<string | null>(null)
  const [inputValue, setInputValue] = React.useState("")
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const chatScrollContainerRef = React.useRef<HTMLDivElement>(null)
  /** 「按日期查看」：先切会话再在消息列表中定位锚点 */
  const pendingDayJumpRef = React.useRef<{ conversationId: string; messageId: string } | null>(null)
  const [dayJumpNonce, setDayJumpNonce] = React.useState(0)
  /** 场景二「打开任务列表」表内已点开详情的行 id（名称列浅色「已查看」） */
  const [demoTaskTableViewedIds, setDemoTaskTableViewedIds] = React.useState<ReadonlySet<string>>(
    () => new Set()
  )
  const lastChatScrollTopRef = React.useRef(0)
  /** 仅在实际「向下滚」手势后置 true，避免进入会话时布局/程序化滚动触发收起 */
  const pinnedTaskAllowScrollCollapseRef = React.useRef(false)
  const messagesRef = React.useRef<Message[]>(messages)
  const cuiRulesSidebarSource = React.useMemo(() => {
    if (!cuiRulesSidebarMessageId) return null
    const m = coerceMessagesList(messages).find((x) => x.id === cuiRulesSidebarMessageId)
    const p = m ? parseCuiRulesPayload(m.content) : null
    if (!p || p.variant !== "plan") return null
    return {
      messageId: cuiRulesSidebarMessageId,
      label: p.title,
      participants: Array.isArray(p.participants) ? [...p.participants] : [],
      note: p.participantsNote ?? "",
    }
  }, [cuiRulesSidebarMessageId, messages])
  const prevConversationIdRef = React.useRef<string | null>(null)
  const lastMainChatSessionRevisionRef = React.useRef(mainChatSessionRevision)
  const conversationMessagesRef = React.useRef<Message[]>(coerceMessagesList(conversation.messages))
  /** 仅当父级 `conversation.messages` 引用变化（或切会话 / 新主会话 revision）时整表同步；避免「创建组织」后仅 `currentOrg`/`hasJoinedOrganizations` 变化时用旧父级列表覆盖刚写入的成功卡 */
  const lastSyncedParentConversationMessagesRef = React.useRef(conversation.messages)
  const onIntentDockHandoffRef = React.useRef(onIntentDockHandoff)
  onIntentDockHandoffRef.current = onIntentDockHandoff
  const onMirrorDockConversationRef = React.useRef(onMirrorDockConversation)
  onMirrorDockConversationRef.current = onMirrorDockConversation
  const onAppendMainVvaiNonBusinessMirrorRef = React.useRef(onAppendMainVvaiNonBusinessMirror)
  onAppendMainVvaiNonBusinessMirrorRef.current = onAppendMainVvaiNonBusinessMirror
  const handleSendMessageRef = React.useRef<(messageOverride?: string) => void>(() => {})
  const employeeOrgSwitchHandlerRef = React.useRef<(orgId: string) => void>(() => {})
  const onCrossDockHandoffRef = React.useRef(onCrossDockHandoff)
  onCrossDockHandoffRef.current = onCrossDockHandoff
  messagesRef.current = coerceMessagesList(messages)
  conversationMessagesRef.current = coerceMessagesList(messages)

  // Apps state
  const [apps, setApps] = React.useState<AppItem[]>([]);
  /** 当前上下文下可出现在条中的应用全集（含已从条中移除、可在「全部应用」中加回者） */
  const [dockCatalogIds, setDockCatalogIds] = React.useState<string[]>([]);
  const [isAllAppsOpen, setIsAllAppsOpen] = React.useState(false);
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const [longPressIndex, setLongPressIndex] = React.useState<number | null>(null);
  const longPressTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const dockSignatureRef = React.useRef<string>("");
  const lastDockOrderRef = React.useRef<string[]>([]);

  /** 底部「日历」dock：vv 编排演示数据（对齐《日历（样板）》） */
  const [vvScheduleItems, setVvScheduleItems] = React.useState<VvScheduleItem[]>(() => [...scheduleSeed])
  const [vvMeetingItems, setVvMeetingItems] = React.useState<VvMeetingItem[]>(() => [...meetingSeed])
  const [vvRecordItems] = React.useState(() => [...recordSeed])
  const [vvTodoItems, setVvTodoItems] = React.useState(() => [...todoSeed])
  const [vvMailItems] = React.useState(() => [...mailSeed])
  const [vvDriveItems] = React.useState(() => [...driveSeed])
  const [vvDocItems] = React.useState(() => [...docsSeed])
  const [vvFlow, setVvFlow] = React.useState<VvFlow>(null)
  /** 日历 vv `guiThen` 内 `run()` 执行中，避免 `appendToActiveConversation` 与 intent 整轮镜像重复 */
  const vvGuiThenDepthRef = React.useRef(0)

  const vvContext = React.useMemo<VvContext>(
    () => ({
      scheduleItems: vvScheduleItems,
      todoItems: vvTodoItems,
      mailItems: vvMailItems,
      meetingItems: vvMeetingItems,
      recordItems: vvRecordItems,
      driveItems: vvDriveItems,
      docItems: vvDocItems,
    }),
    [vvDocItems, vvDriveItems, vvMailItems, vvMeetingItems, vvRecordItems, vvScheduleItems, vvTodoItems]
  )

  const vvScheduleBridge = React.useMemo(
    () => ({
      getScheduleItems: () => vvScheduleItems,
      setScheduleItems: setVvScheduleItems,
      setMeetingItems: setVvMeetingItems,
    }),
    [vvScheduleItems]
  )

  const scheduleSideThreadBridgeRef = React.useRef<ScheduleSideThreadBridge | null>(null)
  const scheduleCalendarPrefsBridgeRef = React.useRef<{
    getPrefs: () => VvScheduleCalendarPrefs
    setPrefs: React.Dispatch<React.SetStateAction<VvScheduleCalendarPrefs>>
  } | null>(null)
  const calendarTypesBridgeRef = React.useRef<{
    appendCalendar: (entry: VvUserCalendarType) => void
    updateCalendar: (
      id: string,
      patch: Partial<Pick<VvUserCalendarType, "name" | "color" | "description" | "visibility">>
    ) => void
  } | null>(null)
  const subscribedColleagueBridgeRef = React.useRef<{
    add: (id: string) => void
    remove: (id: string) => void
    isSubscribed: (id: string) => boolean
  } | null>(null)

  const [scheduleSideSheet, setScheduleSideSheet] = React.useState<{
    appId: string | null
    surface: VvScheduleSideSheetSurface
    floatingHostAppId: string | null
    item: VvScheduleItem
    treatDateLabelTodayAsNotPast: boolean
    initialSidePanelMode?: "detail" | "edit" | "cancel"
  } | null>(null)

  const closeScheduleSideSheet = React.useCallback(() => {
    setScheduleSideSheet((prev) => {
      if (prev) {
        const { appId, item, surface, floatingHostAppId } = prev
        const linkPayload = {
          kind: "schedule-side-session-link" as const,
          scheduleId: item.id,
          closedAtMs: Date.now(),
          panelAppId: appId,
          panelSurface: surface,
          floatingHostAppId: floatingHostAppId ?? null,
        }
        queueMicrotask(() => {
          setMessages((msgs) => {
            const hasLinkForSchedule = msgs.some((m) => {
              const p = m.vvAssistant
              return p?.kind === "schedule-side-session-link" && p.scheduleId === item.id
            })
            if (hasLinkForSchedule) return msgs
            return [...msgs, vvAssistantMessageFromPayload(linkPayload, conversation.user.id)]
          })
        })
      }
      return null
    })
  }, [conversation.user.id])

  const openScheduleSideSheet = React.useCallback((item: VvScheduleItem, opts: VvScheduleSideSheetOpenOpts) => {
    setScheduleSideSheet({
      appId: opts.appId,
      surface: opts.surface,
      floatingHostAppId: opts.surface === "floating" ? opts.floatingHostAppId ?? opts.appId : null,
      item,
      treatDateLabelTodayAsNotPast: opts.treatDateLabelTodayAsNotPast ?? false,
      initialSidePanelMode: opts.initialSidePanelMode,
    })
  }, [])

  const scheduleSideSheetApi = React.useMemo(
    () => ({ openScheduleSideSheet, closeScheduleSideSheet }),
    [openScheduleSideSheet, closeScheduleSideSheet]
  )

  const scheduleCalendarPrefsBridge = React.useMemo(
    () => ({
      getPrefs: () => scheduleCalendarPrefsBridgeRef.current?.getPrefs() ?? defaultScheduleCalendarPrefs(),
      setPrefs: (u: React.SetStateAction<VvScheduleCalendarPrefs>) => {
        scheduleCalendarPrefsBridgeRef.current?.setPrefs(u)
      },
    }),
    []
  )

  // Education Mode State
  const [activeApp, setActiveApp] = React.useState<string | null>(() =>
    portalRootActiveAppFromConversation(conversation)
  );
  /** im=消息/IM 布局；cui=《主CUI交互》（仅《主AI入口》等进入） */
  /** 场景五首次进入定位在消息列表；场景二与《主入口》默认在消息；其余默认进《主CUI交互》。独立窗口无《主导航栏》，始终进 CUI。 */
  const [mainView, setMainView] = React.useState<"im" | "cui">(() =>
    isMainCuiStandaloneWindow
      ? "cui"
      : isScenarioFiveLike(scenario) ||
          /** 场景二（多组织）：先进「消息」；《主AI入口》再进《主CUI交互》 */
          isScenarioTwoMultiOrgs(scenario) ||
          (isSingleOrgEduAttendanceScenarioFlow(scenario) &&
            !isScenarioTwoMultiOrgs(scenario)) ||
          isCuiCardRulesScenario(scenario) ||
          isMainEntryScenario(scenario)
        ? "im"
        : "cui"
  );
  // 改为按组织 ID 存储消息：{ orgId: Message[] }
  const [orgMessages, setOrgMessages] = React.useState<Record<string, Message[]>>({});

  // Organization State
  const initialOrganizations = React.useMemo<Organization[]>(() => {
    if (scenario === "no-org") return []
    if (scenario && SCENARIO_ORGANIZATIONS[scenario]) {
      return [...SCENARIO_ORGANIZATIONS[scenario]]
    }
    return [...DEFAULT_ORGANIZATIONS]
  }, [scenario])

  const [organizations, setOrganizations] = React.useState<Organization[]>(initialOrganizations)
  /** 演示态：已创建的教育空间及当前空间（sessionStorage，供教育壳层与门户欢迎动态判断） */
  const [educationSpaces, setEducationSpaces] = React.useState<DemoEducationSpaceRecord[]>(() =>
    loadDemoEducationSpaceState(scenario).spaces
  )
  const [currentEducationSpaceId, setCurrentEducationSpaceId] = React.useState<string | null>(() =>
    loadDemoEducationSpaceState(scenario).currentSpaceId
  )
  const [currentOrg, setCurrentOrg] = React.useState<string>(organizations[0]?.id ?? NO_ORG_ID);
  const currentOrgRef = React.useRef(currentOrg)
  currentOrgRef.current = currentOrg
  /** 主 VVAI / 个人应用顶栏：仅影响对话内信息筛选，不切换会话绑定的行政主体 */
  const [dialogueContentOrgScope, setDialogueContentOrgScope] = React.useState<string>(
    organizations[0]?.id ?? NO_ORG_ID
  )

  React.useEffect(() => {
    setOrganizations(initialOrganizations)
    setCurrentOrg(initialOrganizations[0]?.id ?? NO_ORG_ID)
    setDialogueContentOrgScope(initialOrganizations[0]?.id ?? NO_ORG_ID)
  }, [initialOrganizations])

  React.useEffect(() => {
    const s = loadDemoEducationSpaceState(scenario)
    setEducationSpaces(s.spaces)
    setCurrentEducationSpaceId(s.currentSpaceId)
  }, [scenario])

  const eduPersistedOrgRestoreRef = React.useRef(false)
  React.useEffect(() => {
    if (organizations.length === 0) {
      eduPersistedOrgRestoreRef.current = false
      return
    }
    const s = loadDemoEducationSpaceState(scenario)
    if (!s.currentOrganizationId) return
    if (!organizations.some((o) => o.id === s.currentOrganizationId)) return
    if (eduPersistedOrgRestoreRef.current) return
    setCurrentOrg(s.currentOrganizationId)
    eduPersistedOrgRestoreRef.current = true
  }, [organizations, scenario])

  React.useEffect(() => {
    saveDemoEducationSpaceState(scenario, {
      spaces: educationSpaces,
      currentSpaceId: currentEducationSpaceId,
      currentOrganizationId: organizations.length > 0 ? currentOrg : null,
    })
  }, [scenario, educationSpaces, currentEducationSpaceId, currentOrg, organizations.length])

  const currentDemoEducationSpace = React.useMemo(
    () => educationSpaces.find((s) => s.id === currentEducationSpaceId) ?? null,
    [educationSpaces, currentEducationSpaceId]
  )

  React.useEffect(() => {
    if (organizations.length === 0) {
      setDialogueContentOrgScope(NO_ORG_ID)
      return
    }
    const scopeExists = organizations.some((o) => o.id === dialogueContentOrgScope)
    if (!scopeExists || dialogueContentOrgScope === CONTENT_SCOPE_ALL_ORGANIZATIONS_ID) {
      const fallbackOrgId = organizations.some((o) => o.id === currentOrg)
        ? currentOrg
        : organizations[0]!.id
      setDialogueContentOrgScope(fallbackOrgId)
    }
  }, [organizations, currentOrg, dialogueContentOrgScope])

  // 获取当前组织的消息列表
  const educationMessages = React.useMemo(() => {
    return coerceMessagesList(orgMessages[currentOrg])
  }, [orgMessages, currentOrg])

  /** 教育/医院门户区 `educationMessages` 与主列 `messages` 双轨；门户内 handoff 须用此快照写回 dock 会话 */
  const educationPortalTranscriptRef = React.useRef<Message[]>([])
  React.useEffect(() => {
    educationPortalTranscriptRef.current = educationMessages
  }, [educationMessages])

  const educationPortalApps = React.useMemo(
    () => resolveEducationPortalApps(organizations),
    [organizations]
  )

  const hasJoinedOrganizations = organizations.length > 0
  /** 场景零：`no-org` 且尚未加入任何组织（对话/教育壳层 V2 对齐体验仅在此态启用） */
  const isScenarioZeroNoOrg = isHomeScenarioZeroNoOrg(scenario, hasJoinedOrganizations)
  /** `?scenario=no-org`：主 VVAI 与场景二同构的考勤/任务/教育承接演示（含会话列表 dock 镜像） */
  const isNoOrgRoute = isNoOrgHomeScenarioRoute(scenario)

  const secondaryPortalOpen =
    activeApp === "education" ||
    activeApp === "hospital" ||
    activeApp === PERSONAL_EDU_SPACE_APP_ID
  /** `no-org` 路由下进入教育门户：顶栏与会话列表顶槽展示《空间状态栏》 */
  const showNoOrgEducationSpaceNav =
    isNoOrgRoute && secondaryPortalOpen && activeApp === "education"
  const secondaryPortalApps = activeApp === "hospital" ? HOSPITAL_PORTAL_APPS : educationPortalApps

  /** 教育/医疗门户：底部「二级能力」横条；返回仅收起该条（仍保留门户会话区），与 dock 应用「返回应用列表」一致 */
  const [portalSecondaryDockExpanded, setPortalSecondaryDockExpanded] = React.useState(true)
  React.useEffect(() => {
    if (
      activeApp === "education" ||
      activeApp === "hospital" ||
      activeApp === PERSONAL_EDU_SPACE_APP_ID
    ) {
      setPortalSecondaryDockExpanded(true)
    }
  }, [activeApp])

  const cuiHistoryConversations = React.useMemo(
    () => buildImStyleSessionList(conversations, cuiMainChatId),
    [conversations, cuiMainChatId]
  )

  const sessionListOrganizations = React.useMemo(
    () => organizations.map((o) => ({ id: o.id, name: o.name })),
    [organizations]
  )

  const isNavContentScopeMode = React.useMemo(() => {
    if (secondaryPortalOpen) return false
    /** 场景二（多组织）/ 场景四：顶栏与会话列表切换为会话主体，不做「信息筛选」横幅 */
    if (isScenarioFourOrMainEntry(scenario) && conversation.id === cuiMainChatId) return false
    if (conversation.id === cuiMainChatId) return true
    const appId = getConversationDockAppId(conversation)
    return appId != null && isPersonalScopeDockAppId(appId)
  }, [secondaryPortalOpen, conversation, cuiMainChatId, scenario])

  /** 任意 dock 应用会话：顶区不重复欢迎与快捷建议（消息流内保留各应用首条欢迎） */
  const isDockAppSession = React.useMemo(
    () => isDockConversationId(conversation.id) || conversation.dockAppId != null,
    [conversation]
  )
  /** 「任务」「考勤」「员工」dock：不展示消息内「回复所属组织」横幅（组织由卡片上 `MainCuiCardOrgAttributionBanner` 等承担） */
  const isWorkTaskDockSession = React.useMemo(
    () => getConversationDockAppId(conversation) === "work_task",
    [conversation]
  )
  const isAttendanceDockSession = React.useMemo(
    () => getConversationDockAppId(conversation) === "attendance",
    [conversation]
  )
  const isEmployeeDockSession = React.useMemo(
    () => getConversationDockAppId(conversation) === "employee",
    [conversation]
  )
  const hideDockOrgReplyBannerSession =
    isWorkTaskDockSession || isAttendanceDockSession || isEmployeeDockSession

  const openPortalRootApp = React.useCallback(
    (portalKind: "education" | "hospital") => {
      const orgId = resolvePortalEntryOrganizationId(portalKind, {
        isNavContentScopeMode,
        dialogueContentOrgScope,
        currentOrg,
        organizations,
      })
      setCurrentOrg(orgId)
      const meta = getDockAppMeta(portalKind, scenario)
      onRegisterPortalRootSession?.(portalKind, meta.name, orgId, hasJoinedOrganizations)
      setActiveApp(portalKind)
    },
    [
      isNavContentScopeMode,
      dialogueContentOrgScope,
      currentOrg,
      organizations,
      hasJoinedOrganizations,
      onRegisterPortalRootSession,
      scenario,
    ]
  )

  /** 兼容旧会话/入口：与底部条唯一「教育」空间应用（`education`）同壳层 */
  const openPersonalEduSpacePortal = React.useCallback(() => {
    openPortalRootApp("education")
  }, [openPortalRootApp])

  const appendPersonalEduSpaceTurn = React.useCallback(
    (actionLabel: string) => {
      const userMsg: Message = {
        id: `user-${Date.now()}`,
        senderId: currentUser.id,
        content: actionLabel,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        createdAt: Date.now(),
      }
      const cardData = JSON.stringify({
        title: getDockAppMeta(PERSONAL_EDU_SPACE_APP_ID, scenario).name,
        description: `已选择：${actionLabel}。接下来可补充孩子年级、就读地区或学习目标等，我会按步骤协助你完成空间创建与配置。`,
        detail:
          "1. 确认身份与创建对象（家长为孩子 / 学生为自己）\n2. 填写或补充基础信息\n3. 遇到不懂的问题随时向我提问",
        imageSrc: getDockAppMeta(PERSONAL_EDU_SPACE_APP_ID, scenario).imageSrc,
        cardActions: {
          primary: {
            label: "按步骤继续",
            sendText: `我会按「${actionLabel}」继续，请先帮我确认第一步要准备什么。`,
          },
          secondary: { label: "换一个入口", preset: "more_recommend" as const },
        },
      })
      const botMsg: Message = {
        id: `bot-card-${Date.now() + 1}`,
        senderId: conversation.user.id,
        content: `<<<RENDER_GENERIC_CARD>>>:${cardData}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        createdAt: Date.now() + 1,
      }
      setEducationMessages((prev) => [...prev, userMsg])
      setTimeout(() => {
        setEducationMessages((prev) => [...prev, botMsg])
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 500)
    },
    [conversation.user.id, scenario]
  )

  const handlePortalDockSwitcherSelect = React.useCallback(
    (app: AppItem) => {
      if (app.id === "education" || app.id === "hospital") {
        openPortalRootApp(app.id)
        return
      }
      if (app.id === PERSONAL_EDU_SPACE_APP_ID) {
        openPortalRootApp("education")
        return
      }
      if (
        (isScenarioTwoFamily(scenario) || isNoOrgRoute) &&
        !isScenarioTwoMultiOrgs(scenario)
      ) {
        onDockAppActivate?.(app.id, app.name, currentOrg, hasJoinedOrganizations)
        const first = getDockBarInlineShortcuts(app.id)[0]
        if (first) queueMicrotask(() => handleSendMessageRef.current(first))
        return
      }
      setActiveApp(null)
      onDockAppActivate?.(app.id, app.name, currentOrg, hasJoinedOrganizations)
    },
    [
      onDockAppActivate,
      currentOrg,
      hasJoinedOrganizations,
      openPortalRootApp,
      openPersonalEduSpacePortal,
      scenario,
      isNoOrgRoute,
    ]
  )

  /**
   * 教育 / 医院门户：仅在「进入门户 / 换组织」时把列表选中态对齐到门户根 dock 会话。
   * 不可在 `conversations` 每次更新时强制 `onSelect(expectedId)`，否则用户从会话历史切到其他应用会被立刻打回门户会话。
   */
  const portalRootSessionListSyncKeyRef = React.useRef<string | null>(null)
  React.useEffect(() => {
    if (!onSelect) return
    const portalKind =
      activeApp === "education" || activeApp === "hospital"
        ? activeApp
        : activeApp === PERSONAL_EDU_SPACE_APP_ID
          ? PERSONAL_EDU_SPACE_APP_ID
          : null
    if (!portalKind) {
      portalRootSessionListSyncKeyRef.current = null
      return
    }
    const expectedId = stableDockConversationId(
      currentOrg,
      portalKind,
      hasJoinedOrganizations
    )
    const syncKey = `${portalKind}|${currentOrg}|${String(hasJoinedOrganizations)}`
    if (portalRootSessionListSyncKeyRef.current === syncKey) {
      return
    }
    if (conversations.some((c) => c.id === expectedId)) {
      portalRootSessionListSyncKeyRef.current = syncKey
      if (selectedId !== expectedId) {
        onSelect(expectedId)
      }
      return
    }
    if (portalKind === "education" || portalKind === "hospital") {
      openPortalRootApp(portalKind)
    } else {
      openPersonalEduSpacePortal()
    }
  }, [
    activeApp,
    currentOrg,
    hasJoinedOrganizations,
    conversations,
    selectedId,
    onSelect,
    openPortalRootApp,
    openPersonalEduSpacePortal,
  ])

  /** 从《会话历史》选中非门户根会话时先退出门户，避免仍走教育/医院消息列与门户壳层 */
  const applyPrimarySessionListSelection = React.useCallback(
    (id: string) => {
      if (
        secondaryPortalOpen &&
        (activeApp === "education" ||
          activeApp === "hospital" ||
          activeApp === PERSONAL_EDU_SPACE_APP_ID)
      ) {
        const portalKind = activeApp as "education" | "hospital" | typeof PERSONAL_EDU_SPACE_APP_ID
        const portalRootId = stableDockConversationId(
          currentOrg,
          portalKind,
          hasJoinedOrganizations
        )
        if (id !== portalRootId) {
          setActiveApp(null)
        }
      }
      onSelect?.(id)
    },
    [secondaryPortalOpen, activeApp, currentOrg, hasJoinedOrganizations, onSelect]
  )

  /** 组织型应用会话：AI 回复 GUI 标明所属组织（主 VVAI / 个人应用顶栏内容范围不展示消息内横幅） */
  const dockSessionOrgDisplayNameForMessages = React.useMemo(() => {
    if (secondaryPortalOpen) return null
    if (isNavContentScopeMode) return null
    const oid = conversationDockOrgIdForSessionInteraction(conversation)
    if (!oid) return null
    return organizations.find((o) => o.id === oid)?.name?.trim() || oid
  }, [secondaryPortalOpen, conversation, organizations, isNavContentScopeMode])

  const renderReplyOrgContextBanner = React.useCallback(
    (_msg: Message, isEducationContext: boolean) => {
      if (isEducationContext) return null
      if (hideDockOrgReplyBannerSession) return null
      if (dockSessionOrgDisplayNameForMessages) {
        return <DockSessionOrgReplyBanner orgDisplayName={dockSessionOrgDisplayNameForMessages} />
      }
      return null
    },
    [dockSessionOrgDisplayNameForMessages, hideDockOrgReplyBannerSession]
  )

  /**
   * 主 VVAI，或日历等待办/会议/文档/邮件/微盘等「个人应用范围」dock 会话：
   * 已加入多个组织时，对「组织应用」卡片在卡片上方展示 `MainCuiCardOrgAttributionBanner`。
   * 卡片 dock id 取 `msg.cardAttributionDockAppId ?? contentDockAppId`；若为个人应用范围则不展示。
   * 组织名称：`msg.cardAttributionOrgId`（若有）否则取当前对话解析出的主体（见 `conversationHostOrganizationIdForAttribution`）。
   */
  const mainCuiOrgCardAttributionHostConversation = React.useMemo(() => {
    const sessionDockId = getConversationDockAppId(conversation)
    const isMainVvai =
      conversation.id === cuiMainChatId &&
      conversation.dockAppId == null &&
      !isDockConversationId(conversation.id)
    const isPersonalScopeDockChat =
      (isDockConversationId(conversation.id) || conversation.dockAppId != null) &&
      sessionDockId != null &&
      isPersonalScopeDockAppId(sessionDockId)
    return isMainVvai || isPersonalScopeDockChat
  }, [conversation.id, conversation.dockAppId, cuiMainChatId])

  const conversationHostOrganizationIdForCardBanner = React.useMemo(
    () =>
      conversationHostOrganizationIdForAttribution(conversation, {
        cuiMainChatId,
        isNavContentScopeMode,
        dialogueContentOrgScope,
        currentOrg,
        organizations,
      }),
    [
      conversation,
      cuiMainChatId,
      isNavContentScopeMode,
      dialogueContentOrgScope,
      currentOrg,
      organizations,
    ]
  )

  const renderMainCuiCardOrgAttributionBanner = React.useCallback(
    (msg: Message, isEducationContext: boolean, contentDockAppId: string | null) => {
      if (isEducationContext) return null
      if (secondaryPortalOpen) return null
      if (!mainCuiOrgCardAttributionHostConversation) return null
      if (!hasJoinedOrganizations || organizations.length <= 1) return null
      const dockId = msg.cardAttributionDockAppId ?? contentDockAppId
      if (!dockId || isPersonalScopeDockAppId(dockId)) return null
      const oid = msg.cardAttributionOrgId ?? conversationHostOrganizationIdForCardBanner
      const label = organizations.find((o) => o.id === oid)?.name?.trim() || oid

      const mergeOrgSwitchIntoBanner =
        isScenarioTwoMultiOrgs(scenario) &&
        (dockId === "attendance" || dockId === "work_task")

      const multiOrgSwitch = mergeOrgSwitchIntoBanner
        ? {
            organizations: organizations.map((o) => ({ id: o.id, name: o.name })),
            conversationCurrentOrgId: currentOrg,
            orgPickLabelMode: (dockId === "work_task" ? "task_table" : "attendance") as
              | "task_table"
              | "attendance",
            onNavigateOtherOrg: (orgName: string) =>
              dockId === "work_task"
                ? handleSendMessageRef.current(`还可以针对「${orgName}」打开任务列表`)
                : handleSendMessageRef.current(`还可以针对「${orgName}」查看考勤`),
          }
        : undefined

      return (
        <MainCuiCardOrgAttributionBanner orgDisplayName={label} multiOrgSwitch={multiOrgSwitch} />
      )
    },
    [
      secondaryPortalOpen,
      mainCuiOrgCardAttributionHostConversation,
      hasJoinedOrganizations,
      organizations,
      conversationHostOrganizationIdForCardBanner,
      scenario,
      currentOrg,
    ]
  )

  const navBarOrganizationId = isNavContentScopeMode ? dialogueContentOrgScope : currentOrg

  const handleSessionResizePointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!onSessionSidebarWidthChange) return
      e.preventDefault()
      const startX = e.clientX
      const startW = sessionSidebarWidthProp
      const onMove = (ev: PointerEvent) => {
        const dw = ev.clientX - startX
        onSessionSidebarWidthChange(Math.min(480, Math.max(220, startW + dw)))
      }
      const onUp = () => {
        window.removeEventListener("pointermove", onMove)
        window.removeEventListener("pointerup", onUp)
      }
      window.addEventListener("pointermove", onMove)
      window.addEventListener("pointerup", onUp)
    },
    [sessionSidebarWidthProp, onSessionSidebarWidthChange]
  )

  // Model State
  const [currentModel, setCurrentModel] = React.useState<string>('gpt-4');

  // Task Drawer State
  const [isTaskDrawerOpen, setIsTaskDrawerOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<any>(null);
  
  // Pinned Task State
  const [isPinnedTaskExpanded, setIsPinnedTaskExpanded] = React.useState(true);

  // Floating Windows State
  const [floatingApps, setFloatingApps] = React.useState<string[]>([]);

  // Secondary App History Sidebar State
  const [secondaryHistoryOpen, setSecondaryHistoryOpen] = React.useState(false);
  const [selectedSecondarySession, setSelectedSecondarySession] = React.useState<string>("");
  /** 主 VVAI 顶栏「历史消息」右侧抽屉 */
  const [mainChatHistoryOpen, setMainChatHistoryOpen] = React.useState(false);

  /** 教育/医院门户：《应用内历史》抽屉无顶栏入口时，进入门户即收起避免无法关闭 */
  React.useEffect(() => {
    if (secondaryPortalOpen) setSecondaryHistoryOpen(false)
  }, [secondaryPortalOpen])

  // Mock data for secondary app sessions (教育应用的历史会话)
  const [secondaryAppSessions] = React.useState<SecondaryAppSession[]>([
    {
      id: 'session-1',
      appName: '教育',
      appIconKey: 'education',
      timestamp: new Date(), // 今天
      hasUncompletedAction: true
    },
    {
      id: 'session-2',
      appName: '日历',
      appIconKey: 'calendar',
      timestamp: new Date(), // 今天
      hasUncompletedAction: false
    },
    {
      id: 'session-3',
      appName: '会议',
      appIconKey: 'meeting',
      timestamp: new Date(), // 今天
      hasUncompletedAction: true
    },
    {
      id: 'session-4',
      appName: '待办',
      appIconKey: 'todo',
      timestamp: new Date(), // 今天
      hasUncompletedAction: true
    },
    {
      id: 'session-5',
      appName: '微盘',
      appIconKey: 'disk',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3天前
      hasUncompletedAction: false
    },
    {
      id: 'session-6',
      appName: '邮箱',
      appIconKey: 'mail',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5天前
      hasUncompletedAction: false
    },
    {
      id: 'session-7',
      appName: '会议',
      appIconKey: 'meeting',
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10天前
      hasUncompletedAction: false
    },
    {
      id: 'session-8',
      appName: '微盘',
      appIconKey: 'disk',
      timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15���前
      hasUncompletedAction: false
    },
  ]);

  const hydrateBottomDock = React.useCallback(() => {
    let signature: string
    let ids: string[]
    if (scenario === "scenario-five") {
      signature = computeUnionDockSignature("scenario-five", organizations)
      ids =
        organizations.length === 0
          ? [...DOCK_IDS_NO_ORG]
          : defaultDockIdsUnionAcrossOrgs(organizations)
    } else {
      signature = computeDockSignature(organizations, currentOrg, scenario)
      ids = defaultDockIdsForContext(organizations, currentOrg, scenario)
    }
    dockSignatureRef.current = signature
    const denied = [
      ...MOCK_DOCK_USER.deniedAppIds,
      ...(ROLE_DENIED_APPS[MOCK_DOCK_USER.roleId] ?? []),
    ]
    ids = ids.filter((id) => !denied.includes(id))
    ids = sortDockIdsByUsage(ids, MOCK_DOCK_USER.usageWeight)
    const saved = loadPersistedDockOrder(signature)
    if (saved) {
      const allow = new Set(ids)
      const head = saved.filter((id) => allow.has(id))
      const tail = ids.filter((id) => !head.includes(id))
      ids = [...head, ...tail]
    }
    ids = prioritizePortalDockHead(ids)
    setDockCatalogIds(ids)
    const hidden = new Set(loadPersistedDockHidden(signature))
    ids = ids.filter((id) => !hidden.has(id))
    const next = ids.map((id, i) => createDockAppItem(id, i + 1, scenario))
    lastDockOrderRef.current = ids
    setApps(next)
  }, [organizations, currentOrg, scenario])

  React.useEffect(() => {
    if (mainView !== "cui") return
    /** 从会话直接进入门户时 `activeApp` 可能非空而 `apps` 尚未 hydrate，切换芯片会误显示「应用」 */
    if (activeApp === null) {
      hydrateBottomDock()
      return
    }
    if (apps.length === 0) {
      hydrateBottomDock()
    }
  }, [organizations, currentOrg, mainView, activeApp, apps.length, hydrateBottomDock])

  React.useEffect(() => {
    onCurrentOrgChange?.(currentOrg, { hasJoinedOrganizations })
  }, [currentOrg, hasJoinedOrganizations, onCurrentOrgChange])

  /** 从会话列表进入某行政公司的应用会话时，顶栏主体与之一致，避免「日历」内容与切换器所示公司错位 */
  React.useEffect(() => {
    if (activeApp !== null) return
    if (!isDockConversationId(conversation.id) && conversation.dockAppId == null) return
    const oid = conversationDockOrgIdForSessionInteraction(conversation)
    if (!oid) return
    if (!organizations.some((o) => o.id === oid)) return
    setCurrentOrg((prev) => (prev === oid ? prev : oid))
  }, [conversation.id, conversation.dockAppId, organizations, activeApp])

  const handleReorder = (reorderedApps: AppItem[]) => {
    setApps(reorderedApps);
    lastDockOrderRef.current = reorderedApps.map((a) => a.id);
    const sig = dockSignatureRef.current;
    if (sig) persistDockOrder(sig, reorderedApps.map((a) => a.id));
  };

  const handleDockRemoveFromBar = React.useCallback(
    (appId: string) => {
      if (apps.length <= 1) return
      const sig = dockSignatureRef.current
      if (!sig) return
      const prevHidden = loadPersistedDockHidden(sig)
      if (!prevHidden.includes(appId)) {
        persistDockHidden(sig, [...prevHidden, appId])
      }
      const reordered = apps
        .filter((a) => a.id !== appId)
        .map((a, i) => ({ ...a, order: i + 1 }))
      setApps(reordered)
      const orderedIds = reordered.map((a) => a.id)
      lastDockOrderRef.current = orderedIds
      persistDockOrder(sig, orderedIds)
    },
    [apps]
  )

  const handleDockAddToBar = React.useCallback(
    (appId: string) => {
      const sig = dockSignatureRef.current
      if (!sig) return
      if (apps.some((a) => a.id === appId)) return
      persistDockHidden(
        sig,
        loadPersistedDockHidden(sig).filter((id) => id !== appId)
      )
      const reordered = [...apps, createDockAppItem(appId, apps.length + 1, scenario)]
      setApps(reordered)
      const orderedIds = reordered.map((a) => a.id)
      lastDockOrderRef.current = orderedIds
      persistDockOrder(sig, orderedIds)
    },
    [apps, scenario]
  )

  // 辅助函数：更新当前组织的消息列表
  const setEducationMessages = React.useCallback((updater: Message[] | ((prev: Message[]) => Message[])) => {
    setOrgMessages((prev) => {
      const currentMessages = coerceMessagesList(prev[currentOrg])
      const raw = typeof updater === "function" ? updater(currentMessages) : updater
      const newMessages = coerceMessagesList(raw)
      return {
        ...prev,
        [currentOrg]: newMessages,
      }
    })
  }, [currentOrg])

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (longPressIndex !== index) {
      e.preventDefault();
      return;
    }
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', index.toString());
    }
    setDraggedIndex(index);
  };

  const handleDragEnter = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newApps = [...apps];
    const draggedApp = newApps[draggedIndex];
    newApps.splice(draggedIndex, 1);
    newApps.splice(index, 0, draggedApp);
    
    const reorderedApps = newApps.map((app, i) => ({
      ...app,
      order: i + 1,
    }));
    
    setApps(reorderedApps);
    lastDockOrderRef.current = reorderedApps.map((a) => a.id);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null) {
      const sig = dockSignatureRef.current;
      if (sig && lastDockOrderRef.current.length > 0) {
        persistDockOrder(sig, lastDockOrderRef.current);
      }
    }
    setDraggedIndex(null);
  };

  React.useLayoutEffect(() => {
    const id = conversation.id
    const prev = prevConversationIdRef.current
    if (prev !== null && prev !== id && onPersistConversationMessages) {
      onPersistConversationMessages(prev, messagesRef.current)
    }
    const idChanged = prev !== id
    prevConversationIdRef.current = id

    const parentMessagesIdentityChanged =
      conversation.messages !== lastSyncedParentConversationMessagesRef.current
    lastSyncedParentConversationMessagesRef.current = conversation.messages

    const revChanged = lastMainChatSessionRevisionRef.current !== mainChatSessionRevision
    lastMainChatSessionRevisionRef.current = mainChatSessionRevision

    const shouldSyncMessagesFromParent = idChanged || revChanged || parentMessagesIdentityChanged

    let nextMsgs: Message[]
    if (shouldSyncMessagesFromParent) {
      nextMsgs = coerceMessagesList(conversation.messages)
      setMessages(nextMsgs)
      conversationMessagesRef.current = nextMsgs
    } else {
      nextMsgs = coerceMessagesList(messagesRef.current)
      conversationMessagesRef.current = nextMsgs
    }

    /** 教育/医院门户区渲染的是 orgMessages[currentOrg]，与父级 dock 会话 conversation.messages 双轨；从主 VVAI handoff 写入父级后须同步，否则门户内看不到带入的用户指令 */
    const expectedEducationId = stableDockConversationId(
      currentOrg,
      "education",
      hasJoinedOrganizations
    )
    const expectedHospitalId = stableDockConversationId(
      currentOrg,
      "hospital",
      hasJoinedOrganizations
    )
    const expectedPersonalEduId = stableDockConversationId(
      currentOrg,
      PERSONAL_EDU_SPACE_APP_ID,
      hasJoinedOrganizations
    )
    const orgKey = conversation.dockOrgId ?? currentOrg
    if (
      conversation.id === expectedEducationId ||
      conversation.id === expectedHospitalId ||
      conversation.id === expectedPersonalEduId
    ) {
      setOrgMessages((prev) => ({
        ...prev,
        [orgKey]: nextMsgs,
      }))
    }
    if (idChanged || revChanged) {
      setIsPinnedTaskExpanded(true)
      pinnedTaskAllowScrollCollapseRef.current = false
      lastChatScrollTopRef.current = 0
      if (chatScrollContainerRef.current) {
        chatScrollContainerRef.current.scrollTop = 0
      }
    }
    if (idChanged) {
      /** 仅当会话 id 与当前主体下的门户根 dock id 一致时才进入教育/医院壳层；避免仅靠 dockAppId 解析把非门户会话误判为门户，导致无法切到其它应用 */
      if (conversation.id === expectedEducationId) {
        setActiveApp("education")
      } else if (conversation.id === expectedHospitalId) {
        setActiveApp("hospital")
      } else if (conversation.id === expectedPersonalEduId) {
        setActiveApp(PERSONAL_EDU_SPACE_APP_ID)
      } else {
        setActiveApp((a) =>
          a === "education" || a === "hospital" || a === PERSONAL_EDU_SPACE_APP_ID ? null : a
        )
      }
    }
  }, [
    conversation.id,
    conversation.messages,
    mainChatSessionRevision,
    onPersistConversationMessages,
    cuiMainChatId,
    currentOrg,
    hasJoinedOrganizations,
  ])

  React.useLayoutEffect(() => {
    const p = pendingDayJumpRef.current
    if (!p || p.conversationId !== conversation.id) return
    const root = chatScrollContainerRef.current
    if (!root) return
    const mid = p.messageId
    const tryScroll = () => {
      const el = root.querySelector(`[data-cui-message-id="${CSS.escape(mid)}"]`)
      if (el instanceof HTMLElement) {
        el.scrollIntoView({ block: "start", behavior: "smooth" })
        pendingDayJumpRef.current = null
        return true
      }
      return false
    }
    if (!tryScroll()) {
      requestAnimationFrame(() => {
        if (
          pendingDayJumpRef.current?.conversationId === p.conversationId &&
          pendingDayJumpRef.current?.messageId === p.messageId
        ) {
          tryScroll()
        }
      })
    }
  }, [conversation.id, messages, dayJumpNonce])

  React.useEffect(() => {
    onPersistConversationMessages?.(conversation.id, messagesRef.current)
  }, [messages, conversation.id, onPersistConversationMessages])

  /** key=selectedId 时会卸载实例，须把当前会话写回父级 */
  React.useEffect(() => {
    const cid = conversation.id
    return () => {
      onPersistConversationMessages?.(cid, messagesRef.current)
    }
  }, [conversation.id, onPersistConversationMessages])

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, educationMessages])

  /**
   * 首轮「查看今日日程」等：指令 + vv 卡只同步到「日历」dock 会话（不切换选中会话、不改变会话历史侧栏开/收）。
   */
  const mirrorTodayAgendaBootstrap = React.useCallback(
    (raw: string) => {
      const mirror = onMirrorDockConversationRef.current
      if (!mirror) return
      if (isDockConversationId(conversation.id) && getConversationDockAppId(conversation) === "calendar") return
      const text = raw.trim()
      if (!text) return
      const { payload } = planGeneralVvInteraction(text, vvContext, vvFlow)
      const ts = () =>
        new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false })
      const base = Date.now()
      const mirrorUser: Message = {
        id: `mirror-cal-boot-u-${base}`,
        senderId: currentUser.id,
        content: text,
        timestamp: ts(),
        createdAt: base,
      }
      const mirrorBot = vvAssistantMessageFromPayload(payload, conversation.user.id)
      mirrorBot.id = `mirror-cal-boot-a-${base}`
      mirrorBot.timestamp = ts()
      mirrorBot.createdAt = base + 1
      mirror({
        dockAppId: "calendar",
        orgId: currentOrgRef.current,
        hasJoinedOrganizations: organizations.length > 0,
        pairs: [],
        mirrorExtraMessages: [mirrorUser, mirrorBot],
      })
    },
    [conversation.id, conversation.user.id, organizations.length, vvContext, vvFlow]
  )

  /** 后续凡 vv 轮次属日历域：同步到「日历」dock 会话；日历 dock 内不自镜像 */
  const mirrorCalendarRelatedVvRound = React.useCallback(
    (userText: string) => {
      const mirror = onMirrorDockConversationRef.current
      if (!mirror) return
      if (isDockConversationId(conversation.id) && getConversationDockAppId(conversation) === "calendar") return
      const text = userText.trim()
      if (!text) return
      const { payload } = planGeneralVvInteraction(text, vvContext, vvFlow)
      if (!isVvPayloadCalendarConversationSyncDomain(payload)) return
      const ts = () =>
        new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false })
      const base = Date.now()
      const mirrorUser: Message = {
        id: `mirror-cal-u-${base}`,
        senderId: currentUser.id,
        content: text,
        timestamp: ts(),
        createdAt: base,
      }
      const mirrorBot = vvAssistantMessageFromPayload(payload, conversation.user.id)
      mirrorBot.id = `mirror-cal-a-${base}`
      mirrorBot.timestamp = ts()
      mirrorBot.createdAt = base + 1
      mirror({
        dockAppId: "calendar",
        orgId: currentOrgRef.current,
        hasJoinedOrganizations: organizations.length > 0,
        pairs: [],
        mirrorExtraMessages: [mirrorUser, mirrorBot],
      })
    },
    [conversation.id, conversation.user.id, organizations.length, vvContext, vvFlow]
  )

  /** 日程详情侧栏「子对话」内产生的消息（vv 编排 + 底部输入演示回复）同步到「日历」dock 会话历史 */
  const mirrorScheduleSideThreadToCalendar = React.useCallback((msgs: ReadonlyArray<Message>) => {
    const mx = onMirrorDockConversationRef.current
    if (!mx || msgs.length === 0) return
    const base = Date.now()
    const mirrorExtraMessages = msgs.map((msg, idx) => ({
      ...msg,
      id: `mirror-side-cal-${msg.id}-${base}-${idx}`,
      createdAt: base + idx,
    }))
    mx({
      dockAppId: "calendar",
      orgId: currentOrgRef.current,
      hasJoinedOrganizations: organizations.length > 0,
      pairs: [],
      mirrorExtraMessages,
    })
  }, [organizations.length])

  /** 在主 AI / 日程 / 会议 / 课程 / 教育门户等发起员工管理时，将用户指令与卡片同步到「员工」应用 dock 线程 */
  const mirrorEmployeeMgmtToEmployeeApp = React.useCallback(
    (userText: string) => {
      const trimmed = userText.trim()
      if (!trimmed) return
      const mx = onMirrorDockConversationRef.current
      if (!mx) return
      const ts = Date.now()
      const timeStr = new Date().toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      const userMsg: Message = {
        id: `emp-mirror-u-${ts}`,
        senderId: currentUser.id,
        content: trimmed,
        timestamp: timeStr,
        createdAt: ts,
      }
      const botMsg: Message = {
        id: `emp-mirror-b-${ts}`,
        senderId: conversation.user.id,
        content: EMPLOYEE_MGMT_MARKER,
        timestamp: timeStr,
        createdAt: ts,
        cardAttributionOrgId: currentOrgRef.current,
        cardAttributionDockAppId: "employee",
      }
      mx({
        dockAppId: "employee",
        orgId: currentOrgRef.current,
        hasJoinedOrganizations: organizations.length > 0,
        pairs: [],
        mirrorExtraMessages: [
          { ...userMsg, id: toDockMirrorPeerMessageId(userMsg.id) },
          { ...botMsg, id: toDockMirrorPeerMessageId(botMsg.id) },
        ],
      })
    },
    [conversation.user.id, organizations.length]
  )

  const [employeeInviteRecordsByScope, setEmployeeInviteRecordsByScope] = React.useState<
    Record<string, TeacherInviteRecordModel[]>
  >({})
  const employeeInviteScopeKey = React.useMemo(
    () => `${conversation.id}::${currentOrg}`,
    [conversation.id, currentOrg]
  )
  const employeeInviteRecordsForScope = employeeInviteRecordsByScope[employeeInviteScopeKey] ?? []
  const updateEmployeeInviteRecords = React.useCallback(
    (updater: React.SetStateAction<TeacherInviteRecordModel[]>) => {
      setEmployeeInviteRecordsByScope((prev) => {
        const cur = prev[employeeInviteScopeKey] ?? []
        const next =
          typeof updater === "function"
            ? (updater as (c: TeacherInviteRecordModel[]) => TeacherInviteRecordModel[])(cur)
            : updater
        return { ...prev, [employeeInviteScopeKey]: next }
      })
    },
    [employeeInviteScopeKey]
  )

  const handleScheduleSidePanelIntent = React.useCallback(
    (text: string) => {
      runVvGeneralSend(
        text,
        vvContext,
        (u) => {
          scheduleSideThreadBridgeRef.current?.applyMessagesUpdate(u)
        },
        conversation.user.id,
        vvFlow,
        setVvFlow,
        {
          scheduleBridge: vvScheduleBridge,
          scheduleCalendarPrefsBridge: scheduleCalendarPrefsBridgeRef.current ?? undefined,
        }
      )
    },
    [conversation.user.id, vvContext, vvFlow, vvScheduleBridge]
  )

  /** 非 `guiThen` 包裹、直接追加的日历域 vv 卡：同步单条助手消息到「日历」dock */
  const appendToActiveConversationWithCalendarMirror = React.useCallback(
    (m: Message) => {
      if (secondaryPortalOpen) {
        setEducationMessages((p) => [...p, m])
      } else {
        setMessages((p) => [...p, m])
      }
      if (vvGuiThenDepthRef.current > 0) return
      if (isDockConversationId(conversation.id) && getConversationDockAppId(conversation) === "calendar") return
      if (!m.vvAssistant || !isVvPayloadCalendarConversationSyncDomain(m.vvAssistant)) return
      const mx = onMirrorDockConversationRef.current
      if (!mx) return
      const now = Date.now()
      const clone: Message = {
        ...m,
        id: `mirror-cal-asst-${now}`,
        createdAt: now,
      }
      mx({
        dockAppId: "calendar",
        orgId: currentOrgRef.current,
        hasJoinedOrganizations: organizations.length > 0,
        pairs: [],
        mirrorExtraMessages: [clone],
      })
    },
    [conversation.id, organizations.length, secondaryPortalOpen]
  )

  /**
   * 与 `appendToActiveConversationWithCalendarMirror` 一致：门户区（educationMessages）与主列 `messages` 二轨时，
   * vv 卡片的 `patchAnyMessageById` / `runVvGeneralSend` 等须写入当前可见 transcript，否则「创建」等原地更新不生效。
   */
  const setActiveTranscriptMessages = React.useCallback<React.Dispatch<React.SetStateAction<Message[]>>>(
    (action) => {
      if (secondaryPortalOpen) {
        setEducationMessages(action)
        return
      }
      setMessages(action)
    },
    [secondaryPortalOpen, setEducationMessages]
  )

  const handleSendMessage = (messageOverride?: string) => {
    const raw = (messageOverride ?? inputValue).trim()
    if (!raw) return

    const orgSwitchTarget = parseEmployeeOrgSwitchSendText(raw)
    if (orgSwitchTarget && organizations.some((o) => o.id === orgSwitchTarget)) {
      employeeOrgSwitchHandlerRef.current(orgSwitchTarget)
      return
    }

    const newUserMessage: Message = {
      id: `new-${Date.now()}`,
      senderId: currentUser.id,
      content: raw,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now(),
    }

    if (secondaryPortalOpen) {
      const updatedMessages = [...coerceMessagesList(educationMessages), newUserMessage]
      setEducationMessages(updatedMessages)
      setInputValue("")

      if (raw === "创建教育空间") {
        const orgName =
          latestEduCreateOrgSuccessOrgName(coerceMessagesList(educationMessages)) ??
          latestEduCreateOrgSuccessOrgName(coerceMessagesList(messages))
        const fullEdu = shouldOfferFullEducationSpaceCreateFlow(
          scenario,
          hasJoinedOrganizations,
          coerceMessagesList(educationMessages),
          coerceMessagesList(messages)
        )
        if (fullEdu || orgName) {
          setTimeout(() => {
            const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            setEducationMessages((prev) => [
              ...prev,
              {
                id: `edu-space-type-${Date.now()}`,
                senderId: conversation.user.id,
                content: `${EDU_SPACE_TYPE_SELECT_MARKER}:${JSON.stringify({ orgName: orgName ?? undefined })}`,
                timestamp: ts,
                createdAt: Date.now(),
                isAfterPrompt: true,
              },
            ])
            scrollRef.current?.scrollIntoView({ behavior: "smooth" })
          }, 420)
          return
        }
      }

      if (raw === "创建机构教育空间" || raw === "创建家庭教育空间") {
        if (raw === "创建机构教育空间" && organizations.length === 0) {
          setTimeout(() => {
            const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            const botMsg: Message = {
              id: `edu-inst-blocked-${Date.now()}`,
              senderId: conversation.user.id,
              content: EDU_SPACE_INST_BLOCKED_MARKER,
              timestamp: ts,
              createdAt: Date.now(),
              isAfterPrompt: true,
            }
            setEducationMessages((prev) => [...prev, botMsg])
            scrollRef.current?.scrollIntoView({ behavior: "smooth" })
          }, 420)
          return
        }
        const fullEdu = shouldOfferFullEducationSpaceCreateFlow(
          scenario,
          hasJoinedOrganizations,
          coerceMessagesList(educationMessages),
          coerceMessagesList(messages)
        )
        if (fullEdu) {
          const isInst = raw === "创建机构教育空间"
          setTimeout(() => {
            const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            const content = isInst ? EDU_SPACE_INST_FORM_MARKER : EDU_SPACE_FAMILY_ROLE_MARKER
            const botMsg: Message = {
              id: `edu-space-flow-${Date.now()}`,
              senderId: conversation.user.id,
              content,
              timestamp: ts,
              createdAt: Date.now(),
              isAfterPrompt: true,
            }
            setEducationMessages((prev) => [...prev, botMsg])
            scrollRef.current?.scrollIntoView({ behavior: "smooth" })
          }, 420)
          return
        }
        const isInst = raw === "创建机构教育空间"
        setTimeout(() => {
          const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          const cardData = JSON.stringify({
            title: isInst ? "创建机构教育空间" : "创建家庭教育空间",
            description: isInst
              ? "将引导你创建或加入机构类教育主体，并配置教务、商品与财务等能力（演示）。也可在对话中补充校区与学段等信息。"
              : "将引导你创建家庭教育空间，便于成员陪伴、课程与轻量协作（演示）。也可在对话中补充孩子年级与学习目标等信息。",
            detail:
              "1. 确认创建类型与基础信息\n2. 按步骤完成空间初始化\n3. 遇到不懂的问题随时向我提问",
            imageSrc: educationIcon,
            cardActions: {
              primary: {
                label: "按步骤继续",
                sendText: `我要继续完成「${isInst ? "机构" : "家庭"}教育空间」的创建`,
              },
              secondary: { label: "换一个选项", preset: "more_recommend" as const },
            },
          })
          const botMsg: Message = {
            id: `edu-space-entry-${Date.now()}`,
            senderId: conversation.user.id,
            content: `<<<RENDER_GENERIC_CARD>>>:${cardData}`,
            timestamp: ts,
            createdAt: Date.now(),
            isAfterPrompt: true,
          }
          setEducationMessages((prev) => [...prev, botMsg])
          scrollRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 420)
        return
      }

      /** 场景二 / `no-org`：门户「教育」内输入与 dock 教育会话一致，走《应用承接引导》而非欢迎卡 */
      if (
        (isSingleOrgEduAttendanceScenarioFlow(scenario) || isNoOrgRoute) &&
        activeApp === "education" &&
        onIntentDockHandoff
      ) {
        const schoolPortalG =
          matchSchoolScenarioEducationDockAttendanceGuidance(raw) ??
          matchSchoolScenarioEducationDockEmployeeGuidance(raw)
        if (schoolPortalG) {
          const portalOrgId = currentOrgRef.current
          setTimeout(() => {
            const card: Message = {
              id: `school-scene-portal-guidance-${Date.now()}`,
              senderId: "ai-assistant",
              content: `${SCHOOL_SCENE_APP_GUIDANCE_MARKER}:${JSON.stringify(schoolPortalG)}`,
              timestamp: new Date().toLocaleTimeString("zh-CN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }),
              createdAt: Date.now(),
              cardAttributionOrgId: portalOrgId,
              cardAttributionDockAppId: schoolPortalG.targetAppId,
            }
            setEducationMessages((prev) => [...prev, card])
            scrollRef.current?.scrollIntoView({ behavior: "smooth" })
          }, 460)
          return
        }
      }

      /** 门户《主CUI交互》输入「查看今日日程」等 → 与日历 dock / 主列一致的 vv 今日日程卡片 */
      if (isTodayScheduleAgendaQuery(raw)) {
        setTimeout(() => {
          runVvGeneralSend(raw, vvContext, setEducationMessages, conversation.user.id, vvFlow, setVvFlow, {
            scheduleBridge: vvScheduleBridge,
            scheduleCalendarPrefsBridge,
            omitUserBubble: true,
          })
          mirrorTodayAgendaBootstrap(raw)
          scrollRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 380)
        return
      }

      /** 教育门户内「员工管理」等：与日历样板一致，出卡并镜像到「员工」应用 */
      if (activeApp === "education" && matchesEmployeeMgmtIntent(raw)) {
        setTimeout(() => {
          const follow = employeeMgmtOrgSwitchFollowUpFields(organizations, currentOrgRef.current)
          const eduEmpOrgId = currentOrgRef.current
          const botMsg: Message = {
            id: `bot-emp-mgmt-edu-${Date.now()}`,
            senderId: conversation.user.id,
            content: EMPLOYEE_MGMT_MARKER,
            timestamp: new Date().toLocaleTimeString("zh-CN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),
            createdAt: Date.now(),
            cardAttributionOrgId: eduEmpOrgId,
            cardAttributionDockAppId: "employee",
            ...(follow ?? {}),
          }
          setEducationMessages((prev) => [...prev, botMsg])
          mirrorEmployeeMgmtToEmployeeApp(raw)
          scrollRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 400)
        return
      }

      setTimeout(() => {
        if (
          activeApp === PERSONAL_EDU_SPACE_APP_ID ||
          (activeApp === "education" && isScenarioZeroNoOrg)
        ) {
          const peMeta = getDockAppMeta("education", scenario)
          const cardData = JSON.stringify({
            title: peMeta.name,
            description:
              isScenarioZeroNoOrg
                ? "我是你的教育助手。你可以说明自己的情况，或点击下方二级入口选择「家长为孩子创建」或「学生为自己创建」。"
                : "我是你的家庭教育助手。你可以说明自己的情况，或点击下方二级入口选择「家长为孩子创建」或「学生为自己创建」。",
            detail:
              "推荐：先点击下方「我是家长…」或「我是学生…」与你的身份一致的一项；随后在对话中补充孩子年级、就读地区或学习目标等。",
            imageSrc: peMeta.imageSrc,
            cardActions: {
              primary: { label: "开始使用", sendText: "我已经准备好了，请开始吧。" },
              secondary: { label: "换一个推荐", preset: "more_recommend" as const },
            },
          })
          const botResponse: Message = {
            id: `bot-${Date.now()}`,
            senderId: conversation.user.id,
            content: `<<<RENDER_GENERIC_CARD>>>:${cardData}`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            createdAt: Date.now(),
          }
          setEducationMessages((prev) => [...prev, botResponse])
          scrollRef.current?.scrollIntoView({ behavior: "smooth" })
          return
        }
        const isHosp = activeApp === "hospital"
        const cardData = JSON.stringify({
          title: isHosp ? "医院助手欢迎您" : "教育助手欢迎您",
          description: isHosp
            ? "我是您的专属医院场景 AI 助手，可协助患者、排班、医疗耗材与床位管理。可直接点击下方二级功能发起办理。"
            : "我是您的专属教育 AI 助手，可协助商品、成员与财务等事务。可直接点击下方二级功能发起办理。",
          detail: isHosp
            ? "推荐：打开「患者管理」「排班管理」等下级菜单发起具体流程。"
            : "推荐：打开「商品管理」「成员管理」等下级菜单发起具体流程。",
          imageSrc: isHosp ? meetingIcon : educationIcon,
          cardActions: {
            primary: { label: "开始使用", sendText: "我已经准备好了，请开始吧。" },
            secondary: { label: "换一个推荐", preset: "more_recommend" as const },
          },
        });
        const botResponse: Message = {
          id: `bot-${Date.now()}`,
          senderId: conversation.user.id,
          content: `<<<RENDER_GENERIC_CARD>>>:${cardData}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          createdAt: Date.now()
        }
        setEducationMessages(prev => [...prev, botResponse])
        if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: "smooth" })
      }, 600)
      return;
    }

    const updatedMessages = [...coerceMessagesList(messages), newUserMessage]
    const rawLower = raw.toLowerCase()
    
    // Check for commands
    const isPersonalInfoCommand = PERSONAL_INFO_COMMANDS.some(cmd => 
      rawLower.includes(cmd.toLowerCase())
    )
    const isCreateEmailCommand = CREATE_EMAIL_COMMANDS.some(cmd => 
      rawLower.includes(cmd.toLowerCase())
    )
    const isCreateOrgCommand = CREATE_ORG_COMMANDS.some(cmd => 
      rawLower.includes(cmd.toLowerCase())
    )
    const isJoinOrgCommand = JOIN_ORG_COMMANDS.some(cmd => 
      rawLower.includes(cmd.toLowerCase())
    )
    const isSwitchOrgCommand = SWITCH_ORG_COMMANDS.some(cmd => 
      rawLower.includes(cmd.toLowerCase())
    )

    const commandMatched =
      isPersonalInfoCommand ||
      isCreateEmailCommand ||
      isCreateOrgCommand ||
      isJoinOrgCommand ||
      isSwitchOrgCommand

    if (isPersonalInfoCommand) {
      const botResponse: Message = attachDockCuiFollowUps(
        {
          id: `bot-${Date.now()}`,
          senderId: conversation.user.id,
          content: PERSONAL_INFO_MARKER,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          createdAt: Date.now(),
        },
        "个人信息与档案管理",
        conversation
      )
      setTimeout(() => {
        setMessages((prev) => [...prev, botResponse])
      }, 500)
    } else if (isCreateEmailCommand) {
      const botResponse: Message = attachDockCuiFollowUps(
        {
          id: `bot-${Date.now()}`,
          senderId: conversation.user.id,
          content: CREATE_EMAIL_MARKER,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          createdAt: Date.now(),
        },
        "企业邮箱创建",
        conversation
      )
      setTimeout(() => {
        setMessages((prev) => [...prev, botResponse])
      }, 500)
    } else if (isCreateOrgCommand) {
      const createMsg: Message = attachDockCuiFollowUps(
        {
          id: `org-create-${Date.now()}`,
          senderId: conversation.user.id,
          content: CREATE_ORG_FORM_MARKER,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          createdAt: Date.now(),
          isAfterPrompt: true,
        },
        "创建组织",
        conversation
      )

      setTimeout(() => {
        setMessages((prev) => [...prev, createMsg])
      }, 500)
    } else if (isJoinOrgCommand) {
      const joinMsg: Message = attachDockCuiFollowUps(
        {
          id: `org-join-${Date.now()}`,
          senderId: conversation.user.id,
          content: JOIN_ORG_FORM_MARKER,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          createdAt: Date.now(),
          isAfterPrompt: true,
        },
        "加入组织",
        conversation
      )

      setTimeout(() => {
        setMessages((prev) => [...prev, joinMsg])
      }, 500)
    } else if (isSwitchOrgCommand) {
      const switchMsg: Message = attachDockCuiFollowUps(
        {
          id: `org-switcher-${Date.now()}`,
          senderId: conversation.user.id,
          content: ORG_SWITCHER_MARKER,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          createdAt: Date.now(),
          isAfterPrompt: true,
        },
        "切换组织",
        conversation
      )

      setTimeout(() => {
        setMessages((prev) => [...prev, switchMsg])
      }, 500)
    }

    if (raw === "创建教育空间" && !commandMatched) {
      const orgName = latestEduCreateOrgSuccessOrgName(coerceMessagesList(messages))
      const fullEdu = shouldOfferFullEducationSpaceCreateFlow(
        scenario,
        hasJoinedOrganizations,
        coerceMessagesList(messages),
        coerceMessagesList(messages)
      )
      if (fullEdu || orgName) {
        setMessages(updatedMessages)
        setInputValue("")
        setTimeout(() => {
          const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          setMessages((prev) => [
            ...prev,
            {
              id: `edu-space-type-${Date.now()}`,
              senderId: conversation.user.id,
              content: `${EDU_SPACE_TYPE_SELECT_MARKER}:${JSON.stringify({ orgName: orgName ?? undefined })}`,
              timestamp: ts,
              createdAt: Date.now(),
              isAfterPrompt: true,
            },
          ])
          scrollRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 420)
        return
      }
    }

    if (!commandMatched && (raw === "创建机构教育空间" || raw === "创建家庭教育空间")) {
      if (raw === "创建机构教育空间" && organizations.length === 0) {
        setMessages(updatedMessages)
        setInputValue("")
        setTimeout(() => {
          const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          setMessages((prev) => [
            ...prev,
            {
              id: `edu-inst-blocked-${Date.now()}`,
              senderId: conversation.user.id,
              content: EDU_SPACE_INST_BLOCKED_MARKER,
              timestamp: ts,
              createdAt: Date.now(),
              isAfterPrompt: true,
            },
          ])
          scrollRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 420)
        return
      }
      if (
        shouldOfferFullEducationSpaceCreateFlow(
          scenario,
          hasJoinedOrganizations,
          coerceMessagesList(messages),
          coerceMessagesList(messages)
        )
      ) {
        setMessages(updatedMessages)
        setInputValue("")
        setTimeout(() => {
          const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          const isInst = raw === "创建机构教育空间"
          const content = isInst ? EDU_SPACE_INST_FORM_MARKER : EDU_SPACE_FAMILY_ROLE_MARKER
          setMessages((prev) => [
            ...prev,
            {
              id: `edu-space-flow-${Date.now()}`,
              senderId: conversation.user.id,
              content,
              timestamp: ts,
              createdAt: Date.now(),
              isAfterPrompt: true,
            },
          ])
          scrollRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 420)
        return
      }
    }

    setMessages(updatedMessages)
    setInputValue("")

    /**
     * 「查看今日日程 / 查询今日日程 …」须先于主 VVAI 的 `matchMainAgentIntent`：
     * 后者含关键词「日程」，否则会误出承接卡片而非 vv「今日日程」卡（与日历 dock 二级一致）。
     */
    if (!secondaryPortalOpen && !commandMatched) {
      const calDock =
        isDockConversationId(conversation.id) && getConversationDockAppId(conversation) === "calendar"
      if (!calDock && isTodayScheduleAgendaQuery(raw)) {
        setTimeout(() => {
          runVvGeneralSend(raw, vvContext, setMessages, conversation.user.id, vvFlow, setVvFlow, {
            scheduleBridge: vvScheduleBridge,
            scheduleCalendarPrefsBridge,
            omitUserBubble: true,
          })
          mirrorTodayAgendaBootstrap(raw)
          scrollRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 380)
        return
      }
    }

    const isMainAgentThread =
      !secondaryPortalOpen &&
      conversation.dockAppId == null &&
      !isDockConversationId(conversation.id)
    /** 底部任意应用 dock 会话（与主 VVAI 并列的《主CUI交互》对话列）；不含教育/医院门户内嵌区 */
    const isDockAppChatThread =
      !secondaryPortalOpen &&
      !commandMatched &&
      (isDockConversationId(conversation.id) || conversation.dockAppId != null)
    /** 主 VVAI 或任意 dock：与「查看今日日程」一致，可出场景卡并镜像到考勤/任务等 */
    const isMainOrDockAssistantThread = isMainAgentThread || isDockAppChatThread

    /**
     * 场景二：教育 dock 内「查看考勤 / 查看员工 / 打开员工列表」须先于 `matchesEmployeeMgmtIntent`（教育 dock 在
     * `EMPLOYEE_MGMT_CARD_APP_IDS` 中，否则会被内嵌员工卡抢先）。
     */
    if (
      !commandMatched &&
      (isSingleOrgEduAttendanceScenarioFlow(scenario) || isNoOrgRoute) &&
      onIntentDockHandoffRef.current &&
      isDockAppChatThread &&
      getConversationDockAppId(conversation) === "education"
    ) {
      const schoolDockEduEarly =
        matchSchoolScenarioEducationDockAttendanceGuidance(raw) ??
        matchSchoolScenarioEducationDockEmployeeGuidance(raw)
      if (schoolDockEduEarly) {
        const dockGuidanceOrgIdEarly =
          conversationDockOrgIdForSessionInteraction(conversation) ?? currentOrgRef.current
        setTimeout(() => {
          const card: Message = {
            id: `school-scene-dock-guidance-${Date.now()}`,
            senderId: "ai-assistant",
            content: `${SCHOOL_SCENE_APP_GUIDANCE_MARKER}:${JSON.stringify(schoolDockEduEarly)}`,
            timestamp: new Date().toLocaleTimeString("zh-CN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),
            createdAt: Date.now(),
            cardAttributionOrgId: dockGuidanceOrgIdEarly,
            cardAttributionDockAppId: schoolDockEduEarly.targetAppId,
          }
          setMessages((prev) => [...prev, card])
          scrollRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 460)
        return
      }
    }

    /** 「员工管理」等：主 VVAI 与可嵌入卡片的 dock 出卡；「员工」应用内仅追加助手气泡（与日历样板一致） */
    if (!commandMatched && matchesEmployeeMgmtIntent(raw)) {
      const empDock = getConversationDockAppId(conversation)
      const inEmployeeCardSurfaceDock =
        isDockAppChatThread && empDock != null && EMPLOYEE_MGMT_CARD_APP_IDS.has(empDock)
      if (isMainAgentThread || inEmployeeCardSurfaceDock || empDock === "employee") {
        setTimeout(() => {
          const ts = new Date().toLocaleTimeString("zh-CN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
          const now = Date.now()
          const follow = employeeMgmtOrgSwitchFollowUpFields(organizations, currentOrgRef.current)
          const empOrgId = currentOrgRef.current
          const botMsg: Message = {
            id: `bot-emp-mgmt-${now}`,
            senderId: conversation.user.id,
            content: EMPLOYEE_MGMT_MARKER,
            timestamp: ts,
            createdAt: now,
            cardAttributionOrgId: empOrgId,
            cardAttributionDockAppId: "employee",
            ...(follow ?? {}),
          }
          setMessages((prev) => [...prev, botMsg])
          if (empDock !== "employee") {
            mirrorEmployeeMgmtToEmployeeApp(raw)
          }
          scrollRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 400)
        return
      }
    }

    /** 场景二（多组织）：卡片下推荐「另一组织」— 点击后先切换顶栏主体再出同类型卡 */
    const scenarioTwoMultiAttendanceOtherOrgFollowUp = /^还可以针对「([^」]+)」查看考勤$/
    const scenarioTwoMultiEmployeeOtherOrgFollowUp = /^还可以针对「([^」]+)」查看员工$/
    const scenarioTwoMultiTaskTableOtherOrgFollowUp = /^还可以针对「([^」]+)」打开任务列表$/
    if (
      isScenarioFourOrMainEntry(scenario) &&
      isMainOrDockAssistantThread &&
      !commandMatched
    ) {
      const attendanceFollowMatch = raw.trim().match(scenarioTwoMultiAttendanceOtherOrgFollowUp)
      if (attendanceFollowMatch) {
        const targetName = attendanceFollowMatch[1]!.trim()
        const targetOrg = organizations.find((o) => o.name.trim() === targetName)
        if (targetOrg) {
          if (targetOrg.id !== currentOrg) {
            setCurrentOrg(targetOrg.id)
            setDialogueContentOrgScope(targetOrg.id)
          }
          const otherOrg = organizations.find((o) => o.id !== targetOrg.id)
          const nextFollowUps =
            otherOrg != null ? getScenarioTwoMultiAttendanceStripChipTexts() : undefined
          /** 场景二（多组织）跟进：仅出考勤工作台卡片，无文字引导 */
          setTimeout(() => {
            const ts = () =>
              new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false })
            const now = Date.now()
            const cardId = `scenario-two-attendance-${now + 1}`
            const payload = defaultScenarioTwoAttendanceOverviewPayload()
            const cardContent = `${SCENARIO_TWO_ATTENDANCE_OVERVIEW_MARKER}:${JSON.stringify(payload)}`
            const card: Message = {
              id: cardId,
              senderId: "ai-assistant",
              content: cardContent,
              timestamp: ts(),
              createdAt: now + 1,
              cuiFollowUpPrompts: nextFollowUps,
              cardAttributionOrgId: targetOrg.id,
              cardAttributionDockAppId: "attendance",
            }
            setMessages((prev) => [...prev, card])
            if (getConversationDockAppId(conversation) !== "attendance") {
              const userMirror: Message = {
                id: `mirror-attendance-u-${now}`,
                senderId: currentUser.id,
                content: raw.trim(),
                timestamp: ts(),
                createdAt: now,
              }
              const mirrorCard: Message = {
                ...card,
                id: toDockMirrorPeerMessageId(card.id),
              }
              onMirrorDockConversationRef.current?.({
                dockAppId: "attendance",
                orgId: targetOrg.id,
                hasJoinedOrganizations: organizations.length > 0,
                pairs: [],
                mirrorExtraMessages: [userMirror, mirrorCard],
              })
            }
            scrollRef.current?.scrollIntoView({ behavior: "smooth" })
          }, 460)
          return
        }
      }

      const employeeFollowMatch = raw.trim().match(scenarioTwoMultiEmployeeOtherOrgFollowUp)
      if (employeeFollowMatch) {
        const targetNameEmp = employeeFollowMatch[1]!.trim()
        const targetOrgEmp = organizations.find((o) => o.name.trim() === targetNameEmp)
        if (targetOrgEmp) {
          if (targetOrgEmp.id !== currentOrg) {
            setCurrentOrg(targetOrgEmp.id)
            setDialogueContentOrgScope(targetOrgEmp.id)
          }
          const empLoopFollow = employeeMgmtOrgSwitchFollowUpFields(organizations, targetOrgEmp.id)
          setTimeout(() => {
            const ts = new Date().toLocaleTimeString("zh-CN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
            const now = Date.now()
            const botMsgEmp: Message = {
              id: `bot-emp-mgmt-multi-${now}`,
              senderId: conversation.user.id,
              content: EMPLOYEE_MGMT_MARKER,
              timestamp: ts,
              createdAt: now,
              cardAttributionOrgId: targetOrgEmp.id,
              cardAttributionDockAppId: "employee",
              ...(empLoopFollow ?? {}),
            }
            setMessages((prev) => [...prev, botMsgEmp])
            scrollRef.current?.scrollIntoView({ behavior: "smooth" })
          }, 400)
          return
        }
      }

      const taskFollowMatch = raw.trim().match(scenarioTwoMultiTaskTableOtherOrgFollowUp)
      if (taskFollowMatch) {
        const targetNameTask = taskFollowMatch[1]!.trim()
        const targetOrgTask = organizations.find((o) => o.name.trim() === targetNameTask)
        if (targetOrgTask) {
          if (targetOrgTask.id !== currentOrg) {
            setCurrentOrg(targetOrgTask.id)
            setDialogueContentOrgScope(targetOrgTask.id)
          }
          setTimeout(() => {
            const ts = new Date().toLocaleTimeString("zh-CN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
            const now = Date.now()
            const taskTableOrgId = targetOrgTask.id
            const cardContent = `${TASK_TABLE_MARKER}:${JSON.stringify({ filterHint: "全部任务" })}`
            const botMsg: Message = {
              id: `scenario-task-table-${now}`,
              senderId: "ai-assistant",
              content: cardContent,
              timestamp: ts,
              createdAt: now,
              cardAttributionOrgId: taskTableOrgId,
              cardAttributionDockAppId: "work_task",
            }
            setMessages((prev) => [...prev, botMsg])
            if (getConversationDockAppId(conversation) !== "work_task") {
              const userMirror: Message = {
                id: `mirror-work-task-u-${now}`,
                senderId: currentUser.id,
                content: raw.trim(),
                timestamp: ts,
                createdAt: now,
              }
              const mirrorTable: Message = {
                ...botMsg,
                id: toDockMirrorPeerMessageId(botMsg.id),
              }
              onMirrorDockConversationRef.current?.({
                dockAppId: "work_task",
                orgId: taskTableOrgId,
                hasJoinedOrganizations: organizations.length > 0,
                pairs: [],
                mirrorExtraMessages: [userMirror, mirrorTable],
              })
            }
            scrollRef.current?.scrollIntoView({ behavior: "smooth" })
          }, 460)
          return
        }
      }
    }

    if (
      (isScenarioTwoFamily(scenario) || isMainEntryScenario(scenario) || isNoOrgRoute) &&
      isMainOrDockAssistantThread &&
      !commandMatched &&
      matchesScenarioTwoViewAttendanceIntent(raw)
    ) {
      const attendanceOrgId = currentOrg
      const otherOrgForAttendance = organizations.find((o) => o.id !== attendanceOrgId)
      const attendanceFollowUps =
        isScenarioTwoMultiOrgs(scenario) && otherOrgForAttendance != null
          ? getScenarioTwoMultiAttendanceStripChipTexts()
          : undefined
      setTimeout(() => {
        const ts = () =>
          new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false })
        const now = Date.now()
        const cardId = `scenario-two-attendance-${now + 1}`
        const payload = defaultScenarioTwoAttendanceOverviewPayload()
        const cardContent = `${SCENARIO_TWO_ATTENDANCE_OVERVIEW_MARKER}:${JSON.stringify(payload)}`
        const card: Message = {
          id: cardId,
          senderId: "ai-assistant",
          content: cardContent,
          timestamp: ts(),
          createdAt: now + 1,
          cuiFollowUpPrompts: attendanceFollowUps,
          cardAttributionOrgId: attendanceOrgId,
          cardAttributionDockAppId: "attendance",
        }
        setMessages((prev) => [...prev, card])
        if (getConversationDockAppId(conversation) !== "attendance") {
          const userMirror: Message = {
            id: `mirror-attendance-u-${now}`,
            senderId: currentUser.id,
            content: raw.trim(),
            timestamp: ts(),
            createdAt: now,
          }
          const mirrorCard: Message = {
            ...card,
            id: toDockMirrorPeerMessageId(card.id),
          }
          onMirrorDockConversationRef.current?.({
            dockAppId: "attendance",
            orgId: attendanceOrgId,
            hasJoinedOrganizations: organizations.length > 0,
            pairs: [],
            mirrorExtraMessages: [userMirror, mirrorCard],
          })
        }
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 460)
      return
    }

    if (
      (isScenarioTwoFamily(scenario) || isMainEntryScenario(scenario) || isNoOrgRoute) &&
      isMainOrDockAssistantThread &&
      !commandMatched
    ) {
      const t = raw.trim()
      if (t === "补卡申请" || t === "请假申请") {
        const kind = t === "补卡申请" ? "makeup" : "leave"
        setTimeout(() => {
          const ts = () =>
            new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false })
          const now = Date.now()
          const payload = defaultScenarioTwoAttendanceSupplementPayload(kind)
          const content = `${SCENARIO_TWO_ATTENDANCE_SUPPLEMENT_MARKER}:${JSON.stringify(payload)}`
          const supplementOrgId = currentOrgRef.current
          const botMsg: Message = {
            id: `scenario-two-att-supplement-${now}`,
            senderId: "ai-assistant",
            content,
            timestamp: ts(),
            createdAt: now,
            cardAttributionOrgId: supplementOrgId,
            cardAttributionDockAppId: "attendance",
          }
          setMessages((prev) => [...prev, botMsg])
          const orgId = supplementOrgId
          const userMirror: Message = {
            id: `mirror-att-sup-u-${now}`,
            senderId: currentUser.id,
            content: t,
            timestamp: ts(),
            createdAt: now,
          }
          const mirrorCard: Message = {
            ...botMsg,
            id: toDockMirrorPeerMessageId(botMsg.id),
          }
          if (getConversationDockAppId(conversation) !== "attendance") {
            onMirrorDockConversationRef.current?.({
              dockAppId: "attendance",
              orgId,
              hasJoinedOrganizations: organizations.length > 0,
              pairs: [],
              mirrorExtraMessages: [userMirror, mirrorCard],
            })
          }
          scrollRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 420)
        return
      }
    }

    if (
      (isSingleOrgEduAttendanceScenarioFlow(scenario) ||
        isMainEntryScenario(scenario) ||
        isNoOrgRoute) &&
      !commandMatched &&
      !secondaryPortalOpen
    ) {
      if (raw.trim() === "打开任务列表" && isMainOrDockAssistantThread) {
        setTimeout(() => {
          const ts = new Date().toLocaleTimeString("zh-CN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
          const now = Date.now()
          const taskTableOrgId = currentOrgRef.current
          const cardContent = `${TASK_TABLE_MARKER}:${JSON.stringify({ filterHint: "全部任务" })}`
          const botMsg: Message = {
            id: `scenario-task-table-${now}`,
            senderId: "ai-assistant",
            content: cardContent,
            timestamp: ts,
            createdAt: now,
            cardAttributionOrgId: taskTableOrgId,
            cardAttributionDockAppId: "work_task",
          }
          setMessages((prev) => [...prev, botMsg])
          if (getConversationDockAppId(conversation) !== "work_task") {
            const userMirror: Message = {
              id: `mirror-work-task-u-${now}`,
              senderId: currentUser.id,
              content: "打开任务列表",
              timestamp: ts,
              createdAt: now,
            }
            const mirrorTable: Message = {
              ...botMsg,
              id: toDockMirrorPeerMessageId(botMsg.id),
            }
            onMirrorDockConversationRef.current?.({
              dockAppId: "work_task",
              orgId: taskTableOrgId,
              hasJoinedOrganizations: organizations.length > 0,
              pairs: [],
              mirrorExtraMessages: [userMirror, mirrorTable],
            })
          }
          scrollRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 460)
        return
      }
      if (isMainAgentThread) {
        const schoolG = matchSchoolScenarioMainCuiGuidance(raw)
        if (schoolG) {
          const rawTrim = raw.trim()
          const otherOrgForSchoolMulti =
            isScenarioTwoMultiOrgs(scenario) && organizations.length > 1
              ? organizations.find((o) => o.id !== currentOrg)
              : undefined
          const schoolMultiFollowUps =
            otherOrgForSchoolMulti != null &&
            (rawTrim === "查看考勤" || rawTrim === "查看A老师的考勤")
              ? [`还可以针对「${otherOrgForSchoolMulti.name.trim()}」查看考勤`]
              : otherOrgForSchoolMulti != null &&
                  (rawTrim === "查看员工" || rawTrim === "打开员工列表")
                ? [`还可以针对「${otherOrgForSchoolMulti.name.trim()}」查看员工`]
                : undefined
          setTimeout(() => {
            const card: Message = {
              id: `school-scene-guidance-${Date.now()}`,
              senderId: "ai-assistant",
              content: `${SCHOOL_SCENE_APP_GUIDANCE_MARKER}:${JSON.stringify(schoolG)}`,
              timestamp: new Date().toLocaleTimeString("zh-CN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }),
              createdAt: Date.now(),
              cardAttributionOrgId: currentOrg,
              cardAttributionDockAppId: schoolG.targetAppId,
              ...(schoolMultiFollowUps ? { cuiFollowUpPrompts: schoolMultiFollowUps } : {}),
            }
            setMessages((prev) => [...prev, card])
            scrollRef.current?.scrollIntoView({ behavior: "smooth" })
          }, 460)
          return
        }
      }
    }

    if (isCuiCardRulesScenario(scenario) && isMainAgentThread && !commandMatched) {
      const hit = matchCuiCardRulesDemo(raw)
      const delay = 440
      const tsNow = () =>
        new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false })
      const withFollow = (partial: Omit<Message, "timestamp" | "createdAt">): Message => ({
        ...partial,
        timestamp: tsNow(),
        createdAt: Date.now(),
        cuiFollowUpPrompts: demoFollowUpPrompts(),
      })
      if (hit.kind === "meeting_edit") {
        setTimeout(() => {
          const row = createMeetingCardMessage("edit")
          setMessages((prev) => [
            ...prev,
            withFollow({
              id: row.id,
              senderId: conversation.user.id,
              content: row.content,
            }),
          ])
          scrollRef.current?.scrollIntoView({ behavior: "smooth" })
        }, delay)
      } else if (hit.kind === "meeting_create") {
        setTimeout(() => {
          const row = createMeetingCardMessage("create")
          setMessages((prev) => [
            ...prev,
            withFollow({
              id: row.id,
              senderId: conversation.user.id,
              content: row.content,
            }),
          ])
          scrollRef.current?.scrollIntoView({ behavior: "smooth" })
        }, delay)
      } else if (hit.kind === "meeting_ui") {
        setTimeout(() => {
          const payload = buildMeetingPayloadWithUi({
            datePickerOpen: hit.datePickerOpen,
            contactsPopoverOpen: hit.contactsPopoverOpen,
            confirmBeforeSave: hit.confirmBeforeSave,
          })
          setMessages((prev) => [
            ...prev,
            withFollow({
              id: `cui-schedule-ui-${Date.now()}`,
              senderId: conversation.user.id,
              content: serializeCuiRulesPayload(payload),
            }),
          ])
          scrollRef.current?.scrollIntoView({ behavior: "smooth" })
        }, delay)
      } else {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            withFollow({
              id: `cui-nl-${Date.now()}`,
              senderId: "ai-assistant",
              content: hit.content,
            }),
          ])
          scrollRef.current?.scrollIntoView({ behavior: "smooth" })
        }, delay)
      }
      return
    }

    if (isMainAgentThread && !commandMatched) {
      const intentMatch = matchMainAgentIntent(raw)
      if (intentMatch) {
        if (isScenarioTwoFamily(scenario) || isNoOrgRoute) {
          const bundle = buildScenarioTwoMainThreadDockBundle(
            raw,
            intentMatch.appId,
            conversation,
            currentOrgRef.current
          )
          setTimeout(() => {
            setMessages((prev) => [...prev, ...bundle.mainMessages])
            onMirrorDockConversationRef.current?.({
              dockAppId: bundle.mirrorDockAppId,
              orgId: currentOrgRef.current,
              hasJoinedOrganizations: organizations.length > 0,
              pairs: bundle.mirrorPairs,
              mirrorExtraMessages: bundle.mirrorExtras,
            })
            scrollRef.current?.scrollIntoView({ behavior: "smooth" })
          }, 520)
          return
        }
        if (onIntentDockHandoff) {
          setTimeout(() => {
            const payload = JSON.stringify({
              appId: intentMatch.appId,
              appName: intentMatch.appName,
              intentLabel: intentMatch.intentLabel,
              cardTitle: intentMatch.cardTitle,
              confirmLine: intentMatch.confirmLine,
              handoffLine: intentMatch.handoffLine,
              carryOverText: intentMatch.carryOverText,
            })
            const botCard: Message = attachDockCuiFollowUps(
              {
                id: `intent-handoff-${Date.now()}`,
                senderId: conversation.user.id,
                content: `${INTENT_HANDOFF_MARKER}:${payload}`,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                createdAt: Date.now(),
                cardAttributionOrgId: currentOrgRef.current,
                cardAttributionDockAppId: intentMatch.appId,
              },
              `${intentMatch.appName}：${intentMatch.intentLabel}`,
              conversation,
              { appId: intentMatch.appId, matchedPhrase: intentMatch.intentLabel }
            )
            setMessages((prev) => [...prev, botCard])
            if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: "smooth" })
          }, 520)
          return
        }
      } else if (isScenarioTwoFamily(scenario) || isNoOrgRoute) {
        const bundle = buildScenarioTwoMainThreadDockBundle(
          raw,
          "education",
          conversation,
          currentOrgRef.current
        )
        setTimeout(() => {
          setMessages((prev) => [...prev, ...bundle.mainMessages])
          onMirrorDockConversationRef.current?.({
            dockAppId: bundle.mirrorDockAppId,
            orgId: currentOrgRef.current,
            hasJoinedOrganizations: organizations.length > 0,
            pairs: bundle.mirrorPairs,
            mirrorExtraMessages: bundle.mirrorExtras,
          })
          scrollRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 520)
        return
      }
    }

    const isDockSession = isDockConversationId(conversation.id)
    if (isDockSession && !commandMatched) {
      const dockIdEarly = getConversationDockAppId(conversation)
      if (dockIdEarly === "employee") {
        if (matchesScheduleToolbarQuickIntent(raw)) {
          setTimeout(() => {
            runVvGeneralSend(raw, vvContext, setMessages, conversation.user.id, vvFlow, setVvFlow, {
              scheduleBridge: vvScheduleBridge,
              scheduleCalendarPrefsBridge,
              omitUserBubble: true,
            })
            scrollRef.current?.scrollIntoView({ behavior: "smooth" })
          }, 380)
          return
        }
        setTimeout(() => {
          const ts = new Date().toLocaleTimeString("zh-CN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
          const botMsg: Message = {
            id: `bot-emp-dock-${Date.now()}`,
            senderId: conversation.user.id,
            content: `${getDockAppMeta("employee").name} 功能对话已同步，后续菜单我可以继续接入。`,
            timestamp: ts,
            createdAt: Date.now(),
          }
          setMessages((prev) => [...prev, botMsg])
          scrollRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 400)
        return
      }

      const teachingGradeFlow =
        isTeachingDockConversation(conversation) && matchTeachingStudentGradeQuery(raw)
      if (teachingGradeFlow) {
        const extracted = extractStudentNameFromGradeQuery(raw)
        const displayName = extracted ?? "该学生"
        const gradePayload = buildMockTeachingGradePayload(displayName)
        const gradeFlowNow = Date.now()
        setTimeout(() => {
          const cmdMsg: Message = {
            id: `teaching-grade-cmd-${gradeFlowNow}`,
            senderId: conversation.user.id,
            content: `【业务指令】我要查看学生「${displayName}」的成绩与学业概况。`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            createdAt: gradeFlowNow,
          }
          setMessages((prev) => [...prev, cmdMsg])
          if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }, 380)
        setTimeout(() => {
            const teachingOrgId =
              conversationDockOrgIdForSessionInteraction(conversation) ?? currentOrgRef.current
            const cardMsg: Message = attachDockCuiFollowUps(
              {
                id: `teaching-grade-card-${gradeFlowNow + 1}`,
                senderId: conversation.user.id,
                content: `${TEACHING_STUDENT_GRADE_MARKER}:${JSON.stringify(gradePayload)}`,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                createdAt: gradeFlowNow + 1,
                cardAttributionOrgId: teachingOrgId,
                cardAttributionDockAppId: "teaching",
              },
              `学生「${displayName}」成绩与学业概况`,
              conversation,
              { appId: "teaching", matchedPhrase: `查询「${displayName}」成绩` }
            )
            setMessages((prev) => [...prev, cardMsg])
            if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: "smooth" })
          }, 680)
      } else {
        /** 非业务自然语言：与全局业务指令、vv 结构化编排均无关 → 当前应用内通用说明，并同步主 VVAI 时间线 */
        const dockAppIdForNl = getConversationDockAppId(conversation)
        const isNonBusinessNlDockTurn =
          Boolean(dockAppIdForNl) &&
          !hasAnyGlobalDockBusinessIntent(raw) &&
          planIsDemoCatalogFallback(raw, vvContext, vvFlow)
        if (isNonBusinessNlDockTurn) {
          const appLabel = dockAppIdForNl ? getDockAppMeta(dockAppIdForNl, scenario).name : "应用"
          const assistantBody = buildDockNonBusinessNlAssistantBody(raw, appLabel)
          setTimeout(() => {
            const ts = new Date().toLocaleTimeString("zh-CN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
            const now = Date.now()
            const botMsg: Message = {
              id: `dock-nb-nl-${now}`,
              senderId: conversation.user.id,
              content: assistantBody,
              timestamp: ts,
              createdAt: now,
            }
            setMessages((prev) => [...prev, botMsg])
            onAppendMainVvaiNonBusinessMirrorRef.current?.({
              userText: raw,
              assistantText: assistantBody,
              sourceAppName: appLabel,
            })
            scrollRef.current?.scrollIntoView({ behavior: "smooth" })
          }, 380)
          return
        }

        /** 各 dock 应用会话：与「日历」一致统一走《VV 助手》编排（scheduleBridge、日历偏好与主列一致） */
        setTimeout(() => {
          runVvGeneralSend(raw, vvContext, setMessages, conversation.user.id, vvFlow, setVvFlow, {
            scheduleBridge: vvScheduleBridge,
            scheduleCalendarPrefsBridge,
            omitUserBubble: true,
          })
          scrollRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 380)
        return
      }
    }
  }

  handleSendMessageRef.current = handleSendMessage

  const handleCalendarDockVvAction = React.useMemo(
    () =>
      createCalendarDockVvActionHandler({
        aiSenderId: conversation.user.id,
        vvContext,
        vvFlow,
        vvScheduleItems,
        vvMeetingItems,
        vvRecordItems,
        vvTodoItems,
        vvMailItems,
        vvDriveItems,
        vvDocItems,
        setVvFlow,
        setVvScheduleItems,
        setVvMeetingItems,
        setVvTodoItems,
        vvScheduleBridge,
        setMessages: setActiveTranscriptMessages,
        appendToActiveConversation: appendToActiveConversationWithCalendarMirror,
        openScheduleSideSheet,
        scheduleSideThreadBridgeRef,
        handleSendMessage,
        scheduleCalendarPrefsBridge,
        mirrorCalendarVvRound: mirrorCalendarRelatedVvRound,
        vvGuiThenDepthRef,
        scheduleCalendarPrefsBridgeRef,
        calendarTypesBridgeRef,
        subscribedColleagueBridgeRef,
      }),
    [
      appendToActiveConversationWithCalendarMirror,
      conversation.user.id,
      handleSendMessage,
      mirrorCalendarRelatedVvRound,
      setActiveTranscriptMessages,
      scheduleCalendarPrefsBridge,
      vvContext,
      vvFlow,
      vvScheduleItems,
      vvMeetingItems,
      vvRecordItems,
      vvTodoItems,
      vvMailItems,
      vvDriveItems,
      vvDocItems,
      vvScheduleBridge,
      openScheduleSideSheet,
    ]
  )

  const handleEmailFormSubmit = (msgId: string, data: any) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, isReadonly: true, formData: data } : m))
    
    setTimeout(() => {
      const successMsg: Message = attachDockCuiFollowUps(
        {
          id: `bot-success-${Date.now()}`,
          senderId: conversation.user.id,
          content: `业务邮箱 ${data.emailPrefix}${data.domain} 创建成功，并已分配给 ${data.members.join("、")}。`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          createdAt: Date.now(),
          isAfterPrompt: true,
        },
        `业务邮箱 ${data.emailPrefix}${data.domain} 创建成功`,
        conversation
      )
      const continueMsg: Message = {
        id: `bot-continue-${Date.now()+1}`,
        senderId: conversation.user.id,
        content: CONTINUE_EMAIL_MARKER,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: Date.now() + 1
      }
      setMessages(prev => [...prev, successMsg, continueMsg])
    }, 600)
  }

  const handleContinueCreateEmail = () => {
    const newFormMsg: Message = {
      id: `bot-${Date.now()}`,
      senderId: conversation.user.id,
      content: CREATE_EMAIL_MARKER,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now(),
      isAfterPrompt: true
    }
    setMessages(prev => [...prev, newFormMsg])
  }

  // Organization handlers
  const handleOrgClick = () => {
    const orgSwitcherMsg: Message = {
      id: `org-switcher-${Date.now()}`,
      senderId: conversation.user.id,
      content: ORG_SWITCHER_MARKER,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now(),
      isAfterPrompt: false
    };
    
    setEducationMessages(prev => [...prev, orgSwitcherMsg]);
    
    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleOrgSwitch = (orgId: string) => {
    const selectedOrg = organizations.find(o => o.id === orgId);
    if (!selectedOrg) return;
    
    setCurrentOrg(orgId)
    if (isScenarioFourOrMainEntry(scenario)) {
      setDialogueContentOrgScope(orgId)
    }
  };

  const resolvedOrgNameForEmployeeStrip = React.useMemo(
    () => organizations.find((o) => o.id === currentOrg)?.name ?? "当前组织",
    [organizations, currentOrg]
  )

  const handleMainAiEmployeeCardSwitchOrg = React.useCallback(
    (targetOrgId: string) => {
      if (targetOrgId === currentOrg) return
      if (!organizations.some((o) => o.id === targetOrgId)) return
      setCurrentOrg(targetOrgId)
      if (isScenarioFourOrMainEntry(scenario)) {
        setDialogueContentOrgScope(targetOrgId)
      }
      const ts = Date.now()
      const timeStr = new Date().toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      const userText = "员工管理"
      const userMsg: Message = {
        id: `main-emp-org-sw-u-${ts}`,
        senderId: currentUser.id,
        content: userText,
        timestamp: timeStr,
        createdAt: ts,
      }
      const follow = employeeMgmtOrgSwitchFollowUpFields(organizations, targetOrgId)
      const botMsg: Message = {
        id: `main-emp-org-sw-b-${ts}`,
        senderId: conversation.user.id,
        content: EMPLOYEE_MGMT_MARKER,
        timestamp: timeStr,
        createdAt: ts,
        cardAttributionOrgId: targetOrgId,
        cardAttributionDockAppId: "employee",
        ...(follow ?? {}),
      }
      window.queueMicrotask(() => {
        if (secondaryPortalOpen) {
          setEducationMessages((prev) => [...prev, userMsg, botMsg])
        } else {
          setMessages((prev) => [...prev, userMsg, botMsg])
        }
        onMirrorDockConversationRef.current?.({
          dockAppId: "employee",
          orgId: targetOrgId,
          hasJoinedOrganizations: organizations.length > 0,
          pairs: [],
          mirrorExtraMessages: [
            { ...userMsg, id: toDockMirrorPeerMessageId(userMsg.id) },
            {
              ...botMsg,
              id: toDockMirrorPeerMessageId(botMsg.id),
              cuiFollowUpPrompts: undefined,
              cuiFollowUpSendTexts: undefined,
            },
          ],
        })
        window.requestAnimationFrame(() => {
          scrollRef.current?.scrollIntoView({ behavior: "smooth" })
        })
      })
    },
    [
      conversation.user.id,
      currentOrg,
      organizations,
      scenario,
      secondaryPortalOpen,
      setEducationMessages,
      setMessages,
    ]
  )

  employeeOrgSwitchHandlerRef.current = handleMainAiEmployeeCardSwitchOrg

  /** 顶栏组织：主 VVAI / 个人应用仅改信息筛选；组织型应用切换即换主体与会话 */
  const handleNavBarOrgSelect = React.useCallback(
    (orgId: string) => {
      if (isNavContentScopeMode) {
        if (!organizations.some((o) => o.id === orgId)) return
        setDialogueContentOrgScope(orgId)
        return
      }
      const selectedOrg = organizations.find((o) => o.id === orgId)
      if (!selectedOrg) return
      setCurrentOrg(orgId)
      if (isScenarioFourOrMainEntry(scenario)) {
        setDialogueContentOrgScope(orgId)
      }
    },
    [isNavContentScopeMode, organizations, scenario]
  )

  const handleCreateOrg = () => {
    const createMsg: Message = {
      id: `org-create-${Date.now()}`,
      senderId: conversation.user.id,
      content: CREATE_ORG_FORM_MARKER,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now(),
      isAfterPrompt: true
    };
    
    if (secondaryPortalOpen) {
      setEducationMessages(prev => [...prev, createMsg]);
    } else {
      setMessages(prev => [...prev, createMsg]);
    }
  };

  const handleJoinOrg = () => {
    const joinMsg: Message = {
      id: `org-join-${Date.now()}`,
      senderId: conversation.user.id,
      content: JOIN_ORG_FORM_MARKER,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now(),
      isAfterPrompt: true
    };
    
    if (secondaryPortalOpen) {
      setEducationMessages(prev => [...prev, joinMsg]);
    } else {
      setMessages(prev => [...prev, joinMsg]);
    }
  };

  const handleModelSwitch = (modelId: string) => {
    const selectedModel = AVAILABLE_MODELS.find(m => m.id === modelId);
    if (!selectedModel) return;
    
    setCurrentModel(modelId);
    
    console.log(`已切换到模型：${selectedModel.name}`);
  };

  /** 主会话区向下滚动时收起顶部《PinnedTaskCard》（主 VVAI、个人应用、教育/医院门户等共用该区域） */
  const handleChatScroll = React.useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      if (
        isMainCuiStandaloneWindow &&
        conversation.id === cuiMainChatId &&
        messages.length === 0
      ) {
        return;
      }
      const currentTop = event.currentTarget.scrollTop;
      if (!isPinnedTaskExpanded) {
        lastChatScrollTopRef.current = currentTop;
        return;
      }

      const delta = currentTop - lastChatScrollTopRef.current;
      const isScrollingDown = delta > 0;

      if (
        pinnedTaskAllowScrollCollapseRef.current &&
        isScrollingDown &&
        currentTop > 48
      ) {
        setIsPinnedTaskExpanded(false);
      }

      lastChatScrollTopRef.current = currentTop;
    },
    [
      isMainCuiStandaloneWindow,
      conversation.id,
      cuiMainChatId,
      messages.length,
      isPinnedTaskExpanded,
    ]
  );

  React.useLayoutEffect(() => {
    const root = chatScrollContainerRef.current;
    if (!root) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 0.5) pinnedTaskAllowScrollCollapseRef.current = true;
    };

    let touchStartY: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchStartY == null || !e.touches[0]) return;
      const y = e.touches[0].clientY;
      if (touchStartY - y > 8) pinnedTaskAllowScrollCollapseRef.current = true;
    };
    const onTouchEnd = () => {
      touchStartY = null;
    };

    root.addEventListener("wheel", onWheel, { passive: true });
    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchmove", onTouchMove, { passive: true });
    root.addEventListener("touchend", onTouchEnd, { passive: true });
    root.addEventListener("touchcancel", onTouchEnd, { passive: true });
    return () => {
      root.removeEventListener("wheel", onWheel);
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("touchmove", onTouchMove);
      root.removeEventListener("touchend", onTouchEnd);
      root.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [conversation.id, mainChatSessionRevision, activeApp]);

  const handlePinnedTaskExpandedChange = React.useCallback((expanded: boolean) => {
    setIsPinnedTaskExpanded(expanded);
    if (expanded) pinnedTaskAllowScrollCollapseRef.current = false;
  }, []);

  const handleCreateOrgSubmit = (orgData: { 
    country: string;
    industry: string;
    fullName: string;
    shortName: string;
    logo?: File;
    address: string;
    email: string;
    phoneCode: string;
    phone: string;
    description: string;
  }, isEducationContext?: boolean) => {
    // 模拟创建新组织
    const newOrgId = `org-${Date.now()}`;
    
    const isEducationIndustry = orgData.industry.trim() === "教育行业"
    const newOrg: Organization = {
      id: newOrgId,
      name: orgData.shortName || orgData.fullName,
      icon: orgIcon,
      memberCount: 1,
      description: orgData.description || `${orgData.industry}企业，位于${orgData.country}`,
      kind: isEducationIndustry || isEducationContext ? "education" : "general",
    }

    setOrganizations((prev) => [...prev, newOrg])

    setCurrentOrg(newOrgId)

    const successData = JSON.stringify({
      orgId: newOrgId,
      orgName: orgData.shortName || orgData.fullName,
      fullName: orgData.fullName,
      country: orgData.country,
      industry: orgData.industry,
      address: orgData.address,
      email: orgData.email,
      phone: `${orgData.phoneCode} ${orgData.phone}`,
      description: orgData.description,
      memberCount: 1,
      isEducationIndustry,
    })
    
    const successMsg: Message = attachDockCuiFollowUps(
      {
        id: `org-create-success-${Date.now()}`,
        senderId: conversation.user.id,
        content: `${CREATE_ORG_SUCCESS_MARKER}:${successData}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        createdAt: Date.now(),
        isAfterPrompt: true,
      },
      `组织「${orgData.shortName || orgData.fullName}」创建成功`,
      conversation
    )

    if (isEducationContext) {
      setEducationMessages((prev) => [...prev, successMsg])
    } else {
      setMessages((prev) => [...prev, successMsg])
    }
    
    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleJoinOrgSubmit = (inviteCode: string, isEducationContext?: boolean) => {
    // 模拟邀请码验证
    const validCodes: Record<string, { orgId: string; orgName: string }> = {
      'XIAOCE2024': { orgId: 'xiaoce', orgName: '小测教育机构' },
      'DEFAULT001': { orgId: 'default', orgName: '默认组织' },
      'TEST123': { orgId: 'test', orgName: '测试机构' }
    };
    
    const matchedOrg = validCodes[inviteCode.toUpperCase()]

    if (matchedOrg) {
      const targetOrg =
        organizations.find((o) => o.id === matchedOrg.orgId) ??
        JOIN_INVITE_CODE_ORGANIZATIONS[matchedOrg.orgId]

      if (targetOrg) {
        const confirmData = JSON.stringify({
          orgId: targetOrg.id,
          orgName: targetOrg.name,
          orgIcon: targetOrg.icon,
          memberCount: targetOrg.memberCount,
          description: targetOrg.description,
        })

        const confirmMsg: Message = attachDockCuiFollowUps(
          {
            id: `org-join-confirm-${Date.now()}`,
            senderId: conversation.user.id,
            content: `${JOIN_ORG_CONFIRM_MARKER}:${confirmData}`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            createdAt: Date.now(),
            isAfterPrompt: true,
          },
          `加入组织「${targetOrg.name}」确认`,
          conversation
        )

        if (isEducationContext) {
          setEducationMessages((prev) => [...prev, confirmMsg])
        } else {
          setMessages((prev) => [...prev, confirmMsg])
        }
      } else {
        const errorMsg: Message = attachDockCuiFollowUps(
          {
            id: `org-join-error-${Date.now()}`,
            senderId: conversation.user.id,
            content: `邀请码「${inviteCode}」暂无法解析为可加入的组织，请更换邀请码或联系管理员。`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            createdAt: Date.now(),
            isAfterPrompt: true,
          },
          `邀请码校验未通过`,
          conversation
        )
        if (isEducationContext) {
          setEducationMessages((prev) => [...prev, errorMsg])
        } else {
          setMessages((prev) => [...prev, errorMsg])
        }
      }
    } else {
      // 邀请码无效
      const errorMsg: Message = attachDockCuiFollowUps(
        {
          id: `org-join-error-${Date.now()}`,
          senderId: conversation.user.id,
          content: `邀请码「${inviteCode}」无效或已过期，请检查后重试。您可以联系组织管理员获取有效的邀请码。`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          createdAt: Date.now(),
          isAfterPrompt: true,
        },
        `邀请码校验未通过`,
        conversation
      )

      if (isEducationContext) {
        setEducationMessages((prev) => [...prev, errorMsg])
      } else {
        setMessages((prev) => [...prev, errorMsg])
      }
    }
    
    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleConfirmJoinOrg = (orgId: string, isEducationContext?: boolean) => {
    const existing = organizations.find((o) => o.id === orgId)
    const invited = JOIN_INVITE_CODE_ORGANIZATIONS[orgId]
    const targetOrg = existing ?? invited
    if (!targetOrg) return

    if (!existing) {
      setOrganizations((prev) => (prev.some((o) => o.id === orgId) ? prev : [...prev, targetOrg]))
    }

    setCurrentOrg(orgId)
    
    // 显示加入成功消息
    const successMsg: Message = attachDockCuiFollowUps(
      {
        id: `org-join-success-${Date.now()}`,
        senderId: conversation.user.id,
        content: `欢迎加入「${targetOrg.name}」！您现在可以访问该组织的所有资源，并与 ${targetOrg.memberCount} 位成员协作。`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        createdAt: Date.now(),
        isAfterPrompt: true,
      },
      `已加入组织「${targetOrg.name}」`,
      conversation
    )

    if (isEducationContext) {
      setEducationMessages((prev) => [...prev, successMsg])
    } else {
      setMessages((prev) => [...prev, successMsg])
    }
    
    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleNewConversation = () => {
    if (onNewMainChat) {
      onNewMainChat()
      return
    }
    setMessages([])
  }

  const handleSecondaryAppNewConversation = () => {
    // Clear education messages for new conversation
    setEducationMessages([]);
    setSecondaryHistoryOpen(false);
  }

  const handleSecondarySessionSelect = (sessionId: string) => {
    setSelectedSecondarySession(sessionId);
    // Here you would load the messages for that session
    // For now, we'll just log it
    console.log('Selected secondary app session:', sessionId);
  }

  const handleJumpToConversationDay = React.useCallback(
    (conversationId: string, messageId: string) => {
      pendingDayJumpRef.current = { conversationId, messageId }
      if (conversationId !== selectedId) {
        applyPrimarySessionListSelection(conversationId)
      }
      setDayJumpNonce((n) => n + 1)
    },
    [selectedId, applyPrimarySessionListSelection]
  )

  /** 侧栏点选 VVAI 历史：恢复会话并切回主会话 id，便于列表与主区一致 */
  const handleSidebarMainHistorySelect = React.useCallback(
    (entryId: string) => {
      if (!onSelectMainChatHistoryEntry) return
      if (secondaryPortalOpen) {
        setActiveApp(null)
      }
      onSelectMainChatHistoryEntry(entryId)
      onSelect?.(cuiMainChatId)
    },
    [onSelectMainChatHistoryEntry, onSelect, cuiMainChatId, secondaryPortalOpen]
  )

  const renderMessageList = (messagesList: Message[], isEducationContext: boolean) => {
    const transcriptDockAppId: string | null = isEducationContext
      ? "education"
      : getConversationDockAppId(conversation)
    const canRenderEmployeeMgmtCard =
      transcriptDockAppId == null || EMPLOYEE_MGMT_CARD_APP_IDS.has(transcriptDockAppId)

    const renderDockFollowUpStrip = (m: Message) => {
      if (!m.cuiFollowUpPrompts?.length) return null
      return (
        <DockCuiFollowUpStrip
          prompts={m.cuiFollowUpPrompts}
          sendTexts={m.cuiFollowUpSendTexts}
          onSend={(text) => handleSendMessage(text)}
          className="mt-[var(--space-200)] w-full max-w-full"
        />
      )
    }

    const pushUserThenBot = (userLine: string, botContent: string) => {
      const stamp = () =>
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      const append = isEducationContext ? setEducationMessages : setMessages
      const uid = `cui-pair-u-${Date.now()}`
      const userMsg: Message = {
        id: uid,
        senderId: currentUser.id,
        content: userLine,
        timestamp: stamp(),
        createdAt: Date.now(),
      }
      append((prev) => [...prev, userMsg])
      window.setTimeout(() => {
        const botMsg: Message = {
          id: `cui-pair-b-${Date.now()}`,
          senderId: conversation.user.id,
          content: botContent,
          timestamp: stamp(),
          createdAt: Date.now(),
          isAfterPrompt: true,
        }
        append((prev) => [...prev, botMsg])
      }, 420)
    }

    const appendTranscript = isEducationContext ? setEducationMessages : setMessages

    return messagesList.map((msg, index, arr) => {
      const isMe = msg.senderId === currentUser.id
      const isPersonalInfo = msg.content === PERSONAL_INFO_MARKER
      const isCreateEmailForm = msg.content === CREATE_EMAIL_MARKER
      const isContinueEmail = msg.content === CONTINUE_EMAIL_MARKER
      const isCuiRulesInteraction =
        isCuiCardRulesScenario(scenario) && msg.content.startsWith(`${CUI_RULES_INTERACTION_MARKER}:`)
      const isGenericCard = msg.content.startsWith("<<<RENDER_GENERIC_CARD>>>:");
      const isIntentHandoffCard = msg.content.startsWith(`${INTENT_HANDOFF_MARKER}:`);
      const isSchoolSceneGuidanceCard = msg.content.startsWith(`${SCHOOL_SCENE_APP_GUIDANCE_MARKER}:`);
      const isScenarioTwoScheduleBuilderCard = msg.content.startsWith(
        `${SCENARIO_TWO_SCHEDULE_BUILDER_MARKER}:`
      )
      const isScenarioTwoAttendanceOverviewCard = msg.content.startsWith(
        `${SCENARIO_TWO_ATTENDANCE_OVERVIEW_MARKER}:`
      )
      const isScenarioTwoAttendanceSupplementCard = msg.content.startsWith(
        `${SCENARIO_TWO_ATTENDANCE_SUPPLEMENT_MARKER}:`
      )
      const isTaskTableCard = msg.content.startsWith(TASK_TABLE_MARKER)
      const isDockCrossHandoffCard = msg.content.startsWith(`${DOCK_CROSS_HANDOFF_MARKER}:`);
      const isTeachingStudentGradeCard = msg.content.startsWith(`${TEACHING_STUDENT_GRADE_MARKER}:`);
      const isEmployeeMgmt = msg.content === EMPLOYEE_MGMT_MARKER
      const isOrgSwitcher = msg.content === ORG_SWITCHER_MARKER;
      const isCreateOrgForm = msg.content === CREATE_ORG_FORM_MARKER;
      const isEduSpaceTypeSelect = msg.content.startsWith(`${EDU_SPACE_TYPE_SELECT_MARKER}:`)
      const isEduSpaceFamilyRole = msg.content === EDU_SPACE_FAMILY_ROLE_MARKER
      const isEduSpaceFamilyForm = msg.content.startsWith(`${EDU_SPACE_FAMILY_FORM_MARKER}:`)
      const isEduSpaceInstForm = msg.content === EDU_SPACE_INST_FORM_MARKER
      const isEduSpaceInstBlocked = msg.content === EDU_SPACE_INST_BLOCKED_MARKER
      const isEduWelcomeWeiwei = msg.content === EDU_WELCOME_WEIWEI_MARKER
      const isEduSpaceCreated = msg.content.startsWith(`${EDU_SPACE_CREATED_MARKER}:`)
      const isCreateOrgSuccess = msg.content.startsWith(`${CREATE_ORG_SUCCESS_MARKER}:`);
      const isJoinOrgForm = msg.content === JOIN_ORG_FORM_MARKER;
      const isJoinOrgConfirm = msg.content.startsWith(`${JOIN_ORG_CONFIRM_MARKER}:`);
      const isVvAssistantCard = Boolean(msg.vvAssistant)
      const isVvUserCli = Boolean(msg.vvMeta)
      const isSpecialComponent =
        isPersonalInfo ||
        isCreateEmailForm ||
        isContinueEmail ||
        isCuiRulesInteraction ||
        isGenericCard ||
        isIntentHandoffCard ||
        isSchoolSceneGuidanceCard ||
        isScenarioTwoScheduleBuilderCard ||
        isScenarioTwoAttendanceOverviewCard ||
        isScenarioTwoAttendanceSupplementCard ||
        isTaskTableCard ||
        isDockCrossHandoffCard ||
        isTeachingStudentGradeCard ||
        (isEmployeeMgmt && canRenderEmployeeMgmtCard) ||
        isOrgSwitcher ||
        isCreateOrgForm ||
        isEduSpaceTypeSelect ||
        isEduSpaceFamilyRole ||
        isEduSpaceFamilyForm ||
        isEduSpaceInstForm ||
        isEduSpaceInstBlocked ||
        isEduWelcomeWeiwei ||
        isEduSpaceCreated ||
        isCreateOrgSuccess ||
        isJoinOrgForm ||
        isJoinOrgConfirm ||
        isVvAssistantCard ||
        isVvUserCli
      const showTimestamp = shouldShowTimestamp(msg, index > 0 ? arr[index - 1] : null)
      const isSameSender = index > 0 && arr[index - 1].senderId === msg.senderId;
      const isWithin10Seconds = index > 0 && 
        (msg.createdAt !== undefined && arr[index - 1].createdAt !== undefined) 
          ? (msg.createdAt! - arr[index - 1].createdAt!) <= 10000 
          : false;
      const hideAvatar = isSameSender && !showTimestamp && isWithin10Seconds && !msg.isAfterPrompt;

      return (
        <div
          key={msg.id}
          data-cui-message-id={msg.id}
          className="flex min-w-0 flex-col gap-[var(--space-200)]"
        >
          {showTimestamp && <TimestampSeparator time={msg.timestamp} />}
          {isCuiRulesInteraction ? (
            <div
              className={cn(
                "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
                hideAvatar ? "-mt-[var(--space-400)]" : ""
              )}
            >
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <div className="w-full">
                {renderReplyOrgContextBanner(msg, isEducationContext)}
                {(() => {
                  const payload = parseCuiRulesPayload(msg.content)
                  if (!payload) {
                    return <div className="text-error">CUI 规则卡片解析失败</div>
                  }
                  if (payload.variant === "meeting_schedule") {
                    return (
                      <CuiRulesPlanCardBody
                        payload={payload}
                        messageId={msg.id}
                        onPatch={(id, next) => {
                          setMessages((prev) => patchCuiRulesMessage(prev, id, () => next))
                        }}
                        onAppendHandoffCard={
                          payload.showHandoffCta
                            ? () => {
                                const row = createHandoffCardMessage()
                                const ts = new Date().toLocaleTimeString("zh-CN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                })
                                setMessages((prev) => [
                                  ...prev,
                                  {
                                    id: row.id,
                                    senderId: conversation.user.id,
                                    content: row.content,
                                    timestamp: ts,
                                    createdAt: Date.now(),
                                    cuiFollowUpPrompts: demoFollowUpPrompts(),
                                  },
                                ])
                              }
                            : undefined
                        }
                      />
                    )
                  }
                  if (payload.variant === "plan") {
                    return (
                      <CuiRulesPlanCardBody
                        payload={payload}
                        messageId={msg.id}
                        onOpenSidebar={(id) => setCuiRulesSidebarMessageId(id)}
                        onAppendHandoffCard={() => {
                          const row = createHandoffCardMessage()
                          const ts = new Date().toLocaleTimeString("zh-CN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })
                          setMessages((prev) => [
                            ...prev,
                            {
                              id: row.id,
                              senderId: conversation.user.id,
                              content: row.content,
                              timestamp: ts,
                              createdAt: Date.now(),
                              cuiFollowUpPrompts: demoFollowUpPrompts(),
                            },
                          ])
                        }}
                      />
                    )
                  }
                  if (payload.variant === "inline_plan") {
                    return (
                      <CuiRulesInlinePlanBody
                        payload={payload}
                        messageId={msg.id}
                        onPatch={(id, next) => {
                          setMessages((prev) => patchCuiRulesMessage(prev, id, () => next))
                        }}
                      />
                    )
                  }
                  if (payload.variant === "handoff_meeting") {
                    return <CuiRulesHandoffCardBody payload={payload} />
                  }
                  return null
                })()}
                {renderDockFollowUpStrip(msg)}
              </div>
            </div>
          ) : isGenericCard ? (
            <div className={cn(
              "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
              hideAvatar ? "-mt-[var(--space-400)]" : ""
            )}>
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <div className="w-full">
                {renderMainCuiCardOrgAttributionBanner(msg, isEducationContext, msg.cardAttributionDockAppId ?? null)}
                {renderReplyOrgContextBanner(msg, isEducationContext)}
                {(() => {
                  try {
                    const cardData = JSON.parse(
                      msg.content.replace("<<<RENDER_GENERIC_CARD>>>:", "")
                    ) as {
                      title: string
                      description?: string
                      detail?: string
                      imageSrc?: string
                      cardActions?: GenericCardActionsPayload
                    }
                    const ca = cardData.cardActions
                    const hasInlineActions = Boolean(ca?.primary || ca?.secondary)

                    const pushUserLine = (text: string) => {
                      const userMsg: Message = {
                        id: `user-${Date.now()}`,
                        senderId: currentUser.id,
                        content: text,
                        timestamp: new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        }),
                        createdAt: Date.now(),
                      }
                      if (isEducationContext) {
                        setEducationMessages((prev) => [...prev, userMsg])
                      } else {
                        setMessages((prev) => [...prev, userMsg])
                      }
                    }

                    const appendMoreRecommendCard = () => {
                      const newCardData = JSON.stringify({
                        title: "更多推荐",
                        description: "这里是为您推荐的另外一些管理功能。",
                        detail:
                          "🌟 推荐操作：\n1. 点击「商品管理」-「物料商品」\n2. 点击「财务管理」-「财务报表」",
                        imageSrc: cardData.imageSrc,
                        cardActions: {
                          primary: { label: "开始学习", sendText: "我已经准备好了，请开始吧。" },
                          secondary: { label: "换一个", preset: "more_recommend" as const },
                        },
                      })
                      const botMsg: Message = attachDockCuiFollowUps(
                        {
                          id: `bot-card-${Date.now()}`,
                          senderId: conversation.user.id,
                          content: `<<<RENDER_GENERIC_CARD>>>:${newCardData}`,
                          timestamp: new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          }),
                          createdAt: Date.now(),
                          isAfterPrompt: true,
                        },
                        "更多推荐卡片",
                        conversation
                      )
                      if (isEducationContext) {
                        setEducationMessages((prev) => [...prev, botMsg])
                      } else {
                        setMessages((prev) => [...prev, botMsg])
                      }
                    }

                    return (
                      <GenericCard title={cardData.title}>
                        <p className="text-[length:var(--font-size-base)] text-text-secondary mb-[var(--space-200)] leading-relaxed">
                          {cardData.description}
                        </p>
                        {cardData.detail && (
                          <div className="bg-bg-secondary border border-border rounded-md p-[var(--space-400)]">
                            <p className="text-[length:var(--font-size-sm)] text-text whitespace-pre-wrap">
                              {cardData.detail}
                            </p>
                          </div>
                        )}
                        {hasInlineActions ? (
                          <div className="flex flex-col sm:flex-row gap-[var(--space-200)] w-full mt-[var(--space-400)]">
                            {ca?.primary ? (
                              <Button
                                type="button"
                                className="w-full sm:w-auto"
                                variant="chat-submit"
                                onClick={() => pushUserLine(ca.primary!.sendText)}
                              >
                                {ca.primary.label}
                              </Button>
                            ) : null}
                            {ca?.secondary ? (
                              "preset" in ca.secondary && ca.secondary.preset === "more_recommend" ? (
                                <Button
                                  type="button"
                                  className="w-full sm:w-auto"
                                  variant="chat-reset"
                                  onClick={appendMoreRecommendCard}
                                >
                                  {ca.secondary.label}
                                </Button>
                              ) : "sendText" in ca.secondary ? (
                                <Button
                                  type="button"
                                  className="w-full sm:w-auto"
                                  variant="chat-reset"
                                  onClick={() => pushUserLine(ca.secondary.sendText)}
                                >
                                  {ca.secondary.label}
                                </Button>
                              ) : null
                            ) : null}
                          </div>
                        ) : null}
                      </GenericCard>
                    )
                  } catch (e) {
                    return <div className="text-error">卡片数据解析失败</div>
                  }
                })()}
                {renderDockFollowUpStrip(msg)}
              </div>
            </div>
          ) : isIntentHandoffCard ? (
            <div className={cn(
              "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
              hideAvatar ? "-mt-[var(--space-400)]" : ""
            )}>
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <div className="w-full">
                {renderReplyOrgContextBanner(msg, isEducationContext)}
                {(() => {
                  try {
                    const rawJson = msg.content.slice(INTENT_HANDOFF_MARKER.length + 1)
                    const p = JSON.parse(rawJson) as {
                      appId: string
                      appName: string
                      intentLabel: string
                      cardTitle: string
                      confirmLine: string
                      handoffLine: string
                      carryOverText: string
                    }
                    return (
                      <>
                        {renderMainCuiCardOrgAttributionBanner(msg, isEducationContext, p.appId)}
                        <GenericCard title={p.cardTitle}>
                        <p className="text-[length:var(--font-size-base)] text-text mb-[var(--space-150)] leading-relaxed">
                          {p.confirmLine}
                        </p>
                        <p className="text-[length:var(--font-size-base)] text-text-secondary mb-[var(--space-200)] leading-relaxed">
                          {p.handoffLine}
                        </p>
                        <div className="bg-bg-secondary border border-border rounded-md p-[var(--space-300)] mb-[var(--space-300)]">
                          <p className="text-[length:var(--font-size-xs)] text-text-secondary mb-[var(--space-100)]">
                            你在主对话中的描述
                          </p>
                          <p className="text-[length:var(--font-size-sm)] text-text whitespace-pre-wrap break-words">
                            {p.carryOverText.length > 200 ? `${p.carryOverText.slice(0, 198)}…` : p.carryOverText}
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-[var(--space-200)] w-full">
                          {onIntentDockHandoff ? (
                            <Button
                              type="button"
                              className="w-full sm:w-auto"
                              variant="chat-submit"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                onIntentDockHandoffRef.current?.(
                                  p.appId,
                                  p.appName,
                                  currentOrgRef.current,
                                  organizations.length > 0,
                                  p.carryOverText,
                                  {
                                    conversationId: conversation.id,
                                    messages: [...messagesRef.current],
                                  }
                                )
                              }}
                            >
                              {isScenarioTwoFamily(scenario) || isNoOrgRoute
                                ? `同步到「${p.appName}」会话：${p.intentLabel}`
                                : `在「${p.appName}」中继续：${p.intentLabel}`}
                            </Button>
                          ) : null}
                        </div>
                      </GenericCard>
                      </>
                    )
                  } catch {
                    return <div className="text-error">意图卡片解析失败</div>
                  }
                })()}
                {renderDockFollowUpStrip(msg)}
              </div>
            </div>
          ) : isSchoolSceneGuidanceCard ? (
            <div
              className={cn(
                "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
                hideAvatar ? "-mt-[var(--space-400)]" : ""
              )}
            >
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <div className="w-full">
                {(() => {
                  try {
                    const rawJson = msg.content.slice(SCHOOL_SCENE_APP_GUIDANCE_MARKER.length + 1)
                    const p = JSON.parse(rawJson) as SchoolSceneAppGuidancePayload
                    const isAttendanceHandoff = p.targetAppId === "attendance"
                    return (
                      <>
                        {renderMainCuiCardOrgAttributionBanner(msg, isEducationContext, p.targetAppId)}
                        {renderReplyOrgContextBanner(msg, isEducationContext)}
                        <GenericCard title="应用承接引导">
                        {isAttendanceHandoff ? (
                          <>
                            <AttendanceStatisticsSnapshotCard
                              className="mb-[var(--space-300)]"
                              monthTitle={formatAttendanceMonthTitle("2026-04")}
                            />
                            <p className="mb-[var(--space-300)] whitespace-pre-wrap text-[length:var(--font-size-sm)] font-[var(--font-weight-regular)] leading-relaxed text-text-secondary">
                              {p.guidanceBody}
                            </p>
                          </>
                        ) : (
                          <p className="mb-[var(--space-300)] whitespace-pre-wrap text-[length:var(--font-size-base)] font-[var(--font-weight-regular)] leading-relaxed text-text">
                            {p.guidanceBody}
                          </p>
                        )}
                        <div className="flex w-full flex-col gap-[var(--space-200)] sm:flex-row">
                          {onIntentDockHandoff ? (
                            <Button
                              type="button"
                              className="w-full sm:w-auto"
                              variant="chat-submit"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                onIntentDockHandoffRef.current?.(
                                  p.targetAppId,
                                  p.targetAppName,
                                  currentOrgRef.current,
                                  organizations.length > 0,
                                  p.instruction,
                                  {
                                    conversationId: conversation.id,
                                    messages: [
                                      ...(isEducationContext
                                        ? educationPortalTranscriptRef.current
                                        : messagesRef.current),
                                    ],
                                  },
                                  {
                                    plainInstruction: p.instruction,
                                    assistantReply: p.assistantReply,
                                  }
                                )
                              }}
                            >
                              {isScenarioTwoFamily(scenario) || isNoOrgRoute
                                ? `同步到「${p.targetAppName}」会话：${p.instruction}`
                                : `《前往「${p.targetAppName}」继续「${p.instruction}」》`}
                            </Button>
                          ) : null}
                        </div>
                      </GenericCard>
                      </>
                    )
                  } catch {
                    return <div className="text-error">学校场景引导卡片解析失败</div>
                  }
                })()}
              </div>
            </div>
          ) : isScenarioTwoScheduleBuilderCard ? (
            <div
              className={cn(
                "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
                hideAvatar ? "-mt-[var(--space-400)]" : ""
              )}
            >
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <div className="w-full">
                {renderMainCuiCardOrgAttributionBanner(msg, isEducationContext, "education")}
                {renderReplyOrgContextBanner(msg, isEducationContext)}
                {(() => {
                  const rawJson = msg.content.slice(SCENARIO_TWO_SCHEDULE_BUILDER_MARKER.length + 1)
                  const parsed =
                    parseScenarioTwoScheduleBuilderPayload(rawJson) ??
                    defaultScenarioTwoScheduleBuilderPayload()
                  return (
                    <ScenarioTwoScheduleBuilderCard
                      payload={parsed}
                      onPatch={(next) =>
                        setMessages((prev) =>
                          prev.map((x) =>
                            x.id === msg.id
                              ? {
                                  ...x,
                                  content: `${SCENARIO_TWO_SCHEDULE_BUILDER_MARKER}:${JSON.stringify(next)}`,
                                }
                              : x
                          )
                        )
                      }
                      onMirrorPublish={({ userLine, assistantLine }) =>
                        onMirrorDockConversationRef.current?.({
                          dockAppId: "education",
                          orgId: currentOrgRef.current,
                          hasJoinedOrganizations: organizations.length > 0,
                          pairs: [{ userText: userLine, assistantText: assistantLine }],
                        })
                      }
                    />
                  )
                })()}
                {renderDockFollowUpStrip(msg)}
              </div>
            </div>
          ) : isScenarioTwoAttendanceOverviewCard ? (
            <div
              className={cn(
                "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
                hideAvatar ? "-mt-[var(--space-400)]" : ""
              )}
            >
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <div className="w-full">
                {renderMainCuiCardOrgAttributionBanner(msg, isEducationContext, "attendance")}
                {renderReplyOrgContextBanner(msg, isEducationContext)}
                {(() => {
                  const rawJson = msg.content.slice(SCENARIO_TWO_ATTENDANCE_OVERVIEW_MARKER.length + 1)
                  const parsed =
                    parseScenarioTwoAttendanceOverviewPayload(rawJson) ??
                    defaultScenarioTwoAttendanceOverviewPayload()
                  return (
                    <ScenarioTwoAttendanceOverviewCard
                      payload={parsed}
                      onPatch={(next) => {
                        const nextContent = `${SCENARIO_TWO_ATTENDANCE_OVERVIEW_MARKER}:${JSON.stringify(next)}`
                        setMessages((prev) =>
                          prev.map((x) =>
                            x.id === msg.id
                              ? {
                                  ...x,
                                  content: nextContent,
                                }
                              : x
                          )
                        )
                        if (getConversationDockAppId(conversation) !== "attendance") {
                          onMirrorDockConversationRef.current?.({
                            dockAppId: "attendance",
                            orgId: msg.cardAttributionOrgId ?? currentOrgRef.current,
                            hasJoinedOrganizations: organizations.length > 0,
                            patchMessages: [
                              { id: toDockMirrorPeerMessageId(msg.id), merge: { content: nextContent } },
                            ],
                          })
                        }
                      }}
                    />
                  )
                })()}
                {isScenarioTwoMultiOrgs(scenario) ? (
                  <ScenarioTwoMultiAttendanceFollowUpStrip
                    prompts={msg.cuiFollowUpPrompts}
                    organizations={organizations.map((o) => ({ id: o.id, name: o.name }))}
                    currentOrgId={currentOrg}
                    hideOrgSwitcher
                    onSendChip={(text) => handleSendMessage(text)}
                    onNavigateOtherOrgAttendance={(orgName) =>
                      handleSendMessage(`还可以针对「${orgName}」查看考勤`)
                    }
                  />
                ) : (
                  renderDockFollowUpStrip(msg)
                )}
              </div>
            </div>
          ) : isScenarioTwoAttendanceSupplementCard ? (
            <div
              className={cn(
                "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
                hideAvatar ? "-mt-[var(--space-400)]" : ""
              )}
            >
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <div className="w-full">
                {renderMainCuiCardOrgAttributionBanner(msg, isEducationContext, "attendance")}
                {renderReplyOrgContextBanner(msg, isEducationContext)}
                {(() => {
                  const rawJson = msg.content.slice(SCENARIO_TWO_ATTENDANCE_SUPPLEMENT_MARKER.length + 1)
                  const parsed =
                    parseScenarioTwoAttendanceSupplementPayload(rawJson) ??
                    defaultScenarioTwoAttendanceSupplementPayload("makeup")
                  return (
                    <ScenarioTwoAttendanceSupplementCard
                      payload={parsed}
                      onPatch={(next) => {
                        const nextContent = `${SCENARIO_TWO_ATTENDANCE_SUPPLEMENT_MARKER}:${JSON.stringify(next)}`
                        setMessages((prev) =>
                          prev.map((x) =>
                            x.id === msg.id
                              ? {
                                  ...x,
                                  content: nextContent,
                                }
                              : x
                          )
                        )
                        if (
                          (isScenarioTwoFamily(scenario) || isNoOrgRoute) &&
                          getConversationDockAppId(conversation) !== "attendance"
                        ) {
                          onMirrorDockConversationRef.current?.({
                            dockAppId: "attendance",
                            orgId: msg.cardAttributionOrgId ?? currentOrgRef.current,
                            hasJoinedOrganizations: organizations.length > 0,
                            patchMessages: [
                              { id: toDockMirrorPeerMessageId(msg.id), merge: { content: nextContent } },
                            ],
                          })
                        }
                      }}
                    />
                  )
                })()}
              </div>
            </div>
          ) : isTaskTableCard ? (
            <div
              className={cn(
                "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
                hideAvatar ? "-mt-[var(--space-400)]" : ""
              )}
            >
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <div className="w-full">
                {renderMainCuiCardOrgAttributionBanner(msg, isEducationContext, "work_task")}
                {renderReplyOrgContextBanner(msg, isEducationContext)}
                {(() => {
                  try {
                    const rest = msg.content.slice(TASK_TABLE_MARKER.length)
                    const jsonStr = rest.startsWith(":") ? rest.slice(1) : "{}"
                    const parsed = JSON.parse(jsonStr) as { filterHint?: string }
                    return (
                      <ScenarioTaskManagementTableCard
                        filterHint={parsed.filterHint}
                        viewedTaskIds={demoTaskTableViewedIds}
                        onRowClick={(row) => {
                          setDemoTaskTableViewedIds((prev) => new Set([...prev, row.id]))
                          const d = getTaskDetailOrFallback(row.id)
                          const desc = [
                            `执行人：${d.assignee}`,
                            `负责人：${d.owner}`,
                            `状态：${d.status}　进度：${d.progress}%`,
                            `截止：${d.due}　风险：${d.risk}`,
                            `优先级：${d.priority}　类型：${d.type}　阶段：${d.phase}`,
                          ].join("\n")
                          const sub =
                            d.subtasks?.length > 0
                              ? `\n子任务：\n${d.subtasks.map((s) => `${s.done ? "☑" : "☐"} ${s.title}`).join("\n")}`
                              : ""
                          const cardData = JSON.stringify({
                            title: "任务详情",
                            description: desc,
                            detail: `${d.description}${sub}`,
                            imageSrc: todoIcon,
                          })
                          const ts = new Date().toLocaleTimeString("zh-CN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })
                          const detailMsg: Message = {
                            id: `scenario-task-detail-${Date.now()}`,
                            senderId: "ai-assistant",
                            content: `<<<RENDER_GENERIC_CARD>>>:${cardData}`,
                            timestamp: ts,
                            createdAt: Date.now(),
                            isAfterPrompt: true,
                            cardAttributionOrgId: msg.cardAttributionOrgId ?? currentOrgRef.current,
                            cardAttributionDockAppId: "work_task",
                          }
                          setMessages((prev) => [...prev, detailMsg])
                          if (getConversationDockAppId(conversation) !== "work_task") {
                            onMirrorDockConversationRef.current?.({
                              dockAppId: "work_task",
                              orgId: msg.cardAttributionOrgId ?? currentOrgRef.current,
                              hasJoinedOrganizations: organizations.length > 0,
                              pairs: [],
                              mirrorExtraMessages: [
                                { ...detailMsg, id: toDockMirrorPeerMessageId(detailMsg.id) },
                              ],
                            })
                          }
                          scrollRef.current?.scrollIntoView({ behavior: "smooth" })
                        }}
                      />
                    )
                  } catch {
                    return (
                      <ScenarioTaskManagementTableCard
                        filterHint="全部任务"
                        viewedTaskIds={demoTaskTableViewedIds}
                      />
                    )
                  }
                })()}
                {isScenarioTwoMultiOrgs(scenario) ? (
                  <ScenarioTwoMultiAttendanceFollowUpStrip
                    organizations={organizations.map((o) => ({ id: o.id, name: o.name }))}
                    currentOrgId={currentOrg}
                    orgPickLabelMode="task_table"
                    hideOrgSwitcher
                    onSendChip={(text) => handleSendMessage(text)}
                    onNavigateOtherOrgAttendance={(orgName) =>
                      handleSendMessage(`还可以针对「${orgName}」打开任务列表`)
                    }
                  />
                ) : null}
              </div>
            </div>
          ) : isDockCrossHandoffCard ? (
            <div
              className={cn(
                "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
                hideAvatar ? "-mt-[var(--space-400)]" : ""
              )}
            >
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <div className="w-full">
                {renderReplyOrgContextBanner(msg, isEducationContext)}
                {(() => {
                  try {
                    const rawJson = msg.content.slice(DOCK_CROSS_HANDOFF_MARKER.length + 1)
                    const p = JSON.parse(rawJson) as {
                      targetAppId: string
                      targetAppName: string
                      fromAppName: string
                      intentLabel: string
                      cardTitle: string
                      confirmLine: string
                      handoffLine: string
                      carryOverText: string
                    }
                    return (
                      <>
                        {renderMainCuiCardOrgAttributionBanner(msg, isEducationContext, p.targetAppId)}
                        <GenericCard title={p.cardTitle}>
                        <p className="text-[length:var(--font-size-base)] text-text mb-[var(--space-150)] leading-relaxed">
                          {p.confirmLine}
                        </p>
                        <p className="text-[length:var(--font-size-base)] text-text-secondary mb-[var(--space-200)] leading-relaxed">
                          {p.handoffLine}
                        </p>
                        <div className="bg-bg-secondary border border-border rounded-md p-[var(--space-300)] mb-[var(--space-300)]">
                          <p className="text-[length:var(--font-size-xs)] text-text-secondary mb-[var(--space-100)]">
                            {`你在「${p.fromAppName}」中的描述`}
                          </p>
                          <p className="text-[length:var(--font-size-sm)] text-text whitespace-pre-wrap break-words">
                            {p.carryOverText.length > 200
                              ? `${p.carryOverText.slice(0, 198)}…`
                              : p.carryOverText}
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-[var(--space-200)] w-full">
                          {onCrossDockHandoff ? (
                            <Button
                              type="button"
                              className="w-full sm:w-auto"
                              variant="chat-submit"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                onCrossDockHandoffRef.current?.(
                                  p.targetAppId,
                                  p.targetAppName,
                                  currentOrgRef.current,
                                  organizations.length > 0,
                                  p.carryOverText,
                                  p.fromAppName,
                                  {
                                    conversationId: conversation.id,
                                    messages: [...messagesRef.current],
                                  }
                                )
                              }}
                            >
                              {isScenarioTwoFamily(scenario) || isNoOrgRoute
                                ? `同步到「${p.targetAppName}」会话：${p.intentLabel}`
                                : `前往「${p.targetAppName}」继续：${p.intentLabel}`}
                            </Button>
                          ) : null}
                        </div>
                      </GenericCard>
                      </>
                    )
                  } catch {
                    return <div className="text-error">跨应用引导卡片解析失败</div>
                  }
                })()}
                {renderDockFollowUpStrip(msg)}
              </div>
            </div>
          ) : isTeachingStudentGradeCard ? (
            <div
              className={cn(
                "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
                hideAvatar ? "-mt-[var(--space-400)]" : ""
              )}
            >
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <div className="w-full">
                {renderMainCuiCardOrgAttributionBanner(msg, isEducationContext, "teaching")}
                {renderReplyOrgContextBanner(msg, isEducationContext)}
                {(() => {
                  try {
                    const rawJson = msg.content.slice(TEACHING_STUDENT_GRADE_MARKER.length + 1)
                    const data = JSON.parse(rawJson) as TeachingStudentGradePayload
                    return <TeachingStudentGradeCard data={data} />
                  } catch {
                    return <div className="text-error">成绩表单数据解析失败</div>
                  }
                })()}
                {renderDockFollowUpStrip(msg)}
              </div>
            </div>
          ) : isOrgSwitcher ? (
            <div className={cn(
              "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
              hideAvatar ? "-mt-[var(--space-400)]" : ""
            )}>
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <div className="w-full">
                {renderReplyOrgContextBanner(msg, isEducationContext)}
                {organizations.length > 0 ? (
                  <OrganizationSwitcherCard
                    currentOrg={organizations.find(o => o.id === currentOrg) || organizations[0]}
                    organizations={organizations}
                    onSelectOrg={handleOrgSwitch}
                    onCreateOrg={handleCreateOrg}
                    onJoinOrg={handleJoinOrg}
                  />
                ) : (
                  <GenericCard title="加入或创建组织">
                    <p className="text-[length:var(--font-size-base)] text-text-secondary leading-relaxed">
                      当前账号尚未加入任何组织。加入组织后可使用组织内的资源与协作能力。
                    </p>
                    <div className="mt-[var(--space-400)] flex flex-col sm:flex-row gap-[var(--space-200)]">
                      <Button className="w-full sm:w-auto" variant="chat-submit" onClick={handleJoinOrg}>
                        加入组织
                      </Button>
                      <Button className="w-full sm:w-auto" variant="chat-reset" onClick={handleCreateOrg}>
                        创建组织
                      </Button>
                    </div>
                  </GenericCard>
                )}
                {renderDockFollowUpStrip(msg)}
              </div>
            </div>
          ) : isCreateOrgForm ? (
            <div className={cn(
              "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
              hideAvatar ? "-mt-[var(--space-400)]" : ""
            )}>
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <div className="w-full">
                {renderReplyOrgContextBanner(msg, isEducationContext)}
                <CreateOrgFormCard
                  onSubmit={(data) => handleCreateOrgSubmit(data, isEducationContext)}
                  onCancel={() => {
                    // 可选：返回组织切换器
                  }}
                />
                {renderDockFollowUpStrip(msg)}
              </div>
            </div>
          ) : isEduSpaceTypeSelect ? (
            <div
              className={cn(
                "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
                hideAvatar ? "-mt-[var(--space-400)]" : "",
              )}
            >
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <div className="w-full">
                {renderReplyOrgContextBanner(msg, isEducationContext)}
                {(() => {
                  try {
                    const rawJson = msg.content.slice(EDU_SPACE_TYPE_SELECT_MARKER.length + 1)
                    const payload = JSON.parse(rawJson) as { orgName?: string }
                    const orgLabel = payload.orgName ?? "本组织"
                    const fullFlow = shouldOfferFullEducationSpaceCreateFlow(
                      scenario,
                      hasJoinedOrganizations,
                      messagesList,
                      messages
                    )
                    return (
                      <EduSpaceTypeSelectCard
                        onSelectFamily={() =>
                          fullFlow
                            ? pushUserThenBot("我要创建家庭教育空间", EDU_SPACE_FAMILY_ROLE_MARKER)
                            : pushUserThenBot(
                                "我要创建家庭教育空间",
                                `已选择「家庭教育空间」。接下来可为「${orgLabel}」配置家庭成员与陪伴式学习场景（演示）。您可以说明家庭学段与孩子人数。`,
                              )
                        }
                        onSelectInstitution={() => {
                          if (organizations.length === 0) {
                            pushUserThenBot("我要创建机构教育空间", EDU_SPACE_INST_BLOCKED_MARKER)
                            return
                          }
                          fullFlow
                            ? pushUserThenBot("我要创建机构教育空间", EDU_SPACE_INST_FORM_MARKER)
                            : pushUserThenBot(
                                "我要创建机构教育空间",
                                `已选择「机构教育空间」。接下来可为「${orgLabel}」进入教务与经营能力配置（演示）。您可以说明校区与班型需求。`,
                              )
                        }}
                      />
                    )
                  } catch {
                    return <div className="text-error">教育空间类型数据解析失败</div>
                  }
                })()}
                {renderDockFollowUpStrip(msg)}
              </div>
            </div>
          ) : isEduSpaceInstBlocked ? (
            <div
              className={cn(
                "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
                hideAvatar ? "-mt-[var(--space-400)]" : "",
              )}
            >
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <div className="w-full">
                {renderReplyOrgContextBanner(msg, isEducationContext)}
                <GenericCard title="创建机构教育空间">
                  <p className="text-[length:var(--font-size-sm)] text-text-secondary leading-relaxed m-0 mb-[var(--space-300)]">
                    机构教育空间必须从属于一个组织。你当前尚未加入任何组织，请先加入或创建一个组织后，再创建机构教育空间。
                  </p>
                  <div className="flex flex-wrap gap-[var(--space-200)]">
                    <ChatPromptButton type="button" onClick={() => handleSendMessage("加入组织")}>
                      加入组织
                    </ChatPromptButton>
                    <ChatPromptButton type="button" onClick={() => handleSendMessage("创建组织")}>
                      创建组织
                    </ChatPromptButton>
                  </div>
                </GenericCard>
                {renderDockFollowUpStrip(msg)}
              </div>
            </div>
          ) : isEduSpaceFamilyRole ? (
            <div
              className={cn(
                "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
                hideAvatar ? "-mt-[var(--space-400)]" : "",
              )}
            >
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <div className="w-full">
                {renderReplyOrgContextBanner(msg, isEducationContext)}
                <FamilyEducationRoleCard
                  onSelectRole={(role: FamilyCreatorRole) => {
                    const stamp = () =>
                      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    const userLine =
                      role === "parent"
                        ? "我是家长，为孩子创建家庭教育空间"
                        : "我是学生，为自己创建学习空间"
                    appendTranscript((prev) => [
                      ...prev,
                      {
                        id: `edu-role-u-${Date.now()}`,
                        senderId: currentUser.id,
                        content: userLine,
                        timestamp: stamp(),
                        createdAt: Date.now(),
                      },
                    ])
                    window.setTimeout(() => {
                      appendTranscript((prev) => [
                        ...prev,
                        {
                          id: `edu-role-form-${Date.now()}`,
                          senderId: conversation.user.id,
                          content: `${EDU_SPACE_FAMILY_FORM_MARKER}:${JSON.stringify({ creatorRole: role })}`,
                          timestamp: stamp(),
                          createdAt: Date.now(),
                          isAfterPrompt: true,
                        },
                      ])
                      scrollRef.current?.scrollIntoView({ behavior: "smooth" })
                    }, 420)
                  }}
                />
                {renderDockFollowUpStrip(msg)}
              </div>
            </div>
          ) : isEduSpaceFamilyForm ? (
            <div
              className={cn(
                "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
                hideAvatar ? "-mt-[var(--space-400)]" : "",
              )}
            >
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <div className="w-full">
                {renderReplyOrgContextBanner(msg, isEducationContext)}
                {(() => {
                  try {
                    const rawJson = msg.content.slice(EDU_SPACE_FAMILY_FORM_MARKER.length + 1)
                    const { creatorRole } = JSON.parse(rawJson) as { creatorRole: FamilyCreatorRole }
                    return (
                      <CreateFamilyEducationSpaceCard
                        creatorRole={creatorRole}
                        onSubmit={({ name }) => {
                          const stamp = () =>
                            new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          appendTranscript((prev) => [
                            ...prev,
                            {
                              id: `edu-fam-submit-u-${Date.now()}`,
                              senderId: currentUser.id,
                              content: `创建空间：${name}`,
                              timestamp: stamp(),
                              createdAt: Date.now(),
                            },
                          ])
                          window.setTimeout(() => {
                            const rec: DemoEducationSpaceRecord = {
                              id: `edu-space-family-${Date.now()}`,
                              name,
                              kind: "family",
                              createdAt: Date.now(),
                            }
                            setEducationSpaces((prev) => [...prev, rec])
                            setCurrentEducationSpaceId(rec.id)
                            appendTranscript((prev) => [
                              ...prev,
                              {
                                id: `edu-fam-success-${Date.now()}`,
                                senderId: conversation.user.id,
                                content: `${EDU_SPACE_CREATED_MARKER}:${JSON.stringify({
                                  spaceName: name,
                                  kind: "family",
                                })}`,
                                timestamp: stamp(),
                                createdAt: Date.now(),
                                isAfterPrompt: true,
                              },
                            ])
                            scrollRef.current?.scrollIntoView({ behavior: "smooth" })
                          }, 450)
                        }}
                      />
                    )
                  } catch {
                    return <div className="text-error">身份数据解析失败</div>
                  }
                })()}
                {renderDockFollowUpStrip(msg)}
              </div>
            </div>
          ) : isEduSpaceInstForm ? (
            <div
              className={cn(
                "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
                hideAvatar ? "-mt-[var(--space-400)]" : "",
              )}
            >
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <div className="w-full">
                {renderReplyOrgContextBanner(msg, isEducationContext)}
                <CreateInstitutionalEducationSpaceCard
                  adminCompanyOptions={organizations.map((o) => o.name).filter(Boolean)}
                  onSubmit={(data: InstitutionalEducationSpacePayload) => {
                    const stamp = () =>
                      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    const matchedOrg =
                      organizations.find((o) => o.name === data.adminCompany.trim()) ??
                      organizations[0]
                    appendTranscript((prev) => [
                      ...prev,
                      {
                        id: `edu-inst-submit-u-${Date.now()}`,
                        senderId: currentUser.id,
                        content: `提交创建机构教育空间：${data.name}`,
                        timestamp: stamp(),
                        createdAt: Date.now(),
                      },
                    ])
                    window.setTimeout(() => {
                      const rec: DemoEducationSpaceRecord = {
                        id: `edu-space-inst-${Date.now()}`,
                        name: data.name,
                        kind: "institutional",
                        hostOrganizationId: matchedOrg?.id,
                        hostOrganizationName: matchedOrg?.name ?? data.adminCompany.trim(),
                        createdAt: Date.now(),
                      }
                      setEducationSpaces((prev) => [...prev, rec])
                      setCurrentEducationSpaceId(rec.id)
                      if (matchedOrg) {
                        setCurrentOrg(matchedOrg.id)
                      }
                      appendTranscript((prev) => [
                        ...prev,
                        {
                          id: `edu-inst-success-${Date.now()}`,
                          senderId: conversation.user.id,
                          content: `${EDU_SPACE_CREATED_MARKER}:${JSON.stringify({
                            spaceName: data.name,
                            kind: "institutional",
                          })}`,
                          timestamp: stamp(),
                          createdAt: Date.now(),
                          isAfterPrompt: true,
                        },
                      ])
                      scrollRef.current?.scrollIntoView({ behavior: "smooth" })
                    }, 450)
                  }}
                />
                {renderDockFollowUpStrip(msg)}
              </div>
            </div>
          ) : isEduSpaceCreated ? (
            <div
              className={cn(
                "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
                hideAvatar ? "-mt-[var(--space-400)]" : "",
              )}
            >
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <div className="w-full">
                {renderReplyOrgContextBanner(msg, isEducationContext)}
                {(() => {
                  try {
                    const rawJson = msg.content.slice(EDU_SPACE_CREATED_MARKER.length + 1)
                    const payload = JSON.parse(rawJson) as {
                      spaceName: string
                      kind: "family" | "institutional"
                    }
                    return (
                      <EducationSpaceCreatedCard
                        spaceName={payload.spaceName}
                        kind={payload.kind}
                        onInviteMembers={() => handleSendMessage("我想邀请成员加入教育空间")}
                        onCreatePlan={() => handleSendMessage("帮我创建一个学习计划")}
                        onGoToEducationSpace={
                          !isEducationContext ? () => openPortalRootApp("education") : undefined
                        }
                      />
                    )
                  } catch {
                    return <div className="text-error">创建结果数据解析失败</div>
                  }
                })()}
                {renderDockFollowUpStrip(msg)}
              </div>
            </div>
          ) : isCreateOrgSuccess ? (
            <div className={cn(
              "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
              hideAvatar ? "-mt-[var(--space-400)]" : ""
            )}>
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <div className="w-full">
                {renderReplyOrgContextBanner(msg, isEducationContext)}
                {(() => {
                  try {
                    const successData = JSON.parse(msg.content.replace(`${CREATE_ORG_SUCCESS_MARKER}:`, ""))
                    const isEducationIndustry =
                      successData.isEducationIndustry === true || successData.industry === "教育行业"
                    const successIntro = isEducationIndustry
                      ? "创建成功！接下来您可以：创建教育空间、邀请员工、激活邮箱并进入教育空间协作。"
                      : "创建成功！接下来您可以：邀请员工、激活邮箱并进入工作台协作。"

                    const pushLine = (userLine: string, botLine: string) => {
                      pushUserThenBot(userLine, botLine)
                    }

                    return (
                      <>
                        <div className="mb-[var(--space-300)] w-full max-w-[min(600px,100%)] rounded-tl-sm rounded-tr-lg rounded-bl-lg rounded-br-lg border border-border bg-bg p-[var(--space-350)] shadow-xs">
                          <p className="text-[length:var(--font-size-base)] font-[var(--font-weight-regular)] leading-normal text-text">
                            {successIntro}
                          </p>
                        </div>

                        <CreateOrgSuccessCard
                          orgName={successData.orgName}
                          country={successData.country}
                          industry={successData.industry}
                        />

                        <div className="mb-[var(--space-200)] mt-[var(--space-300)] flex flex-wrap gap-[var(--space-200)]">
                          {isEducationIndustry ? (
                            <ChatPromptButton
                              onClick={() =>
                                pushUserThenBot(
                                  "创建教育空间",
                                  `${EDU_SPACE_TYPE_SELECT_MARKER}:${JSON.stringify({
                                    orgName: successData.orgName,
                                  })}`,
                                )
                              }
                            >
                              创建教育空间
                            </ChatPromptButton>
                          ) : null}
                          <ChatPromptButton
                            onClick={() =>
                              pushLine(
                                "邀请员工",
                                `已打开「${successData.orgName}」成员邀请入口（演示）。可复制邀请链接或生成邀请码。`,
                              )
                            }
                          >
                            邀请员工
                          </ChatPromptButton>
                          <ChatPromptButton
                            onClick={() => {
                              handleOrgSwitch(successData.orgId)
                              pushLine(
                                "进入工作台",
                                `已切换到「${successData.orgName}」并打开工作台（演示）。`,
                              )
                            }}
                          >
                            进入工作台
                          </ChatPromptButton>
                          <ChatPromptButton
                            onClick={() =>
                              pushLine(
                                "激活邮箱",
                                `已发起「${successData.orgName}」官方邮箱「${successData.email}」激活流程（演示）。`,
                              )
                            }
                          >
                            激活邮箱
                          </ChatPromptButton>
                        </div>
                      </>
                    )
                  } catch (e) {
                    return (
                      <div className="text-[length:var(--font-size-sm)] text-[color:var(--color-error)]">
                        成功数据解析失败
                      </div>
                    )
                  }
                })()}
                {renderDockFollowUpStrip(msg)}
              </div>
            </div>
          ) : isJoinOrgForm ? (
            <div className={cn(
              "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
              hideAvatar ? "-mt-[var(--space-400)]" : ""
            )}>
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <div className="w-full">
                {renderReplyOrgContextBanner(msg, isEducationContext)}
                <JoinOrgFormCard
                  onSubmit={(code) => handleJoinOrgSubmit(code, isEducationContext)}
                  onCancel={() => {
                    // 可选：返回组织切换器
                  }}
                />
                {renderDockFollowUpStrip(msg)}
              </div>
            </div>
          ) : isJoinOrgConfirm ? (
            <div className={cn(
              "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
              hideAvatar ? "-mt-[var(--space-400)]" : ""
            )}>
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <div className="w-full">
                {renderReplyOrgContextBanner(msg, isEducationContext)}
                {(() => {
                  try {
                    const confirmData = JSON.parse(msg.content.replace(`${JOIN_ORG_CONFIRM_MARKER}:`, ""));
                    return (
                      <JoinOrgConfirmCard
                        orgId={confirmData.orgId}
                        orgName={confirmData.orgName}
                        orgIcon={confirmData.orgIcon}
                        memberCount={confirmData.memberCount}
                        description={confirmData.description}
                        onConfirm={(id) => handleConfirmJoinOrg(id, isEducationContext)}
                        onCancel={() => {
                          // 可选：返回组织切换器
                        }}
                      />
                    )
                  } catch (e) {
                    return <div className="text-error">确认数据解析失败</div>
                  }
                })()}
                {renderDockFollowUpStrip(msg)}
              </div>
            </div>
          ) : isEduWelcomeWeiwei ? (
            <div
              className={cn(
                "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
                hideAvatar ? "-mt-[var(--space-400)]" : "",
              )}
            >
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <div className="w-full">
                {renderReplyOrgContextBanner(msg, isEducationContext)}
                <EduWelcomeWeiweiCard
                  onSelectFamily={() => handleSendMessage("创建家庭教育空间")}
                  onSelectInstitution={() => handleSendMessage("创建机构教育空间")}
                />
                {renderDockFollowUpStrip(msg)}
              </div>
            </div>
          ) : isEmployeeMgmt ? (
            canRenderEmployeeMgmtCard ? (
              <div
                className={cn(
                  "flex w-full flex-col gap-3 md:w-[calc(100%-44px)]",
                  hideAvatar ? "-mt-[var(--space-400)]" : ""
                )}
              >
                <div className="flex w-full flex-col gap-[6px] justify-start group md:flex-row md:gap-[8px]">
                  {!hideAvatar ? (
                    <Avatar className="h-[28px] w-[28px] shrink-0 md:h-[36px] md:w-[36px]">
                      <AvatarImage src={conversation.user.avatar} />
                    </Avatar>
                  ) : (
                    <div className="hidden w-[36px] shrink-0 md:block" />
                  )}
                  <div className="min-w-0 flex-1">
                    {renderMainCuiCardOrgAttributionBanner(msg, isEducationContext, "employee")}
                    {renderReplyOrgContextBanner(msg, isEducationContext)}
                    <EmployeeManagementPanel
                      organizationId={currentOrg}
                      inviteRecords={employeeInviteRecordsForScope}
                      onInviteRecordsChange={updateEmployeeInviteRecords}
                    />
                  </div>
                </div>
                {msg.cuiFollowUpPrompts?.length ? (
                  <ScenarioTwoMultiFollowUpGrid
                    right={
                      <DockCuiFollowUpStrip
                        prompts={msg.cuiFollowUpPrompts}
                        sendTexts={msg.cuiFollowUpSendTexts}
                        onSend={(text) => handleSendMessage(text)}
                        className="min-w-0 w-full max-w-full flex-wrap justify-end sm:ml-auto sm:w-auto sm:max-w-[min(100%,44rem)]"
                      />
                    }
                  />
                ) : null}
              </div>
            ) : (
              <ChatMessageBubble
                msg={{
                  ...msg,
                  content: "请在主 AI 或日程、会议、课程管理、员工应用中说「员工管理」等打开。",
                }}
                isMe={isMe}
                userAvatar={currentUser.avatar}
                aiAvatar={conversation.user.avatar}
                userName={isMe ? "Me" : conversation.user.name}
                isSpecialComponent={false}
                isPersonalInfo={isPersonalInfo}
                isCreateEmailForm={isCreateEmailForm}
                isContinueEmail={isContinueEmail}
                hideAvatar={hideAvatar}
                className={cn(
                  hideAvatar ? "-mt-[var(--space-400)]" : "",
                  isMe ? "flex-col-reverse md:flex-row" : ""
                )}
                handleEmailFormSubmit={handleEmailFormSubmit}
                handleContinueCreateEmail={handleContinueCreateEmail}
                dockSessionOrgDisplayName={
                  isEducationContext || hideDockOrgReplyBannerSession
                    ? null
                    : dockSessionOrgDisplayNameForMessages
                }
                onDockFollowUpSend={(text) => handleSendMessage(text)}
              />
            )
          ) : isMe && msg.vvMeta ? (
            <div
              className={cn(
                "flex flex-col md:flex-row w-full items-end md:items-start justify-end gap-[6px] md:gap-[8px]",
                hideAvatar ? "-mt-[var(--space-400)]" : ""
              )}
            >
              <div className="flex max-w-full flex-col items-end gap-[var(--space-150)] md:max-w-[calc(100%-44px)]">
                <VvUserBubble content={msg.content} vvMeta={msg.vvMeta} />
              </div>
              {!hideAvatar ? (
                <Avatar className="h-[28px] w-[28px] shrink-0 md:h-[36px] md:w-[36px]">
                  <AvatarImage src={currentUser.avatar} />
                </Avatar>
              ) : (
                <div className="hidden w-[36px] shrink-0 md:block" />
              )}
            </div>
          ) : msg.vvAssistant ? (
            <div
              className={cn(
                "group flex w-full flex-col justify-start gap-[6px] md:w-[calc(100%-44px)] md:flex-row md:gap-[8px]",
                hideAvatar ? "-mt-[var(--space-400)]" : ""
              )}
            >
              {!hideAvatar ? (
                <Avatar className="h-[28px] w-[28px] shrink-0 md:h-[36px] md:w-[36px]">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden w-[36px] shrink-0 md:block" />
              )}
              <div className="min-w-0 w-full">
                {renderReplyOrgContextBanner(msg, isEducationContext)}
                <VvAssistantBlocks
                  key={msg.id}
                  messageId={msg.id}
                  cardStatusLine={msg.vvCardStatusLine}
                  payload={msg.vvAssistant}
                  onVvAction={handleCalendarDockVvAction}
                  schedulePanelAppId={getConversationDockAppId(conversation)}
                  schedulePanelSurface="main"
                  scheduleMeetingItems={vvMeetingItems}
                />
                {renderDockFollowUpStrip(msg)}
              </div>
            </div>
          ) : (
            <ChatMessageBubble
              msg={msg}
              isMe={isMe}
              userAvatar={currentUser.avatar}
              aiAvatar={conversation.user.avatar}
              userName={isMe ? "Me" : conversation.user.name}
              isSpecialComponent={isSpecialComponent}
              isPersonalInfo={isPersonalInfo}
              isCreateEmailForm={isCreateEmailForm}
              isContinueEmail={isContinueEmail}
              hideAvatar={hideAvatar}
              className={cn(
                hideAvatar ? "-mt-[var(--space-400)]" : "",
                isMe ? "flex-col-reverse md:flex-row" : ""
              )}
              handleEmailFormSubmit={handleEmailFormSubmit}
              handleContinueCreateEmail={handleContinueCreateEmail}
              dockSessionOrgDisplayName={
                isEducationContext || hideDockOrgReplyBannerSession
                  ? null
                  : dockSessionOrgDisplayNameForMessages
              }
              onDockFollowUpSend={(text) => handleSendMessage(text)}
            />
          )}
        </div>
      )
    })
  }

  /** 场景五：《主CUI交互》= 顶栏全宽 + 其下 [会话列表 | 会话内容]，列表不占顶栏高度 */
  const scenarioFiveUnderBarLayout =
    isScenarioFiveLike(scenario) &&
    mainView === "cui" &&
    (activeApp === null || secondaryPortalOpen)

  const sessionSplit =
    !scenarioFiveUnderBarLayout &&
    mainView === "cui" &&
    (activeApp === null || secondaryPortalOpen) &&
    sessionListPinned &&
    historyOpen &&
    Boolean(onHistoryOpenChange && onSelect)

  /** 仅主 VVAI 会话顶栏展示「开启新会话」等；独立窗口内不再提供顶栏「新开会话」 */
  /** 独立窗口：主会话尚无消息时的一帧极简布局（注入引导前）；《主入口》已与场景二对齐为完整主会话空态，不再走此分支 */
  const showMainChatFreshInitLayout =
    isMainCuiStandaloneWindow &&
    conversation.id === cuiMainChatId &&
    messages.length === 0

  const scenarioZeroMainEmptyWelcome =
    isScenarioZeroNoOrg &&
    conversation.id === cuiMainChatId &&
    !isDockAppSession &&
    messages.length === 0

  /** 与场景二一致：主会话区静态问候；场景 0 主会话首进用专用文案 */
  const mainSessionWelcomeGreeting = scenarioZeroMainEmptyWelcome
    ? SCENARIO_ZERO_MAIN_CUI_GUIDE_GREETING
    : MAIN_CUI_GUIDE_GREETING

  const mainCuiToolbarActionsEligible =
    activeApp === null &&
    mainView === "cui" &&
    conversation.id === cuiMainChatId &&
    !isDockConversationId(conversation.id) &&
    onMainChatNewThread != null

  /** 主框架页可打开与《主CUI交互》同步的独立浏览器窗口（独立窗口内不再展示，避免嵌套） */
  const canOpenPairedStandaloneCui =
    !isMainCuiStandaloneWindow && onOpenStandaloneMainCui != null

  /**
   * 主 VVAI 会话由 mainCuiToolbarActions 提供独立窗口；dock 应用、教育/医院门户等仍须在顶栏右侧展示同一入口。
   */
  const showStandaloneWindowInNav =
    mainView === "cui" && canOpenPairedStandaloneCui && !mainCuiToolbarActionsEligible

  /** 与主会话 / dock 应用一致：栅格顶栏（左 VVAI+模型、中组织、右工具） */
  const navBarGridCui =
    mainView === "cui" && (activeApp === null || secondaryPortalOpen)

  return (
    <UserCalendarsProvider>
      <VvScheduleSideSheetContext.Provider value={scheduleSideSheetApi}>
        <ScheduleCalendarSettingsPrefsSync bridgeRef={scheduleCalendarPrefsBridgeRef} />
        <SubscribedColleagueBridgeSync bridgeRef={subscribedColleagueBridgeRef} />
        <UserCalendarTypesBridgeSync bridgeRef={calendarTypesBridgeRef} />
        <VvChatInsetDialogPortalHost>
          <VvChatFullInsetPortalHost>
    <div className="absolute inset-0 flex flex-row w-full isolate overflow-hidden bg-cui-bg">
      {!isMainCuiStandaloneWindow && (
        <MainNavRail
          userAvatar={currentUser.avatar}
          messageUnread={5}
          activeApp={activeApp}
          mainView={mainView}
          onSelectMessages={() => {
            setMainView("im")
            setIsAllAppsOpen(false)
            onHistoryOpenChange?.(false)
          }}
          onSelectMainCui={() => {
            setMainView("cui")
            setActiveApp(null)
            setIsPinnedTaskExpanded(true)
            pinnedTaskAllowScrollCollapseRef.current = false
            lastChatScrollTopRef.current = 0
            onEnterMainCuiSessionLayout?.()
            queueMicrotask(() => hydrateBottomDock())
          }}
          onSelectContacts={() => {
            setMainView("im")
            setIsAllAppsOpen(false)
            onHistoryOpenChange?.(false)
          }}
          onSelectMe={() => {
            setMainView("cui")
            setActiveApp(null)
            setIsPinnedTaskExpanded(true)
            pinnedTaskAllowScrollCollapseRef.current = false
            lastChatScrollTopRef.current = 0
            queueMicrotask(() => hydrateBottomDock())
          }}
          onSelectWorkbench={() => {
            setMainView("cui")
            setActiveApp(null)
            setIsAllAppsOpen(true)
            onHistoryOpenChange?.(false)
          }}
          onEducation={() => {
            setMainView("cui")
            openPortalRootApp("education")
            queueMicrotask(() => hydrateBottomDock())
          }}
          onOpenAllApps={() => setIsAllAppsOpen(true)}
          onTodoQuick={() => {
            setMainView("cui")
            queueMicrotask(() => handleSendMessage("查看今天的待办事项"))
          }}
          onCalendarQuick={() => {
            setMainView("cui")
            queueMicrotask(() => handleSendMessage("打开日历"))
          }}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 min-h-0 relative overflow-hidden">
      {mainView === "cui" && secondaryPortalOpen && (
        <SecondaryAppHistorySidebar
          open={secondaryHistoryOpen}
          onOpenChange={setSecondaryHistoryOpen}
          sessions={secondaryAppSessions}
          selectedId={selectedSecondarySession}
          onSelect={handleSecondarySessionSelect}
          onNewConversation={handleSecondaryAppNewConversation}
          mode="push"
        />
      )}

      {!sessionSplit &&
        !scenarioFiveUnderBarLayout &&
        mainView === "cui" &&
        (activeApp === null || secondaryPortalOpen) &&
        onHistoryOpenChange &&
        onSelect && (
        <HistorySidebar
          layout="overlay"
          open={historyOpen}
          onOpenChange={onHistoryOpenChange}
          conversations={cuiHistoryConversations}
          selectedId={selectedId}
          onSelect={applyPrimarySessionListSelection}
          pinnedSessionId={cuiMainChatId}
          keepOpenOnSessionSelect={false}
          showConversationTypeTags
          organizations={sessionListOrganizations}
          sessionListPreferredOrgId={currentOrg}
          onJumpToConversationDay={handleJumpToConversationDay}
          mainChatHistory={mainChatHistory}
          onPickMainChatHistoryEntry={
            onSelectMainChatHistoryEntry ? handleSidebarMainHistorySelect : undefined
          }
          activeMainChatHistoryEntryId={activeMainChatHistoryEntryId}
        />
      )}

      <div
        className={cn(
          "flex flex-1 min-h-0 min-w-0",
          sessionSplit ? "flex-row" : "flex-col"
        )}
      >
        {sessionSplit && onHistoryOpenChange && onSelect && (
          <>
            <HistorySidebar
              layout="split"
              open
              persistent
              widthPx={sessionSidebarWidthProp}
              onOpenChange={onHistoryOpenChange}
              conversations={cuiHistoryConversations}
              selectedId={selectedId}
              onSelect={applyPrimarySessionListSelection}
              pinnedSessionId={cuiMainChatId}
              showConversationTypeTags
              organizations={sessionListOrganizations}
              sessionListPreferredOrgId={currentOrg}
              onJumpToConversationDay={handleJumpToConversationDay}
              mainChatHistory={mainChatHistory}
              onPickMainChatHistoryEntry={
                onSelectMainChatHistoryEntry ? handleSidebarMainHistorySelect : undefined
              }
              activeMainChatHistoryEntryId={activeMainChatHistoryEntryId}
            />
            <div
              role="separator"
              aria-orientation="vertical"
              className="w-2 shrink-0 z-[55] cursor-col-resize flex justify-center group relative touch-none select-none hover:bg-[var(--black-alpha-8)]"
              onPointerDown={handleSessionResizePointerDown}
            >
              <div className="w-px h-full bg-border group-hover:bg-primary/35 transition-colors rounded-full" />
            </div>
          </>
        )}

      {/* Main Content Wrapper */}
      <div className={cn(
        "flex flex-col flex-1 min-h-0 h-full w-full shrink-0 min-w-0 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        mainView === "im" ? "bg-white" : "bg-cui-bg",
        !sessionSplit &&
          !scenarioFiveUnderBarLayout &&
          mainView === "cui" &&
          historyOpen &&
          (activeApp === null || secondaryPortalOpen)
          ? "translate-x-[280px] md:translate-x-0"
          : "",
        secondaryHistoryOpen && secondaryPortalOpen ? "translate-x-[260px] md:translate-x-0" : ""
      )}>
        {mainView === "im" ? (
          <IMWorkspace />
        ) : (
        <>
        {/* 《主CUI交互》：场景五为 ①顶栏全宽 ②顶栏下[会话列表|会话内容]；其余场景保持原结构 */}
        {/* 模块：顶栏（VVAI Logo / 会话列表收展 / 组织切换 / 模型选择 / 独立窗口） */}
      <div className={cn(scenarioFiveUnderBarLayout && "shrink-0")}>
      <ChatNavBar 
        title=""
        navGridAlign={navBarGridCui}
        showSessionListToggle={navBarGridCui}
        sessionListOpen={historyOpen}
        onSessionListToggle={navBarGridCui ? onToggleHistory : undefined}
        onToggleHistory={undefined}
        onNewMessage={handleNewConversation}
        currentOrg={navBarOrganizationId}
        organizations={organizations}
        onOrgSelect={handleNavBarOrgSelect}
        organizationSwitcherMode={isNavContentScopeMode ? "content-scope" : "session"}
        onCreateOrg={handleCreateOrg}
        onJoinOrg={handleJoinOrg}
        onBack={undefined}
        showModelSelect
        currentModel={currentModel}
        models={AVAILABLE_MODELS}
        onModelSelect={handleModelSwitch}
        showIndependentWindow={showStandaloneWindowInNav}
        navCenterSlot={
          showNoOrgEducationSpaceNav ? (
            <SessionListEduSpaceHeader
              onCreateInstitutional={() => handleSendMessage("创建机构教育空间")}
              onCreateFamily={() => handleSendMessage("创建家庭教育空间")}
              onJoinSpace={() => handleSendMessage("加入教育空间")}
              popoverAlign="center"
            />
          ) : null
        }
        showNoOrgQuickEntry={organizations.length === 0 && !showNoOrgEducationSpaceNav}
        onQuickCreateOrg={handleCreateOrg}
        onQuickJoinOrg={handleJoinOrg}
        onIndependentWindow={
          showStandaloneWindowInNav
            ? () => {
                onOpenStandaloneMainCui?.()
                setMainChatHistoryOpen(false)
              }
            : undefined
        }
        mainCuiToolbarActions={
          mainCuiToolbarActionsEligible
            ? {
                ...(hideMainCuiNavHistoryIcon(scenario)
                  ? {}
                  : { onHistory: () => setMainChatHistoryOpen(true) }),
                onNewThread: () => {
                  onMainChatNewThread?.()
                  setMainChatHistoryOpen(false)
                },
                onIndependentWindow:
                  !isMainCuiStandaloneWindow && onOpenStandaloneMainCui
                    ? () => {
                        onOpenStandaloneMainCui()
                        setMainChatHistoryOpen(false)
                      }
                    : undefined,
                newThreadIconVariant: "message-plus",
                newThreadTitle: "开启新会话",
                newThreadAriaLabel: "开启新会话",
                independentWindowTitle: "独立窗口",
                independentWindowAriaLabel: "在独立浏览器窗口打开当前会话并与本页实时同步",
              }
            : null
        }
      />
      </div>

      {(() => {
        const cuiBelowNavColumn = (
          <>
      {/* 模块：顶部固定任务卡（仅主 AI 语境展示） */}
      {(activeApp === null || secondaryPortalOpen) && !showMainChatFreshInitLayout && (
        <div className="relative z-20 w-full bg-cui-bg px-[max(20px,var(--cui-padding-max))] pb-[var(--space-100)] pt-[var(--space-0)]">
          <PinnedTaskCard
            isExpanded={isPinnedTaskExpanded}
            onExpandedChange={handlePinnedTaskExpandedChange}
            greeting="下午好，今天你有 31 件要处理的事情 👇"
            chips={[
              {
                iconSrc: meetingIcon,
                alt: "需求启动会议",
                title: "需求启动会议",
                time: "15:00 - 16:00"
              },
              {
                iconSrc: calendarIcon,
                alt: "项目评审",
                title: "项目评审",
                time: "17:00 - 18:00"
              },
              {
                iconSrc: todoIcon,
                alt: "待办事项",
                title: "待办事项",
                count: 28
              }
            ]}
            onChipClick={(chip) => {
              setSelectedTask({
                iconSrc: chip.iconSrc,
                title: chip.title,
                time: chip.time,
                description: "这是一个重要的任务，需要及时处理。请确保在截止��期前完成所有相关工作。",
                members: [
                  {
                    id: "1",
                    name: "张三",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang"
                  },
                  {
                    id: "2",
                    name: "李四",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Li"
                  }
                ]
              });
              setIsTaskDrawerOpen(true);
            }}
          />
        </div>
      )}

      {/* 模块：主会话区（欢迎语 / 快捷建议 / 消息流）；外层原生 div 承接滚动与滚轮，避免 motion 层导致「下滑收起待办」失效 */}
      <div
        ref={chatScrollContainerRef}
        onScroll={handleChatScroll}
        onWheel={() => {
          pinnedTaskAllowScrollCollapseRef.current = true
        }}
        className="flex-1 min-h-0 relative z-10 overflow-y-auto overflow-x-hidden scrollbar-hide"
      >
        <motion.div
          key={activeApp || "main"}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="flex min-h-0 w-full flex-col"
        >
        <div className="flex flex-col gap-[var(--space-800)] w-full px-[max(20px,var(--cui-padding-max))] py-[var(--space-400)] pt-[var(--space-300)]">
          {/* Welcome Message (Mock/Static as per design) */}
          {!secondaryPortalOpen ? (
            <>
              {!isDockAppSession &&
              !(conversation.id === cuiMainChatId && messages.length > 0) ? (
                <ChatWelcome
                  avatarSrc={conversation.user.avatar}
                  greeting={mainSessionWelcomeGreeting}
                />
              ) : null}

              {/* Action Suggestions for Main Entrance（dock 应用会话不展示顶区快捷建议）；场景 0 不展示顶区「试试：查订单」 */}
              {(messages.length === 0 ||
                (onIntentDockHandoff && !isScenarioZeroNoOrg)) &&
                !isDockAppSession && (
                <div className="flex flex-wrap gap-[var(--space-200)] ml-0 md:ml-[44px] -mt-[var(--space-400)]">
                  {messages.length === 0 && (
                    <>
                      {scenarioZeroMainEmptyWelcome ? (
                        <>
                          <ChatPromptButton onClick={() => handleSendMessage("创建组织")}>
                            创建组织
                          </ChatPromptButton>
                          <ChatPromptButton onClick={() => handleSendMessage("加入组织")}>
                            加入组织
                          </ChatPromptButton>
                          <ChatPromptButton onClick={() => handleSendMessage("创建教育空间")}>
                            创建教育空间
                          </ChatPromptButton>
                          <ChatPromptButton onClick={() => handleSendMessage("加入教育空间")}>
                            加入教育空间
                          </ChatPromptButton>
                        </>
                      ) : showMainChatFreshInitLayout && !isScenarioZeroNoOrg ? (
                        <ChatPromptButton onClick={() => handleSendMessage("查订单")}>
                          试试：查订单
                        </ChatPromptButton>
                      ) : (
                        <>
                          <ChatPromptButton onClick={() => handleSendMessage("查看我的个人信息")}>
                            查看个人信息
                          </ChatPromptButton>
                          <ChatPromptButton onClick={() => handleSendMessage("帮我创建一封新邮件")}>
                            创建邮件
                          </ChatPromptButton>
                          <ChatPromptButton onClick={() => handleSendMessage("今天的待办事项")}>
                            查看待办事项
                          </ChatPromptButton>
                        </>
                      )}
                    </>
                  )}
                  {onIntentDockHandoff &&
                    !isScenarioZeroNoOrg &&
                    !isSingleOrgEduAttendanceScenarioFlow(scenario) &&
                    !isDockConversationId(conversation.id) &&
                    messages.length > 0 && (
                      <ChatPromptButton onClick={() => handleSendMessage("查订单")}>
                        试试：查订单
                      </ChatPromptButton>
                    )}
                </div>
              )}
            </>
          ) : (activeApp === PERSONAL_EDU_SPACE_APP_ID || activeApp === "education") &&
            isScenarioZeroNoOrg ? (
            <>
              {educationMessages.length === 0 ? (
                <ChatWelcome
                  avatarSrc={conversation.user.avatar}
                  greeting="你好，欢迎使用「教育」。"
                />
              ) : null}
              {educationMessages.length === 0 ? (
                <>
                  <p
                    className={cn(
                      "max-w-[min(560px,100%)] text-pretty text-[length:var(--font-size-sm)] font-[var(--font-weight-regular)] leading-relaxed text-text-secondary",
                      "ml-0 md:ml-[44px] -mt-[var(--space-250)]",
                    )}
                  >
                    {educationSpaces.length === 0
                      ? "你还没有加入任何教育空间，可以做如下操作："
                      : `当前已选择教育空间「${currentDemoEducationSpace?.name ?? ""}」（${
                          currentDemoEducationSpace?.kind === "institutional"
                            ? "机构教育空间"
                            : "家庭教育空间"
                        }）。你还可以创建或切换其他空间。`}
                  </p>
                  <div className="mt-[var(--space-200)] flex flex-wrap gap-[var(--space-200)] ml-0 md:ml-[44px]">
                    <ChatPromptButton onClick={() => handleSendMessage("创建教育空间")}>
                      创建教育空间
                    </ChatPromptButton>
                    {organizations.length > 0 ? (
                      <ChatPromptButton onClick={() => handleSendMessage("创建机构教育空间")}>
                        创建机构教育空间
                      </ChatPromptButton>
                    ) : null}
                    <ChatPromptButton onClick={() => handleSendMessage("创建家庭教育空间")}>
                      创建家庭教育空间
                    </ChatPromptButton>
                  </div>
                </>
              ) : null}
            </>
          ) : activeApp === PERSONAL_EDU_SPACE_APP_ID ? (
            <>
              {educationMessages.length === 0 ? (
                <ChatWelcome
                  avatarSrc={conversation.user.avatar}
                  greeting="你好，欢迎使用「教育」。请选择你的身份与创建方式，也可直接描述你的需求。"
                />
              ) : null}
              {educationMessages.length === 0 ? (
                <div className="flex flex-wrap gap-[var(--space-200)] ml-0 md:ml-[44px] -mt-[var(--space-400)]">
                  {PERSONAL_EDU_SPACE_ACTIONS.map((act) => (
                    <ChatPromptButton key={act.id} onClick={() => appendPersonalEduSpaceTurn(act.label)}>
                      {act.label}
                    </ChatPromptButton>
                  ))}
                </div>
              ) : null}
            </>
          ) : activeApp === "hospital" ? (
            <>
              {educationMessages.length === 0 ? (
                <ChatWelcome
                  avatarSrc={conversation.user.avatar}
                  greeting={`你好，我是你的医院场景专属 AI 助手。需要办理患者、排班、耗材或床位相关事务吗？`}
                />
              ) : null}
              {educationMessages.length === 0 && (
                <div className="flex flex-wrap gap-[var(--space-200)] ml-0 md:ml-[44px] -mt-[var(--space-400)]">
                  <ChatPromptButton onClick={() => handleSendMessage("查询今日入院待办")}>
                    查询今日入院待办
                  </ChatPromptButton>
                  <ChatPromptButton onClick={() => handleSendMessage("查看本科室医护排班")}>
                    查看本科室医护排班
                  </ChatPromptButton>
                  <ChatPromptButton onClick={() => handleSendMessage("高值耗材申领进度")}>
                    高值耗材申领进度
                  </ChatPromptButton>
                  <ChatPromptButton onClick={() => handleSendMessage("病区空床与候床队列")}>
                    病区空床与候床队列
                  </ChatPromptButton>
                  {organizations.length > 0 ? (
                    <ChatPromptButton onClick={handleOrgClick}>
                      切换组织
                    </ChatPromptButton>
                  ) : null}
                </div>
              )}
            </>
          ) : (
            <>
              {educationMessages.length === 0 ? (
                <ChatWelcome
                  avatarSrc={conversation.user.avatar}
                  greeting={`你好，我是你的教育专属AI助手。请问今天需要处理什么？`}
                />
              ) : null}

              {educationMessages.length === 0 && (
                <div className="flex flex-wrap gap-[var(--space-200)] ml-0 md:ml-[44px] -mt-[var(--space-400)]">
                  <ChatPromptButton onClick={() => handleSendMessage("员工管理")}>
                    员工管理
                  </ChatPromptButton>
                  <ChatPromptButton onClick={() => handleSendMessage("查看我的课表")}>
                    查看我的课表
                  </ChatPromptButton>
                  <ChatPromptButton onClick={() => handleSendMessage("布置作业")}>
                    布置作业
                  </ChatPromptButton>
                  <ChatPromptButton onClick={() => handleSendMessage("查看本月财务报表")}>
                    查看本月财务报表
                  </ChatPromptButton>
                  {organizations.length > 0 ? (
                    <ChatPromptButton onClick={handleOrgClick}>
                      切换组织
                    </ChatPromptButton>
                  ) : (
                    <>
                      <ChatPromptButton onClick={handleJoinOrg}>
                        加入组织
                      </ChatPromptButton>
                      <ChatPromptButton onClick={handleCreateOrg}>
                        创建组织
                      </ChatPromptButton>
                    </>
                  )}
                </div>
              )}
            </>
          )}

          {/* Conversation Messages */}
          {renderMessageList(secondaryPortalOpen ? educationMessages : messages, secondaryPortalOpen)}
          <div ref={scrollRef} />
        </div>
        </motion.div>
      </div>

      {/* 模块：底部区域（应用条 / 输入区）；内层 relative 供全部应用抽屉与输入行左右对齐 */}
      <div className="flex-none z-20 w-full pt-[var(--space-200)] pb-[var(--space-400)] px-[max(20px,var(--cui-padding-max))] min-px-[var(--space-500)]">
        {/* data-cui-dock-shell：与「全部应用」抽屉、应用条、ChatSender 同宽；供 DockAppSwitcherChip 面板完全对齐 */}
        <div
          data-cui-dock-shell
          className="relative w-full min-w-0 flex flex-col gap-[var(--space-200)]"
        >
        {/* 模块：全部应用抽屉（锚定本容器，左右与 ChatSender 整行一致） */}
        <AllAppsDrawer
          apps={apps}
          catalogAppIds={dockCatalogIds}
          isOpen={isAllAppsOpen}
          onClose={() => setIsAllAppsOpen(false)}
          onReorder={handleReorder}
          onRemoveFromDock={handleDockRemoveFromBar}
          onAddToDock={handleDockAddToBar}
          scenario={scenario}
        />

        {/* 模块：底部应用条（主入口应用 / 教育二级应用） */}
        <div
          data-testid="main-dock-bar"
          className="relative flex w-full min-h-[var(--space-800)] min-w-0 items-center gap-[var(--space-200)] p-[0px]"
        >
          <AnimatePresence mode="popLayout">
            {secondaryPortalOpen && portalSecondaryDockExpanded ? (
              <motion.div
                key={`portal-${activeApp}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={cn(
                  "flex flex-1 min-w-0 items-center justify-start",
                  "gap-[var(--space-200)]"
                )}
              >
                <button
                  type="button"
                  onClick={() => setPortalSecondaryDockExpanded(false)}
                  className="group flex h-[var(--space-800)] w-[var(--space-800)] shrink-0 items-center justify-center rounded-full border border-border bg-bg transition-all duration-300 ease-out hover:bg-[var(--black-alpha-11)]"
                  title="返回应用列表"
                  aria-label="返回应用列表"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="text-text-secondary transition-colors group-hover:text-text"
                  >
                    <path
                      d="M8.75 3.5L5.25 7L8.75 10.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <DockAppSwitcherChip
                  currentAppId={
                    activeApp === "hospital"
                      ? "hospital"
                      : activeApp === PERSONAL_EDU_SPACE_APP_ID
                        ? PERSONAL_EDU_SPACE_APP_ID
                        : "education"
                  }
                  apps={apps}
                  onSwitchApp={handlePortalDockSwitcherSelect}
                  scenario={scenario}
                />
                <div className="h-[16px] w-px shrink-0 bg-border" aria-hidden />
                <div className="flex min-w-0 flex-1 items-center gap-[var(--space-200)] overflow-x-auto scrollbar-hide">
                  {(activeApp === PERSONAL_EDU_SPACE_APP_ID || activeApp === "education") &&
                  isScenarioZeroNoOrg
                    ? null
                    : activeApp === PERSONAL_EDU_SPACE_APP_ID
                      ? PERSONAL_EDU_SPACE_ACTIONS.map((act) => (
                          <button
                            key={act.id}
                            type="button"
                            onClick={() => appendPersonalEduSpaceTurn(act.label)}
                            className="bg-bg flex h-[var(--space-800)] min-w-0 shrink cursor-pointer select-none items-center gap-[var(--space-100)] rounded-full border border-border px-[var(--space-300)] py-[var(--space-150)] transition-all duration-300 ease-out hover:bg-[var(--black-alpha-11)]"
                          >
                            <p className="max-w-[min(100vw-8rem,22rem)] text-pretty text-left text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] leading-snug text-[var(--color-text)]">
                              {act.label}
                            </p>
                          </button>
                        ))
                      : secondaryPortalApps.map((app) => (
                        <SecondaryAppButton
                          key={app.id}
                          app={app}
                          onMenuClick={(menu, appName) => {
                            const userMsg: Message = {
                              id: `user-${Date.now()}`,
                              senderId: currentUser.id,
                              content: `我想使用${appName}的「${menu}」功能`,
                              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                              createdAt: Date.now(),
                            }

                            const cardData = JSON.stringify({
                              title: `${appName} - ${menu}`,
                              description: `这是关于「${menu}」的专属指导内容，请根据提示进行操作。`,
                              detail:
                                "1. 明确您的操作目标\n2. 跟着助手一步步完成管理流程\n3. 遇到不懂的问题随时向我提问",
                              imageSrc: app.imageSrc,
                              cardActions: {
                                primary: {
                                  label: "按步骤继续",
                                  sendText: `我会按「${appName}」的「${menu}」指引分步完成；先帮我确认第一步要准备什么。`,
                                },
                                secondary: { label: "换一个功能", preset: "more_recommend" as const },
                              },
                            })
                            const botMsg: Message = {
                              id: `bot-card-${Date.now() + 1}`,
                              senderId: conversation.user.id,
                              content: `<<<RENDER_GENERIC_CARD>>>:${cardData}`,
                              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                              createdAt: Date.now() + 1,
                            }

                            setEducationMessages((prev) => [...prev, userMsg])

                            setTimeout(() => {
                              setEducationMessages((prev) => [...prev, botMsg])
                              if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: "smooth" })
                            }, 500)
                          }}
                        />
                      ))}
                </div>
              </motion.div>
            ) : !secondaryPortalOpen && shortcutBarAppId != null && onDockBarBack ? (
              <motion.div
                key={`dock-shortcuts-${shortcutBarAppId}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={cn(
                  "flex flex-1 min-w-0 items-center justify-start",
                  isScenarioFourOrMainEntry(scenario)
                    ? "gap-[var(--space-150)]"
                    : "gap-[var(--space-200)]"
                )}
              >
                <>
                  {/* 场景二（多组织）与其余场景统一：返回 + 《切换应用》浮层（DockAppSwitcherChip） */}
                  <button
                    type="button"
                    onClick={() => onDockBarBack()}
                    className="group flex h-[var(--space-800)] w-[var(--space-800)] shrink-0 items-center justify-center rounded-full border border-border bg-bg transition-all duration-300 ease-out hover:bg-[var(--black-alpha-11)]"
                    title="返回应用列表"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      className="text-text-secondary transition-colors group-hover:text-text"
                    >
                      <path
                        d="M8.75 3.5L5.25 7L8.75 10.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <DockAppSwitcherChip
                    currentAppId={shortcutBarAppId}
                    apps={apps}
                    scenario={scenario}
                    onSwitchApp={(app) => {
                      if (onDockAppActivate) {
                        onDockAppActivate(app.id, app.name, currentOrg, hasJoinedOrganizations)
                      }
                    }}
                  />
                  <div className="h-[16px] w-px shrink-0 bg-border" />
                </>

                {/* 当前应用的快捷业务指令 */}
                <div className="flex min-w-0 flex-1 items-center gap-[var(--space-200)] overflow-x-auto scrollbar-hide">
                  {getDockBarInlineShortcuts(shortcutBarAppId).map((text) => (
                    <button
                      key={text}
                      type="button"
                      onClick={() => handleSendMessage(text)}
                      className="bg-bg flex h-[var(--space-800)] shrink-0 cursor-pointer select-none items-center gap-[var(--space-100)] rounded-full border border-border px-[var(--space-300)] py-[var(--space-150)] transition-all duration-300 ease-out hover:bg-[var(--black-alpha-11)]"
                    >
                      <p className="text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] leading-none whitespace-nowrap text-[var(--color-text)]">
                        {text}
                      </p>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="default-apps"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex w-full min-w-0 flex-1 items-center gap-[var(--space-200)]"
              >
                <div className="flex min-w-0 flex-1 items-center gap-[var(--space-200)] overflow-x-auto scrollbar-hide">
                {apps.map((app, index) => (
                  <button
                    key={app.id}
                    draggable={longPressIndex === index}
                    onClick={(e) => {
                      if (longPressIndex === index) {
                        e.preventDefault();
                        setLongPressIndex(null);
                        return;
                      }
                      if (app.id === PERSONAL_EDU_SPACE_APP_ID) {
                        if (activeApp === "education" || activeApp === PERSONAL_EDU_SPACE_APP_ID) {
                          setPortalSecondaryDockExpanded(true)
                        } else {
                          openPortalRootApp("education")
                        }
                        return
                      }
                      if (PORTAL_ROOT_APP_IDS.has(app.id)) {
                        if (activeApp === app.id) {
                          setPortalSecondaryDockExpanded(true)
                        } else if (
                          (isScenarioTwoFamily(scenario) || isNoOrgRoute) &&
                          !isScenarioTwoMultiOrgs(scenario) &&
                          /** 场景零未加入组织：「教育」为空间应用壳层，只打开门户，勿自动发 dock 首条（如「查看我的课表」） */
                          !(app.id === "education" && isScenarioZeroNoOrg)
                        ) {
                          onDockAppActivate?.(app.id, app.name, currentOrg, hasJoinedOrganizations)
                          const first = getDockBarInlineShortcuts(app.id)[0]
                          if (first) queueMicrotask(() => handleSendMessageRef.current(first))
                        } else if (app.id === "education" || app.id === "hospital") {
                          openPortalRootApp(app.id)
                        }
                        return
                      }
                      if (onDockAppActivate) {
                        onDockAppActivate(app.id, app.name, currentOrg, hasJoinedOrganizations)
                      }
                    }}
                    onMouseDown={(e) => {
                      longPressTimerRef.current = setTimeout(() => {
                        setLongPressIndex(index);
                      }, 500);
                    }}
                    onMouseUp={() => {
                      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
                    }}
                    onMouseLeave={() => {
                      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
                      if (draggedIndex === null) setLongPressIndex(null);
                    }}
                    onTouchStart={(e) => {
                      longPressTimerRef.current = setTimeout(() => {
                        setLongPressIndex(index);
                      }, 500);
                    }}
                    onTouchEnd={() => {
                      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
                    }}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragEnd={(e) => {
                      handleDragEnd();
                      setLongPressIndex(null);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                    }}
                    className={cn(
                      "bg-bg flex gap-[var(--space-100)] h-[var(--space-800)] items-center px-[var(--space-300)] py-[var(--space-150)] rounded-full shrink-0 hover:bg-[var(--black-alpha-11)] transition-all duration-300 ease-out border border-border select-none",
                      longPressIndex === index ? "cursor-grab active:cursor-grabbing scale-105 shadow-elevation-sm ring-2 ring-primary/20" : "cursor-pointer",
                      draggedIndex === index && 'opacity-20 scale-95'
                    )}
                  >
                    <AppIcon
                      imageSrc={app.icon.imageSrc}
                      className="size-[18px]"
                    />
                    <p className="text-[length:var(--font-size-xs)] leading-none text-[var(--color-text)] whitespace-nowrap font-[var(--font-weight-medium)]">
                      {app.name}
                    </p>
                  </button>
                ))}
                </div>
                <button
                  type="button"
                  onClick={() => setIsAllAppsOpen(true)}
                  className="bg-bg flex h-[var(--space-800)] shrink-0 cursor-pointer select-none items-center gap-[var(--space-100)] rounded-full border border-border px-[var(--space-300)] py-[var(--space-150)] transition-all duration-300 ease-out hover:bg-[var(--black-alpha-11)]"
                  title="全部应用"
                  aria-label="全部应用：排序、添加或移除底部应用"
                >
                  <LayoutGrid className="size-[18px] shrink-0 text-text-secondary" aria-hidden />
                  <span className="text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] leading-none whitespace-nowrap text-[var(--color-text)]">
                    全部
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 模块：输入区（文本输入 / 发送 / 快捷入口） */}
        <ChatSender
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSendMessage={handleSendMessage}
          handleKeyDown={handleKeyDown}
        />
        </div>
      </div>
          </>
        )
        if (!scenarioFiveUnderBarLayout) return cuiBelowNavColumn
        return (
          <div className="flex min-h-0 min-w-0 flex-1 flex-row">
            {historyOpen && onHistoryOpenChange && onSelect ? (
              <>
                <HistorySidebar
                  layout="split"
                  open
                  persistent
                  widthPx={sessionSidebarWidthProp}
                  onOpenChange={onHistoryOpenChange}
                  conversations={cuiHistoryConversations}
                  selectedId={selectedId}
                  onSelect={applyPrimarySessionListSelection}
                  pinnedSessionId={cuiMainChatId}
                  showConversationTypeTags
                  organizations={sessionListOrganizations}
                  sessionListPreferredOrgId={currentOrg}
                  onJumpToConversationDay={handleJumpToConversationDay}
                  mainChatHistory={mainChatHistory}
                  onPickMainChatHistoryEntry={
                    onSelectMainChatHistoryEntry ? handleSidebarMainHistorySelect : undefined
                  }
                  activeMainChatHistoryEntryId={activeMainChatHistoryEntryId}
                />
                <div
                  role="separator"
                  aria-orientation="vertical"
                  className="group relative z-[55] flex w-2 shrink-0 cursor-col-resize touch-none select-none justify-center hover:bg-[var(--black-alpha-8)]"
                  onPointerDown={handleSessionResizePointerDown}
                >
                  <div className="h-full w-px rounded-full bg-border transition-colors group-hover:bg-primary/35" />
                </div>
              </>
            ) : null}
            <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-cui-bg">{cuiBelowNavColumn}</div>
          </div>
        )
      })()}

      <MainChatHistorySheet
        open={mainChatHistoryOpen}
        onOpenChange={setMainChatHistoryOpen}
        entries={mainChatHistory}
        onSelectEntry={(id) => {
          handleSidebarMainHistorySelect(id)
          setMainChatHistoryOpen(false)
        }}
      />

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Floating Application Windows */}
      <AnimatePresence>
        {floatingApps.map((appId, idx) => {
          const app = resolveFloatingAppLabel(appId, scenario);
          if (!app) return null;
          const floatingPortalOpen = appId === "education" || appId === "hospital"
          const floatingPortalApps =
            appId === "hospital" ? HOSPITAL_PORTAL_APPS : educationPortalApps
          const floatingShowEduSpaceNav = isNoOrgRoute && appId === "education"

          return (
            <FloatingAppWindow
              key={appId}
              appId={appId}
              title={app.name}
              onClose={() => {
                setFloatingApps(prev => prev.filter(id => id !== appId));
              }}
              defaultPos={{ x: 100 + idx * 20, y: 100 + idx * 20 }}
            >
              {/* 完全复用主界面的二级应用布局结构 */}
              <div className="absolute inset-0 flex flex-row w-full isolate overflow-hidden bg-cui-bg">
                {floatingPortalOpen && (
                  <SecondaryAppHistorySidebar
                    open={secondaryHistoryOpen}
                    onOpenChange={setSecondaryHistoryOpen}
                    sessions={secondaryAppSessions}
                    selectedId={selectedSecondarySession}
                    onSelect={handleSecondarySessionSelect}
                    onNewConversation={handleSecondaryAppNewConversation}
                    mode="push"
                  />
                )}

                {/* Main Content Wrapper - no translate needed in push mode */}
                <div className="flex flex-col flex-1 h-full w-full shrink-0 min-w-0 bg-cui-bg">
                  {/* Header - 使用完整的 ChatNavBar 组件 */}
                  <ChatNavBar 
                    title=""
                    onToggleHistory={undefined}
                    onNewMessage={handleNewConversation}
                    currentOrg={navBarOrganizationId}
                    organizations={organizations}
                    onOrgSelect={handleNavBarOrgSelect}
                    organizationSwitcherMode={isNavContentScopeMode ? "content-scope" : "session"}
                    onCreateOrg={handleCreateOrg}
                    onJoinOrg={handleJoinOrg}
                    showModelSelect
                    currentModel={currentModel}
                    models={AVAILABLE_MODELS}
                    onModelSelect={handleModelSwitch}
                    showIndependentWindow={canOpenPairedStandaloneCui}
                    navCenterSlot={
                      floatingShowEduSpaceNav ? (
                        <SessionListEduSpaceHeader
                          onCreateInstitutional={() => handleSendMessage("创建机构教育空间")}
                          onCreateFamily={() => handleSendMessage("创建家庭教育空间")}
                          onJoinSpace={() => handleSendMessage("加入教育空间")}
                          popoverAlign="end"
                        />
                      ) : null
                    }
                    showNoOrgQuickEntry={organizations.length === 0 && !floatingShowEduSpaceNav}
                    onQuickCreateOrg={handleCreateOrg}
                    onQuickJoinOrg={handleJoinOrg}
                    onIndependentWindow={
                      canOpenPairedStandaloneCui
                        ? () => onOpenStandaloneMainCui?.()
                        : undefined
                    }
                  />

                  {/* Main Content Area */}
                  <motion.div 
                    key={`floating-${appId}`}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    className="flex-1 min-h-0 relative z-10 overflow-y-auto overflow-x-hidden scrollbar-hide"
                  >
                    <div className="flex flex-col gap-[var(--space-800)] w-full px-[var(--space-400)] py-[var(--space-400)] pt-[var(--space-300)]">
                      {floatingPortalOpen && educationMessages.length === 0 ? (
                        <ChatWelcome
                          avatarSrc={conversation.user.avatar}
                          greeting={
                            appId === "hospital"
                              ? `你好，我是你的医院场景专属 AI 助手。`
                              : appId === "education"
                                ? isScenarioZeroNoOrg
                                  ? "你好，欢迎使用「教育」。"
                                  : `你好，我是你的专属AI助手。请问今天需要处理什么？`
                                : `你好，我是你的${app.name}专属AI助手。请问今天需要处理什么？`
                          }
                        />
                      ) : null}

                      {floatingPortalOpen && educationMessages.length === 0 && (
                        <div className="flex flex-wrap gap-[var(--space-200)] ml-0 md:ml-[44px] -mt-[var(--space-400)]">
                          {appId === "hospital" ? (
                            <>
                              <ChatPromptButton onClick={() => handleSendMessage("查询今日入院待办")}>
                                查询今日入院待办
                              </ChatPromptButton>
                              <ChatPromptButton onClick={() => handleSendMessage("查看本科室医护排班")}>
                                查看本科室医护排班
                              </ChatPromptButton>
                            </>
                          ) : appId === "education" && isScenarioZeroNoOrg ? (
                            <>
                              <p
                                className={cn(
                                  "w-full max-w-[min(560px,100%)] text-pretty text-[length:var(--font-size-sm)] font-[var(--font-weight-regular)] leading-relaxed text-text-secondary",
                                )}
                              >
                                {educationSpaces.length === 0
                                  ? "你还没有加入任何教育空间，可以做如下操作："
                                  : `当前已选择教育空间「${currentDemoEducationSpace?.name ?? ""}」（${
                                      currentDemoEducationSpace?.kind === "institutional"
                                        ? "机构教育空间"
                                        : "家庭教育空间"
                                    }）。你还可以创建或切换其他空间。`}
                              </p>
                              <div className="flex w-full flex-wrap gap-[var(--space-200)]">
                                <ChatPromptButton onClick={() => handleSendMessage("创建教育空间")}>
                                  创建教育空间
                                </ChatPromptButton>
                                {organizations.length > 0 ? (
                                  <ChatPromptButton onClick={() => handleSendMessage("创建机构教育空间")}>
                                    创建机构教育空间
                                  </ChatPromptButton>
                                ) : null}
                                <ChatPromptButton onClick={() => handleSendMessage("创建家庭教育空间")}>
                                  创建家庭教育空间
                                </ChatPromptButton>
                              </div>
                            </>
                          ) : (
                            <>
                              <ChatPromptButton onClick={() => handleSendMessage("查看我的课表")}>
                                查看我的课表
                              </ChatPromptButton>
                              <ChatPromptButton onClick={() => handleSendMessage("布置作业")}>
                                布置作业
                              </ChatPromptButton>
                              <ChatPromptButton onClick={() => handleSendMessage("查看本月财务报表")}>
                                查看本月财务报表
                              </ChatPromptButton>
                              <ChatPromptButton onClick={handleOrgClick}>
                                切换组织
                              </ChatPromptButton>
                            </>
                          )}
                        </div>
                      )}

                      {floatingPortalOpen ? renderMessageList(educationMessages, true) : null}
                      <div ref={scrollRef} />
                    </div>
                  </motion.div>

                  {/* Input Area and Bottom App Bar */}
                  <div
                    data-cui-dock-shell
                    className="relative z-20 flex w-full flex-none flex-col gap-[var(--space-200)] px-[var(--space-400)] pb-[var(--space-400)] pt-[var(--space-200)]"
                  >
                    {floatingPortalOpen && (
                      <div className="relative flex min-h-[var(--space-800)] w-full min-w-0 items-center gap-[var(--space-200)]">
                        <button
                          type="button"
                          onClick={() => {
                            setFloatingApps((prev) => prev.filter((id) => id !== appId))
                          }}
                          className="group flex h-[var(--space-800)] w-[var(--space-800)] shrink-0 items-center justify-center rounded-full border border-border bg-bg transition-all duration-300 ease-out hover:bg-[var(--black-alpha-11)]"
                          title="关闭窗口"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            className="text-text-secondary transition-colors group-hover:text-text"
                          >
                            <path
                              d="M8.75 3.5L5.25 7L8.75 10.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <DockAppSwitcherChip
                          currentAppId={appId}
                          apps={apps}
                          scenario={scenario}
                          onSwitchApp={(app) => {
                            if (PORTAL_ROOT_APP_IDS.has(app.id) || app.id === PERSONAL_EDU_SPACE_APP_ID) {
                              setFloatingApps((prev) => prev.map((x) => (x === appId ? app.id : x)))
                              return
                            }
                            setFloatingApps((prev) => prev.filter((id) => id !== appId))
                            setActiveApp(null)
                            onDockAppActivate?.(app.id, app.name, currentOrg, hasJoinedOrganizations)
                          }}
                        />
                        <div className="h-[16px] w-px shrink-0 bg-border" aria-hidden />
                        <div className="flex min-w-0 flex-1 items-center gap-[var(--space-200)] overflow-x-auto scrollbar-hide">
                          {floatingPortalApps.map((portalApp) => (
                            <SecondaryAppButton
                              key={portalApp.id}
                              app={portalApp}
                              onMenuClick={(menu, appName) => {
                                const userMsg: Message = {
                                  id: `user-${Date.now()}`,
                                  senderId: currentUser.id,
                                  content: `我想使用${appName}的「${menu}」功能`,
                                  timestamp: new Date().toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }),
                                  createdAt: Date.now(),
                                }

                                const cardData = JSON.stringify({
                                  title: `${appName} - ${menu}`,
                                  description: `这是关于「${menu}」的专属指导内容，请根据提示进行操作。`,
                                  detail:
                                    "1. 明确您的操作目标\n2. 跟着助手一步步完成管理流程\n3. 遇到不懂的问题随时向我提问",
                                  imageSrc: portalApp.imageSrc,
                                  cardActions: {
                                    primary: {
                                      label: "按步骤继续",
                                      sendText: `我会按「${appName}」的「${menu}」指引分步完成；先帮我确认第一步要准备什么。`,
                                    },
                                    secondary: { label: "换一个功能", preset: "more_recommend" as const },
                                  },
                                })
                                const botMsg: Message = {
                                  id: `bot-card-${Date.now() + 1}`,
                                  senderId: conversation.user.id,
                                  content: `<<<RENDER_GENERIC_CARD>>>:${cardData}`,
                                  timestamp: new Date().toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }),
                                  createdAt: Date.now() + 1,
                                }

                                setEducationMessages((prev) => [...prev, userMsg])

                                setTimeout(() => {
                                  setEducationMessages((prev) => [...prev, botMsg])
                                  if (scrollRef.current)
                                    scrollRef.current.scrollIntoView({ behavior: "smooth" })
                                }, 500)
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Input for Floating Window */}
                    <ChatSender
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                      handleSendMessage={handleSendMessage}
                      handleKeyDown={handleKeyDown}
                    />
                  </div>
                </div>
              </div>
            </FloatingAppWindow>
          );
        })}
      </AnimatePresence>

      {/* Task Detail Drawer */}
      <TaskDetailDrawer
        isOpen={isTaskDrawerOpen}
        onClose={() => setIsTaskDrawerOpen(false)}
        task={selectedTask}
      />

      {isCuiCardRulesScenario(scenario) ? (
        <>
          <CuiRulesModalsHost open={cuiRulesModal} onOpenChange={setCuiRulesModal} />
          <CuiRulesSecondaryPanel
            open={cuiRulesSidebarSource != null}
            onClose={() => setCuiRulesSidebarMessageId(null)}
            sourceLabel={cuiRulesSidebarSource?.label ?? ""}
            initialParticipants={cuiRulesSidebarSource?.participants ?? []}
            initialNote={cuiRulesSidebarSource?.note ?? ""}
            onSave={({ participants, note }) => {
              const id = cuiRulesSidebarSource?.messageId
              if (!id) return
              setMessages((prev) =>
                patchCuiRulesMessage(prev, id, (p) => {
                  if (p.variant !== "plan") return p
                  return {
                    ...p,
                    participants: participants.length ? participants : p.participants,
                    participantsNote: note || undefined,
                  }
                })
              )
            }}
          />
        </>
      ) : null}
        </>
        )}
      </div>
      </div>
      </div>
      <AnimatePresence initial={false}>
        {scheduleSideSheet && scheduleSideSheet.surface === "main" ? (
          <>
            <motion.div
              key="schedule-side-main-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="pointer-events-auto absolute inset-0 z-[199] bg-[rgba(15,23,42,0.45)]"
              aria-hidden
            />
            <motion.div
              key={`schedule-side-main-panel-${scheduleSideSheet.item.id}`}
              initial={{ x: 36, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 28, opacity: 0 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 right-0 z-[200] flex w-[min(100%,720px)] max-w-full min-w-0 justify-end"
            >
              <ScheduleSideConversationPanel
                scheduleId={scheduleSideSheet.item.id}
                botAvatarSrc={conversation.user.avatar}
                userAvatarSrc={currentUser.avatar}
                userDisplayName={currentUser.name ?? "我"}
                aiSenderId={conversation.user.id}
                scheduleTitle={scheduleSideSheet.item.title}
                onClose={closeScheduleSideSheet}
                threadBridgeRef={scheduleSideThreadBridgeRef}
                onSideThreadMirror={mirrorScheduleSideThreadToCalendar}
                onVvAction={handleCalendarDockVvAction}
                schedulePanelAppId={scheduleSideSheet.appId}
                schedulePanelSurface={scheduleSideSheet.surface}
                scheduleMeetingItems={vvMeetingItems}
                lockedScheduleOrganizationName={resolvedOrgNameForEmployeeStrip}
                employeeDemoOrgId={currentOrg}
                employeeInviteRecords={employeeInviteRecordsForScope}
                onEmployeeInviteRecordsChange={updateEmployeeInviteRecords}
                onMirrorEmployeeMgmtToEmployeeApp={mirrorEmployeeMgmtToEmployeeApp}
                onSidePanelScheduleIntent={handleScheduleSidePanelIntent}
                naturalExamples={SCHEDULE_APP_QUICK_COMMANDS.map((c) => ({
                  label: c.label,
                  sendText: c.sendText,
                }))}
              >
                <ScheduleAgendaModalPanel
                  key={scheduleSideSheet.item.id}
                  item={scheduleSideSheet.item}
                  treatDateLabelTodayAsNotPast={scheduleSideSheet.treatDateLabelTodayAsNotPast}
                  initialPanelMode={scheduleSideSheet.initialSidePanelMode}
                  onItemUpdated={(u) => {
                    setScheduleSideSheet((s) => (s?.item.id === u.id ? { ...s, item: u } : s))
                  }}
                  onRequestClose={closeScheduleSideSheet}
                  onVvAction={handleCalendarDockVvAction}
                />
              </ScheduleSideConversationPanel>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
          </VvChatFullInsetPortalHost>
        </VvChatInsetDialogPortalHost>
      </VvScheduleSideSheetContext.Provider>
    </UserCalendarsProvider>
  )
}