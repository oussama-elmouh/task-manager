'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 shadow-sm">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-teal-700">
          📋 <span className="text-gray-800">TaskManager</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="p-6 space-y-1">
        <Link
          href="/dashboard"
          className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition ${
            isActive('/dashboard')
              ? 'bg-teal-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span>📊</span> Tableau de bord
        </Link>

        <Link
          href="/tasks"
          className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition ${
            isActive('/tasks')
              ? 'bg-teal-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span>📝</span> Mes tâches
        </Link>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Section Autres */}
        <p className="px-4 text-sm font-semibold text-gray-500 uppercase">
          Autres
        </p>

        <Link
          href="/users"
          className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition ${
            isActive('/users')
              ? 'bg-teal-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span>👥</span> Utilisateurs
        </Link>

        <Link
          href="/docs"
          className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition ${
            isActive('/docs')
              ? 'bg-teal-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span>📚</span> Documentation
        </Link>
      </nav>
    </aside>
  )
}
