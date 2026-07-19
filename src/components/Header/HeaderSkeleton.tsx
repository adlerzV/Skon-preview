// src/components/Header/HeaderSkeleton.tsx
import Skeleton from "@/components/ui/Skeleton";

export default function HeaderSkeleton() {
  return (
    <>
      <header className="w-full sticky top-0 z-[10000] bg-[#15171e]">
        <div className="hidden lg:flex w-full items-center justify-between h-[60px] px-6 max-w-[1600px] mx-auto">
          <div className="flex items-center gap-8">
            <Skeleton className="h-9 w-[100px]" />
            <div className="flex items-center gap-6">
              <Skeleton className="h-5 w-14" />
              <Skeleton className="h-5 w-12" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>

        <div className="hidden lg:flex w-full justify-center bg-brand-bg">
          <div className="flex w-full container mx-auto px-6 max-w-[1600px] py-[10px] gap-[8px] h-[80px]">
            <div className="flex items-center flex-1 gap-3 bg-brand-surface h-full pl-4 rounded-[5px]">
              <Skeleton className="w-9 h-9 rounded-full shrink-0" />
              <div className="flex items-center gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="w-9 h-9 rounded-md shrink-0" />
                ))}
              </div>
            </div>
            <Skeleton className="flex-1 max-w-[400px] h-full rounded-[5px]" />
            <Skeleton className="w-[140px] h-full rounded-[5px] shrink-0" />
          </div>
        </div>

        <div className="lg:hidden flex items-center justify-between h-[60px] px-4 bg-brand-bg border-b border-white/5">
          <Skeleton className="w-10 h-10 rounded-md" />
          <Skeleton className="h-[30px] w-[90px]" />
          <div className="flex items-center gap-1.5">
            <Skeleton className="w-6 h-4 rounded-[2px]" />
            <Skeleton className="w-9 h-9 rounded-md" />
          </div>
        </div>
      </header>

      <div className="lg:hidden fixed bottom-0 inset-x-0 z-[9997] bg-[#15171e] border-t border-white/5 h-[58px] grid grid-cols-4 items-center px-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center justify-center gap-1.5">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="w-8 h-2 rounded" />
          </div>
        ))}
      </div>
    </>
  );
}