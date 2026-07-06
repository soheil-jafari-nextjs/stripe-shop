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
   console.log('in requester')
   console.log('Object.fromEntries(formData) : ', Object.fromEntries(formData))
   const res = await fetch(
      `${API_URL}/${address}`,
      {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(Object.fromEntries(formData)),
      }
   );
   const parsedRes = await res.json();
   console.log('res.ok : ', res.ok)
   if (!res.ok) {
      return {
         error:
            parsedRes.message && typeof (parsedRes.message) == 'string' ? parsedRes.message :
               parsedRes.message && parsedRes.message[0] ? parsedRes.message[0]
                  : 'error'
      }
   }

   console.log('parsedRes : ', parsedRes)
   const cookieString = res.headers.get('set-cookie');

   console.log('cookieString : ', cookieString)
   if (cookieString) {
      const actoken = cookieString.match(/actoken=([^;]+)/)?.[1];
      const rftoken = cookieString.match(/rftoken=([^;]+)/)?.[1];
      const cookieStore = await cookies();
      console.log('actoken : ', actoken)
      console.log('rftoken : ', rftoken)

      if (actoken) {
         cookieStore.set({
            name: 'actoken',
            value: actoken,
            httpOnly: true,
            secure: true,
            path: '/',
            expires: new Date(jwtDecode(actoken).exp! * 1000),
         });
      }
      if (rftoken) {
         cookieStore.set({
            name: 'rftoken',
            value: rftoken,
            httpOnly: true,
            secure: true,
            path: '/',
            expires: new Date(jwtDecode(rftoken).exp! * 1000),
         });
      }
   }
   console.log('parsedRes.redirect : ', parsedRes.redirect)
   return { redirect: `${parsedRes.redirect}` }
}

export async function tokenRemover() {
   const cookieStore = await cookies();
   cookieStore.delete({ name: "actoken", path: "/", });
   cookieStore.delete({ name: "rftoken", path: "/", });
   redirect('/');
}
