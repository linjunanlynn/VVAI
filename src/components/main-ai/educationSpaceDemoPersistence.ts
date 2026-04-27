/**
 * 演示态：用户已创建的「家庭教育空间 / 机构教育空间」及当前选中空间（sessionStorage，按 scenario 分桶）
 */

export type DemoEducationSpaceKind = "family" | "institutional"

export interface DemoEducationSpaceRecord {
  id: string
  name: string
  kind: DemoEducationSpaceKind
  /** 机构教育空间从属的组织 id；家庭教育空间可为空 */
  hostOrganizationId?: string
  hostOrganizationName?: string
  createdAt: number
}

export interface DemoEducationSpacePersistedState {
  spaces: DemoEducationSpaceRecord[]
  currentSpaceId: string | null
  /** 用户当前选中的行政组织（与机构空间、顶栏主体对齐） */
  currentOrganizationId: string | null
}

function storageKeyForScenario(scenario: string | undefined): string {
  return `cui-demo-edu-state-${scenario ?? "default"}`
}

export function loadDemoEducationSpaceState(
  scenario: string | undefined
): DemoEducationSpacePersistedState {
  if (typeof window === "undefined") {
    return { spaces: [], currentSpaceId: null, currentOrganizationId: null }
  }
  try {
    const raw = window.sessionStorage.getItem(storageKeyForScenario(scenario))
    if (!raw) return { spaces: [], currentSpaceId: null, currentOrganizationId: null }
    const parsed = JSON.parse(raw) as Partial<DemoEducationSpacePersistedState>
    const spaces = Array.isArray(parsed.spaces) ? parsed.spaces : []
    return {
      spaces,
      currentSpaceId: typeof parsed.currentSpaceId === "string" ? parsed.currentSpaceId : null,
      currentOrganizationId:
        typeof parsed.currentOrganizationId === "string" ? parsed.currentOrganizationId : null,
    }
  } catch {
    return { spaces: [], currentSpaceId: null, currentOrganizationId: null }
  }
}

export function saveDemoEducationSpaceState(
  scenario: string | undefined,
  state: DemoEducationSpacePersistedState
): void {
  if (typeof window === "undefined") return
  try {
    window.sessionStorage.setItem(storageKeyForScenario(scenario), JSON.stringify(state))
  } catch {
    // ignore quota / private mode
  }
}

/** MainAI 注册教育门户会话时读取，用于首条欢迎语与追问 */
/** 教育应用（`no-org` 等）首条助手消息：欢迎使用微微教育 + 空间类型选择卡 */
export const EDU_WELCOME_WEIWEI_MARKER = "<<<RENDER_EDU_WELCOME_WEIWEI>>>"

export function readEducationSpaceWelcomeHints(scenario: string | undefined): {
  hasAnySpace: boolean
  currentSpaceName: string | null
  currentSpaceKind: DemoEducationSpaceKind | null
} {
  const { spaces, currentSpaceId } = loadDemoEducationSpaceState(scenario)
  if (spaces.length === 0) {
    return { hasAnySpace: false, currentSpaceName: null, currentSpaceKind: null }
  }
  const cur = currentSpaceId ? spaces.find((s) => s.id === currentSpaceId) : spaces[spaces.length - 1]
  if (!cur) {
    return { hasAnySpace: true, currentSpaceName: null, currentSpaceKind: null }
  }
  return {
    hasAnySpace: true,
    currentSpaceName: cur.name,
    currentSpaceKind: cur.kind,
  }
}
