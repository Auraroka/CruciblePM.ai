import { prisma as db } from '@/lib/prisma';

export class DependencyService {
    /**
     * Create a dependency asserting that `taskId` depends on `dependsOnTaskId`
     */
    static async createDependency(taskId: string, dependsOnTaskId: string) {
        // Basic cycle prevention check should be added here
        return db.dependency.create({
            data: {
                taskId,
                dependsOnTaskId
            }
        });
    }

    /**
     * Determine if a task is currently blocked by an uncompleted dependency
     */
    static async isTaskBlocked(taskId: string): Promise<boolean> {
        const dependencies = await db.dependency.findMany({
            where: { taskId },
            include: {
                dependsOnTask: true
            }
        });

        return dependencies.some(dep =>
            dep.dependsOnTask.status !== 'completed'
        );
    }
}
