import { Bell, Search, User } from 'lucide-react';

export default function Header() {
    return (
        <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center flex-1">
                <div className="relative w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search projects or tasks..."
                        className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-100 dark:bg-slate-800 border-none rounded-md focus:ring-2 focus:ring-blue-500 dark:text-slate-200 outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full border border-white dark:border-slate-900"></span>
                </button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white cursor-pointer shadow-sm">
                    <User className="w-4 h-4" />
                </div>
            </div>
        </header>
    );
}
