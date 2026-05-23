import React from "react";
import { VariationCard } from "@/lib/wp-graphql";

interface VariationSelectorProps {
  variationCards: VariationCard[];
  selectedVariation: VariationCard | null;
  onVariationChange: (variation: VariationCard) => void;
}

export default function VariationSelector({
  variationCards,
  selectedVariation,
  onVariationChange,
}: VariationSelectorProps) {
  if (!variationCards || variationCards.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 bg-brand-surface p-4 md:p-5 rounded-none border border-neutral-800">
      <span className="text-[#8e98b0] text-[13px] font-bold uppercase tracking-wide">
        انتخاب نوع محصول / ویژگی‌ها:
      </span>
      
      <div className="flex flex-wrap gap-2">
        {variationCards.map((v) => {
          const isSelected = selectedVariation?.databaseId === v.databaseId;
          return (
            <button
              key={v.databaseId}
              type="button"
              onClick={() => onVariationChange(v)}
              className={`px-4 py-2.5 text-sm font-medium border transition-all duration-200 text-right flex flex-col gap-0.5 min-w-[120px] ${
                isSelected
                  ? "bg-white border-white text-black font-bold"
                  : "bg-[#0b0c10] border-neutral-850 text-[#f3f4f6] hover:border-neutral-700"
              }`}
            >
              <span>{v.name}</span>
              {v.parsedPrice && (
                <span className={`text-[11px] ${isSelected ? "text-neutral-700" : "text-[#8e98b0]"}`}>
                  {v.parsedPrice.toLocaleString("fa-IR")} تومان
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}