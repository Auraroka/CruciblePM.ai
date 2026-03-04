import { prisma } from '@/lib/prisma';
import SidebarWrapper from '@/components/dashboard/SidebarWrapper';
import Header from '@/components/dashboard/Header';
import { Database } from 'lucide-react';
import SchemaMap from '@/components/database/SchemaMap';

export const dynamic = 'force-dynamic';

export default async function DatabaseAdminPage() {
    // Fetch all records from all tables
    const [projects, tasks, users, milestones, dependencies] = await Promise.all([
        prisma.project.findMany({ orderBy: { createdAt: 'desc' } }),
        prisma.task.findMany({ orderBy: { createdAt: 'desc' } }),
        prisma.user.findMany({ orderBy: { createdAt: 'desc' } }),
        prisma.milestone.findMany({ orderBy: { createdAt: 'desc' } }),
        prisma.dependency.findMany(),
    ]);

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
            <SidebarWrapper />
            <div className="flex flex-col flex-1 w-full min-w-0">
                <Header />
                <main className="flex-1 overflow-auto p-8 lg:p-12">
                    <div className="max-w-[1400px] mx-auto space-y-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <Database className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Database Explorer</h1>
                                <p className="text-slate-500 dark:text-slate-400 mt-1">Direct read-only view into the SQLite backend store and relational mapping.</p>
                            </div>
                        </div>

                        {/* Interactive ERD Diagram */}
                        <div className="bg-white dark:bg-[#111318] rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm overflow-hidden flex flex-col p-1">
                            <SchemaMap />
                        </div>

                        {/* Project Table */}
                        <TableCard title="Projects" data={projects} columns={['id', 'name', 'description', 'createdAt']} />

                        {/* Task Table */}
                        <TableCard title="Tasks" data={tasks} columns={['id', 'title', 'status', 'projectId', 'assignedToId', 'positionX', 'positionY']} />

                        {/* Misc Tables */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <TableCard title="Dependencies" data={dependencies} columns={['id', 'taskId', 'dependsOnTaskId']} />
                            <TableCard title="Milestones" data={milestones} columns={['id', 'name', 'projectId', 'deadline']} />
                        </div>

                        <TableCard title="Users" data={users} columns={['id', 'email', 'name', 'createdAt']} />
                    </div>
                </main>
            </div>
        </div>
    );
}

// A reusable responsive table card for raw data
function TableCard({ title, data, columns }: { title: string; data: any[]; columns: string[] }) {
    return (
        <div className="bg-white dark:bg-[#111318] rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/[0.04] bg-slate-50/50 dark:bg-slate-900/30">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                        {data.length} records
                    </span>
                </div>
            </div>

            <div className="overflow-x-auto min-h-[150px]">
                {data.length > 0 ? (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-white/[0.04] text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900">
                                {columns.map((col) => (
                                    <th key={col} className="px-6 py-3 font-medium whitespace-nowrap">{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-slate-100 dark:divide-white/[0.04]">
                            {data.map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group">
                                    {columns.map((col) => (
                                        <td key={`${i}-${col}`} className="px-6 py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                                            {formatValue(row[col])}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="flex items-center justify-center p-8 text-slate-500 dark:text-slate-400 text-sm italic">
                        No records found in {title} table.
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper to reliably render JSON/Dates as strings
function formatValue(val: any): React.ReactNode {
    if (val === null || val === undefined) return <span className="text-slate-400 dark:text-slate-600">null</span>;
    if (val instanceof Date) return val.toLocaleString();
    if (typeof val === 'object') return JSON.stringify(val);
    if (typeof val === 'boolean') return val ? 'true' : 'false';
    return String(val);
}
