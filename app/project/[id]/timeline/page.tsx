import { TaskService } from '@/services/taskService';
import TimelineClient from '@/components/timeline/TimelineClient';

export const dynamic = 'force-dynamic';

export default async function TimelinePage({ params }: { params: { id: string } }) {
    // Fetch all tasks for the current project in the server component
    const tasks = await TaskService.getTasksByProjectId(params.id);

    return (
        <TimelineClient projectId={params.id} initialTasks={tasks} />
    );
}
