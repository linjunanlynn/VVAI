import * as React from "react"
import { ScrollArea } from "../components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Input } from "../components/ui/input";
import { AllAppsDrawer } from "./AllAppsDrawer";

// Inlined SVG path data
const svgPathsFromCourse = {
  p13fad580: "M7.5 0C8.15304 0 8.70809 0.4175 8.91406 1H10.1667C10.9951 1 11.6667 1.67157 11.6667 2.5V6.5C11.6667 6.77614 11.4428 7 11.1667 7C10.8905 7 10.6667 6.77614 10.6667 6.5V2.5C10.6667 2.22386 10.4428 2 10.1667 2H8.91406C8.70809 2.5825 8.15304 3 7.5 3H4.16667C3.51363 3 2.95857 2.5825 2.7526 2H1.5C1.22386 2 1 2.22386 1 2.5V11.8333C1 12.1095 1.22386 12.3333 1.5 12.3333H3.83333C4.10948 12.3333 4.33333 12.5572 4.33333 12.8333C4.33333 13.1095 4.10948 13.3333 3.83333 13.3333H1.5C0.671573 13.3333 1.3422e-08 12.6618 0 11.8333V2.5C1.50329e-07 1.67157 0.671573 1 1.5 1H2.7526C2.95857 0.4175 3.51363 0 4.16667 0H7.5ZM4.66667 8.33333C4.94281 8.33333 5.16667 8.55719 5.16667 8.83333C5.16667 9.10948 4.94281 9.33333 4.66667 9.33333H3.5C3.22386 9.33333 3 9.10948 3 8.83333C3 8.55719 3.22386 8.33333 3.5 8.33333H4.66667ZM8.16667 5.16667C8.44281 5.16667 8.66667 5.39052 8.66667 5.66667C8.66667 5.94281 8.44281 6.16667 8.16667 6.16667H3.5C3.22386 6.16667 3 5.94281 3 5.66667C3 5.39052 3.22386 5.16667 3.5 5.16667H8.16667ZM4.16667 1C3.89052 1 3.66667 1.22386 3.66667 1.5C3.66667 1.77614 3.89052 2 4.16667 2H7.5C7.77614 2 8 1.77614 8 1.5C8 1.22386 7.77614 1 7.5 1H4.16667Z",
  p18316300: "M9.16667 0C9.90305 0 10.5 0.596954 10.5 1.33333V2H10.6667C11.403 2 12 2.59695 12 3.33333V12C12 12.7133 11.4398 13.296 10.7354 13.3317L10.6667 13.3333H1.33333L1.26465 13.3317C0.582934 13.2971 0.0362174 12.7504 0.0016276 12.0687L0 12V2H0.000976563L0 1.66667V1.33333C0 0.596954 0.596954 4.16082e-08 1.33333 0H9.16667ZM1 12C1 12.1841 1.14924 12.3333 1.33333 12.3333H10.6667C10.8508 12.3333 11 12.1841 11 12V3.33333C11 3.14924 10.8508 3 10.6667 3H1V12ZM1.33333 1C1.14924 1 1 1.14924 1 1.33333V1.66667C1 1.85076 1.14924 2 1.33333 2H9.5V1.33333C9.5 1.16077 9.36889 1.01874 9.20085 1.00163L9.16667 1H1.33333Z",
  p28d9a200: "M9.84733 10.8333C9.84733 11.2936 9.47423 11.6667 9.014 11.6667C8.55376 11.6667 8.18066 11.2936 8.18066 10.8333C8.18066 10.3731 8.55376 10 9.014 10C9.47423 10 9.84733 10.3731 9.84733 10.8333Z",
  p2e8d5300: "M6.5 7C6.77614 7 7 7.22386 7 7.5C7 7.77614 6.77614 8 6.5 8H3.5C3.22386 8 3 7.77614 3 7.5C3 7.22386 3.22386 7 3.5 7H6.5Z",
  p320a2a00: "M8.5 5C8.77614 5 9 5.22386 9 5.5C9 5.77614 8.77614 6 8.5 6H3.5C3.22386 6 3 5.77614 3 5.5C3 5.22386 3.22386 5 3.5 5H8.5Z",
  p3a2c0c80: "M8.5 0C8.7599 0 8.97348 0.198296 8.99771 0.451847L9 0.5V1H10.1667C10.9714 1 11.6282 1.63375 11.665 2.42939L11.6667 2.5V10.8333C11.6667 11.6381 11.0329 12.2948 10.2373 12.3317L10.1667 12.3333H1.5C0.695242 12.3333 0.0385036 11.6996 0.00163266 10.9039L0 10.8333V2.5C0 1.69524 0.633745 1.0385 1.42939 1.00163L1.5 1H2.66667V0.5C2.66667 0.223858 2.89052 0 3.16667 0C3.42657 0 3.64015 0.198296 3.66438 0.451847L3.66667 0.5V1H8V0.5C8 0.223858 8.22386 0 8.5 0ZM2.66667 2H1.5C1.2401 2 1.02652 2.1983 1.00229 2.45185L1 2.5V10.8333C1 11.0932 1.1983 11.3068 1.45185 11.331L1.5 11.3333H10.1667C10.4266 11.3333 10.6401 11.135 10.6644 10.8815L10.6667 10.8333V2.5C10.6667 2.2401 10.4684 2.02652 10.2148 2.00229L10.1667 2H9V2.5C9 2.77614 8.77614 3 8.5 3C8.2401 3 8.02652 2.8017 8.00229 2.54815L8 2.5V2H3.66667V2.5C3.66667 2.77614 3.44281 3 3.16667 3C2.90677 3 2.69318 2.8017 2.66896 2.54815L2.66667 2.5V2ZM3.83333 8.33333C4.10948 8.33333 4.33333 8.55719 4.33333 8.83333C4.33333 9.09323 4.13504 9.30682 3.88149 9.33104L3.83333 9.33333H3.16667C2.89052 9.33333 2.66667 9.10947 2.66667 8.83333C2.66667 8.57343 2.86496 8.35985 3.11851 8.33562L3.16667 8.33333H3.83333ZM6.16667 8.33333C6.44281 8.33333 6.66667 8.55719 6.66667 8.83333C6.66667 9.09323 6.46837 9.30682 6.21482 9.33104L6.16667 9.33333H5.5C5.22386 9.33333 5 9.10947 5 8.83333C5 8.57343 5.1983 8.35985 5.45185 8.33562L5.5 8.33333H6.16667ZM3.83333 6.33333C4.10948 6.33333 4.33333 6.55719 4.33333 6.83333C4.33333 7.09323 4.13504 7.30682 3.88149 7.33104L3.83333 7.33333H3.16667C2.89052 7.33333 2.66667 7.10948 2.66667 6.83333C2.66667 6.57343 2.86496 6.35985 3.11851 6.33562L3.16667 6.33333H3.83333ZM6.16667 6.33333C6.44281 6.33333 6.66667 6.55719 6.66667 6.83333C6.66667 7.09323 6.46837 7.30682 6.21482 7.33104L6.16667 7.33333H5.5C5.22386 7.33333 5 7.10948 5 6.83333C5 6.57343 5.1983 6.35985 5.45185 6.33562L5.5 6.33333H6.16667ZM8.5 6.33333C8.77614 6.33333 9 6.55719 9 6.83333C9 7.09323 8.8017 7.30682 8.54815 7.33104L8.5 7.33333H7.83333C7.55719 7.33333 7.33333 7.10948 7.33333 6.83333C7.33333 6.57343 7.53163 6.35985 7.78518 6.33562L7.83333 6.33333H8.5ZM3.83333 4.33333C4.10948 4.33333 4.33333 4.55719 4.33333 4.83333C4.33333 5.09323 4.13504 5.30682 3.88149 5.33104L3.83333 5.33333H3.16667C2.89052 5.33333 2.66667 5.10948 2.66667 4.83333C2.66667 4.57343 2.86496 4.35985 3.11851 4.33562L3.16667 4.33333H3.83333ZM6.16667 4.33333C6.44281 4.33333 6.66667 4.55719 6.66667 4.83333C6.66667 5.09323 6.46837 5.30682 6.21482 5.33104L6.16667 5.33333H5.5C5.22386 5.33333 5 5.10948 5 4.83333C5 4.57343 5.1983 4.35985 5.45185 4.33562L5.5 4.33333H6.16667ZM8.5 4.33333C8.77614 4.33333 9 4.55719 9 4.83333C9 5.09323 8.8017 5.30682 8.54815 5.33104L8.5 5.33333H7.83333C7.55719 5.33333 7.33333 5.10948 7.33333 4.83333C7.33333 4.57343 7.53163 4.35985 7.78518 4.33562L7.83333 4.33333H8.5Z",
  p4d78200: "M9.014 8C10.7312 8 12.1835 9.12882 12.6719 10.6836C12.7025 10.7811 12.7025 10.8856 12.6719 10.9831C12.1835 12.5378 10.7312 13.6667 9.014 13.6667C7.29686 13.6666 5.84476 12.5378 5.35644 10.9831C5.32583 10.8856 5.32583 10.7811 5.35644 10.6836C5.84476 9.12885 7.29686 8.00005 9.014 8ZM9.014 9C7.80195 9.00005 6.76699 9.76164 6.36263 10.8333C6.76699 11.905 7.80195 12.6666 9.014 12.6667C10.2261 12.6667 11.261 11.905 11.6654 10.8333C11.261 9.76165 10.2261 9 9.014 9Z",
};

import { Conversation, currentUser, Message } from "../components/chat/data"
import { cn } from "../components/ui/utils"
import { PersonalInfoManager } from "../components/chat/PersonalInfoManager"
import { HistorySidebar } from "../components/chat/HistorySidebar"
import { 
  TimestampSeparator
} from "../components/chat/ChatComponents"
import { SidebarIcon } from "../components/chat/SidebarIcons"
import { CreateEmailForm } from "../components/chat/CreateEmailForm"
import { Button } from "../components/ui/button"
import { GenericCard } from "../components/main-ai/GenericCard"
import { AppIcon } from "../components/main-ai/AppIcon"
import { ChatNavBar, type FreshUserEduHierarchyGroup } from "./ChatNavBarFreshUser"
import { ChatWelcome } from "../components/chat/ChatWelcome"
import { PinnedTaskCard } from "../components/chat/PinnedTaskCard"
import { TaskDetailDrawer } from "../components/chat/TaskDetailDrawer"
import { ChatMessageBubble } from "../components/chat/ChatMessageBubble"
import { AssistantMessageContentColumn } from "./MessageOperationSource"
import { ChatSender } from "../components/chat/ChatSender"
import { OrganizationSwitcherCard, Organization } from "../components/main-ai/OrganizationSwitcherCard"
import { ChatPromptButton } from "../components/chat/ChatPromptButton"
import { CreateOrgFormCard } from "../components/main-ai/CreateOrgFormCard"
import { EducationNoEduWelcomeCard } from "./EducationNoEduWelcomeCard"
import { EducationWithSpaceWelcomeCard } from "./EducationWithSpaceWelcomeCard"
import { EducationSpaceCreatedCard } from "./EducationSpaceCreatedCard"
import { FreshUserOnboardingCard } from "./FreshUserOnboardingCard"
import { JoinEducationSpaceHintCard } from "./JoinEducationSpaceHintCard"
import { EducationSpaceTypePickerCard } from "./EducationSpaceTypePickerCard"
import { CreateFamilyEducationSpaceCard } from "./CreateFamilyEducationSpaceCard"
import {
  CreateInstitutionalEducationSpaceCard,
  type InstitutionalEducationSpacePayload,
} from "./CreateInstitutionalEducationSpaceCard"
import { FamilyEducationRoleCard } from "./FamilyEducationRoleCard"
import type { FamilyCreatorRole } from "./educationSpaceTypes"
import {
  loadEducationSpaces,
  saveEducationSpaces,
  getEducationWelcomeShown,
  setEducationWelcomeShown,
  purgeNoEduStoredDataIfReload,
  EDU_NO_EDU_THREAD_KEY,
  type StoredEducationSpace,
} from "./educationSpaceSession"
import { CreateOrgSuccessCard } from "../components/main-ai/CreateOrgSuccessCard"
import { JoinOrgFormCard } from "../components/main-ai/JoinOrgFormCard"
import { JoinOrgConfirmCard } from "../components/main-ai/JoinOrgConfirmCard"
import { OrganizationSwitcherButton } from "./OrganizationSwitcherButton"
import { SecondaryAppHistorySidebar, SecondaryAppSession } from "./SecondaryAppHistorySidebar"
import { AVAILABLE_MODEL_FAMILIES } from "./modelData"

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
import courseIcon from 'figma:asset/ac6e3391c1eb88804cbf0804668d449463a1e1a3.png';
import orgIcon from 'figma:asset/58a97c06b4ae6edfc613d20add2fb4ead0363c64.png';

import { Calculator, BookA, PenTool, Users, ArrowLeft, MoreHorizontal, Briefcase, ShoppingBag, DollarSign, GripHorizontal, ChevronDown, Boxes, Package, Upload, BadgeDollarSign, Clock, CalendarCheck, BarChart3, UserCog, Receipt, History, PieChart, BookOpen, ShoppingCart, GraduationCap, UserCheck, TrendingUp, TrendingDown, Landmark, FileSpreadsheet, PanelLeft, Square, X, AppWindow, Maximize2, UserPlus, Gift, ClipboardList } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { useHref } from "react-router"
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

/** 与 V2 一致：家庭教育空间行图标（本工程无独立 PNG 时用教育主图标） */
const familyEducationIcon = educationIcon

const DATA_VERSION = 17;

/** 新用户无组织 + 教育应用：默认展示的「已加入」家庭教育空间（仅演示，不落库） */
const NO_ORG_DEFAULT_JANE_EDU_ID = "no-org-jane-edu-default"
const NO_ORG_DEFAULT_JANE_EDU_SPACE: StoredEducationSpace = {
  id: NO_ORG_DEFAULT_JANE_EDU_ID,
  name: "Jane的教育空间",
  kind: "family",
  creatorRole: "parent",
}

export const INITIAL_APPS: AppItem[] = [
  {
    id: 'education',
    name: '教育',
    icon: {
      imageSrc: educationIcon,
      iconType: 'education',
    },
    order: 2,
  },
  {
    id: 'calendar',
    name: '日历',
    icon: {
      imageSrc: calendarIcon,
      iconType: 'calendar',
    },
    order: 3,
  },
  {
    id: 'meeting',
    name: '会议',
    icon: {
      imageSrc: meetingIcon,
      iconType: 'meeting',
    },
    order: 4,
  },
  {
    id: 'todo',
    name: '待办',
    icon: {
      imageSrc: todoIcon,
      iconType: 'todo',
    },
    order: 5,
  },
  {
    id: 'disk',
    name: '微盘',
    icon: {
      imageSrc: diskIcon,
      iconType: 'disk',
    },
    order: 6,
  },
  {
    id: 'finance',
    name: '财务',
    icon: {
      imageSrc: salaryIcon,
      iconType: 'finance',
    },
    order: 8,
  },
  {
    id: 'salary',
    name: '薪酬',
    icon: {
      imageSrc: salaryIcon,
      iconType: 'salary',
    },
    order: 9,
  },
  {
    id: 'company',
    name: '公司',
    icon: {
      imageSrc: companyIcon,
      iconType: 'company',
    },
    order: 10,
  },
  {
    id: 'profile',
    name: '我的',
    icon: {
      imageSrc: profileIcon,
      iconType: 'profile',
    },
    order: 11,
  },
  {
    id: 'organization',
    name: '组织',
    icon: {
      imageSrc: organizationIcon,
      iconType: 'organization',
    },
    order: 12,
  },
  {
    id: 'employee',
    name: '员工',
    icon: {
      imageSrc: employeeIcon,
      iconType: 'employee',
    },
    order: 13,
  },
  {
    id: 'recruitment',
    name: '招聘',
    icon: {
      imageSrc: recruitmentIcon,
      iconType: 'recruitment',
    },
    order: 14,
  },
];

