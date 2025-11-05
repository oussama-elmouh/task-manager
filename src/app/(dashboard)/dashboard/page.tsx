'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Pie, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

interface Task {
  id: string
  title: string
  description: string | null
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  createdBy: { name: string }
  createdAt: string
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks')
      const data = await response.json()
      setTasks(data)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette tâche ?')) return
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
      setTasks(tasks.filter((t) => t.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  // Statistiques
  const totalTasks = tasks.length
  const todoCount = tasks.filter((t) => t.status === 'TODO').length
  const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length
  const doneCount = tasks.filter((t) => t.status === 'DONE').length

  // Données graphiques
  const statusData = {
    labels: ['À faire', 'En cours', 'Terminées'],
    datasets: [
      {
        data: [todoCount, inProgressCount, doneCount],
        backgroundColor: ['#06B6D4', '#FBBF24', '#10B981'],
        borderWidth: 0,
      },
    ],
  }

  const priorityCount = {
    low: tasks.filter((t) => t.priority === 'LOW').length,
    medium: tasks.filter((t) => t.priority === 'MEDIUM').length,
    high: tasks.filter((t) => t.priority === 'HIGH').length,
  }

  const priorityData = {
    labels: ['Basse', 'Moyenne', 'Haute'],
    datasets: [
      {
        data: [priorityCount.low, priorityCount.medium, priorityCount.high],
        backgroundColor: ['#14B8A6', '#FBBF24', '#EF4444'],
        borderWidth: 0,
      },
    ],
  }

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  if (loading) return <p className="p-8 text-gray-500">Chargement...</p>

  return (
    <div className="space-y-8 p-8">
      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total des tâches" value={totalTasks} />
        <StatCard label="En cours" value={inProgressCount} />
        <StatCard label="Terminées" value={doneCount} />
        <StatCard label="En retard" value={0} />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white shadow-md rounded-2xl p-4">
          <h2 className="text-lg font-semibold mb-4">Tâches par statut</h2>
          <div className="h-64">
            <Pie
              data={statusData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
              }}
            />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-4">
          <h2 className="text-lg font-semibold mb-4">Tâches par priorité</h2>
          <div className="h-64">
            <Bar
              data={priorityData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: { legend: { display: false } },
                scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } },
              }}
            />
          </div>
        </div>
      </div>

      {/* Tâches récentes */}
      <div className="bg-white shadow-md rounded-2xl p-4">
        <h2 className="text-lg font-semibold mb-4">Tâches récentes</h2>
        {recentTasks.length === 0 ? (
          <p className="text-gray-500">Aucune tâche</p>
        ) : (
          <div className="divide-y">
            {recentTasks.map((task) => (
              <div key={task.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{task.title}</p>
                  {task.description && (
                    <p className="text-sm text-gray-500">{task.description}</p>
                  )}
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <span className="text-gray-600">
                    {task.status === 'TODO'
                      ? 'À faire'
                      : task.status === 'IN_PROGRESS'
                      ? 'En cours'
                      : 'Terminée'}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-white ${
                      task.priority === 'LOW'
                        ? 'bg-teal-500'
                        : task.priority === 'MEDIUM'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  >
                    {task.priority === 'LOW'
                      ? 'Basse'
                      : task.priority === 'MEDIUM'
                      ? 'Moyenne'
                      : task.priority === 'HIGH'
                      ? 'Haute'
                      : 'Urgente'}
                  </span>
                  <Link
                    href={`/tasks/${task.id}/edit`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    ✏️ Modifier
                  </Link>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    🗑️
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

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 text-center">
      <p className="text-gray-500">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}
