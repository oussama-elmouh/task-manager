import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcrypt"
import { z } from "zod"

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validation du schéma
        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) {
          throw new Error("Invalid credentials")
        }

        const { email, password } = parsed.data

        // Recherche de l'utilisateur
        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user) {
          throw new Error("User not found")
        }

        // Vérification du mot de passe
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
          throw new Error("Invalid password")
        }

        // Retour de l'utilisateur
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.email = token.email
        session.user.name = token.name
        session.user.role = token.role
      }
      return session
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 jours
  },
})
