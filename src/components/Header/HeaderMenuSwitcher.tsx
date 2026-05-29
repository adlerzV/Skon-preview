"use client";

import { usePathname } from "next/navigation";
import DesktopGamesNav from "./DesktopGamesNav";

interface HeaderMenuSwitcherProps {
  shopItems: any[];
  blogItems: any[];
}

export default function HeaderMenuSwitcher({ shopItems, blogItems }: HeaderMenuSwitcherProps) {
  const pathname = usePathname();

  // تمرکز روی پیشوند /blog طبق معماری جدیدمان
  const isBlogSection = pathname?.startsWith("/blog");

  // انتخاب دیتا
  const activeData = isBlogSection ? blogItems : shopItems;

  return (
    <div className="flex-1 h-full transition-all duration-500 ease-in-out">

      <DesktopGamesNav key={isBlogSection ? "blog" : "shop"} games={activeData} />
    </div>
  );
}