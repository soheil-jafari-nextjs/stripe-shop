import { TProduct } from "./product"
import { TUser } from "./user"


export type TCartItem = {
   id: string,
   createdAt: Date,
   quantity: number,
   productId: string,
   product: TProduct,
   cartId: string,
   cart: TCart,
}
export type TCart = {
   id: string,
   createdAt: Date,
   userId: string,
   user: TUser,
   items: TCartItem[]
}