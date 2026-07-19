import DashboardShell from "@/components/account/DashboardShell";
import MobileBottomNav from "@/components/Header/MobileBottomNav";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div
        className="min-h-screen w-full bg-brand-bg flex items-center justify-center p-5 pb-[calc(58px+env(safe-area-inset-bottom)+20px)] lg:pb-5"
        dir="rtl"
      >
        {children}
        <MobileBottomNav user={null} />
      </div>
    );
  }

  return (
    <DashboardShell user={{ avatarUrl: user.avatarUrl, name: user.name, isStaff: user.isStaff }}>
      {children}
    </DashboardShell>
  );
}