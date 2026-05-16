import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    // This exchanges the "code" from Google for a real "session" in your DB
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Once finished, send the user back to the home page (dashboard)
  return NextResponse.redirect(requestUrl.origin);
}