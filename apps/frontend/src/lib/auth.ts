import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from './prisma'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user) return null

        // bcrypt compare viene implementato nello step 1.3
        // placeholder per ora
        const { compare } = await import('bcryptjs')
        const valid = await compare(credentials.password as string, user.password)
        if (!valid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token['role'] = (user as typeof user & { role: string }).role
        token['id'] = user.id
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token['id'] as string
        ;(session.user as typeof session.user & { role: string }).role = token['role'] as string
      }
      return session
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  session: { strategy: 'jwt' },
})
