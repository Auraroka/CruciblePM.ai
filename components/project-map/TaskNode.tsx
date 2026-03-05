import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

function TaskNode({ data, selected }: any) {
    const statusColors = {
        'pending': 'bg-slate-100 dark:bg-slate-800/50 text-slate-500',
        'in progress': 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
        'completed': 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        'blocked': 'bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400',
    };

    const statusIcons = {
        'pending': <Clock className="w-3 h-3" />,
        'in progress': <Clock className="w-3 h-3 animate-pulse" />,
        'completed': <CheckCircle2 className="w-3 h-3" />,
        'blocked': <AlertCircle className="w-3 h-3" />,
    };

    const status = data.status || 'pending';

    const handleNodeClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Try to prevent ReactFlow from eating it
        const event = new CustomEvent('force-node-click', { detail: data });
        window.dispatchEvent(event);
    };

    return (
        <div className="relative group cursor-pointer z-50" onClick={handleNodeClick}>
            {/* Details tooltip on Hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 dark:bg-slate-800 text-white text-xs rounded-lg shadow-xl opacity-0 translate-y-2 pointer-events-none peer-hover:opacity-100 peer-hover:translate-y-0 transition-all z-50 duration-200">
                <div className="font-semibold mb-1 text-sm">{data.title}</div>
                <div className="text-slate-300 line-clamp-2 leading-relaxed">{data.description || "No description provided."}</div>
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-700">
                    <span className="text-slate-400">Due: {data.deadline ? new Date(data.deadline).toLocaleDateString() : 'N/A'}</span>
                    <span className="font-medium text-indigo-400">Click to edit</span>
                </div>
                {/* Tooltip caret */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-800"></div>
            </div>

            <div className={cn(
                "peer px-4 py-3 shadow-sm rounded-xl bg-white dark:bg-[#111318] border transition-all duration-300 min-w-[220px] max-w-[260px] hover:shadow-lg hover:-translate-y-1 relative overflow-hidden",
                selected
                    ? "border-indigo-500 shadow-indigo-500/20 ring-1 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-950"
                    : "border-slate-200 dark:border-white/[0.08] hover:border-indigo-400/50"
            )}>
                {/* Focus Glow Background */}
                {selected && <div className="absolute inset-0 bg-indigo-50 dark:bg-indigo-500/5 blur-xl"></div>}

                <div className="relative z-10">
                    {/* Target handle for incoming edges */}
                    <Handle
                        type="target"
                        position={Position.Left}
                        className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600 border-2 border-white dark:border-[#111318] hover:bg-indigo-500 hover:scale-125 transition-all"
                    />

                    <div className="flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-3">
                            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 leading-tight">
                                {data.title}
                            </div>
                            {data.assignee && (
                                <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-[10px] font-bold shrink-0 ring-2 ring-white dark:ring-[#111318]">
                                    {data.assignee}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className={cn(
                                "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm border border-black/5 dark:border-white/5",
                                statusColors[status as keyof typeof statusColors]
                            )}>
                                {statusIcons[status as keyof typeof statusIcons]}
                                {status}
                            </div>

                            {data.deadline && (
                                <div className={cn(
                                    "text-[10px] font-medium px-2 py-1 rounded flex items-center gap-1",
                                    data.originalDeadline && new Date(data.deadline) > new Date(data.originalDeadline)
                                        ? "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20"
                                        : "text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/[0.04]"
                                )}>
                                    {data.originalDeadline && new Date(data.deadline) > new Date(data.originalDeadline) && (
                                        <AlertCircle className="w-3 h-3" />
                                    )}
                                    {new Date(data.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Source handle for outgoing edges */}
                    <Handle
                        type="source"
                        position={Position.Right}
                        className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600 border-2 border-white dark:border-[#111318] hover:bg-indigo-500 hover:scale-125 transition-all"
                    />
                </div>
            </div>
        </div>
    );
}

export default memo(TaskNode);
