import { TaskService } from '@/services/taskService';
import ProjectMapClient from '@/components/project-map/ProjectMapClient';

export const dynamic = 'force-dynamic';

export default async function ProjectPage({ params }: { params: { id: string } }) {
    const tasks = await TaskService.getTasksByProjectId(params.id);

    return <ProjectMapClient projectId={params.id} initialTasks={tasks} />;
}
