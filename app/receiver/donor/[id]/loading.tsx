export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-10 w-32 bg-gray-200 rounded mb-6"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
          <div>
            <div className="h-40 bg-gray-200 rounded-lg mb-6"></div>
            <div className="h-40 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
