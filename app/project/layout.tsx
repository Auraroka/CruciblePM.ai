import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';

export default function ProjectLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
            <Sidebar />
            <div className="flex flex-col flex-1 w-full min-w-0">
                <Header />
                <main className="flex-1 overflow-hidden flex flex-col">
                    {children}
                </main>
            </div>
        </div>
    );
}
