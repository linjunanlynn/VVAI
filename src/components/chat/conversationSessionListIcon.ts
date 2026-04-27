import type { Conversation } from "./data"
/** 主会话 / 《主AI入口》与顶栏一致 */
import aiMainIcon from "figma:asset/5b6944cca1f1ab3d84ca7f9d682db0a94d709b01.png"
import courseIcon from "figma:asset/ac6e3391c1eb88804cbf0804668d449463a1e1a3.png"
import goodsIcon from "figma:asset/d6c155d2820ba2910285fbcb066152b9efb7141c.png"
import membersIcon from "figma:asset/ecb04190c46a6ecd790d2bc345d963ba9a4a8f0b.png"
import financeIcon from "figma:asset/98e154a19d1590d43b04308d53726a30a29e972b.png"
import educationIcon from "figma:asset/8449365f45bb140bf269f6769f74387249864ed8.png"
import calendarIcon from "figma:asset/e653b0a7cada3ea08e52cb29bc4bd546be59d3d5.png"
import meetingIcon from "figma:asset/88d3d6e7f0cac8b8bba0a46f8757585fe7cdaf9a.png"
import todoIcon from "figma:asset/3598e566543c9c6ef7ab3cb268538a29b6bdb58d.png"
import diskIcon from "figma:asset/78530a18370215c595d4c989d64c188f7450dbda.png"
import companyIcon from "figma:asset/bc4adf9e89b5ade28461d7ae6da09053ea8bf0e1.png"
import profileIcon from "figma:asset/a9b0f43698a9015397dc60f26d1ea217390fec97.png"
import organizationIcon from "figma:asset/737725172f66f16b2662ff1ddc8ab69293de567f.png"
import recruitmentIcon from "figma:asset/81759343e3c0735a95d3ee5a5e7cf7a767e83846.png"
import salaryIcon from "figma:asset/776e838a4088fe446d0c5d29220b88ab1ad922bc.png"
import inventoryIcon from "figma:asset/1850125514f29104c8f00034a7873528b971a815.png"

const DOCK_SESSION_ICON: Record<string, string> = {
  course: courseIcon,
  goods: goodsIcon,
  members: membersIcon,
  finance: financeIcon,
  education: educationIcon,
  personal_edu_space: educationIcon,
  calendar: calendarIcon,
  meeting: meetingIcon,
  todo: todoIcon,
  document: organizationIcon,
  disk: diskIcon,
  mail: profileIcon,
  salary: salaryIcon,
  recruitment: recruitmentIcon,
  teaching: educationIcon,
  logistics: companyIcon,
  assets: inventoryIcon,
  attendance: todoIcon,
  surgery: meetingIcon,
  pharma_procurement: goodsIcon,
}

function isDockConversation(c: Conversation): boolean {
  return Boolean(c.dockAppId) || c.id.startsWith("dock:") || c.id.startsWith("dock-app-")
}

function dockAppIdFromConversation(c: Conversation): string | null {
  if (c.dockAppId) return c.dockAppId
  const m = c.id.match(/^dock:[^:]+:(.+)$/)
  return m?.[1] ?? null
}

/** 会话列表行左侧图标：主会话用 VVAI 头像；dock 用对应应用 icon（与底部应用条一致） */
export function getConversationSessionListIconSrc(c: Conversation): string {
  if (!isDockConversation(c)) {
    return c.user?.avatar || aiMainIcon
  }
  const appId = dockAppIdFromConversation(c)
  if (!appId) return profileIcon
  return DOCK_SESSION_ICON[appId] ?? profileIcon
}
