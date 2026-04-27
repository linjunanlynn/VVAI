import * as React from "react";
import { cn } from "../components/ui/utils";
import { AppIcon } from "../components/main-ai/AppIcon"

// Inlined SVG path data
const svgPathsFromApps = {
  p306b300: "M1.25 1.25H5.625V5.625H1.25V1.25Z",
  p2c3c1870: "M7.5 1.25H11.875V5.625H7.5V1.25Z",
  p3d0dec00: "M1.25 7.5H5.625V11.875H1.25V7.5Z",
  p6218c80: "M7.5 7.5H11.875V11.875H7.5V7.5Z",
};

// Inlined Arrow component
function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}

function AllAppsIcon({ className = "" }: { className?: string }) {
  return (
    <div className={`relative shrink-0 flex items-center justify-center ${className}`}>
      <div className="absolute inset-[13.54%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.125 13.125">
          <g id="Union">
            <path clipRule="evenodd" d={svgPathsFromApps.p306b300} fill="currentColor" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPathsFromApps.p2c3c1870} fill="currentColor" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPathsFromApps.p3d0dec00} fill="currentColor" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPathsFromApps.p6218c80} fill="currentColor" fillRule="evenodd" />
          </g>
        </svg>
      </div>
    </div>
  );
}

interface OrganizationSwitcherButtonProps {
  onClick?: () => void;
  isOpen?: boolean;
  /** 二级应用内：展示当前应用图标与名称，替代「四宫格」全部应用入口 */
  secondaryApp?: { name: string; imageSrc?: string };
}

export function OrganizationSwitcherButton({
  onClick,
  isOpen = false,
  secondaryApp,
}: OrganizationSwitcherButtonProps) {
  const label = secondaryApp?.name ?? "全部应用";
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className="bg-bg flex gap-[var(--space-100)] h-[var(--space-800)] items-center px-[var(--space-300)] py-[var(--space-150)] rounded-full shrink-0 hover:bg-[var(--black-alpha-11)] transition-colors border border-border max-w-[min(100%,220px)] min-w-0"
    >
      {secondaryApp ? (
        <>
          <AppIcon imageSrc={secondaryApp.imageSrc} className="w-[18px] h-[18px] shrink-0" />
          <span className="text-[length:var(--font-size-xs)] leading-none text-[var(--color-text)] font-[var(--font-weight-medium)] truncate min-w-0">
            {secondaryApp.name}
          </span>
        </>
      ) : (
        <AllAppsIcon className="w-[var(--font-size-lg)] h-[var(--font-size-lg)] text-text-tertiary shrink-0" />
      )}
      <div
        className={cn(
          "w-[var(--icon-2xs)] h-[var(--icon-2xs)] text-text-tertiary transition-transform duration-300 shrink-0",
          isOpen && "rotate-180",
        )}
      >
        <ArrowIcon />
      </div>
    </button>
  );
}