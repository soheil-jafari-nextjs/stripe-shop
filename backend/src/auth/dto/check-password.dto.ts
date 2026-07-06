import { IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class CheckPasswordDTO {
   @IsString({ message: 'phone should be string' })
   @Matches(/^0\d{10}$/, { message: 'Phone number is wrong!!!', })
   phone!: string;


   @IsNotEmpty({ message: 'password should not be empty' })
   @IsString({ message: 'password should be string' })
   @MinLength(8, { message: "password must be at least 8 characters long" })
   @Matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=\[{\]};:'",.<>\/\\|`~]).+$/,
      {
         message: "password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      },
   )
   password!: string;

   @IsOptional()
   cart_items!: string;
}