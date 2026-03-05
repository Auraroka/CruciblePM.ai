import { NextResponse } from 'next/server';
import { TaskService } from '@/services/taskService';
import { handleApiError } from '@/lib/api-error';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const tasks = await TaskService.getTasksByProjectId(params.id);
        return NextResponse.json({ success: true, data: tasks });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
    try {
        const json = await request.json();

        if (!json.title) {
            return NextResponse.json({ success: false, error: 'Task title is required' }, { status: 400 });
        }

        const taskData: any = {
            title: json.title,
            description: json.description,
            status: json.status || 'pending',
            deadline: json.deadline ? new Date(json.deadline) : null,
            durationDays: json.durationDays || 1,
            positionX: json.positionX || 0,
            positionY: json.positionY || 0,
        };

        if (json.assignedToId) {
            taskData.assignedTo = { connect: { id: json.assignedToId } };
        }

        const task = await TaskService.createTask(params.id, taskData);

        return NextResponse.json({ success: true, data: task }, { status: 201 });
    } catch (error) {
        return handleApiError(error);
    }
}
