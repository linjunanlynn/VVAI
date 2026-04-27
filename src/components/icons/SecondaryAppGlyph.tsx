import { cn } from "../ui/utils"
import { ImageWithFallback } from "../figma/ImageWithFallback"
import svgPaths from "../../imports/AiSidebar-3/svg-ukza2m8d43"
import documentAppIcon from "figma:asset/ac6e3391c1eb88804cbf0804668d449463a1e1a3.png"
import scheduleOverviewIcon from "figma:asset/e653b0a7cada3ea08e52cb29bc4bd546be59d3d5.png"

export type SecondaryAppGlyphKey =
  | "vvai"
  | "education"
  | "schedule"
  | "calendar"
  | "meeting"
  | "todo"
  | "disk"
  | "mail"
  | "document"

/** 与侧栏历史一致；文档为设计稿 PNG，其余多为 AiSidebar 矢量 */
export function SecondaryAppGlyph({
  iconKey,
  className,
}: {
  iconKey: SecondaryAppGlyphKey | string
  className?: string
}) {
  const svgClass = cn("block shrink-0 size-4", className)

  switch (iconKey) {
    case "vvai":
      return (
        <div
          className={cn(
            "flex shrink-0 size-9 items-center justify-center rounded-full bg-gradient-to-br from-[#9187FF] to-[#2C98FC] shadow-sm",
            className
          )}
          aria-hidden
        >
          <svg className="size-[22px] text-white" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="10" r="4" fill="currentColor" fillOpacity="0.95" />
            <path
              d="M7 18c1.2-2 3.2-3 5-3s3.8 1 5 3"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
      )
    case "education":
      return (
        <svg className={svgClass} viewBox="0 0 16 16" fill="none" aria-hidden>
          <circle cx="8" cy="8" r="8" fill="#5590F6" />
          <path d={svgPaths.p809d300} fill="white" transform="translate(3, 4)" />
        </svg>
      )
    case "schedule":
      return (
        <ImageWithFallback
          src={scheduleOverviewIcon}
          alt=""
          className={cn("block shrink-0 size-4 object-contain rounded-[6px]", className)}
          aria-hidden
        />
      )
    case "calendar":
      return (
        <svg className={svgClass} viewBox="0 0 16 16" fill="none" aria-hidden>
          <circle cx="8" cy="8" r="8" fill="#52C55A" />
          <path d={svgPaths.p292b1b00} fill="white" transform="translate(3.5, 3.5)" />
        </svg>
      )
    case "meeting":
      return (
        <svg className={svgClass} viewBox="0 0 16 16" fill="none" aria-hidden>
          <circle cx="8" cy="8" r="8" fill="#8B7AEE" />
          <path d={svgPaths.p1219bb00} fill="white" transform="translate(4, 4.5)" />
        </svg>
      )
    case "todo":
      return (
        <svg className={svgClass} viewBox="0 0 16 16" fill="none" aria-hidden>
          <circle cx="8" cy="8" r="8" fill="#5590F6" />
          <path d={svgPaths.pf699780} fill="white" transform="translate(3.5, 4)" />
        </svg>
      )
    case "disk":
      return (
        <svg className={svgClass} viewBox="0 0 16 16" fill="none" aria-hidden>
          <circle cx="8" cy="8" r="8" fill="#FFA940" />
          <path d={svgPaths.p9207300} fill="white" transform="translate(3, 5.5)" />
          <path d={svgPaths.pfec6900} fill="white" transform="translate(3.2, 7.5)" />
          <path d={svgPaths.pc99a400} fill="white" transform="translate(3.2, 7.5)" />
        </svg>
      )
    case "mail":
      return (
        <svg className={svgClass} viewBox="0 0 16 16" fill="none" aria-hidden>
          <circle cx="8" cy="8" r="8" fill="#FF6868" />
          <path d={svgPaths.pe0e7c30} fill="white" transform="translate(4, 4.2)" />
        </svg>
      )
    case "document":
      return (
        <ImageWithFallback
          src={documentAppIcon}
          alt=""
          className={cn("block shrink-0 size-4 object-cover rounded-[var(--radius-sm)]", className)}
          aria-hidden
        />
      )
    default:
      return (
        <svg className={svgClass} viewBox="0 0 16 16" fill="none" aria-hidden>
          <circle cx="8" cy="8" r="8" fill="var(--gray-6)" />
        </svg>
      )
  }
}
