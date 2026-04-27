import React, { useState } from 'react';
import { type AppItem } from "./FreshUserMainAIChatWindow"
import { AppIcon } from "../components/main-ai/AppIcon"
import { cn } from '../components/ui/utils';
import aiModelIcon from 'figma:asset/f165fadc65db69eb9ce3d5feeb2f6b4dc2638bd6.png';
import educationIcon from 'figma:asset/8449365f45bb140bf269f6769f74387249864ed8.png';
import calendarIcon from 'figma:asset/e653b0a7cada3ea08e52cb29bc4bd546be59d3d5.png';

interface AllAppsDrawerProps {
  apps: AppItem[];
  isOpen: boolean;
  onClose: () => void;
  onReorder: (reorderedApps: AppItem[]) => void;
  onAppClick?: (appId: string) => void;
}

export function AllAppsDrawer({ apps, isOpen, onClose, onReorder, onAppClick }: AllAppsDrawerProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [longPressIndex, setLongPressIndex] = useState<number | null>(null);
  const longPressTimerRef = React.useRef<any>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (longPressIndex !== index) {
      e.preventDefault();
      return;
    }
    // Firefox requires dataTransfer data to be set for drag to work
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', index.toString());
    }
    setDraggedIndex(index);
  };

  const handleDragEnter = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newApps = [...apps];
    const draggedApp = newApps[draggedIndex];
    newApps.splice(draggedIndex, 1);
    newApps.splice(index, 0, draggedApp);
    
    const reorderedApps = newApps.map((app, i) => ({
      ...app,
      order: i + 1,
    }));
    
    onReorder(reorderedApps);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setLongPressIndex(null);
  };

  const startLongPress = (index: number) => {
    longPressTimerRef.current = setTimeout(() => {
      setLongPressIndex(index);
    }, 500);
  };

  const endLongPress = () => {
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
  };

  return (
    <>
      {/* 全屏透明背景，用于点击外部收起 */}
      <div 
        className={cn(
          "fixed inset-0 z-[100] transition-opacity",
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        )}
        onClick={onClose}
      />
      
      {/* Drawer 容器 - 相对于父元素（输入区容器）定位，并与其 padding 对齐 */}
      <div
        className={cn(
          'absolute bottom-full left-[max(20px,var(--cui-padding-max))] right-[max(20px,var(--cui-padding-max))] mb-[var(--space-0)] z-[101] transition-all duration-[350ms] ease-out origin-bottom',
          isOpen ? 'translate-y-0 opacity-100 scale-100 visible' : 'translate-y-4 opacity-0 scale-95 invisible pointer-events-none'
        )}
      >
        <div 
          className="w-full bg-[var(--white-alpha-2)] backdrop-blur-[var(--blur-200)] rounded-[var(--radius-card)] shadow-[var(--shadow-md)] flex flex-col border border-border px-[8px] pt-[14px] pb-[14px]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-[var(--space-400)] px-[var(--space-200)]">
            <div className="flex items-center gap-[var(--space-400)]">
              <span className="text-text font-[var(--font-weight-medium)] text-[length:var(--font-size-base)] leading-normal">
                全部应用
              </span>
              <span className="text-text-muted text-[length:var(--font-size-xs)] leading-normal">
                长按拖拽可调整顺序
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-text-tertiary hover:text-text transition-colors hover:bg-[var(--black-alpha-11)] rounded-sm w-[var(--space-500)] h-[var(--space-500)] flex items-center justify-center shrink-0"
              aria-label="关闭"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M12 4L4 12M4 4L12 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Apps Grid */}
          <div className="flex flex-wrap gap-x-[var(--space-300)] gap-y-[var(--space-300)] px-[var(--space-200)] max-h-[50vh] scrollbar-hide content-start">
            {apps.map((app, index) => (
              <div
                key={app.id}
                draggable={longPressIndex === index}
                onClick={() => onAppClick?.(app.id)}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                }}
                onMouseDown={() => startLongPress(index)}
                onMouseUp={endLongPress}
                onMouseLeave={endLongPress}
                onTouchStart={() => startLongPress(index)}
                onTouchEnd={endLongPress}
                className={cn(
                  'flex flex-col items-center justify-start gap-[var(--space-100)] w-[60px] transition-all duration-300 ease-out rounded-[var(--radius-300)] select-none',
                  longPressIndex === index ? 'cursor-grab active:cursor-grabbing scale-110 shadow-elevation-sm ring-1 ring-primary/10 bg-[var(--black-alpha-11)]' : 'cursor-pointer',
                  draggedIndex === index && 'opacity-20 scale-95'
                )}
              >
                <div className="relative shrink-0 w-[var(--space-900)] h-[var(--space-900)]">
                  <AppIcon
                    imageSrc={app.icon.imageSrc}
                    className="w-full h-full"
                  />
                </div>
                <p className="text-text-secondary text-[length:var(--font-size-xs)] leading-normal text-center w-full h-[var(--space-700)] break-words">
                  {app.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}