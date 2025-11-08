import { NextRequest, NextResponse } from 'next/server'
import 'dotenv/config'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// ✅ Schéma de validation
const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  dueDate: z.string().optional(),
  assignedToId: z.string().optional(),
})

/* ============================================
   GET - Lister toutes les tâches
============================================ */
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Tasks GET error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des tâches' },
      { status: 500 }
    )
  }
}

/* ============================================
   POST - Créer une tâche
============================================ */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, description, status, priority, dueDate, createdById } = body

    // ✅ Vérifier que createdById est fourni
    if (!createdById) {
      return NextResponse.json(
        { error: 'ID utilisateur requis' },
        { status: 400 }
      )
    }

    // Validation
    if (!title) {
      return NextResponse.json(
        { error: 'Le titre est requis' },
        { status: 400 }
      )
    }

    // ✅ Utiliser createdById depuis le body (envoyé par le frontend)
    const task = await prisma.task.create({
      data: {
        title,
        description: description || '',
        status: status || 'TODO',
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        createdById, // ✅ Utiliser l'ID fourni
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Task POST error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la tâche' },
      { status: 500 }
    )
  }
}

 
 
 
/*# GET liste
curl http://localhost:3000/api/tasks

# POST créer
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","priority":"HIGH"}'

# GET détail
curl http://localhost:3000/api/tasks/[id]

# PUT modifier
curl -X PUT http://localhost:3000/api/tasks/[id] \
  -H "Content-Type: application/json" \
  -d '{"status":"IN_PROGRESS"}'

# DELETE supprimer
curl -X DELETE http://localhost:3000/api/tasks/[id]
*/