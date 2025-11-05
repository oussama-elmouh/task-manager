import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }  // ✅ Corriger le type
) {
  try {
    const { id } = await context.params  // ✅ Await la Promise

    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Erreur' },
      { status: 500 }
    )
  }
}
