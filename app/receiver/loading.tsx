export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8 flex justify-center">
            <div className="animate-pulse text-center">
                <div className="h-8 w-48 bg-gray-200 rounded mb-4 mx-auto"></div>
                <div className="h-64 w-full max-w-md bg-gray-200 rounded"></div>
            </div>
        </div>
    )
}
