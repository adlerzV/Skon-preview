"use client";

import React, { useState } from "react";
import Image from "next/image";
import { VariationCard } from "@/lib/wp-graphql";

interface AttrValueItem {
  value: string;
  flagUrl: string;
}

interface VariationSelectorProps {
  groupedAttributes: { name: string; values: AttrValueItem[] }[];
  selectedAttrs: Record<string, string>;
  onAttributeSelect: (name: string, value: string) => void;
  variations: VariationCard[];
}

export default function VariationSelector({
  groupedAttributes,
  selectedAttrs,
  onAttributeSelect,
  variations
}: VariationSelectorProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  if (!groupedAttributes || groupedAttributes.length === 0) return null;

  const isVariationInStockGlobally = (v: VariationCard) => {
    return (
      (v.parsedPrice != null) ||
      (v.parsedGiftPrice != null && v.parsedGiftPrice !== "disabled") ||
      (v.parsedCodePrice != null && v.parsedCodePrice !== "disabled")
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      {groupedAttributes.map((group, currentLayerIdx) => {
        const isFirst = currentLayerIdx === 0;
        const cleanName = group.name.replace('pa_', '').replace('attribute_', '');
        
        const processedValues = group.values.map(btnValue => {
          const isValidBtn = variations.some(v => {
            const confirmsThisBtnVal = v.attributes?.some(a => a.name === group.name && a.value === btnValue.value);
            if (!confirmsThisBtnVal) return false;
            for (let parentStepIdx = 0; parentStepIdx < currentLayerIdx; parentStepIdx++) {
               const upperG = groupedAttributes[parentStepIdx];
               const currentMandatoryChoiceFromUser = selectedAttrs[upperG.name];
               const adheresToUpstreamRule = v.attributes?.some(a => a.name === upperG.name && a.value === currentMandatoryChoiceFromUser);
               if (!adheresToUpstreamRule) return false;
            }
            return isVariationInStockGlobally(v);
          });
          return { item: btnValue, isValidBtn };
        });

        if (processedValues.length === 0) return null;

        const currentSelectedValue = selectedAttrs[group.name];
        const currentSelectedItem = group.values.find(v => v.value === currentSelectedValue);

        return (
          <div 
            key={group.name} 
            className={`relative flex flex-col gap-1 w-full ${isFirst ? "md:w-[70%]" : "md:w-[30%]"}`}
          >
            <span className="text-brand-surface_m text-[13px] font-bold uppercase tracking-wide">
              انتخاب {cleanName}:
            </span>

            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === group.name ? null : group.name)}
              className="w-full p-4 text-sm font-medium transition-all duration-200 flex items-center justify-between bg-brand-surface text-brand-active border border-brand-surface_hover hover:bg-brand-surface_hover"
            >
              <div className="flex items-center gap-2">
                {currentSelectedItem?.flagUrl && (
                  <div className="relative w-5 h-3.5 overflow-hidden rounded-sm flex-shrink-0">
                    <Image src={currentSelectedItem.flagUrl} alt="" fill className="object-cover" />
                  </div>
                )}
                <span>{currentSelectedValue || `انتخاب ${cleanName}`}</span>
              </div>
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === group.name ? "rotate-180" : ""}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {activeDropdown === group.name && (
              <div className="absolute right-0 left-0 top-[100%] mt-1 bg-brand-surface border border-brand-surface_hover z-50 max-h-60 overflow-y-auto shadow-2xl">
                {processedValues.map(({ item, isValidBtn }) => {
                  const isSelected = selectedAttrs[group.name] === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      disabled={!isValidBtn}
                      onClick={() => {
                        if (isValidBtn) {
                          onAttributeSelect(group.name, item.value);
                          setActiveDropdown(null);
                        }
                      }}
                      className={`w-full p-3 text-right text-sm font-medium transition-all duration-150 flex items-center gap-3 border-b border-brand-surface_hover/40 last:border-0 ${
                        !isValidBtn
                          ? "opacity-30 cursor-not-allowed bg-brand-bg text-brand-surface_m/50"
                          : isSelected
                          ? "bg-brand-blue text-brand-active font-bold"
                          : "text-brand-m_khonsa hover:bg-brand-surface_hover hover:text-brand-active"
                      }`}
                    >
                      {item.flagUrl && (
                        <div className="relative w-6 h-4 overflow-hidden rounded-sm flex-shrink-0">
                          <Image src={item.flagUrl} alt="" fill className="object-cover" />
                        </div>
                      )}
                      <span>{item.value}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}