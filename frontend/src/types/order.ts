import { TProduct } from "./product"
import { TShip } from "./ship"
import { TUser } from "./user"

export enum orderStatus {
   PENDING = 'PENDING',
   PAID = 'PAID',
   CANCELLED = 'CANCELLED',
   EXPIRED = 'EXPIRED',
   REFUNDED = 'REFUNDED',
}
export enum TransactionStatus {
   PENDING = 'PENDING',
   SUCCESS = 'SUCCESS',
   FAILED = 'FAILED',
}
export enum PaymentGateway {
   STRIPE = 'STRIPE',
}


export type OrderItem = {
   id: string,
   createdAt: Date,
   price: number,
   title: string,
   quantity: number,

   productId: string,
   product: TProduct,

   orderId: string,
   order: TOrder,
}

export type TTransaction = {
   id: string,
   createdAt: Date,
   updatedAt: Date,

   status: TransactionStatus,
   amount: number,
   gatewayRedirectId: string,
   paymentGateway: PaymentGateway,

   userId: string,
   user: TUser,

   orderId: string,
   order: TOrder,
}

export type TOrder = {
   id: string,
   createdAt: Date,
   totalPrice: number,
   status: orderStatus,
   userId: string,
   user: TUser,
   orderItems: OrderItem[],
   transactions: TTransaction[],
   ship: TShip,
}