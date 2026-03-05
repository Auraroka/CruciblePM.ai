'use client';

import { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, LayoutGrid, AlertCircle, Clock, X, Save, Plus } from 'lucide-react';
import Link from 'next/link';

export default function TimelineClient({ projectId, initialTasks }: { projectId: string; initialTasks: any[] }) {
    const [tasks, setTasks] = useState(initialTasks);
    const [editingTask, setEditingTask] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<any>({});
    const [isSaving, setIsSaving] = useState(false);

    // Calculate dynamic date range based on tasks
    const { minDate, maxDate, dateColumns } = useMemo(() => {
        let min = new Date();
        let max = new Date();
        max.setMonth(max.getMonth() + 2); // Default outlook

        tasks.forEach(t => {
            if (t.startDate && new Date(t.startDate) < min) min = new Date(t.startDate);
            if (t.deadline && new Date(t.deadline) > max) max = new Date(t.deadline);
            if (t.originalDeadline && new Date(t.originalDeadline) > max) max = new Date(t.originalDeadline);
        });

        // Add padding
        min = new Date(min);
        min.setDate(min.getDate() - 7);
        max = new Date(max);
        max.setDate(max.getDate() + 14);

        const columns = [];
        let curr = new Date(min);
        // Step by weeks
        while (curr <= max) {
            columns.push(new Date(curr));
            curr.setDate(curr.getDate() + 7); // weekly columns
        }

        return { minDate: min, maxDate: max, dateColumns: columns };
    }, [tasks]);

    const totalDays = Math.max(1, (maxDate.getTime() - minDate.getTime()) / (1000 * 3600 * 24));

    const getLeftPos = (dateStr: string | null | undefined, fallback: Date = new Date()) => {
        if (!dateStr) return 0;
        const d = new Date(dateStr);
        const ratio = (d.getTime() - minDate.getTime()) / (1000 * 3600 * 24) / totalDays;
        return Math.max(0, Math.min(100, ratio * 100)); // Clamp 0-100
    };

    const handleEditClick = (task: any) => {
        setEditingTask(task.id);
        setEditForm({
            startDate: task.startDate ? new Date(task.startDate).toISOString().split('T')[0] : '',
            originalDeadline: task.originalDeadline ? new Date(task.originalDeadline).toISOString().split('T')[0] : '',
            deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '',
            status: task.status
        });
    };

    const handleSave = async (id: string) => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });
            const { data } = await res.json();
            if (data) {
                setTasks(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
                setEditingTask(null);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddTask = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/projects/${projectId}/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: 'New Timeline Task',
                    status: 'pending'
                })
            });
            const { data } = await res.json();
            if (data) {
                setTasks(prev => [...prev, data]);
                handleEditClick(data); // Auto-open edit mode for the new task
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-white dark:bg-slate-950 overflow-hidden">
            <div className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 bg-slate-50 dark:bg-slate-900 shrink-0">
                <div className="flex items-center gap-4">
                    <h2 className="font-semibold text-slate-900 dark:text-white">Timeline View</h2>
                    <div className="h-4 w-px bg-slate-300 dark:bg-slate-700"></div>
                    <div className="flex items-center gap-2">
                        <Link href={`/project/${projectId}`} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md border border-transparent transition-colors">
                            <LayoutGrid className="w-4 h-4" /> Map
                        </Link>
                        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                            <CalendarIcon className="w-4 h-4" /> Timeline
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-4 md:px-8 pt-4 pb-0 flex justify-end">
                <button
                    onClick={handleAddTask}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
                >
                    <Plus className="w-4 h-4" /> Add Task
                </button>
            </div>

            <div className="flex-1 overflow-auto p-4 md:p-8 pt-4">
                <div className="min-w-max bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm pb-10">

                    {/* Header Columns */}
                    <div className="flex sticky top-0 bg-slate-50 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-20">
                        <div className="w-72 shrink-0 p-4 font-medium text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800">
                            Task
                        </div>
                        <div className="flex-1 relative flex">
                            {dateColumns.map((col, i) => (
                                <div key={i} className="flex-1 p-3 text-xs font-semibold text-slate-500 dark:text-slate-400 border-r border-slate-200/50 dark:border-slate-800/50 text-center min-w-[80px]">
                                    {col.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Task Rows */}
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/60 relative">
                        {tasks.map(task => {
                            const isEditing = editingTask === task.id;

                            // Calculate timeline bar positions
                            const startPos = getLeftPos(task.startDate || task.createdAt);
                            const currentEndPos = getLeftPos(task.deadline || new Date().toISOString());
                            const originalEndPos = getLeftPos(task.originalDeadline);

                            const currentWidth = Math.max(1, currentEndPos - startPos);

                            // Determine delay & risk
                            const isDelayed = task.originalDeadline && task.deadline && new Date(task.deadline) > new Date(task.originalDeadline);
                            const isNearDeadline = task.status !== 'completed' && task.deadline && (new Date(task.deadline).getTime() - new Date().getTime()) < (3 * 24 * 3600 * 1000); // 3 days

                            return (
                                <div key={task.id} className="flex group relative hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                    {/* Task Name Column */}
                                    <div className="w-72 shrink-0 p-4 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-center bg-white dark:bg-slate-900 group-hover:bg-slate-50/50 dark:group-hover:bg-slate-800/20 z-10 transition-colors">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1">{task.title}</div>
                                            {task.status !== 'completed' && isDelayed && (
                                                <span title="Project Delayed">
                                                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                                                </span>
                                            )}
                                            {isNearDeadline && !isDelayed && (
                                                <span title="Nearing Deadline">
                                                    <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1 capitalize">{task.status}</div>

                                        {!isEditing && (
                                            <button
                                                onClick={() => handleEditClick(task)}
                                                className="mt-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity self-start hover:underline"
                                            >
                                                Edit Timeline
                                            </button>
                                        )}
                                    </div>

                                    {/* Timeline Grid Area */}
                                    <div className="flex-1 relative flex items-center min-h-[80px]">
                                        {/* Background Grid Lines */}
                                        <div className="absolute inset-0 flex pointer-events-none">
                                            {dateColumns.map((_, index) => (
                                                <div key={index} className="flex-1 border-r border-slate-200/30 dark:border-slate-800/30"></div>
                                            ))}
                                            {/* Today Line */}
                                            <div
                                                className="absolute top-0 bottom-0 border-l-2 border-dashed border-indigo-400/50 z-0"
                                                style={{ left: `${getLeftPos(new Date().toISOString())}%` }}
                                            />
                                        </div>

                                        {/* Edit Inline Form (Overlay) */}
                                        {isEditing ? (
                                            <div className="absolute inset-2 bg-white dark:bg-slate-800 rounded-lg shadow-xl ring-1 ring-slate-200 dark:ring-slate-700 p-3 z-30 flex items-center gap-4">
                                                <div className="flex flex-col gap-1">
                                                    <label className="text-[10px] uppercase text-slate-500 font-bold">Start Date</label>
                                                    <input type="date" value={editForm.startDate} onChange={e => setEditForm({ ...editForm, startDate: e.target.value })} className="text-sm px-2 py-1 rounded border dark:bg-slate-900 dark:border-slate-700" />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <label className="text-[10px] uppercase text-slate-500 font-bold">Planned Finish</label>
                                                    <input type="date" value={editForm.originalDeadline} onChange={e => setEditForm({ ...editForm, originalDeadline: e.target.value })} className="text-sm px-2 py-1 rounded border dark:bg-slate-900 dark:border-slate-700" />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <label className="text-[10px] uppercase text-rose-500 font-bold">Actual/New Deadline</label>
                                                    <input type="date" value={editForm.deadline} onChange={e => setEditForm({ ...editForm, deadline: e.target.value })} className="text-sm px-2 py-1 rounded border border-rose-200 dark:bg-slate-900 dark:border-rose-900 focus:ring-rose-500" />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <label className="text-[10px] uppercase text-slate-500 font-bold">Status</label>
                                                    <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })} className="text-sm px-2 py-1.5 rounded border dark:bg-slate-900 dark:border-slate-700">
                                                        <option value="pending">Pending</option>
                                                        <option value="in progress">In Progress</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="blocked">Blocked</option>
                                                    </select>
                                                </div>
                                                <div className="flex items-center gap-2 ml-auto">
                                                    <button onClick={() => setEditingTask(null)} disabled={isSaving} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => handleSave(task.id)} disabled={isSaving} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md disabled:opacity-50">
                                                        <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save'}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            /* Display Mode Bars */
                                            <div className="w-full relative h-[40px] z-10">
                                                {/* Planned Bar (if exists and different) */}
                                                {task.originalDeadline && (
                                                    <div
                                                        className="absolute top-2 h-2 rounded-full border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800/50"
                                                        style={{
                                                            left: `${startPos}%`,
                                                            width: `${Math.max(0.5, originalEndPos - startPos)}%`
                                                        }}
                                                        title="Initial Planned Baseline"
                                                    />
                                                )}

                                                {/* Current Actual Bar */}
                                                <div
                                                    className={`absolute bottom-2 h-4 rounded-full shadow-sm flex items-center group-hover:shadow-md transition-all cursor-pointer ${task.status === 'completed' ? 'bg-emerald-500' :
                                                        task.status === 'blocked' ? 'bg-rose-500' :
                                                            'bg-indigo-500 dark:bg-indigo-600'
                                                        }`}
                                                    style={{
                                                        left: `${startPos}%`,
                                                        width: `${currentWidth}%`
                                                    }}
                                                    onClick={() => handleEditClick(task)}
                                                >
                                                    {/* Delay Indicator Overlay (Red Strip) */}
                                                    {isDelayed && originalEndPos > 0 && originalEndPos < currentEndPos && (
                                                        <div
                                                            className="absolute top-0 bottom-0 right-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(255,255,255,0.3)_4px,rgba(255,255,255,0.3)_8px)] rounded-r-full"
                                                            style={{
                                                                width: `${((currentEndPos - originalEndPos) / currentWidth) * 100}%`
                                                            }}
                                                            title="Delayed Period"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {tasks.length === 0 && (
                            <div className="p-12 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                    <CalendarIcon className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">No tasks in this timeline</h3>
                                <p className="text-slate-500 max-w-sm mb-6">Create your first task to start building out your project schedule and tracking delays.</p>
                                <button
                                    onClick={handleAddTask}
                                    disabled={isSaving}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
                                >
                                    Create First Task
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
