'use client'

import serversidePoster from "@/actions/serversideFetcher";
import EyeIcon from "@/icons/eye";
import { redirect, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";

const EditPasswordPage = () => {
   const [inputPassword, setInputPassword] = useState<boolean>(true);
   const [password, setPassword] = useState<string>("");
   const [passwordError, setPasswordError] = useState("");
   const submiter: () => void = async () => {
      const formData = new FormData();
      formData.append('password', password);
      const response = await serversidePoster('user/reset-password', formData);
      if (response?.error) { return toast.error(response.error) }
      else { redirect('/profile') }
   }

   const validatePassword = (value: string) => {
      if (value.length === 0) {
         return "";
      }

      if (value.length < 8) {
         return "Password must be at least 8 characters long.";
      }

      if (!/[A-Z]/.test(value)) {
         return "Password must contain at least one uppercase letter.";
      }

      if (!/[a-z]/.test(value)) {
         return "Password must contain at least one lowercase letter.";
      }

      if (!/\d/.test(value)) {
         return "Password must contain at least one number.";
      }

      if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]`~';]/.test(value)) {
         return "Password must contain at least one special character.";
      }

      return "";
   };
   const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setPassword(value);
      setPasswordError(validatePassword(value));
   };
   const router = useRouter();


   return (
      <div className=" container mx-auto mt-12 flex justify-center items-center h-[80vh]">
         <div className="w-full max-w-lg min-w-md flex items-center flex-col">
            <form action={submiter} className=" w-full flex flex-col gap-12">
               <div className=" text-5xl font-bold text-sky-500 text-center mb-8">New Password</div>
               <div className='flex flex-col gap-1 relative'>
                  <input
                     type={inputPassword ? "password" : "text"}
                     placeholder="* * *"
                     value={password}
                     onChange={handlePasswordChange}
                     className={`w-full rounded-xl border-2 px-4 py-3 text-lg outline-none transition ${passwordError
                        ? "border-red-500 focus:ring-red-100 focus:border-red-500"
                        : "border-zinc-300 focus:ring-blue-100 focus:border-blue-500"
                        }`}
                  />

                  {passwordError && (
                     <p className="mt-1 text-sm text-red-500">
                        {passwordError}
                     </p>
                  )}
                  <button
                     onClick={() => setInputPassword((prev: boolean) => !prev)}
                     className=" absolute right-2 top-4 text-zinc-500 cursor-pointer "
                     type="button"
                  >
                     <EyeIcon sizes={25} />
                  </button>
               </div>
               <div className=" flex flex-col gap-2">
                  <button
                     className=" cursor-pointer transition-all duration-500 bg-sky-600 hover:bg-sky-400 text-white p-3 rounded-lg w-full"
                     type="submit"
                  >
                     Set New Password
                  </button>
                  <button
                     className=" cursor-pointer transition-all duration-500 bg-zinc-200 hover:bg-sky-300 text-black p-3 rounded-lg w-full"
                     type="button"
                     onClick={() => router.push('/profile')}
                  >
                     Not Yet
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}

export default EditPasswordPage;