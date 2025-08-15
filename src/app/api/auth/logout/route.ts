import { NextResponse } from 'next/server';

import { clearAuthCookies } from '@/lib/auth';

export async function POST() {
  const res = NextResponse.json({ success: true });
  clearAuthCookies(res);
  return res;
}