/** 新用户无组织场景：仅保留 7 个通用应用（无企业级应用） */
export const NO_ORG_APPS: AppItem[] = [
  {
    id: 'education',
    name: '教育',
    icon: { imageSrc: educationIcon, iconType: 'education' },
    order: 1,
  },
  {
    id: 'todo',
    name: '待办',
    icon: { imageSrc: todoIcon, iconType: 'todo' },
    order: 2,
  },
  {
    id: 'calendar',
    name: '日历',
    icon: { imageSrc: calendarIcon, iconType: 'calendar' },
    order: 3,
  },
  {
    id: 'meeting',
    name: '会议',
    icon: { imageSrc: meetingIcon, iconType: 'meeting' },
    order: 4,
  },
  {
    id: 'mail',
    name: '邮箱',
    icon: { imageSrc: recruitmentIcon, iconType: 'mail' },
    order: 5,
  },
  {
    id: 'document',
    name: '文档',
    icon: { imageSrc: courseIcon, iconType: 'document' },
    order: 6,
  },
  {
    id: 'clouddisk',
    name: '云盘',
    icon: { imageSrc: diskIcon, iconType: 'clouddisk' },
    order: 7,
  },
];

export function getAppsFromStorage(): AppItem[] {
  if (typeof window === 'undefined') return INITIAL_APPS;
  try {
    const stored = localStorage.getItem('main-ai-apps-order');
    const storedVersion = localStorage.getItem('main-ai-apps-version');
    if (stored && storedVersion === String(DATA_VERSION)) {
      return JSON.parse(stored) as AppItem[];
    } else {
      localStorage.setItem('main-ai-apps-order', JSON.stringify(INITIAL_APPS));
      localStorage.setItem('main-ai-apps-version', String(DATA_VERSION));
      return INITIAL_APPS;
    }
  } catch (error) {
    console.error('Failed to load apps from storage:', error);
    return INITIAL_APPS;
  }
}

export function saveAppsToStorage(apps: AppItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('main-ai-apps-order', JSON.stringify(apps));
    localStorage.setItem('main-ai-apps-version', String(DATA_VERSION));
  } catch (error) {
    console.error('Failed to save apps to storage:', error);
  }
}

interface MainAIChatWindowProps {
  conversation: Conversation
  onToggleHistory: () => void
  historyOpen?: boolean
  onHistoryOpenChange?: (open: boolean) => void
  conversations?: Conversation[]
  selectedId?: string
  onSelect?: (id: string) => void
  /** 新用户无组织：仅 7 个通用应用 + 顶部无组织组织入口 */
  /** 新用户无组织且无教育空间：教育 onboarding + 本地创建家庭/机构空间 */
  /** 全新用户：无组织、无教育空间 + 主对话四入口引导 */
  scene?: 'default' | 'no-org' | 'no-org-no-edu' | 'fresh-user'
}

/** 与 no-org-no-edu 共用教育会话 key、本地空间列表与无组织应用壳 */
function isEduNoOrgSpaceScene(scene: string) {
  return scene === "no-org-no-edu" || scene === "fresh-user"
}

/** 与 educationStorageKey 中「全新用户 + 教育」分支一致，用于写入 orgMessages 时与顶栏选中态对齐 */
function resolveFreshUserEduViewMessageKey(
  activeApp: string | null,
  educationSpaces: StoredEducationSpace[],
  currentOrg: string,
): string {
  if (activeApp !== "education") return EDU_NO_EDU_THREAD_KEY
  if (educationSpaces.length === 0) return EDU_NO_EDU_THREAD_KEY
  if (educationSpaces.some((s) => s.id === currentOrg)) return currentOrg
  return EDU_NO_EDU_THREAD_KEY
}

const PERSONAL_INFO_MARKER = "<<<RENDER_PERSONAL_INFO>>>"
const CREATE_EMAIL_MARKER = "<<<RENDER_CREATE_EMAIL_FORM>>>"
const CONTINUE_EMAIL_MARKER = "<<<RENDER_CONTINUE_EMAIL_FORM>>>"
const ORG_SWITCHER_MARKER = "<<<RENDER_ORG_SWITCHER>>>"
const CREATE_ORG_FORM_MARKER = "<<<RENDER_CREATE_ORG_FORM>>>"
const CREATE_ORG_SUCCESS_MARKER = "<<<RENDER_CREATE_ORG_SUCCESS>>>"
const JOIN_ORG_FORM_MARKER = "<<<RENDER_JOIN_ORG_FORM>>>"
const JOIN_ORG_CONFIRM_MARKER = "<<<RENDER_JOIN_ORG_CONFIRM>>>"
const EDU_NO_EDU_WELCOME_MARKER = "<<<EDU_NO_EDU_WELCOME>>>"
const CREATE_FAMILY_EDU_MARKER = "<<<CREATE_FAMILY_EDU_CARD>>>"
const CREATE_FAMILY_EDU_ROLE_MARKER = "<<<CREATE_FAMILY_EDU_ROLE>>>"
const CREATE_INSTITUTIONAL_EDU_MARKER = "<<<CREATE_INSTITUTIONAL_EDU_CARD>>>"
const EDU_SPACE_CREATED_CARD_MARKER = "<<<EDU_SPACE_CREATED_CARD>>>"
const FRESH_USER_ONBOARDING_MARKER = "<<<FRESH_USER_ONBOARDING>>>"
/** 全新用户首页主对话：未关联企业/组织时的会话分桶 key */
const FRESH_USER_MAIN_NO_ORG_KEY = "__no_org__"
const JOIN_EDU_SPACE_HINT_MARKER = "<<<JOIN_EDU_SPACE_HINT>>>"
/** 主对话：先选家庭/机构教育空间类型（不展示长欢迎语） */
const MAIN_EDU_SPACE_TYPE_PICK_MARKER = "<<<MAIN_EDU_SPACE_TYPE_PICK>>>"
/** 全新用户已拥有教育空间：教育应用首条欢迎（家庭 / 机构差异化） */
const EDU_WITH_SPACE_WELCOME_MARKER = "<<<EDU_WITH_SPACE_WELCOME>>>"

function parseEduWithSpaceWelcomePayload(content: string): {
  kind: "family" | "institutional"
  spaceName: string
  spaceId: string
} | null {
  const prefix = `${EDU_WITH_SPACE_WELCOME_MARKER}:`
  if (!content.startsWith(prefix)) return null
  try {
    const o = JSON.parse(content.slice(prefix.length)) as {
      kind?: string
      spaceName?: string
      spaceId?: string
    }
    if (o.kind !== "family" && o.kind !== "institutional") return null
    return {
      kind: o.kind,
      spaceName: typeof o.spaceName === "string" ? o.spaceName : "",
      spaceId: typeof o.spaceId === "string" ? o.spaceId : "",
    }
  } catch {
    return null
  }
}

function parseFamilyEduCreatorRoleFromContent(content: string): FamilyCreatorRole {
  if (content === CREATE_FAMILY_EDU_MARKER) return "parent"
  const prefix = `${CREATE_FAMILY_EDU_MARKER}:`
  if (!content.startsWith(prefix)) return "parent"
  try {
    const parsed = JSON.parse(content.slice(prefix.length)) as { role?: string }
    if (parsed.role === "student" || parsed.role === "parent") return parsed.role
  } catch {
    /* ignore */
  }
  return "parent"
}

/** 组织成功卡片行动建议：是否为教育行业（与创建表单「教育行业」及加入演示映射一致） */
function isEducationIndustryType(industry: string | undefined): boolean {
  if (!industry) return false
  return industry === "教育行业" || industry.includes("教育")
}

/** 演示邀请码加入的组织 id → 行业 */
const FRESH_JOIN_ORG_INDUSTRY: Record<string, string> = {
  xiaoce: "教育行业",
  vvai: "教育行业",
  "vvai-edu": "教育行业",
  "bright-tc": "教育行业",
  "bright-pte": "教育行业",
  bright: "教育行业",
  "vedu-test": "教育行业",
  "vedu-s3": "教育行业",
  default: "其他",
}

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
  "邮箱",
  "business email"
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

import goodsIcon from 'figma:asset/d6c155d2820ba2910285fbcb066152b9efb7141c.png';
import membersIcon from 'figma:asset/ecb04190c46a6ecd790d2bc345d963ba9a4a8f0b.png';
import financeIcon from 'figma:asset/98e154a19d1590d43b04308d53726a30a29e972b.png';

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

// 可用组织列表（与顶部组织选择器一致；含邀请码演示用组织）
const AVAILABLE_ORGANIZATIONS: Organization[] = [
  {
    id: 'vvai-edu',
    name: 'VVAI教育集团',
    icon: companyIcon,
    memberCount: 892,
    description: 'VVAI 教育业务组织'
  },
  {
    id: 'weiwei',
    name: '微微集团',
    icon: orgIcon,
    memberCount: 1200,
    description: ''
  },
  {
    id: 'bright-tc',
    name: 'Bright Culture Tuition Centre',
    icon: educationIcon,
    memberCount: 86,
    description: ''
  },
  {
    id: 'bright-pte',
    name: 'Bright Culture Tuition Centre Pte...',
    icon: educationIcon,
    memberCount: 24,
    description: ''
  },
  {
    id: 'bright',
    name: 'Bright Culture',
    icon: calendarIcon,
    memberCount: 15,
    description: ''
  },
  {
    id: 'vedu-test',
    name: 'VEDU Test',
    icon: orgIcon,
    memberCount: 5,
    description: ''
  },
  {
    id: 'vedu-s3',
    name: 'VEDU S3',
    icon: orgIcon,
    memberCount: 11,
    description: ''
  },
  {
    id: 'xiaoce',
    name: '小测教育机构',
    icon: orgIcon,
    memberCount: 156,
    description: '专注K12在线教育的领先机构'
  },
  {
    id: 'default',
    name: '默认组织',
    icon: orgIcon,
    memberCount: 42,
    description: '系统默认组织'
  },
  {
    id: 'test',
    name: '测试机构',
    icon: orgIcon,
    memberCount: 8,
    description: '用于测试和演示的组织'
  }
];

const EDUCATION_APPS = [
  { 
    id: 'course', 
    name: '课程管理', 
    imageSrc: courseIcon, 
    menu: [
      { id: 'fulfillment', name: '课程履约', iconKey: 'fulfillment' },
      { id: 'schedule', name: '课程课表', iconKey: 'schedule' },
      { id: 'order', name: '订单排课', iconKey: 'order' }
    ] 
  },
  { 
    id: 'goods', 
    name: '商品管理', 
    imageSrc: goodsIcon, 
    menu: [
      { id: 'course_goods', name: '课程商品', iconKey: 'course_goods' },
      { id: 'material_goods', name: '物料商品', iconKey: 'material_goods' },
      { id: 'order_goods', name: '订单管理', iconKey: 'order_goods' }
    ] 
  },
  { 
    id: 'members', 
    name: '成员管理', 
    imageSrc: membersIcon, 
    menu: [
      { id: 'student_mgmt', name: '学生管理', iconKey: 'student_mgmt' },
      { id: 'teacher_mgmt', name: '老师管理', iconKey: 'teacher_mgmt' }
    ] 
  },
  { 
    id: 'finance', 
    name: '财务管理', 
    imageSrc: financeIcon, 
    menu: [
      { id: 'income_mgmt', name: '收入管理', iconKey: 'income_mgmt' },
      { id: 'expense_mgmt', name: '支出管理', iconKey: 'expense_mgmt' },
      { id: 'account_mgmt', name: '账号管理', iconKey: 'account_mgmt' },
      { id: 'financial_report', name: '财务报表', iconKey: 'financial_report' }
    ] 
  },
]

/** 无组织（家庭视角）教育子应用：二级/三级菜单与企业场景区分 */
const EDUCATION_APPS_NO_ORG = [
  {
    id: 'course',
    name: '课程管理',
    imageSrc: courseIcon,
    menu: [
      { id: 'fulfillment', name: '课程履约', iconKey: 'fulfillment' },
      { id: 'all_courses', name: '全部课程', iconKey: 'all_courses' },
    ],
  },
  {
    id: 'goods',
    name: '商品管理',
    imageSrc: goodsIcon,
    menu: [
      { id: 'my_orders', name: '我的订单', iconKey: 'my_orders' },
      { id: 'cart', name: '购物车', iconKey: 'cart' },
    ],
  },
  {
    id: 'members',
    name: '成员管理',
    imageSrc: membersIcon,
    menu: [
      { id: 'invite_member', name: '邀请成员', iconKey: 'invite_member' },
      { id: 'manage_member', name: '管理成员', iconKey: 'manage_member' },
    ],
  },
  {
    id: 'rewards',
    name: '奖励管理',
    imageSrc: financeIcon,
    menu: [
      { id: 'new_reward', name: '新增奖励', iconKey: 'new_reward' },
      { id: 'reward_detail', name: '奖励明细', iconKey: 'reward_detail' },
    ],
  },
]

function EducationMenuIcon({ iconKey }: { iconKey: string }) {
  if (iconKey === 'fulfillment') {
    return (
      <svg width="12" height="13" viewBox="0 0 12 13.3333" fill="none">
        <path d={svgPathsFromCourse.p2e8d5300} fill="currentColor" />
        <path d={svgPathsFromCourse.p320a2a00} fill="currentColor" />
        <path d={svgPathsFromCourse.p18316300} fill="currentColor" />
      </svg>
    );
  }
  if (iconKey === 'schedule') {
    return (
      <svg width="12" height="13" viewBox="0 0 11.6667 12.3333" fill="none">
        <path d={svgPathsFromCourse.p3a2c0c80} fill="currentColor" />
      </svg>
    );
  }
  if (iconKey === 'order') {
    return (
      <svg width="13" height="14" viewBox="0 0 12.6948 13.6667" fill="none">
        <path d={svgPathsFromCourse.p13fad580} fill="currentColor" />
        <path d={svgPathsFromCourse.p4d78200} fill="currentColor" />
        <path d={svgPathsFromCourse.p28d9a200} fill="currentColor" />
      </svg>
    );
  }
  
  const iconSize = 14;
  switch (iconKey) {
    case 'all_courses': return <BookOpen size={iconSize} />;
    case 'my_orders': return <ShoppingBag size={iconSize} />;
    case 'cart': return <ShoppingCart size={iconSize} />;
    case 'invite_member': return <UserPlus size={iconSize} />;
    case 'manage_member': return <Users size={iconSize} />;
    case 'new_reward': return <Gift size={iconSize} />;
    case 'reward_detail': return <ClipboardList size={iconSize} />;
    case 'course_goods': return <BookOpen size={iconSize} />;
    case 'material_goods': return <Package size={iconSize} />;
    case 'order_goods': return <ShoppingCart size={iconSize} />;
    case 'student_mgmt': return <GraduationCap size={iconSize} />;
    case 'teacher_mgmt': return <UserCheck size={iconSize} />;
    case 'income_mgmt': return <TrendingUp size={iconSize} />;
    case 'expense_mgmt': return <TrendingDown size={iconSize} />;
    case 'account_mgmt': return <Landmark size={iconSize} />;
    case 'financial_report': return <FileSpreadsheet size={iconSize} />;
    default: return null;
  }
}

