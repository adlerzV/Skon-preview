// src/app/my-account/tickets/page.tsx
import { Card } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

export default async function TicketsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black text-white">تیکت‌های پشتیبانی</h1>
        <Link href="/my-account/tickets/new" className="bg-brand-blue text-white text-sm font-bold px-4 py-2.5">
          + تیکت جدید
        </Link>
      </div>
    </div>
  );
}