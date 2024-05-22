import prisma from "@/lib/prisma";
import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: `${profile.given_name} ${profile.family_name}`,
          email: profile.email,
        };
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email || "" },
      });
      if (!existingUser) {
        await prisma.user.create({
          data: {
            name: user.name,
            email: user.email,
          },
        });
      }
      return true;
    },
    async session({ session }) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email || "" },
      });
      session.user.id = dbUser?.id || "";
      return session;
    },
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
