"use client";

import React from "react";
import Image from "next/image";
import { VariationCard } from "@/lib/wp-graphql";

interface VariationSelectorProps {
  groupedAttributes: { name: string; values: string[] }[];
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
  if (!groupedAttributes || groupedAttributes.length === 0) return null;

  const getHoverImageForValue = (attrName: string, attrValue: string) => {
    const matchedVar = variations.find(v => 
      v.attributes?.some(a => a.name === attrName && a.value === attrValue) && v.imageUrl
    );
    return matchedVar ? matchedVar.imageUrl : null;
  };

  const isVariationInStock = (v: VariationCard) => {
    return (
      (v.parsedPrice !== null && v.parsedPrice !== undefined) ||
      (v.parsedGiftPrice !== "disabled" && v.parsedGiftPrice != null) ||
      (v.parsedCodePrice !== "disabled" && v.parsedCodePrice != null)
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {groupedAttributes.map((group, groupIndex) => {
        const cleanName = group.name.replace('pa_', '').replace('attribute_', '');
        
        const processedValues = group.values.map(val => {
          let isValid = false;

          if (groupIndex === 0) {
            isValid = variations.some(v => 
              v.attributes?.some(a => a.name === group.name && a.value === val) && isVariationInStock(v)
            );
          } else {
            isValid = variations.some(v => {
              const hasThisValue = v.attributes?.some(a => a.name === group.name && a.value === val);
              if (!hasThisValue) return false;

              const matchesPrevious = groupedAttributes.slice(0, groupIndex).every(prevGroup => {
                const selectedVal = selectedAttrs[prevGroup.name];
                return v.attributes?.some(a => a.name === prevGroup.name && a.value === selectedVal);
              });
              if (!matchesPrevious) return false;

              return isVariationInStock(v);
            });
          }

          return { value: val, isValid };
        });

        const displayValues = processedValues;

        if (displayValues.length === 0) return null;

        return (
          <div key={group.name} className="flex flex-col gap-3">
            <span className="text-brand-surface_m text-[13px] font-bold uppercase tracking-wide">
              انتخاب {cleanName}:
            </span>
            
            <div className="grid grid-cols-2 gap-2">
              {displayValues.map(({ value: val, isValid }) => {
                const isSelected = selectedAttrs[group.name] === val;
                const miniImage = groupIndex === 0 ? getHoverImageForValue(group.name, val) : null;
                
                return (
                  <div key={val} className="relative group/var flex flex-col">
                    <button
                      type="button"
                      disabled={!isValid}
                      onClick={() => onAttributeSelect(group.name, val)}
                      className={`p-3 text-sm font-medium border rounded-xl transition-all duration-200 text-center relative overflow-hidden ${
                        !isValid 
                          ? "opacity-40 cursor-not-allowed bg-brand-bg border-brand-surface_hover text-brand-surface_m line-through decoration-red-500/50"
                          : isSelected
                          ? "bg-brand-active border-brand-active text-brand-bg font-bold shadow-[0_0_15px_rgba(248,245,249,0.15)]"
                          : "bg-brand-surface border-brand-surface_hover text-brand-m_khonsa hover:border-brand-m_khonsa"
                      }`}
                    >
                      <span className="relative z-10">{val}</span>
                    </button>
                    
                    {miniImage && isValid && (
                      <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-32 aspect-video bg-brand-bg border border-brand-surface_hover rounded-lg overflow-hidden opacity-0 invisible group-hover/var:opacity-100 group-hover/var:visible transition-all duration-200 z-20 shadow-xl pointer-events-none">
                        <Image src={miniImage} alt={val} fill className="object-cover" />
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-brand-surface_hover"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}