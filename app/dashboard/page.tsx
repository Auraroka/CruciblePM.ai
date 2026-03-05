import { ProjectService } from '@/services/projectService';
import { TaskService } from '@/services/taskService';
import DashboardClient from '@/components/dashboard/DashboardClient';

// Helper to fetch data
export const dynamic = 'force-dynamic';

async function getDashboardData() {
    try {
        const rawProjects = await ProjectService.getProjects({ includeTasksCount: true, take: 10 });

        // Format dates on the server to prevent hydration mismatches and save client CPU cycles
        const projects = rawProjects.map(p => ({
            ...p,
            formattedUpdatedAt: new Date(p.updatedAt).toLocaleDateString()
        }));

        const taskCounts = {
            completed: await TaskService.countTasksByStatus('completed'),
            inProgress: await TaskService.countTasksByStatus('in progress'),
            blocked: await TaskService.countTasksByStatus('blocked')
        };

        return { projects, taskCounts, hasData: true };
    } catch (error) {
        return { projects: [], taskCounts: { completed: 0, inProgress: 0, blocked: 0 }, hasData: false };
    }
}

export default async function DashboardPage() {
    const { projects, taskCounts } = await getDashboardData();
    return <DashboardClient projects={projects} taskCounts={taskCounts} />;
}
