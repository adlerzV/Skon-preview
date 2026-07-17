import SecondaryHeroClient from "./SecondaryHeroClient";
import { HeroTabItem } from "@/lib/graphql";

interface SecondaryHeroProps {
  sectionTitle: string;
  tabs: HeroTabItem[];
}

export default function SecondaryHero({ sectionTitle, tabs }: SecondaryHeroProps) {
  if (!tabs || tabs.length === 0) return null;

  return (
    <section className="w-full max-w-site mx-auto my-10 md:my-14" dir="rtl">
      <SecondaryHeroClient sectionTitle={sectionTitle} tabs={tabs} />
    </section>
  );
}