import type { Role } from '@philo/types'
import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string
      role: Role
      siteId: string
    }
  }

  interface User {
    role: Role
    siteId: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: Role
    siteId: string
  }
}
