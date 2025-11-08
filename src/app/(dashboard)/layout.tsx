'use client'

import { useAuth } from '@/lib/authContext'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <div>Chargement...</div>
  if (!isAuthenticated) return null

  return (
    <div className="flex h-screen">
      {/* Sidebar fixe à gauche */}
      <Sidebar />
      
      {/* Contenu principal - décalé à droite avec ml-64 */}
      <div className="flex flex-col flex-1 ml-64 w-full">
        <Header />
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}
