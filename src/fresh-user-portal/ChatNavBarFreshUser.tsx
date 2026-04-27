import * as React from "react"
import { VvAiLogo, NewMessageIcon } from "../components/chat/ChatComponents"
import { SidebarIcon } from "../components/chat/SidebarIcons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../components/ui/dropdown-menu"
import { Switch } from "../components/ui/switch"
import { Button } from "../components/ui/button"
import { GripVertical, ChevronDown, ChevronUp, Plus, Building2, Home, GraduationCap, Search } from "lucide-react"
import { Input } from "../components/ui/input"

import orgIcon from 'figma:asset/58a97c06b4ae6edfc613d20add2fb4ead0363c64.png';

// Inlined SVG path data
const svgPaths = {
  p18154430: "M0.640165 0.109835C0.493718 -0.0366117 0.256282 -0.0366117 0.109835 0.109835C-0.0366117 0.256282 -0.0366117 0.493718 0.109835 0.640165L4.10984 4.64016C4.25628 4.78661 4.49372 4.78661 4.64016 4.64016L8.64017 0.640165C8.78661 0.493718 8.78661 0.256282 8.64017 0.109835C8.49372 -0.0366117 8.25628 -0.0366117 8.10984 0.109835L4.375 3.84467L0.640165 0.109835Z",
  p2abfb900: "M6.13004 13.894C3.46974 14.4406 1.20019 11.9255 2.03847 9.33972C2.0392 9.33742 2.03931 9.33497 2.03881 9.33258C2.0383 9.3302 2.0372 9.32798 2.03559 9.32612C0.971374 8.12766 0.836328 6.41861 1.68917 5.06366C2.19704 4.25674 2.99564 3.69687 3.9304 3.50278C3.93574 3.50172 3.93931 3.49857 3.94113 3.49334C4.36483 2.22 5.4276 1.31339 6.75263 1.09546C6.82186 1.08405 6.97413 1.07103 7.20945 1.05642C7.35143 1.04767 7.51853 1.0545 7.71076 1.0769C8.55448 1.17562 9.36412 1.57741 9.92719 2.22352C9.92874 2.22532 9.93075 2.22667 9.933 2.22743C9.93525 2.22819 9.93766 2.22833 9.93999 2.22784C10.7363 2.06826 11.4928 2.16021 12.2095 2.50369C12.9878 2.87667 13.6003 3.53687 13.9322 4.32395C14.2671 5.11855 14.3009 5.93656 14.0333 6.77799C14.0325 6.78049 14.0323 6.78317 14.0328 6.7858C14.0332 6.78842 14.0344 6.79091 14.036 6.79303C14.0716 6.83863 14.1207 6.88952 14.149 6.92504C15.1041 8.1227 15.2047 9.74294 14.3943 11.0452C13.8898 11.8562 13.0792 12.4183 12.1462 12.6181C12.1408 12.6193 12.137 12.6224 12.1347 12.6274C12.1092 12.6813 12.0878 12.7553 12.0731 12.7932C11.6302 13.9432 10.6347 14.7757 9.43628 15.0045C9.15936 15.0574 8.86169 15.0759 8.54328 15.0599C7.61859 15.0131 6.76335 14.5774 6.14332 13.8984C6.13969 13.8944 6.13526 13.893 6.13004 13.894ZM4.68628 7.87405L5.86666 8.5576C5.86844 8.55864 5.87046 8.5592 5.87252 8.55921C5.87458 8.55922 5.8766 8.55869 5.87839 8.55767C5.88017 8.55664 5.88166 8.55517 5.88269 8.55338C5.88372 8.5516 5.88427 8.54958 5.88426 8.54752C5.88416 7.27097 5.88421 5.99267 5.88442 4.7126C5.88442 4.45035 5.94267 4.33739 6.17164 4.20458C7.10096 3.6662 8.03365 3.12634 8.9697 2.58498C8.97663 2.58103 8.97701 2.5765 8.97082 2.57138C8.05349 1.81198 6.76047 1.77838 5.79274 2.45217C5.11926 2.92115 4.6802 3.73736 4.6802 4.55964V7.86348C4.6802 7.86562 4.68076 7.86773 4.68182 7.86958C4.68289 7.87144 4.68443 7.87298 4.68628 7.87405ZM10.1995 4.41659C10.3093 4.43067 10.3954 4.48651 10.4938 4.54332C11.4124 5.07348 12.3293 5.6031 13.2443 6.1322C13.2513 6.13625 13.2553 6.13433 13.2565 6.12644C13.3361 5.5903 13.2677 5.08233 13.0515 4.60252C12.4257 3.21317 10.7256 2.66258 9.39516 3.39814C9.29916 3.45126 9.20369 3.50529 9.10875 3.56023C8.25164 4.05646 7.39506 4.551 6.53902 5.04382C6.53333 5.04712 6.5286 5.05186 6.52532 5.05756C6.52203 5.06326 6.5203 5.06972 6.5203 5.0763V6.43557C6.5203 6.44165 6.52291 6.44315 6.52814 6.44005C7.64083 5.79778 8.75321 5.15524 9.86527 4.51243C9.98239 4.44475 10.0774 4.40107 10.1995 4.41659ZM3.39182 9.257C4.3229 9.79286 5.25223 10.3324 6.18156 10.8691C6.18511 10.8711 6.18914 10.8722 6.19324 10.8722C6.19734 10.8722 6.20137 10.8711 6.20492 10.8691L7.3909 10.1855C7.39153 10.1851 7.39205 10.1846 7.39241 10.184C7.39277 10.1833 7.39296 10.1826 7.39296 10.1818C7.39296 10.1811 7.39277 10.1804 7.39241 10.1797C7.39205 10.1791 7.39153 10.1785 7.3909 10.1782C6.26359 9.52714 5.13607 8.87564 4.00833 8.22366C3.89835 8.16019 3.82533 8.0732 3.78928 7.96269C3.77264 7.91159 3.76426 7.82087 3.76416 7.69052C3.76384 6.62988 3.76405 5.56987 3.7648 4.51051C3.76481 4.50931 3.76453 4.50812 3.76396 4.50705C3.7634 4.50598 3.76258 4.50507 3.76156 4.50439C3.76055 4.50371 3.75938 4.50329 3.75816 4.50315C3.75694 4.50302 3.7557 4.50319 3.75456 4.50363C2.79195 4.87341 2.12775 5.74658 2.05815 6.77991C1.98887 7.80588 2.51145 8.75025 3.39182 9.257ZM8.68457 5.94211C9.78115 6.57766 10.8762 7.2107 11.9699 7.84124C12.0848 7.90749 12.1599 7.96034 12.195 7.99981C12.2683 8.08216 12.3049 8.1835 12.3047 8.30383C12.3045 9.40756 12.3045 10.5106 12.3046 11.613C12.3046 11.6138 12.3048 11.6147 12.3052 11.6154C12.3056 11.6162 12.3062 11.6169 12.3069 11.6173C12.3076 11.6178 12.3085 11.6181 12.3093 11.6182C12.3102 11.6183 12.3111 11.6182 12.3119 11.6179C13.2278 11.2704 13.8602 10.4812 13.9984 9.51061C14.1501 8.44559 13.6181 7.40266 12.6916 6.86855C11.7566 6.32943 10.8219 5.78941 9.88767 5.24847C9.88528 5.24711 9.88258 5.2464 9.87983 5.2464C9.87708 5.2464 9.87438 5.24711 9.87199 5.24847L8.68457 5.93315C8.67934 5.93613 8.67934 5.93912 8.68457 5.94211ZM6.5203 8.92978C6.52029 8.93192 6.52085 8.93402 6.52192 8.93588C6.52299 8.93773 6.52452 8.93927 6.52638 8.94034L8.03013 9.80742C8.03198 9.80849 8.03408 9.80905 8.03621 9.80905C8.03835 9.80905 8.04044 9.80849 8.04229 9.80742L9.54637 8.94098C9.54822 8.93991 9.54976 8.93837 9.55083 8.93652C9.5519 8.93466 9.55245 8.93256 9.55245 8.93042V7.19001C9.55245 7.18787 9.5519 7.18577 9.55083 7.18391C9.54976 7.18206 9.54822 7.18052 9.54637 7.17945L8.04181 6.31205C8.03996 6.31098 8.03787 6.31042 8.03573 6.31042C8.0336 6.31042 8.0315 6.31098 8.02965 6.31205L6.52638 7.17913C6.52452 7.1802 6.52299 7.18174 6.52192 7.18359C6.52085 7.18545 6.52029 7.18755 6.5203 7.18969V8.92978ZM7.10689 13.558C7.73236 14.0484 8.52984 14.2675 9.3094 14.0936C10.4475 13.8398 11.278 12.9097 11.3793 11.7477C11.3857 11.6742 11.3889 11.5676 11.3889 11.428C11.3884 10.3709 11.3884 9.31598 11.3887 8.26334C11.3887 8.25871 11.3875 8.25416 11.3851 8.25015C11.3828 8.24613 11.3795 8.24279 11.3754 8.24046L10.2006 7.56011C10.1953 7.55702 10.1926 7.55856 10.1926 7.56475C10.1924 8.83436 10.1923 10.104 10.1923 11.3736C10.1924 11.4848 10.1851 11.5651 10.1704 11.6144C10.1106 11.8158 9.98463 11.8698 9.77374 11.9919C8.8825 12.5077 7.99408 13.0219 7.10849 13.5345C7.10648 13.5357 7.10478 13.5373 7.10356 13.5393C7.10233 13.5413 7.10161 13.5435 7.10145 13.5458C7.10129 13.5481 7.1017 13.5505 7.10265 13.5526C7.1036 13.5547 7.10505 13.5566 7.10689 13.558ZM2.82139 9.99175C2.47113 12.0791 4.601 13.6911 6.51278 12.8074C6.57966 12.7764 6.67364 12.726 6.79471 12.6564C7.68147 12.1454 8.56771 11.6335 9.4534 11.1208C9.49554 11.0964 9.52509 11.0789 9.54205 11.0681C9.54696 11.065 9.54941 11.0606 9.54941 11.0547L9.54925 9.6839C9.54926 9.6832 9.5491 9.68251 9.54879 9.68188C9.54849 9.68126 9.54805 9.68072 9.54751 9.68033C9.54698 9.67994 9.54637 9.67971 9.54575 9.67966C9.54512 9.67962 9.54451 9.67975 9.54397 9.68006C8.42434 10.3266 7.30583 10.9728 6.18844 11.6186C5.97387 11.7427 5.82634 11.7198 5.61721 11.5992C4.68746 11.0625 3.75792 10.5256 2.82859 9.98839C2.82454 9.98605 2.82213 9.98717 2.82139 9.99175Z",
};

