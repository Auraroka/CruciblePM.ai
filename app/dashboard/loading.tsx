import { FolderGit2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function DashboardLoading() {
    return (
        <div className="p-8 lg:p-12 max-w-[1400px] mx-auto space-y-10 min-h-full bg-slate-50/50 dark:bg-slate-950 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                    <div className="h-9 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg mb-3"></div>
                    <div className="h-5 w-72 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                </div>
                <div className="h-10 w-36 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            </div>

            {/* Stats Row Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white dark:bg-[#111318] rounded-2xl p-6 border border-slate-200/60 dark:border-white/[0.06] shadow-sm h-32">
                        <div className="flex justify-between items-start">
                            <div className="space-y-3">
                                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                <div className="h-10 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Projects Grid Skeleton */}
            <div>
                <div className="flex items-center justify-between mb-6 border-b border-transparent">
                    <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-6 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white dark:bg-[#111318] rounded-2xl p-6 lg:p-8 border border-slate-200/60 dark:border-white/[0.06] shadow-sm">
                            <div className="flex justify-between items-start mb-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800"></div>
                                    <div className="space-y-2">
                                        <div className="h-5 w-40 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                        <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 mb-6">
                                <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
                                <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded"></div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                    <div className="h-3 w-8 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
