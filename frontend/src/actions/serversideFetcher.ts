'use server'
import { cookies } from "next/headers";
import { get, post } from "./fetch";
import { API_URL, } from "@/statics/constants";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default async function serversidePoster(address: string, formData: FormData) {
   const response = await post(address, formData);
   if (response.error) { return { error: response.error } }
   else { return { response } }
}

export async function serversideGetter(address: string,) {
   const response = await get(address,);
   if (response.error) { return { error: response.error } }
   else { return response }
}

export async function setCookieFetch(address: string, formData: FormData) {
   const res = await fetch(
      `${API_URL}/${address}`,
      {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(Object.fromEntries(formData)),
      }
   );
   const parsedRes = await res.json();
   if (!res.ok) {
      return {
         error:
            parsedRes.message && typeof (parsedRes.message) == 'string' ? parsedRes.message :
               parsedRes.message && parsedRes.message[0] ? parsedRes.message[0]
                  : 'error'
      }
   }

   const cookieString = res.headers.get('set-cookie');

   if (cookieString) {
      const actoken = cookieString.match(/actoken=([^;]+)/)?.[1];
      const rftoken = cookieString.match(/rftoken=([^;]+)/)?.[1];
      if (actoken) { setCookieHeader(actoken, 'actoken') }
      if (rftoken) { setCookieHeader(rftoken, 'rftoken') }
   }

   return { redirect: `${parsedRes.redirect}` }
}

export async function setCookieHeader(token: string, title: string) {
   const cookieStore = await cookies();
   return cookieStore.set({
      name: title,
      value: token,
      httpOnly: true,
      secure: false,
      path: '/',
      expires: new Date(jwtDecode(token).exp! * 1000),
   });
}

export async function tokenRemover() {
   const cookieStore = await cookies();
   cookieStore.delete({ name: "actoken", path: "/", });
   cookieStore.delete({ name: "rftoken", path: "/", });
   redirect('/');
}