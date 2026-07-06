import { IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateUserDTO {
   @IsNotEmpty({ message: 'Phone should not be empty' })
   @IsString({ message: 'phone should be string' })
   @Matches(/^0\d{10}$/, { message: 'Phone number is wrong!!!', })
   phone!: string;
}