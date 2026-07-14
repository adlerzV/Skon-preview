import { ShieldCheck } from "lucide-react";

export default function AdminBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`relative inline-flex group/adminbadge align-middle ${className}`}>
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-blue bg-brand-blue/10 border border-brand-blue/30 px-1.5 py-0.5 rounded-full shrink-0 cursor-help">
        <ShieldCheck size={11} strokeWidth={2.5} />
        ادمین
      </span>
      <span className="absolute bottom-[calc(100%+6px)] right-1/2 translate-x-1/2 w-44 bg-brand-menu border border-brand-surface_hover p-2.5 text-[11px] leading-relaxed text-brand-m_khonsa text-center opacity-0 invisible group-hover/adminbadge:opacity-100 group-hover/adminbadge:visible transition-all duration-150 z-50 shadow-xl pointer-events-none">
        این حساب متعلق به تیم پشتیبانی Arena2Battle است
        <span className="absolute top-full right-1/2 translate-x-1/2 border-[6px] border-transparent border-t-brand-surface_hover" />
      </span>
    </span>
  );
}