// Inlined Triangle component
const Triangle = ({ className = "" }: { className?: string }) => {
  return (
    <svg 
      className={className} 
      width="10"
      height="8"
      viewBox="0 0 6.2 4.8" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3.9185 4.34332L5.96969 1.67678C6.32045 1.22079 6.23514 0.566781 5.77915 0.216017C5.59706 0.0759457 5.37377 0 5.14404 0H1.04167C0.46637 0 0 0.46637 0 1.04167C0 1.2714 0.0759457 1.49469 0.216017 1.67678L2.2672 4.34332C2.61797 4.79932 3.27197 4.88462 3.72797 4.53386C3.79946 4.47886 3.86351 4.41481 3.9185 4.34332Z" fill="currentColor" transform="translate(0.31, 0.24) scale(0.9)" />
    </svg>
  );
};

// Inlined NewMessage component
const NewMessage = () => {
  return (
    <div className="relative size-full" data-name="新对话,new-message">
      <div className="absolute inset-[7.29%_7.29%_7.13%_11.46%]" data-name="Union">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.25 17.1162">
          <g id="Union">
            <path d="M6.45833 1.25C6.80351 1.25 7.08333 1.52982 7.08333 1.875C7.08333 2.22018 6.80351 2.5 6.45833 2.5H2.70833C1.90292 2.5 1.25 3.15292 1.25 3.95833V15.6551C1.25 15.8254 1.44311 15.9237 1.58081 15.8236L4.73104 13.5327L4.7994 13.4867C4.96275 13.3866 5.15117 13.3333 5.34383 13.3333H13.125C13.9304 13.3333 14.5833 12.6804 14.5833 11.875V9.58333C14.5833 9.23816 14.8632 8.95833 15.2083 8.95833C15.5535 8.95833 15.8333 9.23816 15.8333 9.58333V11.875C15.8333 13.3708 14.6208 14.5833 13.125 14.5833H5.41138L2.31608 16.8347C1.35217 17.5357 0 16.847 0 15.6551V3.95833C0 2.46256 1.21256 1.25 2.70833 1.25H6.45833Z" fill="currentColor" />
            <path d="M12.5 0C12.8452 0 13.125 0.279822 13.125 0.625V3.125H15.625C15.9702 3.125 16.25 3.40482 16.25 3.75C16.25 4.09518 15.9702 4.375 15.625 4.375H13.125V6.875C13.125 7.22018 12.8452 7.5 12.5 7.5C12.1548 7.5 11.875 7.22018 11.875 6.875V4.375H9.375C9.02982 4.375 8.75 4.09518 8.75 3.75C8.75 3.40482 9.02982 3.125 9.375 3.125H11.875V0.625C11.875 0.279822 12.1548 0 12.5 0Z" fill="currentColor" />
          </g>
        </svg>
      </div>
    </div>
  );
};

