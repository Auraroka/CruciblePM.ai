export default function Loading() {
    return (
        <div className="flex flex-col h-full w-full bg-white dark:bg-slate-950 animate-pulse">
            <div className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 bg-slate-50 dark:bg-slate-900 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                    <div className="h-4 w-px bg-slate-300 dark:bg-slate-700"></div>
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                        <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                    <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden relative bg-slate-50 dark:bg-[#0f1115]">
                {/* Background Grid Pattern Skeleton */}
                <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 10px 10px, #cbd5e1 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>

                {/* Center Loading Spinner Component */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-white dark:bg-[#111318] rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-xl flex items-center justify-center mb-6">
                        <div className="w-8 h-8 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-indigo-500 animate-[spin_0.8s_linear_infinite]"></div>
                    </div>
                    <div className="h-5 w-40 bg-slate-200 dark:bg-slate-800 rounded-lg mb-2"></div>
                    <div className="h-4 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
}
