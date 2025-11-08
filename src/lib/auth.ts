// Fonctions d'authentification centralisées

export interface User {
  id: string
  email: string
  name: string
  role: string
}

export const AUTH_STORAGE_KEY = 'taskmanager_user'

// 🔹 Sauvegarder l'utilisateur
export function saveUser(user: User): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
  }
}

// 🔹 Récupérer l'utilisateur
export function getUser(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const userJson = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!userJson) return null
    return JSON.parse(userJson) as User
  } catch (error) {
    console.error('Error parsing user:', error)
    return null
  }
}

// 🔹 Vérifier si utilisateur est connecté
export function isAuthenticated(): boolean {
  return getUser() !== null
}

// 🔹 Déconnecter l'utilisateur
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    window.location.href = '/login'
  }
}

// 🔹 Rediriger si pas authentifié
export function requireAuth(): void {
  if (typeof window !== 'undefined' && !isAuthenticated()) {
    window.location.href = '/login'
  }
}
