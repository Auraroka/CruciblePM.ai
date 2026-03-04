export default function ProjectLoading() {
    return (
        <div className="flex flex-col h-[calc(100vh-64px)] w-full bg-white dark:bg-slate-950 animate-pulse">
            {/* Header Toolbar Skeleton */}
            <div className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 bg-slate-50 dark:bg-slate-900 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    <div className="h-4 w-px bg-slate-300 dark:bg-slate-700"></div>
                    <div className="flex gap-2">
                        <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                        <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                    <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                </div>
            </div>

            {/* Visual Canvas Skeleton Background */}
            <div className="flex-1 w-full bg-slate-50/50 dark:bg-[#0f1115] relative overflow-hidden flex items-center justify-center">
                {/* Grid Pattern Dots Mock */}
                <div className="absolute inset-0 z-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)', backgroundSize: '24px 24px' }}>
                </div>

                {/* Ghost Nodes */}
                <div className="relative z-10 w-64 h-24 bg-white dark:bg-[#111318] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded mb-4"></div>
                    <div className="h-6 w-20 bg-slate-100 dark:bg-slate-700 rounded-md inline-block"></div>
                </div>
                <div className="relative z-10 w-64 h-24 bg-white dark:bg-[#111318] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 absolute top-1/2 right-1/4 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded mb-4"></div>
                    <div className="h-6 w-20 bg-slate-100 dark:bg-slate-700 rounded-md inline-block"></div>
                </div>

                {/* Map Loading Centered Indicator */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-50">
                    <div className="w-8 h-8 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin"></div>
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading graphical layout...</div>
                </div>
            </div>
        </div>
    );
}
