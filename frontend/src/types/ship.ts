import { TOrder } from "./order"

export enum ShipStatus {
   PENDING = 'PENDING',
   SHIPPED = 'SHIPPED',
   DELIVERED = 'DELIVERED',
}

export type TShip = {
   id: string,
   createdAt: Date,
   updatedAt: Date,
   trackingCode?: string,
   status: ShipStatus,
   orderId: string,
   order: TOrder,
}