"use client";

import React, { useState, useEffect } from "react";
import { ProductNode, VariationCard } from "@/lib/wp-graphql";
import DeliveryAndPrice from "@/components/product/DeliveryAndPrice";
import VariationSelector from "@/components/product/VariationSelector";

interface Props {
  product: ProductNode;
  initialEdition?: string;
}

export default function ProductPageClient({ product, initialEdition }: Props) {
  const variations = product.variationCards || [];
  
  const [selectedVar, setSelectedVar] = useState<VariationCard | null>(() => {
    if (initialEdition) {
      return variations.find(v => v.attributes[0]?.value === initialEdition) || variations[0];
    }
    return variations[0] || null;
  });

  const displayImage = selectedVar?.imageUrl || product.image?.sourceUrl || "";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="sticky top-24 h-fit">
        <div className="aspect-square bg-neutral-900 overflow-hidden border border-neutral-800">
          <img 
            src={displayImage} 
            alt={product.name} 
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-black text-white">{product.name}</h1>
        <div 
          className="text-neutral-400 text-sm leading-7"
          dangerouslySetInnerHTML={{ __html: product.description || "" }} 
        />

        <VariationSelector 
          variationCards={variations}
          selectedVariation={selectedVar}
          onVariationChange={setSelectedVar}
        />

        <DeliveryAndPrice selectedVariation={selectedVar} />
      </div>
    </div>
  );
}