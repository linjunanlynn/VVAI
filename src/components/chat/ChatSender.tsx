import * as React from "react"
import { Input } from "../ui/input"
import { AddIcon, AudioIcon, SendIcon } from "./ChatComponents"

interface ChatSenderProps {
  inputValue: string;
  setInputValue: (val: string) => void;
  handleSendMessage: (messageOverride?: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export function ChatSender({
  inputValue,
  setInputValue,
  handleSendMessage,
  handleKeyDown,
  placeholder = "我可以帮您做什么？"
}: ChatSenderProps) {
  return (
    <div className="flex gap-[var(--space-300)] items-center w-full m-[0px]">
      <div className="bg-bg flex-1 flex items-center gap-[var(--space-150)] px-[var(--space-300)] py-[var(--space-250)] rounded-cui-input shadow-xs border border-border">
        <AddIcon />
        <Input 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="border-none shadow-none focus-visible:ring-0 h-auto p-0 text-[length:var(--font-size-base)] placeholder:text-text-muted rounded-none bg-transparent"
        />
        <AudioIcon />
      </div>
      <button 
        onClick={handleSendMessage}
        className="bg-transparent border-none p-0 cursor-pointer hover:opacity-80 transition-opacity focus:outline-none flex-shrink-0"
      >
        <SendIcon />
      </button>
    </div>
  )
}
