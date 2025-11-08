'use client'

import { useEffect, useState } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(Array.isArray(data) ? data : [])
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet utilisateur ?')) return
    try {
      await fetch(`/api/users/${id}`, { method: 'DELETE' })
      setUsers(users.filter((u) => u.id !== id))
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="p-8 space-y-8 bg-gray-100 min-h-screen">
      {/* Titre et action */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des utilisateurs</h1>
        {/* Bouton ajouter si besoin */}
        {/* <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 focus:outline-none flex items-center space-x-2">
            <span>➕</span> <span>Ajouter utilisateur</span>
        </button> */}
      </div>

      {/* Card avec fond blanc et dégradés subtils */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Messagerie Loading / Vide */}
        {loading ? (
          <div className="p-6 text-center text-gray-500">Chargement des utilisateurs...</div>
        ) : users.length === 0 ? (
          <div className="p-6 text-center text-gray-600 flex flex-col items-center justify-center space-y-2">
            <p>Aucun utilisateur trouvé.</p>
            <a
              href="/register"
              className="text-teal-600 hover:underline font-medium"
            >
              Créer le premier utilisateur →
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto min-w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Rôle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition duration-200">
                    <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-2">
                      {/* Avatar ou initiale */}
                      <div className="w-10 h-10 flex items-center justify-center bg-teal-500 text-white rounded-full font-semibold uppercase">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-gray-800 font-medium">{user.role}</td>
                    <td className="px-6 py-4 flex space-x-3">
                      <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition" onClick={() => handleDelete(user.id)}>
                        🗑️ Supprimer
                      </button>
                      {/* Bouton modifier éventuellement */}
                      {/* <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition"> ✏️ Modifier</button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}