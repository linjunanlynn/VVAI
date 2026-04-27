import { buildDockIntentFollowUpPrompts } from "../main-ai/dockAgentIntentResolve"

export type CuiFollowUpBuildContext = {
  /** Dock 本应用执行意图的 appId，与 `dockAgentIntentResolve` 一致 */
  dockIntentAppId?: string
  matchedPhrase?: string
}

/**
 * 应用 Agent 回复后生成追问类提示（Dock 会话点击即发送）。
 * 有 `dockIntentAppId` 时按业务域给出用户自然语言；否则按摘要给通用协作向追问。
 */
export function buildCuiFollowUpPrompts(
  replyHint: string,
  appName: string,
  ctx?: CuiFollowUpBuildContext
): string[] {
  if (ctx?.dockIntentAppId) {
    return buildDockIntentFollowUpPrompts(ctx.dockIntentAppId, ctx.matchedPhrase ?? "")
  }

  const hint = replyHint.replace(/\s+/g, " ").trim()
  const core = hint.length ? (hint.length > 42 ? `${hint.slice(0, 42)}…` : hint) : "当前回复"
  return [
    `关于「${core}」，你希望我下一步具体做什么？`,
    `结合「${appName}」场景，把上面有把握的结论整理成一小段，方便我转发确认。`,
    `还有哪些信息不确定？列出来我来补充。`,
  ]
}
