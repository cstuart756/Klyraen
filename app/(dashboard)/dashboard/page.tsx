import { getCurrentUser } from "@/lib/current-user";
import { requireTenantId } from "@/lib/db/tenant";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Zap, Music, Disc } from "lucide-react";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const tenantId = await requireTenantId();
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: {
      _count: {
        select: { generations: true }
      }
    }
  });

  if (!tenant) redirect("/studio");

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B0C10] text-white selection:bg-[#8B5CF6]/30 relative">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-8 lg:p-12 relative scroll-smooth z-10">
        <div className="max-w-5xl mx-auto pb-24">
          
          <h1 className="text-3xl font-bold font-sora tracking-tight mb-2">Dashboard</h1>
          <p className="text-gray-400 mb-10">Welcome back, {user.email}</p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Credits Card */}
            <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#8B5CF6]/20 blur-[50px] group-hover:bg-[#8B5CF6]/40 transition-all" />
              <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/20 flex items-center justify-center mb-6 border border-[#8B5CF6]/30">
                <Zap className="w-6 h-6 text-[#8B5CF6]" />
              </div>
              <h2 className="text-lg font-medium text-gray-400 mb-1">Workspace Credits</h2>
              <p className="text-5xl font-bold font-sora text-white">{tenant.credits}</p>
            </div>

            {/* Total Generations Card */}
            <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#EC4899]/20 blur-[50px] group-hover:bg-[#EC4899]/40 transition-all" />
              <div className="w-12 h-12 rounded-xl bg-[#EC4899]/20 flex items-center justify-center mb-6 border border-[#EC4899]/30">
                <Disc className="w-6 h-6 text-[#EC4899]" />
              </div>
              <h2 className="text-lg font-medium text-gray-400 mb-1">Total Generations</h2>
              <p className="text-5xl font-bold font-sora text-white">{tenant._count.generations}</p>
            </div>

            {/* Current Plan Card */}
            <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#06B6D4]/20 blur-[50px] group-hover:bg-[#06B6D4]/40 transition-all" />
              <div className="w-12 h-12 rounded-xl bg-[#06B6D4]/20 flex items-center justify-center mb-6 border border-[#06B6D4]/30">
                <Music className="w-6 h-6 text-[#06B6D4]" />
              </div>
              <h2 className="text-lg font-medium text-gray-400 mb-1">Current Plan</h2>
              <p className="text-3xl font-bold font-sora text-white">Free Tier</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}