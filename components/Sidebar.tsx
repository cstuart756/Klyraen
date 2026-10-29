"use client";
import Link from "next/link";
import { Home, PenTool, Library, FolderOpen, Heart, ListMusic, User, Settings, Zap } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export function Sidebar() {
  const links = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Create", href: "/studio", icon: PenTool },
    { name: "Library", href: "/library", icon: Library },
    { name: "Projects", href: "/projects", icon: FolderOpen },
    { name: "Likes", href: "/likes", icon: Heart },
    { name: "Playlists", href: "/playlists", icon: ListMusic },
  ];

  return (
    <aside className="w-64 h-screen bg-[#0B0C10] border-r border-white/10 flex flex-col shrink-0 z-50">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3">
          <Zap className="text-[#8B5CF6] w-7 h-7" />
          <span className="text-xl font-bold font-sora tracking-widest text-white">KLYRAEN</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <Link key={link.name} href={link.href} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-gray-400 hover:text-white group">
            <link.icon className="w-5 h-5 group-hover:text-[#8B5CF6] transition-colors" />
            <span className="font-medium text-sm">{link.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-1">
        <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-gray-400 hover:text-white">
          <User className="w-5 h-5" />
          <span className="font-medium text-sm">Profile</span>
        </Link>
        <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-gray-400 hover:text-white">
          <Settings className="w-5 h-5" />
          <span className="font-medium text-sm">Settings</span>
        </Link>
        <div className="pt-4 flex items-center gap-3 px-4">
          <UserButton afterSignOutUrl="/" />
          <span className="text-sm font-medium text-gray-300">My Account</span>
        </div>
      </div>
    </aside>
  );
}