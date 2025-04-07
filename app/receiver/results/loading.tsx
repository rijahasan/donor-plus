export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse">
                <div className="h-10 w-32 bg-gray-200 rounded mb-6"></div>
                <div className="h-8 w-64 bg-gray-200 rounded mb-8"></div>

                <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
                    ))}
                </div>
            </div>
        </div>
    )
}