// Inlined SeparateWindow component  
const SeparateWindowIcon = () => {
  return (
    <div className="relative size-full" data-name="独立窗口,separate window">
      <div className="absolute inset-[11.46%]" data-name="Union">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.4167 15.4167">
          <g id="Union">
            <path d="M7.5 7.70833C7.5 7.36316 7.77982 7.08333 8.125 7.08333H11.0417C11.0436 7.08333 11.0455 7.08334 11.0474 7.08336C11.2054 7.08479 11.363 7.1458 11.4836 7.26639C11.5935 7.37628 11.6582 7.52286 11.6659 7.67734C11.6664 7.68764 11.6667 7.69797 11.6667 7.70833V10.625C11.6667 10.9702 11.3868 11.25 11.0417 11.25C10.6965 11.25 10.4167 10.9702 10.4167 10.625V9.21722L8.15027 11.4836C7.9062 11.7277 7.51047 11.7277 7.26639 11.4836C7.02231 11.2395 7.02231 10.8438 7.26639 10.5997L9.53278 8.33333H8.125C7.77982 8.33333 7.5 8.05351 7.5 7.70833Z" fill="currentColor" />
            <path clipRule="evenodd" d="M3.33333 12.5H1.875C0.839466 12.5 0 11.6605 0 10.625V1.875C0 0.839467 0.839466 0 1.875 0H10.625C11.6605 0 12.5 0.839466 12.5 1.875V3.33333H13.5417C14.5772 3.33333 15.4167 4.1728 15.4167 5.20833V13.5417C15.4167 14.5772 14.5772 15.4167 13.5417 15.4167H5.20833C4.1728 15.4167 3.33333 14.5772 3.33333 13.5417V12.5ZM1.25 1.875C1.25 1.52982 1.52982 1.25 1.875 1.25H10.625C10.9702 1.25 11.25 1.52982 11.25 1.875V3.33333H5.20833C4.1728 3.33333 3.33333 4.1728 3.33333 5.20833V11.25H1.875C1.52982 11.25 1.25 10.9702 1.25 10.625V1.875ZM5.20833 4.58333C4.86316 4.58333 4.58333 4.86316 4.58333 5.20833V13.5417C4.58333 13.8868 4.86316 14.1667 5.20833 14.1667H13.5417C13.8868 14.1667 14.1667 13.8868 14.1667 13.5417V5.20833C14.1667 4.86316 13.8868 4.58333 13.5417 4.58333H5.20833Z" fill="currentColor" fillRule="evenodd" />
          </g>
        </svg>
      </div>
    </div>
  );
};

