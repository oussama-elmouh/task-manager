'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Titre */}
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Tableau de bord</h1>
          <p className="text-gray-500 text-sm">
            Bienvenue dans votre espace de gestion
          </p>
        </div>

        {/* Bouton nouvelle tâche */}
        <Link
          href="/tasks/create"
          className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 font-medium transition"
        >
          + Nouvelle tâche
        </Link>
      </div>
    </header>
  )
}
