import { NextResponse } from 'next/server';
import { TaskService } from '@/services/taskService';
import { handleApiError } from '@/lib/api-error';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const json = await request.json();

        // Allowed fields for update
        const updateData: any = {};

        if (json.title !== undefined) updateData.title = json.title;
        if (json.description !== undefined) updateData.description = json.description;
        if (json.status !== undefined) updateData.status = json.status;
        if (json.durationDays !== undefined) updateData.durationDays = json.durationDays;

        // Date handling
        if (json.startDate !== undefined) {
            updateData.startDate = json.startDate ? new Date(json.startDate) : null;
        }
        if (json.originalDeadline !== undefined) {
            updateData.originalDeadline = json.originalDeadline ? new Date(json.originalDeadline) : null;
        }
        if (json.deadline !== undefined) {
            updateData.deadline = json.deadline ? new Date(json.deadline) : null;
        }

        const task = await TaskService.updateTask(params.id, updateData);

        return NextResponse.json({ success: true, data: task });
    } catch (error) {
        return handleApiError(error);
    }
}
