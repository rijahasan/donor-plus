import type { ReactNode } from "react"

export default function ReceiverLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-red-600">Donor+ Receiver Portal</h1>
        </div>
      </div>
      {children}
    </main>
  )
}

