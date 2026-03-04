import { ProjectService } from '@/services/projectService';
import Sidebar from '@/components/dashboard/Sidebar';

export const dynamic = 'force-dynamic';

export default async function SidebarWrapper() {
    try {
        const projects = await ProjectService.getProjects();
        return <Sidebar projects={projects} />;
    } catch (error) {
        console.error("Failed to fetch projects for sidebar", error);
        return <Sidebar projects={[]} />;
    }
}
