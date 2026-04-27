import orgIcon from "figma:asset/58a97c06b4ae6edfc613d20add2fb4ead0363c64.png"
import type { Organization } from "./OrganizationSwitcherCard"

/**
 * 多所教育主体 mock：供「场景二（多组织）」与场景五等复用（原独立 `edu-multi` 入口已移除）。
 * 场景二（加入多个组织）须与之一致时，请复用本数组，避免与场景四分叉维护。
 */
export const SCENARIO_FOUR_EDU_MULTI_HOME_ORGANIZATIONS: Organization[] = [
  {
    id: "school-a",
    name: "示范学校",
    icon: orgIcon,
    memberCount: 2100,
    description: "学校组织",
    kind: "school",
  },
  {
    id: "edu-b",
    name: "示范教育机构",
    icon: orgIcon,
    memberCount: 156,
    description: "教育机构",
    kind: "education",
  },
]
