import { IsString, Matches } from "class-validator";

export class CreateOtpDTO {
   @IsString({ message: 'phone should be string' })
   @Matches(/^0\d{10}$/, { message: 'Phone number is wrong!!!', })
   phone!: string;
}