/**
 * 从自然语言中解析「要订阅的同事姓名」，用于先展示确认卡片。
 * 纯「订阅日历」无姓名时不应命中（由 vvPlan 走搜索卡片）。
 */
export function tryParseSubscribeColleagueName(text: string): string | null {
  const v = text.trim()
  if (!v) return null

  const m1 = v.match(/订阅\s*(.+?)\s*的日历/)
  if (m1) {
    const n = m1[1].trim().replace(/^(同事|同学)\s+/, "").replace(/^[「『](.+)[」』]$/, "$1").trim()
    if (n && n.length >= 2 && n.length <= 24 && n !== "日历") return n
  }

  const m2 = v.match(/(?:我要|想|希望)(?:要)?订阅(?:同事)?\s*[「『](.+?)[」』]/)
  if (m2) {
    const n = m2[1].trim()
    if (n.length >= 2 && n.length <= 24) return n
  }

  const m3 = v.match(/(?:我要|想|希望)(?:要)?订阅(?:同事)?\s+([^\s，,。！!]{2,24})(?:的日历)?[。！!\s]*$/)
  if (m3) {
    const n = m3[1].trim()
    if (n !== "日历") return n
  }

  return null
}

/** 解析「取消/解除订阅某某的日历」；须先于 tryParseSubscribeColleagueName 判断，避免误命中「订阅…的日历」 */
export function tryParseUnsubscribeColleagueName(text: string): string | null {
  const v = text.trim()
  if (!v) return null

  const m1 = v.match(/(?:取消|解除|撤销)\s*订阅\s*(.+?)\s*的日历/)
  if (m1) {
    const n = m1[1].trim().replace(/^[「『](.+)[」』]$/, "$1").trim()
    if (n && n.length >= 2 && n.length <= 24 && n !== "日历") return n
  }

  const m2 = v.match(/(?:取消|解除)\s*对\s*(.+?)\s*的日历订阅/)
  if (m2) {
    const n = m2[1].trim().replace(/^[「『](.+)[」』]$/, "$1").trim()
    if (n.length >= 2 && n.length <= 24) return n
  }

  return null
}
