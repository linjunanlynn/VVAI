import type { VvMailComposeFormDraft } from "./types"

export function defaultMailComposeDraft(): VvMailComposeFormDraft {
  return {
    to: "",
    cc: "",
    subject: "",
    body: "",
  }
}

/** 从用户整句里解析出表单初值（示例指令「」格式或 GUI 确认用的弯引号格式） */
export function parseMailComposeDraftFromUserText(value: string): VvMailComposeFormDraft | null {
  const v = value.trim()
  const corner = v.match(/请新建邮件：收件人「(.+?)」，抄送「(.+?)」，主题「(.+?)」，内容「([\s\S]+?)」。/)
  if (corner) {
    return { to: corner[1], cc: corner[2], subject: corner[3], body: corner[4] }
  }
  const curly = v.match(/请新建一封邮件：收件人“(.+?)”，抄送“(.+?)”，主题“(.+?)”，内容“([\s\S]+?)”。/)
  if (curly) {
    return { to: curly[1], cc: curly[2], subject: curly[3], body: curly[4] }
  }
  return null
}
