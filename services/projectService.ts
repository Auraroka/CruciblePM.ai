import { prisma as db } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export class ProjectService {
    /**
     * Fetch all projects with optional relations included
     */
    static async getProjects(options?: { includeTasksCount?: boolean }) {
        return db.project.findMany({
            orderBy: { updatedAt: 'desc' },
            include: {
                ...(options?.includeTasksCount && {
                    _count: { select: { tasks: true } }
                })
            }
        });
    }

    /**
     * Fetch a single project by ID
     */
    static async getProjectById(id: string) {
        return db.project.findUnique({
            where: { id },
        });
    }

    /**
     * Create a new project
     */
    static async createProject(data: { name: string; description?: string }) {
        return db.project.create({
            data,
        });
    }

    /**
     * Update a project
     */
    static async updateProject(id: string, data: Prisma.ProjectUpdateInput) {
        return db.project.update({
            where: { id },
            data
        });
    }

    /**
     * Delete a project
     */
    static async deleteProject(id: string) {
        return db.project.delete({
            where: { id }
        });
    }
}
