import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

import { NextRequest, NextResponse } from 'next/server';
import rateLimit, { getIP } from '@/lib/ratelimit';

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500,
});

const handler = NextAuth(authOptions);

async function rateLimitedPost(req: NextRequest, ctx: any) {
  try {
    const ip = getIP(req);
    await limiter.check(5, ip); // 5 login attempts per minute
  } catch {
    return NextResponse.json({ error: 'please try after sometime' }, { status: 429 });
  }
  return handler(req, ctx);
}

export { handler as GET, rateLimitedPost as POST };
