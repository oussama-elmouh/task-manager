'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Task {
  id: string
  title: string
  description: string | null
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  createdBy: { id: string; name: string; email: string }
  createdAt: string
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/tasks')
      if (!response.ok) throw new Error('Erreur lors du chargement des tâches')
      const data = await response.json()
      setTasks(data)
    } catch (err) {
      setError('Impossible de charger les tâches')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Erreur lors de la suppression')
      setTasks(tasks.filter((t) => t.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Mes tâches</h1>
          <Link
            href="/tasks/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Nouvelle tâche
          </Link>
        </div>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        {loading ? (
          <div>Chargement...</div>
        ) : tasks.length === 0 ? (
          <div>
            <p>Aucune tâche pour le moment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="border rounded-lg p-4 flex justify-between items-center bg-gray-50"
              >
                <div>
                  <h2 className="text-lg font-semibold">{task.title}</h2>
                  <p className="text-gray-600">{task.description}</p>
                  <div className="flex gap-2 mt-1 text-sm">
                    <span className="px-2 py-1 bg-gray-200 rounded">{task.status}</span>
                    <span className="px-2 py-1 bg-gray-200 rounded">{task.priority}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Par {task.createdBy.name}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    href={`/tasks/${task.id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Modifier
                  </Link>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-red-600 hover:underline"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
