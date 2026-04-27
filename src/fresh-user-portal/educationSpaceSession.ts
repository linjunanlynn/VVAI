import type { EducationSpaceKind, FamilyCreatorRole } from "./educationSpaceTypes"

export interface StoredEducationSpace {
  id: string
  name: string
  kind: EducationSpaceKind
  /** 家庭教育空间：创建者身份（家长 / 学生） */
  creatorRole?: FamilyCreatorRole
  /** 机构教育空间所属企业/组织（全新用户演示：与顶栏组织分组一致） */
  linkedOrgId?: string
}

/** 无教育空间场景下，教育应用会话统一存此 key，避免切换空间后对话被清空 */
export const EDU_NO_EDU_THREAD_KEY = "__edu_no_edu__"

const SPACES_KEY = "cui-no-edu-v1-spaces"
const WELCOME_KEY = "cui-no-edu-v1-welcome-shown"

let reloadPurgeChecked = false

/**
 * 「新用户无组织（无教育空间）」场景：浏览器刷新（F5 / 刷新按钮）时清空本地已创建空间与欢迎标记，
 * 使刷新后与首次进入一致。需在读取 loadEducationSpaces 之前同步调用一次。
 */
export function purgeNoEduStoredDataIfReload(): void {
  if (typeof window === "undefined" || reloadPurgeChecked) return
  reloadPurgeChecked = true
  try {
    const entry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined
    if (entry?.type === "reload") {
      localStorage.removeItem(SPACES_KEY)
      localStorage.removeItem(WELCOME_KEY)
    }
  } catch {
    /* ignore */
  }
}

export function loadEducationSpaces(): StoredEducationSpace[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(SPACES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as StoredEducationSpace[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveEducationSpaces(spaces: StoredEducationSpace[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(SPACES_KEY, JSON.stringify(spaces))
  } catch {
    /* ignore */
  }
}

export function getEducationWelcomeShown(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(WELCOME_KEY) === "1"
}

export function setEducationWelcomeShown(): void {
  if (typeof window === "undefined") return
  localStorage.setItem(WELCOME_KEY, "1")
}
