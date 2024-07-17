import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/client";
import { getServerSession } from "next-auth"

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  //   adapter: PrismaAdapter(prisma),
  //   callbacks: {
  //     session({ session, user }) {
  //       session.user.role = user.role;
  //       return session;
  //     },
  //   },
};

export default NextAuth(authOptions);

// Use it in server contexts
export function auth(...args) {
  return getServerSession(...args, authOptions)
}