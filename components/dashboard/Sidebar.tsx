'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FolderGit2, Calendar, Settings, PieChart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils'; // Assuming we have or will create this soon

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { label: 'Dashboard', href: '/dashboard', icon: Home },
        { label: 'Website Launch', href: '/project/demo', icon: FolderGit2 },
        { label: 'Marketing Campaign', href: '/project/demo-2', icon: PieChart },
    ];

    return (
        <aside
            className={cn(
                "h-screen bg-[#0f1115] text-slate-300 border-r border-slate-800/60 flex flex-col shrink-0 flex-shrink-0 transition-all duration-300 ease-in-out relative group",
                isCollapsed ? "w-[68px]" : "w-64"
            )}
        >
            <div className="p-4 flex items-center justify-between h-14 shrink-0 shadow-sm border-b border-white/[0.04]">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20 shrink-0">
                        P
                    </div>
                    {!isCollapsed && <span className="font-semibold text-slate-100 tracking-tight whitespace-nowrap">Project Tower</span>}
                </div>
            </div>

            {/* Collapse Toggle Button - Only visible on hover or if collapsed */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3.5 top-20 bg-slate-800 text-slate-300 border border-slate-700/50 hover:border-slate-500 hover:text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all shadow-md z-10"
            >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            <div className="flex-1 overflow-y-auto py-6">
                <nav className="space-y-1.5 px-3">
                    <Link
                        href="/dashboard"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg group transition-all duration-200",
                            pathname === '/dashboard'
                                ? "bg-indigo-500/10 text-indigo-400"
                                : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                        )}
                    >
                        <Home className={cn("w-[18px] h-[18px] shrink-0", pathname === '/dashboard' ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300")} />
                        {!isCollapsed && <span>Dashboard</span>}
                    </Link>

                    <div className={cn(
                        "pt-6 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider transition-opacity duration-200 hidden md:block",
                        isCollapsed ? "opacity-0 px-0 h-0 overflow-hidden" : "opacity-100 px-3"
                    )}>
                        Active Projects
                    </div>

                    {navItems.slice(1).map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg group transition-all duration-200",
                                    isActive
                                        ? "bg-white/[0.06] text-white"
                                        : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                                )}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <Icon className={cn(
                                    "w-[18px] h-[18px] shrink-0 transition-colors",
                                    isActive ? "text-slate-200" : "text-slate-500 group-hover:text-slate-300",
                                    item.label.includes('Marketing') && !isActive && "group-hover:text-purple-400",
                                    item.label.includes('Website') && !isActive && "group-hover:text-emerald-400"
                                )} />
                                {!isCollapsed && <span className="truncate">{item.label}</span>}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            <div className="p-4 mt-auto">
                <nav className="space-y-1">
                    <Link href="/settings" className="flex items-center justify-center lg:justify-start gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-500 hover:bg-white/[0.04] hover:text-slate-200 group transition-all">
                        <Settings className="w-[18px] h-[18px] shrink-0" />
                        {!isCollapsed && <span>Settings</span>}
                    </Link>
                </nav>
            </div>
        </aside>
    );
}
