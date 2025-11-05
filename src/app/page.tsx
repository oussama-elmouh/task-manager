import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            📋 TaskManager
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Gérez vos tâches facilement et efficacement
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 font-medium transition"
            >
              Se connecter
            </Link>
            <Link
              href="/register"
              className="bg-gray-200 text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-300 font-medium transition"
            >
              S'inscrire
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📊 Tableau de bord</h3>
            <p className="text-gray-600">Visualisez vos statistiques en temps réel</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">✅ CRUD Complet</h3>
            <p className="text-gray-600">Créez, modifiez et supprimez vos tâches</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🔐 Sécurisé</h3>
            <p className="text-gray-600">Authentification sécurisée avec NextAuth</p>
          </div>
        </div>
      </div>
    </div>
  )
}
 

 

  

