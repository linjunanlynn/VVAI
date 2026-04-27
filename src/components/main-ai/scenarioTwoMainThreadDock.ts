import type { Conversation, Message } from "../chat/data"
import {
  buildCrossDockHandoffCardPayload,
  buildDockGenericCardInlineActions,
  buildDockIntentResultDetail,
  resolveDockAgentIntent,
} from "./dockAgentIntentResolve"
import { getDockAppMeta } from "./organizationDockConfig"
import { toDockMirrorPeerMessageId } from "./dockMirrorPeerIds"

const DOCK_CROSS_MARKER = "<<<DOCK_CROSS_HANDOFF_CARD>>>"

export type ScenarioTwoMainDockBundle = {
  mirrorDockAppId: string
  mirrorPairs: { userText: string; assistantText: string }[]
  mirrorExtras: Message[]
  /** 追加到主 VVAI 消息流（已含时间戳字段） */
  mainMessages: Message[]
}

/**
 * 场景二：在主 VVAI 会话中模拟「某 dock 应用」内对同一条用户输入的解析结果，
 * 用于主区展示与向对应应用会话镜像（不切换当前选中会话）。
 */
export function buildScenarioTwoMainThreadDockBundle(
  raw: string,
  hostAppId: string,
  conversation: Conversation,
  /** 主 VVAI 当前主体：写入卡片归属，便于多组织时展示 */
  cardAttributionOrgId: string
): ScenarioTwoMainDockBundle {
  const trimmed = raw.trim()
  const ts = () =>
    new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false })
  const now = Date.now()

  const resolved = resolveDockAgentIntent(trimmed, hostAppId)

  if (resolved?.kind === "handoff") {
    const fromMeta = getDockAppMeta(hostAppId)
    const toMeta = getDockAppMeta(resolved.targetAppId)
    const crossPayload = buildCrossDockHandoffCardPayload({
      raw: trimmed,
      targetAppId: resolved.targetAppId,
      targetAppName: toMeta.name,
      fromAppName: fromMeta.name,
      matchedPhrase: resolved.matchedPhrase,
    })
    crossPayload.handoffLine = `主 VVAI 已生成承接说明；内容将同步至「${toMeta.name}」应用会话，你无需离开当前主对话。`
    const payload = JSON.stringify(crossPayload)
    const cardMsg: Message = {
      id: `s2-main-cross-${now}`,
      senderId: conversation.user.id,
      content: `${DOCK_CROSS_MARKER}:${payload}`,
      timestamp: ts(),
      createdAt: now,
      cardAttributionOrgId,
      cardAttributionDockAppId: resolved.targetAppId,
    }
    const mirrorCard: Message = { ...cardMsg, id: toDockMirrorPeerMessageId(cardMsg.id) }
    return {
      mirrorDockAppId: resolved.targetAppId,
      mirrorPairs: [
        {
          userText: trimmed,
          assistantText: `已识别为「${fromMeta.name}」内发起、需在「${toMeta.name}」继续的处理：${resolved.matchedPhrase}（演示）`,
        },
      ],
      mirrorExtras: [mirrorCard],
      mainMessages: [cardMsg],
    }
  }

  if (resolved?.kind === "execute_local") {
    const meta = getDockAppMeta(resolved.appId)
    const cmdMsg: Message = {
      id: `s2-main-cmd-${now}`,
      senderId: conversation.user.id,
      content: `【业务指令】在「${meta.name}」内处理：${resolved.matchedPhrase}`,
      timestamp: ts(),
      createdAt: now,
    }
    const detail = buildDockIntentResultDetail(resolved.appId, resolved.matchedPhrase)
    const cardActions = buildDockGenericCardInlineActions(resolved.appId, resolved.matchedPhrase)
    const cardData = JSON.stringify({
      title: `${meta.name} · 执行结果（演示）`,
      description: `已根据你的描述在「${meta.name}」上下文中解析业务意图，并生成下列演示反馈。`,
      detail,
      imageSrc: meta.imageSrc,
      cardActions,
    })
    const cardMsg: Message = {
      id: `s2-main-card-${now + 1}`,
      senderId: conversation.user.id,
      content: `<<<RENDER_GENERIC_CARD>>>:${cardData}`,
      timestamp: ts(),
      createdAt: now + 1,
      cardAttributionOrgId,
      cardAttributionDockAppId: resolved.appId,
    }
    const mirrorCard: Message = { ...cardMsg, id: toDockMirrorPeerMessageId(cardMsg.id) }
    return {
      mirrorDockAppId: resolved.appId,
      mirrorPairs: [
        {
          userText: trimmed,
          assistantText: `已在「${meta.name}」生成演示执行卡片，内容与主 VVAI 一致。（演示）`,
        },
      ],
      mirrorExtras: [mirrorCard],
      mainMessages: [cmdMsg, cardMsg],
    }
  }

  const meta = getDockAppMeta(hostAppId)
  const assistantText = `已在主 VVAI 为你整理「${meta.name}」相关说明。（演示）你可以继续补充细节；下方已生成工作台卡片，并已同步至「${meta.name}」应用会话。`
  const botMsg: Message = {
    id: `s2-main-fallback-${now}`,
    senderId: "ai-assistant",
    content: assistantText,
    timestamp: ts(),
    createdAt: now,
  }
  const cardData = JSON.stringify({
    title: `${meta.name} · 工作台（演示）`,
    description: `未命中精确快捷指令规则时，仍在「${meta.name}」上下文中为你打开演示工作台。`,
    detail: `你的描述：${trimmed}\n\n可继续用自然语言补充对象、时间范围或操作目标；亦可在底部应用条打开「${meta.name}」查看同步记录。`,
    imageSrc: meta.imageSrc,
    cardActions: {
      primary: {
        label: "继续补充需求",
        sendText: `我想在「${meta.name}」里继续处理：`,
      },
    },
  })
  const cardMsg: Message = {
    id: `s2-main-fallback-card-${now + 1}`,
    senderId: conversation.user.id,
    content: `<<<RENDER_GENERIC_CARD>>>:${cardData}`,
    timestamp: ts(),
    createdAt: now + 1,
    cardAttributionOrgId,
    cardAttributionDockAppId: hostAppId,
  }
  const mirrorCard: Message = { ...cardMsg, id: toDockMirrorPeerMessageId(cardMsg.id) }
  return {
    mirrorDockAppId: hostAppId,
    mirrorPairs: [{ userText: trimmed, assistantText }],
    mirrorExtras: [mirrorCard],
    mainMessages: [botMsg, cardMsg],
  }
}
