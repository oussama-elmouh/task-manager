'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/authContext'

export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <aside className="w-64 bg-white border-r h-screen fixed left-0 top-0 flex flex-col justify-between">
      {/* Logo / Titre */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-semibold text-teal-600 flex items-center">
          📋 <span className="ml-2">TaskManager</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="p-6 space-y-2 flex-1">
        <Link
          href="/dashboard"
          className={`flex items-center px-4 py-3 rounded-lg transition ${
            pathname === '/dashboard'
              ? 'bg-teal-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          📊 Tableau de bord
        </Link>

        <Link
          href="/tasks"
          className={`flex items-center px-4 py-3 rounded-lg transition ${
            pathname.includes('/tasks')
              ? 'bg-teal-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          🏢 Mes tâches
        </Link>

        <Link
          href="/users"
          className={`flex items-center px-4 py-3 rounded-lg transition ${
            pathname === '/users'
              ? 'bg-teal-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          👥 Utilisateurs
        </Link>
      </nav>

      {/* Profil + Déconnexion */}
      <div className="p-4 border-t">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-semibold text-lg">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="ml-3">
            <p className="font-medium text-gray-800">{user?.name || 'Utilisateur'}</p>
            <p className="text-sm text-gray-500">{user?.role || 'User'}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mb-2">{user?.email}</p>
        <button
          onClick={logout}
          className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition"
        >
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
