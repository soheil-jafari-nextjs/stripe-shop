
import { Type } from 'class-transformer';
import { IsNumber, IsString, Min } from 'class-validator';

export class UpdateProductDTO {

   @IsString({ message: 'title must be string' })
   title!: string;

   @IsString({ message: 'description be string' })
   description!: string;

   @Type(() => Number)
   @IsNumber({}, { message: 'price must be number' })
   price!: number;

   @Type(() => Number)
   @IsNumber({}, { message: 'quantity must be number' })
   @Min(0, { message: "quantity must be greater than or equal to 0" })
   quantity!: number;
}