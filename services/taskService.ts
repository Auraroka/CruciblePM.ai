import { prisma as db } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export class TaskService {
    /**
     * Fetch a specific task by ID
     */
    static async getTaskById(id: string) {
        return db.task.findUnique({
            where: { id },
            include: {
                dependencies: true,
                dependentOn: true
            }
        });
    }

    /**
     * Fetch all tasks for a specific project
     */
    static async getTasksByProjectId(projectId: string) {
        return db.task.findMany({
            where: { projectId },
            include: {
                dependencies: true, // what this task depends on
            }
        });
    }

    /**
     * Create a new task
     */
    static async createTask(projectId: string, data: Omit<Prisma.TaskCreateInput, 'project'>) {
        return db.task.create({
            data: {
                ...data,
                project: { connect: { id: projectId } }
            }
        });
    }

    /**
     * Update a task
     */
    static async updateTask(id: string, data: Prisma.TaskUpdateInput) {
        return db.task.update({
            where: { id },
            data
        });
    }

    /**
     * Delete a task
     */
    static async deleteTask(id: string) {
        return db.task.delete({
            where: { id }
        });
    }

    /**
     * Count tasks by status globally or per project
     */
    static async countTasksByStatus(status: string, projectId?: string) {
        return db.task.count({
            where: {
                status,
                ...(projectId && { projectId })
            }
        });
    }

    /**
     * Update task status
     */
    static async updateTaskStatus(id: string, status: string) {
        return db.task.update({
            where: { id },
            data: { status }
        });
    }
}
