import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator"
import { CartSituation } from "src/common/enums/cart-situation.enum";

export class AddToCartDTO {
   @IsEnum(CartSituation, { message: 'CartSituation must be ADD or REMOVE', })
   situation!: CartSituation;

   @IsNotEmpty({ message: 'product Id should not be empty' })
   @IsString({ message: 'product Id should be string' })
   productId!: string
}