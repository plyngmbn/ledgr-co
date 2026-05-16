import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    // FIX: Cast the entire store to any here to fix .get, .set, and .remove
    const cookieStore: any = cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            // No more red lines on .get
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            // No more red lines on .set
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            // No more red lines on .set (used for removal)
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    
    console.error('Auth error:', error.message);
  }

  // Final fallback to error page
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}