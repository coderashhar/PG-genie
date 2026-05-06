import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'dummy_client_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy_client_secret',
    }),
    CredentialsProvider({
      name: 'Phone OTP',
      credentials: {
        phone: { label: "Phone Number", type: "text" },
        otp: { label: "OTP", type: "text" }
      },
      async authorize(credentials, req) {
        if (!credentials?.phone || !credentials?.otp) return null;
        
        // DUMMY VERIFICATION: accept 123456 as OTP for any number during development
        if (credentials.otp === '123456') {
          await connectDB();
          
          let user = await User.findOne({ phoneNumber: credentials.phone });
          if (!user) {
            user = await User.create({
              phoneNumber: credentials.phone,
              authProvider: 'PHONE',
              role: 'STUDENT' // default role
            });
          }
          
          return {
            id: user._id.toString(),
            name: user.name || credentials.phone,
            phone: user.phoneNumber,
          } as any;
        }
        
        return null;
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        await connectDB();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            authProvider: 'GOOGLE',
          });
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name as string | null | undefined;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/', // Using modal on homepage instead of custom page
  }
})

export { handler as GET, handler as POST }
