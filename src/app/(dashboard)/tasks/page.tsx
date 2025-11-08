'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/authContext'
import Link from 'next/link'

interface Task {
  id: string
  title: string
  description?: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate?: string
  createdBy: { name: string }
}

export default function TasksPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [filterPriority, setFilterPriority] = useState('ALL')
  const [sortBy, setSortBy] = useState('recent')

  useEffect(() => {
    fetchTasks()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [tasks, searchQuery, filterStatus, filterPriority, sortBy])

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks')
      const data = await response.json()
      setTasks(data || [])
    } catch (err) {
      setError('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...tasks]

    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (filterStatus !== 'ALL') {
      filtered = filtered.filter((t) => t.status === filterStatus)
    }

    if (filterPriority !== 'ALL') {
      filtered = filtered.filter((t) => t.priority === filterPriority)
    }

    if (sortBy === 'priority-high') {
      const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
      filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    } else if (sortBy === 'dueDate') {
      filtered.sort((a, b) => {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      })
    }

    setFilteredTasks(filtered)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr?')) return
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
      setTasks(tasks.filter((t) => t.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      TODO: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
      DONE: 'bg-green-100 text-green-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      TODO: 'À faire',
      IN_PROGRESS: 'En cours',
      DONE: 'Terminée',
    }
    return labels[status]
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      LOW: 'bg-green-100 text-green-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      HIGH: 'bg-orange-100 text-orange-800',
      URGENT: 'bg-red-100 text-red-800',
    }
    return colors[priority] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      LOW: 'Basse',
      MEDIUM: 'Moyenne',
      HIGH: 'Élevée',
      URGENT: 'Urgent',
    }
    return labels[priority]
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes tâches</h1>
          <p className="text-gray-600 mt-1">Gérez et organisez vos tâches efficacement</p>
        </div>
     {/*    <Link
          href="/tasks/create"
          className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition shadow-md"
        >
          + Nouvelle tâche
        </Link> */}
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <span className="text-xl mr-3">⚙️</span> Filtres et Recherche
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Recherche */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">🔍 Recherche</label>
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Statut */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">📊 Statut</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
            >
              <option value="ALL">Tous</option>
              <option value="TODO">À faire</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="DONE">Terminée</option>
            </select>
          </div>

          {/* Priorité */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">⚡ Priorité</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
            >
              <option value="ALL">Tous</option>
              <option value="LOW">Basse</option>
              <option value="MEDIUM">Moyenne</option>
              <option value="HIGH">Élevée</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          {/* Tri */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">🔄 Tri</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
            >
              <option value="recent">Plus récentes</option>
              <option value="priority-high">Priorité élevée</option>
              <option value="dueDate">Date limite</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des Tâches */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="text-xl mr-3">📋</span>
            Tâches ({filteredTasks.length})
          </h2>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-500">⏳ Chargement...</div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 font-medium">❌ {error}</div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">📭 Aucune tâche trouvée</p>
              <Link
                href="/tasks/create"
                className="inline-block px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition"
              >
                Créer votre première tâche →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-6 py-4 font-semibold text-gray-900">Titre</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-900">Statut</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-900">Priorité</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-900">Date limite</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-900">Créé par</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="border-b border-gray-200 hover:bg-teal-50 transition duration-150"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{task.title}</p>
                          {task.description && (
                            <p className="text-gray-500 text-xs mt-1 truncate">{task.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {getStatusLabel(task.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {getPriorityLabel(task.priority)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {task.dueDate ? (
                          <span className="font-medium">
                            {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{task.createdBy.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <Link
                            href={`/tasks/${task.id}/edit`}
                            className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg font-medium text-xs transition"
                          >
                            ✏️ Modifier
                          </Link>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg font-medium text-xs transition"
                          >
                            🗑️ Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
