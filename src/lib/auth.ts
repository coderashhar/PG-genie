import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import connectToDatabase from './db';
import User from '../models/User';
import Otp from '../models/Otp';
import { cookies } from 'next/headers';

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
        role: { label: 'Role', type: 'text' },
        password: { label: 'Password', type: 'password' },
        loginType: { label: 'Login Type', type: 'text' }, // 'password' or 'otp'
      },
      async authorize(credentials) {
        if (!credentials?.identifier) {
          throw new Error('Please provide email/phone');
        }

        const loginType = credentials.loginType || 'password';

        // Normalize identifier
        let normalizedId = credentials.identifier.trim();
        const isEmail = normalizedId.includes('@');
        if (!isEmail) {
          normalizedId = normalizedId.replace(/\s+/g, '');
          if (normalizedId.length === 10 && /^\d{10}$/.test(normalizedId)) {
            normalizedId = '+91' + normalizedId;
          } else if (normalizedId.startsWith('91') && normalizedId.length === 12) {
            normalizedId = '+' + normalizedId;
          }
        }

        await connectToDatabase();

        // Find User
        let user = await User.findOne(
          isEmail ? { email: normalizedId } : { phone: normalizedId }
        ).select('+password');

        if (!user) {
          throw new Error('No account found with this email/phone. Please sign up.');
        }

        if (user.role !== credentials.role) {
          throw new Error(`You are registered as a ${user.role}. Please log in using the ${user.role} portal.`);
        }

        if (loginType === 'password') {
          if (!credentials.password) {
            throw new Error('Please provide your password');
          }
          if (!user.password) {
            throw new Error('No password set for this account. Please use OTP or Google/Facebook to log in.');
          }
          const isMatch = await bcrypt.compare(credentials.password, user.password);
          if (!isMatch) {
            throw new Error('Invalid password');
          }
        } else if (loginType === 'otp') {
          if (!credentials.otp) {
            throw new Error('Please provide the OTP');
          }
          // Verify OTP
          const validOtp = await Otp.findOne({
            identifier: normalizedId,
            otp: credentials.otp,
          });

          if (!validOtp) {
            throw new Error('Invalid or expired OTP');
          }

          // OTP is valid, let's delete it so it can't be reused
          await Otp.deleteOne({ _id: validOtp._id });
        } else {
          throw new Error('Invalid login type');
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
      // For Google/Facebook OAuth, ensure user exists in our DB with correct role
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        await connectToDatabase();
        const existingUser = await User.findOne({ email: user.email });
        
        const cookieStore = await cookies();
        const requestedRole = cookieStore.get('requested_auth_role')?.value || 'student';

        if (!existingUser) {
          // Create new user if they don't exist
          const newUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            role: requestedRole,
          });
          user.id = newUser._id.toString();
          (user as any).role = newUser.role;
        } else {
          if (existingUser.role !== requestedRole) {
            return `/login?error=RoleMismatch&registeredRole=${existingUser.role}`;
          }
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
