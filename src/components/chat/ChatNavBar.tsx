import * as React from "react"
import { VvAiLogo } from "./ChatComponents"
import { SidebarIcon } from "./SidebarIcons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu"
import { Switch } from "../ui/switch"
import {
  AppWindow,
  Check,
  GripVertical,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  History,
  SquarePen,
  MessageSquarePlus,
} from "lucide-react"
import { NewSessionBubblePlusIcon } from "./NewSessionBubblePlusIcon"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from "../ui/utils"

/** 顶栏内可点击控件统一高度，与历史、独立窗口等图标按钮对齐 */
const BAR_CONTROL_H = "h-[var(--space-800)]"

import orgIcon from 'figma:asset/58a97c06b4ae6edfc613d20add2fb4ead0363c64.png';

const AvatarPlaceholder = () => (
  <div className="w-[20px] h-[20px] rounded-[4px] overflow-hidden flex items-center justify-center shrink-0">
    <img src={orgIcon} alt="Organization Icon" className="w-full h-full object-cover" />
  </div>
)

const SmallChevronDownIcon = () => (
  <div className="flex items-center justify-center shrink-0 w-[12px] h-[12px]">
    <ChevronDown className="w-[12px] h-[12px] text-text-tertiary" strokeWidth={2} />
  </div>
)

type ModelItem = { id: string; name: string; description?: string; isRecommended?: boolean }

