'use client'
import { sum } from "@/actions/calculators";
import { useCartStore } from "@/store/cart";
import { useUserStore } from "@/store/user";
import { Role, TUser } from "@/types/user";
import Link from "next/link";
import { useEffect } from "react";

const ZDataSetter = ({ response }: { response: TUser | { statusCode: number } }) => {
   const user = useUserStore(state => state.user);
   const set_user = useUserStore(state => state.set_user);
   const set_cart = useCartStore(state => state.set_cart);
   useEffect(() => {
      if ("statusCode" in response) { }
      else {
         console.log(response.carts)
         set_user({ id: response.id, phone: response.phone, role: response.role });
         if (response.carts && response.carts.length > 0 && response.carts[0].id) {
            set_cart({ id: response.carts[0].id, items: !response.carts[0].items ? [] : response.carts[0].items.map(prod => { return { productId: prod.productId, quantity: prod.quantity } }) });
         }
      }
   }, [response]);
   const cart = useCartStore(state => state.cart);
   return (
      <div className=" flex justify-end items-center gap-4">
         {"statusCode" in response ?
            <Link
               className="bg-white text-sky-600 p-2 rounded-md"
               href="/auth"
            >
               login
            </Link>
            : <div className=" flex justify-end items-center gap-4">
               <>{
                  user.role == Role.ADMIN &&
                  <Link
                     className="bg-white text-sky-700 p-2 rounded-md"
                     href="/admin"
                  >
                     admin
                  </Link>
               }</>
               <Link
                  className="bg-white text-sky-600 p-2 rounded-md"
                  href="/profile"
               >
                  profile
               </Link>
            </div>
         }
         <Link
            className="bg-white text-sky-700 p-2 rounded-md relative"
            href="/cart"
         >
            cart
            <span className="absolute -top-2 flex justify-center items-center -left-2 bg-green-600 text-white min-w-7 min-h-7 rounded-full">
               <span>
                  {cart && cart.items != undefined && sum(cart.items.map(item => item.quantity))}
               </span>
            </span>
         </Link>
      </div>
   );
};

export default ZDataSetter;