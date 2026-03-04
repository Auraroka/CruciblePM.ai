'use client';

import { Calendar as CalendarIcon, LayoutGrid } from 'lucide-react';
import Link from 'next/link';

export default function TimelinePage({ params }: { params: { id: string } }) {
    // Mock timeline data for UI purposes
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    const tasks = [
        { title: 'Design Database Schema', start: 1, duration: 2, status: 'completed' },
        { title: 'Setup Authentication API', start: 3, duration: 4, status: 'in progress' },
        { title: 'Create Basic UI Components', start: 5, duration: 3, status: 'pending' },
        { title: 'Integrate React Flow', start: 8, duration: 5, status: 'blocked' }
    ];

    return (
        <div className="flex flex-col h-full w-full bg-white dark:bg-slate-950">
            <div className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 bg-slate-50 dark:bg-slate-900 shrink-0">
                <div className="flex items-center gap-4">
                    <h2 className="font-semibold text-slate-900 dark:text-white">Timeline View</h2>
                    <div className="h-4 w-px bg-slate-300 dark:bg-slate-700"></div>
                    <div className="flex items-center gap-2">
                        <Link href={`/project/${params.id}`} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md border border-transparent transition-colors">
                            <LayoutGrid className="w-4 h-4" /> Map
                        </Link>
                        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            <CalendarIcon className="w-4 h-4" /> Timeline
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className="text-xl font-bold text-slate-900 dark:text-white mb-6">Project Schedule</div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                        {/* Timeline header */}
                        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                            <div className="w-64 shrink-0 p-4 font-medium text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800">
                                Task
                            </div>
                            <div className="flex-1 flex text-sm font-medium text-slate-500 dark:text-slate-400">
                                {months.map(m => (
                                    <div key={m} className="flex-1 p-4 border-r border-slate-200 dark:border-slate-800 last:border-0 text-center">
                                        {m}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Timeline rows */}
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {tasks.map((task, i) => (
                                <div key={i} className="flex group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <div className="w-64 shrink-0 p-4 text-sm font-medium text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800 group-hover:bg-white dark:group-hover:bg-slate-800/50 transition-colors line-clamp-1">
                                        {task.title}
                                    </div>
                                    <div className="flex-1 relative p-4 flex items-center">
                                        <div className="absolute top-0 bottom-0 left-0 right-0 flex pointer-events-none">
                                            {months.map((_, index) => (
                                                <div key={index} className="flex-1 border-r border-slate-100 dark:border-slate-800 last:border-0"></div>
                                            ))}
                                        </div>

                                        {/* Timeline bar */}
                                        <div
                                            className={`h-6 rounded-md shadow-sm relative z-10 ${task.status === 'completed' ? 'bg-green-500' :
                                                    task.status === 'in progress' ? 'bg-blue-500' :
                                                        task.status === 'blocked' ? 'bg-red-500' :
                                                            'bg-slate-400'
                                                }`}
                                            style={{
                                                marginLeft: `${(task.start / 24) * 100}%`,
                                                width: `${(task.duration / 24) * 100}%`
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
