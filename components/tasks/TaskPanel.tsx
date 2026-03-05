import { X, Calendar, User, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function TaskPanel({ task, onClose, onSave }: { task: any | null; onClose: () => void; onSave?: (updatedTask: any) => void }) {
    const [isVisible, setIsVisible] = useState(false);
    const [taskData, setTaskData] = useState<any>(null);
    const [newComment, setNewComment] = useState("");


    // Trigger animation hook
    useEffect(() => {
        if (task) {
            setTaskData({ ...task, comments: task.comments || [] });
            setTimeout(() => setIsVisible(true), 10); // small tick for css transition
        } else {
            setIsVisible(false);
            setTimeout(() => setTaskData(null), 300);
        }
    }, [task]);

    if (!task || !taskData) return null;

    const handleSave = () => {
        if (onSave) {
            onSave(taskData);
        }
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        const comment = {
            id: `comment-${Date.now()}`,
            text: newComment.trim(),
            author: 'Current User', // Placeholder for actual user system
            createdAt: new Date().toISOString()
        };

        setTaskData({
            ...taskData,
            comments: [...taskData.comments, comment]
        });
        setNewComment("");
    };

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
                        <h3 className="font-semibold text-slate-900 dark:text-white text-xl pr-4 leading-tight">{taskData.title || "Untitled Task"}</h3>
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
                            value={taskData.status}
                            onChange={(e) => setTaskData({ ...taskData, status: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
                        >
                            <option value="pending">Pending</option>
                            <option value="in progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="blocked">Blocked</option>
                        </select>
                    </div>

                    {/* Delay/Risk Banner */}
                    {taskData.originalDeadline && taskData.deadline && new Date(taskData.deadline) > new Date(taskData.originalDeadline) && (
                        <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-lg p-3 flex items-start gap-3 shadow-sm">
                            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-semibold text-rose-700 dark:text-rose-400">Schedule Delay Risk</h4>
                                <p className="text-xs text-rose-600 dark:text-rose-300 mt-1">
                                    Current due date is past the original deadline. This task is at risk of causing downstream delays.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="p-4 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#111318]">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
                            <User className="w-3.5 h-3.5" />
                            <span className="text-xs font-medium tracking-wide">Assignee</span>
                        </div>
                        <input
                            type="text"
                            value={taskData.assignee || ''}
                            onChange={(e) => setTaskData({ ...taskData, assignee: e.target.value })}
                            placeholder="Enter assignee name..."
                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white rounded-md p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#111318]">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
                                <Calendar className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium tracking-wide leading-tight">Original Due Date</span>
                            </div>
                            <input
                                type="date"
                                value={taskData.originalDeadline ? new Date(taskData.originalDeadline).toISOString().split('T')[0] : ''}
                                onChange={(e) => setTaskData({ ...taskData, originalDeadline: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white rounded-md p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                            />
                        </div>

                        <div className="p-4 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#111318]">
                            <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400 mb-2">
                                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                                <span className="text-xs font-medium tracking-wide leading-tight">Current Due Date</span>
                            </div>
                            <input
                                type="date"
                                value={taskData.deadline ? new Date(taskData.deadline).toISOString().split('T')[0] : ''}
                                onChange={(e) => setTaskData({ ...taskData, deadline: e.target.value })}
                                className="w-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-900 dark:text-indigo-100 rounded-md p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-slate-900 dark:text-slate-300 uppercase tracking-wider mb-2">Description</label>
                        <textarea
                            rows={4}
                            value={taskData.description || ''}
                            onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-y shadow-sm"
                            placeholder="Add comprehensive task details..."
                        />
                    </div>

                    {/* Comments Section */}
                    <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/[0.08]">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            Comments <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 py-0.5 px-2 rounded-full text-xs">{taskData.comments?.length || 0}</span>
                        </h4>

                        <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                            {taskData.comments?.length > 0 ? (
                                taskData.comments.map((comment: any) => (
                                    <div key={comment.id} className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg text-sm border border-slate-100 dark:border-white/[0.04]">
                                        <div className="flex justify-between items-start mb-1.5">
                                            <span className="font-medium text-indigo-600 dark:text-indigo-400 text-xs">{comment.author}</span>
                                            <span className="text-[10px] text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{comment.text}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-sm text-slate-500 dark:text-slate-400 italic">
                                    No comments yet.
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                rows={2}
                                placeholder="Add a comment to track progress..."
                                className="w-full bg-white dark:bg-[#111318] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-y shadow-sm"
                            />
                            <button
                                onClick={handleAddComment}
                                disabled={!newComment.trim()}
                                className="self-end bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 px-4 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Post Comment
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-5 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#111318]">
                    <button
                        onClick={handleSave}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </>
    );
}
