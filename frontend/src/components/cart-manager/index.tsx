'use client'

import serversidePoster, { serversideGetter } from "@/actions/serversideFetcher";
import LoadingIcon from "@/icons/loading";
import { useCartStore } from "@/store/cart";
import { TCart, TCartItem } from "@/types/cart";
import { TProduct } from "@/types/product";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AddToCart from "../add-to-cart";
import { TUser } from "@/types/user";
import { useRouter } from "next/navigation";

const CartManger = ({ actoken }: { actoken?: string }) => {
   const cart = useCartStore(store => store.cart);
   const idsForUpdateUseeffect = cart.items.map(i => i.productId).join(",");
   const set_cart = useCartStore(store => store.set_cart);
   const set_just_cart_products = useCartStore(store => store.set_just_cart_products);

   const [loadingStatus, setLoadingStatus] = useState<number>(0);
   const [cartProducts, setcartProducts] = useState<TCartItem[]>([]);

   const fetcher = async () => {
      const result = await serversideGetter('cart/get',);
      if (result?.error) {
         setLoadingStatus(-1);
         return toast.error(result.error)
      }
      else {
         setLoadingStatus(1);
         setcartProducts(result.items);
         set_cart(result)
      }
   };

   const clientSideCartFetcher = async () => {
      const formData = new FormData();
      formData.append('ids', JSON.stringify(cart.items.map(i => i.productId)))
      const result = await serversidePoster('product/get-products-by-ids', formData);
      if (result?.error) {
         setLoadingStatus(-1);
         return toast.error(result.error)
      }
      else {
         const fakeCart: TCart = {
            id: cart.id,
            createdAt: new Date(),
            userId: "",
            user: {} as TUser,
            items: [],
         };
         setLoadingStatus(1);
         const resp: TProduct[] = !result.response ? [] : result.response.data;
         const quantityMap = new Map(cart.items.map(item => [item.productId, item.quantity]));
         const merged: TCartItem[] = [];
         for (const product of resp) {
            const quantity = Math.min(quantityMap.get(product.id) ?? 1, product.quantity,);
            if (quantity === 0) { continue; }
            merged.push({
               id: crypto.randomUUID(),
               createdAt: new Date(),
               quantity,
               productId: product.id,
               product,
               cartId: fakeCart.id,
               cart: fakeCart,
            });
         }

         setcartProducts(merged)
         set_just_cart_products(merged)
      }
   };

   useEffect(() => {
      if (!cart) { return }
      if (!actoken) {
         if (!cart.items || cart.items.length < 1) {
            setcartProducts([]);
            return setLoadingStatus(1);
         }
         clientSideCartFetcher()
      }
      else if (actoken) { fetcher(); }
   }, [idsForUpdateUseeffect, actoken]);


   const router = useRouter();
   const orderCreator: () => void = async () => {
      if (!actoken || actoken.length < 10) { return router.push('/auth') }
      const formData = new FormData();
      const result = await serversidePoster(`order/new`, formData);
      if (result.error) { return toast.error(result.error) }
      if (result.response) {
         const newRes: { newCart?: TCart, redirect: string, message: string, } = result.response.data;
         if (newRes.newCart && newRes.newCart.items) {
            set_cart({ id: newRes.newCart.id, items: newRes.newCart.items.map(it => { return { productId: it.productId, quantity: it.quantity } }) })
         }
         router.push(`/profile/order/all?id=${newRes.redirect}`)
         return toast.success(newRes.message)
      }
   }


   return (
      <div className=" flex flex-col gap-8 ">
         <div className=" flex justify-between items-center gap-6">
            <div className=" text-2xl font-bold">Cart</div>
            <form action={orderCreator}>
               <button
                  className=" bg-sky-600 text-white p-3 rounded-xl transition-all duration-500 hover:bg-sky-400 cursor-pointer"
                  type="submit"
               >
                  Checkout
               </button>
            </form>
         </div>
         {
            loadingStatus == 0 ? <div className=" flex justify-center items-center p-6"><LoadingIcon sizes={40} /></div> :
               <>
                  {
                     cartProducts && cartProducts.length < 1 ? <div className=" p-6 text-center font-bold">Cart is Empty</div> :
                        <div className=" grid grid-cols-4 gap-4 ">
                           {
                              cartProducts && cartProducts.map((prod, index) => (
                                 <div
                                    key={index}
                                    className=" bg-zinc-100 p-4 rounded-2xl flex flex-col gap-4 "
                                 >
                                    <div className=" flex justify-between items-center gap-4">
                                       <div className="  font-bold">{prod.product.title}</div>
                                       <div className=" text-sm">{prod.product.price / 100} $</div>
                                    </div>
                                    <AddToCart product={prod.product} actoken={actoken} />
                                 </div>
                              ))
                           }
                        </div>
                  }
               </>
         }
      </div>
   );
}

export default CartManger;