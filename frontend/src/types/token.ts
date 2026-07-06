import { TUser } from "./user"

export type TToken = {
   id: string,
   createdAt: Date,
   code: string,
   userId: string,
   user: TUser
}