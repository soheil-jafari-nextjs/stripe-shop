import { IsNotEmpty, IsString } from 'class-validator';
export class NewCheckoutDTO {

   @IsNotEmpty({ message: 'oderId should not be empty' })
   @IsString({ message: 'oderId should be string' })
   orderId!: string
}