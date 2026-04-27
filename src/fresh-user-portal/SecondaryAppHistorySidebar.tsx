import * as React from "react"
import { ScrollArea } from "../components/ui/scroll-area"
import { cn } from "../components/ui/utils"

// Inlined SVG path data for sidebar icons
const svgPaths = {
  p1219bb00: "M8.32552 1.00057C8.29971 0.443622 7.84 0 7.27667 0H1.21L1.16057 0.00114286C0.603622 0.0269525 0.16 0.48667 0.16 1.05V5.71667L0.161143 5.76609C0.186953 6.32304 0.64667 6.76667 1.21 6.76667H7.27667L7.32609 6.76552C7.88304 6.73971 8.32667 6.28 8.32667 5.71667V1.05L8.32552 1.00057ZM5.56732 3.58019C5.71141 3.4885 5.71141 3.27817 5.56732 3.18648L3.6686 1.9782C3.51327 1.87935 3.31 1.99094 3.31 2.17506V4.59161C3.31 4.77573 3.51327 4.88731 3.6686 4.78846L5.56732 3.58019ZM6.81 7.7C7.0033 7.7 7.16 7.8567 7.16 8.05C7.16 8.23193 7.02119 8.38144 6.84371 8.3984L6.81 8.4H1.67667C1.48337 8.4 1.32667 8.2433 1.32667 8.05C1.32667 7.86807 1.46547 7.71856 1.64296 7.7016L1.67667 7.7H6.81Z",
  p292b1b00: "M6.11 0C6.29193 0 6.44144 0.138807 6.4584 0.316293L6.46 0.35V0.7H7.27667C7.84 0.7 8.29971 1.14362 8.32552 1.70057L8.32667 1.75V7.58333C8.32667 8.14666 7.88304 8.60638 7.32609 8.63219L7.27667 8.63333H1.21C0.64667 8.63333 0.186953 8.18971 0.161143 7.63276L0.16 7.58333V1.75C0.16 1.18667 0.603622 0.726952 1.16057 0.701143L1.21 0.7H2.02667V0.35C2.02667 0.1567 2.18337 0 2.37667 0C2.5586 0 2.7081 0.138807 2.72506 0.316293L2.72667 0.35V0.7H5.76V0.35C5.76 0.1567 5.9167 0 6.11 0ZM2.84333 5.71667H2.37667L2.34296 5.71827C2.16547 5.73523 2.02667 5.88474 2.02667 6.06667C2.02667 6.24859 2.16547 6.3981 2.34296 6.41506L2.37667 6.41667H2.84333L2.87704 6.41506C3.05453 6.3981 3.19333 6.24859 3.19333 6.06667C3.19333 5.88474 3.05453 5.73523 2.87704 5.71827L2.84333 5.71667ZM4.47667 5.71667H4.01L3.97629 5.71827C3.79881 5.73523 3.66 5.88474 3.66 6.06667C3.66 6.24859 3.79881 6.3981 3.97629 6.41506L4.01 6.41667H4.47667L4.51037 6.41506C4.68786 6.3981 4.82667 6.24859 4.82667 6.06667C4.82667 5.88474 4.68786 5.73523 4.51037 5.71827L4.47667 5.71667ZM2.84333 4.31667H2.37667L2.34296 4.31827C2.16547 4.33523 2.02667 4.48474 2.02667 4.66667C2.02667 4.8486 2.16547 4.9981 2.34296 5.01506L2.37667 5.01667H2.84333L2.87704 5.01506C3.05453 4.9981 3.19333 4.8486 3.19333 4.66667C3.19333 4.48474 3.05453 4.33523 2.87704 4.31827L2.84333 4.31667ZM4.47667 4.31667H4.01L3.97629 4.31827C3.79881 4.33523 3.66 4.48474 3.66 4.66667C3.66 4.8486 3.79881 4.9981 3.97629 5.01506L4.01 5.01667H4.47667L4.51037 5.01506C4.68786 4.9981 4.82667 4.8486 4.82667 4.66667C4.82667 4.48474 4.68786 4.33523 4.51037 4.31827L4.47667 4.31667ZM6.11 4.31667H5.64333L5.60963 4.31827C5.43214 4.33523 5.29333 4.48474 5.29333 4.66667C5.29333 4.8486 5.43214 4.9981 5.60963 5.01506L5.64333 5.01667H6.11L6.14371 5.01506C6.32119 4.9981 6.46 4.8486 6.46 4.66667C6.46 4.48474 6.32119 4.33523 6.14371 4.31827L6.11 4.31667ZM2.84333 2.91667H2.37667L2.34296 2.91827C2.16547 2.93523 2.02667 3.08474 2.02667 3.26667C2.02667 3.4486 2.16547 3.5981 2.34296 3.61506L2.37667 3.61667H2.84333L2.87704 3.61506C3.05453 3.5981 3.19333 3.4486 3.19333 3.26667C3.19333 3.08474 3.05453 2.93523 2.87704 2.91827L2.84333 2.91667ZM4.47667 2.91667H4.01L3.97629 2.91827C3.79881 2.93523 3.66 3.08474 3.66 3.26667C3.66 3.4486 3.79881 3.5981 3.97629 3.61506L4.01 3.61667H4.47667L4.51037 3.61506C4.68786 3.5981 4.82667 3.4486 4.82667 3.26667C4.82667 3.08474 4.68786 2.93523 4.51037 2.91827L4.47667 2.91667ZM6.11 2.91667H5.64333L5.60963 2.91827C5.43214 2.93523 5.29333 3.08474 5.29333 3.26667C5.29333 3.4486 5.43214 3.5981 5.60963 3.61506L5.64333 3.61667H6.11L6.14371 3.61506C6.32119 3.5981 6.46 3.4486 6.46 3.26667C6.46 3.08474 6.32119 2.93523 6.14371 2.91827L6.11 2.91667Z",
  p809d300: "M5.26308 0C6.7139 0 7.9021 1.10275 8.00383 2.50025C6.96534 2.75507 6.19915 3.64406 6.19915 4.70157C6.19915 5.54445 6.68588 6.28027 7.40909 6.67333L2.25357 6.6732L2.25341 6.66948C1.08588 6.60297 0.16 5.65332 0.16 4.49158C0.16 3.2867 1.15591 2.30995 2.38442 2.30995C2.43756 2.30995 2.49026 2.31178 2.54246 2.31538C2.73028 1.00683 3.8768 0 5.26308 0ZM8.61492 2.91195C9.61552 2.91195 10.4267 3.72677 10.4267 4.73191C10.4267 5.73705 9.61552 6.55187 8.61492 6.55187C7.61432 6.55187 6.80318 5.73705 6.80318 4.73191C6.80318 3.72677 7.61432 2.91195 8.61492 2.91195ZM8.72366 3.55651C8.71399 3.55651 8.69708 3.56398 8.68379 3.57331L8.67211 3.58305L7.98902 4.37929L7.9752 4.41029C7.96995 4.42494 7.9684 4.43768 7.97613 4.44564C7.98644 4.46687 8.005 4.47961 8.02521 4.48386L8.04057 4.48545H8.44011C8.44011 4.94992 8.38856 5.30823 7.96324 5.5471C7.93747 5.56037 7.92458 5.58691 7.92458 5.60018C7.92458 5.61345 7.92458 5.62672 7.93747 5.63999C7.95036 5.66653 7.97613 5.6798 8.00191 5.6798L8.02623 5.67552L8.0607 5.66732L8.10758 5.6542L8.16497 5.63561C8.1753 5.63202 8.186 5.62818 8.19701 5.62408L8.26661 5.59622C8.35154 5.55982 8.44826 5.50938 8.54322 5.44093C8.69788 5.33477 8.82677 5.20206 8.92987 5.05608C9.02153 4.90274 9.08263 4.7389 9.10413 4.55526L9.11031 4.48545H9.44541C9.47119 4.48545 9.49697 4.47218 9.50985 4.44564C9.50985 4.42573 9.50985 4.40583 9.50442 4.39152L9.49697 4.37929L8.77521 3.58305L8.7446 3.5648C8.73655 3.55983 8.7301 3.55651 8.72366 3.55651Z",
  p9207300: "M0.417967 3.05215C0.0740109 2.88017 0.0740111 2.38933 0.417967 2.21735L4.55707 0.147802C4.95121 -0.0492674 5.41513 -0.0492672 5.80927 0.147802L9.94837 2.21735C10.2923 2.38933 10.2923 2.88017 9.94837 3.05215L5.70492 5.17388C5.37647 5.3381 4.98987 5.3381 4.66142 5.17388L0.417967 3.05215Z",
  pc99a400: "M9.66315 4.03474C9.46985 4.03474 9.31315 4.19144 9.31315 4.38474V5.78474C9.31315 5.97804 9.46985 6.13474 9.66315 6.13474C9.85645 6.13474 10.0131 5.97804 10.0131 5.78474V4.38474C10.0131 4.19144 9.85645 4.03474 9.66315 4.03474Z",
  pe0e7c30: "M9.49333 1.97337V6.53333C9.49333 7.0488 9.07547 7.46667 8.56 7.46667H1.09333C0.577867 7.46667 0.16 7.0488 0.16 6.53333V1.97337C0.16 2.04248 0.190588 2.10748 0.242595 2.15149L0.266169 2.16901L3.93652 4.55474C4.45914 4.89444 5.1276 4.90615 5.66027 4.58988L5.71681 4.55474L9.38716 2.16901C9.4451 2.13135 9.48293 2.07028 9.49149 2.00269L9.49333 1.97337ZM8.67667 0C9.1277 0 9.49333 0.365634 9.49333 0.816667V1.50671C9.49333 1.58568 9.45338 1.6593 9.38716 1.70234L5.58965 4.17073C5.12569 4.4723 4.52764 4.4723 4.06368 4.17073L0.266169 1.70234C0.199951 1.6593 0.16 1.58568 0.16 1.50671V0.816667C0.16 0.365634 0.525634 0 0.976667 0H8.67667Z",
  pf699780: "M7.27667 0C7.67965 0 8.02961 0.227015 8.20563 0.560135L8.19407 0.570966L3.89847 4.9287L2.66948 3.05161L2.64968 3.02429C2.53827 2.88509 2.33715 2.85086 2.18494 2.95052C2.03274 3.05017 1.98369 3.2482 2.06673 3.40598L2.08385 3.43506L3.55052 5.67506L3.57095 5.70319C3.69296 5.85501 3.91747 5.87736 4.06702 5.75258L4.09259 5.72903L8.32667 1.4336V7.11667C8.32667 7.68 7.88304 8.13971 7.32609 8.16552L7.27667 8.16667H1.21C0.64667 8.16667 0.186953 7.72304 0.161143 7.16609L0.16 7.11667V1.05C0.16 0.48667 0.603622 0.0269525 1.16057 0.00114286L1.21 0H7.27667Z",
  pfec6900: "M1.68316 4.38474V6.83474C1.68316 7.99454 3.25016 8.93474 5.18316 8.93474C7.11616 8.93474 8.68316 7.99454 8.68316 6.83474V4.38474L5.70491 5.87387C5.37646 6.03809 4.98986 6.03809 4.66141 5.87387L1.68316 4.38474Z",
}

