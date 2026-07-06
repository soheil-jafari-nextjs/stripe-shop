import { IsNotEmpty } from "class-validator";

export class ProductsIdsDTO {
   @IsNotEmpty({ message: 'ids is empty' })
   ids!: string
}