function SecondaryAppButton({ app, onMenuClick }: { app: typeof EDUCATION_APPS[0], onMenuClick: (menu: string, appName: string) => void }) {
  const [referenceElement, setReferenceElement] = React.useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = React.useState<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);
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
    setIsOpen(true);
    // Force popper to update position when it opens
    if (update) update();
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    // Enable mobile support by allowing toggle on click
    e.stopPropagation();
    setIsOpen(prev => !prev);
    if (update) update();
  };

  // Close popper if clicked outside (critical for mobile)
  React.useEffect(() => {
    const handleDocumentClick = (e: MouseEvent | TouchEvent) => {
      if (
        isOpen && 
        referenceElement && 
        !referenceElement.contains(e.target as Node) &&
        popperElement &&
        !popperElement.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('touchstart', handleDocumentClick);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('touchstart', handleDocumentClick);
    };
  }, [isOpen, referenceElement, popperElement]);

  // Re-calculate position when open state changes, keeping it synced during parent animations
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

    if (isOpen) {
      rafId = requestAnimationFrame(animateUpdate);
    }

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isOpen, update]);

  return (
    <div className="relative inline-flex" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button
        ref={setReferenceElement}
        onClick={handleToggleClick}
        className={cn(
          "bg-bg flex gap-[var(--space-100)] h-[var(--space-800)] items-center px-[var(--space-300)] py-[var(--space-150)] rounded-full shrink-0 transition-all duration-300 ease-out border border-border group/btn outline-none",
          isOpen ? "bg-[var(--black-alpha-11)]" : "hover:bg-[var(--black-alpha-11)]"
        )}
      >
        <AppIcon imageSrc={app.imageSrc} className="w-[18px] h-[18px]" />
        <p className="text-[length:var(--font-size-xs)] leading-none text-[var(--color-text)] whitespace-nowrap font-[var(--font-weight-medium)]">
          {app.name}
        </p>
        <ChevronDown 
          className={cn(
            "size-[12px] text-text-tertiary transition-transform duration-300 ease-in-out",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {typeof document !== 'undefined' && createPortal(
        <div 
          ref={setPopperElement} 
          style={{ ...styles.popper, zIndex: 9999, pointerEvents: isOpen ? 'auto' : 'none' }} 
          {...attributes.popper}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <AnimatePresence>
            {isOpen && (
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
                  const hasIcon = typeof m === 'object' && m.iconKey;
                  
                  return (
                    <button
                      key={name}
                      onClick={() => {
                        setIsOpen(false);
                        onMenuClick(name, app.name);
                      }}
                      className="w-full flex items-center gap-[10px] px-[10px] py-[8px] hover:bg-[var(--black-alpha-11)] active:bg-[var(--black-alpha-9)] transition-colors rounded-[6px] text-left group"
                    >
                      {hasIcon && (
                        <div className="shrink-0 size-[16px] flex items-center justify-center text-text-secondary group-hover:text-primary transition-colors">
                          <EducationMenuIcon iconKey={m.iconKey} />
                        </div>
                      )}
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

export function FreshUserMainAIChatWindow({ 
  conversation, 
  onToggleHistory, 
  historyOpen = false,
  onHistoryOpenChange,
  conversations = [],
  selectedId = "",
  onSelect,
  scene = 'default',
}: MainAIChatWindowProps) {
  if (isEduNoOrgSpaceScene(scene)) {
    purgeNoEduStoredDataIfReload()
  }

  const [messages, setMessages] = React.useState<Message[]>(() => {
    if (scene === "fresh-user") {
      return [
        {
          id: "fresh-user-onboarding",
          senderId: conversation.user.id,
          content: FRESH_USER_ONBOARDING_MARKER,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          createdAt: Date.now(),
          isAfterPrompt: true,
        },
      ]
    }
    return conversation.messages
  })
  const [inputValue, setInputValue] = React.useState("")
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const chatContainerRef = React.useRef<HTMLDivElement>(null)

  // Apps state
  const [apps, setApps] = React.useState<AppItem[]>([]);
  const [isAllAppsOpen, setIsAllAppsOpen] = React.useState(false);
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const [longPressIndex, setLongPressIndex] = React.useState<number | null>(null);
  const longPressTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Education Mode State
  const [activeApp, setActiveApp] = React.useState<string | null>(null);
  // 改为按组织 ID 存储消息：{ orgId: Message[] }
  const [orgMessages, setOrgMessages] = React.useState<Record<string, Message[]>>({});

  /** 无教育空间场景：本地创建的家庭 / 机构教育空间 */
  const [educationSpaces, setEducationSpaces] = React.useState<StoredEducationSpace[]>(() => loadEducationSpaces())

  /** 全新用户场景：在演示中已创建/加入的企业/组织 id，用于顶栏与机构教育空间「行政公司」 */
  const [freshUserLinkedOrgIds, setFreshUserLinkedOrgIds] = React.useState<string[]>([])

  /** 全新用户首页：当前选中的企业/组织（主对话会话归属）；与教育场景下的 currentOrg（常为教育空间 id）分离 */
  const [freshUserHomeOrgId, setFreshUserHomeOrgId] = React.useState<string>(FRESH_USER_MAIN_NO_ORG_KEY)
  const freshUserMainMapRef = React.useRef<Record<string, Message[]>>({})
  const freshUserMainKeyRef = React.useRef<string>(FRESH_USER_MAIN_NO_ORG_KEY)

  /** 新用户无组织场景下，教育会话当前选中的空间（默认 Jane 的演示空间） */
  const [noOrgSelectedEduSpaceId, setNoOrgSelectedEduSpaceId] = React.useState<string>(
    NO_ORG_DEFAULT_JANE_EDU_ID,
  )

  // Organization State（无组织场景使用独立 key，避免与主入口组织数据混淆）
  const [currentOrg, setCurrentOrg] = React.useState<string>(() => {
    if (scene === "no-org") return "__no_org__"
    if (isEduNoOrgSpaceScene(scene)) {
      const s = loadEducationSpaces()
      return s.length > 0 ? s[0].id : "__no_org__"
    }
    return "vvai-edu"
  })

  /** 无组织 + 教育顶栏：默认 Jane 空间 + 用户后续创建的空间 */
  const noOrgEducationSpacesList = React.useMemo((): StoredEducationSpace[] => {
    if (scene !== "no-org") return []
    const rest = educationSpaces.filter((s) => s.id !== NO_ORG_DEFAULT_JANE_EDU_ID)
    return [NO_ORG_DEFAULT_JANE_EDU_SPACE, ...rest]
  }, [scene, educationSpaces])

  const organizationsForNoOrgEducationNav = React.useMemo((): Organization[] => {
    return noOrgEducationSpacesList.map((s) => ({
      id: s.id,
      name: s.name,
      icon: s.kind === "family" ? familyEducationIcon : companyIcon,
      memberCount: s.kind === "family" ? 2 : 24,
      description: s.kind === "family" ? "家庭教育空间" : "机构教育空间",
    }))
  }, [noOrgEducationSpacesList])

  /** 无组织/全新用户场景下：对话内「组织切换」卡片仅用教育空间列表（勿与主入口企业/组织列表混用） */
  const educationSpacesOnlyForSwitcher = React.useMemo((): Organization[] => {
    if (!isEduNoOrgSpaceScene(scene)) return []
    return educationSpaces.map((s) => ({
      id: s.id,
      name: s.name,
      icon: s.kind === "family" ? familyEducationIcon : companyIcon,
      memberCount: s.kind === "family" ? 2 : 24,
      description: s.kind === "family" ? "家庭教育空间" : "机构教育空间",
    }))
  }, [scene, educationSpaces])

  /** 全新用户主对话顶栏：仅展示已关联的企业/组织（不含教育空间行） */
  const organizationsForSwitcher = React.useMemo((): Organization[] => {
    if (isEduNoOrgSpaceScene(scene)) {
      const fromSpaces = educationSpaces.map((s) => ({
        id: s.id,
        name: s.name,
        icon: s.kind === "family" ? familyEducationIcon : companyIcon,
        memberCount: s.kind === "family" ? 2 : 24,
        description: s.kind === "family" ? "家庭教育空间" : "机构教育空间",
      }))
      if (scene !== "fresh-user") return fromSpaces
      return freshUserLinkedOrgIds
        .map((id) => AVAILABLE_ORGANIZATIONS.find((o) => o.id === id))
        .filter((o): o is Organization => Boolean(o))
    }
    return AVAILABLE_ORGANIZATIONS
  }, [scene, educationSpaces, freshUserLinkedOrgIds])

  /** 全新用户 · 教育顶栏：机构空间按 linkedOrgId 挂在组织下；家庭空间等单独列出 */
  const freshUserEduHierarchyNav = React.useMemo(() => {
    if (scene !== "fresh-user") {
      return { groups: [] as FreshUserEduHierarchyGroup[], standalone: [] as { id: string; name: string; icon: string }[] }
    }
    const groups: FreshUserEduHierarchyGroup[] = []
    const standalone: { id: string; name: string; icon: string }[] = []
    const byOrg = new Map<string, StoredEducationSpace[]>()

    for (const s of educationSpaces) {
      if (s.kind === "family") {
        standalone.push({ id: s.id, name: s.name, icon: familyEducationIcon })
        continue
      }
      if (s.kind === "institutional") {
        const oid = s.linkedOrgId
        if (oid && freshUserLinkedOrgIds.includes(oid)) {
          const list = byOrg.get(oid) ?? []
          list.push(s)
          byOrg.set(oid, list)
        } else {
          standalone.push({ id: s.id, name: s.name, icon: companyIcon })
        }
      }
    }

    for (const orgId of freshUserLinkedOrgIds) {
      const list = byOrg.get(orgId)
      if (!list || list.length === 0) continue
      const org = AVAILABLE_ORGANIZATIONS.find((o) => o.id === orgId)
      if (!org) continue
      groups.push({
        orgId,
        orgName: org.name,
        orgIcon: org.icon,
        spaces: list.map((sp) => ({
          id: sp.id,
          name: sp.name,
          icon: companyIcon,
        })),
      })
    }

    return { groups, standalone }
  }, [scene, educationSpaces, freshUserLinkedOrgIds])

  /** 教育会话分桶：全新用户按教育空间 id；无教育空间场景用固定 key；no-org 按选中空间 */
  const educationStorageKey = React.useMemo(() => {
    if (scene === "fresh-user") {
      if (activeApp !== "education") return EDU_NO_EDU_THREAD_KEY
      if (educationSpaces.length === 0) return EDU_NO_EDU_THREAD_KEY
      /** 仅当已显式选中某一教育空间（如点「查看教育空间」）时按空间分桶；否则沿用同一线程，避免首次创建后换桶导致历史看不到 */
      if (educationSpaces.some((s) => s.id === currentOrg)) return currentOrg
      return EDU_NO_EDU_THREAD_KEY
    }
    if (scene === "no-org-no-edu") return EDU_NO_EDU_THREAD_KEY
    if (scene === "no-org") return noOrgSelectedEduSpaceId
    return currentOrg
  }, [scene, activeApp, educationSpaces, currentOrg, noOrgSelectedEduSpaceId])

  // 获取当前组织的消息列表
  const educationMessages = React.useMemo(() => {
    return orgMessages[educationStorageKey] || []
  }, [orgMessages, educationStorageKey])

  /** 全新用户且尚未创建任何教育空间：进教育后不展示底部二级菜单与教育侧栏历史（其余逻辑不变） */
  const hideEducationSecondaryChrome = scene === "fresh-user" && educationSpaces.length === 0

  /** 底部教育二级菜单：按空间类型切换 */
  const educationMenuApps = React.useMemo(() => {
    if (scene === "no-org") {
      const space = noOrgEducationSpacesList.find((s) => s.id === noOrgSelectedEduSpaceId)
      if (!space || space.kind === "family") return EDUCATION_APPS_NO_ORG
      return EDUCATION_APPS
    }
    if (hideEducationSecondaryChrome) {
      return []
    }
    if (scene !== "no-org-no-edu" && scene !== "fresh-user") {
      return EDUCATION_APPS
    }
    if (currentOrg === "__no_org__" || !educationSpaces.some((s) => s.id === currentOrg)) {
      return EDUCATION_APPS_NO_ORG
    }
    const space = educationSpaces.find((s) => s.id === currentOrg)
    if (!space || space.kind === "family") return EDUCATION_APPS_NO_ORG
    return EDUCATION_APPS
  }, [scene, currentOrg, educationSpaces, noOrgEducationSpacesList, noOrgSelectedEduSpaceId, hideEducationSecondaryChrome])

  /** 二级应用壳层（如教育）：用于底部「应用入口」展示当前应用图标与名称 */
  const activeSecondaryAppMeta = React.useMemo(() => {
    if (!activeApp) return undefined;
    const useNoOrgCatalog =
      scene === "no-org" ||
      scene === "no-org-no-edu" ||
      (scene === "fresh-user" && freshUserLinkedOrgIds.length === 0)
    const catalog = useNoOrgCatalog ? NO_ORG_APPS : INITIAL_APPS
    const app = catalog.find((a) => a.id === activeApp)
    if (!app) return undefined
    return { name: app.name, imageSrc: app.icon.imageSrc }
  }, [activeApp, scene, freshUserLinkedOrgIds])

  // Model State - 默认使用 GPT-4 Turbo（推荐版本）
  const [currentModel, setCurrentModel] = React.useState<string>('gpt-4-turbo');

  // Task Drawer State
  const [isTaskDrawerOpen, setIsTaskDrawerOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<any>(null);

  const scrollToBottom = React.useCallback(() => {
    if (scrollRef.current) {
      const container = scrollRef.current.closest('.overflow-y-auto');
      if (container) {
        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      } else {
        scrollRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
    // Fix browser scrolling overflow-hidden ancestors (prevent upward shift bug)
    const wrappers = document.querySelectorAll('.fixed.inset-0.pointer-events-none');
    wrappers.forEach(wrapper => {
      if (wrapper.scrollTop > 0) wrapper.scrollTop = 0;
    });
  }, []);
  
  // Pinned Task State
  const [isPinnedTaskExpanded, setIsPinnedTaskExpanded] = React.useState(true);
  const [isTaskCardExpanded, setIsTaskCardExpanded] = React.useState(true);
  const isInitialMount = React.useRef(true);

  // Secondary App History Sidebar State
  const [secondaryHistoryOpen, setSecondaryHistoryOpen] = React.useState(false);

  React.useEffect(() => {
    if (activeApp === "education" && hideEducationSecondaryChrome) {
      setSecondaryHistoryOpen(false)
    }
  }, [activeApp, hideEducationSecondaryChrome])
  
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
  
  // 默认选中"最近使用"分组中的第一个会话
  const [selectedSecondarySession, setSelectedSecondarySession] = React.useState<string>(() => {
    return secondaryAppSessions.length > 0 ? secondaryAppSessions[0].id : "";
  });

  const detachPath =
    scene === "fresh-user"
      ? "/main-ai-fresh-user"
      : scene === "no-org-no-edu"
        ? "/main-ai-no-org-no-edu"
        : scene === "no-org"
          ? "/main-ai-no-org"
          : "/main-ai"
  const mainAiHref = useHref(detachPath)
  const openDetachedWindow = React.useCallback(() => {
    if (typeof window === 'undefined') return
    const url = new URL(mainAiHref, window.location.origin).href
    window.open(
      url,
      'vvai-ai-detached',
      'noopener,noreferrer,width=1280,height=800,menubar=no,toolbar=no,scrollbars=yes,resizable=yes',
    )
  }, [mainAiHref])

  React.useEffect(() => {
    if (scene === "no-org" || scene === "no-org-no-edu") {
      setApps([...NO_ORG_APPS].sort((a, b) => a.order - b.order))
    } else if (scene === "fresh-user") {
      if (freshUserLinkedOrgIds.length > 0) {
        setApps([...INITIAL_APPS].sort((a, b) => a.order - b.order))
      } else {
        setApps([...NO_ORG_APPS].sort((a, b) => a.order - b.order))
      }
    } else {
      const loadedApps = getAppsFromStorage();
      setApps([...loadedApps].sort((a, b) => a.order - b.order));
    }
  }, [scene, freshUserLinkedOrgIds]);

  const handleReorder = (reorderedApps: AppItem[]) => {
    setApps(reorderedApps);
    if (scene !== "no-org" && scene !== "no-org-no-edu" && scene !== "fresh-user") {
      saveAppsToStorage(reorderedApps);
    }
  };

  // 辅助函数：更新当前教育会话分桶（与 educationStorageKey 一致）
  const setEducationMessages = React.useCallback(
    (updater: Message[] | ((prev: Message[]) => Message[])) => {
      setOrgMessages((prev) => {
        const key = educationStorageKey
        const currentMessages = prev[key] || []
        const newMessages = typeof updater === "function" ? updater(currentMessages) : updater
        return {
          ...prev,
          [key]: newMessages,
        }
      })
    },
    [educationStorageKey],
  )

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
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && scene !== "no-org" && scene !== "no-org-no-edu" && scene !== "fresh-user") {
      saveAppsToStorage(apps);
    }
    setDraggedIndex(null);
  };

  React.useEffect(() => {
    if (scene === "fresh-user") return
    setMessages(conversation.messages)
    // Auto-collapse pinned task card if loading an existing conversation (has messages)
    if (conversation.messages && conversation.messages.length > 0) {
      setIsPinnedTaskExpanded(false);
    } else {
      setIsPinnedTaskExpanded(true);
    }
  }, [conversation.id, conversation.messages, scene])

  React.useEffect(() => {
    scrollToBottom()
  }, [messages, educationMessages, scrollToBottom])

  /** 全新用户 · 首页：主对话按企业/组织分桶，切换顶栏组织即切换对应会话记录 */
  React.useEffect(() => {
    if (scene !== "fresh-user" || activeApp) return
    const nextKey = freshUserHomeOrgId
    const prevKey = freshUserMainKeyRef.current
    if (nextKey === prevKey) return
    setMessages((prev) => {
      freshUserMainMapRef.current[prevKey] = prev
      freshUserMainKeyRef.current = nextKey
      const bucket = freshUserMainMapRef.current[nextKey]
      if (bucket !== undefined) return bucket
      if (nextKey === FRESH_USER_MAIN_NO_ORG_KEY) {
        const welcome: Message = {
          id: "fresh-user-onboarding",
          senderId: conversation.user.id,
          content: FRESH_USER_ONBOARDING_MARKER,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          createdAt: Date.now(),
          isAfterPrompt: true,
        }
        const next = [welcome]
        freshUserMainMapRef.current[nextKey] = next
        return next
      }
      /** 从「未关联组织」首次进入新加入/创建的组织时，保留当前主对话（含创建成功气泡等） */
      if (prevKey === FRESH_USER_MAIN_NO_ORG_KEY && freshUserLinkedOrgIds.includes(nextKey)) {
        freshUserMainMapRef.current[nextKey] = prev
        return prev
      }
      freshUserMainMapRef.current[nextKey] = []
      return []
    })
  }, [freshUserHomeOrgId, scene, activeApp, conversation.user.id, freshUserLinkedOrgIds])

  /** 从教育返回首页：顶栏恢复为企业/组织 id */
  React.useEffect(() => {
    if (scene !== "fresh-user") return
    if (activeApp) return
    if (!educationSpaces.some((s) => s.id === currentOrg)) return
    const target =
      freshUserHomeOrgId !== FRESH_USER_MAIN_NO_ORG_KEY
        ? freshUserHomeOrgId
        : freshUserLinkedOrgIds[0] ?? FRESH_USER_MAIN_NO_ORG_KEY
    setCurrentOrg(target)
  }, [activeApp, scene, currentOrg, educationSpaces, freshUserHomeOrgId, freshUserLinkedOrgIds])

  /** no-org-no-edu：无空间时注入欢迎（本地仅一次）；全新用户：按是否有空间注入不同欢迎 */
  React.useEffect(() => {
    if (!isEduNoOrgSpaceScene(scene)) return
    if (activeApp !== "education") return

    if (scene === "no-org-no-edu") {
      if (educationSpaces.length > 0) return
      if (getEducationWelcomeShown()) return

      setOrgMessages((prev) => {
        if ((prev[EDU_NO_EDU_THREAD_KEY]?.length ?? 0) > 0) return prev
        setEducationWelcomeShown()
        const botMsg: Message = {
          id: `edu-no-edu-welcome-${Date.now()}`,
          senderId: conversation.user.id,
          content: EDU_NO_EDU_WELCOME_MARKER,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          createdAt: Date.now(),
          isAfterPrompt: true,
        }
        return {
          ...prev,
          [EDU_NO_EDU_THREAD_KEY]: [botMsg],
        }
      })
      return
    }

    if (scene !== "fresh-user") return

    setOrgMessages((prev) => {
      const edKey = educationStorageKey
      if ((prev[edKey]?.length ?? 0) > 0) return prev

      const base: Pick<Message, "senderId" | "timestamp" | "createdAt" | "isAfterPrompt"> = {
        senderId: conversation.user.id,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        createdAt: Date.now(),
        isAfterPrompt: true,
      }

      if (educationSpaces.length === 0) {
        const botMsg: Message = {
          ...base,
          id: `edu-fresh-welcome-empty-${Date.now()}`,
          content: EDU_NO_EDU_WELCOME_MARKER,
        }
        return {
          ...prev,
          [edKey]: [botMsg],
        }
      }

      const space = educationSpaces.find((s) => s.id === currentOrg) ?? educationSpaces[0]
      if (!space) return prev

      const botMsg: Message = {
        ...base,
        id: `edu-fresh-welcome-space-${Date.now()}`,
        content: `${EDU_WITH_SPACE_WELCOME_MARKER}:${JSON.stringify({
          kind: space.kind,
          spaceName: space.name,
          spaceId: space.id,
        })}`,
      }
      return {
        ...prev,
        [edKey]: [botMsg],
      }
    })
  }, [scene, activeApp, educationSpaces, currentOrg, conversation.user.id, educationStorageKey])

  /** 全新用户：从「无空间欢迎」创建首个空间后，将首条气泡切换为「有空间欢迎」 */
  React.useEffect(() => {
    if (scene !== "fresh-user") return
    if (!isEduNoOrgSpaceScene(scene)) return
    if (activeApp !== "education") return
    if (educationSpaces.length === 0) return

    setOrgMessages((prev) => {
      const key = educationStorageKey
      const thread = prev[key] ?? []
      const first = thread[0]
      if (first?.content !== EDU_NO_EDU_WELCOME_MARKER) return prev

      const space = educationSpaces.find((s) => s.id === currentOrg) ?? educationSpaces[0]
      if (!space) return prev

      const newContent = `${EDU_WITH_SPACE_WELCOME_MARKER}:${JSON.stringify({
        kind: space.kind,
        spaceName: space.name,
        spaceId: space.id,
      })}`

      return {
        ...prev,
        [key]: [{ ...first, content: newContent }, ...thread.slice(1)],
      }
    })
  }, [scene, activeApp, educationSpaces, currentOrg, conversation.user.id, educationStorageKey])

  /** 全新用户：顶栏切换教育空间时，同步首条「有空间欢迎」文案 */
  React.useEffect(() => {
    if (scene !== "fresh-user") return
    if (!isEduNoOrgSpaceScene(scene)) return
    if (activeApp !== "education") return
    if (educationSpaces.length === 0) return

    setOrgMessages((prev) => {
      const key = educationStorageKey
      const thread = prev[key] ?? []
      const first = thread[0]
      if (!first?.content.startsWith(`${EDU_WITH_SPACE_WELCOME_MARKER}:`)) return prev

      const space = educationSpaces.find((s) => s.id === currentOrg) ?? educationSpaces[0]
      if (!space) return prev

      const newContent = `${EDU_WITH_SPACE_WELCOME_MARKER}:${JSON.stringify({
        kind: space.kind,
        spaceName: space.name,
        spaceId: space.id,
      })}`
      if (first.content === newContent) return prev

      return {
        ...prev,
        [key]: [{ ...first, content: newContent }, ...thread.slice(1)],
      }
    })
  }, [scene, activeApp, educationSpaces, currentOrg, educationStorageKey])

  // Auto-collapse task card when chat content fills the container
  React.useEffect(() => {
    if (!chatContainerRef.current || activeApp !== null) return;
    
    // Skip auto-collapse on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Only auto-collapse if there are enough messages (at least 3)
    if (messages.length < 3) return;
    
    const container = chatContainerRef.current;
    const checkHeight = () => {
      // Check if content height exceeds visible height
      // Only auto-collapse if user hasn't manually interacted
      if (container.scrollHeight > container.clientHeight && isTaskCardExpanded) {
        setIsTaskCardExpanded(false);
      }
    };
    
    // Check immediately and after content changes
    checkHeight();
    const timeoutId = setTimeout(checkHeight, 100);
    
    return () => clearTimeout(timeoutId);
  }, [messages, activeApp]) // Removed isTaskCardExpanded from dependency array to prevent loop

  const appendEducationExchange = React.useCallback(
    (userText: string, botMarker: string) => {
      const userMsg: Message = {
        id: `user-${Date.now()}`,
        senderId: currentUser.id,
        content: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        createdAt: Date.now(),
      }
      setEducationMessages((prev) => [...prev, userMsg])
      setTimeout(() => {
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          senderId: conversation.user.id,
          content: botMarker,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          createdAt: Date.now(),
          isAfterPrompt: true,
          operationSource: {
            cardTitle: "教育",
            sourceMessageId: userMsg.id,
            sourceConversationId: conversation.id,
            sourceDetailLabel: userText.length > 40 ? `${userText.slice(0, 40)}…` : userText,
          },
        }
        setEducationMessages((prev) => [...prev, botMsg])
        scrollToBottom()
      }, 280)
    },
    [setEducationMessages, scrollToBottom, conversation.user.id, conversation.id],
  )

  /** 主对话内走教育创建流程（全新用户「创建教育空间」） */
  const appendMainEducationExchange = React.useCallback(
    (userText: string, botMarker: string) => {
      const userMsg: Message = {
        id: `user-main-edu-${Date.now()}`,
        senderId: currentUser.id,
        content: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        createdAt: Date.now(),
      }
      setMessages((prev) => [...prev, userMsg])
      setTimeout(() => {
        const botMsg: Message = {
          id: `bot-main-edu-${Date.now()}`,
          senderId: conversation.user.id,
          content: botMarker,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          createdAt: Date.now(),
          isAfterPrompt: true,
          operationSource: {
            cardTitle: "教育",
            sourceMessageId: userMsg.id,
            sourceConversationId: conversation.id,
            sourceDetailLabel: userText.length > 40 ? `${userText.slice(0, 40)}…` : userText,
          },
        }
        setMessages((prev) => [...prev, botMsg])
        scrollToBottom()
      }, 280)
    },
    [scrollToBottom, conversation.user.id, conversation.id],
  )

  const confirmFamilyEducationRole = React.useCallback(
    (role: FamilyCreatorRole) => {
      const userMsg: Message = {
        id: `user-fam-role-${Date.now()}`,
        senderId: currentUser.id,
        content: role === "parent" ? "我选择：我是家长（为孩子创建）" : "我选择：我是学生（为自己创建）",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        createdAt: Date.now(),
      }
      const botMsg: Message = {
        id: `bot-fam-form-${Date.now()}`,
        senderId: conversation.user.id,
        content: `${CREATE_FAMILY_EDU_MARKER}:${JSON.stringify({ role })}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        createdAt: Date.now(),
        isAfterPrompt: true,
        operationSource: {
          cardTitle: "家庭教育空间",
          sourceMessageId: userMsg.id,
          sourceConversationId: conversation.id,
          sourceDetailLabel: "选择创建角色",
        },
      }
      const toMain = scene === "fresh-user" && activeApp !== "education"
      if (toMain) {
        setMessages((prev) => [...prev, userMsg])
        setTimeout(() => {
          setMessages((prev) => [...prev, botMsg])
          scrollToBottom()
        }, 320)
        return
      }
      setEducationMessages((prev) => [...prev, userMsg])
      setTimeout(() => {
        setEducationMessages((prev) => [...prev, botMsg])
        scrollToBottom()
      }, 320)
    },
    [setEducationMessages, scrollToBottom, conversation.user.id, conversation.id, scene, activeApp],
  )

  const triggerEduFlowFromNav = React.useCallback(
    (intent: "family" | "institutional") => {
      setActiveApp("education")
      setSecondaryHistoryOpen(false)
      if (intent === "family") {
        appendEducationExchange("我要创建家庭教育空间", CREATE_FAMILY_EDU_ROLE_MARKER)
      } else {
        appendEducationExchange("我要创建机构教育空间", CREATE_INSTITUTIONAL_EDU_MARKER)
      }
    },
    [appendEducationExchange],
  )

  const handleFamilySpaceSubmit = React.useCallback(
    (data: { name: string; creatorRole: FamilyCreatorRole }) => {
      const newSpace: StoredEducationSpace = {
        id: `edu-fam-${Date.now()}`,
        name: data.name,
        kind: "family",
        creatorRole: data.creatorRole,
      }
      const next = [...educationSpaces, newSpace]
      setEducationSpaces(next)
      if (isEduNoOrgSpaceScene(scene)) {
        saveEducationSpaces(next)
      }

      const botMsg: Message = {
        id: `bot-fam-ok-${Date.now()}`,
        senderId: conversation.user.id,
        content: `已成功创建家庭教育空间「${data.name}」。`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        createdAt: Date.now(),
        isAfterPrompt: true,
      }
      const cardMsg: Message = {
        id: `bot-fam-created-card-${Date.now()}`,
        senderId: conversation.user.id,
        content: `${EDU_SPACE_CREATED_CARD_MARKER}:${JSON.stringify({
          spaceName: data.name,
          kind: "family" as const,
          spaceId: newSpace.id,
        })}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        createdAt: Date.now(),
        isAfterPrompt: true,
      }

      /** 全新用户：在主对话完成创建，消息写入主线程（不自动切到该教育空间） */
      if (scene === "fresh-user" && activeApp !== "education") {
        setMessages((prev) => [...prev, botMsg])
        setTimeout(() => {
          setMessages((prev) => [...prev, cardMsg])
          scrollToBottom()
        }, 320)
        return
      }

      /** 新用户无组织：会话 key 会切到新空间 id，必须用 setOrgMessages 显式迁移旧线程并写入新 key，否则会写入旧 key 导致界面空白 */
      if (scene === "no-org") {
        const fromKey = noOrgSelectedEduSpaceId
        const toKey = newSpace.id
        setNoOrgSelectedEduSpaceId(toKey)
        setOrgMessages((prev) => {
          const inherited = prev[fromKey] || []
          return {
            ...prev,
            [toKey]: [...inherited, botMsg],
          }
        })
        setTimeout(() => {
          setOrgMessages((prev) => {
            const cur = prev[toKey] || []
            return {
              ...prev,
              [toKey]: [...cur, cardMsg],
            }
          })
          scrollToBottom()
        }, 320)
        return
      }

      /** 全新用户 · 教育内第二次及以后创建：仅写入卡片消息（避免与卡片内提示重复）；新空间桶 + 当前视图桶各一份镜像 */
      if (scene === "fresh-user" && activeApp === "education" && educationSpaces.length >= 1) {
        const viewKey = resolveFreshUserEduViewMessageKey(activeApp, educationSpaces, currentOrg)
        const spaceKey = newSpace.id
        const mirrorId = Date.now()
        const cardMsgView: Message = { ...cardMsg, id: `${cardMsg.id}-mirror-${mirrorId}` }
        setOrgMessages((prev) => ({
          ...prev,
          [spaceKey]: [...(prev[spaceKey] || []), cardMsg],
        }))
        setTimeout(() => {
          setOrgMessages((prev) => {
            if (viewKey === spaceKey) return prev
            return {
              ...prev,
              [viewKey]: [...(prev[viewKey] || []), cardMsgView],
            }
          })
          scrollToBottom()
        }, 320)
        return
      }

      if (scene !== "fresh-user") {
        setCurrentOrg(newSpace.id)
      }
      /** 全新用户 · 教育内首次创建：不重复展示「已成功创建…」纯文本，仅展示下方卡片 */
      if (scene === "fresh-user" && activeApp === "education") {
        setTimeout(() => {
          setEducationMessages((prev) => [...prev, cardMsg])
          scrollToBottom()
        }, 320)
      } else {
        setEducationMessages((prev) => [...prev, botMsg])
        setTimeout(() => {
          setEducationMessages((prev) => [...prev, cardMsg])
          scrollToBottom()
        }, 320)
      }
    },
    [
      educationSpaces,
      setEducationMessages,
      scrollToBottom,
      conversation.user.id,
      scene,
      noOrgSelectedEduSpaceId,
      setOrgMessages,
      activeApp,
      setMessages,
      setCurrentOrg,
      currentOrg,
    ],
  )

  const handleInstitutionalSpaceSubmit = React.useCallback(
    (payload: InstitutionalEducationSpacePayload) => {
      const resolveLinkedOrgId = (): string | undefined => {
        if (scene !== "fresh-user" || freshUserLinkedOrgIds.length === 0) return undefined
        const t = payload.adminCompany.trim()
        if (freshUserLinkedOrgIds.length === 1) return freshUserLinkedOrgIds[0]
        const byName = AVAILABLE_ORGANIZATIONS.find((o) => o.name === t)
        if (byName && freshUserLinkedOrgIds.includes(byName.id)) return byName.id
        return freshUserLinkedOrgIds[0]
      }
      const newSpace: StoredEducationSpace = {
        id: `edu-ins-${Date.now()}`,
        name: payload.name,
        kind: "institutional",
        linkedOrgId: resolveLinkedOrgId(),
      }
      const next = [...educationSpaces, newSpace]
      setEducationSpaces(next)
      if (isEduNoOrgSpaceScene(scene)) {
        saveEducationSpaces(next)
      }

      const summaryLines = [
        `对外简称：${payload.shortName}`,
        payload.slogan ? `宣传语：${payload.slogan}` : "",
        `行政公司：${payload.adminCompany}`,
        `地点：${payload.location}`,
        `邮箱：${payload.email}`,
        payload.phone ? `电话：${payload.phoneCode} ${payload.phone}` : "",
      ]
        .filter(Boolean)
        .join("\n")

      const botMsg: Message = {
        id: `bot-ins-ok-${Date.now()}`,
        senderId: conversation.user.id,
        content: `已成功创建机构教育空间「${payload.name}」。\n${summaryLines}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        createdAt: Date.now(),
        isAfterPrompt: true,
      }
      const cardMsg: Message = {
        id: `bot-ins-created-card-${Date.now()}`,
        senderId: conversation.user.id,
        content: `${EDU_SPACE_CREATED_CARD_MARKER}:${JSON.stringify({
          spaceName: payload.name,
          kind: "institutional" as const,
          spaceId: newSpace.id,
        })}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        createdAt: Date.now(),
        isAfterPrompt: true,
      }

      if (scene === "fresh-user" && activeApp !== "education") {
        setMessages((prev) => [...prev, botMsg])
        setTimeout(() => {
          setMessages((prev) => [...prev, cardMsg])
          scrollToBottom()
        }, 320)
        return
      }

      if (scene === "no-org") {
        const fromKey = noOrgSelectedEduSpaceId
        const toKey = newSpace.id
        setNoOrgSelectedEduSpaceId(toKey)
        setOrgMessages((prev) => {
          const inherited = prev[fromKey] || []
          return {
            ...prev,
            [toKey]: [...inherited, botMsg],
          }
        })
        setTimeout(() => {
          setOrgMessages((prev) => {
            const cur = prev[toKey] || []
            return {
              ...prev,
              [toKey]: [...cur, cardMsg],
            }
          })
          scrollToBottom()
        }, 320)
        return
      }

      if (scene === "fresh-user" && activeApp === "education" && educationSpaces.length >= 1) {
        const viewKey = resolveFreshUserEduViewMessageKey(activeApp, educationSpaces, currentOrg)
        const spaceKey = newSpace.id
        const mirrorId = Date.now()
        const cardMsgView: Message = { ...cardMsg, id: `${cardMsg.id}-mirror-${mirrorId}` }
        setOrgMessages((prev) => ({
          ...prev,
          [spaceKey]: [...(prev[spaceKey] || []), cardMsg],
        }))
        setTimeout(() => {
          setOrgMessages((prev) => {
            if (viewKey === spaceKey) return prev
            return {
              ...prev,
              [viewKey]: [...(prev[viewKey] || []), cardMsgView],
            }
          })
          scrollToBottom()
        }, 320)
        return
      }

      if (scene !== "fresh-user") {
        setCurrentOrg(newSpace.id)
      }
      if (scene === "fresh-user" && activeApp === "education") {
        setTimeout(() => {
          setEducationMessages((prev) => [...prev, cardMsg])
          scrollToBottom()
        }, 320)
      } else {
        setEducationMessages((prev) => [...prev, botMsg])
        setTimeout(() => {
          setEducationMessages((prev) => [...prev, cardMsg])
          scrollToBottom()
        }, 320)
      }
    },
    [
      educationSpaces,
      setEducationMessages,
      scrollToBottom,
      conversation.user.id,
      scene,
      noOrgSelectedEduSpaceId,
      setOrgMessages,
      activeApp,
      setMessages,
      freshUserLinkedOrgIds,
      setCurrentOrg,
      currentOrg,
    ],
  )

  const openNoEduVideoIntro = React.useCallback((userContent: string = "查看教育视频介绍") => {
    const userMsg: Message = {
      id: `user-video-${Date.now()}`,
      senderId: currentUser.id,
      content: userContent,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      createdAt: Date.now(),
    }
    setEducationMessages((prev) => [...prev, userMsg])
    setTimeout(() => {
      const cardData = JSON.stringify({
        title: "教育应用介绍视频（演示）",
        description:
          "视频将概览家庭教育空间与机构教育空间的差异、典型流程与权限边界。当前为静态演示，你可返回对话继续创建空间。",
        detail: "观看后可尝试：创建家庭教育空间 / 创建机构教育空间",
        imageSrc: educationIcon,
      })
      const botResponse: Message = {
        id: `bot-video-${Date.now()}`,
        senderId: conversation.user.id,
        content: `<<<RENDER_GENERIC_CARD>>>:${cardData}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        createdAt: Date.now(),
        isAfterPrompt: true,
      }
      setEducationMessages((prev) => [...prev, botResponse])
      scrollToBottom()
    }, 400)
  }, [setEducationMessages, scrollToBottom, conversation.user.id])

  const openNoEduVideoIntroMain = React.useCallback(() => {
    const userMsg: Message = {
      id: `user-video-main-${Date.now()}`,
      senderId: currentUser.id,
      content: "查看教育视频介绍",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      createdAt: Date.now(),
    }
    setMessages((prev) => [...prev, userMsg])
    setTimeout(() => {
      const cardData = JSON.stringify({
        title: "教育应用介绍视频（演示）",
        description:
          "视频将概览家庭教育空间与机构教育空间的差异、典型流程与权限边界。当前为静态演示，你可返回对话继续创建空间。",
        detail: "观看后可尝试：创建家庭教育空间 / 创建机构教育空间",
        imageSrc: educationIcon,
      })
      const botResponse: Message = {
        id: `bot-video-main-${Date.now()}`,
        senderId: conversation.user.id,
        content: `<<<RENDER_GENERIC_CARD>>>:${cardData}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        createdAt: Date.now(),
        isAfterPrompt: true,
      }
      setMessages((prev) => [...prev, botResponse])
      scrollToBottom()
    }, 400)
  }, [scrollToBottom, conversation.user.id])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Auto-collapse pinned task card when user sends a message
    setIsPinnedTaskExpanded(false);

    const newUserMessage: Message = {
      id: `new-${Date.now()}`,
      senderId: currentUser.id,
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now()
    }

    if (activeApp === "education") {
      const raw = inputValue.trim()
      setInputValue("")

      if (isEduNoOrgSpaceScene(scene) || scene === "no-org") {
        const lower = raw.toLowerCase()
        if (/创建家庭教育|家庭教育空间/.test(raw) || lower.includes("create family")) {
          appendEducationExchange(raw || "我要创建家庭教育空间", CREATE_FAMILY_EDU_ROLE_MARKER)
          return
        }
        if (/创建机构|机构教育空间/.test(raw) || lower.includes("institutional")) {
          appendEducationExchange(raw || "我要创建机构教育空间", CREATE_INSTITUTIONAL_EDU_MARKER)
          return
        }
        if (/视频|介绍|观看|微微教育|什么是/.test(raw) || lower.includes("video")) {
          const userMsg: Message = {
            ...newUserMessage,
            content: raw || "查看教育视频介绍",
          }
          setEducationMessages((prev) => [...prev, userMsg])
          setTimeout(() => {
            const cardData = JSON.stringify({
              title: "教育应用介绍视频（演示）",
              description:
                "视频将概览家庭教育空间与机构教育空间的差异、典型流程与权限边界。当前为静态演示，你可返回对话继续创建空间。",
              detail: "观看后可尝试：创建家庭教育空间 / 创建机构教育空间",
              imageSrc: educationIcon,
            })
            const botResponse: Message = {
              id: `bot-video-${Date.now()}`,
              senderId: conversation.user.id,
              content: `<<<RENDER_GENERIC_CARD>>>:${cardData}`,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              createdAt: Date.now(),
              isAfterPrompt: true,
            }
            setEducationMessages((prev) => [...prev, botResponse])
            scrollToBottom()
          }, 400)
          return
        }
      }

      const updatedMessages = [...educationMessages, newUserMessage]
      setEducationMessages(updatedMessages)

      // Mock education response
      setTimeout(() => {
        const cardData = JSON.stringify({
          title: "教育助手欢迎您",
          description:
            "我是您的专属教育AI助手。我可以帮您排课、管理商品、处理成员信息以及财务报表。您可以直接点击下方的菜单开启高效管理。",
          detail:
            "🌟 推荐操作：\n1. 点击「课程管理」-「课程履约」\n2. 点击「成员管理」-「学生管理」",
          imageSrc: educationIcon,
        })
        const botResponse: Message = {
          id: `bot-${Date.now()}`,
          senderId: conversation.user.id,
          content: `<<<RENDER_GENERIC_CARD>>>:${cardData}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          createdAt: Date.now(),
        }
        setEducationMessages((prev) => [...prev, botResponse])
        scrollToBottom()
      }, 600)
      return
    }

    const updatedMessages = [...messages, newUserMessage]
    
    // Check for commands
    const isPersonalInfoCommand = PERSONAL_INFO_COMMANDS.some(cmd => 
      inputValue.toLowerCase().includes(cmd.toLowerCase())
    )
    const isCreateEmailCommand = CREATE_EMAIL_COMMANDS.some(cmd => 
      inputValue.toLowerCase().includes(cmd.toLowerCase())
    )
    const isCreateOrgCommand = CREATE_ORG_COMMANDS.some(cmd => 
      inputValue.toLowerCase().includes(cmd.toLowerCase())
    )
    const isJoinOrgCommand = JOIN_ORG_COMMANDS.some(cmd => 
      inputValue.toLowerCase().includes(cmd.toLowerCase())
    )
    const isSwitchOrgCommand = SWITCH_ORG_COMMANDS.some(cmd => 
      inputValue.toLowerCase().includes(cmd.toLowerCase())
    )

    if (isPersonalInfoCommand) {
      const botResponse: Message = {
        id: `bot-${Date.now()}`,
        senderId: conversation.user.id,
        content: PERSONAL_INFO_MARKER,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: Date.now()
      }
      setTimeout(() => {
        setMessages(prev => [...prev, botResponse])
      }, 500)
    } else if (isCreateEmailCommand) {
      const botResponse: Message = {
        id: `bot-${Date.now()}`,
        senderId: conversation.user.id,
        content: CREATE_EMAIL_MARKER,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: Date.now()
      }
      setTimeout(() => {
        setMessages(prev => [...prev, botResponse])
      }, 500)
    } else if (isCreateOrgCommand) {
      const createMsg: Message = {
        id: `org-create-${Date.now()}`,
        senderId: conversation.user.id,
        content: CREATE_ORG_FORM_MARKER,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: Date.now(),
        isAfterPrompt: true
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, createMsg]);
      }, 500)
    } else if (isJoinOrgCommand) {
      const joinMsg: Message = {
        id: `org-join-${Date.now()}`,
        senderId: conversation.user.id,
        content: JOIN_ORG_FORM_MARKER,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: Date.now(),
        isAfterPrompt: true
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, joinMsg]);
      }, 500)
    } else if (isSwitchOrgCommand) {
      const switchMsg: Message = {
        id: `org-switcher-${Date.now()}`,
        senderId: conversation.user.id,
        content: ORG_SWITCHER_MARKER,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: Date.now(),
        isAfterPrompt: true
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, switchMsg]);
      }, 500)
    }

    setMessages(updatedMessages)
    setInputValue("")
  }

  const handleEmailFormSubmit = (msgId: string, data: any) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, isReadonly: true, formData: data } : m))
    
    setTimeout(() => {
      const successMsg: Message = {
        id: `bot-success-${Date.now()}`,
        senderId: conversation.user.id,
        content: `业务邮箱 ${data.emailPrefix}${data.domain} 创建成功，并已分配给 ${data.members.join('、')}。`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: Date.now(),
        isAfterPrompt: true
      }
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
      scrollToBottom();
    }, 100);
  };

  const handleOrgSwitch = (orgId: string) => {
    if (scene === "no-org") {
      if (!noOrgEducationSpacesList.some((s) => s.id === orgId)) return
      setNoOrgSelectedEduSpaceId(orgId)
      return
    }
    if (isEduNoOrgSpaceScene(scene)) {
      if (educationSpaces.some((s) => s.id === orgId)) {
        setCurrentOrg(orgId)
        return
      }
      if (
        scene === "fresh-user" &&
        activeApp !== "education" &&
        freshUserLinkedOrgIds.includes(orgId)
      ) {
        setCurrentOrg(orgId)
        setFreshUserHomeOrgId(orgId)
        return
      }
      /** 教育顶栏只选「教育空间」，勿把企业/组织 id 当作当前会话上下文 */
      return
    }
    const selectedOrg = AVAILABLE_ORGANIZATIONS.find((o) => o.id === orgId)
    if (!selectedOrg) return

    setCurrentOrg(orgId)
  }

  const handleCreateOrg = () => {
    const createMsg: Message = {
      id: `org-create-${Date.now()}`,
      senderId: conversation.user.id,
      content: CREATE_ORG_FORM_MARKER,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now(),
      isAfterPrompt: true
    };
    
    if (activeApp === 'education') {
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
    
    if (activeApp === 'education') {
      setEducationMessages(prev => [...prev, joinMsg]);
    } else {
      setMessages(prev => [...prev, joinMsg]);
    }
  };

  /** 全新用户：在主对话内先选空间类型，再进入对应创建流程（不跳转教育应用） */
  const startCreateEducationSpaceInMainThread = React.useCallback(() => {
    appendMainEducationExchange("创建教育空间", MAIN_EDU_SPACE_TYPE_PICK_MARKER)
  }, [appendMainEducationExchange])

  /** 加入教育空间：主对话追加说明卡片（演示与加入组织表单衔接） */
  const appendJoinEducationHintToMain = React.useCallback(() => {
    const userMsg: Message = {
      id: `user-join-edu-main-${Date.now()}`,
      senderId: currentUser.id,
      content: "加入教育空间",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      createdAt: Date.now(),
    }
    setMessages((prev) => [...prev, userMsg])
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-join-edu-hint-${Date.now()}`,
          senderId: conversation.user.id,
          content: JOIN_EDU_SPACE_HINT_MARKER,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          createdAt: Date.now(),
          isAfterPrompt: true,
        },
      ])
      scrollToBottom()
    }, 350)
  }, [conversation.user.id, scrollToBottom])

  /** 教育顶栏「加入教育空间」：回到主对话并注入邀请码说明卡片 */
  const handleJoinEducationFromNav = React.useCallback(() => {
    setActiveApp(null)
    setSecondaryHistoryOpen(false)
    appendJoinEducationHintToMain()
  }, [appendJoinEducationHintToMain])

  const handleModelSwitch = (modelId: string) => {
    // 查找选中的模型版本
    let selectedVersion = null;
    for (const family of AVAILABLE_MODEL_FAMILIES) {
      const version = family.versions.find(v => v.id === modelId);
      if (version) {
        selectedVersion = version;
        break;
      }
    }
    
    if (!selectedVersion) return;
    
    setCurrentModel(modelId);
    
    console.log(`已切换到模型：${selectedVersion.name}`);
  };

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
    
    // 添加到可用组织列表（实际应该调用后端API）
    const newOrg: Organization = {
      id: newOrgId,
      name: orgData.shortName || orgData.fullName,
      icon: orgIcon,
      memberCount: 1,
      description: orgData.description || `${orgData.industry}企业，位于${orgData.country}`
    };
    
    AVAILABLE_ORGANIZATIONS.push(newOrg);

    if (scene === "fresh-user") {
      setFreshUserLinkedOrgIds((prev) => (prev.includes(newOrgId) ? prev : [...prev, newOrgId]))
      if (!isEducationContext) {
        /** 首页：首个组织立即切换并显示在顶栏；第二个及之后由「查看企业/组织」再进入 */
        if (freshUserLinkedOrgIds.length === 0) {
          setFreshUserHomeOrgId(newOrgId)
          setCurrentOrg(newOrgId)
        }
      } else {
        setFreshUserHomeOrgId(newOrgId)
        setCurrentOrg(newOrgId)
      }
    } else {
      setCurrentOrg(newOrgId)
    }
    
    // 显示创建成功卡片（包含组织详情）
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
      memberCount: 1
    });
    
    const successMsg: Message = {
      id: `org-create-success-${Date.now()}`,
      senderId: conversation.user.id,
      content: `${CREATE_ORG_SUCCESS_MARKER}:${successData}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now(),
      isAfterPrompt: true
    };
    
    if (isEducationContext) {
      setEducationMessages(prev => [...prev, successMsg]);
    } else {
      setMessages(prev => [...prev, successMsg]);
    }
    
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  const handleJoinOrgSubmit = (inviteCode: string, isEducationContext?: boolean) => {
    // 模拟邀请码验证
    const validCodes: Record<string, { orgId: string; orgName: string }> = {
      'XIAOCE2024': { orgId: 'xiaoce', orgName: '小测教育机构' },
      'DEFAULT001': { orgId: 'default', orgName: '默认组织' },
      'TEST123': { orgId: 'test', orgName: '测试机构' }
    };
    
    const matchedOrg = validCodes[inviteCode.toUpperCase()];
    
    if (matchedOrg) {
      const targetOrg = AVAILABLE_ORGANIZATIONS.find(o => o.id === matchedOrg.orgId);
      
      if (targetOrg) {
        // 显示确认加入卡片
        const confirmData = JSON.stringify({
          orgId: targetOrg.id,
          orgName: targetOrg.name,
          orgIcon: targetOrg.icon,
          memberCount: targetOrg.memberCount,
          description: targetOrg.description
        });
        
        const confirmMsg: Message = {
          id: `org-join-confirm-${Date.now()}`,
          senderId: conversation.user.id,
          content: `${JOIN_ORG_CONFIRM_MARKER}:${confirmData}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          createdAt: Date.now(),
          isAfterPrompt: true
        };
        
        if (isEducationContext) {
          setEducationMessages(prev => [...prev, confirmMsg]);
        } else {
          setMessages(prev => [...prev, confirmMsg]);
        }
      }
    } else {
      // 邀请码无效
      const errorMsg: Message = {
        id: `org-join-error-${Date.now()}`,
        senderId: conversation.user.id,
        content: `邀请码「${inviteCode}」无效或已过期，请检查后重试。您可以联系组织管理员获取有效的邀请码。`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: Date.now(),
        isAfterPrompt: true
      };
      
      if (isEducationContext) {
        setEducationMessages(prev => [...prev, errorMsg]);
      } else {
        setMessages(prev => [...prev, errorMsg]);
      }
    }
    
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  const handleConfirmJoinOrg = (orgId: string, isEducationContext?: boolean) => {
    const targetOrg = AVAILABLE_ORGANIZATIONS.find(o => o.id === orgId);
    if (!targetOrg) return;

    if (scene === "fresh-user" && !isEducationContext) {
      const isFirstHomeOrg = freshUserLinkedOrgIds.length === 0
      setFreshUserLinkedOrgIds((prev) => (prev.includes(orgId) ? prev : [...prev, orgId]))
      if (isFirstHomeOrg) {
        setCurrentOrg(orgId)
        setFreshUserHomeOrgId(orgId)
      }
    } else {
      setCurrentOrg(orgId)
      if (scene === "fresh-user") {
        setFreshUserLinkedOrgIds((prev) => (prev.includes(orgId) ? prev : [...prev, orgId]))
        setFreshUserHomeOrgId(orgId)
      }
    }

    const industryJoined = FRESH_JOIN_ORG_INDUSTRY[orgId] ?? "其他"
    const joinPayload = JSON.stringify({
      orgId: targetOrg.id,
      orgName: targetOrg.name,
      fullName: targetOrg.name,
      country: "—",
      industry: industryJoined,
      address: "—",
      email: "—",
      phone: "—",
      description: targetOrg.description ?? "",
      memberCount: targetOrg.memberCount ?? 0,
    })

    const successMsg: Message = {
      id: `org-join-success-${Date.now()}`,
      senderId: conversation.user.id,
      content:
        scene === "fresh-user" && !isEducationContext
          ? `${CREATE_ORG_SUCCESS_MARKER}:${joinPayload}`
          : `欢迎加入「${targetOrg.name}」！您现在可以访问该组织的所有资源，并与 ${targetOrg.memberCount} 位成员协作。`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      createdAt: Date.now(),
      isAfterPrompt: true,
    }

    if (isEducationContext) {
      setEducationMessages((prev) => [...prev, successMsg])
    } else {
      setMessages((prev) => [...prev, successMsg])
    }
    
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleNewConversation = () => {
    if (scene === "fresh-user") {
      const k = freshUserHomeOrgId
      const reset: Message[] = [
        {
          id: "fresh-user-onboarding",
          senderId: conversation.user.id,
          content: FRESH_USER_ONBOARDING_MARKER,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          createdAt: Date.now(),
          isAfterPrompt: true,
        },
      ]
      freshUserMainMapRef.current[k] = reset
      freshUserMainKeyRef.current = k
      setMessages(reset)
      return
    }
    setMessages([])
  }

  const handleSecondaryAppNewConversation = React.useCallback(() => {
    setOrgMessages((prev) => ({
      ...prev,
      [educationStorageKey]: [],
    }))
    setSecondaryHistoryOpen(false)
  }, [educationStorageKey])

  const handleSecondarySessionSelect = (sessionId: string) => {
    setSelectedSecondarySession(sessionId);
    // Here you would load the messages for that session
    // For now, we'll just log it
    console.log('Selected secondary app session:', sessionId);
  }

  const renderMessageList = (messagesList: Message[], isEducationContext: boolean) => {
    return messagesList.map((msg, index, arr) => {
      const isMe = msg.senderId === currentUser.id
      const isPersonalInfo = msg.content === PERSONAL_INFO_MARKER
      const isCreateEmailForm = msg.content === CREATE_EMAIL_MARKER
      const isContinueEmail = msg.content === CONTINUE_EMAIL_MARKER
      const isGenericCard = msg.content.startsWith("<<<RENDER_GENERIC_CARD>>>:");
      const isOrgSwitcher = msg.content === ORG_SWITCHER_MARKER;
      const isCreateOrgForm = msg.content === CREATE_ORG_FORM_MARKER;
      const isCreateOrgSuccess = msg.content.startsWith(`${CREATE_ORG_SUCCESS_MARKER}:`);
      const isJoinOrgForm = msg.content === JOIN_ORG_FORM_MARKER;
      const isJoinOrgConfirm = msg.content.startsWith(`${JOIN_ORG_CONFIRM_MARKER}:`);
      const isEduNoEduWelcome = msg.content === EDU_NO_EDU_WELCOME_MARKER;
      const isEduWithSpaceWelcome = msg.content.startsWith(`${EDU_WITH_SPACE_WELCOME_MARKER}:`);
      const isCreateFamilyRole = msg.content === CREATE_FAMILY_EDU_ROLE_MARKER;
      const isCreateFamilyEdu =
        msg.content === CREATE_FAMILY_EDU_MARKER || msg.content.startsWith(`${CREATE_FAMILY_EDU_MARKER}:`);
      const isCreateInstitutionalEdu = msg.content === CREATE_INSTITUTIONAL_EDU_MARKER;
      const isEduSpaceCreated = msg.content.startsWith(`${EDU_SPACE_CREATED_CARD_MARKER}:`);
      const isFreshUserOnboarding = msg.content === FRESH_USER_ONBOARDING_MARKER;
      const isJoinEduHint = msg.content === JOIN_EDU_SPACE_HINT_MARKER;
      const isMainEduSpaceTypePick = msg.content === MAIN_EDU_SPACE_TYPE_PICK_MARKER;
      const isSpecialComponent =
        isPersonalInfo ||
        isCreateEmailForm ||
        isContinueEmail ||
        isGenericCard ||
        isEduNoEduWelcome ||
        isEduWithSpaceWelcome ||
        isMainEduSpaceTypePick ||
        isFreshUserOnboarding ||
        isJoinEduHint ||
        isCreateFamilyRole ||
        isCreateFamilyEdu ||
        isCreateInstitutionalEdu ||
        isEduSpaceCreated ||
        isOrgSwitcher ||
        isCreateOrgForm ||
        isCreateOrgSuccess ||
        isJoinOrgForm ||
        isJoinOrgConfirm
      const showTimestamp = shouldShowTimestamp(msg, index > 0 ? arr[index - 1] : null)
      const isSameSender = index > 0 && arr[index - 1].senderId === msg.senderId;
      const isWithin10Seconds = index > 0 && 
        (msg.createdAt !== undefined && arr[index - 1].createdAt !== undefined) 
          ? (msg.createdAt! - arr[index - 1].createdAt!) <= 10000 
          : false;
      const hideAvatar = isSameSender && !showTimestamp && isWithin10Seconds && !msg.isAfterPrompt;

      /** 避免父级 flex 的 gap-800 作用在时间戳与气泡之间；与下方内容同组，用 gap-[10px] 控制间距（与教育欢迎一致） */
      const compactEduWelcomeTimestamp =
        scene === "fresh-user" &&
        isEducationContext &&
        showTimestamp &&
        (isEduNoEduWelcome || isEduWithSpaceWelcome)
      const compactHomeOnboardingTimestamp =
        scene === "fresh-user" &&
        !isEducationContext &&
        showTimestamp &&
        isFreshUserOnboarding
      const compactTimestampTight =
        compactEduWelcomeTimestamp || compactHomeOnboardingTimestamp

      return (
        <div
          key={msg.id}
          data-message-id={msg.id}
          className={cn("flex w-full flex-col", compactTimestampTight && "gap-[10px]")}
        >
          {showTimestamp && (
            <TimestampSeparator
              time={msg.timestamp}
              className={compactTimestampTight ? "!my-0" : undefined}
            />
          )}
          {isGenericCard ? (
            <div className={cn(
              "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
              hideAvatar ? "-mt-[var(--space-600)]" : ""
            )}>
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <AssistantMessageContentColumn
                msg={msg}
                messageIndex={index}
                messages={messagesList}
                currentConversationId={conversation.id}
                className="w-full"
              >
                {(() => {
                  try {
                    const cardData = JSON.parse(msg.content.replace("<<<RENDER_GENERIC_CARD>>>:", ""));
                    return (
                      <GenericCard title={cardData.title}>
                        <p className="text-[length:var(--font-size-base)] text-text-secondary mb-[var(--space-200)] leading-relaxed">{cardData.description}</p>
                        {cardData.detail && (
                          <div className="bg-bg-secondary border border-border rounded-md p-[var(--space-400)]">
                            <p className="text-[length:var(--font-size-sm)] text-text whitespace-pre-wrap">{cardData.detail}</p>
                          </div>
                        )}
                        <div className="flex flex-col sm:flex-row gap-[var(--space-200)] w-full mt-[var(--space-400)]">
                          <Button className="w-full sm:w-auto" variant="chat-submit" onClick={() => {
                            const userMsg: Message = {
                              id: `user-start-${Date.now()}`,
                              senderId: currentUser.id,
                              content: "我已经准备好了，请开始吧。",
                              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                              createdAt: Date.now()
                            };
                            if (isEducationContext) {
                              setEducationMessages(prev => [...prev, userMsg]);
                            } else {
                              setMessages(prev => [...prev, userMsg]);
                            }
                          }}>开始学习</Button>
                          <Button className="w-full sm:w-auto" variant="chat-reset" onClick={() => {
                            const newCardData = JSON.stringify({
                              title: "更多推荐",
                              description: "这里是为您推荐的另外一些管理功能。",
                              detail: "🌟 推荐操作：\n1. 点击「商品管理」-「物料商品」\n2. 点击「财务管理」-「财务报表」",
                              imageSrc: cardData.imageSrc
                            });
                            const botMsg: Message = {
                              id: `bot-card-${Date.now()}`,
                              senderId: conversation.user.id,
                              content: `<<<RENDER_GENERIC_CARD>>>:${newCardData}`,
                              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                              createdAt: Date.now(),
                              isAfterPrompt: true
                            };
                            if (isEducationContext) {
                              setEducationMessages(prev => [...prev, botMsg]);
                            } else {
                              setMessages(prev => [...prev, botMsg]);
                            }
                          }}>换一个</Button>
                        </div>
                      </GenericCard>
                    )
                  } catch (e) {
                    return <div className="text-error">卡片数据解析失败</div>
                  }
                })()}
              </AssistantMessageContentColumn>
            </div>
          ) : isMainEduSpaceTypePick ? (
            <div className={cn(
              "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
              hideAvatar ? "-mt-[var(--space-600)]" : ""
            )}>
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <AssistantMessageContentColumn
                msg={msg}
                messageIndex={index}
                messages={messagesList}
                currentConversationId={conversation.id}
                className="w-full"
              >
                <EducationSpaceTypePickerCard
                  onChooseFamily={() =>
                    scene === "fresh-user" && !isEducationContext
                      ? appendMainEducationExchange(
                          "我要创建家庭教育空间",
                          CREATE_FAMILY_EDU_ROLE_MARKER,
                        )
                      : appendEducationExchange(
                          "我要创建家庭教育空间",
                          CREATE_FAMILY_EDU_ROLE_MARKER,
                        )
                  }
                  onChooseInstitutional={() =>
                    scene === "fresh-user" && !isEducationContext
                      ? appendMainEducationExchange(
                          "我要创建机构教育空间",
                          CREATE_INSTITUTIONAL_EDU_MARKER,
                        )
                      : appendEducationExchange(
                          "我要创建机构教育空间",
                          CREATE_INSTITUTIONAL_EDU_MARKER,
                        )
                  }
                  onWatchVideo={
                    scene === "fresh-user" && !isEducationContext
                      ? openNoEduVideoIntroMain
                      : openNoEduVideoIntro
                  }
                />
              </AssistantMessageContentColumn>
            </div>
          ) : isEduWithSpaceWelcome ? (
            <div className={cn(
              "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
              hideAvatar ? "-mt-[var(--space-600)]" : ""
            )}>
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <AssistantMessageContentColumn
                msg={msg}
                messageIndex={index}
                messages={messagesList}
                currentConversationId={conversation.id}
                className="w-full"
              >
                {(() => {
                  const parsed = parseEduWithSpaceWelcomePayload(msg.content)
                  if (!parsed) {
                    return <div className="text-[length:var(--font-size-sm)] text-error">欢迎提示解析失败</div>
                  }
                  return (
                    <EducationWithSpaceWelcomeCard
                      kind={parsed.kind}
                      spaceName={parsed.spaceName}
                      onQuickPrompt={(text) => {
                        setInputValue(text)
                        setTimeout(() => handleSendMessage(), 100)
                      }}
                      onWatchVideo={openNoEduVideoIntro}
                    />
                  )
                })()}
              </AssistantMessageContentColumn>
            </div>
          ) : isEduNoEduWelcome ? (
            <div className={cn(
              "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
              hideAvatar ? "-mt-[var(--space-600)]" : ""
            )}>
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <AssistantMessageContentColumn
                msg={msg}
                messageIndex={index}
                messages={messagesList}
                currentConversationId={conversation.id}
                className="w-full"
              >
                <EducationNoEduWelcomeCard
                  onCreateFamily={() =>
                    scene === "fresh-user" && !isEducationContext
                      ? appendMainEducationExchange(
                          "我要创建家庭教育空间",
                          CREATE_FAMILY_EDU_ROLE_MARKER,
                        )
                      : appendEducationExchange(
                          "我要创建家庭教育空间",
                          CREATE_FAMILY_EDU_ROLE_MARKER,
                        )
                  }
                  onCreateInstitutional={() =>
                    scene === "fresh-user" && !isEducationContext
                      ? appendMainEducationExchange(
                          "我要创建机构教育空间",
                          CREATE_INSTITUTIONAL_EDU_MARKER,
                        )
                      : appendEducationExchange(
                          "我要创建机构教育空间",
                          CREATE_INSTITUTIONAL_EDU_MARKER,
                        )
                  }
                  onWatchVideo={
                    scene === "fresh-user" && !isEducationContext
                      ? openNoEduVideoIntroMain
                      : () => openNoEduVideoIntro("什么是微微教育")
                  }
                />
              </AssistantMessageContentColumn>
            </div>
          ) : isFreshUserOnboarding ? (
            <div className={cn(
              "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
              hideAvatar ? "-mt-[var(--space-600)]" : "",
              scene === "fresh-user" && showTimestamp
                ? "mt-[calc(10px-var(--space-800))]"
                : ""
            )}>
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <AssistantMessageContentColumn
                msg={msg}
                messageIndex={index}
                messages={messagesList}
                currentConversationId={conversation.id}
                className="w-full"
              >
                <FreshUserOnboardingCard
                  onCreateOrg={handleCreateOrg}
                  onJoinOrg={handleJoinOrg}
                  onCreateEducationSpace={startCreateEducationSpaceInMainThread}
                  onJoinEducationSpace={appendJoinEducationHintToMain}
                />
              </AssistantMessageContentColumn>
            </div>
          ) : isJoinEduHint ? (
            <div className={cn(
              "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
              hideAvatar ? "-mt-[var(--space-600)]" : ""
            )}>
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <AssistantMessageContentColumn
                msg={msg}
                messageIndex={index}
                messages={messagesList}
                currentConversationId={conversation.id}
                className="w-full"
              >
                <JoinEducationSpaceHintCard onUseInviteCode={handleJoinOrg} />
              </AssistantMessageContentColumn>
            </div>
          ) : isCreateFamilyRole ? (
            <div className={cn(
              "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
              hideAvatar ? "-mt-[var(--space-600)]" : ""
            )}>
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <AssistantMessageContentColumn
                msg={msg}
                messageIndex={index}
                messages={messagesList}
                currentConversationId={conversation.id}
                className="w-full max-w-[min(100%,720px)]"
              >
                <FamilyEducationRoleCard onSelectRole={confirmFamilyEducationRole} />
              </AssistantMessageContentColumn>
            </div>
          ) : isCreateFamilyEdu ? (
            <div className={cn(
              "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
              hideAvatar ? "-mt-[var(--space-600)]" : ""
            )}>
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <AssistantMessageContentColumn
                msg={msg}
                messageIndex={index}
                messages={messagesList}
                currentConversationId={conversation.id}
                className="w-full max-w-[min(100%,720px)]"
              >
                <CreateFamilyEducationSpaceCard
                  creatorRole={parseFamilyEduCreatorRoleFromContent(msg.content)}
                  onSubmit={handleFamilySpaceSubmit}
                />
              </AssistantMessageContentColumn>
            </div>
          ) : isCreateInstitutionalEdu ? (
            <div className={cn(
              "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
              hideAvatar ? "-mt-[var(--space-600)]" : ""
            )}>
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <AssistantMessageContentColumn
                msg={msg}
                messageIndex={index}
                messages={messagesList}
                currentConversationId={conversation.id}
                className="w-full max-w-[min(100%,720px)]"
              >
                <CreateInstitutionalEducationSpaceCard
                  onSubmit={handleInstitutionalSpaceSubmit}
                  adminCompanyOptions={
                    scene === "fresh-user" && freshUserLinkedOrgIds.length > 0
                      ? freshUserLinkedOrgIds
                          .map((id) => AVAILABLE_ORGANIZATIONS.find((o) => o.id === id)?.name)
                          .filter((n): n is string => Boolean(n))
                      : undefined
                  }
                />
              </AssistantMessageContentColumn>
            </div>
          ) : isEduSpaceCreated ? (
            <div className={cn(
              "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
              hideAvatar ? "-mt-[var(--space-600)]" : ""
            )}>
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <AssistantMessageContentColumn
                msg={msg}
                messageIndex={index}
                messages={messagesList}
                currentConversationId={conversation.id}
                className="w-full max-w-[min(100%,720px)]"
              >
                {(() => {
                  try {
                    const raw = msg.content.slice(`${EDU_SPACE_CREATED_CARD_MARKER}:`.length)
                    const parsed = JSON.parse(raw) as {
                      spaceName: string
                      kind: "family" | "institutional"
                      spaceId: string
                    }
                    return (
                      <EducationSpaceCreatedCard
                        spaceName={parsed.spaceName}
                        kind={parsed.kind}
                        onInviteMembers={() => {
                          const userMsg: Message = {
                            id: `user-invite-edu-${Date.now()}`,
                            senderId: currentUser.id,
                            content: "邀请成员",
                            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                            createdAt: Date.now(),
                          }
                          if (isEducationContext) {
                            setEducationMessages((prev) => [...prev, userMsg])
                          } else {
                            setMessages((prev) => [...prev, userMsg])
                          }
                          setTimeout(() => {
                            const botReply: Message = {
                              id: `bot-invite-edu-${Date.now()}`,
                              senderId: conversation.user.id,
                              content:
                                "（演示）请使用底部「成员管理」向他人发送邀请，对方接受后即可加入该教育空间。",
                              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                              createdAt: Date.now(),
                              isAfterPrompt: true,
                            }
                            if (isEducationContext) {
                              setEducationMessages((prev) => [...prev, botReply])
                            } else {
                              setMessages((prev) => [...prev, botReply])
                            }
                            scrollToBottom()
                          }, 400)
                        }}
                        onCreatePlan={() => {
                          const userMsg: Message = {
                            id: `user-plan-${Date.now()}`,
                            senderId: currentUser.id,
                            content: "创建计划",
                            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                            createdAt: Date.now(),
                          }
                          if (isEducationContext) {
                            setEducationMessages((prev) => [...prev, userMsg])
                          } else {
                            setMessages((prev) => [...prev, userMsg])
                          }
                          setTimeout(() => {
                            const botReply: Message = {
                              id: `bot-plan-${Date.now()}`,
                              senderId: conversation.user.id,
                              content:
                                "（演示）你可以在「待办」或教育相关能力中创建学习计划；也可直接告诉我目标与时间。",
                              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                              createdAt: Date.now(),
                              isAfterPrompt: true,
                            }
                            if (isEducationContext) {
                              setEducationMessages((prev) => [...prev, botReply])
                            } else {
                              setMessages((prev) => [...prev, botReply])
                            }
                            scrollToBottom()
                          }, 400)
                        }}
                        onGoToEducationSpace={
                          scene === "fresh-user" && !isEducationContext
                            ? () => {
                                setOrgMessages((prev) => {
                                  const loose = prev[EDU_NO_EDU_THREAD_KEY] || []
                                  if (loose.length === 0) return prev
                                  const cur = prev[parsed.spaceId] || []
                                  return {
                                    ...prev,
                                    [parsed.spaceId]: [...loose, ...cur],
                                    [EDU_NO_EDU_THREAD_KEY]: [],
                                  }
                                })
                                setCurrentOrg(parsed.spaceId)
                                setActiveApp("education")
                                setSecondaryHistoryOpen(false)
                                setTimeout(() => scrollToBottom(), 200)
                              }
                            : undefined
                        }
                      />
                    )
                  } catch {
                    return (
                      <div className="text-[length:var(--font-size-sm)] text-[color:var(--color-error)]">
                        空间卡片数据解析失败
                      </div>
                    )
                  }
                })()}
              </AssistantMessageContentColumn>
            </div>
          ) : isOrgSwitcher ? (
            <div className={cn(
              "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
              hideAvatar ? "-mt-[var(--space-600)]" : ""
            )}>
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <AssistantMessageContentColumn
                msg={msg}
                messageIndex={index}
                messages={messagesList}
                currentConversationId={conversation.id}
                className="w-full"
              >
                <OrganizationSwitcherCard
                  currentOrg={
                    (isEducationContext && isEduNoOrgSpaceScene(scene)
                      ? educationSpacesOnlyForSwitcher.find((o) => o.id === currentOrg) ||
                        educationSpacesOnlyForSwitcher[0]
                      : isEducationContext && scene === "no-org"
                        ? organizationsForNoOrgEducationNav.find((o) => o.id === noOrgSelectedEduSpaceId) ||
                          organizationsForNoOrgEducationNav[0]
                        : AVAILABLE_ORGANIZATIONS.find((o) => o.id === currentOrg) ||
                          AVAILABLE_ORGANIZATIONS[0]) || AVAILABLE_ORGANIZATIONS[0]
                  }
                  organizations={
                    isEducationContext && isEduNoOrgSpaceScene(scene)
                      ? educationSpacesOnlyForSwitcher
                      : isEducationContext && scene === "no-org"
                        ? organizationsForNoOrgEducationNav
                        : AVAILABLE_ORGANIZATIONS
                  }
                  onSelectOrg={handleOrgSwitch}
                  onCreateOrg={handleCreateOrg}
                  onJoinOrg={handleJoinOrg}
                />
              </AssistantMessageContentColumn>
            </div>
          ) : isCreateOrgForm ? (
            <div className={cn(
              "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
              hideAvatar ? "-mt-[var(--space-600)]" : ""
            )}>
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <AssistantMessageContentColumn
                msg={msg}
                messageIndex={index}
                messages={messagesList}
                currentConversationId={conversation.id}
                className="w-full"
              >
                <CreateOrgFormCard
                  onSubmit={(data) => handleCreateOrgSubmit(data, isEducationContext)}
                  onCancel={() => {
                    // 可选：返回组织切换器
                  }}
                />
              </AssistantMessageContentColumn>
            </div>
          ) : isCreateOrgSuccess ? (
            <div className={cn(
              "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
              hideAvatar ? "-mt-[var(--space-600)]" : ""
            )}>
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <AssistantMessageContentColumn
                msg={msg}
                messageIndex={index}
                messages={messagesList}
                currentConversationId={conversation.id}
                className="w-full"
              >
                {(() => {
                  try {
                    const successData = JSON.parse(msg.content.replace(`${CREATE_ORG_SUCCESS_MARKER}:`, ""));
                    const showDeferredHomeOrg =
                      scene === "fresh-user" && !isEducationContext && successData.orgId !== currentOrg
                    return (
                      <>
                        {/* 引导提示气泡 */}
                        <div className="bg-bg p-[var(--space-350)] rounded-tl-sm rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-xs border border-transparent w-full md:max-w-[600px] mb-[var(--space-300)]">
                          <p className="text-text text-[length:var(--font-size-base)] leading-normal">
                            {showDeferredHomeOrg
                              ? "💡 组织已就绪，当前尚未自动切换到该组织。您可通过邀请码邀请成员或管理设置；也可从下方行动建议进入该组织。"
                              : "💡 您可以通过邀请码邀请其他成员加入组织，或管理组织的各项设置。接下来您可以："}
                          </p>
                        </div>
                        
                        <CreateOrgSuccessCard
                          orgId={successData.orgId}
                          orgName={successData.orgName}
                          fullName={successData.fullName}
                          country={successData.country}
                          industry={successData.industry}
                          address={successData.address}
                          email={successData.email}
                          phone={successData.phone}
                          description={successData.description}
                          memberCount={successData.memberCount}
                          summaryLine={
                            showDeferredHomeOrg
                              ? `恭喜！组织「${successData.orgName}」已可使用，当前尚未自动切换。请点击下方行动建议中的「查看企业/组织」再进入该组织。`
                              : undefined
                          }
                        />
                        
                        {/* 行动建议引导气泡 */}
                        <div className="bg-bg p-[var(--space-350)] rounded-tl-sm rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-xs border border-transparent w-fit max-w-full mt-[var(--space-300)] mb-[var(--space-200)]">
                          <p className="text-text text-[length:var(--font-size-base)] leading-normal min-w-0 break-words">
                            接下来您可以：
                          </p>
                        </div>
                        
                        {/* Prompt buttons：全新用户主对话按行业分支；其余场景保留原三键 */}
                        <div className="flex flex-wrap justify-start gap-[var(--space-200)]">
                          {scene === "fresh-user" && !isEducationContext ? (
                            <>
                              {showDeferredHomeOrg ? (
                                <ChatPromptButton
                                  type="button"
                                  onClick={() => {
                                    setCurrentOrg(successData.orgId)
                                    setFreshUserHomeOrgId(successData.orgId)
                                    setTimeout(() => scrollToBottom(), 100)
                                  }}
                                >
                                  查看企业/组织
                                </ChatPromptButton>
                              ) : null}
                              {isEducationIndustryType(successData.industry) && (
                                <ChatPromptButton
                                  type="button"
                                  onClick={() => {
                                    appendMainEducationExchange(
                                      "我要创建机构教育空间",
                                      CREATE_INSTITUTIONAL_EDU_MARKER,
                                    )
                                  }}
                                >
                                  创建机构教育空间
                                </ChatPromptButton>
                              )}
                              <ChatPromptButton
                                type="button"
                                onClick={() => {
                                  const userMsg: Message = {
                                    id: `user-invite-${Date.now()}`,
                                    senderId: currentUser.id,
                                    content: "邀请员工",
                                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                                    createdAt: Date.now(),
                                  }
                                  setMessages((prev) => [...prev, userMsg])
                                  setTimeout(() => {
                                    const inviteCode = `INVITE${Math.random().toString(36).substring(2, 8).toUpperCase()}`
                                    const botMsg: Message = {
                                      id: `bot-invite-${Date.now()}`,
                                      senderId: conversation.user.id,
                                      content: `已为组织「${successData.orgName}」生成邀请码：**${inviteCode}**\n\n有效期：7天\n使用次数：不限\n\n您可以将此邀请码分享给需要加入组织的成员。`,
                                      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                                      createdAt: Date.now(),
                                      isAfterPrompt: true,
                                    }
                                    setMessages((prev) => [...prev, botMsg])
                                  }, 500)
                                }}
                              >
                                邀请员工
                              </ChatPromptButton>
                              <ChatPromptButton
                                type="button"
                                onClick={() => {
                                  const userMsg: Message = {
                                    id: `user-settings-${Date.now()}`,
                                    senderId: currentUser.id,
                                    content: "管理组织",
                                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                                    createdAt: Date.now(),
                                  }
                                  setMessages((prev) => [...prev, userMsg])
                                  setTimeout(() => {
                                    const botMsg: Message = {
                                      id: `bot-settings-${Date.now()}`,
                                      senderId: conversation.user.id,
                                      content: `组织设置功能包括：\n\n1. **基本信息** - 修改组织名称、描述、Logo等\n2. **成员管理** - 查看、添加、移除成员\n3. **权限设置** - 配置角色和权限\n4. **邀请管理** - 创建和管理邀请码\n\n请问您想要管理哪一项？`,
                                      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                                      createdAt: Date.now(),
                                      isAfterPrompt: true,
                                    }
                                    setMessages((prev) => [...prev, botMsg])
                                  }, 500)
                                }}
                              >
                                管理组织
                              </ChatPromptButton>
                              <ChatPromptButton
                                type="button"
                                onClick={() => {
                                  const userMsg: Message = {
                                    id: `user-email-${Date.now()}`,
                                    senderId: currentUser.id,
                                    content: "创建业务邮箱",
                                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                                    createdAt: Date.now(),
                                  }
                                  setMessages((prev) => [...prev, userMsg])
                                  setTimeout(() => {
                                    const botMsg: Message = {
                                      id: `bot-email-${Date.now()}`,
                                      senderId: conversation.user.id,
                                      content: CREATE_EMAIL_MARKER,
                                      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                                      createdAt: Date.now(),
                                      isAfterPrompt: true,
                                    }
                                    setMessages((prev) => [...prev, botMsg])
                                  }, 500)
                                }}
                              >
                                激活邮箱
                              </ChatPromptButton>
                            </>
                          ) : (
                            <>
                              <ChatPromptButton
                                onClick={() => {
                                  const userMsg: Message = {
                                    id: `user-invite-${Date.now()}`,
                                    senderId: currentUser.id,
                                    content: "生成邀请码",
                                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                                    createdAt: Date.now(),
                                  }
                                  if (isEducationContext) {
                                    setEducationMessages((prev) => [...prev, userMsg])
                                  } else {
                                    setMessages((prev) => [...prev, userMsg])
                                  }

                                  setTimeout(() => {
                                    const inviteCode = `INVITE${Math.random().toString(36).substring(2, 8).toUpperCase()}`
                                    const botMsg: Message = {
                                      id: `bot-invite-${Date.now()}`,
                                      senderId: conversation.user.id,
                                      content: `已为组织「${successData.orgName}」生成邀请码：**${inviteCode}**\n\n有效期：7天\n使用次数：不限\n\n您可以将此邀请码分享给需要加入组织的成员。`,
                                      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                                      createdAt: Date.now(),
                                      isAfterPrompt: true,
                                    }
                                    if (isEducationContext) {
                                      setEducationMessages((prev) => [...prev, botMsg])
                                    } else {
                                      setMessages((prev) => [...prev, botMsg])
                                    }
                                  }, 500)
                                }}
                              >
                                生成邀请码
                              </ChatPromptButton>
                              <ChatPromptButton
                                onClick={() => {
                                  const userMsg: Message = {
                                    id: `user-settings-${Date.now()}`,
                                    senderId: currentUser.id,
                                    content: "管理组织设置",
                                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                                    createdAt: Date.now(),
                                  }
                                  if (isEducationContext) {
                                    setEducationMessages((prev) => [...prev, userMsg])
                                  } else {
                                    setMessages((prev) => [...prev, userMsg])
                                  }

                                  setTimeout(() => {
                                    const botMsg: Message = {
                                      id: `bot-settings-${Date.now()}`,
                                      senderId: conversation.user.id,
                                      content: `组织设置功能包括：\n\n1. **基本信息** - 修改组织名称、描述、Logo等\n2. **成员管理** - 查看、添加、移除成员\n3. **权限设置** - 配置角色和权限\n4. **邀请管理** - 创建和管理邀请码\n\n请问您想要管理哪一项？`,
                                      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                                      createdAt: Date.now(),
                                      isAfterPrompt: true,
                                    }
                                    if (isEducationContext) {
                                      setEducationMessages((prev) => [...prev, botMsg])
                                    } else {
                                      setMessages((prev) => [...prev, botMsg])
                                    }
                                  }, 500)
                                }}
                              >
                                管理组织设置
                              </ChatPromptButton>
                              <ChatPromptButton
                                onClick={() => {
                                  const userMsg: Message = {
                                    id: `user-view-${Date.now()}`,
                                    senderId: currentUser.id,
                                    content: "查看组织详情",
                                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                                    createdAt: Date.now(),
                                  }
                                  if (isEducationContext) {
                                    setEducationMessages((prev) => [...prev, userMsg])
                                  } else {
                                    setMessages((prev) => [...prev, userMsg])
                                  }

                                  setTimeout(() => {
                                    handleOrgSwitch(successData.orgId)
                                  }, 300)
                                }}
                              >
                                查看组织详情
                              </ChatPromptButton>
                            </>
                          )}
                        </div>
                      </>
                    )
                  } catch (e) {
                    return <div className="text-[length:var(--font-size-sm)] text-[color:var(--color-error)]">成功数据解析失败</div>
                  }
                })()}
              </AssistantMessageContentColumn>
            </div>
          ) : isJoinOrgForm ? (
            <div className={cn(
              "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
              hideAvatar ? "-mt-[var(--space-600)]" : ""
            )}>
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <AssistantMessageContentColumn
                msg={msg}
                messageIndex={index}
                messages={messagesList}
                currentConversationId={conversation.id}
                className="w-full"
              >
                <JoinOrgFormCard
                  onSubmit={(code) => handleJoinOrgSubmit(code, isEducationContext)}
                  onCancel={() => {
                    // 可选：返回组织切换器
                  }}
                />
              </AssistantMessageContentColumn>
            </div>
          ) : isJoinOrgConfirm ? (
            <div className={cn(
              "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
              hideAvatar ? "-mt-[var(--space-600)]" : ""
            )}>
              {!hideAvatar ? (
                <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
                  <AvatarImage src={conversation.user.avatar} />
                </Avatar>
              ) : (
                <div className="hidden md:block w-[36px] shrink-0" />
              )}
              <AssistantMessageContentColumn
                msg={msg}
                messageIndex={index}
                messages={messagesList}
                currentConversationId={conversation.id}
                className="w-full"
              >
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
              </AssistantMessageContentColumn>
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
                hideAvatar ? "-mt-[var(--space-600)]" : "",
                isMe ? "flex-col-reverse md:flex-row" : ""
              )}
              handleEmailFormSubmit={handleEmailFormSubmit}
              handleContinueCreateEmail={handleContinueCreateEmail}
              messageIndex={index}
              allMessages={messagesList}
              currentConversationId={conversation.id}
            />
          )}
        </div>
      )
    })
  }

  return (
    <div className="absolute inset-0 flex flex-row w-full isolate overflow-hidden bg-cui-bg">
      
      {/* History Sidebar */}
      {onHistoryOpenChange && onSelect && (
        <HistorySidebar
          open={historyOpen}
          onOpenChange={onHistoryOpenChange}
          conversations={conversations}
          selectedId={selectedId}
          onSelect={onSelect}
          mode={activeApp ? 'push' : 'overlay'}
          onNewConversation={handleNewConversation}
        />
      )}

      {/* Secondary App History Sidebar（全新用户无教育空间时不展示，避免空壳二级区） */}
      {activeApp === "education" && !hideEducationSecondaryChrome && (
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

      {/* Main Content Wrapper */}
      <div className={cn(
        "flex flex-col flex-1 h-full w-full shrink-0 min-w-0 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] bg-cui-bg",
        activeApp ? "md:shrink" : "",
        // Main history sidebar push effect
        historyOpen && !activeApp ? "translate-x-[280px] md:translate-x-0" : "",
        // Secondary app history sidebar push effect（无二级侧栏时不位移）
        secondaryHistoryOpen && activeApp === "education" && !hideEducationSecondaryChrome
          ? "translate-x-[200px] md:translate-x-0"
          : ""
      )}>
        {/* Header - Fixed at top */}
      <ChatNavBar 
        title=""
        onToggleHistory={() => {
          if (activeApp === "education" && !hideEducationSecondaryChrome) {
            setSecondaryHistoryOpen(!secondaryHistoryOpen)
          } else {
            onToggleHistory()
          }
        }}
        onNewMessage={activeApp ? undefined : handleNewConversation}
        showOrgSelect
        orgSwitcherMode={
          scene === "no-org"
            ? activeApp === "education"
              ? "no-org-mock-family-edu"
              : "no-org"
            : scene === "fresh-user"
              ? activeApp === "education"
                ? educationSpaces.length === 0
                  ? "edu-empty"
                  : "fresh-user-edu-hierarchy"
                : freshUserLinkedOrgIds.length > 0
                  ? "default"
                  : "no-org"
            : scene === "no-org-no-edu" && educationSpaces.length === 0
              ? "edu-empty"
              : "default"
        }
        orgFooterVariant={
          (scene === "no-org-no-edu" || scene === "fresh-user") &&
          educationSpaces.length > 0 &&
          activeApp === "education"
            ? "edu-spaces"
            : "default"
        }
        currentOrg={
          scene === "no-org" && activeApp === "education"
            ? noOrgSelectedEduSpaceId
            : currentOrg
        }
        organizations={
          scene === "no-org"
            ? activeApp === "education"
              ? organizationsForNoOrgEducationNav
              : []
            : scene === "no-org-no-edu" || scene === "fresh-user"
              ? organizationsForSwitcher
              : AVAILABLE_ORGANIZATIONS
        }
        freshUserEduHierarchyGroups={freshUserEduHierarchyNav.groups}
        freshUserStandaloneEduSpaces={freshUserEduHierarchyNav.standalone}
        onOrgSelect={handleOrgSwitch}
        onCreateOrg={handleCreateOrg}
        onJoinOrg={handleJoinOrg}
        onCreateEduInstitutional={() => triggerEduFlowFromNav("institutional")}
        onCreateEduFamily={() => triggerEduFlowFromNav("family")}
        onJoinEduSpace={
          scene === "fresh-user" && activeApp === "education" && educationSpaces.length === 0
            ? handleJoinEducationFromNav
            : undefined
        }
        onBack={activeApp === 'education' ? () => setActiveApp(null) : undefined}
        showModelSelect
        currentModel={currentModel}
        modelFamilies={AVAILABLE_MODEL_FAMILIES}
        onModelSelect={handleModelSwitch}
        showIndependentWindow
        onIndependentWindow={openDetachedWindow}
      />

      {/* Main Content Area with Entrance Animation */}
      <motion.div 
        key={activeApp || 'main'}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="flex-1 min-h-0 relative z-10 overflow-y-auto overflow-x-hidden scrollbar-hide"
        ref={chatContainerRef}
      >
        
        {/* Fixed Pinned Task Card - Only show in main entrance (Positioned sticky to overlay messages) */}
        {activeApp === null && scene !== "fresh-user" && (
          <div className="sticky top-[-0px] w-full flex justify-center px-[max(20px,var(--cui-padding-max))] z-30 pointer-events-none">
            <div className="pointer-events-auto w-full md:mx-[44px]">
              <PinnedTaskCard
                expanded={isTaskCardExpanded}
                onExpandedChange={setIsTaskCardExpanded}
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
                    description: "这是一个重要的任务，需要及时处理。请确保在截止日��前完成所有相关工作。",
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
          </div>
        )}
        
        <div className="flex flex-col gap-[var(--space-800)] w-full px-[max(20px,var(--cui-padding-max))] py-[var(--space-400)] pt-[var(--space-300)]">
          {/* Welcome Message (Mock/Static as per design) */}
          {activeApp !== 'education' ? (
            scene !== "fresh-user" ? (
            <>
              <ChatWelcome 
                avatarSrc={conversation.user.avatar}
                greeting={`下午好，请问有什么可以帮到你？`}
              />
              
              {/* Action Suggestions for Main Entrance */}
              {messages.length === 0 && (
                <div className="flex flex-wrap justify-start gap-[var(--space-200)] ml-0 md:ml-[44px] -mt-[var(--space-600)]">
                  <ChatPromptButton onClick={() => {
                    setInputValue("查看我的个人信息");
                    setTimeout(() => handleSendMessage(), 100);
                  }}>
                    查看个人信息
                  </ChatPromptButton>
                  <ChatPromptButton onClick={() => {
                    setInputValue("帮我创建一封新邮件");
                    setTimeout(() => handleSendMessage(), 100);
                  }}>
                    创建邮件
                  </ChatPromptButton>
                  <ChatPromptButton onClick={() => {
                    setInputValue("今天的待办事项");
                    setTimeout(() => handleSendMessage(), 100);
                  }}>
                    查看待办事项
                  </ChatPromptButton>
                </div>
              )}
            </>
            ) : null
          ) : (
            <>
              {scene !== "fresh-user" && (
              <>
              <ChatWelcome 
                avatarSrc={conversation.user.avatar}
                greeting={`你好，我是你的教育专属AI助手。请问今天需要处理什么？`}
              />
              
              {/* Action Suggestions for Education App：家庭视角与机构视角分流 */}
              {educationMessages.length === 0 && (
                <div className="flex flex-wrap justify-start gap-[var(--space-200)] ml-0 md:ml-[44px] -mt-[var(--space-600)]">
                  {educationMenuApps === EDUCATION_APPS_NO_ORG ? (
                    <>
                      <ChatPromptButton
                        onClick={() => {
                          setInputValue("今日课程");
                          setTimeout(() => handleSendMessage(), 100);
                        }}
                      >
                        今日课程
                      </ChatPromptButton>
                      <ChatPromptButton
                        onClick={() => {
                          setInputValue("查看订单");
                          setTimeout(() => handleSendMessage(), 100);
                        }}
                      >
                        查看订单
                      </ChatPromptButton>
                      <ChatPromptButton
                        onClick={() => {
                          setInputValue("查看奖励");
                          setTimeout(() => handleSendMessage(), 100);
                        }}
                      >
                        查看奖励
                      </ChatPromptButton>
                    </>
                  ) : (
                    <>
                      <ChatPromptButton
                        onClick={() => {
                          setInputValue("查看课程管理");
                          setTimeout(() => handleSendMessage(), 100);
                        }}
                      >
                        课程管理
                      </ChatPromptButton>
                      <ChatPromptButton
                        onClick={() => {
                          setInputValue("学生管理");
                          setTimeout(() => handleSendMessage(), 100);
                        }}
                      >
                        学生管理
                      </ChatPromptButton>
                      <ChatPromptButton
                        onClick={() => {
                          setInputValue("查看财务报表");
                          setTimeout(() => handleSendMessage(), 100);
                        }}
                      >
                        财务报表
                      </ChatPromptButton>
                      <ChatPromptButton onClick={handleOrgClick}>切换组织</ChatPromptButton>
                    </>
                  )}
                </div>
              )}
              </>
              )}
            </>
          )}

          {/* Conversation Messages */}
          {renderMessageList(activeApp === 'education' ? educationMessages : messages, activeApp === 'education')}
          <div ref={scrollRef} />
        </div>
      </motion.div>

      {/* Input Area and Bottom App Bar */}
      <div className="flex-none relative z-20 w-full pt-[var(--space-200)] pb-[var(--space-400)] px-[max(20px,var(--cui-padding-max))] min-px-[var(--space-500)] flex flex-col gap-[var(--space-200)]">
        {/* 全部应用抽屉 */}
        <AllAppsDrawer
          apps={apps}
          isOpen={isAllAppsOpen}
          onClose={() => setIsAllAppsOpen(false)}
          onReorder={handleReorder}
          onAppClick={(appId) => {
            if (appId === 'education') {
              setActiveApp('education');
              setIsAllAppsOpen(false);
            }
          }}
        />

        {/* Bottom App Bar */}
        <div className="flex items-center gap-[var(--space-200)] overflow-x-auto scrollbar-hide relative w-full p-[0px] min-h-[var(--space-800)]">
          <AnimatePresence mode="popLayout">
            {activeApp === 'education' ? (
              <motion.div
                key="education-mode"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex items-center gap-[var(--space-200)] flex-1 justify-start"
              >
                <button
                  onClick={() => setActiveApp(null)}
                  className="bg-bg flex gap-[var(--space-100)] h-[var(--space-800)] items-center px-[var(--space-300)] py-[var(--space-150)] rounded-full shrink-0 hover:bg-[var(--black-alpha-11)] transition-all duration-300 ease-out border border-border group"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-text-secondary group-hover:text-text transition-colors">
                    <path d="M8.75 3.5L5.25 7L8.75 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="text-[length:var(--font-size-xs)] leading-none text-text-secondary group-hover:text-text whitespace-nowrap font-[var(--font-weight-medium)] transition-colors">
                    返回
                  </p>
                </button>
                
                {/* 二级应用内：展示当前应用（如「教育」）图标+名称，点击仍打开全部应用 */}
                <OrganizationSwitcherButton
                  onClick={() => setIsAllAppsOpen(true)}
                  isOpen={isAllAppsOpen}
                  secondaryApp={activeSecondaryAppMeta}
                />
                
                {educationMenuApps.map(app => (
                  <SecondaryAppButton 
                    key={app.id} 
                    app={app} 
                    onMenuClick={(menu, appName) => {
                      const userMsg: Message = {
                        id: `user-${Date.now()}`,
                        senderId: currentUser.id,
                        content: `我想使用${appName}的「${menu}」功能`,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        createdAt: Date.now()
                      };
                      
                      const cardData = JSON.stringify({
                        title: `${appName} - ${menu}`,
                        description: `这是关于「${menu}」的专属指导内容，请根据提示进行操作。`,
                        detail: "1. 明确您的操作目标\n2. 跟着助手一步步完成管理流程\n3. 遇到不懂的问题随时向我提问",
                        imageSrc: app.imageSrc
                      });
                      const botMsg: Message = {
                        id: `bot-card-${Date.now()+1}`,
                        senderId: conversation.user.id,
                        content: `<<<RENDER_GENERIC_CARD>>>:${cardData}`,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        createdAt: Date.now() + 1
                      };
                      
                      setEducationMessages(prev => [...prev, userMsg]);
                      
                      setTimeout(() => {
                        setEducationMessages(prev => [...prev, botMsg]);
                        scrollToBottom()
                      }, 500);
                    }} 
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="default-apps"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex items-center gap-[var(--space-200)]"
              >
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
                      if (app.id === 'education') {
                        setActiveApp('education');
                        setSecondaryHistoryOpen(false);
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

                {/* 全部应用入口 - 固定在最右侧或跟随��最后 */}
                <div className="sticky right-0 flex items-center bg-cui-bg z-10 before:content-[''] before:block before:w-[var(--space-300)] before:h-[var(--space-800)] before:bg-gradient-to-r before:from-transparent before:to-cui-bg">
                  <OrganizationSwitcherButton 
                    onClick={() => setIsAllAppsOpen(true)} 
                    isOpen={isAllAppsOpen}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Field */}
        <ChatSender
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSendMessage={handleSendMessage}
          handleKeyDown={handleKeyDown}
        />
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Task Detail Drawer */}
      <TaskDetailDrawer
        isOpen={isTaskDrawerOpen}
        onClose={() => setIsTaskDrawerOpen(false)}
        task={selectedTask}
      />
      </div>
    </div>
  )
}