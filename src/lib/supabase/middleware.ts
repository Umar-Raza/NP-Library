import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  // Public routes — bina login accessible
  const publicRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ];
  const isPublic = publicRoutes.some((r) => path.startsWith(r));

  // 1) Bina login protected page → login par bhejein
  if (!user && !isPublic && path !== "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 2) Logged-in user role check (librarian vs reader areas)
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", user.id)
      .single();

    if (profile) {
      const isLibrarianArea = path.startsWith("/librarian");
      const isReaderArea = path.startsWith("/reader");

      // Reader librarian area nahi khol sakta
      if (isLibrarianArea && profile.role !== "librarian") {
        const url = request.nextUrl.clone();
        url.pathname = "/reader/dashboard";
        return NextResponse.redirect(url);
      }

      // Librarian reader area nahi khol sakta
      if (isReaderArea && profile.role !== "reader") {
        const url = request.nextUrl.clone();
        url.pathname = "/librarian/dashboard";
        return NextResponse.redirect(url);
      }

      // Pending reader sirf /reader/pending dekh sakta hai
      if (
        profile.role === "reader" &&
        profile.status === "pending" &&
        isReaderArea &&
        path !== "/reader/pending"
      ) {
        const url = request.nextUrl.clone();
        url.pathname = "/reader/pending";
        return NextResponse.redirect(url);
      }

      // Approved reader ko pending page se dashboard par bhejein
      if (profile.status === "approved" && path === "/reader/pending") {
        const url = request.nextUrl.clone();
        url.pathname = "/reader/dashboard";
        return NextResponse.redirect(url);
      }

      // Logged-in user login/signup page kholega → apne dashboard par
      if (isPublic && path !== "/reset-password") {
        const url = request.nextUrl.clone();
        url.pathname =
          profile.role === "librarian"
            ? "/librarian/dashboard"
            : "/reader/dashboard";
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}
