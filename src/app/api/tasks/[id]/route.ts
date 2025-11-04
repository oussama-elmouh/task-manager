import { NextRequest, NextResponse } from 'next/server'
import 'dotenv/config'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// ✅ Schéma de validation pour les mises à jour
const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  dueDate: z.string().optional(),
  assignedToId: z.string().optional(),
})

/* ============================================
   GET - Récupérer le détail d'une tâche
============================================ */

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }  // ✅ Promise
  ) {
    try {
      const { id } = await params  // ✅ Await
  
      const task = await prisma.task.findUnique({
        where: { id },  // ✅ Maintenant id est défini!
        include: {
          createdBy: { select: { id: true, name: true, email: true } },
          assignedTo: { select: { id: true, name: true, email: true } },
        },
      })
  
      if (!task) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 })
      }
  
      return NextResponse.json(task)
    } catch (error) {
      console.error('Error fetching task:', error)
      return NextResponse.json(
        { error: 'Failed to fetch task', details: String(error) },
        { status: 500 }
      )
    }
  }
  

/* ============================================
   PUT - Modifier une tâche
============================================ */
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      // ✅ Next.js 15 - attendre les params
      const { id } = await params
  
      // 🔐 Utilisateur simulé (temporaire)
      const sessionUserId = 'cmhjt1ml70000vgnwy4ytflia'
  
      // ✅ Récupération et validation du corps
      const body = await req.json()
      const parsed = updateTaskSchema.safeParse(body)
  
      if (!parsed.success) {
        return NextResponse.json(
          {
            error: 'Invalid input',
            details: parsed.error.flatten().fieldErrors,
          },
          { status: 400 }
        )
      }
  
      // ✅ Vérification si la tâche existe
      const task = await prisma.task.findUnique({ where: { id } })
      if (!task) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 })
      }
  
      // ✅ Mise à jour de la tâche
      const updated = await prisma.task.update({
        where: { id },
        data: {
          ...parsed.data,
          dueDate: parsed.data.dueDate
            ? new Date(parsed.data.dueDate)
            : undefined,
        },
        include: {
          createdBy: { select: { id: true, name: true, email: true } },
          assignedTo: { select: { id: true, name: true, email: true } },
        },
      })
  
      return NextResponse.json(updated)
    } catch (error) {
      console.error('Error updating task:', error)
      return NextResponse.json(
        { error: 'Failed to update task', details: String(error) },
        { status: 500 }
      )
    }
  }

/* ============================================
   DELETE - Supprimer une tâche
============================================ */
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      // ✅ Next.js 15 - attendre les params
      const { id } = await params
  
      // 🔐 Utilisateur simulé (temporaire)
      const sessionUserId = 'cmhjt1ml70000vgnwy4ytflia'
  
      // ✅ Vérification si la tâche existe
      const task = await prisma.task.findUnique({ where: { id } })
      if (!task) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 })
      }
  
      // ✅ Suppression de la tâche
      await prisma.task.delete({ where: { id } })
  
      return NextResponse.json({ success: true })
    } catch (error) {
      console.error('Error deleting task:', error)
      return NextResponse.json(
        { error: 'Failed to delete task', details: String(error) },
        { status: 500 }
      )
    }
  }