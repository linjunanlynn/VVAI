import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { cn } from "../ui/utils"
import { PersonalInfoManager } from "./PersonalInfoManager"
import { CreateEmailForm } from "./CreateEmailForm"
import { ChatPromptButton } from "./ChatPromptButton"
import { DockSessionOrgReplyBanner } from "./DockAgentOrgScopeBar"
import { DockCuiFollowUpStrip } from "./DockCuiFollowUpStrip"

interface ChatMessageBubbleProps {
  msg: any;
  isMe: boolean;
  userAvatar?: string;
  aiAvatar?: string;
  userName?: string;
  isSpecialComponent?: boolean;
  isPersonalInfo?: boolean;
  isCreateEmailForm?: boolean;
  isContinueEmail?: boolean;
  hideAvatar?: boolean;
  className?: string;
  handleEmailFormSubmit?: (id: string, data: any) => void;
  handleContinueCreateEmail?: () => void;
  /** 组织型应用会话：无逐条 scope 时，在 AI 文本回复上展示所属组织 */
  dockSessionOrgDisplayName?: string | null;
  /** 应用 Agent 文本回复后的 CUI 追问条：点击发送追问文案 */
  onDockFollowUpSend?: (text: string) => void;
}

export function ChatMessageBubble({
  msg,
  isMe,
  userAvatar,
  aiAvatar,
  userName = "User",
  isSpecialComponent,
  isPersonalInfo,
  isCreateEmailForm,
  isContinueEmail,
  hideAvatar = false,
  className,
  handleEmailFormSubmit,
  handleContinueCreateEmail,
  dockSessionOrgDisplayName,
  onDockFollowUpSend,
}: ChatMessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row w-full",
        isMe
          ? "items-end md:items-start justify-end gap-[6px] md:gap-[8px]"
          : "items-start md:items-start justify-start gap-[6px] md:gap-[8px]",
        !isMe && isSpecialComponent ? "md:w-[calc(100%-44px)]" : "",
        className
      )}
    >
      {!isMe && !hideAvatar && (
        <Avatar className="h-[28px] w-[28px] md:h-[36px] md:w-[36px] shrink-0">
          <AvatarImage src={aiAvatar} />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}
      {!isMe && hideAvatar && (
        <div className="hidden md:block w-[36px] shrink-0" />
      )}
      
      <div className={cn(
        "flex flex-col min-w-0",
        isMe ? "items-end" : "items-start",
        isSpecialComponent ? "w-full" : "max-w-[90%] md:max-w-[80%]"
      )}>
        {isPersonalInfo ? (
          <>
            <PersonalInfoManager />
            {!isMe &&
            msg.cuiFollowUpPrompts?.length &&
            onDockFollowUpSend ? (
              <DockCuiFollowUpStrip
                prompts={msg.cuiFollowUpPrompts}
                sendTexts={msg.cuiFollowUpSendTexts}
                onSend={onDockFollowUpSend}
                className="mt-[var(--space-200)] w-full max-w-full self-stretch"
              />
            ) : null}
          </>
        ) : isCreateEmailForm ? (
          <>
            <CreateEmailForm 
              isReadonly={msg.isReadonly} 
              initialData={msg.formData}
              onSubmit={(data) => handleEmailFormSubmit?.(msg.id, data)}
            />
            {!isMe &&
            msg.cuiFollowUpPrompts?.length &&
            onDockFollowUpSend ? (
              <DockCuiFollowUpStrip
                prompts={msg.cuiFollowUpPrompts}
                sendTexts={msg.cuiFollowUpSendTexts}
                onSend={onDockFollowUpSend}
                className="mt-[var(--space-200)] w-full max-w-full self-stretch"
              />
            ) : null}
          </>
        ) : isContinueEmail ? (
          <ChatPromptButton onClick={handleContinueCreateEmail}>
            继续创建
          </ChatPromptButton>
        ) : (
          <div className={cn("flex flex-col gap-[var(--space-200)] min-w-0", isMe ? "items-end" : "items-start")}>
            {!isMe && dockSessionOrgDisplayName ? (
              <DockSessionOrgReplyBanner orgDisplayName={dockSessionOrgDisplayName} />
            ) : null}
            {msg.id === 'm3' && (
              <div className="bg-bg border p-[var(--space-300)] rounded-tl-[var(--radius-lg)] rounded-tr-[var(--radius-sm)] rounded-bl-[var(--radius-lg)] rounded-br-[var(--radius-lg)] shadow-elevation-sm flex items-center gap-[var(--space-300)] w-auto">
                <div className="w-[var(--space-900)] h-[var(--space-900)] bg-success rounded-[var(--radius-sm)] text-[var(--color-white)] flex items-center justify-center font-bold text-[length:var(--font-size-lg)]">
                  X
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] text-text truncate">客户的课程内容.xlsx</span>
                  <span className="text-[length:var(--font-size-xs)] text-text-secondary">100 KB</span>
                </div>
              </div>
            )}
            <div 
              className={cn(
                "p-[var(--space-300)_var(--space-350)] text-[length:var(--font-size-base)] leading-normal break-words max-w-full",
                isMe 
                  ? "bg-gradient-to-r from-[#9187FF] to-[#2C98FC] text-[var(--color-white)] rounded-tl-[var(--radius-lg)] rounded-tr-[var(--radius-sm)] rounded-bl-[var(--radius-lg)] rounded-br-[var(--radius-lg)] shadow-elevation-sm self-end"
                  : "bg-bg text-text rounded-tl-[var(--radius-sm)] rounded-tr-[var(--radius-lg)] rounded-bl-[var(--radius-lg)] rounded-br-[var(--radius-lg)] shadow-elevation-sm self-start"
              )}
            >
              {msg.content}
            </div>
            {!isMe &&
            msg.cuiFollowUpPrompts?.length &&
            onDockFollowUpSend ? (
              <DockCuiFollowUpStrip
                prompts={msg.cuiFollowUpPrompts}
                sendTexts={msg.cuiFollowUpSendTexts}
                onSend={onDockFollowUpSend}
                className="mt-[var(--space-200)] w-full max-w-full self-stretch"
              />
            ) : null}
          </div>
        )}
      </div>

      {isMe && !hideAvatar && (
        <Avatar className="h-[28px] w-[28px] md:h-[36px] md:w-[36px] shrink-0">
          <AvatarImage src={userAvatar} />
          <AvatarFallback>{userName[0]}</AvatarFallback>
        </Avatar>
      )}
      {isMe && hideAvatar && (
        <div className="hidden md:block w-[36px] shrink-0" />
      )}
    </div>
  )
}