export const dynamic = 'force-dynamic'
import { jwtDecode } from 'jwt-decode';
import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from './statics/constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function proxy(request: NextRequest) {
   try {
      const path = request.nextUrl.pathname;
      // Ignore static files
      if (
         path.startsWith("/_next") ||
         path.startsWith("/images") ||
         path.startsWith("/font") ||
         path.startsWith("/favicon.ico")
      ) {
         return NextResponse.next();
      }

      const actoken = request.cookies.get("actoken")?.value;
      const rftoken = request.cookies.get("rftoken")?.value;

      // کاربر لاگین نیست
      if (!rftoken) { return NextResponse.next(); }

      let needRefresh = false;

      // access وجود نداره
      if (!actoken) { needRefresh = true; }
      else {
         try {
            const { exp } = jwtDecode<{ exp: number }>(actoken);
            if (exp * 1000 <= Date.now()) { needRefresh = true; }
         }
         catch { needRefresh = true; }
      }

      if (!needRefresh) { return NextResponse.next(); }
      const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
         method: "POST",
         headers: { Cookie: request.headers.get("cookie") ?? "", },
      });


      if (!refreshResponse.ok) {
         const response = NextResponse.redirect(new URL("/auth", request.url));
         response.cookies.delete("actoken");
         response.cookies.delete("rftoken");
         return response;
      }
      const response = NextResponse.next();
      const setCookie = refreshResponse.headers.get("set-cookie");

      if (setCookie) {
         const new_actoken = setCookie.match(/actoken=([^;]+)/)?.[1];
         const new_rftoken = setCookie.match(/rftoken=([^;]+)/)?.[1];

         if (new_actoken) {
            response.cookies.set({
               name: "actoken",
               value: new_actoken,
               httpOnly: true,
               secure: true,
               path: "/",
               expires: new Date(jwtDecode<{ exp: number }>(new_actoken).exp * 1000),
            });
         }

         if (new_rftoken) {
            response.cookies.set({
               name: "rftoken",
               value: new_rftoken,
               httpOnly: true,
               secure: true,
               path: "/",
               expires: new Date(jwtDecode<{ exp: number }>(new_rftoken).exp * 1000),
            });
         }
      }

      return response;

   }
   catch (err) {
      console.log(err);
      return NextResponse.json({ message: "عدم دسترسی" }, { status: 402 });
   }
}
