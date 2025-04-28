"use client"
import type { ReactNode } from "react"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { usePathname } from 'next/navigation';
export default function ReceiverLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // If on /receiver directly
  if (pathname === '/receiver') {
    return <>{children}</>;
  }
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-red-600">Donor+ Receiver Portal</h1>
        </div>
      </div>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </main>
  )
}
