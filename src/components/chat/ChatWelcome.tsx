import * as React from "react"
import { MAIN_CUI_GUIDE_GREETING } from "../main-ai/mainCuiGuideGreeting"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"

interface ChatWelcomeProps {
  avatarSrc?: string;
  greeting?: string;
}

export function ChatWelcome({ 
  avatarSrc, 
  greeting = MAIN_CUI_GUIDE_GREETING
}: ChatWelcomeProps) {
  return (
    <div className="w-full flex flex-col md:flex-row gap-[var(--space-150)] md:gap-[var(--space-200)]">
      <Avatar className="h-[var(--space-700)] w-[var(--space-700)] md:h-[var(--space-900)] md:w-[var(--space-900)]">
        <AvatarImage src={avatarSrc} className="object-cover"/>
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>
      <div className="bg-bg p-[var(--space-300)_var(--space-350)] rounded-tl-sm rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-elevation-sm w-fit">
        <p className="text-text text-[length:var(--font-size-base)] leading-normal whitespace-pre-line">
          {greeting}
        </p>
      </div>
    </div>
  )
}