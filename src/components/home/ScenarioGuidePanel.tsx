import { HOME_SCENARIO_COPY, HOME_SCENARIO_FIVE_ENTRY_LABEL } from "../../homeScenarioCopy"
import { cn } from "../ui/utils"

function GuideSection({ title, paragraphs }: { title: string; paragraphs: readonly string[] }) {
  return (
    <section className="space-y-2">
      <h3 className="text-[length:var(--font-size-xs)] font-[var(--font-weight-semi-bold)] text-text-secondary">
        {title}
      </h3>
      {paragraphs.map((text, i) => (
        <p
          key={i}
          className="m-0 text-pretty text-[length:var(--font-size-sm)] font-[var(--font-weight-regular)] leading-[1.55] text-text"
        >
          {text}
        </p>
      ))}
    </section>
  )
}

/** 《主CUI交互》顶栏「场景说明」抽屉内：与首页右侧说明一致 */
export function ScenarioGuidePanel({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-[var(--space-500)]", className)}>
      <GuideSection
        title="场景0（未加入任何空间和组织）"
        paragraphs={[HOME_SCENARIO_COPY.mainNoOrg]}
      />
      <GuideSection title="场景二（加入一个教育机构）" paragraphs={[HOME_SCENARIO_COPY.scenarioTwoEduOne]} />
      <GuideSection
        title="场景二（加入多个组织）"
        paragraphs={[HOME_SCENARIO_COPY.scenarioTwoMultiOrgs]}
      />
      <GuideSection
        title={HOME_SCENARIO_FIVE_ENTRY_LABEL}
        paragraphs={[HOME_SCENARIO_COPY.multiOrgPersonal, HOME_SCENARIO_COPY.multiOrgDock]}
      />
    </div>
  )
}
