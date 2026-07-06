import { IsOptional, IsString, Matches } from 'class-validator'

export class CheckPhoneDTO {
   @IsString({ message: 'phone should be string' })
   @Matches(/^0\d{10}$/, { message: 'Phone number is wrong!!!', })
   phone!: string;

   @IsOptional()
   resend?: string
}