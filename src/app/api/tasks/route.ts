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
export async function GET(req: NextRequest) {
  try {
    // TEMPORAIRE - Auth désactivée
    // const session = await auth()
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')

    const whereClause: any = {}
    if (status) whereClause.status = status
    if (priority) whereClause.priority = priority

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks', details: String(error) },
      { status: 500 }
    )
  }
}

/* ============================================
   POST - Créer une tâche
============================================ */
export async function POST(req: NextRequest) {
  try {
    // TEMPORAIRE - Auth désactivée
    // const session = await auth()
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // TEMPORAIRE - ID utilisateur fixe (à remplacer par session.user.id)
    const sessionUserId = 'cmhjt1ml70000vgnwy4ytflia'

    const body = await req.json()
    const parsed = createTaskSchema.safeParse(body)

    if (!parsed.success) {
      // @ts-ignore
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { title, description, priority, dueDate, assignedToId } = parsed.data

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        createdById: sessionUserId,
        assignedToId,
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Failed to create task', details: String(error) },
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