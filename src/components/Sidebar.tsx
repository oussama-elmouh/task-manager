'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 shadow-sm flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold">
          📋 <span className="text-teal-600">TaskManager</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="p-6 space-y-1 flex-1">
        <Link
          href="/dashboard"
          className={`flex items-center px-4 py-3 rounded-lg font-medium transition ${
            pathname.includes('/dashboard') && !pathname.includes('/tasks')
              ? 'bg-teal-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
           <span>📊</span> Tableau de bord 
        </Link>

        <Link
          href="/tasks"
          className={`flex items-center px-4 py-3 rounded-lg font-medium transition ${
            pathname.includes('/tasks')
              ? 'bg-teal-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
           <span>📝</span> Mes tâches
        </Link>

        <div className="my-6 border-t border-gray-200"></div>

        <p className="text-xs font-bold text-gray-500 uppercase px-4 mb-3">Autres</p>

        <Link
          href="/users"
          className={`flex items-center px-4 py-3 rounded-lg font-medium transition ${
            pathname === '/users'
              ? 'bg-teal-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          👥 Utilisateurs
        </Link>

      
      </nav>

      {/* Profil + Déconnexion en bas */}
      <div className="p-6 border-t border-gray-200 space-y-4">
        {/* Info Utilisateur */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
              A
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Administrateur</p>
            </div>
          </div>
          <p className="text-xs text-gray-600">admin@taskmanager.com</p>
        </div>

        {/* Bouton Déconnexion */}
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium text-sm"
        >
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
