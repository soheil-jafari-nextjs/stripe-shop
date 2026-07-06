import { IsString, Matches } from "class-validator";

export class CheckOtpDTO {
   @IsString({ message: 'phone should be string' })
   @Matches(/^0\d{10}$/, { message: 'Phone number is wrong!!!', })
   phone!: string;

   @IsString({ message: 'code should be string' })
   @Matches(/^\d{5}$/, { message: 'code Must be exactly 5 digits.', })
   code!: string;
}