import { getCurrentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome back, {user.email}</p>

      <div className="p-6 border rounded-lg bg-gray-50 max-w-sm">
        <h2 className="text-lg font-semibold mb-2">Workspace Credits</h2>
        {/* Credits now belong to the Tenant, so we hardcode 100 until we fetch the Tenant data */}
        <p className="text-4xl font-bold mt-2 text-[#EC4899]">100</p>
      </div>
    </div>
  );
}