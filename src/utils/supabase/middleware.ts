import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  try {
    let supabaseResponse = NextResponse.next({
      request,
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Securely fetch user
    const { data: { user }, error } = await supabase.auth.getUser();

    // Check routing
    const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard");

    // The logic we fixed: If user is missing OR there's an error, AND it's a protected route
    if ((!user || error) && isProtectedRoute) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    return supabaseResponse;

  } catch (e) {
    // THE ARMOR: If absolutely anything crashes in the code above, 
    // it lands here instead of killing your server.
    
    // Only redirect if they were trying to access the dashboard
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    
    // Otherwise, just let them proceed to the public page they were trying to load
    return NextResponse.next({ request });
  }
}