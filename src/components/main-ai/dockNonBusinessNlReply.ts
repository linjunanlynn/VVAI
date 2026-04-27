/**
 * dock 应用会话内：判定为「非业务自然语言」时的通用对话回复（演示文案，非真实大模型 API）。
 */
export function buildDockNonBusinessNlAssistantBody(userText: string, appDisplayName: string): string {
  const t = userText.trim()
  const excerpt = t.length > 160 ? `${t.slice(0, 160)}…` : t
  return [
    `【通用对话 · 演示】本条与「${appDisplayName}」内固定业务指令不匹配，我按基础对话方式简要说明（演示环境，未调用真实通用模型）。`,
    "",
    `你提到：「${excerpt || "（空）"}」`,
    "",
    `若需要具体业务能力，请使用当前应用底部快捷指令；也可回到主 VVAI 会话用自然语言描述工作目标。`,
    "",
    "你的原话与我的本条回复，已按时间线同步到主 VVAI 会话中展示。",
  ].join("\n")
}