// Secondary app session types
export interface SecondaryAppSession {
  id: string
  appName: string
  appIconKey: string
  timestamp: Date
  hasUncompletedAction?: boolean // 是否有未完成的操作（显示橙色点）
}

interface SecondaryAppHistorySidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sessions: SecondaryAppSession[]
  selectedId?: string
  onSelect: (id: string) => void
  onNewConversation: () => void
  mode?: 'overlay' | 'push'
}

// Icon component for different app types based on Figma design
function AppIconSvg({ iconKey }: { iconKey: string }) {
  const iconSize = { width: 16, height: 16 }
  
  switch (iconKey) {
    case 'education':
      return (
        <svg width={iconSize.width} height={iconSize.height} viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="8" fill="#5590F6" />
          <path d={svgPaths.p809d300} fill="white" transform="translate(3, 4)" />
        </svg>
      )
    case 'calendar':
      return (
        <svg width={iconSize.width} height={iconSize.height} viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="8" fill="#52C55A" />
          <path d={svgPaths.p292b1b00} fill="white" transform="translate(3.5, 3.5)" />
        </svg>
      )
    case 'meeting':
      return (
        <svg width={iconSize.width} height={iconSize.height} viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="8" fill="#8B7AEE" />
          <path d={svgPaths.p1219bb00} fill="white" transform="translate(4, 4.5)" />
        </svg>
      )
    case 'todo':
      return (
        <svg width={iconSize.width} height={iconSize.height} viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="8" fill="#5590F6" />
          <path d={svgPaths.pf699780} fill="white" transform="translate(3.5, 4)" />
        </svg>
      )
    case 'disk':
      return (
        <svg width={iconSize.width} height={iconSize.height} viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="8" fill="#FFA940" />
          <path d={svgPaths.p9207300} fill="white" transform="translate(3, 5.5)" />
          <path d={svgPaths.pfec6900} fill="white" transform="translate(3.2, 7.5)" />
          <path d={svgPaths.pc99a400} fill="white" transform="translate(3.2, 7.5)" />
        </svg>
      )
    case 'mail':
      return (
        <svg width={iconSize.width} height={iconSize.height} viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="8" fill="#FF6868" />
          <path d={svgPaths.pe0e7c30} fill="white" transform="translate(4, 4.2)" />
        </svg>
      )
    default:
      return (
        <svg width={iconSize.width} height={iconSize.height} viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="8" fill="var(--gray-6)" />
        </svg>
      )
  }
}

