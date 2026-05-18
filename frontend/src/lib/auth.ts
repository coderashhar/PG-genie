import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import connectToDatabase from './db';
import User from '../models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        emailOrPhone: { label: 'Email or Phone', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.emailOrPhone || !credentials?.password) {
          throw new Error('Please provide email/phone and password');
        }

        await connectToDatabase();

        // Check if the input is an email or phone number
        const isEmail = credentials.emailOrPhone.includes('@');
        
        const user = await User.findOne(
          isEmail ? { email: credentials.emailOrPhone } : { phone: credentials.emailOrPhone }
        ).select('+password');

        if (!user) {
          throw new Error('Invalid credentials');
        }

        if (!user.password) {
          throw new Error('Please login using Google or reset your password');
        }

        const isMatch = await bcrypt.compare(credentials.password, user.password);

        if (!isMatch) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // For Google OAuth, ensure user exists in our DB
      if (account?.provider === 'google') {
        await connectToDatabase();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          // Create new user if they don't exist
          const newUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            role: 'student', // Default role for OAuth, can be updated later
          });
          user.id = newUser._id.toString();
          (user as any).role = newUser.role;
        } else {
          user.id = existingUser._id.toString();
          (user as any).role = existingUser.role;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      if (trigger === 'update' && session?.name) {
        token.name = session.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login', // Adjust if you have a custom login page
  },
};
