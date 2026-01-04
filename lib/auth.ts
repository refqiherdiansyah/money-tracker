import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Demo Login",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "demo@local.dev",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null

        return {
          id: credentials.email,
          email: credentials.email,
          name: credentials.email.split("@")[0],
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email
        token.name = user.name
      }
      return token
    },

    async session({ session, token }) {
      // ✅ Defensive typing for strict TS
      if (!session.user) {
        session.user = {
          email: undefined,
          name: undefined,
        }
      }

      if (token?.email) {
        session.user.email = token.email as string
      }

      if (token?.name) {
        session.user.name = token.name as string
      }

      return session
    },
  },

  pages: {
    signIn: "/",
  },

  secret: process.env.NEXTAUTH_SECRET,
}
