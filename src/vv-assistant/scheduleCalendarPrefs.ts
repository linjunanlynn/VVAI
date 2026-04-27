import type { VvScheduleCalendarPrefs } from "./types"

export const SCHEDULE_REMINDER_OPTION_LABELS = [
  "开始时提醒",
  "5分钟前提醒",
  "15分钟前提醒",
  "1小时前提醒",
  "1天前提醒",
] as const

export function defaultScheduleCalendarPrefs(): VvScheduleCalendarPrefs {
  return {
    weekStart: "sun",
    defaultReminderLabels: ["开始时提醒", "5分钟前提醒"],
    requireSubscribeAuth: true,
    subscribers: [{ id: "sub-demo-1", name: "贾曙光" }],
  }
}

export function formatCalendarPrefsSummary(p: VvScheduleCalendarPrefs): string {
  const w = p.weekStart === "mon" ? "周一" : p.weekStart === "sun" ? "周日" : "周六"
  const rem = p.defaultReminderLabels.length ? p.defaultReminderLabels.join("、") : "无"
  const auth = p.requireSubscribeAuth ? "需要我授权" : "不需要授权（演示）"
  const subs = p.subscribers.length ? p.subscribers.map((s) => s.name).join("、") : "暂无"
  return `每周第一天：${w}\n默认提醒：${rem}\n他人订阅：${auth}\n订阅人：${subs}`
}

/**
 * 解析自然语言中的日历偏好变更意图，返回与当前 prefs 合并后的**建议值**（不写入全局）。
 * 「日历设置」等仅打开卡片的口令返回 null，交给 vvPlan。
 */
export function parseScheduleCalendarPrefsIntentFromText(
  text: string,
  prefs: VvScheduleCalendarPrefs
): VvScheduleCalendarPrefs | null {
  const v = text.trim()
  if (!v) return null
  if (/日历设置|日历基础设置|日程日历设置|打开.*日历.*设置/.test(v)) return null

  const weekIntent =
    /每周第一天|每星期第一天|周起始|一周从|星期.*开始|从周/.test(v) ||
    (/^(改|设置|设为|把)/.test(v) && /周一|周日|周六|星期一|星期天|星期六/.test(v))

  if (weekIntent) {
    if (/周一|星期一/.test(v)) {
      return { ...prefs, weekStart: "mon" }
    }
    if (/周日|星期天|星期日/.test(v)) {
      return { ...prefs, weekStart: "sun" }
    }
    if (/周六|星期六/.test(v)) {
      return { ...prefs, weekStart: "sat" }
    }
  }

  if (/他人订阅|订阅我的日历|授权/.test(v) && /需要|要|开启|打开|启用|必须/.test(v)) {
    return { ...prefs, requireSubscribeAuth: true }
  }
  if (/他人订阅|订阅我的日历|授权/.test(v) && /不需要|关闭|取消|不用|禁用/.test(v)) {
    return { ...prefs, requireSubscribeAuth: false }
  }

  if (/添加订阅人|新增订阅/.test(v)) {
    const m = v.match(/[:：]\s*([^\s，,]{1,20})/u) || v.match(/(?:添加订阅人|新增订阅)\s+([^\s，,]{1,20})/u)
    const name = m?.[1]?.trim()
    if (name && name.length > 0) {
      const id = `sub-${Date.now()}`
      return { ...prefs, subscribers: [...prefs.subscribers, { id, name }] }
    }
  }

  return null
}
