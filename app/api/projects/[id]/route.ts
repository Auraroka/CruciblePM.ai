import { NextResponse } from 'next/server';
import { ProjectService } from '@/services/projectService';
import { handleApiError } from '@/lib/api-error';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const json = await request.json();

        if (!json.name && !json.description) {
            return NextResponse.json({ success: false, error: 'Nothing to update' }, { status: 400 });
        }

        const project = await ProjectService.updateProject(params.id, {
            name: json.name,
            description: json.description,
        });

        return NextResponse.json({ success: true, data: project });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const project = await ProjectService.deleteProject(params.id);
        return NextResponse.json({ success: true, data: project });
    } catch (error) {
        return handleApiError(error);
    }
}
