import { IsNotEmpty, IsOptional, IsString, Matches, } from "class-validator";

export class CheckOTPDTO {
   @IsNotEmpty({ message: 'phone is required' })
   @IsString({ message: 'phone should be string' })
   @Matches(/^0\d{10}$/, { message: 'Phone number is wrong!!!', })
   phone!: string;

   @IsNotEmpty({ message: 'code is required' })
   @IsString({ message: 'code should be string' })
   @Matches(/^\d{5}$/, { message: 'code Must be exactly 5 digits.', })
   code!: string;

   @IsOptional()
   cart_items!: string;
}