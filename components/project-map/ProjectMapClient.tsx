'use client';

import { useState, useEffect } from 'react';
import ProjectMap from '@/components/project-map/ProjectMap';
import TaskPanel from '@/components/tasks/TaskPanel';
import Link from 'next/link';
import { LayoutGrid, AlertCircle, Calendar } from 'lucide-react';

export default function ProjectMapClient({ projectId, initialTasks }: { projectId: string; initialTasks: any[] }) {
    const [selectedTask, setSelectedTask] = useState<any | null>(null);

    const blockedTasksCount = initialTasks.filter(t => t.status === 'blocked').length;
    const activeTasksCount = initialTasks.filter(t => t.status !== 'completed').length;

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Listen for manual interactions from TaskNode that bypass ReactFlow's strict click thresholds
    useEffect(() => {
        const handleForceClick = (e: Event) => {
            const customEvent = e as CustomEvent;
            setSelectedTask(customEvent.detail);
        };
        document.addEventListener('force-node-click', handleForceClick);
        return () => document.removeEventListener('force-node-click', handleForceClick);
    }, []);

    if (!isMounted) {
        return <div className="flex h-full w-full bg-slate-50 dark:bg-slate-950 items-center justify-center">Loading Map...</div>;
    }

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
                        <Link href={`/project/${projectId}/timeline`} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors border border-transparent">
                            <Calendar className="w-4 h-4" /> Timeline
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                    {blockedTasksCount > 0 && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 font-medium">
                            <AlertCircle className="w-4 h-4" /> {blockedTasksCount} Blocked
                        </div>
                    )}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700 shadow-sm">
                        {activeTasksCount} Active Tasks
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                <ProjectMap
                    projectId={projectId}
                    initialTasks={initialTasks}
                    onNodeClick={(taskData) => setSelectedTask(taskData)}
                />
                {selectedTask && (
                    <TaskPanel
                        task={selectedTask}
                        onClose={() => setSelectedTask(null)}
                        onSave={(updatedTask) => {
                            const event = new CustomEvent('task-updated', { detail: updatedTask });
                            window.dispatchEvent(event);
                        }}
                    />
                )}
            </div>
        </div>
    );
}
