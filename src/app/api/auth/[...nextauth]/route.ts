import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

import { NextRequest, NextResponse } from 'next/server';
import rateLimit, { getIP } from '@/lib/ratelimit';

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500,
});

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
