import * as React from "react"
import { X } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"
import { Button } from "../ui/button"
import { motion, AnimatePresence } from "motion/react"

interface TaskDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  task?: {
    iconSrc: string;
    title: string;
    time?: string;
    description?: string;
    members?: Array<{
      id: string;
      name: string;
      avatar: string;
    }>;
  };
}

export function TaskDetailDrawer({ isOpen, onClose, task }: TaskDetailDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && task && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[var(--opacity-0)] z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute top-0 right-0 h-full w-full md:w-[400px] bg-bg border-l border-border rounded-xl z-50 shadow-md flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-[var(--space-400)] border-b border-border">
              <h2 className="text-text text-[length:var(--font-size-lg)] font-[var(--font-weight-semi-bold)]">
                待办详情
              </h2>
              <button
                onClick={onClose}
                className="w-[var(--space-800)] h-[var(--space-800)] flex items-center justify-center rounded-[var(--radius-full)] hover:bg-[var(--black-alpha-11)] transition-colors text-text-secondary"
              >
                <X className="w-[18px] h-[18px]" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-[var(--space-400)]">
              {/* Task Card */}
              <div className="bg-bg border border-border rounded-[var(--radius-lg)] p-[var(--space-400)] mb-[var(--space-400)]">
                <div className="flex items-start gap-[var(--space-300)]">
                  <div className="w-[var(--space-1000)] h-[var(--space-1000)] flex items-center justify-center shrink-0">
                    <img src={task.iconSrc} alt={task.title} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-text text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] mb-[var(--space-100)]">
                      {task.title}
                    </h3>
                    {task.time && (
                      <p className="text-text-secondary text-[length:var(--font-size-xs)] mb-[var(--space-200)]">
                        {task.time}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-[var(--space-100)]">
                      <span className="inline-flex items-center px-[var(--space-200)] py-[var(--space-50)] rounded-[var(--radius-sm)] bg-[var(--blue-alpha-11)] text-primary text-[length:var(--font-size-xs)]">
                        待处理
                      </span>
                      <span className="inline-flex items-center px-[var(--space-200)] py-[var(--space-50)] rounded-[var(--radius-sm)] bg-[var(--orange-alpha-11)] text-warning text-[length:var(--font-size-xs)]">
                        优先级高
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-[var(--space-400)]">
                <h4 className="text-text text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] mb-[var(--space-200)]">
                  描述
                </h4>
                <p className="text-text-secondary text-[length:var(--font-size-base)] leading-[var(--line-height-base)]">
                  {task.description || "暂无描述"}
                </p>
              </div>

              {/* Members */}
              {task.members && task.members.length > 0 && (
                <div className="mb-[var(--space-400)]">
                  <h4 className="text-text text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] mb-[var(--space-200)]">
                    相关成员
                  </h4>
                  <div className="flex flex-wrap gap-[var(--space-200)]">
                    {task.members.map((member) => (
                      <div key={member.id} className="flex items-center gap-[var(--space-200)] p-[var(--space-200)] rounded-[var(--radius-md)] hover:bg-[var(--black-alpha-11)] cursor-pointer transition-colors">
                        <Avatar className="w-[var(--space-800)] h-[var(--space-800)]">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-text text-[length:var(--font-size-base)]">
                          {member.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-[var(--space-400)] border-t border-border flex gap-[var(--space-200)]">
              <Button variant="primary" className="flex-1">
                标记完成
              </Button>
              <Button variant="secondary" className="flex-1" onClick={onClose}>
                关闭
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}