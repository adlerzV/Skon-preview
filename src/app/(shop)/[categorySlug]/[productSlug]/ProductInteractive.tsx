// فایل: src/app/[categorySlug]/[productSlug]/ProductInteractive.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ProductNode, VariationCard } from "@/lib/wp-graphql";

export default function ProductInteractive({ product }: { product: ProductNode }) {
  const hasVariations = product.isVariation && product.variationCards && product.variationCards.length > 0;
  
  const [selectedVar, setSelectedVar] = useState<VariationCard | null>(hasVariations ? product.variationCards![0] : null);
  const [deliveryType, setDeliveryType] = useState<"direct" | "gift" | "code">("direct");
  const [mainImage, setMainImage] = useState(selectedVar?.imageUrl || product.image?.sourceUrl || "/placeholder.jpg");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [battleTag, setBattleTag] = useState("");

  useEffect(() => {
    if (selectedVar?.imageUrl) {
      setMainImage(selectedVar.imageUrl);
    }
  }, [selectedVar]);

  useEffect(() => {
    setEmail("");
    setPassword("");
    setBattleTag("");
  }, [deliveryType]);

  const isDirectDisabled = false;
  const isGiftDisabled = selectedVar ? selectedVar.parsedGiftPrice === "disabled" : false;
  const isCodeDisabled = selectedVar ? selectedVar.parsedCodePrice === "disabled" : false;

  let currentPrice: number | "disabled" | null | undefined = null;
  if (deliveryType === "direct") currentPrice = selectedVar ? selectedVar.parsedPrice : product.parsedPrice;
  else if (deliveryType === "gift") currentPrice = selectedVar?.parsedGiftPrice;
  else if (deliveryType === "code") currentPrice = selectedVar?.parsedCodePrice;

  const isFormValid = () => {
    if (deliveryType === "direct") return email.includes("@") && password.length > 0;
    if (deliveryType === "gift") return battleTag.includes("#");
    if (deliveryType === "code") return true;
    return false;
  };

  const handleAddToCart = async () => {
    const cartData = {
      productId: product.databaseId,
      variationId: selectedVar?.databaseId,
      method: deliveryType,
      customFields: {
        email: deliveryType === "direct" ? email : undefined,
        password: deliveryType === "direct" ? password : undefined,
        battleTag: deliveryType === "gift" ? battleTag : undefined,
      },
      price: currentPrice
    };
    
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartData),
      });

      if (response.ok) {
        alert("محصول به سبد خرید اضافه شد.");
      } else {
        alert("خطا در افزودن به سبد خرید.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const gallery = product.galleryImages?.nodes || [];
  const categoryName = product.productCategories?.nodes?.[0]?.name || "بدون دسته";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#15171e]/60 border border-white/5 p-6 md:p-8 rounded-2xl backdrop-blur-xl">
      
      <div className="lg:col-span-8 flex flex-col gap-4">
        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-[#0b0c10] border border-white/5">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {gallery.length > 0 && (
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            <div 
              onClick={() => setMainImage(selectedVar?.imageUrl || product.image?.sourceUrl || "/placeholder.jpg")}
              className={`relative aspect-video rounded-lg overflow-hidden border cursor-pointer duration-150 ${mainImage === (selectedVar?.imageUrl || product.image?.sourceUrl) ? 'border-brand-blue opacity-100' : 'border-white/5 opacity-50 hover:opacity-100'}`}
            >
              <Image src={selectedVar?.imageUrl || product.image?.sourceUrl || "/placeholder.jpg"} alt="Main" fill className="object-cover" />
            </div>
            {gallery.map((img: any, idx: number) => (
              <div 
                key={idx} 
                onClick={() => setMainImage(img.sourceUrl)}
                className={`relative aspect-video rounded-lg overflow-hidden border cursor-pointer duration-150 ${mainImage === img.sourceUrl ? 'border-brand-blue opacity-100' : 'border-white/5 opacity-50 hover:opacity-100'}`}
              >
                <Image src={img.sourceUrl} alt={`Gallery-${idx}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="lg:col-span-4 flex flex-col gap-6">
        
        <div>
          <span className="text-brand-blue text-xs font-bold uppercase tracking-wider mb-2 block">{categoryName}</span>
          <h1 className="text-2xl md:text-3xl font-black text-white mb-2">{product.name}</h1>
          <div className="inline-block bg-brand-blue/20 text-brand-blue border border-brand-blue/30 text-xs px-3 py-1 rounded-full font-medium">
            تحویل سریع و تضمینی
          </div>
        </div>

        <hr className="border-white/5" />

        {hasVariations && (
          <div className="flex flex-col gap-3">
            <span className="text-gray-400 text-sm font-bold">۱. انتخاب نسخه بازی:</span>
            <div className="grid grid-cols-2 gap-2">
              {product.variationCards!.map((v) => (
                <button
                  key={v.databaseId}
                  onClick={() => setSelectedVar(v)}
                  className={`p-3 rounded-lg border text-sm font-bold text-center transition-all ${
                    selectedVar?.databaseId === v.databaseId
                      ? "bg-white text-black border-white"
                      : "bg-[#0b0c10] text-gray-300 border-white/10 hover:border-gray-500"
                  }`}
                >
                  {v.name.replace(`${product.name} - `, '')}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <span className="text-gray-400 text-sm font-bold">۲. روش تحویل:</span>
          <div className="flex flex-col gap-2">
            <button
              disabled={isDirectDisabled}
              onClick={() => setDeliveryType("direct")}
              className={`p-3 rounded-lg border text-sm flex justify-between items-center transition-all ${
                deliveryType === "direct" ? "bg-brand-blue/10 border-brand-blue text-brand-blue font-bold" : "bg-[#0b0c10] border-white/10 text-gray-400 hover:border-gray-500"
              }`}
            >
              <span>خرید مستقیم (ورود به اکانت)</span>
            </button>
            <button
              disabled={isGiftDisabled}
              onClick={() => setDeliveryType("gift")}
              className={`p-3 rounded-lg border text-sm flex justify-between items-center transition-all ${
                isGiftDisabled ? "opacity-30 cursor-not-allowed line-through" :
                deliveryType === "gift" ? "bg-brand-blue/10 border-brand-blue text-brand-blue font-bold" : "bg-[#0b0c10] border-white/10 text-gray-400 hover:border-gray-500"
              }`}
            >
              <span>ارسال به‌صورت گیفت</span>
            </button>
            <button
              disabled={isCodeDisabled}
              onClick={() => setDeliveryType("code")}
              className={`p-3 rounded-lg border text-sm flex justify-between items-center transition-all ${
                isCodeDisabled ? "opacity-30 cursor-not-allowed line-through" :
                deliveryType === "code" ? "bg-brand-blue/10 border-brand-blue text-brand-blue font-bold" : "bg-[#0b0c10] border-white/10 text-gray-400 hover:border-gray-500"
              }`}
            >
              <span>دریافت کد اورجینال (آنی)</span>
            </button>
          </div>
        </div>

        <div className="bg-[#0b0c10] p-4 rounded-xl border border-white/5 animate-in fade-in duration-300">
          
          {deliveryType === "direct" && (
            <div className="flex flex-col gap-3">
              <span className="text-xs text-brand-blue font-bold">💡 برای خرید مستقیم، اطلاعات اکانت الزامی است:</span>
              <input 
                type="email" 
                placeholder="ایمیل اکانت بتل‌نت" 
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#1c1e25] border border-white/10 p-3 rounded-lg text-sm text-white focus:border-brand-blue outline-none transition-colors"
                dir="ltr"
              />
              <input 
                type="password" 
                placeholder="رمز عبور اکانت" 
                value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#1c1e25] border border-white/10 p-3 rounded-lg text-sm text-white focus:border-brand-blue outline-none transition-colors"
                dir="ltr"
              />
            </div>
          )}

          {deliveryType === "gift" && (
            <div className="flex flex-col gap-3">
              <span className="text-xs text-brand-blue font-bold">💡 جهت ارسال گیفت، بتل‌تگ خود را وارد کنید:</span>
              <input 
                type="text" 
                placeholder="Example#1234" 
                value={battleTag} onChange={e => setBattleTag(e.target.value)}
                className="w-full bg-[#1c1e25] border border-white/10 p-3 rounded-lg text-sm text-white focus:border-brand-blue outline-none transition-colors font-mono"
                dir="ltr"
              />
              <span className="text-[11px] text-gray-500 leading-relaxed">
                * توجه: حتماً باید ۳ روز از فرند بودن ما در بتل‌نت گذشته باشد.
              </span>
            </div>
          )}

          {deliveryType === "code" && (
            <div className="flex flex-col gap-2 items-center justify-center py-4 text-center">
              <span className="text-4xl">🚀</span>
              <span className="text-xs text-[#75dd04] font-bold">بدون نیاز به اطلاعات اکانت!</span>
              <span className="text-[11px] text-gray-400">کد فعال‌سازی پس از پرداخت در فاکتور شما نمایش داده می‌شود.</span>
            </div>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-4">
          <div className="flex justify-between items-end bg-[#1c1e25] p-4 rounded-xl border border-white/5">
            <span className="text-sm text-gray-400">مبلغ نهایی:</span>
            {currentPrice && currentPrice !== "disabled" ? (
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">{(currentPrice as number).toLocaleString("fa-IR")}</span>
                <span className="text-xs text-gray-500">تومان</span>
              </div>
            ) : (
              <span className="text-red-500 font-bold">ناموجود</span>
            )}
          </div>

          <button 
            onClick={handleAddToCart}
            disabled={currentPrice === "disabled" || !currentPrice || !isFormValid()}
            className="w-full bg-brand-blue hover:bg-[#0062d1] disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-200"
          >
            افزودن به سبد خرید
          </button>
        </div>

      </div>
    </div>
  );
}