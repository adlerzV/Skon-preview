// app/product-category/[slug]/page.tsx
import { getCategoryArchive } from "@/lib/wp-graphql";
import Image from "next/image";
import ProductGrid from "@/components/ProductGrid";
import GameNavigation from "@/components/GameNavigation";

export default async function CategoryArchivePage({ params }: { params: { slug: string } }) {
  const categorySlug = params.slug;
  const categoryData = await getCategoryArchive(categorySlug);

  if (!categoryData) {
    return (
      <main className="container mx-auto px-4 max-w-[1600px] pb-20 pt-10 text-center">
        <h1 className="text-white text-2xl font-bold">دسته‌بندی پیدا نشد!</h1>
      </main>
    );
  }

  const products = categoryData.products?.nodes || [];

  return (
    <main className="container mx-auto px-4 max-w-[1600px] pb-20">
            <GameNavigation />

      {/* هدر اختصاصی دسته‌بندی (شبیه بنرهای داخلی بتل‌نت) */}
      <div className="w-full mt-4 mb-8 bg-[#15171e] border border-white/5 rounded-2xl overflow-hidden relative flex items-center p-8 md:p-12 min-h-[200px]">
        {/* گرادیانت پس‌زمینه هدر */}
        <div className="absolute inset-0 bg-gradient-to-l from-[#0074E1]/10 to-transparent"></div>
        
        <div className="relative z-10 flex items-center gap-6">
          {/* نمایش لوگوی بازی (اگر در وردپرس ثبت شده باشد) */}
          {categoryData.image?.sourceUrl ? (
            <div className="w-24 h-24 md:w-32 md:h-32 relative drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              <Image 
                src={categoryData.image.sourceUrl} 
                alt={categoryData.name} 
                fill 
                className="object-contain" 
              />
            </div>
          ) : (
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
              <span className="text-[#8e98b0] text-sm">بدون لوگو</span>
            </div>
          )}

          {/* اطلاعات متنی دسته‌بندی */}
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-wide drop-shadow-md">
              {categoryData.name}
            </h1>
            {/* توضیح دسته‌بندی در صورت وجود */}
            {categoryData.description && (
              <p className="text-[#8e98b0] text-sm md:text-base max-w-2xl leading-relaxed" 
                 dangerouslySetInnerHTML={{ __html: categoryData.description }} 
              />
            )}
          </div>
        </div>
      </div>

      {/* کامپوننت گرید محصولات که قبلاً ساختیم */}
      <ProductGrid 
        products={products} 
        title={`محصولات ${categoryData.name}`} 
      />

    </main>
  );
}