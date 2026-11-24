import type { Metadata } from "next";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-km-warm-white/70">
      {/* Soft colour wash behind the frosted surfaces */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 -top-24 h-[460px] w-[460px] rounded-full bg-km-orange/15 blur-[120px]" />
        <div className="absolute right-[-10%] top-[18%] h-[420px] w-[420px] rounded-full bg-amber-200/40 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[35%] h-[380px] w-[380px] rounded-full bg-emerald-100/40 blur-[120px]" />
      </div>
      <DashboardSidebar />
      <div className="lg:pl-[264px]">{children}</div>
    </div>
  );
}
