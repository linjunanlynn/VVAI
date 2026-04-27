// @ts-nocheck
/* eslint-disable */
/**
 * 自《日历（样板）》MainAIChatWindow.handleVvAction 抽取；供底部「日历」dock 内 vv 卡片与侧栏交互。
 */
import * as React from "react"
import type { Message } from "../chat/data"
import { currentUser } from "../chat/data"
/** 与样板 PinnedTaskCard.PinnedChipVvTarget 对齐（框架置顶卡未导出时本地声明） */
type PinnedChipVvTarget =
  | { kind: "meeting"; id: string }
  | { kind: "schedule"; id: string }
  | { kind: "todo"; id: string }
  | { kind: "mail"; id: string }
  | { kind: "drive"; id: string }
  | { kind: "doc"; id: string }
  | { kind: "todoHub" }
import type {
  VvAssistantPayload,
  VvChoiceFollowUp,
  VvContext,
  VvDocItem,
  VvDriveItem,
  VvFlow,
  VvFreeSlot,
  VvMailItem,
  VvMeetingItem,
  VvRecordItem,
  VvScheduleAttendeeRsvp,
  VvScheduleCalendarPrefs,
  VvScheduleCreateDraft,
  VvScheduleItem,
  VvSuccessAction,
  VvTodoItem,
  VvUserCalendarType,
} from "../../vv-assistant/types"
import { runVvGeneralSend, vvAssistantMessageFromPayload } from "../../vv-assistant/vvSend"
import type { RunVvGeneralSendOptions, VvSendScheduleBridge } from "../../vv-assistant/vvSend"
import { runVvGuiDispatch, vvIntentQuote } from "../../vv-assistant/vvGuiDispatch"
import type { ScheduleSideThreadBridge } from "./ScheduleSideConversationPanel"
import type { VvScheduleSideSheetOpenOpts } from "../../vv-assistant/vvScheduleSideSheetContext"
import { buildTodoFromApprovalDraft, defaultApprovalStartDraft } from "../../vv-assistant/approvalFlow"
import { payloadAfterChoicePick } from "../../vv-assistant/vvPlan"
import {
  buildBookedMeetingAndSchedule,
  buildInstantMeeting,
  resolveMeetingScheduledBase,
} from "../../vv-assistant/meetingFlow"
import { dispatchNativeMeetingJoin } from "../../vv-assistant/nativeMeetingJoin"
import {
  buildNewScheduleItemFromCreateDraft,
  buildUpdatedScheduleFromEdit,
  markLinkedMeetingCancelled,
  scheduleCancelIntentNaturalLine,
  scheduleCreateIntentNaturalLine,
  scheduleEditIntentNaturalLine,
  scheduleEditDraftFromItem,
  updateLinkedMeetingFromSchedule,
} from "../../vv-assistant/scheduleFlow"
import {
  isScheduleItemPast,
} from "../../vv-assistant/VvAssistantBlocks"
import {
  CAL_DEFAULT_ID,
  findColleagueDirectoryEntryByName,
  freeSlotsSeed,
  SCHEDULE_CURRENT_USER_NAME,
  sortByStart,
} from "../../vv-assistant/seeds"
import {
  intentLineApprovalCreate,
  intentLineMailCreate,
  intentLineMeetingBook,
  intentLineMeetingInstant,
} from "../../vv-assistant/vvIntentStrings"

function isVvModalSilent(data: unknown): boolean {
  return (
    typeof data === "object" &&
    data !== null &&
    "_vvModalSilent" in data &&
    (data as { _vvModalSilent?: unknown })._vvModalSilent === true
  )
}

export type CalendarDockVvActionDeps = {
  aiSenderId: string
  vvContext: VvContext
  vvFlow: VvFlow
  vvScheduleItems: VvScheduleItem[]
  vvMeetingItems: VvMeetingItem[]
  vvRecordItems: VvRecordItem[]
  vvTodoItems: VvTodoItem[]
  vvMailItems: VvMailItem[]
  vvDriveItems: VvDriveItem[]
  vvDocItems: VvDocItem[]
  setVvFlow: React.Dispatch<React.SetStateAction<VvFlow>>
  setVvScheduleItems: React.Dispatch<React.SetStateAction<VvScheduleItem[]>>
  setVvMeetingItems: React.Dispatch<React.SetStateAction<VvMeetingItem[]>>
  setVvTodoItems: React.Dispatch<React.SetStateAction<VvTodoItem[]>>
  vvScheduleBridge: VvSendScheduleBridge
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  appendToActiveConversation: (m: Message) => void
  openScheduleSideSheet: (item: VvScheduleItem, opts: VvScheduleSideSheetOpenOpts) => void
  scheduleSideThreadBridgeRef: React.MutableRefObject<ScheduleSideThreadBridge | null>
  /** 日历 dock：发送用户可见原文并走 vv 编排（与样板 secondary 一致） */
  handleSendMessage: (messageOverride?: string) => void
  /** 与 MainAIChatWindow 传入的 prefs 桥一致；供推荐指令走 `runVvGeneralSend` 时与样板对齐 */
  scheduleCalendarPrefsBridge?: RunVvGeneralSendOptions["scheduleCalendarPrefsBridge"]
  /** 主 VVAI 等：将一轮（自然语言或 `guiThen` intent）在日历域的 vv 同步到「日历」dock 会话 */
  mirrorCalendarVvRound?: (userText: string) => void
  /** `guiThen` 执行 `run()` 期间 >0，用于避免与 `appendToActiveConversation` 单条镜像重复 */
  vvGuiThenDepthRef: React.MutableRefObject<number>
  scheduleCalendarPrefsBridgeRef: React.MutableRefObject<{
    getPrefs: () => VvScheduleCalendarPrefs
    setPrefs: React.Dispatch<React.SetStateAction<VvScheduleCalendarPrefs>>
  } | null>
  calendarTypesBridgeRef: React.MutableRefObject<{
    appendCalendar: (entry: VvUserCalendarType) => void
    updateCalendar: (
      id: string,
      patch: Partial<Pick<VvUserCalendarType, "name" | "color" | "description" | "visibility">>
    ) => void
  } | null>
  subscribedColleagueBridgeRef: React.MutableRefObject<{
    add: (id: string) => void
    remove: (id: string) => void
    isSubscribed: (id: string) => boolean
  } | null>
}

export type VvActionHandler = (action: string, data?: unknown) => void

