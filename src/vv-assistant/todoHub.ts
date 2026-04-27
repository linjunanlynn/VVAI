import type { VvTodoHubTab, VvTodoItem } from "./types"
import { canCurrentUserProcessTodo, isTodoInitiatedByCurrentUser } from "./seeds"

/** 顺序与设计稿「我的待办」Tab 一致 */
export const TODO_HUB_TABS: { id: VvTodoHubTab; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "pending", label: "待处理" },
  { id: "done", label: "已处理" },
  { id: "initiated", label: "我发起" },
  { id: "cc", label: "抄送我" },
  { id: "draft", label: "草稿" },
]

/** 「全部待办」大卡片顶栏文案（与紧凑「我的待办」区分） */
export const TODO_FULL_HUB_TABS: { id: VvTodoHubTab; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "pending", label: "待处理" },
  { id: "done", label: "已处理" },
  { id: "initiated", label: "已发起" },
  { id: "cc", label: "已抄送" },
  { id: "draft", label: "草稿" },
]

export function todosForHubTab(all: VvTodoItem[], tab: VvTodoHubTab): VvTodoItem[] {
  if (tab === "all") return all
  if (tab === "pending") return all.filter((item) => canCurrentUserProcessTodo(item))
  if (tab === "initiated") return all.filter((item) => isTodoInitiatedByCurrentUser(item))
  if (tab === "done") return all.filter((item) => item.status === "done")
  if (tab === "cc") return all.filter((item) => item.status === "cc")
  if (tab === "draft") return all.filter((item) => item.status === "draft")
  return all
}
