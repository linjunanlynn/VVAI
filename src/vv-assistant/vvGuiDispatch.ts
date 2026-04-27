import type { Message } from "../components/chat/data"
import { currentUser } from "../components/chat/data"
import { inferUserCommand } from "./cliHints"

function ts() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

/**
 * 对齐 ai生成/助手 App.jsx：`dispatchIntent` — GUI 触发时先插入用户气泡文案 + 推测 CLI，再执行回调。
 * 有 CLI 时延迟展示（与 runVvGeneralSend 一致）。
 */
export function runVvGuiDispatch(
  intent: string,
  appendMessage: (msg: Message) => void,
  updateMessageById: (id: string, updater: (m: Message) => Message) => void,
  run: () => void
) {
  const commandHint = inferUserCommand(intent)
  const shouldDelay = Boolean(commandHint)
  const userId = `vv-gui-${Date.now()}`
  appendMessage({
    id: userId,
    senderId: currentUser.id,
    content: intent,
    timestamp: ts(),
    createdAt: Date.now(),
    vvMeta: {
      commandHint: commandHint ?? undefined,
      showCommandHint: !shouldDelay && Boolean(commandHint),
      isRecognizing: shouldDelay,
    },
  })

  if (!shouldDelay) {
    run()
    return
  }

  window.setTimeout(() => {
    updateMessageById(userId, (m) =>
      m.vvMeta
        ? {
            ...m,
            vvMeta: {
              ...m.vvMeta,
              isRecognizing: false,
              showCommandHint: Boolean(commandHint),
            },
          }
        : m
    )
    window.setTimeout(run, 180)
  }, 1000)
}

/** App.jsx 同款弯引号「」式双引号，用于拼出与 inferUserCommand / 正则一致的 intent 文案 */
export function vvIntentQuote(title: string) {
  return `\u201c${title}\u201d`
}
