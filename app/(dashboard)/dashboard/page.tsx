import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function DashboardPage() {
  const user = await getCurrentUser().catch(() => null);
  if (!user) return redirect("/sign-in");

  const generations = await prisma.generation.count({ where: { userId: user.id } });
  const completed = await prisma.generation.count({ where: { userId: user.id, status: "COMPLETED" } });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-light text-white">Growth Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-[#8B5CF6]/30 bg-[#0F0F1A]">
          <p className="text-sm text-gray-400">Total Generations</p>
          <p className="text-4xl font-bold mt-2 text-[#00D9FF]">{generations}</p>
        </div>
        <div className="p-6 rounded-xl border border-[#8B5CF6]/30 bg-[#0F0F1A]">
          <p className="text-sm text-gray-400">Completed Tracks</p>
          <p className="text-4xl font-bold mt-2 text-[#8B5CF6]">{completed}</p>
        </div>
        <div className="p-6 rounded-xl border border-[#8B5CF6]/30 bg-[#0F0F1A]">
          <p className="text-sm text-gray-400">Credits Remaining</p>
          <p className="text-4xl font-bold mt-2 text-[#EC4899]">{user.credits}</p>
        </div>
      </div>

      {/* Replaced placeholder with your actual UI mockup */}
      <div className="rounded-xl border border-[#8B5CF6]/30 overflow-hidden relative h-[400px]">
        <Image 
          src="/images/dashboard-mockup.png" 
          alt="Klyraen Analytics Dashboard" 
          fill
          className="object-cover opacity-80"
        />
      </div>
    </div>
  );
}