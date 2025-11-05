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
    if (!confirm('Supprimer?')) return
    try {
      await fetch(`/api/users/${id}`, { method: 'DELETE' })
      setUsers(users.filter((u) => u.id !== id))
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestion des utilisateurs</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Chargement...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Aucun utilisateur</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Nom</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Email</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Rôle</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900 font-medium">{user.name}</td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-gray-600">{user.role}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
