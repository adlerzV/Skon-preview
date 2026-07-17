"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import type { HeroTabItem } from "@/lib/graphql";

interface SecondaryHeroClientProps {
  sectionTitle: string;
  tabs: HeroTabItem[];
}

export default function SecondaryHeroClient({ sectionTitle, tabs }: SecondaryHeroClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTab = tabs[activeIndex];

  return (
    <div className="w-full bg-brand-surface border border-white/5 overflow-hidden">
      <div className="px-6 md:px-10 pt-8">
        <h2 className="text-xl md:text-2xl font-black text-white mb-5">{sectionTitle}</h2>

        <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide border-b border-white/5">
          {tabs.map((tab, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`shrink-0 whitespace-nowrap pb-3 text-sm font-bold border-b-[3px] transition-colors ${
                index === activeIndex
                  ? "border-brand-blue text-white"
                  : "border-transparent text-brand-m_khonsa hover:text-white"
              }`}
            >
              {tab.tabLabel}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
        <div className="relative w-full h-[240px] lg:h-[380px] bg-[#111215]">
          <Image
            key={`img-${activeIndex}`}
            src={activeTab.imageUrl || "/images/bi-aksi.webp"}
            alt={activeTab.heading}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={90}
            className="object-cover animate-in fade-in duration-500"
          />
        </div>

        <div key={`text-${activeIndex}`} className="flex flex-col justify-center gap-4 p-6 md:p-10 animate-in fade-in duration-500">
          <h3 className="text-lg md:text-2xl font-black text-white leading-snug">{activeTab.heading}</h3>
          {activeTab.description && (
            <p className="text-sm text-brand-m_khonsa leading-7">{activeTab.description}</p>
          )}
          {activeTab.ctaText && activeTab.ctaLink && (
            <div className="mt-2">
              <Button href={activeTab.ctaLink} variant="primary">
                {activeTab.ctaText}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}