export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900/90 backdrop-blur-sm">
            <div className="relative flex flex-col items-center">
                {/* Animated PC Case Icon */}
                <div className="relative h-24 w-24 animate-pulse rounded-lg border-4 border-blue-500 bg-gray-800 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                    <div className="absolute left-2 top-2 h-20 w-1 rounded bg-blue-500/50"></div>
                    <div className="absolute bottom-2 right-2 h-4 w-4 rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa] animate-ping"></div>
                    <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-t-transparent border-blue-400 animate-spin"></div>
                </div>

                <h2 className="mt-8 text-2xl font-bold text-white tracking-wider animate-pulse">
                    BUILDING YOUR RIG...
                </h2>

                <div className="mt-4 flex space-x-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-3 w-3 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-3 w-3 rounded-full bg-blue-500 animate-bounce"></div>
                </div>
            </div>
        </div>
    );
}
