import { NextRequest, NextResponse } from 'next/server'
import 'dotenv/config'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { z } from 'zod'

// ✅ Schéma de validation avec Zod
const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(2).max(100),
  password: z.string().min(6).max(100),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // ✅ Validation de l’entrée
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
        // @ts-ignore
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: parsed.error.flatten().fieldErrors, // détails des erreurs Zod
        },
        { status: 400 }
      )
    }

    const { email, name, password } = parsed.data

    // ✅ Vérification si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
        // @ts-ignore
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      )
    }

    // ✅ Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // ✅ Création de l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    })
// @ts-ignore
    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error registering user:', error)
    // @ts-ignore
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    )
  }
}
