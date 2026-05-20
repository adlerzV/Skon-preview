// app/page.tsx
import { getHomePageData } from "@/lib/wp-graphql"; 
import CategoryHero from "@/components/Hero"; 
import GameNavigation from "@/components/GameNavigation";
import dynamic from "next/dynamic";

const DynamicProductGrid = dynamic(() => import("@/components/ProductGrid"), {
  // یک لودینگ اسکلتون با استایل شیشه‌ای مشابه خود گرید
  loading: () => (
    <div className="w-full my-4 h-[400px] bg-[#1c1e25]/40 backdrop-blur-xl border border-white/5 rounded-2xl animate-pulse"></div>
  ), 
});

export default async function Home() {
  const { banners, featured, latest } = await getHomePageData();

  return (
    <main>
      <CategoryHero banners={banners} />

      {/* فراخوانی به صورت Lazy Load */}
      <DynamicProductGrid title="محصولات ویژه و پرطرفدار" products={featured} />
      
      <DynamicProductGrid title="جدیدترین محصولات" products={latest} />
    </main>
  );
}
