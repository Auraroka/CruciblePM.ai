'use client';

import React, { useEffect, useState, useMemo } from 'react';
import ReactFlow, { Background, Controls, Edge, Node, Position, Handle, useReactFlow, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import { Database, Plus, Loader2 } from 'lucide-react';

// Define AST Types matching the backend
interface PrismaField {
    name: string;
    type: string;
    isId: boolean;
    isOptional: boolean;
    isList: boolean;
    isUnique: boolean;
    attributes: string;
    isRelation: boolean;
}

interface PrismaModel {
    name: string;
    fields: PrismaField[];
}

// Global modal state since we need to trigger it from inside Nodes
let setModalStateGlobal: any = null;

const TableNode = ({ data }: any) => {
    return (
        <div className="bg-white dark:bg-[#111318] rounded-xl border border-slate-200 dark:border-white/[0.08] shadow-lg overflow-hidden w-64 group relative">
            <div className="bg-indigo-50 dark:bg-indigo-900/30 px-4 py-3 border-b border-indigo-100 dark:border-indigo-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="font-semibold text-slate-900 dark:text-white">{data.label}</span>
                </div>
                {/* Add Field Button */}
                <button
                    onClick={() => setModalStateGlobal({ type: 'addField', modelName: data.label })}
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-100 dark:bg-indigo-500/20 hover:bg-indigo-200 dark:hover:bg-indigo-500/40 text-indigo-600 dark:text-indigo-300 p-1 rounded-md"
                    title="Add Field"
                >
                    <Plus className="w-3.5 h-3.5" />
                </button>
            </div>
            <div className="p-0 flex flex-col max-h-[300px] overflow-y-auto w-full">
                {data.fields.map((field: PrismaField, idx: number) => (
                    <div key={field.name} className="relative flex justify-between items-center px-4 py-2 text-xs border-b last:border-0 border-slate-100 dark:border-white/[0.04]">
                        {/* Target Hook */}
                        <Handle type="target" position={Position.Left} id={`t-${field.name}`} className="w-2 h-2 !bg-indigo-500 -ml-5 opacity-0" />

                        <div className="flex items-center gap-2">
                            {field.isId && <span className="text-[10px] font-bold text-amber-500">PK</span>}
                            {field.isRelation && <span className="text-[10px] font-bold text-slate-400">FK</span>}
                            <span className="font-medium text-slate-700 dark:text-slate-300">{field.name}</span>
                        </div>
                        <span className="text-slate-400 font-mono text-[10px]">
                            {field.type}{field.isOptional ? '?' : ''}{field.isList ? '[]' : ''}
                        </span>

                        {/* Source Hook */}
                        <Handle type="source" position={Position.Right} id={`s-${field.name}`} className="w-2 h-2 !bg-indigo-500 -mr-5 opacity-0" />
                    </div>
                ))}
            </div>
        </div>
    );
};

const nodeTypes = {
    table: TableNode,
};

function FlowCanvas() {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMutating, setIsMutating] = useState(false);

    const [modalConfig, setModalConfig] = useState<{ type: 'none' | 'addModel' | 'addField', modelName?: string }>({ type: 'none' });

    // Sync state handle
    setModalStateGlobal = setModalConfig;

    // Fetch live AST
    const fetchSchema = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/schema');
            const { data } = await res.json();
            if (data) reconcileData(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const reconcileData = (models: PrismaModel[]) => {
        const newNodes: Node[] = [];
        const newEdges: Edge[] = [];

        // Basic layout engine 
        models.forEach((model, index) => {
            const col = index % 3;
            const row = Math.floor(index / 3);

            newNodes.push({
                id: model.name,
                type: 'table',
                position: { x: col * 350 + 50, y: row * 400 + 50 },
                data: {
                    label: model.name,
                    fields: model.fields,
                },
            });

            // Find foreign keys (relations)
            model.fields.forEach(f => {
                if (f.isRelation) {
                    // Primitive matching: if Type matches another Model, draw edge
                    const targetModel = models.find(m => m.name === f.type);
                    if (targetModel) {
                        newEdges.push({
                            id: `e-${model.name}-${f.name}-${targetModel.name}`,
                            source: targetModel.name, // Assuming the 1 side is source
                            sourceHandle: `s-id`,
                            target: model.name,
                            targetHandle: `t-${f.name}`,
                            type: 'smoothstep',
                            animated: true,
                            style: { stroke: '#818cf8', strokeWidth: 2 },
                        });
                    }
                }
            });
        });

        setNodes(newNodes);
        setEdges(newEdges);
    };

    useEffect(() => {
        fetchSchema();
    }, []);

    // Mutation Handlers
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsMutating(true);

        const form = new FormData(e.currentTarget);

        const payload: any = {};
        if (modalConfig.type === 'addField') {
            payload.modelName = modalConfig.modelName;
            payload.fieldName = form.get('fieldName') as string;
            payload.fieldType = form.get('fieldType') as string;
            payload.isOptional = form.get('isOptional') === 'on';
        } else {
            payload.modelName = form.get('tableName') as string;
        }

        try {
            const res = await fetch('/api/schema', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: modalConfig.type, payload })
            });
            const { success, data } = await res.json();
            if (success && data) {
                reconcileData(data);
                setModalConfig({ type: 'none' });
            } else {
                alert("Modification failed. Check backend logs.");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsMutating(false);
        }
    };


    if (loading) return <div className="w-full h-full flex items-center justify-center text-slate-500"><Loader2 className="w-8 h-8 animate-spin" /></div>;

    return (
        <div className="w-full h-full relative">
            {/* Top Toolbar */}
            <div className="absolute top-4 right-4 z-10">
                <button
                    onClick={() => setModalConfig({ type: 'addModel' })}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add Table
                </button>
            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={() => { }} // Readonly layout dragging allowed
                fitView
                className="font-sans"
            >
                <Background color="#cbd5e1" gap={16} size={1} />
                <Controls className="fill-slate-600 dark:fill-slate-300" />
            </ReactFlow>

            {/* Config Modal overlay */}
            {modalConfig.type !== 'none' && (
                <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white dark:bg-[#1e2128] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-sm">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                            {modalConfig.type === 'addModel' ? 'Create New Table' : `Add Field to ${modalConfig.modelName}`}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {modalConfig.type === 'addModel' ? (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Table Name</label>
                                    <input required name="tableName" pattern="[A-Za-z0-9_]+" className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" placeholder="e.g. Invoice" />
                                    <p className="text-xs text-slate-500 mt-1">Alphanumeric characters only. PascalCase recommended.</p>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Field Name</label>
                                        <input required name="fieldName" pattern="[a-zA-Z0-9_]+" className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" placeholder="e.g. status" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Field Type</label>
                                        <select required name="fieldType" className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                                            <option value="String">String</option>
                                            <option value="Int">Integer</option>
                                            <option value="Boolean">Boolean</option>
                                            <option value="Float">Float</option>
                                            <option value="DateTime">DateTime</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" name="isOptional" id="isOptional" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
                                        <label htmlFor="isOptional" className="text-sm text-slate-700 dark:text-slate-300">Is Optional (nullable)?</label>
                                    </div>
                                </>
                            )}

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setModalConfig({ type: 'none' })} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">Cancel</button>
                                <button type="submit" disabled={isMutating} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm disabled:opacity-50">
                                    {isMutating && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {isMutating ? 'Applying DB Migration...' : 'Save & Migrate DB'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function SchemaMap() {
    return (
        <div className="w-full h-[600px] bg-slate-50 dark:bg-[#0f1115]">
            <ReactFlowProvider>
                <FlowCanvas />
            </ReactFlowProvider>
        </div>
    );
}
