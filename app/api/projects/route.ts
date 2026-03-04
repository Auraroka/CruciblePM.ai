import { NextResponse } from 'next/server';
import { ProjectService } from '@/services/projectService';
import { handleApiError } from '@/lib/api-error';

export async function GET() {
    try {
        const projects = await ProjectService.getProjects({ includeTasksCount: true });
        return NextResponse.json(projects);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(request: Request) {
    try {
        const json = await request.json();

        if (!json.name) {
            return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
        }

        const project = await ProjectService.createProject({
            name: json.name,
            description: json.description,
        });

        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        return handleApiError(error);
    }
}