// 使用 SVG 打勾图标
const CheckIcon = () => (
  <svg className="w-[16px] h-[16px] text-primary" viewBox="0 0 16 16" fill="none">
    <path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const AvatarPlaceholder = () => (
  <div className="w-[20px] h-[20px] rounded-[4px] overflow-hidden flex items-center justify-center shrink-0">
    <img src={orgIcon} alt="Organization Icon" className="w-full h-full object-cover" />
  </div>
)

// GPT模型图标
const ModelIcon = () => (
  <div className="relative shrink-0 w-[16px] h-[16px]">
    <svg className="absolute block w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
      <path d={svgPaths.p2abfb900} fill="currentColor" className="text-text" />
    </svg>
  </div>
)

// 下拉箭头（小）
const SmallChevronDownIcon = () => (
  <div className="flex items-center justify-center shrink-0 w-[12px] h-[12px]">
    <svg className="block w-full" fill="none" viewBox="0 0 8.75 4.75">
      <path d={svgPaths.p18154430} fill="currentColor" className="text-text-tertiary" />
    </svg>
  </div>
)

// 模型版本接口
export interface ModelVersion {
  id: string;
  name: string;
  description?: string;
  isRecommended?: boolean;
}

// 模型家族接口
export interface ModelFamily {
  id: string;
  name: string;
  versions: ModelVersion[];
}

/** 创建机构 / 家庭教育空间（与「无教育空间」顶部下拉一致） */
function EduSpaceCreateDropdownPanel({
  onCreateEduInstitutional,
  onCreateEduFamily,
}: {
  onCreateEduInstitutional?: () => void;
  onCreateEduFamily?: () => void;
}) {
  return (
    <>
      <button
        type="button"
        className="flex w-full gap-[var(--space-300)] px-[var(--space-400)] py-[var(--space-350)] text-left hover:bg-[var(--black-alpha-11)] transition-colors border-none bg-transparent cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          onCreateEduInstitutional?.();
        }}
      >
        <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-border bg-bg-secondary">
          <Building2 className="w-[18px] h-[18px] text-text-secondary" aria-hidden />
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-[var(--space-100)]">
          <span className="text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] text-text">
            创建机构教育空间
          </span>
          <span className="text-[length:var(--font-size-xs)] text-text-tertiary leading-relaxed">
            适合教育机构、学校、培训组织
          </span>
        </div>
      </button>
      <DropdownMenuSeparator className="my-0" />
      <button
        type="button"
        className="flex w-full gap-[var(--space-300)] px-[var(--space-400)] py-[var(--space-350)] text-left hover:bg-[var(--black-alpha-11)] transition-colors border-none bg-transparent cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          onCreateEduFamily?.();
        }}
      >
        <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-border bg-bg-secondary">
          <Home className="w-[18px] h-[18px] text-text-secondary" aria-hidden />
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-[var(--space-100)]">
          <span className="text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] text-text">
            创建家庭教育空间
          </span>
          <span className="text-[length:var(--font-size-xs)] text-text-tertiary leading-relaxed">
            适合学生、家长的个人学习场景
          </span>
        </div>
      </button>
    </>
  );
}

/** 无组织 + 教育顶栏：底部「创建机构 / 家庭」并排描边圆角按钮（参考设计稿） */
function EduSpaceCreateOutlinePillRow({
  onCreateEduInstitutional,
  onCreateEduFamily,
}: {
  onCreateEduInstitutional?: () => void;
  onCreateEduFamily?: () => void;
}) {
  const pill =
    "flex-1 min-w-0 rounded-full border border-primary bg-bg px-[var(--space-250)] py-[var(--space-200)] text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-primary transition-colors hover:bg-[var(--blue-alpha-11)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";
  return (
    <div className="flex flex-row gap-[var(--space-200)] p-[var(--space-300)] bg-bg">
      <button
        type="button"
        className={pill}
        onClick={(e) => {
          e.preventDefault();
          onCreateEduInstitutional?.();
        }}
      >
        创建机构教育空间
      </button>
      <button
        type="button"
        className={pill}
        onClick={(e) => {
          e.preventDefault();
          onCreateEduFamily?.();
        }}
      >
        创建家庭教育空间
      </button>
    </div>
  );
}

/** 全新用户 · 教育顶栏：组织仅作为分组，其下挂机构教育空间（与主入口「组织选择」菜单区分） */
export type FreshUserEduHierarchyGroup = {
  orgId: string
  orgName: string
  orgIcon?: string
  spaces: { id: string; name: string; icon?: string }[]
}

/** 下拉内教育空间行：固定占位，避免不同素材内边距导致视觉大小不一 */
function EduSpaceMenuRowIcon({ src, alt = "" }: { src: string; alt?: string }) {
  return (
    <span className="inline-flex h-[24px] w-[24px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-bg-secondary ring-1 ring-border/40">
      <img src={src} alt={alt} className="h-full w-full object-contain p-[1px]" />
    </span>
  )
}

