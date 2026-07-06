'use client'

import serversidePoster, { setCookieFetch } from "@/actions/serversideFetcher";
import PinInput from "@/components/pin-input";
import EyeIcon from "@/icons/eye";
import { useCartStore } from "@/store/cart";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";


const AuthPage = () => {
   const cart = useCartStore(store => store.cart)

   const formSituations = ['PHONE', 'PASSWORD', 'PIN'] as const;
   type FormSituation = (typeof formSituations)[number];
   const [formSituation, setFormSituation] = useState<FormSituation>('PHONE');


   // phone handling
   const [phone, setPhone] = useState<string>("");
   const [password, setPassword] = useState<string>("");
   const [pin, setPin] = useState<string[]>(Array(5).fill(''));

   const isValidPhone = /^09\d{9}$/.test(phone);
   const router = useRouter();
   const submiter: () => void = async () => {
      const formData = new FormData();
      formData.append('phone', phone);
      if (formSituation == 'PHONE') {
         const result = await serversidePoster('auth/check-phone', formData);
         if (result?.error) { return toast.error(result.error) }
         if (!result.response || !result.response.data || !result.response.data.next_component) { return toast.error('unhandled error') }
         setFormSituation(result.response.data.next_component)
         return toast.success(result.response.data.message);
      }
      else if (formSituation == 'PIN') {
         formData.append('code', pin.join(''));
         formData.append('cart_items', JSON.stringify(cart.items))
         const result = await setCookieFetch('auth/check-pin', formData);
         if (result?.error) { return toast.error(result.error) }
         setTimeout(() => { router.push(result.redirect ? result.redirect : '/') }, 2000);
      }
      else if (formSituation == 'PASSWORD') {
         formData.append('password', password);
         formData.append('cart_items', JSON.stringify(cart.items))
         const result = await setCookieFetch('auth/check-password', formData);
         if (result?.error) { return toast.error(result.error) }
         setTimeout(() => { router.push(result.redirect ? result.redirect : '/') }, 2000);
      }
   }
   const resender: () => void = async () => {
      const formData = new FormData();
      formData.append('phone', phone);
      formData.append('resend', 'true');
      const result = await serversidePoster('auth/check-phone', formData);
      if (result?.error) { return toast.error(result.error) }
      if (!result.response || !result.response.data || !result.response.data.next_component) { return toast.error('unhandled error') }
      setFormSituation(result.response.data.next_component)
      return toast.success(result.response.data.message);
   }

   const [inputPassword, setInputPassword] = useState<boolean>(true);

   return (
      <div className=" container mx-auto mt-12 flex justify-center items-center h-[60vh]">
         <div className="w-full max-w-lg min-w-md flex items-center flex-col">
            <form action={submiter} className=" w-full flex flex-col gap-12">
               <div className=" text-5xl font-bold text-sky-500 text-center mb-8">Logo</div>
               <div className={formSituation == 'PHONE' ? 'flex flex-col ' : 'hidden'}>
                  <input
                     type="tel"
                     inputMode="numeric"
                     placeholder="09123456789"
                     value={phone}
                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 11)); }}
                     className={`w-full rounded-xl border-2 px-4 py-3 text-lg outline-none transition
          ${phone.length > 0 && !isValidPhone
                           ? "border-red-500 focus:ring-red-100 focus:border-red-500"
                           : "border-zinc-300 focus:ring-blue-100 focus:border-blue-500"
                        }`}
                  />
                  {phone.length > 0 && !isValidPhone && (
                     <p className="mt-2 text-sm text-red-600">
                        phone is wrong!!!
                     </p>
                  )}
               </div>
               <div className={formSituation == 'PASSWORD' ? 'flex' : 'hidden'}>
                  <div className=" relative w-full">
                     <input
                        type={inputPassword ? "password" : "text"}
                        placeholder="* * *"
                        value={password}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        className={` relative w-full rounded-xl border-2 px-4 py-3 text-lg outline-none transition
          ${password.length > 4
                              ? "border-red-500 focus:ring-red-100 focus:border-red-500"
                              : "border-zinc-300 focus:ring-blue-100 focus:border-blue-500"
                           }`}
                     />
                     <button
                        onClick={() => setInputPassword((prev: boolean) => !prev)}
                        className=" absolute right-2 top-4 text-zinc-500 cursor-pointer "
                        type="button"
                     >
                        <EyeIcon sizes={25} />
                     </button>
                  </div>
               </div>
               <div className={formSituation == 'PIN' ? 'flex justify-center w-full' : 'hidden'}>
                  <PinInput values={pin} setValues={setPin} onComplete={() => submiter} />
               </div>
               <button
                  className=" cursor-pointer transition-all duration-500 bg-sky-600 hover:bg-sky-400 text-white p-3 rounded-lg w-full"
                  type="submit"
               >
                  {formSituation == 'PHONE' ? 'check phone' : formSituation == 'PASSWORD' ? 'enter password' : 'check pin'}
               </button>
            </form>
            <form action={resender} className={` w-full justify-end mt-2   ${formSituation == 'PASSWORD' ? 'flex' : 'hidden'}`}>
               <button
                  className=" cursor-pointer transition-all duration-500 hover:text-sky-600 text-sky-400 text-sm "
                  type="submit"
               >
                  login with otp
               </button>
            </form>
         </div>
      </div>
   );
}

export default AuthPage;