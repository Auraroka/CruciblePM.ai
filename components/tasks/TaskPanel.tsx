import { X, Calendar, User, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function TaskPanel({ task, onClose }: { task: any | null; onClose: () => void }) {
    const [isVisible, setIsVisible] = useState(false);

    // Trigger animation hook
    useEffect(() => {
        if (task) {
            setTimeout(() => setIsVisible(true), 10); // small tick for css transition
        } else {
            setIsVisible(false);
        }
    }, [task]);

    if (!task) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300",
                    isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300); // Wait for out slide animation
                }}
            />

            {/* Slide-over Panel */}
            <div
                className={cn(
                    "fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white dark:bg-[#111318] border-l border-slate-200 dark:border-white/[0.08] shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out",
                    isVisible ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="p-5 border-b border-slate-200 dark:border-white/[0.08] flex justify-between items-start bg-slate-50/50 dark:bg-white/[0.02]">
                    <div>
                        <div className="flex gap-2 items-center mb-1">
                            <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Task Detail</span>
                            <span className={cn(
                                "w-2 h-2 rounded-full",
                                task.status === 'completed' && "bg-emerald-500",
                                task.status === 'in progress' && "bg-blue-500",
                                task.status === 'pending' && "bg-slate-400",
                                task.status === 'blocked' && "bg-rose-500",
                            )}></span>
                        </div>
                        <h3 className="font-semibold text-slate-900 dark:text-white text-xl pr-4 leading-tight">{task.title || "Untitled Task"}</h3>
                    </div>
                    <button
                        onClick={() => {
                            setIsVisible(false);
                            setTimeout(onClose, 300);
                        }}
                        className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1.5 -me-1.5 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-5 flex-1 space-y-7 overflow-y-auto">
                    {/* Status Form Control */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-900 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" /> Lifecycle Status
                        </label>
                        <select
                            defaultValue={task.status}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
                        >
                            <option value="pending">Pending</option>
                            <option value="in progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="blocked">Blocked</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#111318]">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                                <User className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium">Assignee</span>
                            </div>
                            <div className="font-medium text-sm text-slate-900 dark:text-white">{task.assignee || 'Unassigned'}</div>
                        </div>

                        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#111318]">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium">Due Date</span>
                            </div>
                            <div className="font-medium text-sm text-slate-900 dark:text-white">{task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No date set'}</div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-slate-900 dark:text-slate-300 uppercase tracking-wider mb-2">Description</label>
                        <textarea
                            rows={5}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-y shadow-sm"
                            placeholder="Add comprehensive task details..."
                            defaultValue={task.description}
                        />
                    </div>
                </div>

                <div className="p-5 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#111318]">
                    <button
                        onClick={() => {
                            setIsVisible(false);
                            setTimeout(onClose, 300);
                        }}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </>
    );
}
