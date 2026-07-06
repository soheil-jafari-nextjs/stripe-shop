import { API_URL } from "@/statics/constants";
import { cookies } from "next/headers";

export const post = async (path: string, formData: FormData) => {
   const myCookies = await cookies();
   console.log('url : ', `${API_URL}/${path}`)
   const res = await fetch(
      `${API_URL}/${path}`,
      {
         method: 'POST',
         headers: { 'Content-Type': 'application/json', Cookie: myCookies.toString() },
         body: JSON.stringify(Object.fromEntries(formData))
      }
   );
   const parsedRes = await res.json();
   console.log(parsedRes)
   if (!res.ok) {
      return {
         error:
            parsedRes.message && typeof (parsedRes.message) == 'string' ? parsedRes.message :
               parsedRes.message && parsedRes.message[0] ? parsedRes.message[0]
                  : 'error'
      }
   }
   return { data: parsedRes, error: '' }
}

export const get = async (path: string) => {
   const myCookies = await cookies();
   const res = await fetch(`${API_URL}/${path}`, { headers: { Cookie: myCookies.toString() } })
   return await res.json();
}