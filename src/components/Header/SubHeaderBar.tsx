// components/Header/SubHeaderBar.tsx
import { Suspense } from "react";
import { getRegions } from "@/lib/graphql"; 
import SubHeaderBarClient from "./SubHeaderBarClient";

export default async function SubHeaderBar() {
  // گرفتن داینامیک ریجن‌ها از وردپرس
  const regions = await getRegions().catch(() => []);

  return (
    <Suspense fallback={<div className="w-full bg-[#111318] h-[50px] border-b border-brand-surface/20" />}>
      <SubHeaderBarClient regions={regions} />
    </Suspense>
  );
}