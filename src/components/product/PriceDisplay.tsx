import React from 'react';

interface PriceDisplayProps {
  price: number | null;
  regularPrice?: number | null;
  giftPrice?: number | 'disabled';
  codePrice?: number | 'disabled';
  selectedType?: 'standard' | 'gift' | 'code';
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  regularPrice,
  giftPrice,
  codePrice,
  selectedType = 'standard',
}) => {
  const formatPrice = (value: number | null) => {
    if (value === null || value === 0) return 'رایگان';
    return value.toLocaleString('fa-IR') + ' تومان';
  };

  const hasDiscount = regularPrice && price && regularPrice > price;

  if (selectedType === 'gift') {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-xs text-neutral-400">قیمت تحویل به‌صورت گیفت</span>
        <span className="text-xl font-bold text-white">
          {giftPrice === 'disabled' || !giftPrice ? 'غیرفعال' : formatPrice(giftPrice)}
        </span>
      </div>
    );
  }

  if (selectedType === 'code') {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-xs text-neutral-400">قیمت تحویل به‌صورت کد مستقیم</span>
        <span className="text-xl font-bold text-white">
          {codePrice === 'disabled' || !codePrice ? 'غیرفعال' : formatPrice(codePrice)}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {hasDiscount && (
        <span className="text-sm text-neutral-500 line-through decoration-red-550">
          {formatPrice(regularPrice)}
        </span>
      )}
      <div className="flex items-center gap-2">
        <span className="text-2xl font-black text-brand-sabz">
          {formatPrice(price)}
        </span>
      </div>
    </div>
  );
};