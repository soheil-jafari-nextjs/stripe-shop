import { HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateOtpDTO } from "./dto/create-otp.dto";
import { randomNumber } from "src/common/randomNumber";
import bcrypt from 'bcrypt'
import { CheckOtpDTO } from "./dto/check-otp.dto";

@Injectable()
export class OtpService {
   constructor(
      private readonly prismaService: PrismaService,
   ) { }

   async CreateOtp(body: CreateOtpDTO) {
      try {
         await this.prismaService.otp.deleteMany({ where: { expired_at: { lt: new Date(), }, }, });
         const foundedOtp = await this.prismaService.otp.findFirst({
            where: { phone: body.phone, expired_at: { gt: new Date(), }, },
         });
         // if (foundedOtp) {
         //    throw new HttpException({ message: 'you have some active codes' }, 400);
         // }
         const date = new Date(Date.now() + 2 * 60 * 1000);
         const mycode = `${randomNumber(5)}`;
         console.log(mycode)
         const hashedPassword = await bcrypt.hash(mycode, 10);
         return await this.prismaService.otp.create({
            data: {
               phone: body.phone,
               expired_at: date,
               code: hashedPassword
            }
         })
      }
      catch (error) {
         console.log(error);
         if (error instanceof HttpException) { throw error; }
         throw new HttpException({ message: "error in creating otp.", data: {}, }, 500,);
      }
   }

   async CheckOtp(body: CheckOtpDTO) {
      try {
         await this.prismaService.otp.deleteMany({ where: { expired_at: { lt: new Date(), }, }, });
         const foundedOtp = await this.prismaService.otp.findFirst({
            where: { phone: body.phone, expired_at: { gt: new Date(), }, },
            orderBy: { createdAt: 'desc', },
         });
         if (!foundedOtp) {
            throw new HttpException({ message: 'otp for this phone not found' }, 400);
         }
         const validPin = await bcrypt.compare(body.code, foundedOtp.code,);
         // make user in db and get him token
         if (!validPin) {
            throw new HttpException({ message: 'code is wrong' }, 400);
         }
         return validPin;
      }
      catch (error) {
         if (error instanceof HttpException) { throw error; }
         throw new HttpException({ message: 'error in finding user.', data: {}, }, 500,);
      }
   }

}