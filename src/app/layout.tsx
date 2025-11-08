import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/authContext'
export const metadata: Metadata = {
  title: 'TaskManager',
  description: 'Application de gestion des tâches',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
      <AuthProvider>
  {children}
  </AuthProvider>
      </body>
    </html>
  )
}


 