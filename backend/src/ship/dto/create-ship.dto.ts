import { IsNotEmpty, IsString } from "class-validator";

export class CreateShipDTO {
   @IsNotEmpty({ message: 'orderId must not be empty' })
   @IsString({ message: 'orderId must be string' })
   orderId!: string
}