'use client'
import { serversideGetter, tokenRemover } from "@/actions/serversideFetcher";
import LogoutIcon from "@/icons/logout";
import { useCartStore } from "@/store/cart";
import { useUserStore } from "@/store/user";
import { Role } from "@/types/user";
import { toast } from "sonner";

const Logout = () => {
   const set_cart = useCartStore(state => state.set_cart);
   const set_user = useUserStore(state => state.set_user);
   const logouter: () => void = async () => {
      const result = await serversideGetter('auth/logout')
      if (result?.error) { return toast.error(result.error) }
      else {
         set_cart({ id: "", items: [] });
         set_user({ id: "", phone: '', role: Role.USER });
         return await tokenRemover();
      }
   }

   return (
      <form action={logouter}>
         <button
            type="submit"
            className=" bg-red-600 cursor-pointer text-white hover:bg-red-400 p-2 rounded-lg transition-all duration-500"
         >
            <LogoutIcon sizes={23} />
         </button>
      </form>
   );
}

export default Logout;