// Group sessions by time period
function groupSessionsByTime(sessions: SecondaryAppSession[]) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  const groups = {
    today: [] as SecondaryAppSession[],
    within7Days: [] as SecondaryAppSession[],
    earlier: [] as SecondaryAppSession[]
  }
  
  sessions.forEach(session => {
    const sessionDate = new Date(session.timestamp)
    const sessionDay = new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate())
    
    if (sessionDay.getTime() >= today.getTime()) {
      groups.today.push(session)
    } else if (sessionDay.getTime() >= sevenDaysAgo.getTime()) {
      groups.within7Days.push(session)
    } else {
      groups.earlier.push(session)
    }
  })
  
  return groups
}

export function SecondaryAppHistorySidebar({ 
  open, 
  onOpenChange, 
  sessions, 
  selectedId = "",
  onSelect,
  onNewConversation,
  mode = 'overlay'
}: SecondaryAppHistorySidebarProps) {
  const groupedSessions = groupSessionsByTime(sessions)
  const hasInteractedRef = React.useRef(false)
  const prevOpen = React.useRef(open)
  const prevMode = React.useRef(mode)
  
  if (prevMode.current !== mode) {
    hasInteractedRef.current = false
    prevMode.current = mode
  }
  
  if (prevOpen.current !== open) {
    hasInteractedRef.current = true
    prevOpen.current = open
  }
  
  const shouldAnimate = hasInteractedRef.current

  return (
    <>
      {/* Backdrop */}
      {open && mode === 'overlay' && (
        <div 
          className="absolute inset-0 z-40 bg-[var(--black-alpha-4)] backdrop-blur-[2px] transition-opacity"
          onClick={() => onOpenChange(false)}
        />
      )}
      
      {/* Sidebar Panel */}
      <div 
        className={cn(
          "absolute top-0 left-0 bottom-0 w-[200px] bg-cui-bg z-50 flex flex-col border-r border-border overflow-hidden",
          mode === 'push' ? "md:static md:h-full md:rounded-none md:border-r md:z-0 shrink-0" : "",
          shouldAnimate && "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          open 
            ? cn("translate-x-0 shadow-none", mode === 'push' && "md:shadow-none")
            : cn("-translate-x-full shadow-none", mode === 'push' && "md:-ml-[200px] md:translate-x-0")
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between pl-[var(--space-400)] pr-[var(--space-300)] py-[var(--space-300)] shrink-0">
          <h2 className="text-[length:var(--font-size-md)] font-[var(--font-weight-medium)] leading-normal text-text m-0">
            最近使用
          </h2>
          
        </div>

        {/* New Conversation Button */}
        
        
        {/* Sessions List */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="flex flex-col pb-[var(--space-500)] w-full overflow-hidden px-[var(--space-300)] gap-[var(--space-200)]">
            
            {/* Today Section */}
            {groupedSessions.today.length > 0 && (
              <div className="flex flex-col gap-[var(--space-150)] w-full">
                <div className="px-[var(--space-200)] pt-[var(--space-200)] pb-[0px]">
                  <span className="text-[length:var(--font-size-xs)] text-text-secondary leading-normal font-[var(--font-weight-regular)]">
                    今日
                  </span>
                </div>
                {groupedSessions.today.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => {
                      onSelect(session.id)
                      if (mode === 'overlay') {
                        onOpenChange(false)
                      }
                    }}
                    className={cn(
                      "flex items-center gap-[var(--space-200)] w-full text-left px-[var(--space-200)] py-[var(--space-200)] transition-colors border-none cursor-pointer rounded-[var(--radius-md)] relative",
                      "hover:bg-[var(--black-alpha-11)]",
                      selectedId === session.id 
                        ? "bg-[var(--blue-alpha-12)]" 
                        : "bg-transparent"
                    )}
                  >
                    <AppIconSvg iconKey={session.appIconKey} />
                    <span className={cn(
                      "text-[length:var(--font-size-base)] leading-normal truncate block flex-1 font-[var(--font-weight-regular)]",
                      selectedId === session.id ? "text-primary" : "text-text"
                    )}>
                      {session.appName}
                    </span>
                    {session.hasUncompletedAction && (
                      <div className="w-[var(--space-150)] h-[var(--space-150)] rounded-full bg-[var(--orange-6)] shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Within 7 Days Section */}
            {groupedSessions.within7Days.length > 0 && (
              <div className="flex flex-col gap-[var(--space-150)] w-full">
                <div className="px-[var(--space-200)] pt-[var(--space-300)] pb-[0px]">
                  <span className="text-[length:var(--font-size-xs)] text-text-secondary leading-normal font-[var(--font-weight-regular)]">
                    7 天内
                  </span>
                </div>
                {groupedSessions.within7Days.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => {
                      onSelect(session.id)
                      if (mode === 'overlay') {
                        onOpenChange(false)
                      }
                    }}
                    className={cn(
                      "flex items-center gap-[var(--space-200)] w-full text-left px-[var(--space-200)] py-[var(--space-200)] transition-colors border-none cursor-pointer rounded-[var(--radius-md)] relative",
                      "hover:bg-[var(--black-alpha-11)]",
                      selectedId === session.id 
                        ? "bg-[var(--blue-alpha-12)]" 
                        : "bg-transparent"
                    )}
                  >
                    <AppIconSvg iconKey={session.appIconKey} />
                    <span className={cn(
                      "text-[length:var(--font-size-base)] leading-normal truncate block flex-1 font-[var(--font-weight-regular)]",
                      selectedId === session.id ? "text-primary" : "text-text"
                    )}>
                      {session.appName}
                    </span>
                    {session.hasUncompletedAction && (
                      <div className="w-[var(--space-150)] h-[var(--space-150)] rounded-full bg-[var(--orange-6)] shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Earlier Section */}
            {groupedSessions.earlier.length > 0 && (
              <div className="flex flex-col gap-[var(--space-150)] w-full">
                <div className="pt-[var(--space-300)] pb-[var(--space-100)] px-[var(--space-200)]">
                  <span className="text-[length:var(--font-size-xs)] text-text-secondary leading-normal font-[var(--font-weight-regular)]">
                    更早
                  </span>
                </div>
                {groupedSessions.earlier.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => {
                      onSelect(session.id)
                      if (mode === 'overlay') {
                        onOpenChange(false)
                      }
                    }}
                    className={cn(
                      "flex items-center gap-[var(--space-200)] w-full text-left px-[var(--space-200)] py-[var(--space-200)] transition-colors border-none cursor-pointer rounded-[var(--radius-md)] relative",
                      "hover:bg-[var(--black-alpha-11)]",
                      selectedId === session.id 
                        ? "bg-[var(--blue-alpha-12)]" 
                        : "bg-transparent"
                    )}
                  >
                    <AppIconSvg iconKey={session.appIconKey} />
                    <span className={cn(
                      "text-[length:var(--font-size-base)] leading-normal truncate block flex-1 font-[var(--font-weight-regular)]",
                      selectedId === session.id ? "text-primary" : "text-text"
                    )}>
                      {session.appName}
                    </span>
                    {session.hasUncompletedAction && (
                      <div className="w-[var(--space-150)] h-[var(--space-150)] rounded-full bg-[var(--orange-6)] shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  )
}