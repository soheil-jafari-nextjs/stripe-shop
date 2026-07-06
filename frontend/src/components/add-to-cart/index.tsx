"use client";

import { useCartStore, ZCartItem } from "@/store/cart";
import AddToCartBtn from "./btn";
import { TProduct } from "@/types/product";
import { toast } from "sonner";
import serversidePoster from "@/actions/serversideFetcher";
import { TCart } from "@/types/cart";

export default function AddToCart({ product, actoken }: { product: TProduct, actoken?: string }) {
   const cart = useCartStore(state => state.cart);
   const set_cart = useCartStore(state => state.set_cart);
   const set_just_cart_products = useCartStore(state => state.set_just_cart_products);

   const cartIncreaser = async () => {
      if (product.quantity < 1) {
         return toast.error('product quantity is 0')
      }
      if (!actoken) {
         if (!cart) {
            return set_cart({
               id: '',
               items: [
                  {
                     quantity: 1,
                     productId: product.id
                  }
               ]
            })
         }
         const ProductInCartIndex = cart.items.findIndex(item => item.productId == product.id);
         if (ProductInCartIndex == -1) {
            return set_just_cart_products([...cart.items, { quantity: 1, productId: product.id }])
         }
         // check product quantity
         const goalCartProductItem = cart.items[ProductInCartIndex];
         const newQuantity = goalCartProductItem.quantity + 1;
         if (newQuantity > product.quantity) {
            return toast.error(`you have max quantity of product ${product.quantity}`)
         }
         const newCartItems: ZCartItem[] = [
            ...cart.items.filter(item => item.productId != product.id),
            { quantity: newQuantity, productId: goalCartProductItem.productId },
         ];
         return set_just_cart_products(newCartItems);
      }
      else {
         // request to backend
         const formData = new FormData();
         formData.append('productId', product.id)
         formData.append('situation', 'ADD')
         const result = await serversidePoster('cart/add', formData);
         if (result.error) { toast.error(result.error) }
         else {
            const newCartData: TCart = result.response?.data;
            if (newCartData) {
               return set_cart({
                  id: newCartData.id,
                  items: newCartData.items.map(item => {
                     return {
                        productId: item.productId,
                        quantity: item.quantity
                     }
                  }),
               })
            }
         }
      }
   }
   const cartDecreaser = async () => {
      if (!actoken) {
         if (!cart) {
            return set_cart({
               id: '',
               items: []
            })
         }
         const ProductInCartIndex = cart.items.findIndex(item => item.productId == product.id);
         if (ProductInCartIndex == -1) {
            return toast.error('product removed from cart')
         }
         const goalCartProductItem = cart.items[ProductInCartIndex]

         if (goalCartProductItem.quantity > 1) {
            const newCartItems: ZCartItem[] = [
               ...cart.items.filter(item => item.productId != product.id),
               { quantity: goalCartProductItem.quantity - 1, productId: goalCartProductItem.productId },
            ];
            return set_just_cart_products(newCartItems);
         }
         else {
            const newCartItems: ZCartItem[] = [...cart.items.filter(item => item.productId != product.id),];
            return set_just_cart_products(newCartItems);
         }
      }
      else {
         // request to backend
         const formData = new FormData();
         formData.append('productId', product.id)
         formData.append('situation', 'REMOVE')
         const result = await serversidePoster('cart/add', formData);
         if (result.error) { toast.error(result.error) }
         else {
            const newCartData: TCart = result.response?.data;
            if (newCartData) {
               return set_cart({
                  id: newCartData.id,
                  items: newCartData.items.map(item => { return { productId: item.productId, quantity: item.quantity } }),
               })
            }
         }
      }
   }

   return (
      <AddToCartBtn
         quantity={
            (() => {
               const goalProds = cart.items.filter(prod => prod.productId == product.id);
               if (goalProds.length < 1) { return 0 }
               else { return goalProds[0].quantity }
            })()
         }
         onIncrease={cartIncreaser}
         onDecrease={cartDecreaser}
      />
   )
}