import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import connectToDatabase from './db';
import User from '../models/User';
import Otp from '../models/Otp';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email or Phone', type: 'text' },
        otp: { label: 'OTP', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.otp) {
          throw new Error('Please provide email/phone and OTP');
        }

        await connectToDatabase();

        // 1. Verify OTP
        const validOtp = await Otp.findOne({
          identifier: credentials.identifier,
          otp: credentials.otp,
        });

        if (!validOtp) {
          throw new Error('Invalid or expired OTP');
        }

        // OTP is valid, let's delete it so it can't be reused
        await Otp.deleteOne({ _id: validOtp._id });

        // 2. Find or Create User
        const isEmail = credentials.identifier.includes('@');
        
        let user = await User.findOne(
          isEmail ? { email: credentials.identifier } : { phone: credentials.identifier }
        );

        if (!user) {
          // Seamless Signup
          user = await User.create({
            name: isEmail ? credentials.identifier.split('@')[0] : 'New User',
            email: isEmail ? credentials.identifier : `${credentials.identifier}@temp.com`, // Temp email if phone used
            phone: !isEmail ? credentials.identifier : undefined,
            role: 'student',
          });
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
