// components/MobileMenu.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { GAMES_DATA } from "@/constants/games";
import { useProductSearch } from "./hooks/useProductSearch";
import MiniSearchCard from "./MiniSearchCard";

export default function MobileMenu({ cartCount }: { cartCount: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { searchQuery, setSearchQuery, searchResults, isPending } = useProductSearch();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; }
  }, [isOpen]);

  const activeStore = pathname === "/" || pathname === "/shop";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchQuery(""); // بستن نتایج
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const SkeletonButton = () => (
    <div className="w-8 h-8 rounded-full bg-white/5 border border-[#23252b] animate-pulse flex items-center justify-center shrink-0" />
  );

  return (
    <div className="block lg:hidden w-full sticky top-0 z-[10000] bg-[#15171e]">
      
      {/* هدر اصلی موبایل */}
      <div className="flex justify-between items-center h-[60px] px-4 border-b border-[#23252b] relative z-[10001] bg-[#15171e]">
        
        {/* دکمه منو */}
        {!isMounted ? <SkeletonButton /> : (
          <button onClick={() => setIsOpen(true)} className="text-white flex items-center w-8 h-8 justify-center" aria-label="منو">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        )}

        {/* لوگو */}
        <Link href="/">
          <Image src="https://arena2battle.com/wp-content/uploads/2026/04/ارنا2بتل.webp" alt="Arena2Battle" width={120} height={32} className="h-8 w-auto object-contain" priority />
        </Link>

        {/* دکمه‌های ورود و سبد خرید */}
        <div className="flex gap-2 items-center">
          {!isMounted ? (
            <>
              <SkeletonButton />
              <SkeletonButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-brand-m_khonsa flex items-center justify-center w-8 h-8">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </Link>
              <Link href="/cart" className="text-brand-m_khonsa relative flex items-center justify-center w-8 h-8">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                {cartCount > 0 && <span className="absolute -top-0.5 -right-1 bg-[#0074E1] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-semibold shadow-md">{cartCount}</span>}
              </Link>
            </>
          )}
        </div>
      </div>

      {/* سرچ بار Sticky زیر هدر */}
      <div className="bg-[#111215] border-b border-[#23252b] relative z-[10000]">
        <form onSubmit={handleSearchSubmit} className="relative w-full h-12 p-0">
          <input 
            type="search" 
            placeholder="جستجو محصولات..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full bg-transparent h-full px-4 pr-4 pl-10 text-white text-sm outline-none border-none placeholder:text-[#5c6577]" 
          />
          <div className="absolute left-3 top-0 h-full flex items-center text-white/50">
             {isPending ? (
               <span className="w-4 h-4 border-2 border-transparent border-t-[#0074E1] rounded-full animate-spin" />
             ) : (
               <button type="submit" aria-label="جستجو" className="hover:text-white transition-colors">
                 <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
               </button>
             )}
          </div>
        </form>

        {/* پیش‌نمایش جستجو روی کل صفحه می‌افتد */}
        {(searchQuery || searchResults.length > 0) && (
          <div className="absolute top-12 left-0 w-full bg-[#15171e] p-3 max-h-[350px] overflow-y-auto flex flex-col gap-1.5 border-b border-[#23252b] shadow-2xl z-[10000]">
            <span className="text-[11px] text-[#8e98b0] border-b border-[#23252b] pb-2 mb-2 px-1 font-bold">نتایج سریع</span>
            {searchResults.length > 0 ? (
                searchResults.map((prod) => (
                  <div key={`mobi-${prod.id}`} onClick={() => setSearchQuery("")}>
                    <MiniSearchCard product={prod} />
                  </div>
                ))
              ) : searchQuery ? (
                <div className="py-6 text-center text-[12px] text-white/40">محصولی یافت نشد.</div>
            ) : null}
          </div>
        )}
      </div>

      {/* کشوی موبایل */}
      <div className={`fixed inset-0 bg-black/60 z-[100002] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsOpen(false)}></div>
      
      <div className={`fixed top-0 right-0 w-[300px] h-[100dvh] bg-[#1c1e25] z-[100003] transition-transform duration-300 overflow-y-auto text-right flex flex-col will-change-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-4 border-b border-[#23252b]">
          <Image src="https://arena2battle.com/wp-content/uploads/2026/04/ارنا2بتل.webp" alt="Arena2Battle Logo" width={100} height={25} className="h-6 w-auto" />
          <button onClick={() => setIsOpen(false)} className="text-brand-m_khonsa w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-full transition-colors" aria-label="بستن">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <nav className="m-0 p-0 flex flex-col">
          <Link href="/shop" onClick={() => setIsOpen(false)} className={`flex justify-between w-full p-4 text-[15px] font-semibold ${activeStore ? "text-white bg-[#0074E1]/10 border-r-2 border-[#0074E1]" : "text-brand-m_khonsa border-r-2 border-transparent"}`}>فروشگاه</Link>
          <div className="border-t border-[#23252b]" />
          
          <Link href="/news" onClick={() => setIsOpen(false)} className={`flex justify-between w-full p-4 text-[15px] font-semibold ${pathname?.startsWith("/news") ? "text-white bg-[#0074E1]/10 border-r-2 border-[#0074E1]" : "text-brand-m_khonsa border-r-2 border-transparent"}`}>اخبار</Link>
          <div className="border-t border-[#23252b]" />
          
          <div>
            <button onClick={() => setShopOpen(!shopOpen)} className="flex justify-between w-full p-4 text-brand-m_khonsa text-[15px] font-semibold items-center border-r-2 border-transparent bg-transparent outline-none">
              بازی‌ها
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" className={`transition-transform duration-200 ${shopOpen ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6"></path></svg>
            </button>
            <div className={`grid grid-cols-4 gap-2 bg-[#111215] border-t border-[#23252b] transition-all overflow-hidden ${shopOpen ? 'max-h-[500px] p-2.5 opacity-100' : 'max-h-0 p-0 opacity-0'}`}>
              {GAMES_DATA.map((game, i) => (
                <Link key={i} href={game.link} onClick={() => setIsOpen(false)} className="flex items-center justify-center p-2 rounded hover:bg-white/5" aria-label={game.title}>
                  <div className="relative w-10 h-10">
                    <Image src={game.img} alt={game.title || "game"} fill sizes="40px" className="object-contain" quality={70} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="border-t border-[#23252b]" />
        </nav>
        
        <div className="mt-auto p-5">
          <Link href="/guild-portal" onClick={() => setIsOpen(false)} className="block bg-white/5 border border-[#23252b] text-brand-m_khonsa hover:text-white p-3 text-center rounded font-semibold text-[15px] transition-colors">
            ورود به پورتال گیلد
          </Link>
        </div>
      </div>
    </div>
  );
}