export function createCalendarDockVvActionHandler(deps: CalendarDockVvActionDeps): VvActionHandler {
  return (action: string, data?: unknown) => {
      const t = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const now = Date.now();
      const aiId = deps.aiSenderId;
      const qq = vvIntentQuote;

      const patchVvUserMessage = (id: string, updater: (m: Message) => Message) => {
        if (false) {
          deps.setMessages( (prev) => prev.map((m) => (m.id === id ? updater(m) : m)));
        } else {
          deps.setMessages((prev) => prev.map((m) => (m.id === id ? updater(m) : m)));
        }
      };

      const patchAnyMessageById = (id: string, updater: (m: Message) => Message) => {
        deps.scheduleSideThreadBridgeRef.current?.mapMessages((m) => (m.id === id ? updater(m) : m));
        if (false) {
          deps.setMessages( (prev) => prev.map((m) => (m.id === id ? updater(m) : m)));
        } else {
          deps.setMessages((prev) => prev.map((m) => (m.id === id ? updater(m) : m)));
        }
      };

      const vvSubscribeCardSourceId = (d: unknown): string | null =>
        typeof d === "object" &&
        d !== null &&
        "_vvSourceMessageId" in d &&
        typeof (d as { _vvSourceMessageId?: unknown })._vvSourceMessageId === "string"
          ? (d as { _vvSourceMessageId: string })._vvSourceMessageId
          : null

      const colleagueSubscribePayloadPreserve = (m: Message): Extract<VvAssistantPayload, { kind: "schedule-subscribe-colleague" }> => {
        const p = m.vvAssistant
        return p?.kind === "schedule-subscribe-colleague"
          ? { ...p }
          : { kind: "schedule-subscribe-colleague", initialQuery: "" }
      }

      const guiThen = (intent: string, run: () => void) => {
        runVvGuiDispatch(intent, deps.appendToActiveConversation, patchVvUserMessage, () => {
          deps.vvGuiThenDepthRef.current += 1
          try {
            run()
            deps.mirrorCalendarVvRound?.(intent)
          } finally {
            deps.vvGuiThenDepthRef.current -= 1
          }
        })
      }

      const appendSideOrMain = (msg: Message) => {
        if (deps.scheduleSideThreadBridgeRef.current) deps.scheduleSideThreadBridgeRef.current.appendMessage(msg);
        else deps.appendToActiveConversation(msg);
      };

      const patchSideOrMain = (id: string, updater: (m: Message) => Message) => {
        if (deps.scheduleSideThreadBridgeRef.current) {
          deps.scheduleSideThreadBridgeRef.current.patchMessageById(id, updater);
        } else {
          patchVvUserMessage(id, updater);
        }
      };

      const applyRemoveScheduleToMessages = (scheduleId: string) => {
        const patchPayload = (p: VvAssistantPayload): VvAssistantPayload => {
          if (p.kind === "schedule-agenda" || p.kind === "schedule-all") {
            return { ...p, items: p.items.filter((it) => it.id !== scheduleId) };
          }
          if (p.kind === "schedule-detail" && p.item.id === scheduleId) {
            return { kind: "assistant-text", text: `「${p.item.title}」已从日程中移除（演示）。` };
          }
          if (p.kind === "schedule-edit" && p.item.id === scheduleId) {
            return { kind: "assistant-text", text: `「${p.item.title}」对应的日程已移除（演示）。` };
          }
          if (p.kind === "schedule-cancel-confirm" && p.item.id === scheduleId) {
            return {
              ...p,
              completed: true,
              item: { ...p.item, status: "cancelled" },
            };
          }
          return p;
        };
        const patchMsg = (m: Message): Message => {
          if (!m.vvAssistant) return m;
          const nextP = patchPayload(m.vvAssistant);
          if (nextP === m.vvAssistant) return m;
          const statusLine =
            nextP.kind === "schedule-cancel-confirm" && nextP.completed ? "已删除" : undefined;
          return {
            ...m,
            vvAssistant: nextP,
            ...(statusLine ? { vvCardStatusLine: statusLine } : {}),
          };
        };
        if (false) {
          deps.setMessages( (prev) => prev.map(patchMsg));
        } else {
          deps.setMessages((prev) => prev.map(patchMsg));
        }
        deps.scheduleSideThreadBridgeRef.current?.mapMessages(patchMsg);
      };

      if (action === "schedule-self-rsvp" && data && typeof data === "object" && data !== null) {
        const d = data as { scheduleId?: unknown; status?: unknown }
        const scheduleId = typeof d.scheduleId === "string" ? d.scheduleId : ""
        const status = d.status as VvScheduleAttendeeRsvp
        if (!scheduleId || (status !== "accepted" && status !== "declined")) return
        const rsvpName = SCHEDULE_CURRENT_USER_NAME
        deps.setVvScheduleItems((prev) =>
          sortByStart(
            prev.map((s) =>
              s.id === scheduleId ? { ...s, attendeeRsvp: { ...s.attendeeRsvp, [rsvpName]: status } } : s
            )
          )
        )
        const patchScheduleInPayload = (p: VvAssistantPayload): VvAssistantPayload => {
          if (p.kind === "schedule-detail" && p.item.id === scheduleId) {
            return {
              ...p,
              item: { ...p.item, attendeeRsvp: { ...p.item.attendeeRsvp, [rsvpName]: status } },
            }
          }
          if (p.kind === "schedule-agenda") {
            return {
              ...p,
              items: p.items.map((it) =>
                it.id === scheduleId ? { ...it, attendeeRsvp: { ...it.attendeeRsvp, [rsvpName]: status } } : it
              ),
            }
          }
          if (p.kind === "schedule-all") {
            return {
              ...p,
              items: p.items.map((it) =>
                it.id === scheduleId ? { ...it, attendeeRsvp: { ...it.attendeeRsvp, [rsvpName]: status } } : it
              ),
            }
          }
          if (p.kind === "schedule-edit" && p.item.id === scheduleId) {
            return {
              ...p,
              item: { ...p.item, attendeeRsvp: { ...p.item.attendeeRsvp, [rsvpName]: status } },
            }
          }
          if (p.kind === "schedule-cancel-confirm" && p.item.id === scheduleId) {
            return {
              ...p,
              item: { ...p.item, attendeeRsvp: { ...p.item.attendeeRsvp, [rsvpName]: status } },
            }
          }
          return p
        }
        const patchRsvpMessage = (m: Message): Message => {
          if (!m.vvAssistant) return m
          return { ...m, vvAssistant: patchScheduleInPayload(m.vvAssistant) }
        }
        if (false) {
          deps.setMessages( (prev) => prev.map(patchRsvpMessage))
        } else {
          deps.setMessages((prev) => prev.map(patchRsvpMessage))
        }
        return
      }

      if (action === "vv-suggested-followup" && data && typeof data === "object" && data !== null && "sendText" in data) {
        const sendText = String((data as { sendText: unknown }).sendText).trim();
        if (!sendText) return;
        /** 与样板 `guiThen` 一致：先插带推测 CLI 的用户行，再 `runVvGeneralSend`（omit 用户气泡避免重复） */
        runVvGuiDispatch(sendText, deps.appendToActiveConversation, patchVvUserMessage, () => {
          runVvGeneralSend(sendText, deps.vvContext, deps.setMessages, deps.aiSenderId, deps.vvFlow, deps.setVvFlow, {
            scheduleBridge: deps.vvScheduleBridge,
            scheduleCalendarPrefsBridge: deps.scheduleCalendarPrefsBridge,
            omitUserBubble: true,
          });
          deps.mirrorCalendarVvRound?.(sendText);
        });
        return;
      }

      if (action === "vv-pinned-chip" && data && typeof data === "object" && data !== null && "vvTarget" in data) {
        const target = (data as { vvTarget: PinnedChipVvTarget }).vvTarget;
        if (target.kind === "meeting") {
          const item = deps.vvMeetingItems.find((m) => m.id === target.id);
          if (item) {
            guiThen(`查看${qq(item.title)}详情`, () => {
              deps.appendToActiveConversation(vvAssistantMessageFromPayload({ kind: "meeting-detail", item }, aiId));
            });
          }
          return;
        }
        if (target.kind === "schedule") {
          const item = deps.vvScheduleItems.find((s) => s.id === target.id);
          if (item) {
            guiThen(`查看${qq(item.title)}详情`, () => {
              deps.appendToActiveConversation(vvAssistantMessageFromPayload({ kind: "schedule-detail", item }, aiId));
            });
          }
          return;
        }
        if (target.kind === "todoHub") {
          deps.handleSendMessage(null, { textOverride: "我的待办" });
          return;
        }
        if (target.kind === "todo") {
          const item = deps.vvTodoItems.find((x) => x.id === target.id);
          if (item) {
            guiThen(`查看${qq(item.title)}详情`, () => {
              deps.appendToActiveConversation(vvAssistantMessageFromPayload({ kind: "todo-detail", item }, aiId));
            });
          }
          return;
        }
        if (target.kind === "mail") {
          const item = deps.vvMailItems.find((m) => m.id === target.id);
          if (item) {
            guiThen(`查看${qq(item.subject)}详情`, () => {
              deps.appendToActiveConversation(vvAssistantMessageFromPayload({ kind: "mail-detail", item }, aiId));
            });
          }
          return;
        }
        if (target.kind === "drive") {
          const item = deps.vvDriveItems.find((d) => d.id === target.id);
          if (item) {
            guiThen(`查看${qq(item.name)}详情`, () => {
              deps.appendToActiveConversation({
                id: `vv-dr-${Date.now()}`,
                senderId: aiId,
                content: `「${item.name}」\n${item.size} · ${item.location}\n类型：${item.type}\n${
                  item.sharedWith.length ? `已共享：${item.sharedWith.join("、")}` : "尚未共享"
                }\n\n可继续发送「下载文件」或「共享文件」走 vvcli 演示。`,
                timestamp: t,
                createdAt: now,
              });
            });
          }
          return;
        }
        if (target.kind === "doc") {
          const item = deps.vvDocItems.find((d) => d.id === target.id);
          if (item) {
            guiThen(`查看${qq(item.title)}详情`, () => {
              deps.appendToActiveConversation({
                id: `vv-dc-${Date.now()}`,
                senderId: aiId,
                content: "\u200b",
                timestamp: t,
                createdAt: now,
                vvAssistant: { kind: "doc-detail", item },
              });
            });
          }
          return;
        }
        return;
      }

      if (action === "schedule-direct-group-chat" && data && typeof data === "object" && data !== null && "id" in data) {
        /** 交互反馈在 ScheduleDetailCard 内用 toast 提示；此处不再插入助手气泡 */
        return
      }

      if (action === "schedule-direct-delete" && data && typeof data === "object" && data !== null && "id" in data) {
        const { id, title } = data as { id: string; title?: string }
        const item = deps.vvScheduleItems.find((s) => s.id === id)
        if (!item) return
        deps.setVvScheduleItems((prev) => sortByStart(prev.filter((e) => e.id !== id)))
        deps.setVvMeetingItems((prev) => markLinkedMeetingCancelled(prev, item))
        if (isVvModalSilent(data)) {
          applyRemoveScheduleToMessages(id)
          const label = (title?.trim() || item.title).replace(/\n/g, " ")
          appendSideOrMain(
            vvAssistantMessageFromPayload(
              { kind: "assistant-text", text: `【${label}】日程已删除` },
              aiId
            )
          )
        } else {
          const label = (title?.trim() || item.title).replace(/\n/g, " ")
          deps.appendToActiveConversation(
            vvAssistantMessageFromPayload(
              { kind: "assistant-text", text: `「${label}」已从日程列表移除（演示）。` },
              aiId
            )
          )
        }
        return
      }

      if (action === "vv-choice" && data && typeof data === "object" && "followUp" in data && "id" in data) {
        const { followUp, id } = data as { followUp: string; id: string };
        if (followUp === "meeting-join") {
          const item = deps.vvMeetingItems.find((m) => m.id === id);
          deps.setVvFlow(null);
          if (item) {
            guiThen(`加入${qq(item.title)}`, () => {
              deps.appendToActiveConversation(
                vvAssistantMessageFromPayload(
                  {
                    kind: "vv-success",
                    title: item.status === "scheduled" ? "已进入候会状态" : "已加入会议",
                    description: item.status === "scheduled" ? "会议开始后会自动进入。" : "你已经进入会议。",
                    summary: `${item.title} · ${item.time} · ${item.room}`,
                    actions: [
                      ...(item.recordId
                        ? [{ label: "会议记录", action: { kind: "open-record-by-meeting", meetingId: item.id } as const }]
                        : []),
                    ],
                  },
                  aiId
                )
              );
            });
          }
          return;
        }
        const payload = payloadAfterChoicePick(followUp as VvChoiceFollowUp, id, deps.vvContext);
        if (payload.kind === "schedule-edit") {
          guiThen(scheduleEditIntentNaturalLine(payload.item.title, payload.draft), () => {
            deps.setVvFlow({ type: "schedule-edit", scheduleId: payload.item.id, draft: payload.draft });
            deps.appendToActiveConversation(vvAssistantMessageFromPayload(payload, aiId));
          });
          return;
        }
        if (payload.kind === "schedule-cancel-confirm") {
          guiThen(scheduleCancelIntentNaturalLine(payload.item.title, payload.reason), () => {
            deps.setVvFlow({ type: "schedule-cancel", scheduleId: payload.item.id, reason: payload.reason });
            deps.appendToActiveConversation(vvAssistantMessageFromPayload(payload, aiId));
          });
          return;
        }
        deps.setVvFlow(null);
        deps.appendToActiveConversation(vvAssistantMessageFromPayload(payload, aiId));
        return;
      }

      if (action === "free-slot-pick" && data && typeof data === "object" && "slot" in data) {
        const { slot, purpose } = data as { slot: VvFreeSlot; purpose: string };
        if (purpose === "schedule-create") {
          const flowDraft = deps.vvFlow?.type === "schedule-free-slots" ? deps.vvFlow.defaultCreateDraft : undefined
          const draft: VvScheduleCreateDraft = {
            title: flowDraft?.title ?? "产品评审日程",
            slotLabel: slot.label,
            location: flowDraft?.location ?? "线上协作",
            attendees: flowDraft?.attendees ?? "李四、王五、商业化团队",
            calendarTypeId: CAL_DEFAULT_ID,
          }
          const intent = scheduleCreateIntentNaturalLine(draft)
          guiThen(intent, () => {
            deps.setVvFlow({ type: "schedule-create", draft, viaFreeSlots: true });
            deps.appendToActiveConversation(
              vvAssistantMessageFromPayload({ kind: "schedule-create", draft, viaFreeSlots: true }, aiId)
            );
          });
          return;
        }
        if (purpose === "meeting-book") {
          const d =
            deps.vvFlow?.type === "meeting-free-slots"
              ? deps.vvFlow.defaultMeetingDraft
              : { title: "产品评审会", participants: "李四、王五、商业化团队", room: "微微会议" };
          deps.setVvFlow(null);
          deps.appendToActiveConversation(
            vvAssistantMessageFromPayload(
              {
                kind: "assistant-text",
                text: `已选时段「${slot.label}」。请回复：\n请预约一场会议：标题「${d.title}」，时间「${slot.label}」，参会人「${d.participants}」，会议方式「${d.room}」。`,
              },
              aiId
            )
          );
          return;
        }
      }

      if (action === "vv-success-nav" && data && typeof data === "object" && "kind" in data) {
        const nav = data as VvSuccessAction;
        if (nav.kind === "noop") {
          return;
        }
        if (nav.kind === "open-schedule-detail") {
          const item = deps.vvScheduleItems.find((s) => s.id === nav.scheduleId);
          if (item) {
            guiThen(`查看${qq(item.title)}详情`, () => {
              deps.appendToActiveConversation(vvAssistantMessageFromPayload({ kind: "schedule-detail", item }, aiId));
            });
          }
          return;
        }
        if (nav.kind === "open-today-agenda") {
          guiThen("查询今日日程", () => {
            const items = deps.vvScheduleItems.filter((i) => i.dateLabel === "今天");
            deps.appendToActiveConversation(vvAssistantMessageFromPayload({ kind: "schedule-agenda", items }, aiId));
          });
          return;
        }
        if (nav.kind === "start-meeting-freebusy") {
          guiThen("预约会议", () => {
            deps.setVvFlow({
              type: "meeting-free-slots",
              defaultMeetingDraft: {
                title: "产品评审会",
                participants: "李四、王五、商业化团队",
                room: "微微会议",
              },
            });
            deps.appendToActiveConversation(
              vvAssistantMessageFromPayload(
                {
                  kind: "free-slots",
                  title: "共同空闲时间（用于预约会议）",
                  description: "我找到几个适合的时间段，你可以直接选一个。",
                  slots: freeSlotsSeed,
                  purpose: "meeting-book",
                },
                aiId
              )
            );
          });
          return;
        }
        if (nav.kind === "open-meeting-detail") {
          const item = deps.vvMeetingItems.find((m) => m.id === nav.meetingId);
          if (item) {
            guiThen(`查看${qq(item.title)}详情`, () => {
              deps.appendToActiveConversation(vvAssistantMessageFromPayload({ kind: "meeting-detail", item }, aiId));
            });
          }
          return;
        }
        if (nav.kind === "open-record-by-meeting") {
          const meeting = deps.vvMeetingItems.find((m) => m.id === nav.meetingId);
          const record = meeting?.recordId ? deps.vvRecordItems.find((r) => r.id === meeting.recordId) : undefined;
          if (record) {
            guiThen(`查看${qq(meeting!.title)}会议记录`, () => {
              deps.appendToActiveConversation(vvAssistantMessageFromPayload({ kind: "record-detail", item: record }, aiId));
            });
          }
          return;
        }
        if (nav.kind === "open-todo-detail") {
          const item = deps.vvTodoItems.find((x) => x.id === nav.todoId);
          if (item) {
            guiThen(`查看${qq(item.title)}详情`, () => {
              deps.appendToActiveConversation(vvAssistantMessageFromPayload({ kind: "todo-detail", item }, aiId));
            });
          }
          return;
        }
      }

      if (action === "schedule-reopen-side-session" && data && typeof data === "object" && data !== null) {
        const d = data as {
          scheduleId?: string
          panelAppId?: string | null
          panelSurface?: "main" | "floating"
          floatingHostAppId?: string | null
        }
        if (typeof d.scheduleId === "string") {
          const hit = deps.vvScheduleItems.find((s) => s.id === d.scheduleId)
          if (hit) {
            deps.openScheduleSideSheet(hit, {
              appId: d.panelAppId ?? null,
              surface: d.panelSurface ?? "main",
              floatingHostAppId:
                d.panelSurface === "floating" ? d.floatingHostAppId ?? d.panelAppId ?? undefined : undefined,
              treatDateLabelTodayAsNotPast: true,
            })
          }
        }
        return
      }

      if (action === "schedule-open-detail" && data && typeof data === "object" && "linkedMeetingId" in data) {
        const item = data as VvScheduleItem;
        guiThen(`查看${qq(item.title)}详情`, () => {
          deps.appendToActiveConversation(vvAssistantMessageFromPayload({ kind: "schedule-detail", item }, aiId));
        });
        return;
      }

      if (action === "schedule-join-linked-meeting" && data && typeof data === "object" && "linkedMeetingId" in data) {
        const item = data as VvScheduleItem;
        const meeting = item.linkedMeetingId ? deps.vvMeetingItems.find((m) => m.id === item.linkedMeetingId) : undefined;
        if (!meeting) {
          deps.appendToActiveConversation(
            vvAssistantMessageFromPayload({ kind: "assistant-text", text: "未找到该日程关联的会议。" }, aiId)
          );
          return;
        }
        deps.setVvFlow(null);
        guiThen(`加入${qq(meeting.title)}`, () => {
          deps.appendToActiveConversation(
            vvAssistantMessageFromPayload(
              {
                kind: "vv-success",
                title: meeting.status === "scheduled" ? "已进入候会状态" : "已加入会议",
                description: meeting.status === "scheduled" ? "会议开始后会自动进入。" : "你已经进入会议。",
                summary: `${meeting.title} · ${meeting.time} · ${meeting.room}`,
                actions: [
                  ...(meeting.recordId
                    ? [{ label: "会议记录", action: { kind: "open-record-by-meeting", meetingId: meeting.id } as const }]
                    : []),
                ],
              },
              aiId
            )
          );
        });
        return;
      }

      if (
        action === "schedule-start-edit" &&
        data &&
        typeof data === "object" &&
        data !== null &&
        "id" in data &&
        "title" in data
      ) {
        const item = data as VvScheduleItem;
        if (isScheduleItemPast(item)) {
          deps.appendToActiveConversation(
            vvAssistantMessageFromPayload(
              { kind: "assistant-text", text: "该日程已结束，无法修改。仍可发起群聊或删除。" },
              aiId
            )
          );
          return;
        }
        const draft = {
          title: item.title,
          location: item.location,
          start: item.start,
          end: item.end,
          reminder: item.reminder,
          calendarDate: item.calendarDate,
        };
        guiThen(scheduleEditIntentNaturalLine(item.title, draft), () => {
          deps.setVvFlow({ type: "schedule-edit", scheduleId: item.id, draft });
          deps.appendToActiveConversation(vvAssistantMessageFromPayload({ kind: "schedule-edit", item, draft }, aiId));
        });
        return;
      }

      if (
        action === "schedule-start-cancel" &&
        data &&
        typeof data === "object" &&
        data !== null &&
        "id" in data &&
        "title" in data
      ) {
        const item = data as VvScheduleItem;
        const reason = "需求变更";
        const pushConfirmCard = () => {
          deps.setVvFlow({ type: "schedule-cancel", scheduleId: item.id, reason });
          const appendCard =
            deps.scheduleSideThreadBridgeRef.current && isVvModalSilent(data)
              ? appendSideOrMain
              : deps.appendToActiveConversation;
          appendCard(vvAssistantMessageFromPayload({ kind: "schedule-cancel-confirm", item, reason }, aiId));
        };
        if (deps.scheduleSideThreadBridgeRef.current && isVvModalSilent(data)) {
          runVvGuiDispatch(scheduleCancelIntentNaturalLine(item.title, reason), appendSideOrMain, patchSideOrMain, pushConfirmCard);
        } else {
          guiThen(scheduleCancelIntentNaturalLine(item.title, reason), pushConfirmCard);
        }
        return;
      }

      if (action === "schedule-edit-confirm" && data && typeof data === "object" && "draft" in data) {
        const raw = data as { item: VvScheduleItem; draft: VvScheduleEditDraft; _vvSourceMessageId?: string };
        const { item, draft } = raw;
        const updated = buildUpdatedScheduleFromEdit(item, draft);
        deps.setVvScheduleItems((prev) => sortByStart(prev.map((e) => (e.id === updated.id ? updated : e))));
        deps.setVvMeetingItems((prev) => updateLinkedMeetingFromSchedule(prev, updated));
        deps.setVvFlow(null);
        const sourceId = typeof raw._vvSourceMessageId === "string" ? raw._vvSourceMessageId : null;
        if (sourceId) {
          patchAnyMessageById(sourceId, (m) => ({
            ...m,
            vvAssistant: { kind: "schedule-detail", item: updated },
            vvCardStatusLine: "日程已修改",
          }));
        } else {
          deps.appendToActiveConversation(
            vvAssistantMessageFromPayload(
              {
                kind: "schedule-agenda",
                items: [updated],
                heading: "日程已更新",
              },
              aiId
            )
          );
        }
        return;
      }

      /** 今日日程卡片内（含弹窗）编辑确认：同步全局数据，并回写对话里已有助手卡片中的同一条日程 */
      if (action === "schedule-edit-confirm-inline" && data && typeof data === "object" && "draft" in data) {
        const { item, draft } = data as { item: VvScheduleItem; draft: VvScheduleEditDraft };
        const updated = buildUpdatedScheduleFromEdit(item, draft);
        deps.setVvScheduleItems((prev) => sortByStart(prev.map((e) => (e.id === updated.id ? updated : e))));
        deps.setVvMeetingItems((prev) => updateLinkedMeetingFromSchedule(prev, updated));
        deps.setVvFlow(null);

        const patchUpdatedInPayload = (p: VvAssistantPayload): VvAssistantPayload => {
          if (p.kind === "schedule-agenda") {
            return {
              ...p,
              items: p.items.map((it) => (it.id === updated.id ? updated : it)),
            };
          }
          if (p.kind === "schedule-all") {
            return {
              ...p,
              items: p.items.map((it) => (it.id === updated.id ? updated : it)),
            };
          }
          if (p.kind === "schedule-detail" && p.item.id === updated.id) {
            return { ...p, item: updated };
          }
          if (p.kind === "schedule-edit" && p.item.id === updated.id) {
            return { ...p, item: updated, draft: scheduleEditDraftFromItem(updated) };
          }
          if (p.kind === "schedule-cancel-confirm" && p.item.id === updated.id) {
            return { ...p, item: updated };
          }
          return p;
        };
        const patchMsg = (m: Message): Message => {
          if (!m.vvAssistant) return m;
          const p = m.vvAssistant;
          if (p.kind === "schedule-edit" && p.item.id === updated.id) {
            return {
              ...m,
              vvAssistant: { kind: "schedule-detail", item: updated },
              vvCardStatusLine: "日程已修改",
            };
          }
          const nextP = patchUpdatedInPayload(p);
          if (nextP === p) return m;
          const detailInlineSave =
            p.kind === "schedule-detail" &&
            p.item.id === updated.id &&
            nextP.kind === "schedule-detail" &&
            nextP.item.id === updated.id;
          return {
            ...m,
            vvAssistant: nextP,
            ...(detailInlineSave ? { vvCardStatusLine: "日程已修改" } : {}),
          };
        };
        if (false) {
          deps.setMessages( (prev) => prev.map(patchMsg));
        } else {
          deps.setMessages((prev) => prev.map(patchMsg));
        }
        deps.scheduleSideThreadBridgeRef.current?.mapMessages(patchMsg);
        return;
      }

      if (action === "schedule-edit-back") {
        deps.setVvFlow(null);
        deps.appendToActiveConversation(
          vvAssistantMessageFromPayload({ kind: "assistant-text", text: "好的，这次先不修改日程。" }, aiId)
        );
        return;
      }

      if (action === "schedule-calendar-settings-confirm") {
        const raw = data && typeof data === "object" && data !== null ? data : null;
        const prefs =
          raw && "prefs" in raw ? (raw as { prefs: VvScheduleCalendarPrefs }).prefs : null;
        if (!prefs) return;
        const sourceId =
          raw && "_vvSourceMessageId" in raw && typeof (raw as { _vvSourceMessageId?: unknown })._vvSourceMessageId === "string"
            ? (raw as { _vvSourceMessageId: string })._vvSourceMessageId
            : null;
        const fromSummaryReedit =
          raw && "_vvSummaryReconfirm" in raw && (raw as { _vvSummaryReconfirm?: boolean })._vvSummaryReconfirm === true;
        const pushCalendarSettingsUpdated = () => {
          deps.scheduleCalendarPrefsBridgeRef.current?.setPrefs(prefs);
          const textMsg = vvAssistantMessageFromPayload(
            { kind: "assistant-text", text: "日历设置已更新。" },
            aiId
          );
          const cardMsg = vvAssistantMessageFromPayload(
            { kind: "schedule-calendar-settings-summary", prefs },
            aiId
          );
          const cardWithId =
            cardMsg.id === textMsg.id ? { ...cardMsg, id: `${cardMsg.id}-cal-summary` } : cardMsg;
          deps.appendToActiveConversation(textMsg);
          deps.appendToActiveConversation(cardWithId);
        };
        if (sourceId) {
          deps.scheduleCalendarPrefsBridgeRef.current?.setPrefs(prefs);
          patchAnyMessageById(sourceId, (m) => ({
            ...m,
            vvAssistant: { kind: "schedule-calendar-settings-summary", prefs },
            vvCardStatusLine: "日历设置已更新",
          }));
        } else if (fromSummaryReedit) {
          pushCalendarSettingsUpdated();
        } else {
          guiThen("确认修改日历设置", pushCalendarSettingsUpdated);
        }
        return;
      }

      if (action === "schedule-calendar-settings-back") {
        guiThen("取消修改日历设置", () => {
          deps.appendToActiveConversation(
            vvAssistantMessageFromPayload({ kind: "assistant-text", text: "好的，这次先不修改日历设置。" }, aiId)
          );
        });
        return;
      }

      if (action === "schedule-calendar-create-submit" && data && typeof data === "object" && data !== null) {
        const raw = data as {
          name?: unknown
          visibility?: unknown
          color?: unknown
          description?: unknown
          _vvSourceMessageId?: unknown
        };
        const name = typeof raw.name === "string" ? raw.name.trim() : "";
        if (!name) return;
        const visibility =
          raw.visibility === "busy_only" || raw.visibility === "details" || raw.visibility === "private"
            ? raw.visibility
            : ("busy_only" as const);
        const color = typeof raw.color === "string" && raw.color.trim() ? raw.color.trim() : "#1890ff";
        const description = typeof raw.description === "string" ? raw.description : "";
        const sourceId = typeof raw._vvSourceMessageId === "string" ? raw._vvSourceMessageId : null;
        const newId = `cal-user-${Date.now()}`;
        const entry: VvUserCalendarType = {
          id: newId,
          name,
          color,
          description: description.trim() || undefined,
          visibility,
        };
        deps.calendarTypesBridgeRef.current?.appendCalendar(entry);
        const draft: VvCalendarCreateDraft = {
          name,
          visibility,
          color,
          description: description.trim(),
        };
        if (sourceId) {
          patchAnyMessageById(sourceId, (m) => ({
            ...m,
            vvAssistant: {
              kind: "schedule-calendar-create",
              draft,
              completed: true,
              createdCalendarId: newId,
            },
            vvCardStatusLine: `已创建日历「${name}」`,
          }));
        }
        return;
      }

      if (action === "schedule-calendar-create-update" && data && typeof data === "object" && data !== null) {
        const raw = data as {
          calendarId?: unknown
          name?: unknown
          visibility?: unknown
          color?: unknown
          description?: unknown
          _vvSourceMessageId?: unknown
        };
        const calendarId = typeof raw.calendarId === "string" ? raw.calendarId.trim() : "";
        const name = typeof raw.name === "string" ? raw.name.trim() : "";
        if (!calendarId || !name) return;
        const visibility =
          raw.visibility === "busy_only" || raw.visibility === "details" || raw.visibility === "private"
            ? raw.visibility
            : ("busy_only" as const);
        const color = typeof raw.color === "string" && raw.color.trim() ? raw.color.trim() : "#1890ff";
        const description = typeof raw.description === "string" ? raw.description : "";
        const sourceId = typeof raw._vvSourceMessageId === "string" ? raw._vvSourceMessageId : null;
        deps.calendarTypesBridgeRef.current?.updateCalendar(calendarId, {
          name,
          color,
          description: description.trim() || undefined,
          visibility,
        });
        const draft: VvCalendarCreateDraft = {
          name,
          visibility,
          color,
          description: description.trim(),
        };
        if (sourceId) {
          patchAnyMessageById(sourceId, (m) => ({
            ...m,
            vvAssistant: {
              kind: "schedule-calendar-create",
              draft,
              completed: true,
              createdCalendarId: calendarId,
            },
            vvCardStatusLine: `日历「${name}」已更新`,
          }));
        }
        return;
      }

      if (action === "schedule-calendar-create-dismiss" && data && typeof data === "object" && data !== null) {
        const sourceId =
          "_vvSourceMessageId" in data && typeof (data as { _vvSourceMessageId?: unknown })._vvSourceMessageId === "string"
            ? (data as { _vvSourceMessageId: string })._vvSourceMessageId
            : null;
        if (sourceId) {
          patchAnyMessageById(sourceId, (m) => {
            const { vvCardStatusLine: _omit, ...rest } = m;
            return {
              ...rest,
              vvAssistant: { kind: "assistant-text", text: "好的，本次未创建日历。" },
            };
          });
        } else {
          deps.appendToActiveConversation(
            vvAssistantMessageFromPayload({ kind: "assistant-text", text: "好的，本次未创建日历。" }, aiId)
          );
        }
        return;
      }

      if (
        action === "schedule-subscribe-confirm-ok" &&
        data &&
        typeof data === "object" &&
        data !== null &&
        "colleagueName" in data
      ) {
        const colleagueName = String((data as { colleagueName: unknown }).colleagueName).trim();
        if (!colleagueName) return;
        const dirHit = findColleagueDirectoryEntryByName(colleagueName);
        const colleagueId = dirHit?.id ?? `nl:${colleagueName}`;
        const sourceId = vvSubscribeCardSourceId(data);
        if (sourceId) {
          deps.subscribedColleagueBridgeRef.current?.add(colleagueId);
          patchAnyMessageById(sourceId, (m) => ({
            ...m,
            vvAssistant: { kind: "schedule-subscribe-confirm", colleagueName, completed: true },
            vvCardStatusLine: "已订阅",
          }));
          return;
        }
        guiThen(`订阅${vvIntentQuote(colleagueName)}的日历`, () => {
          deps.subscribedColleagueBridgeRef.current?.add(colleagueId);
          deps.appendToActiveConversation(
            vvAssistantMessageFromPayload(
              {
                kind: "assistant-text",
                text: `已订阅「${colleagueName}」的日历（演示）。可在「全部日程」中查看其忙碌时段；也可在「日历设置」中管理订阅人。`,
              },
              aiId
            )
          );
        });
        return;
      }

      if (action === "schedule-subscribe-confirm-cancel") {
        const sourceId = vvSubscribeCardSourceId(data);
        if (sourceId) {
          patchAnyMessageById(sourceId, (m) => ({
            ...m,
            vvAssistant: { kind: "schedule-subscribe-colleague", initialQuery: "" },
            vvCardStatusLine: "好的，未订阅该同事的日历。",
          }));
          return;
        }
        deps.appendToActiveConversation(
          vvAssistantMessageFromPayload({ kind: "assistant-text", text: "好的，未订阅该同事的日历。" }, aiId)
        );
        return;
      }

      if (
        action === "schedule-unsubscribe-confirm-ok" &&
        data &&
        typeof data === "object" &&
        data !== null &&
        "colleagueName" in data
      ) {
        const colleagueName = String((data as { colleagueName: unknown }).colleagueName).trim();
        if (!colleagueName) return;
        const dirHit = findColleagueDirectoryEntryByName(colleagueName);
        const colleagueId = dirHit?.id ?? `nl:${colleagueName}`;
        const wasSubscribed = deps.subscribedColleagueBridgeRef.current?.isSubscribed(colleagueId) ?? false;
        const sourceId = vvSubscribeCardSourceId(data);
        if (sourceId) {
          if (!wasSubscribed) {
            patchAnyMessageById(sourceId, (m) => ({
              ...m,
              vvAssistant: { kind: "schedule-subscribe-colleague", initialQuery: "" },
              vvCardStatusLine: `当前未订阅「${colleagueName}」的日历，无需解除。`,
            }));
            return;
          }
          deps.subscribedColleagueBridgeRef.current?.remove(colleagueId);
          patchAnyMessageById(sourceId, (m) => ({
            ...m,
            vvAssistant: { kind: "schedule-unsubscribe-confirm", colleagueName, completed: true },
            vvCardStatusLine: "已删除",
          }));
          return;
        }
        if (!wasSubscribed) {
          deps.appendToActiveConversation(
            vvAssistantMessageFromPayload(
              { kind: "assistant-text", text: `当前未订阅「${colleagueName}」的日历，无需解除。` },
              aiId
            )
          );
          return;
        }
        guiThen(`取消订阅${vvIntentQuote(colleagueName)}的日历`, () => {
          deps.subscribedColleagueBridgeRef.current?.remove(colleagueId);
          deps.appendToActiveConversation(
            vvAssistantMessageFromPayload(
              {
                kind: "assistant-text",
                text: `已取消订阅「${colleagueName}」的日历（演示）。对方将从「我订阅的」列表移除，日视图不再对比其忙碌时段。`,
              },
              aiId
            )
          );
        });
        return;
      }

      if (action === "schedule-unsubscribe-confirm-cancel") {
        const sourceId = vvSubscribeCardSourceId(data);
        if (sourceId) {
          patchAnyMessageById(sourceId, (m) => ({
            ...m,
            vvAssistant: { kind: "schedule-subscribe-colleague", initialQuery: "" },
            vvCardStatusLine: "好的，保留对该同事的日历订阅。",
          }));
          return;
        }
        deps.appendToActiveConversation(
          vvAssistantMessageFromPayload({ kind: "assistant-text", text: "好的，保留对该同事的日历订阅。" }, aiId)
        );
        return;
      }

      if (action === "schedule-subscribe-view" && data && typeof data === "object" && data !== null && "name" in data) {
        const name = String((data as { name: unknown }).name).trim();
        if (!name) return;
        const sourceId = vvSubscribeCardSourceId(data);
        if (sourceId) {
          patchAnyMessageById(sourceId, (m) => ({
            ...m,
            vvAssistant: colleagueSubscribePayloadPreserve(m),
            vvCardStatusLine: `（演示）已打开「${name}」的日历预览，可查看忙碌时段与公开安排。`,
          }));
          return;
        }
        guiThen(`查看${vvIntentQuote(name)}的日历`, () => {
          deps.appendToActiveConversation(
            vvAssistantMessageFromPayload(
              { kind: "assistant-text", text: `（演示）已打开「${name}」的日历预览，可查看忙碌时段与公开安排。` },
              aiId
            )
          );
        });
        return;
      }

      if (
        action === "schedule-subscribe-commit" &&
        data &&
        typeof data === "object" &&
        data !== null &&
        "name" in data &&
        "id" in data
      ) {
        const name = String((data as { name: unknown }).name).trim();
        const colleagueId = String((data as { id: unknown }).id).trim();
        if (!name || !colleagueId) return;
        const sourceId = vvSubscribeCardSourceId(data);
        if (sourceId) {
          deps.subscribedColleagueBridgeRef.current?.add(colleagueId);
          patchAnyMessageById(sourceId, (m) => ({
            ...m,
            vvAssistant: colleagueSubscribePayloadPreserve(m),
            vvCardStatusLine: `已订阅「${name}」的日历（演示）。可在「全部日程」中查看其忙碌时段；也可在「日历设置」中管理订阅人。`,
          }));
          return;
        }
        guiThen(`订阅${vvIntentQuote(name)}的日历`, () => {
          deps.subscribedColleagueBridgeRef.current?.add(colleagueId);
          deps.appendToActiveConversation(
            vvAssistantMessageFromPayload(
              {
                kind: "assistant-text",
                text: `已订阅「${name}」的日历（演示）。可在「全部日程」中查看其忙碌时段；也可在「日历设置」中管理订阅人。`,
              },
              aiId
            )
          );
        });
        return;
      }

      if (
        action === "schedule-subscribe-uncommit" &&
        data &&
        typeof data === "object" &&
        data !== null &&
        "name" in data &&
        "id" in data
      ) {
        const name = String((data as { name: unknown }).name).trim();
        const colleagueId = String((data as { id: unknown }).id).trim();
        if (!name || !colleagueId) return;
        const sourceId = vvSubscribeCardSourceId(data);
        if (sourceId) {
          deps.subscribedColleagueBridgeRef.current?.remove(colleagueId);
          patchAnyMessageById(sourceId, (m) => ({
            ...m,
            vvAssistant: colleagueSubscribePayloadPreserve(m),
            vvCardStatusLine: `已解除对「${name}」的日历订阅（演示）。`,
          }));
          return;
        }
        guiThen(`解除订阅${vvIntentQuote(name)}的日历`, () => {
          deps.subscribedColleagueBridgeRef.current?.remove(colleagueId);
          deps.appendToActiveConversation(
            vvAssistantMessageFromPayload(
              { kind: "assistant-text", text: `已解除对「${name}」的日历订阅（演示）。` },
              aiId
            )
          );
        });
        return;
      }

      if (action === "schedule-create-confirm" && data && typeof data === "object" && "draft" in data) {
        const raw = data as { draft: VvScheduleCreateDraft; viaFreeSlots?: boolean; _vvSourceMessageId?: string };
        const { draft } = raw;
        const item = buildNewScheduleItemFromCreateDraft(draft);
        if (!item) {
          deps.appendToActiveConversation(
            vvAssistantMessageFromPayload(
              {
                kind: "assistant-text",
                text: "未能从时间中解析出有效日期与时段，请检查日期与起止时间。",
              },
              aiId
            )
          );
          return;
        }
        deps.setVvScheduleItems((prev) => sortByStart([...prev, item]));
        deps.setVvFlow(null);
        const sourceId = typeof raw._vvSourceMessageId === "string" ? raw._vvSourceMessageId : null;
        if (sourceId) {
          patchAnyMessageById(sourceId, (m) => ({
            ...m,
            vvAssistant: { kind: "schedule-detail", item },
            vvCardStatusLine: "日程已新建",
          }));
        } else {
          deps.appendToActiveConversation(
            vvAssistantMessageFromPayload({ kind: "schedule-agenda", items: [item], heading: "日程已创建" }, aiId)
          );
        }
        return;
      }

      if (action === "schedule-create-back" && data && typeof data === "object") {
        const { viaFreeSlots } = data as { viaFreeSlots?: boolean };
        if (viaFreeSlots) {
          deps.setVvFlow({ type: "schedule-free-slots" });
          deps.appendToActiveConversation(
            vvAssistantMessageFromPayload(
              {
                kind: "free-slots",
                title: "共同空闲时间（用于新建日程）",
                description: "我找到几个适合的时间段，你可以直接选一个。",
                slots: freeSlotsSeed,
                purpose: "schedule-create",
              },
              aiId
            )
          );
          return;
        }
        deps.setVvFlow(null);
        deps.appendToActiveConversation(
          vvAssistantMessageFromPayload({ kind: "assistant-text", text: "好的，这次先不创建日程。" }, aiId)
        );
        return;
      }

      if (action === "schedule-notify-send" && data && typeof data === "object" && "text" in data) {
        const { text, targetText } = data as { text: string; targetText: string };
        deps.appendToActiveConversation(
          vvAssistantMessageFromPayload(
            {
              kind: "assistant-text",
              text: `已模拟发送通知。\nvvcli im +send --to "${targetText}" --text "${text.replace(/"/g, '\\"')}"\n\n演示环境不会真实发送消息。`,
            },
            aiId
          )
        );
        return;
      }

      if (action === "schedule-notify-skip") {
        deps.appendToActiveConversation(
          vvAssistantMessageFromPayload({ kind: "assistant-text", text: "好的，暂不发送通知。" }, aiId)
        );
        return;
      }

      if (action === "schedule-cancel-confirm-do" && data && typeof data === "object" && "reason" in data) {
        const raw = data as {
          item: VvScheduleItem;
          reason: string;
          _vvRemainDetailCard?: boolean;
        };
        const { item } = raw;
        const nextSchedules = deps.vvScheduleItems.filter((e) => e.id !== item.id);
        deps.setVvScheduleItems(nextSchedules);
        deps.setVvMeetingItems((prev) => markLinkedMeetingCancelled(prev, item));
        deps.setVvFlow(null);
        const remainDetail = raw._vvRemainDetailCard === true;
        if (remainDetail) {
          const cancelledItem: VvScheduleItem = { ...item, status: "cancelled" };
          const patchRemainDetail = (m: Message): Message => {
            if (!m.vvAssistant) return m;
            const p = m.vvAssistant;
            if (p.kind === "schedule-agenda" || p.kind === "schedule-all") {
              return { ...m, vvAssistant: { ...p, items: p.items.filter((it) => it.id !== item.id) } };
            }
            if (p.kind === "schedule-detail" && p.item.id === item.id) {
              return {
                ...m,
                vvAssistant: { kind: "schedule-detail", item: { ...p.item, status: "cancelled" } },
                vvCardStatusLine: "已删除",
              };
            }
            if (p.kind === "schedule-edit" && p.item.id === item.id) {
              return {
                ...m,
                vvAssistant: { kind: "schedule-detail", item: cancelledItem },
                vvCardStatusLine: "已删除",
              };
            }
            if (p.kind === "schedule-cancel-confirm" && p.item.id === item.id) {
              return {
                ...m,
                vvAssistant: { kind: "schedule-detail", item: { ...p.item, status: "cancelled" } },
                vvCardStatusLine: "已删除",
              };
            }
            return m;
          };
          if (false) {
            deps.setMessages( (prev) => prev.map(patchRemainDetail));
          } else {
            deps.setMessages((prev) => prev.map(patchRemainDetail));
          }
          deps.scheduleSideThreadBridgeRef.current?.mapMessages(patchRemainDetail);
          return;
        }
        if (isVvModalSilent(data)) {
          applyRemoveScheduleToMessages(item.id);
          const label = item.title.replace(/\n/g, " ");
          appendSideOrMain(
            vvAssistantMessageFromPayload(
              { kind: "assistant-text", text: `【${label}】日程已删除` },
              aiId
            )
          );
        } else {
          const patchCancelConfirmDone = (m: Message): Message => {
            const p = m.vvAssistant;
            if (!p || p.kind !== "schedule-cancel-confirm" || p.item.id !== item.id || p.completed) return m;
            return {
              ...m,
              vvAssistant: {
                ...p,
                completed: true,
                item: { ...p.item, status: "cancelled" },
              },
              vvCardStatusLine: "已删除",
            };
          };
          if (false) {
            deps.setMessages( (prev) => prev.map(patchCancelConfirmDone));
          } else {
            deps.setMessages((prev) => prev.map(patchCancelConfirmDone));
          }
          deps.scheduleSideThreadBridgeRef.current?.mapMessages(patchCancelConfirmDone);

        }
        return;
      }

      if (action === "schedule-cancel-back") {
        deps.setVvFlow(null);
        if (!isVvModalSilent(data)) {
          deps.appendToActiveConversation(
            vvAssistantMessageFromPayload({ kind: "assistant-text", text: "好的，这次不会执行取消操作。" }, aiId)
          );
        }
        return;
      }

      if (action === "meeting-start-confirm" && data && typeof data === "object" && "draft" in data) {
        const { draft } = data as { draft: VvMeetingStartFormDraft };
        if (draft.timeMode === "instant") {
          const intent = intentLineMeetingInstant(draft);
          guiThen(intent, () => {
            const newMeeting = buildInstantMeeting(draft);
            deps.setVvMeetingItems((prev) => [...prev, newMeeting]);
            deps.setVvFlow(null);
            deps.appendToActiveConversation(
              vvAssistantMessageFromPayload(
                {
                  kind: "vv-success",
                  title: "即时会议已发起",
                  description: "会议已创建",
                  actions: [{ label: "进入会议", action: { kind: "noop" } }],
                },
                aiId
              )
            );
          });
          return;
        }
        const base = resolveMeetingScheduledBase(draft);
        if (!base) {
          deps.appendToActiveConversation(
            vvAssistantMessageFromPayload(
              { kind: "assistant-text", text: "请选择预约日期，并填写开始与结束时间。" },
              aiId
            )
          );
          return;
        }
        const timeLabel = `${base.dateLabel} ${base.start} - ${base.end}`;
        const intent = intentLineMeetingBook(draft, timeLabel);
        guiThen(intent, () => {
          const { newMeeting, newSchedule } = buildBookedMeetingAndSchedule(draft, base);
          deps.setVvScheduleItems((prev) => sortByStart([...prev, newSchedule]));
          deps.setVvMeetingItems((prev) => [...prev, newMeeting]);
          deps.setVvFlow(null);
          deps.appendToActiveConversation(
            vvAssistantMessageFromPayload(
              {
                kind: "vv-success",
                title: "会议已预约",
                description: "已写入会议列表，并同步关联日程。",
                summary: `${newMeeting.title} · ${newMeeting.time} · ${newMeeting.room}`,
                actions: [
                  { label: "查看关联日程", action: { kind: "open-schedule-detail", scheduleId: newSchedule.id } },
                  { label: "查看会议详情", action: { kind: "open-meeting-detail", meetingId: newMeeting.id } },
                ],
              },
              aiId
            )
          );
        });
        return;
      }

      if (action === "meeting-start-back") {
        guiThen("取消发起会议", () => {
          deps.setVvFlow(null);
          deps.appendToActiveConversation(
            vvAssistantMessageFromPayload({ kind: "assistant-text", text: "好的，已取消发起会议。" }, aiId)
          );
        });
        return;
      }

      if (action === "approval-process-pick" && data && typeof data === "object" && "label" in data) {
        const label = String((data as { label: unknown }).label ?? "").trim();
        const nextDraft = defaultApprovalStartDraft();
        nextDraft.title = label;
        const typePart = label === "发起审批" ? "" : label;
        nextDraft.processType = typePart;
        nextDraft.template = typePart;
        deps.appendToActiveConversation(
          vvAssistantMessageFromPayload({ kind: "approval-start-form", draft: nextDraft }, aiId)
        );
        return;
      }

      if (action === "approval-start-save-draft" && data && typeof data === "object" && "draft" in data) {
        guiThen("保存审批草稿", () => {
          deps.appendToActiveConversation(
            vvAssistantMessageFromPayload({ kind: "assistant-text", text: "已保存草稿（演示）。" }, aiId)
          );
        });
        return;
      }

      if (action === "approval-attach-demo") {
        deps.appendToActiveConversation(
          vvAssistantMessageFromPayload(
            { kind: "assistant-text", text: "演示环境：附件上传交互略过，请以正式端为准。" },
            aiId
          )
        );
        return;
      }

      if (action === "approval-start-confirm" && data && typeof data === "object" && "draft" in data) {
        const { draft } = data as { draft: VvApprovalStartFormDraft };
        const titleOk = (draft.title ?? "").trim().length > 0;
        const typeOk = (draft.processType ?? draft.template ?? "").trim().length > 0;
        const contentOk = (draft.content ?? draft.detail ?? "").trim().length > 0;
        const orgOk = (draft.organization ?? "").trim().length > 0;
        const processOk = (draft.process ?? "").trim().length > 0;
        if (!orgOk || !titleOk || !typeOk || !contentOk || !processOk) {
          deps.appendToActiveConversation(
            vvAssistantMessageFromPayload(
              {
                kind: "assistant-text",
                text: "请补全必填项：组织、标题、类型、内容、流程后再提交。",
              },
              aiId
            )
          );
          return;
        }
        const intent = intentLineApprovalCreate(draft);
        guiThen(intent, () => {
          const newTodo = buildTodoFromApprovalDraft(draft);
          deps.setVvTodoItems((prev) => [newTodo, ...prev]);
          deps.setVvFlow(null);
          deps.appendToActiveConversation(
            vvAssistantMessageFromPayload(
              {
                kind: "vv-success",
                title: "审批已提交",
                description: "演示环境已写入一条待办，审批人将收到待处理事项。",
                summary: `${newTodo.title} · ${newTodo.amount ?? ""} · 审批人：${(newTodo.approvers ?? []).join("、")}`,
                actions: [{ label: "查看审批待办", action: { kind: "open-todo-detail", todoId: newTodo.id } }],
              },
              aiId
            )
          );
        });
        return;
      }

      if (action === "approval-start-back") {
        guiThen("取消发起审批", () => {
          deps.setVvFlow(null);
          deps.appendToActiveConversation(
            vvAssistantMessageFromPayload({ kind: "assistant-text", text: "好的，已取消发起审批。" }, aiId)
          );
        });
        return;
      }

      if (action === "mail-compose-confirm" && data && typeof data === "object" && "draft" in data) {
        const { draft } = data as { draft: VvMailComposeFormDraft }
        const intent = intentLineMailCreate(draft)
        guiThen(intent, () => {
          deps.setVvFlow(null)
          deps.appendToActiveConversation(
            vvAssistantMessageFromPayload(
              {
                kind: "vv-success",
                title: "邮件已提交发送",
                description: "演示环境按 vvcli mail send 解析，不会真实投递。",
                summary: `主题：${draft.subject || "（无主题）"}\n收件人：${draft.to || "（未填）"}${draft.cc ? `\n抄送：${draft.cc}` : ""}`,
                actions: [],
              },
              aiId
            )
          )
        })
        return
      }

      if (action === "mail-compose-back") {
        guiThen("取消新建邮件", () => {
          deps.setVvFlow(null)
          deps.appendToActiveConversation(
            vvAssistantMessageFromPayload({ kind: "assistant-text", text: "好的，已取消新建邮件。" }, aiId)
          )
        })
        return
      }

      if (action === "meeting-join-card-submit" && data && typeof data === "object" && data !== null && "meetingCode" in data) {
        const d = data as { meetingCode: string; displayName: string; micOn: boolean; camOn: boolean }
        deps.setVvFlow(null)
        dispatchNativeMeetingJoin({
          meetingCode: d.meetingCode,
          displayName: d.displayName,
          micOn: d.micOn,
          camOn: d.camOn,
        })
        guiThen(`加入会议（会议号 ${d.meetingCode}）`, () => {
          deps.appendToActiveConversation(
            vvAssistantMessageFromPayload(
              {
                kind: "vv-success",
                title: "已加入会议",
                description: "已在会议客户端进入。",
                actions: [],
              },
              aiId
            )
          )
        })
        return
      }

      if (action === "meeting-join" && data && typeof data === "object" && "participants" in data) {
        const item = data as VvMeetingItem;
        deps.setVvFlow(null);
        guiThen(`加入${qq(item.title)}`, () => {
          deps.appendToActiveConversation(
            vvAssistantMessageFromPayload(
              {
                kind: "vv-success",
                title: item.status === "scheduled" ? "已进入候会状态" : "已加入会议",
                description: item.status === "scheduled" ? "会议开始后会自动进入。" : "你已经进入会议。",
                summary: `${item.title} · ${item.time} · ${item.room}`,
                actions: [
                  ...(item.recordId ? [{ label: "会议记录", action: { kind: "open-record-by-meeting", meetingId: item.id } as const }] : []),
                ],
              },
              aiId
            )
          );
        });
        return;
      }

      if (action === "meeting-record-start" && data && typeof data === "object" && data !== null && "meetingId" in data) {
        const meetingId = String((data as { meetingId: unknown }).meetingId);
        const item = deps.vvMeetingItems.find((m) => m.id === meetingId);
        if (!item) return;
        deps.setVvFlow(null);
        guiThen(`开始${qq(item.title)}`, () => {
          deps.appendToActiveConversation(
            vvAssistantMessageFromPayload(
              {
                kind: "vv-success",
                title: item.status === "scheduled" ? "已进入候会状态" : "已加入会议",
                description: item.status === "scheduled" ? "会议开始后会自动进入。" : "你已经进入会议。",
                summary: `${item.title} · ${item.time} · ${item.room}`,
                actions: [
                  ...(item.recordId ? [{ label: "会议记录", action: { kind: "open-record-by-meeting", meetingId: item.id } as const }] : []),
                ],
              },
              aiId
            )
          );
        });
        return;
      }

      if (action === "meeting-record-add-members" && data && typeof data === "object" && data !== null) {
        const title = "title" in data ? String((data as { title: unknown }).title).trim() : "";
        deps.setVvFlow(null);
        deps.appendToActiveConversation(
          vvAssistantMessageFromPayload(
            {
              kind: "assistant-text",
              text: `「${title || "会议"}」添加成员（演示）：请在会议客户端或通讯录中完成邀请。`,
            },
            aiId
          )
        );
        return;
      }

      if (action === "meeting-record-external" || action === "meeting-record-remove") {
        return;
      }

      if (action === "meeting-detail" && data && typeof data === "object" && "participants" in data) {
        const item = data as VvMeetingItem;
        deps.setVvFlow(null);
        guiThen(`查看${qq(item.title)}详情`, () => {
          deps.appendToActiveConversation({
            id: `vv-mt-${Date.now()}`,
            senderId: aiId,
            content: "\u200b",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            createdAt: Date.now(),
            vvAssistant: { kind: "meeting-detail", item },
          });
        });
        return;
      }

      if (action === "record-detail" && data && typeof data === "object" && "actions" in data) {
        const item = data as VvRecordItem;
        deps.setVvFlow(null);
        guiThen(`查看${qq(item.title)}详情`, () => {
          deps.appendToActiveConversation({
            id: `vv-rc-${Date.now()}`,
            senderId: aiId,
            content: "\u200b",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            createdAt: Date.now(),
            vvAssistant: { kind: "record-detail", item },
          });
        });
        return;
      }

      if (action === "doc-detail" && data && typeof data === "object" && "sharedWithMe" in data) {
        const item = data as VvDocItem;
        guiThen(`查看${qq(item.title)}详情`, () => {
          deps.appendToActiveConversation({
            id: `vv-dc-${Date.now()}`,
            senderId: aiId,
            content: "\u200b",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            createdAt: Date.now(),
            vvAssistant: { kind: "doc-detail", item },
          });
        });
        return;
      }

      if (action === "drive-focus" && data && typeof data === "object" && "name" in data) {
        const item = data as VvDriveItem;
        guiThen(`查看${qq(item.name)}详情`, () => {
          deps.appendToActiveConversation({
            id: `vv-dr-${Date.now()}`,
            senderId: aiId,
            content: `「${item.name}」\n${item.size} · ${item.location}\n类型：${item.type}\n${
              item.sharedWith.length ? `已共享：${item.sharedWith.join("、")}` : "尚未共享"
            }\n\n可继续发送「下载文件」或「共享文件」走 vvcli 演示。`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            createdAt: Date.now(),
          });
        });
        return;
      }

      if (action === "todo-detail" && data && typeof data === "object" && "type" in data) {
        const item = data as VvTodoItem;
        guiThen(`查看${qq(item.title)}详情`, () => {
          deps.appendToActiveConversation({
            id: `vv-td-${Date.now()}`,
            senderId: aiId,
            content: "\u200b",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            createdAt: Date.now(),
            vvAssistant: { kind: "todo-detail", item },
          });
        });
        return;
      }

      if (action === "mail-detail" && data && typeof data === "object" && "subject" in data) {
        const item = data as VvMailItem;
        guiThen(`查看${qq(item.subject)}详情`, () => {
          deps.appendToActiveConversation({
            id: `vv-md-${Date.now()}`,
            senderId: aiId,
            content: "\u200b",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            createdAt: Date.now(),
            vvAssistant: { kind: "mail-detail", item },
          });
        });
        return;
      }

      if (action === "todo-approve" && data && typeof data === "object" && "title" in data) {
        const item = data as VvTodoItem;
        guiThen(`同意${qq(item.title)}`, () => {
          deps.appendToActiveConversation({
            id: `vv-ok-${Date.now()}`,
            senderId: aiId,
            content: `已通过审批「${item.title}」。演示环境未写入真实状态。`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            createdAt: Date.now(),
          });
        });
        return;
      }

      if (action === "todo-reject" && data && typeof data === "object" && "title" in data) {
        const item = data as VvTodoItem;
        guiThen(`拒绝${qq(item.title)}`, () => {
          deps.appendToActiveConversation({
            id: `vv-rj-${Date.now()}`,
            senderId: aiId,
            content: `已拒绝审批「${item.title}」。演示环境未写入真实状态。`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            createdAt: Date.now(),
          });
        });
        return;
      }

      if (action === "todo-complete" && data && typeof data === "object" && "title" in data) {
        const item = data as VvTodoItem;
        guiThen(`处理${qq(item.title)}`, () => {
          deps.appendToActiveConversation({
            id: `vv-cp-${Date.now()}`,
            senderId: aiId,
            content: `已将「${item.title}」标记为已处理。演示环境未写入真实状态。`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            createdAt: Date.now(),
          });
        });
        return;
      }
  }
}