function FreshUserEduHierarchySwitcher({
  currentSpaceId,
  groups,
  standaloneSpaces,
  onSelectSpace,
  onCreateEduInstitutional,
  onCreateEduFamily,
}: {
  currentSpaceId: string
  groups: FreshUserEduHierarchyGroup[]
  standaloneSpaces: { id: string; name: string; icon?: string }[]
  onSelectSpace: (spaceId: string) => void
  onCreateEduInstitutional?: () => void
  onCreateEduFamily?: () => void
}) {
  const [query, setQuery] = React.useState("")
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({})

  React.useEffect(() => {
    setExpanded((prev) => {
      const next = { ...prev }
      for (const g of groups) {
        if (next[g.orgId] === undefined) next[g.orgId] = true
      }
      return next
    })
  }, [groups])

  const q = query.trim().toLowerCase()

  const filteredGroups = React.useMemo(() => {
    if (!q) return groups
    return groups
      .map((g) => {
        const orgHit = g.orgName.toLowerCase().includes(q)
        const spaces = g.spaces.filter(
          (s) => orgHit || s.name.toLowerCase().includes(q),
        )
        return spaces.length > 0 ? { ...g, spaces } : null
      })
      .filter((g): g is FreshUserEduHierarchyGroup => g !== null)
  }, [groups, q])

  const filteredStandalone = React.useMemo(() => {
    if (!q) return standaloneSpaces
    return standaloneSpaces.filter((s) => s.name.toLowerCase().includes(q))
  }, [standaloneSpaces, q])

  const triggerMeta = React.useMemo(() => {
    for (const g of groups) {
      const hit = g.spaces.find((s) => s.id === currentSpaceId)
      if (hit) return { name: hit.name, icon: hit.icon }
    }
    const st = standaloneSpaces.find((s) => s.id === currentSpaceId)
    if (st) return { name: st.name, icon: st.icon }
    const first =
      groups.flatMap((g) => g.spaces)[0] ?? standaloneSpaces[0]
    return first ? { name: first.name, icon: first.icon } : { name: "教育空间", icon: undefined }
  }, [groups, standaloneSpaces, currentSpaceId])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-[var(--space-150)] px-[var(--space-200)] py-[var(--space-100)] hover:bg-[var(--black-alpha-11)] rounded-[var(--radius-md)] transition-colors border border-transparent hover:border-border min-w-0 max-w-full"
        >
          {triggerMeta.icon ? (
            <EduSpaceMenuRowIcon src={triggerMeta.icon} />
          ) : (
            <AvatarPlaceholder />
          )}
          <span className="text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] text-text max-w-[min(240px,40vw)] sm:max-w-[280px] truncate">
            {triggerMeta.name}
          </span>
          <ChevronDown className="w-[16px] h-[16px] text-text-tertiary shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        className="w-[min(calc(100vw-24px),360px)] p-0 overflow-hidden shadow-elevation-md border border-border rounded-[var(--radius-lg)] bg-bg"
      >
        <div className="border-b border-border px-[var(--space-300)] py-[var(--space-200)]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-[var(--space-200)] top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-text-tertiary" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索"
              className="h-[36px] pl-[var(--space-800)] pr-[var(--space-200)] text-[length:var(--font-size-sm)]"
            />
          </div>
        </div>
        <div className="max-h-[min(52vh,360px)] overflow-y-auto py-[var(--space-100)]">
          {filteredGroups.map((g) => {
            const open = expanded[g.orgId] !== false
            return (
              <div key={g.orgId} className="border-b border-border/60 last:border-b-0">
                <button
                  type="button"
                  className="flex w-full items-center gap-[var(--space-200)] px-[var(--space-300)] py-[var(--space-200)] text-left hover:bg-[var(--black-alpha-11)]"
                  onClick={(e) => {
                    e.preventDefault()
                    setExpanded((prev) => ({ ...prev, [g.orgId]: !open }))
                  }}
                >
                  <span className="inline-flex h-[24px] w-[24px] shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-md)] bg-bg-secondary ring-1 ring-border/40">
                    <img
                      src={g.orgIcon || orgIcon}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] text-text">
                    {g.orgName}
                  </span>
                  {open ? (
                    <ChevronUp className="h-[16px] w-[16px] shrink-0 text-primary" aria-hidden />
                  ) : (
                    <ChevronDown className="h-[16px] w-[16px] shrink-0 text-text-tertiary" aria-hidden />
                  )}
                </button>
                {open
                  ? g.spaces.map((space) => (
                      <DropdownMenuItem
                        key={space.id}
                        onClick={() => onSelectSpace(space.id)}
                        className="flex cursor-pointer items-center gap-[var(--space-200)] rounded-none py-[var(--space-250)] pl-[var(--space-800)] pr-[var(--space-300)]"
                      >
                        <GripVertical className="h-[14px] w-[14px] shrink-0 cursor-grab text-text-tertiary active:cursor-grabbing" aria-hidden />
                        <EduSpaceMenuRowIcon src={space.icon || orgIcon} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[length:var(--font-size-base)] text-text">{space.name}</p>
                        </div>
                        {space.id === currentSpaceId ? <CheckIcon /> : null}
                      </DropdownMenuItem>
                    ))
                  : null}
              </div>
            )
          })}
          {filteredStandalone.map((space) => (
            <DropdownMenuItem
              key={space.id}
              onClick={() => onSelectSpace(space.id)}
              className="flex cursor-pointer items-center gap-[var(--space-200)] rounded-none px-[var(--space-300)] py-[var(--space-250)]"
            >
              <GripVertical className="h-[14px] w-[14px] shrink-0 cursor-grab text-text-tertiary active:cursor-grabbing" aria-hidden />
              <EduSpaceMenuRowIcon src={space.icon || orgIcon} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[length:var(--font-size-base)] text-text">{space.name}</p>
              </div>
              {space.id === currentSpaceId ? <CheckIcon /> : null}
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator className="my-0" />
        <EduSpaceCreateOutlinePillRow
          onCreateEduInstitutional={onCreateEduInstitutional}
          onCreateEduFamily={onCreateEduFamily}
        />
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
  showOrgSelect?: boolean;
  /** 无组织用户：顶部仅「创建/加入」入口，无组织列表 */
  /** 无教育空间：顶部「创建教育空间」下拉（机构 / 家庭） */
  /** no-org-mock-family-edu：无组织 + 教育：下拉含已有空间列表（可选中）+ 底部并排描边「创建机构/创建家庭」按钮 */
  orgSwitcherMode?: "default" | "no-org" | "edu-empty" | "no-org-mock-family-edu" | "fresh-user-edu-hierarchy";
  /** 已有组织列表时，底部操作区：教育场景下为「创建机构 / 创建家庭」 */
  orgFooterVariant?: "default" | "edu-spaces";
  /** fresh-user-edu-hierarchy：按组织分组的机构教育空间 + 独立家庭教育空间等 */
  freshUserEduHierarchyGroups?: FreshUserEduHierarchyGroup[];
  freshUserStandaloneEduSpaces?: Array<{ id: string; name: string; icon?: string }>;
  onCreateEduInstitutional?: () => void;
  onCreateEduFamily?: () => void;
  /** 教育顶栏：与「创建」并列的「加入教育空间」（如无教育空间场景） */
  onJoinEduSpace?: () => void;
  currentOrg?: string;
  onOrgClick?: () => void;
  organizations?: Array<{ id: string; name: string; icon?: string; memberCount?: number; description?: string }>;
  onOrgSelect?: (orgId: string) => void;
  onCreateOrg?: () => void;
  onJoinOrg?: () => void;
  showModelSelect?: boolean;
  currentModel?: string;
  modelFamilies?: ModelFamily[]; // 新的模型家族数据结构
  models?: Array<{ id: string; name: string; description?: string; isRecommended?: boolean }>; // 保留向后兼容
  onModelSelect?: (modelId: string) => void;
  showIndependentWindow?: boolean;
  onIndependentWindow?: () => void;
}

export function ChatNavBar({ 
  title = "Title", 
  onToggleHistory, 
  onClose, 
  onBack,
  onNewMessage,
  showClose = false,
  showOrgSelect = false,
  orgSwitcherMode = "default",
  orgFooterVariant = "default",
  currentOrg = "vvai-edu",
  onOrgClick,
  organizations = [],
  onOrgSelect,
  onCreateOrg,
  onJoinOrg,
  onCreateEduInstitutional,
  onCreateEduFamily,
  onJoinEduSpace,
  freshUserEduHierarchyGroups = [],
  freshUserStandaloneEduSpaces = [],
  showModelSelect = false,
  currentModel = "gpt-4",
  modelFamilies = [],
  models = [],
  onModelSelect,
  showIndependentWindow = false,
  onIndependentWindow
}: ChatNavBarProps) {
  const currentOrgData = organizations.find(o => o.id === currentOrg);
  
  // 查找当前选中的模型
  let currentModelData: ModelVersion | undefined;
  
  if (modelFamilies.length > 0) {
    for (const family of modelFamilies) {
      const version = family.versions.find(v => v.id === currentModel);
      if (version) {
        currentModelData = version;
        break;
      }
    }
  } else {
    // 向后兼容旧的 models 数组
    currentModelData = models.find(m => m.id === currentModel) as ModelVersion | undefined;
  }

  const [deepThinkStates, setDeepThinkStates] = React.useState<Record<string, boolean>>({});

  // 向后兼容：如果使用旧的 models 数组，转换为 modelFamilies 格式
  const displayFamilies = modelFamilies.length > 0 ? modelFamilies : (
    models.length > 0 ? [{
      id: 'default',
      name: '默认',
      versions: models as ModelVersion[]
    }] : []
  );

  return (
    <header className="flex-none flex items-center justify-between relative z-20 px-[var(--space-400)] pt-[var(--space-200)] pb-[var(--space-100)] bg-transparent">
      <div className="flex items-center justify-start gap-[var(--space-200)] z-30 flex-1 min-w-0">
        {onToggleHistory && (
          <button 
            onClick={onToggleHistory}
            className="h-auto w-auto bg-transparent border-none cursor-pointer hover:bg-[var(--black-alpha-11)] rounded-md transition-colors focus:outline-none flex items-center justify-center p-[var(--space-100)] shrink-0"
            title="Toggle History"
          >
             <SidebarIcon />
          </button>
        )}
        <div className="flex items-center shrink-0">
          <VvAiLogo />
        </div>
        {showModelSelect && displayFamilies.length > 0 ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-[4px] px-[var(--space-200)] py-[var(--space-100)] hover:bg-[var(--black-alpha-11)] rounded-[var(--radius-md)] transition-colors border border-transparent hover:border-border max-w-[min(100%,200px)] min-w-0 shrink"
              >
                <div className="shrink-0 flex items-center justify-center">
                  <ModelIcon />
                </div>
                <span className="text-[length:var(--font-size-xs)] font-[var(--font-weight-regular)] text-text truncate min-w-0 max-sm:max-w-[72px] sm:max-w-[140px]">
                  {currentModelData?.name || 'ChatGPT'}
                </span>
                <div className="shrink-0 flex items-center justify-center">
                  <SmallChevronDownIcon />
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[360px] max-h-[500px] overflow-y-auto">
              {displayFamilies.map((family, familyIndex) => (
                <div key={family.id}>
                  <div className="px-[var(--space-300)] py-[var(--space-200)]">
                    <p className="text-[length:var(--font-size-xs)] text-text-tertiary font-[var(--font-weight-medium)]">{family.name}</p>
                  </div>
                  {family.versions.map((version) => (
                    <DropdownMenuItem
                      key={version.id}
                      onSelect={(e) => {
                        if ((e.target as HTMLElement).closest('.deep-think-toggle')) {
                          e.preventDefault();
                          return;
                        }
                        onModelSelect?.(version.id);
                      }}
                      className={`flex items-start gap-[var(--space-200)] px-[var(--space-300)] py-[var(--space-250)] cursor-pointer hover:bg-[var(--black-alpha-11)] group ${version.id === currentModel ? 'bg-[var(--blue-alpha-11)]' : ''}`}
                    >
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex items-center justify-between mb-[var(--space-100)]">
                          <div className="flex items-center gap-[var(--space-150)] flex-wrap">
                            <p className={`text-[length:var(--font-size-sm)] ${version.id === currentModel ? 'text-primary font-[var(--font-weight-bold)]' : 'text-text font-[var(--font-weight-medium)]'}`}>{version.name}</p>
                            {version.isRecommended && (
                              <span className="px-[var(--space-150)] py-[2px] rounded-[var(--radius-sm)] bg-[var(--blue-alpha-11)] text-primary text-[length:var(--font-size-xxs)] font-[var(--font-weight-medium)]">推荐</span>
                            )}
                          </div>
                          {version.id === currentModel && (
                            <div className="shrink-0 ml-[var(--space-200)]">
                              <CheckIcon />
                            </div>
                          )}
                        </div>
                        {version.description && (
                          <p className="text-[length:var(--font-size-xs)] text-text-tertiary group-hover:text-text-secondary transition-colors leading-[var(--line-height-sm)] mb-[var(--space-150)]">
                            {version.description}
                          </p>
                        )}
                        <div
                          className="deep-think-toggle flex items-center gap-[var(--space-150)] mt-auto"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Switch
                            checked={deepThinkStates[version.id] || false}
                            onCheckedChange={(checked) => setDeepThinkStates(prev => ({ ...prev, [version.id]: checked }))}
                            className="scale-75 origin-left"
                          />
                          <span className="text-[length:var(--font-size-xs)] text-text-secondary font-[var(--font-weight-medium)]">深度思考</span>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  {familyIndex < displayFamilies.length - 1 && (
                    <DropdownMenuSeparator className="my-[var(--space-200)]" />
                  )}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
        {title ? (
          <span className={`text-text text-[length:var(--font-size-md)] truncate min-w-0 ${showOrgSelect ? 'hidden md:inline' : ''}`}>
            {title}
          </span>
        ) : null}
      </div>

      <div className="flex items-center justify-center flex-1 z-30 min-w-0 px-[var(--space-100)]">
        {showOrgSelect && orgSwitcherMode === "edu-empty" ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-[var(--space-150)] px-[var(--space-250)] py-[var(--space-150)] rounded-[var(--radius-md)] transition-colors border border-border bg-bg hover:bg-[var(--black-alpha-11)] min-w-0 max-w-full shadow-xs"
              >
                <Plus className="w-[16px] h-[16px] text-primary shrink-0" aria-hidden />
                <span className="text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] text-text max-w-[min(220px,78vw)] truncate">
                  {onJoinEduSpace ? "创建/加入教育空间" : "创建教育空间"}
                </span>
                <ChevronDown className="w-[16px] h-[16px] text-text-tertiary shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className="w-[min(calc(100vw-24px),320px)] p-0 overflow-hidden shadow-elevation-md border border-border rounded-[var(--radius-lg)] bg-bg"
            >
              <EduSpaceCreateDropdownPanel
                onCreateEduInstitutional={onCreateEduInstitutional}
                onCreateEduFamily={onCreateEduFamily}
              />
              {onJoinEduSpace ? (
                <>
                  <DropdownMenuSeparator className="my-0" />
                  <DropdownMenuItem
                    className="flex w-full gap-[var(--space-300)] px-[var(--space-400)] py-[var(--space-350)] cursor-pointer rounded-none"
                    onSelect={() => {
                      onJoinEduSpace()
                    }}
                  >
                    <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-border bg-bg-secondary">
                      <GraduationCap
                        className="size-[18px] shrink-0 text-text-secondary"
                        strokeWidth={2}
                        aria-hidden
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-[var(--space-100)]">
                      <span className="text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] text-text">
                        加入教育空间
                      </span>
                      <span className="text-[length:var(--font-size-xs)] text-text-tertiary leading-relaxed">
                        使用邀请码加入已有空间
                      </span>
                    </div>
                  </DropdownMenuItem>
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : showOrgSelect && orgSwitcherMode === "fresh-user-edu-hierarchy" ? (
          <FreshUserEduHierarchySwitcher
            currentSpaceId={currentOrg}
            groups={freshUserEduHierarchyGroups}
            standaloneSpaces={freshUserStandaloneEduSpaces}
            onSelectSpace={(id) => onOrgSelect?.(id)}
            onCreateEduInstitutional={onCreateEduInstitutional}
            onCreateEduFamily={onCreateEduFamily}
          />
        ) : showOrgSelect && orgSwitcherMode === "no-org-mock-family-edu" ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-[var(--space-150)] px-[var(--space-200)] py-[var(--space-100)] hover:bg-[var(--black-alpha-11)] rounded-[var(--radius-md)] transition-colors border border-transparent hover:border-border min-w-0 max-w-full"
              >
                {currentOrgData?.icon ? (
                  <img
                    src={currentOrgData.icon}
                    alt=""
                    className="w-[20px] h-[20px] rounded-[4px] shrink-0 object-cover bg-bg-secondary"
                  />
                ) : (
                  <AvatarPlaceholder />
                )}
                <span className="text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] text-text max-w-[min(240px,40vw)] sm:max-w-[280px] truncate">
                  {currentOrgData?.name || "未知组织"}
                </span>
                <ChevronDown className="w-[16px] h-[16px] text-text-tertiary shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className="w-[min(calc(100vw-24px),360px)] p-0 overflow-hidden shadow-elevation-md border border-border rounded-[var(--radius-lg)] bg-bg"
            >
              <div className="max-h-[min(52vh,360px)] overflow-y-auto py-[var(--space-100)]">
                {organizations.map((org) => (
                  <DropdownMenuItem
                    key={org.id}
                    onClick={() => onOrgSelect?.(org.id)}
                    className="flex items-center gap-[var(--space-200)] px-[var(--space-300)] py-[var(--space-250)] cursor-pointer rounded-none"
                  >
                    <GripVertical className="w-[14px] h-[14px] text-text-tertiary shrink-0 cursor-grab active:cursor-grabbing" aria-hidden />
                    <img src={org.icon || orgIcon} alt="" className="w-[20px] h-[20px] rounded-[4px] shrink-0 object-cover bg-bg-secondary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[length:var(--font-size-base)] text-text truncate">{org.name}</p>
                    </div>
                    {org.id === currentOrg ? <CheckIcon /> : null}
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator className="my-0" />
              <EduSpaceCreateOutlinePillRow
                onCreateEduInstitutional={onCreateEduInstitutional}
                onCreateEduFamily={onCreateEduFamily}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        ) : showOrgSelect && orgSwitcherMode === 'no-org' ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-[var(--space-150)] px-[var(--space-250)] py-[var(--space-150)] rounded-[var(--radius-md)] transition-colors border border-border bg-bg hover:bg-[var(--black-alpha-11)] min-w-0 max-w-full shadow-xs"
              >
                <Plus className="w-[16px] h-[16px] text-primary shrink-0" aria-hidden />
                <span className="text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] text-text max-w-[min(220px,78vw)] truncate">
                  创建或加入企业/组织
                </span>
                <ChevronDown className="w-[16px] h-[16px] text-text-tertiary shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className="w-[min(calc(100vw-24px),280px)] p-[var(--space-300)] shadow-elevation-md border border-border rounded-[var(--radius-lg)] bg-bg"
            >
              <div className="flex flex-col gap-[var(--space-200)]">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="w-full rounded-[var(--radius-md)] h-auto min-h-[var(--space-900)] py-[var(--space-200)] text-[length:var(--font-size-sm)] justify-center"
                  onClick={(e) => {
                    e.preventDefault();
                    onCreateOrg?.();
                  }}
                >
                  创建企业/组织
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="w-full rounded-[var(--radius-md)] h-auto min-h-[var(--space-900)] py-[var(--space-200)] text-[length:var(--font-size-sm)] justify-center"
                  onClick={(e) => {
                    e.preventDefault();
                    onJoinOrg?.();
                  }}
                >
                  加入企业/组织
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : showOrgSelect && organizations.length > 0 ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-[var(--space-150)] px-[var(--space-200)] py-[var(--space-100)] hover:bg-[var(--black-alpha-11)] rounded-[var(--radius-md)] transition-colors border border-transparent hover:border-border min-w-0 max-w-full"
              >
                {currentOrgData?.icon ? (
                  <img
                    src={currentOrgData.icon}
                    alt=""
                    className="w-[20px] h-[20px] rounded-[4px] shrink-0 object-cover bg-bg-secondary"
                  />
                ) : (
                  <AvatarPlaceholder />
                )}
                <span className="text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] text-text max-w-[min(240px,40vw)] sm:max-w-[280px] truncate">
                  {currentOrgData?.name || '未知组织'}
                </span>
                <ChevronDown className="w-[16px] h-[16px] text-text-tertiary shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-[min(calc(100vw-24px),360px)] p-0 overflow-hidden shadow-elevation-md border border-border rounded-[var(--radius-lg)] bg-bg">
              <div className="max-h-[min(52vh,360px)] overflow-y-auto py-[var(--space-100)]">
                {organizations.map((org) => (
                  <DropdownMenuItem
                    key={org.id}
                    onClick={() => onOrgSelect?.(org.id)}
                    className="flex items-center gap-[var(--space-200)] px-[var(--space-300)] py-[var(--space-250)] cursor-pointer rounded-none"
                  >
                    <GripVertical className="w-[14px] h-[14px] text-text-tertiary shrink-0 cursor-grab active:cursor-grabbing" aria-hidden />
                    <img src={org.icon || orgIcon} alt="" className="w-[20px] h-[20px] rounded-[4px] shrink-0 object-cover bg-bg-secondary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[length:var(--font-size-base)] text-text truncate">{org.name}</p>
                    </div>
                    {org.id === currentOrg ? <CheckIcon /> : null}
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator className="my-0" />
              {orgFooterVariant === "edu-spaces" ? (
                <div className="flex flex-col gap-[var(--space-200)] p-[var(--space-300)] bg-bg-secondary/50">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="w-full rounded-[var(--radius-md)] h-auto min-h-[var(--space-900)] py-[var(--space-250)] text-[length:var(--font-size-sm)] justify-center"
                    onClick={(e) => {
                      e.preventDefault();
                      onCreateEduInstitutional?.();
                    }}
                  >
                    创建机构教育空间
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="w-full rounded-[var(--radius-md)] h-auto min-h-[var(--space-900)] py-[var(--space-250)] text-[length:var(--font-size-sm)] justify-center"
                    onClick={(e) => {
                      e.preventDefault();
                      onCreateEduFamily?.();
                    }}
                  >
                    创建家庭教育空间
                  </Button>
                </div>
              ) : (
                <div className="flex gap-[var(--space-200)] p-[var(--space-300)] bg-bg-secondary/50">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="flex-1 rounded-[var(--radius-md)] h-auto min-h-[var(--space-900)] py-[var(--space-200)] text-[length:var(--font-size-sm)]"
                    onClick={(e) => {
                      e.preventDefault();
                      onCreateOrg?.();
                    }}
                  >
                    创建企业/组织
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="flex-1 rounded-[var(--radius-md)] h-auto min-h-[var(--space-900)] py-[var(--space-200)] text-[length:var(--font-size-sm)]"
                    onClick={(e) => {
                      e.preventDefault();
                      onJoinOrg?.();
                    }}
                  >
                    加入企业/组织
                  </Button>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          title ? (
            <span className="text-[length:var(--font-size-md)] font-[var(--font-weight-medium)] text-text truncate text-center max-w-full">{title}</span>
          ) : null
        )}
      </div>

      <div className="flex items-center justify-end flex-1 z-30 gap-[var(--space-100)] min-w-0">
        {onNewMessage && (
          <button
            type="button"
            onClick={onNewMessage}
            className="h-[var(--space-800)] w-[var(--space-800)] bg-transparent border-none cursor-pointer hover:bg-[var(--black-alpha-11)] rounded-[var(--radius-md)] transition-colors focus:outline-none flex items-center justify-center text-text-secondary shrink-0"
            title="新对话"
          >
            <div className="w-[16px] h-[16px] text-current">
              <NewMessage />
            </div>
          </button>
        )}

        {showIndependentWindow && (
          <button
            type="button"
            onClick={onIndependentWindow}
            className="flex h-[var(--space-800)] w-[var(--space-800)] bg-transparent border-none cursor-pointer hover:bg-[var(--black-alpha-11)] rounded-md transition-colors focus:outline-none items-center justify-center text-text-secondary shrink-0"
            title="独立窗口"
          >
            <div className="w-[16px] h-[16px]">
              <SeparateWindowIcon />
            </div>
          </button>
        )}
        {showClose && onClose && (
          <button
            onClick={onClose}
            className="h-auto w-auto bg-transparent border-none cursor-pointer hover:bg-[var(--black-alpha-11)] rounded-md transition-colors focus:outline-none flex items-center justify-center text-text-secondary p-[var(--space-100)] shrink-0"
            title="Close"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15.4167 5.7625L14.2375 4.58334L10 8.82084L5.7625 4.58334L4.58334 5.7625L8.82084 10L4.58334 14.2375L5.7625 15.4167L10 11.1792L14.2375 15.4167L15.4167 14.2375L11.1792 10L15.4167 5.7625Z" fill="currentColor"/>
            </svg>
          </button>
        )}
      </div>
    </header>
  )
}