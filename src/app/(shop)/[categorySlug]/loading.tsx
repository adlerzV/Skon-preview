// app/product-category/[slug]/loading.tsx
import GameNavigation from "@/components/GameNavigation";

export default function LoadingCategory() {
  return (
    <main className="container mx-auto px-4 max-w-[1600px] pb-20">
      {/* اسکلتون لودینگ هدر دسته‌بندی */}
      <div className="w-full mt-4 mb-8 bg-[#15171e]/50 border border-white/5 rounded-2xl p-8 md:p-12 min-h-[200px] flex items-center gap-6 animate-pulse">
        <div className="w-24 h-24 md:w-32 md:h-32 bg-white/5 rounded-full"></div>
        <div className="flex flex-col gap-4">
          <div className="h-10 w-48 md:w-64 bg-white/5 rounded-lg"></div>
          <div className="h-4 w-32 md:w-48 bg-white/5 rounded"></div>
        </div>
      </div>

      {/* اسکلتون لودینگ محصولات */}
      <section className="w-full my-4 bg-[#1c1e25]/60 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden p-6 md:p-8 animate-pulse">
        <div className="h-8 w-48 bg-white/5 rounded-lg mb-8"></div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col bg-[#15171e] rounded-xl overflow-hidden border border-white/5 h-full min-h-[250px]">
              <div className="w-full aspect-video bg-white/5"></div>
              <div className="p-4 flex flex-col gap-3 flex-grow">
                <div className="h-3 w-16 bg-white/5 rounded"></div>
                <div className="h-4 w-full bg-white/5 rounded"></div>
                <div className="mt-auto h-5 w-24 bg-white/5 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}