'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, CheckCircle2, Clock, AlertCircle, TrendingUp, FolderGit2, ArrowUpRight } from 'lucide-react';
import NewProjectModal from '@/components/dashboard/NewProjectModal';

export default function DashboardClient({ projects, taskCounts }: { projects: any[]; taskCounts: any }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="p-8 lg:p-12 max-w-[1400px] mx-auto space-y-10 min-h-full bg-slate-50/50 dark:bg-slate-950">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
                        Overview
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                        Track your organization's projects and immediate blockers.
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm active:scale-95 group"
                >
                    <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
                    New Project
                </button>
            </div>

            {/* Premium Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                    { label: 'Completed', count: taskCounts.completed, icon: <CheckCircle2 className="w-5 h-5" />, color: "emerald", trend: "+12%" },
                    { label: 'In Progress', count: taskCounts.inProgress, icon: <Clock className="w-5 h-5" />, color: "blue", trend: "+4%" },
                    { label: 'Blocked Issues', count: taskCounts.blocked, icon: <AlertCircle className="w-5 h-5" />, color: "rose", trend: "-2%" }
                ].map((stat, i) => (
                    <div key={i} className="group relative bg-white dark:bg-[#111318] rounded-2xl p-6 border border-slate-200/60 dark:border-white/[0.06] shadow-sm hover:shadow-md transition-all overflow-hidden">
                        {/* Dynamic background blur ring based on color prop */}
                        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-125 ${stat.color === 'emerald' ? 'bg-emerald-500/10 dark:bg-emerald-500/5' :
                            stat.color === 'blue' ? 'bg-blue-500/10 dark:bg-blue-500/5' :
                                'bg-rose-500/10 dark:bg-rose-500/5'
                            }`} />
                        <div className="relative flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.label}</p>
                                <div className="flex items-baseline gap-3">
                                    <p className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                                        {stat.count}
                                    </p>
                                    <span className="text-xs font-medium text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3" /> {stat.trend}
                                    </span>
                                </div>
                            </div>
                            <div className={`p-3 bg-slate-50 dark:bg-white/[0.04] rounded-xl ring-1 ring-inset shadow-sm ${stat.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400 ring-emerald-500/20' :
                                stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400 ring-blue-500/20' :
                                    'text-rose-600 dark:text-rose-400 ring-rose-500/20'
                                }`}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Project Cards (Linear/Notion Inspired) */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">Active Projects</h2>
                    <button className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                        View all
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-6 gap-4">
                    {projects.length > 0 ? (
                        projects.map((project: any) => (
                            <Link key={project.id} href={`/project/${project.id}`} className="block group">
                                <div className="bg-white dark:bg-[#111318] rounded-2xl p-6 lg:p-8 border border-slate-200/60 dark:border-white/[0.06] shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-all duration-300">
                                    <div className="flex justify-between items-start mb-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/[0.04] flex items-center justify-center text-slate-600 dark:text-slate-300 ring-1 ring-inset ring-slate-200 dark:ring-white/[0.08] group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                <FolderGit2 className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-900 dark:text-white text-lg tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    {project.name}
                                                </h3>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Updated {mounted ? new Date(project.updatedAt).toLocaleDateString() : ''}</p>
                                            </div>
                                        </div>

                                        <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 md:-mr-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/[0.06] transition-colors opacity-0 group-hover:opacity-100">
                                            <ArrowUpRight className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 line-clamp-2 min-h-[40px] leading-relaxed">
                                        {project.description || "No description provided for this project space."}
                                    </p>

                                    {/* Progress Bar Mocked UI */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-medium">
                                            <span className="text-slate-500 dark:text-slate-400">Project Progress</span>
                                            <span className="text-slate-900 dark:text-white">64%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full w-[64%]" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-white/[0.04] text-xs font-medium text-slate-500 dark:text-slate-400">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-[#111318] bg-slate-200 dark:bg-slate-700 "></div>
                                            ))}
                                        </div>
                                        <span>{project._count?.tasks || 0} total nodes</span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full py-16 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 dark:border-white/[0.08] rounded-2xl bg-white/50 dark:bg-[#111318]/50">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <FolderGit2 className="w-6 h-6 text-slate-400" />
                            </div>
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">No active projects</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-sm">Get started by creating a new visual project map to track your work dependencies.</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="text-sm bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                Create First Project
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
