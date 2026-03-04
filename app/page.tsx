import Link from 'next/link';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex flex-col gap-8">
                <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4 text-center">
                    Project Control Tower
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl text-center">
                    An AI-native visual project management platform designed to help teams understand project status instantly and execute work efficiently.
                </p>

                <div className="flex gap-4">
                    <Link
                        href="/dashboard"
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/30"
                    >
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        </main>
    );
}
