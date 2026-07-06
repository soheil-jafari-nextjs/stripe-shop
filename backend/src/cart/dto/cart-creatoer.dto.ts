import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CartCreatorDTO {
   @IsOptional()
   products!: { quantity: number, productId: string }[]

   @IsNotEmpty()
   @IsString()
   userId!: string
}