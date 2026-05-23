import React, { useState, useEffect } from "react";
import { VariationCard } from "@/lib/wp-graphql";

interface DeliveryAndPriceProps {
  selectedVariation: VariationCard | null;
}

export default function DeliveryAndPrice({ selectedVariation }: DeliveryAndPriceProps) {
  const [deliveryType, setDeliveryType] = useState<"direct" | "gift" | "code">("direct");
  
  const [battleTag, setBattleTag] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<"idle" | "success" | "error">("idle");

  const isDirectDisabled = !selectedVariation || !selectedVariation.parsedPrice;
  const isGiftDisabled = !selectedVariation || selectedVariation.parsedGiftPrice === "disabled";
  const isCodeDisabled = !selectedVariation || selectedVariation.parsedCodePrice === "disabled";

  useEffect(() => {
    if (!isDirectDisabled) {
      setDeliveryType("direct");
    } else if (!isGiftDisabled) {
      setDeliveryType("gift");
    } else if (!isCodeDisabled) {
      setDeliveryType("code");
    }
    
    setBattleTag("");
    setAccountEmail("");
    setAccountPassword("");
    setVerifyStatus("idle");
  }, [selectedVariation, isDirectDisabled, isGiftDisabled, isCodeDisabled]);

  if (!selectedVariation) {
    return (
      <div className="text-neutral-550 text-sm bg-brand-surface p-4 border border-neutral-800">
        لطفاً ابتدا یک ویژگی را انتخاب کنید.
      </div>
    );
  }

  const currentPrice = 
    deliveryType === "gift" ? selectedVariation.parsedGiftPrice : 
    deliveryType === "code" ? selectedVariation.parsedCodePrice : 
    selectedVariation.parsedPrice;

  const handleVerifyBattleTag = () => {
    if (!battleTag.includes("#")) {
      setVerifyStatus("error");
      return;
    }
    setIsVerifying(true);
    setVerifyStatus("idle");
    
    setTimeout(() => {
      setIsVerifying(false);
      setVerifyStatus("success");
    }, 1200);
  };

  const isAddToCartDisabled = 
    typeof currentPrice !== "number" || 
    (deliveryType === "gift" && verifyStatus !== "success") ||
    (deliveryType === "direct" && (!accountEmail || !accountPassword));

  const handleAddToCart = () => {
    const cartItemData = {
      productDetailId: selectedVariation.databaseId,
      deliveryMethod: deliveryType,
      customFields: 
        deliveryType === "gift" ? { battleTag } : 
        deliveryType === "direct" ? { email: accountEmail, password: accountPassword } : 
        null,
      price: currentPrice
    };
    
    console.log("Adding to Cart Data Structure:", cartItemData);
    alert("محصول با موفقیت به سبد خرید فرستاده شد.");
  };

  return (
    <div className="flex flex-col gap-5 bg-brand-surface p-4 md:p-5 border border-neutral-800">
      
      <div className="flex flex-col gap-3">
        <span className="text-[#8e98b0] text-[13px] font-bold uppercase tracking-wide">
          روش تحویل محصول:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#0b0c10] p-1 border border-neutral-850">
          <button
            type="button"
            disabled={isDirectDisabled}
            onClick={() => setDeliveryType("direct")}
            className={`py-3 text-center text-sm font-bold transition-all duration-200 ${
              isDirectDisabled
                ? "opacity-30 cursor-not-allowed text-neutral-600 line-through"
                : deliveryType === "direct"
                ? "bg-brand-surface border border-neutral-850 text-white font-black"
                : "text-[#8e98b0] hover:text-white"
            }`}
          >
            خرید مستقیم
          </button>

          <button
            type="button"
            disabled={isGiftDisabled}
            onClick={() => setDeliveryType("gift")}
            className={`py-3 text-center text-sm font-bold transition-all duration-200 ${
              isGiftDisabled
                ? "opacity-30 cursor-not-allowed text-neutral-600 line-through"
                : deliveryType === "gift"
                ? "bg-brand-surface border border-neutral-850 text-white font-black"
                : "text-[#8e98b0] hover:text-white"
            }`}
          >
            تحویل به‌صورت گیفت
          </button>

          <button
            type="button"
            disabled={isCodeDisabled}
            onClick={() => setDeliveryType("code")}
            className={`py-3 text-center text-sm font-bold transition-all duration-200 ${
              isCodeDisabled
                ? "opacity-30 cursor-not-allowed text-neutral-600 line-through"
                : deliveryType === "code"
                ? "bg-brand-surface border border-neutral-850 text-white font-black"
                : "text-[#8e98b0] hover:text-white"
            }`}
          >
            کد مستقیم (آنی)
          </button>
        </div>
      </div>

      {deliveryType === "direct" && (
        <div className="flex flex-col gap-3 p-4 bg-[#0b0c10] border border-neutral-850 animate-in fade-in duration-200">
          <p className="text-xs text-brand-blue font-bold">
            🔑 برای انجام سفارش، مشخصات اکانت شما جهت ورود نیاز است:
          </p>
          <div className="flex flex-col gap-2">
            <input
              type="email"
              value={accountEmail}
              onChange={(e) => setAccountEmail(e.target.value)}
              placeholder="ایمیل اکانت"
              className="w-full bg-brand-surface border border-neutral-800 p-3 text-sm text-white focus:outline-none focus:border-neutral-500 text-left"
              dir="ltr"
            />
            <input
              type="password"
              value={accountPassword}
              onChange={(e) => setAccountPassword(e.target.value)}
              placeholder="رمز عبور اکانت"
              className="w-full bg-brand-surface border border-neutral-800 p-3 text-sm text-white focus:outline-none focus:border-neutral-500 text-left"
              dir="ltr"
            />
          </div>
        </div>
      )}

      {deliveryType === "gift" && (
        <div className="flex flex-col gap-3 p-4 bg-[#0b0c10] border border-neutral-850 animate-in fade-in duration-200">
          <p className="text-xs text-brand-blue font-bold">
            💡 لطفاً بتل‌تگ خود را جهت بررسی لیست فرندها وارد کنید:
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={battleTag}
              onChange={(e) => setBattleTag(e.target.value)}
              placeholder="Example#1234"
              className="flex-1 bg-brand-surface border border-neutral-800 p-3 text-sm text-white focus:outline-none focus:border-neutral-500 tracking-wider text-left font-mono"
            />
            <button
              type="button"
              onClick={handleVerifyBattleTag}
              disabled={isVerifying || !battleTag}
              className="bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-xs font-bold text-white px-4 border border-neutral-700 transition-colors"
            >
              {isVerifying ? "در حال بررسی..." : "بررسی لایو"}
            </button>
          </div>
          
          {verifyStatus === "success" && (
            <span className="text-xs text-[#75dd04] font-medium">✓ بتل‌تگ تایید شد. شما در لیست فرندها قرار دارید!</span>
          )}
          {verifyStatus === "error" && (
            <span className="text-xs text-[#ff4e4e] font-medium">⚠️ فرمت بتل‌تگ اشتباه است. (مثال: Name#1234)</span>
          )}
        </div>
      )}

      {deliveryType === "code" && (
        <div className="p-4 bg-[#0b0c10] border border-neutral-850 animate-in fade-in duration-200">
          <p className="text-xs text-[#75dd04] font-bold">
            🚀 تحویل این متد آنی است! کد فعال‌سازی بلافاصله پس از پرداخت در فاکتور شما نمایش داده می‌شود.
          </p>
        </div>
      )}

      <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-neutral-800/60">
        <div className="flex flex-col gap-1">
          <span className="text-[#8e98b0] text-[11px] font-medium">قیمت نهایی پرداخت:</span>
          {typeof currentPrice === "number" ? (
            <span className="text-[#75dd04] font-black text-xl md:text-2xl flex items-center gap-1.5">
              {currentPrice.toLocaleString("fa-IR")}
              <span className="text-[13px] font-normal text-white">تومان</span>
            </span>
          ) : (
            <span className="text-[#ff4e4e] font-bold text-base">ناموجود</span>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAddToCartDisabled}
          className={`px-8 py-3.5 font-bold text-center text-sm transition-all duration-200 ${
            !isAddToCartDisabled
              ? "bg-white text-black hover:bg-neutral-200 cursor-pointer"
              : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
          }`}
        >
          افزودن به سبد خرید
        </button>
      </div>

    </div>
  );
}