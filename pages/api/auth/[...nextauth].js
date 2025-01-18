// file to make connection of google authentication
import clientPromise from '@/lib/mongodb';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

if (!process.env.GOOGLE_ID || !process.env.GOOGLE_SECRET) {
  throw new Error('Missing Google authentication environment variables');
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'jwt', // Use 'database' if session data should be stored in MongoDB
  },
  callbacks: {
    async session({ session, token }) {
      // Attach additional fields to the session if needed
      session.user.id = token.sub; // Add user ID
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id; // Attach user ID to the token
      }
      return token;
    },
  },
});
