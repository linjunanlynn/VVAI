import React from "react";

export interface GenericCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  children?: React.ReactNode;
}

export function GenericCard({ title, children, className = "", ...props }: GenericCardProps) {
  return (
    <div
      className={`bg-bg flex flex-col gap-[var(--space-250)] items-start p-[var(--space-350)] relative rounded-[var(--radius-card)] shadow-elevation-sm w-full ${className}`}
      {...props}
    >
      {/* 卡片头部 */}
      <div className="flex gap-[var(--space-200)] items-center relative shrink-0 w-full">
        <div className="bg-primary h-[var(--space-350)] rounded-full shrink-0 w-[3px]" />
        <h3 className="font-[var(--font-weight-medium)] leading-[22px] text-text text-[length:var(--font-size-md)] whitespace-nowrap m-0">
          {title}
        </h3>
      </div>
      
      {/* 内容容器 (Slot) */}
      <div className="w-full relative shrink-0 flex flex-col">
        {children}
      </div>
    </div>
  );
}