function ModelPickerDropdown({
  trigger,
  groupedModels,
  deepThinkStates,
  setDeepThinkStates,
  currentModel,
  onModelSelect,
  contentAlign = "center",
}: {
  trigger: React.ReactNode
  groupedModels: Record<string, ModelItem[]>
  deepThinkStates: Record<string, boolean>
  setDeepThinkStates: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  currentModel?: string
  onModelSelect?: (modelId: string) => void
  contentAlign?: "start" | "center" | "end"
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={contentAlign} className="w-[320px] max-h-[500px] overflow-y-auto">
        <div className="px-[var(--space-200)] py-[var(--space-150)]">
          <p className="text-[length:var(--font-size-xs)] text-text-tertiary font-[var(--font-weight-medium)]">选择模型版本</p>
        </div>
        <DropdownMenuSeparator />
        {Object.entries(groupedModels).map(([family, groupModels], index, array) => (
          <div key={family}>
            {family !== '默认' && (
              <div className="px-[var(--space-300)] py-[var(--space-150)] mt-[var(--space-50)]">
                <p className="text-[length:var(--font-size-xs)] text-text-tertiary font-[var(--font-weight-medium)]">{family}</p>
              </div>
            )}
            {groupModels.map((model) => {
              const isSelected = model.id === currentModel
              return (
              <DropdownMenuItem
                key={model.id}
                aria-selected={isSelected}
                onSelect={(e) => {
                  if ((e.target as HTMLElement).closest('.deep-think-toggle')) {
                    e.preventDefault();
                    return;
                  }
                  onModelSelect?.(model.id);
                }}
                className={cn(
                  "group flex cursor-pointer items-start gap-[var(--space-200)] rounded-[var(--radius-md)] border-l-[2px] py-[var(--space-200)] pr-[var(--space-300)] pl-[calc(var(--space-300)-2px)]",
                  isSelected
                    ? "border-l-primary/40 bg-[var(--black-alpha-10)] hover:bg-[var(--black-alpha-11)] focus:bg-[var(--black-alpha-11)] data-[highlighted]:bg-[var(--black-alpha-11)]"
                    : "border-l-transparent hover:bg-[var(--black-alpha-11)] focus:bg-[var(--black-alpha-11)] data-[highlighted]:bg-[var(--black-alpha-11)]"
                )}
              >
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <div className="mb-[2px] flex min-h-[22px] items-center justify-between gap-[var(--space-150)]">
                    <div className="flex min-w-0 items-center gap-[var(--space-150)]">
                      <p
                        className={cn(
                          "truncate text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text",
                          isSelected && "font-[var(--font-weight-semibold)]"
                        )}
                      >
                        {model.name}
                      </p>
                      {model.isRecommended && (
                        <span className="shrink-0 rounded-[var(--radius-sm)] bg-[var(--black-alpha-10)] px-[var(--space-150)] py-[2px] text-[length:var(--font-size-xxs)] font-[var(--font-weight-medium)] text-text-secondary">
                          推荐
                        </span>
                      )}
                    </div>
                    {isSelected ? (
                      <Check
                        className="size-[15px] shrink-0 text-primary/45"
                        strokeWidth={2}
                        aria-hidden
                      />
                    ) : null}
                  </div>
                  {model.description && (
                    <p className="text-[length:var(--font-size-xs)] text-text-tertiary group-hover:text-text-secondary transition-colors leading-[var(--line-height-sm)] mt-[2px] whitespace-normal pr-[var(--space-400)] mb-[var(--space-150)]">{model.description}</p>
                  )}
                  <div
                    className="deep-think-toggle flex items-center gap-[var(--space-150)] mt-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Switch
                      checked={deepThinkStates[model.id] || false}
                      onCheckedChange={(checked) => setDeepThinkStates(prev => ({ ...prev, [model.id]: checked }))}
                      className="scale-75 origin-left shadow-elevation-sm"
                    />
                    <span className="text-[length:var(--font-size-xs)] text-text-secondary font-[var(--font-weight-medium)]">深度思考</span>
                  </div>
                </div>
              </DropdownMenuItem>
              )
            })}
            {index < array.length - 1 && <DropdownMenuSeparator className="my-[var(--space-100)]" />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface ChatNavBarProps {
  title?: string;
  onToggleHistory?: () => void;
  onClose?: () => void;
  onBack?: () => void;
  onNewMessage?: () => void;
  showClose?: boolean;
  /** @deprecated 中心区域在传入 organizations 与 onOrgSelect 时即显示公司主体切换，无需再传 */
  showOrgSelect?: boolean;
  currentOrg?: string;
  onOrgClick?: () => void;
  organizations?: Array<{ id: string; name: string; icon?: string; memberCount?: number; description?: string }>;
  onOrgSelect?: (orgId: string) => void;
  onCreateOrg?: () => void;
  onJoinOrg?: () => void;
  /** 组织列表下方「创建机构教育空间」；未传时沿用 onCreateOrg */
  onCreateInstitutionEducationSpace?: () => void;
  /** 组织列表下方「创建家庭教育空间」；未传时沿用 onCreateOrg */
  onCreateFamilyEducationSpace?: () => void;
  /** 为 true 时左侧为模型下拉入口；第二行展示当前模型名 */
  showModelSelect?: boolean;
  currentModel?: string;
  models?: Array<{ id: string; name: string; description?: string; isRecommended?: boolean }>;
  onModelSelect?: (modelId: string) => void;
  showIndependentWindow?: boolean;
  onIndependentWindow?: () => void;
  /** 无组织场景下，在顶部右侧展示常驻引导入口 */
  showNoOrgQuickEntry?: boolean;
  noOrgEntryTitle?: string;
  noOrgEntrySubtitle?: string;
  onQuickCreateOrg?: () => void;
  onQuickJoinOrg?: () => void;
  /** 《主CUI交互》顶栏：左区 VVAI/模型；中区《组织状态》居中；右区无组织入口等 */
  navGridAlign?: boolean;
  /** 中区完全自定义（如教育应用《空间状态栏》）；传入时优先于组织切换与无组织速入口 */
  navCenterSlot?: React.ReactNode;
  /** 为 true 时不在顶栏展示组织切换/无组织入口（改由会话列表承担，一般不再使用） */
  orgSwitcherInSessionList?: boolean;
  /** 为 true 时强制隐藏中区主体切换 */
  suppressOrganizationSwitcher?: boolean;
  /** 栅格顶栏：VVAI 左侧展示会话列表收展（场景五等） */
  showSessionListToggle?: boolean;
  sessionListOpen?: boolean;
  onSessionListToggle?: () => void;
  /** 教育/医院门户：右侧「应用内历史」收展（与左侧主历史会话分列；与 dock 应用顶栏同一栅格右区） */
  onPortalDockHistoryToggle?: () => void;
  portalDockHistoryOpen?: boolean;
  /**
   * session：顶栏选组织即切换组织型应用所绑定的行政主体；
   * content-scope：主 VVAI / 个人应用顶栏选组织仅筛选对话内信息，不切换会话主体。
   */
  organizationSwitcherMode?: "session" | "content-scope"
  /** @deprecated 保留兼容；当前不再展示「全部组织」入口 */
  contentScopeAllOrganizationsId?: string
  /** 仅主 VVAI 顶栏右侧：历史（可选）、开启新会话、独立窗口（可选） */
  mainCuiToolbarActions?: {
    onHistory?: () => void;
    onNewThread: () => void;
    /** 与「开启新会话」并列：打开同步独立窗口（仅主框架页展示） */
    onIndependentWindow?: () => void;
    newThreadTitle?: string;
    newThreadAriaLabel?: string;
    independentWindowTitle?: string;
    independentWindowAriaLabel?: string;
    /** 开启新会话按钮图标：`message-plus` 默认；`design-bubble-plus` 气泡加号；`square-pen` 方笔 */
    newThreadIconVariant?: "square-pen" | "design-bubble-plus" | "message-plus";
  } | null;
}

export function ChatNavBar({
  title = "Title",
  onToggleHistory,
  onClose,
  onBack,
  onNewMessage,
  showClose = false,
  currentOrg = "xiaoce",
  onOrgClick,
  organizations = [],
  onOrgSelect,
  onCreateOrg,
  onJoinOrg,
  onCreateInstitutionEducationSpace: _onCreateInstitutionEducationSpace,
  onCreateFamilyEducationSpace: _onCreateFamilyEducationSpace,
  showModelSelect = false,
  currentModel = "gpt-4",
  models = [],
  onModelSelect,
  showIndependentWindow = false,
  onIndependentWindow,
  showNoOrgQuickEntry = false,
  noOrgEntryTitle = "创建/加入组织",
  noOrgEntrySubtitle = "加入组织后，可与团队协同使用 AI",
  onQuickCreateOrg,
  onQuickJoinOrg,
  navGridAlign = false,
  navCenterSlot = null,
  orgSwitcherInSessionList = false,
  suppressOrganizationSwitcher = false,
  showSessionListToggle = false,
  sessionListOpen = false,
  onSessionListToggle,
  onPortalDockHistoryToggle,
  portalDockHistoryOpen = false,
  mainCuiToolbarActions = null,
  organizationSwitcherMode = "session",
  contentScopeAllOrganizationsId: _contentScopeAllOrganizationsId,
}: ChatNavBarProps) {
  const isContentScopeMode = organizationSwitcherMode === "content-scope"
  const currentOrgData = organizations.find((o) => o.id === currentOrg)
  const currentModelData = models.find(m => m.id === currentModel);

  const groupedModels = models.reduce((acc, model) => {
    const family = '默认';
    if (!acc[family]) {
      acc[family] = [];
    }
    acc[family].push(model);
    return acc;
  }, {} as Record<string, typeof models>);

  const [deepThinkStates, setDeepThinkStates] = React.useState<Record<string, boolean>>({});
  const [noOrgPopoverOpen, setNoOrgPopoverOpen] = React.useState(false);

  const showCenterCompanySwitcher =
    !suppressOrganizationSwitcher &&
    !orgSwitcherInSessionList &&
    organizations.length > 0 &&
    !!onOrgSelect;
  const showLeftModelPicker = showModelSelect && models.length > 0 && !!onModelSelect;

  /**
   * 栅格顶栏且带「展开侧栏」时：收展按钮与品牌区同列，内层 min-w-0 易把整块工具条挤没导致 VVAI 标不可见。
   * 将 VVAI 渐变字固定在收展按钮与模型之间，并从内嵌工具条里去掉重复 Logo。
   */
  const gridNavInsertLeadingVvAiLogo =
    showSessionListToggle && onSessionListToggle != null && showLeftModelPicker
  const hideEmbedVvAiLogoInGridToolbar = gridNavInsertLeadingVvAiLogo

  /** 非栅格顶栏：Logo+Agent 静态区；仅「模型名称 + 下拉」为热区 */
  const brandBlockStacked = showLeftModelPicker ? (
    <div className="flex flex-col items-start gap-[3px] py-[2px] -ml-[var(--space-100)]">
      <div className="flex min-w-0 max-w-[min(200px,42vw)] items-center gap-[6px] px-[var(--space-100)]">
        <VvAiLogo />
      </div>
      <ModelPickerDropdown
        groupedModels={groupedModels}
        deepThinkStates={deepThinkStates}
        setDeepThinkStates={setDeepThinkStates}
        currentModel={currentModel}
        onModelSelect={onModelSelect}
        contentAlign="start"
        trigger={
          <button
            type="button"
            className="inline-flex max-w-[min(200px,42vw)] items-center gap-[4px] rounded-[var(--radius-md)] border border-transparent px-[var(--space-100)] py-[2px] text-left transition-colors hover:border-border hover:bg-[var(--black-alpha-11)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="选择模型版本"
          >
            <span className="min-w-0 truncate text-[length:var(--font-size-xxs)] leading-[14px] text-text-tertiary font-[var(--font-weight-regular)]">
              {currentModelData?.name ?? "选择模型"}
            </span>
            <SmallChevronDownIcon />
          </button>
        }
      />
    </div>
  ) : (
    <div className="flex min-w-0 max-w-[min(200px,46vw)] items-center gap-[var(--space-150)]">
      <VvAiLogo />
    </div>
  )

  /** 栅格顶栏：Logo+Agent 与模型下拉分区，仅模型名为下拉热区 */
  const brandBlockGridToolbar = showLeftModelPicker ? (
    <div
      className={cn(
        BAR_CONTROL_H,
        "inline-flex max-w-[min(100%,360px)] min-w-0 items-center gap-[var(--space-150)] rounded-[var(--radius-md)] border border-transparent px-[var(--space-100)] text-text"
      )}
    >
      {!hideEmbedVvAiLogoInGridToolbar ? (
        <span className="flex shrink-0 items-center">
          <VvAiLogo />
        </span>
      ) : null}
      <ModelPickerDropdown
        groupedModels={groupedModels}
        deepThinkStates={deepThinkStates}
        setDeepThinkStates={setDeepThinkStates}
        currentModel={currentModel}
        onModelSelect={onModelSelect}
        contentAlign="start"
        trigger={
          <button
            type="button"
            className="inline-flex max-w-[min(160px,38vw)] min-w-0 shrink-0 items-center gap-[4px] rounded-[var(--radius-md)] border border-transparent px-[var(--space-100)] py-[2px] text-left transition-colors hover:border-border hover:bg-[var(--black-alpha-11)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="选择模型版本"
          >
            <span className="min-w-0 truncate text-[length:var(--font-size-xs)] leading-none text-text-tertiary">
              {currentModelData?.name ?? "选择模型"}
            </span>
            <SmallChevronDownIcon />
          </button>
        }
      />
    </div>
  ) : (
    <div className={cn(BAR_CONTROL_H, "inline-flex min-w-0 max-w-full items-center gap-[var(--space-150)] px-[var(--space-100)]")}>
      {!hideEmbedVvAiLogoInGridToolbar ? <VvAiLogo /> : null}
    </div>
  )

  const brandBlock = brandBlockStacked

  const navOrgTriggerLabel = currentOrgData?.name || (isContentScopeMode ? "选择组织" : "未知主体")
  const navOrgAriaLabel = isContentScopeMode
    ? `信息范围：${currentOrgData?.name ?? "未知"}`
    : `组织：${currentOrgData?.name ?? "未知"}`

  const renderCompanySwitcher = (menuAlign: "center" | "end") =>
    showCenterCompanySwitcher ? (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={navOrgAriaLabel}
            className={cn(
              BAR_CONTROL_H,
              "inline-flex max-w-full shrink-0 items-center gap-[var(--space-150)] rounded-[var(--radius-md)] border border-transparent px-[var(--space-200)]",
              menuAlign === "end" && "ml-auto",
              "text-text transition-colors hover:border-border hover:bg-[var(--black-alpha-11)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            <AvatarPlaceholder />
            <span className="max-w-[min(200px,40vw)] truncate text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)]">
              {navOrgTriggerLabel}
            </span>
            <ChevronDown className="h-[14px] w-[14px] shrink-0 text-text-tertiary" strokeWidth={2} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={menuAlign}
          className="w-[min(280px,calc(100vw-2rem))] p-0"
        >
          <div className="max-h-[min(220px,40vh)] overflow-y-auto bg-bg py-[var(--space-50)]">
            {organizations.map((org) => (
              <DropdownMenuItem
                key={org.id}
                onSelect={() => onOrgSelect?.(org.id)}
                className={cn(
                  "mx-[var(--space-50)] flex cursor-pointer items-center gap-[var(--space-100)] rounded-[var(--radius-sm)] px-[var(--space-150)] py-[var(--space-100)]",
                  "text-[length:var(--font-size-xs)] leading-[var(--line-height-3xs)] focus:bg-[var(--black-alpha-11)]"
                )}
              >
                <GripVertical className="h-3 w-3 shrink-0 text-text-tertiary" aria-hidden />
                {org.id === currentOrg ? (
                  <Check className="h-3 w-3 shrink-0 text-primary" strokeWidth={2.5} aria-hidden />
                ) : (
                  <img
                    src={org.icon || orgIcon}
                    alt=""
                    className="h-4 w-4 shrink-0 rounded-full border border-border object-cover"
                  />
                )}
                <span
                  className={cn(
                    "min-w-0 flex-1 truncate font-[var(--font-weight-regular)]",
                    org.id === currentOrg
                      ? "font-[var(--font-weight-medium)] text-primary"
                      : "text-text"
                  )}
                >
                  {org.name}
                </span>
              </DropdownMenuItem>
            ))}
          </div>
          {(onCreateOrg || onJoinOrg) ? (
            <>
              <DropdownMenuSeparator className="my-0" />
              <div className="bg-bg px-[var(--space-150)] py-[var(--space-150)]">
                <div className="flex gap-[var(--space-100)]">
                  {onCreateOrg ? (
                    <DropdownMenuItem
                      onSelect={() => onCreateOrg()}
                      className={cn(
                        "flex min-h-0 flex-1 cursor-pointer items-center justify-center rounded-full border border-primary/55 bg-bg px-[var(--space-100)] py-[5px]",
                        "text-center text-[length:var(--font-size-xxs)] font-[var(--font-weight-medium)] leading-[var(--line-height-4xs)] text-primary",
                        "focus:bg-[var(--blue-alpha-11)] focus:text-primary data-[highlighted]:bg-[var(--blue-alpha-11)] data-[highlighted]:text-primary"
                      )}
                    >
                      创建企业/组织
                    </DropdownMenuItem>
                  ) : null}
                  {onJoinOrg ? (
                    <DropdownMenuItem
                      onSelect={() => onJoinOrg()}
                      className={cn(
                        "flex min-h-0 flex-1 cursor-pointer items-center justify-center rounded-full border border-primary/55 bg-bg px-[var(--space-100)] py-[5px]",
                        "text-center text-[length:var(--font-size-xxs)] font-[var(--font-weight-medium)] leading-[var(--line-height-4xs)] text-primary",
                        "focus:bg-[var(--blue-alpha-11)] focus:text-primary data-[highlighted]:bg-[var(--blue-alpha-11)] data-[highlighted]:text-primary"
                      )}
                    >
                      加入企业/组织
                    </DropdownMenuItem>
                  ) : null}
                </div>
              </div>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    ) : null;

  const noOrgQuickEntryBlock = showNoOrgQuickEntry && !orgSwitcherInSessionList ? (
    <Popover open={noOrgPopoverOpen} onOpenChange={setNoOrgPopoverOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            BAR_CONTROL_H,
            "inline-flex max-w-[min(220px,38vw)] shrink-0 items-center gap-[6px] rounded-[var(--radius-md)] border border-border bg-bg px-[var(--space-200)]",
            "text-left text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-text transition-colors hover:bg-[var(--black-alpha-11)]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
          aria-expanded={noOrgPopoverOpen}
          aria-label={noOrgEntryTitle}
        >
          <span className="min-w-0 truncate">{noOrgEntryTitle}</span>
          <ChevronDown className="h-[14px] w-[14px] shrink-0 text-text-tertiary" strokeWidth={2} aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        side="bottom"
        sideOffset={6}
        className="w-[min(calc(100vw-2rem),320px)] border-border p-[var(--space-350)] shadow-md"
      >
        <p className="text-[length:var(--font-size-sm)] font-[var(--font-weight-semi-bold)] leading-snug text-text">
          {noOrgEntryTitle}
        </p>
        <p className="mt-[var(--space-200)] text-[length:var(--font-size-xs)] leading-[var(--line-height-sm)] text-text-tertiary">
          {noOrgEntrySubtitle}
        </p>
        <div className="mt-[var(--space-300)] flex gap-[var(--space-100)]">
          <button
            type="button"
            onClick={() => {
              onQuickCreateOrg?.();
              setNoOrgPopoverOpen(false);
            }}
            className="h-[36px] min-w-0 flex-1 rounded-[var(--radius-md)] border border-primary/45 bg-transparent text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-primary transition-colors hover:bg-[var(--blue-alpha-11)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            创建
          </button>
          <button
            type="button"
            onClick={() => {
              onQuickJoinOrg?.();
              setNoOrgPopoverOpen(false);
            }}
            className="h-[36px] min-w-0 flex-1 rounded-[var(--radius-md)] border border-border bg-transparent text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-text-secondary transition-colors hover:border-primary/35 hover:bg-[var(--black-alpha-11)] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            加入
          </button>
        </div>
      </PopoverContent>
    </Popover>
  ) : null;

  const mainNewThreadIconVariant =
    mainCuiToolbarActions?.newThreadIconVariant ?? "message-plus"

  const mainCuiToolbarIconBtns =
    mainCuiToolbarActions != null ? (
      <>
        {mainCuiToolbarActions.onHistory ? (
          <button
            type="button"
            onClick={mainCuiToolbarActions.onHistory}
            className={cn(
              BAR_CONTROL_H,
              "inline-flex w-[var(--space-800)] shrink-0 items-center justify-center rounded-[var(--radius-md)] border-none bg-transparent",
              "text-text-secondary transition-colors hover:bg-[var(--black-alpha-11)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
            title="历史消息"
            aria-label="历史消息"
          >
            <History className="h-[18px] w-[18px] shrink-0" strokeWidth={2} aria-hidden />
          </button>
        ) : null}
        <button
          type="button"
          onClick={mainCuiToolbarActions.onNewThread}
          className={cn(
            BAR_CONTROL_H,
            "inline-flex w-[var(--space-800)] shrink-0 items-center justify-center rounded-[var(--radius-md)] border-none bg-transparent",
            "text-text-secondary transition-colors hover:bg-[var(--black-alpha-11)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
          title={mainCuiToolbarActions.newThreadTitle ?? "开启新会话"}
          aria-label={mainCuiToolbarActions.newThreadAriaLabel ?? "开启新会话"}
        >
          {mainNewThreadIconVariant === "design-bubble-plus" ? (
            <NewSessionBubblePlusIcon className="h-[18px] w-[18px]" />
          ) : mainNewThreadIconVariant === "square-pen" ? (
            <SquarePen className="h-[18px] w-[18px] shrink-0" strokeWidth={2} aria-hidden />
          ) : (
            <MessageSquarePlus className="h-[18px] w-[18px] shrink-0" strokeWidth={2} aria-hidden />
          )}
        </button>
        {mainCuiToolbarActions.onIndependentWindow ? (
          <button
            type="button"
            onClick={mainCuiToolbarActions.onIndependentWindow}
            className={cn(
              BAR_CONTROL_H,
              "inline-flex w-[var(--space-800)] shrink-0 items-center justify-center rounded-[var(--radius-md)] border-none bg-transparent",
              "text-text-secondary transition-colors hover:bg-[var(--black-alpha-11)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
            title={mainCuiToolbarActions.independentWindowTitle ?? "独立窗口"}
            aria-label={mainCuiToolbarActions.independentWindowAriaLabel ?? "独立窗口"}
          >
            <AppWindow className="h-[18px] w-[18px] shrink-0" strokeWidth={2} aria-hidden />
          </button>
        ) : null}
      </>
    ) : null

  const portalDockHistoryBtn =
    onPortalDockHistoryToggle != null ? (
      <button
        type="button"
        onClick={onPortalDockHistoryToggle}
        className={cn(
          BAR_CONTROL_H,
          "inline-flex w-[var(--space-800)] shrink-0 items-center justify-center rounded-[var(--radius-md)] border-none bg-transparent",
          "text-text-secondary transition-colors hover:bg-[var(--black-alpha-11)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        )}
        title={portalDockHistoryOpen ? "收起应用历史" : "应用历史"}
        aria-label="应用历史"
        aria-pressed={portalDockHistoryOpen}
      >
        <History className="h-[18px] w-[18px] shrink-0" strokeWidth={2} aria-hidden />
      </button>
    ) : null

  const trailingControls = (
    <>
      {onNewMessage ? null : null}
      {portalDockHistoryBtn}
      {mainCuiToolbarIconBtns}
      {showIndependentWindow && onIndependentWindow && !mainCuiToolbarActions?.onIndependentWindow ? (
        <button
          type="button"
          onClick={onIndependentWindow}
          className={cn(
            BAR_CONTROL_H,
            "w-[var(--space-800)] shrink-0 rounded-[var(--radius-md)] border-none bg-transparent text-text-secondary transition-colors hover:bg-[var(--black-alpha-11)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
          title="独立窗口"
        >
          <AppWindow size={16} />
        </button>
      ) : null}
      {showClose && onClose && (
        <button
          onClick={onClose}
          className="h-auto w-auto bg-transparent border-none cursor-pointer hover:bg-[var(--black-alpha-11)] rounded-md transition-colors focus:outline-none flex items-center justify-center text-text-secondary p-[var(--space-100)]"
          title="Close"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15.4167 5.7625L14.2375 4.58334L10 8.82084L5.7625 4.58334L4.58334 5.7625L8.82084 10L4.58334 14.2375L5.7625 15.4167L10 11.1792L14.2375 15.4167L15.4167 14.2375L11.1792 10L15.4167 5.7625Z" fill="currentColor"/>
          </svg>
        </button>
      )}
    </>
  );

  const sessionListToggleBtn =
    showSessionListToggle && onSessionListToggle ? (
      <button
        type="button"
        onClick={onSessionListToggle}
        className={cn(
          BAR_CONTROL_H,
          "inline-flex w-[var(--space-800)] shrink-0 items-center justify-center rounded-[var(--radius-md)] border-none bg-transparent",
          "text-text-secondary transition-colors hover:bg-[var(--black-alpha-11)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        )}
        title={sessionListOpen ? "收起侧栏" : "展开侧栏"}
        aria-label={sessionListOpen ? "收起侧栏" : "展开侧栏"}
        aria-pressed={sessionListOpen}
      >
        {sessionListOpen ? (
          <PanelLeftClose className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
        ) : (
          <PanelLeftOpen className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
        )}
      </button>
    ) : null

  if (navGridAlign) {
    return (
      <header
        className={cn(
          "relative z-20 grid min-h-[var(--space-900)] flex-none grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-[var(--space-300)] bg-transparent py-[var(--space-150)]",
          "px-[max(20px,var(--cui-padding-max))]"
        )}
      >
        <div className="flex min-w-0 items-center gap-[var(--space-100)] justify-self-start self-center text-left">
          {sessionListToggleBtn}
          {gridNavInsertLeadingVvAiLogo ? (
            <span className="flex shrink-0 items-center">
              <VvAiLogo />
            </span>
          ) : null}
          <div className="min-w-0 max-w-full min-h-0 flex-1 overflow-hidden [&_button]:ml-0">
            {brandBlockGridToolbar}
          </div>
        </div>
        {/* 中区：《组织状态》与顶栏同宽视觉中心对齐 */}
        <div className="pointer-events-auto z-[1] flex min-w-0 max-w-[min(100%,400px)] flex-col items-stretch justify-center justify-self-center self-center">
          <div className="flex w-full min-w-0 justify-center">
            {navCenterSlot ? (
              <div className="flex min-w-0 max-w-full justify-center">{navCenterSlot}</div>
            ) : showCenterCompanySwitcher ? (
              renderCompanySwitcher("center")
            ) : (
              noOrgQuickEntryBlock
            )}
          </div>
          {/* 栅格顶栏左区已是 VVAI + 模型：中区不再叠标题，避免误传应用名（如「日历」）与品牌区重复 */}
          {!navCenterSlot && !showCenterCompanySwitcher && !noOrgQuickEntryBlock && title && !showLeftModelPicker ? (
            <span
              className={cn(
                BAR_CONTROL_H,
                "mx-auto inline-flex max-w-full justify-center truncate px-[var(--space-200)] text-center text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text"
              )}
            >
              {title}
            </span>
          ) : null}
        </div>
        <div className="flex min-w-0 flex-wrap items-center justify-end justify-self-end gap-x-[var(--space-100)] gap-y-[var(--space-100)] self-center text-right">
          {trailingControls}
        </div>
      </header>
    );
  }

  return (
    <header className="relative z-20 flex min-h-[var(--space-900)] flex-none items-center bg-transparent px-[var(--space-400)] py-[var(--space-150)]">
      {/* 左区：历史、品牌、场景标题 */}
      <div className="relative z-10 flex min-h-[var(--space-800)] min-w-0 flex-1 items-center gap-[var(--space-200)]">
        {onToggleHistory && (
          <button
            type="button"
            onClick={onToggleHistory}
            className={cn(
              BAR_CONTROL_H,
              "flex w-[var(--space-800)] shrink-0 items-center justify-center rounded-[var(--radius-md)] border-none bg-transparent p-0",
              "text-text-secondary transition-colors hover:bg-[var(--black-alpha-11)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
            title="会话历史"
          >
            <SidebarIcon />
          </button>
        )}
        {brandBlock}
      </div>

      {/* 中区：主体切换 / 标题 — 绝对居中，避免左右区宽度变化时视觉偏移 */}
      {/* z-index 须高于左右 flex-1 区（z-10），否则侧栏透明命中层会盖住主体下拉按钮 */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 z-30 flex w-full max-w-[min(100%,480px)] -translate-x-1/2 items-center justify-center px-[var(--space-400)]">
        <div className="pointer-events-auto min-w-0 max-w-full">
          {navCenterSlot ? (
            <div className="flex justify-center">{navCenterSlot}</div>
          ) : showCenterCompanySwitcher ? (
            renderCompanySwitcher("center")
          ) : (
            noOrgQuickEntryBlock
          )}
          {!navCenterSlot && !showCenterCompanySwitcher && !noOrgQuickEntryBlock && title ? (
            <span className="block max-w-full truncate text-center text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text">
              {title}
            </span>
          ) : null}
        </div>
      </div>

      {/* 右区：无组织入口（单行 Popover）、独立窗口等 */}
      <div className="relative z-10 flex min-h-[var(--space-800)] min-w-0 flex-1 items-center justify-end gap-[var(--space-100)]">
        {trailingControls}
      </div>
    </header>
  )
}
