import { TCart } from "./cart"
import { TOrder } from "./order"
import { TToken } from "./token"

export enum Role {
   ADMIN = 'ADMIN',
   USER = 'USER',
}
export type TUser = {
   id: string,
   phone: string,
   password?: string,
   createdAt: Date,
   tokens: TToken[],
   orders: TOrder[],
   carts: TCart[],
   role: Role
}