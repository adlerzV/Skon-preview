"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { ProductNode, VariationCard } from "@/lib/wp-graphql";
import DeliveryAndPrice from "@/components/product/DeliveryAndPrice";
import VariationSelector from "@/components/product/VariationSelector";

interface Props {
  product: ProductNode;
  initialEdition?: string;
}

export default function ProductPageClient({ product, initialEdition }: Props) {
  const variations = product.variationCards || [];
  
  const groupedAttributes = useMemo(() => {
    const map = new Map<string, Set<string>>();
    variations.forEach(v => {
      v.attributes?.forEach(attr => {
        if (!map.has(attr.name)) map.set(attr.name, new Set());
        map.get(attr.name)!.add(attr.value);
      });
    });

    const filteredMap = new Map<string, Set<string>>();
    map.forEach((values, name) => {
      const nameLower = name.toLowerCase();
      const isDeliveryByName = nameLower.includes('delivery') || nameLower.includes('تحویل') || nameLower.includes('روش') || nameLower.includes('method');
      const isDeliveryByValue = Array.from(values).some(val => 
        val.includes('گیفت') || val.includes('مستقیم') || val.includes('کد') || 
        val.toLowerCase().includes('gift') || val.toLowerCase().includes('direct')
      );

      if (!isDeliveryByName && !isDeliveryByValue) {
        filteredMap.set(name, values);
      }
    });

    return Array.from(filteredMap.entries()).map(([name, values]) => ({
      name,
      values: Array.from(values)
    }));
  }, [variations]);

  const isVariationInStock = (v: VariationCard) => {
    return (
      (v.parsedPrice !== null && v.parsedPrice !== undefined) ||
      (v.parsedGiftPrice !== "disabled" && v.parsedGiftPrice != null) ||
      (v.parsedCodePrice !== "disabled" && v.parsedCodePrice != null)
    );
  };

  const findFirstValidAttributes = (targetEdition?: string) => {
    if (variations.length === 0 || groupedAttributes.length === 0) return {};
    
    let baseVar = variations.find(v => isVariationInStock(v));
    
    if (targetEdition) {
      const matchEdition = variations.find(v => 
        isVariationInStock(v) && v.attributes?.some(a => a.value === targetEdition)
      );
      if (matchEdition) baseVar = matchEdition;
    }

    if (!baseVar) {
      baseVar = variations[0];
    }

    const attrs: Record<string, string> = {};
    if (groupedAttributes[0]) {
      const firstGroup = groupedAttributes[0];
      const matchedAttr = baseVar.attributes?.find(a => a.name === firstGroup.name);
      const firstValue = matchedAttr ? matchedAttr.value : firstGroup.values[0];
      attrs[firstGroup.name] = firstValue;

      for (let i = 1; i < groupedAttributes.length; i++) {
        const currentGroup = groupedAttributes[i];
        const validNextVar = variations.find(v => 
          isVariationInStock(v) &&
          v.attributes?.some(a => a.name === firstGroup.name && a.value === firstValue) &&
          v.attributes?.some(a => a.name === currentGroup.name)
        );
        
        if (validNextVar) {
          const nextAttr = validNextVar.attributes?.find(a => a.name === currentGroup.name);
          if (nextAttr) attrs[currentGroup.name] = nextAttr.value;
        } else {
          attrs[currentGroup.name] = currentGroup.values[0];
        }
      }
      return attrs;
    }

    baseVar.attributes?.forEach(a => { attrs[a.name] = a.value });
    return attrs;
  };

  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>(() => {
    return findFirstValidAttributes(initialEdition);
  });

  const selectedVar = useMemo(() => {
    if (variations.length === 0) return null;
    const exactMatch = variations.find(v => {
      return groupedAttributes.every(group => {
        const attrInVar = v.attributes?.find(a => a.name === group.name);
        return attrInVar ? attrInVar.value === selectedAttrs[group.name] : true;
      });
    });
    return exactMatch || variations.find(v => isVariationInStock(v)) || variations[0] || null;
  }, [variations, selectedAttrs, groupedAttributes]);

  const allGalleryImages = useMemo(() => {
    const images = new Set<string>();
    if (product.image?.sourceUrl) images.add(product.image.sourceUrl);
    variations.forEach(v => { if (v.imageUrl) images.add(v.imageUrl); });
    product.galleryImages?.nodes?.forEach((g: any) => { if (g.sourceUrl) images.add(g.sourceUrl); });
    return Array.from(images);
  }, [product, variations]);

  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);
  const displayImage = selectedGalleryImage || selectedVar?.imageUrl || product.image?.sourceUrl || "/placeholder.jpg";
  
  const category = product.productCategories?.nodes?.[0];
  const categoryName = category?.name || "بدون دسته";
  const categoryImage = category?.image?.sourceUrl;

  const handleAttrSelect = (name: string, val: string) => {
    setSelectedAttrs(prev => {
      const newAttrs = { ...prev, [name]: val };
      const clickedGroupIndex = groupedAttributes.findIndex(g => g.name === name);
      
      for (let i = clickedGroupIndex + 1; i < groupedAttributes.length; i++) {
        const nextGroup = groupedAttributes[i];
        const currentSelectedValueForNext = newAttrs[nextGroup.name];
        
        const isCurrentValid = variations.some(v => {
          const hasNextValue = v.attributes?.some(a => a.name === nextGroup.name && a.value === currentSelectedValueForNext);
          if (!hasNextValue) return false;
          
          const matchesAllPrevious = groupedAttributes.slice(0, i).every(pGroup => {
            return v.attributes?.some(a => a.name === pGroup.name && a.value === newAttrs[pGroup.name]);
          });
          if (!matchesAllPrevious) return false;
          
          return isVariationInStock(v);
        });
        
        if (!isCurrentValid) {
          const fallbackValue = nextGroup.values.find(vVal => {
            return variations.some(v => {
              const hasVal = v.attributes?.some(a => a.name === nextGroup.name && a.value === vVal);
              if (!hasVal) return false;
              
              const matchesAllPrevious = groupedAttributes.slice(0, i).every(pGroup => {
                return v.attributes?.some(a => a.name === pGroup.name && a.value === newAttrs[pGroup.name]);
              });
              if (!matchesAllPrevious) return false;
              
              return isVariationInStock(v);
            });
          });
          
          if (fallbackValue) {
            newAttrs[nextGroup.name] = fallbackValue;
          }
        }
      }
      return newAttrs;
    });
    setSelectedGalleryImage(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 min-h-screen rounded-2xl">
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="relative w-full aspect-[16/9] bg-brand-surface rounded-xl overflow-hidden border border-brand-surface_hover transition-all duration-300 shadow-lg">
          <Image 
            src={displayImage} 
            alt={product.name} 
            fill
            className="object-cover transition-opacity duration-300"
            priority
          />
        </div>

        {allGalleryImages.length > 1 && (
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {allGalleryImages.map((imgUrl, idx) => (
              <button 
                key={idx} 
                onClick={() => setSelectedGalleryImage(imgUrl)}
                className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  (selectedGalleryImage === imgUrl) || (!selectedGalleryImage && imgUrl === displayImage) 
                    ? 'border-brand-blue opacity-100 scale-105' 
                    : 'border-transparent opacity-60 hover:opacity-100 hover:border-brand-surface_hover'
                }`}
              >
                <Image src={imgUrl} alt={`گالری ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}

        {product.description && (
          <div className="mt-4 bg-brand-surface border border-brand-surface_hover p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-brand-active mb-4">توضیحات محصول</h3>
            <div 
              className="text-brand-surface_m text-sm leading-8 prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description }} 
            />
          </div>
        )}
      </div>

      <div className="lg:col-span-4 flex flex-col gap-6 sticky top-6 h-fit">
        <div>
          <div className="flex items-center gap-2 mb-3">
            {categoryImage && (
              <div className="relative w-6 h-6 rounded-full overflow-hidden bg-brand-surface_hover">
                <Image src={categoryImage} alt={categoryName} fill className="object-cover" />
              </div>
            )}
            <span className="text-brand-blue text-xs font-bold uppercase tracking-wider">{categoryName}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-brand-active leading-tight">{product.name}</h1>
          <div className="mt-3 inline-block bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-xs px-3 py-1.5 rounded-md font-medium">
             ✨ تحویل فوری و تضمین شده
          </div>
        </div>

        <VariationSelector 
          groupedAttributes={groupedAttributes}
          selectedAttrs={selectedAttrs}
          onAttributeSelect={handleAttrSelect}
          variations={variations}
        />

        <DeliveryAndPrice selectedVariation={selectedVar || variations[0]} />
      </div>
    </div>
  );
}