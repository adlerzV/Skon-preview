"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";

interface Banner {
  "secondimage": string;
  subtitle: string;
  link: string;
  imageUrl: string;
}

interface Props {
  banners: Banner[];
}

export default function CategoryHero({ banners }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1 || !isPlaying) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isPlaying, banners.length, handleNext]);

  if (!banners || banners.length === 0) return null;

  const currentBanner = banners[activeIndex];

  return (
    <div dir="rtl" className="w-full max-w-[1600px] mx-auto font-sans group px-2 md:px-0">
      <section className="relative w-full h-[350px] md:h-[350px] mt-1 bg-brand-bg overflow-hidden ">
        <div className="absolute inset-0 bg-[#111215]">
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <Image 
                src={banner.imageUrl || "/images/bi-aksi.webp"} 
                alt={banner.subtitle} 
                fill 
                priority={index === 0} 
                sizes="(max-width: 1600px) 100vw, 1600px"
                className="object-cover object-center" 
              />
            </div>
          ))}
          {/* اعمال اوپسیتی گرادینت زیرین فقط برای تبلت کوچک به پایین و حذف آن در دسکتاپ */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111215] via-transparent to-transparent opacity-90 md:opacity-0 z-20"></div>
          <div className="absolute inset-0 bg-gradient-to-l from-[#111215] via-[#111215]/80 to-transparent w-full md:w-2/3 z-20"></div>
        </div>

        <div key={activeIndex} className="relative h-full flex flex-col justify-center px-6 md:px-12 w-full max-w-2xl z-30 animate-in fade-in duration-700">
          {/* رندر تصویر لوگوی بازی به جای تایتل متنی با سایزبندی استاندارد بتل‌نت */}
          {currentBanner["secondimage"] && (
            <div className="relative w-48 h-16 md:w-64 md:h-24 mb-2">
              <Image
                src={currentBanner["secondimage"]}
                alt="Banner Logo"
                fill
                className="object-contain object-right"
                priority
              />
            </div>
          )}
          <p className="text-sm text-brand-white mb-4 max-w-lg leading-relaxed line-clamp-2">
            {currentBanner.subtitle}
          </p>
          <div className="flex">
            <Button href={currentBanner.link || "#"} variant="primary">
               مشاهده و خرید
            </Button>
          </div>
        </div>

        {banners.length > 1 && (
          <>
            <Button 
              variant="icon" 
              className="absolute right-4 top-1/2 -translate-y-1/2 z-40"
              onClick={() => { handlePrev(); setIsPlaying(false); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </Button>

            <Button 
              variant="icon" 
              className="absolute left-4 top-1/2 -translate-y-1/2 z-40"
              onClick={() => { handleNext(); setIsPlaying(false); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </Button>
          </>
        )}
      </section>

      {banners.length > 1 && (
        <div className="flex items-center justify-center gap-4 mt-3">
          
          <Button variant="ghost" onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="4" width="4" height="16" rx="1"/><rect x="15" y="4" width="4" height="16" rx="1"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l15 8-15 8z"/></svg>
            )}
          </Button>

          <div className="flex gap-2 items-center min-w-[115px]">
            {banners.map((_, index) => (
              <div 
                key={index}
                onClick={() => { setActiveIndex(index); setIsPlaying(false); }}
                className={`h-[5px] flex-1 rounded-full cursor-pointer transition-all duration-300 ${index === activeIndex ? "bg-brand-blue " : "bg-brand-surface_m"}`}
              ></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}