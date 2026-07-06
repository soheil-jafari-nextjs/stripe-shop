import { create } from 'zustand'
import { persist } from 'zustand/middleware';

export type ZCartItem = {
   quantity: number,
   productId: string
}
export type ZCart = {
   id: string,
   items: ZCartItem[],
}
export type ZCartStore = {
   cart: ZCart,
   set_cart: (t: ZCart) => void,
   set_just_cart_products: (t: ZCartItem[]) => void,
}


export const useCartStore = create<ZCartStore, [['zustand/persist', { siteId: string; email: string; siteUrl: string }],]>(
   persist(
      (set, get) => (
         {
            cart: { id: "", items: [] },
            set_cart: (data: ZCart) => { set(() => ({ cart: data })) },
            set_just_cart_products: (data: ZCartItem[]) => { set(() => ({ cart: { id: get().cart.id, items: data } })) },
         }
      ),
      { name: "cart" }
   )
)



