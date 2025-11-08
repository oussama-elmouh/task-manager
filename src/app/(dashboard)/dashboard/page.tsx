'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/authContext'

interface DashboardStats {
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
  pendingTasks: number
  tasksByStatus: Record<string, number>
  tasksByPriority: Record<string, number>
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Calculer les stats localement ou récupérer depuis API
      const response = await fetch('/api/tasks')
      const tasks = await response.json()

      // Calculer les statistiques
      const totalTasks = tasks.length || 0
      const completedTasks = tasks.filter((t: any) => t.status === 'DONE').length || 0
      const inProgressTasks = tasks.filter((t: any) => t.status === 'IN_PROGRESS').length || 0
      const pendingTasks = tasks.filter((t: any) => t.status === 'TODO').length || 0

      // Par statut
      const tasksByStatus = {
        'À faire': pendingTasks,
        'En cours': inProgressTasks,
        'Terminées': completedTasks,
      }

      // Par priorité
      const tasksByPriority = {
        'Basse': tasks.filter((t: any) => t.priority === 'LOW').length || 0,
        'Moyenne': tasks.filter((t: any) => t.priority === 'MEDIUM').length || 0,
        'Élevée': tasks.filter((t: any) => t.priority === 'HIGH').length || 0,
        'Urgent': tasks.filter((t: any) => t.priority === 'URGENT').length || 0,
      }

      setStats({
        totalTasks,
        completedTasks,
        inProgressTasks,
        pendingTasks,
        tasksByStatus,
        tasksByPriority,
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-2">Bienvenue, {user?.name}!</p>
      </div>

      {/* Bouton Nouvelle tâche */}
     {/*  <div className="flex justify-end">
        <a
          href="/tasks/create"
          className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition"
        >
          + Nouvelle tâche
        </a>
      </div> */}

      {/* 4 Cartes Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Carte 1 - À faire */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">À faire</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.pendingTasks || 0}
              </p>
            </div>
            <div className="text-4xl">📝</div>
          </div>
        </div>

        {/* Carte 2 - En cours */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">En cours</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.inProgressTasks || 0}
              </p>
            </div>
            <div className="text-4xl">⚙️</div>
          </div>
        </div>

        {/* Carte 3 - Terminées */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Terminées</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.completedTasks || 0}
              </p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        {/* Carte 4 - Total */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.totalTasks || 0}
              </p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique 1 - Tâches par statut */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Tâches par statut</h3>
          <div className="space-y-4">
            {stats?.tasksByStatus &&
              Object.entries(stats.tasksByStatus).map(([status, count]) => (
                <div key={status}>
                  <div className="flex justify-between mb-1">
                    <p className="text-sm font-medium text-gray-700">{status}</p>
                    <p className="text-sm font-bold text-gray-900">{count}</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        status === 'À faire'
                          ? 'bg-blue-500'
                          : status === 'En cours'
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${((count as number) / (stats?.totalTasks || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Graphique 2 - Tâches par priorité */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Tâches par priorité</h3>
          <div className="space-y-4">
            {stats?.tasksByPriority &&
              Object.entries(stats.tasksByPriority).map(([priority, count]) => (
                <div key={priority}>
                  <div className="flex justify-between mb-1">
                    <p className="text-sm font-medium text-gray-700">{priority}</p>
                    <p className="text-sm font-bold text-gray-900">{count}</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        priority === 'Basse'
                          ? 'bg-green-500'
                          : priority === 'Moyenne'
                          ? 'bg-yellow-500'
                          : priority === 'Élevée'
                          ? 'bg-red-500'
                          : 'bg-red-700'
                      }`}
                      style={{ width: `${((count as number) / (stats?.totalTasks || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
