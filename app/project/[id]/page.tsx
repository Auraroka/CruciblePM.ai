'use client';

import { useState } from 'react';
import ProjectMap from '@/components/project-map/ProjectMap';
import TaskPanel from '@/components/tasks/TaskPanel';
import Link from 'next/link';
import { LayoutGrid, AlertCircle, Calendar } from 'lucide-react';

export default function ProjectPage({ params }: { params: { id: string } }) {
    const [selectedTask, setSelectedTask] = useState<any | null>(null);

    return (
        <div className="flex flex-col h-full w-full bg-white dark:bg-slate-950">
            <div className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 bg-slate-50 dark:bg-slate-900 shrink-0">
                <div className="flex items-center gap-4">
                    <h2 className="font-semibold text-slate-900 dark:text-white">Project Map</h2>
                    <div className="h-4 w-px bg-slate-300 dark:bg-slate-700"></div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            <LayoutGrid className="w-4 h-4" /> Map
                        </button>
                        <Link href={`/project/${params.id}/timeline`} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors border border-transparent">
                            <Calendar className="w-4 h-4" /> Timeline
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 font-medium">
                        <AlertCircle className="w-4 h-4" /> 1 Blocked
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700 shadow-sm">
                        12 Active Tasks
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                <ProjectMap
                    projectId={params.id}
                    onNodeClick={(taskData) => setSelectedTask(taskData)}
                />
                {selectedTask && (
                    <TaskPanel
                        task={selectedTask}
                        onClose={() => setSelectedTask(null)}
                        onSave={(updatedTask) => {
                            // In a real app, you'd save to DB here. For now, reflect back to map
                            // We need to trigger a map update. We can pass a prop or use a ref. 
                            // Since we already lifted selectedTask state, let's just update it and
                            // map handles it via event bus or lifted state. 
                            // *Given the current architecture*, the nodes live in `ProjectMap`. 
                            // Let's pass the updated data to ProjectMap via an event or prop.

                            // Simplest approach: trigger a custom event that ProjectMap listens to
                            const event = new CustomEvent('task-updated', { detail: updatedTask });
                            window.dispatchEvent(event);
                        }}
                    />
                )}
            </div>
        </div>
    );
}
