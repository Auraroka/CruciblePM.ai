'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
    Controls,
    Background,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    Node,
    Edge,
    NodeChange,
    EdgeChange,
    Connection,
    Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';

import TaskNode from './TaskNode';
import { Plus } from 'lucide-react';

export default function ProjectMap({ projectId, initialTasks, onNodeClick }: { projectId: string; initialTasks: any[]; onNodeClick: (nodeInfo: any) => void }) {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [selectedTask, setSelectedTask] = useState<any | null>(null);

    // Initialize nodes and edges from database tasks AFTER mount to avoid hydration mismatch from random Math.random() positioning
    useEffect(() => {
        const newNodes: Node[] = initialTasks.map((task: any) => ({
            id: task.id,
            type: 'task',
            position: { x: task.positionX || Math.random() * 200, y: task.positionY || Math.random() * 200 },
            data: task,
        }));

        // Generate edges based on dependencies if populated
        const newEdges: Edge[] = initialTasks.flatMap((task: any) =>
            (task.dependencies || []).map((dep: any) => ({
                id: `e${dep.id}-${task.id}`,
                source: dep.id,
                target: task.id,
                type: 'smoothstep',
                animated: true
            }))
        );

        setNodes(newNodes);
        setEdges(newEdges);
    }, [initialTasks]);

    // Listen for updates from TaskPanel
    useEffect(() => {
        const handleTaskUpdate = (e: CustomEvent) => {
            const updatedData = e.detail;
            setNodes((nds) =>
                nds.map((node) => {
                    if (node.id === updatedData.id ||
                        // Fallback matching if node id wasn't passed perfectly
                        (node.data.title === updatedData.title && node.data.assignee === updatedData.assignee && !updatedData.id)) {
                        return { ...node, data: updatedData };
                    }
                    return node;
                })
            );
        };

        window.addEventListener('task-updated' as any, handleTaskUpdate);
        return () => window.removeEventListener('task-updated' as any, handleTaskUpdate);
    }, []);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const onConnect = useCallback(
        (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep', animated: true }, eds)),
        []
    );

    const handleAddTask = useCallback(async () => {
        try {
            const res = await fetch(`/api/projects/${projectId}/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: 'New Map Task',
                    status: 'pending',
                    positionX: 200 + Math.random() * 100,
                    positionY: 200 + Math.random() * 100,
                })
            });
            const { data } = await res.json();
            if (data) {
                const newNode: Node = {
                    id: data.id,
                    type: 'task',
                    position: { x: data.positionX, y: data.positionY },
                    data: data,
                };
                setNodes((nds) => [...nds, newNode]);
            }
        } catch (e) {
            console.error(e);
        }
    }, [projectId]);

    const handleNodeDragStop = useCallback(async (event: any, node: Node) => {
        // Save the new position to the database
        try {
            await fetch(`/api/tasks/${node.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    positionX: node.position.x,
                    positionY: node.position.y
                })
            });
        } catch (e) {
            console.error('Failed to save node position', e);
        }
    }, []);

    return (
        <div className="flex-1 w-full h-full relative" style={{ minHeight: "calc(100vh - 56px)" }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeDragStop={handleNodeDragStop}
                onNodeClick={(_, node) => {
                    setSelectedTask(node.data);
                    onNodeClick(node.data);
                }}
                nodeTypes={{ task: TaskNode }}
                fitView
                className="bg-slate-50 dark:bg-[#0f1115] font-sans"
            >
                <Background color="#cbd5e1" gap={16} size={1} />
                <Controls className="fill-slate-600 dark:fill-slate-300" />

                <Panel position="top-left" className="m-4">
                    <div className="bg-white dark:bg-slate-900 p-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 flex gap-2">
                        <button
                            onClick={handleAddTask}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Add Task
                        </button>
                    </div>
                </Panel>
            </ReactFlow>

            {nodes.length === 0 && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/50 dark:bg-[#0f1115]/80 backdrop-blur-sm pointer-events-none">
                    <div className="bg-white dark:bg-[#111318] p-8 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-xl text-center max-w-sm pointer-events-auto">
                        <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-5 rotate-3 hover:rotate-6 transition-transform">
                            <Plus className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Blank Canvas</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                            Your project map is empty. Start visualizing your workflow by adding the first structural task node.
                        </p>
                        <button
                            onClick={handleAddTask}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg shadow-lg shadow-indigo-500/20 active:scale-95 transition-all outline-none"
                        >
                            Add First Task
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
