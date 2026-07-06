import { HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { CheckPhoneDTO } from "./dto/check-phone.dto";
import { UserService } from "src/user/user.service";
import { CheckPasswordDTO } from "./dto/check-password.dto";
import { CheckOTPDTO } from "./dto/check-otp.dto";
import { OtpService } from "src/otp/otp.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";
import bcrypt from 'bcrypt'
import { Response } from "express";
import { CurrentUser } from "./strategy/jwt.strategy";
import { randomUUID } from "crypto";
import { CartService } from "src/cart/cart.service";

@Injectable()
export class AuthService {

   constructor(
      private readonly prismaService: PrismaService,
      private readonly userService: UserService,
      private readonly otpService: OtpService,
      private readonly jwtService: JwtService,
      private readonly configService: ConfigService,
      private readonly cartService: CartService,

   ) { }

   async checkPhone(body: CheckPhoneDTO) {
      try {
         console.log(body)
         const foundedUser = await this.userService.findUser({ phone: body.phone });
         if (!foundedUser || (body.resend == 'true')) {
            await this.otpService.CreateOtp(body);
            return { message: "Please Enter PIN.", next_component: 'PIN' };
         }
         else { return { message: "Please Enter Password.", next_component: 'PASSWORD' }; }
      }
      catch (error) {
         console.log(error);
         if (error instanceof HttpException) { throw error; }
         throw new HttpException({ message: "error in finding user.", data: {}, }, 500,);
      }
   }

   async checkPassword(body: CheckPasswordDTO, response: Response) {
      try {
         const foundedUser = await this.userService.findUser({ phone: body.phone });
         if (!foundedUser) {
            throw new HttpException({ message: 'user with this phone not found' }, 400);
         }
         if (!foundedUser.password) {
            throw new HttpException({ message: 'user password is not entered. please enter with OTP' }, 400);
         }
         const validPassword = await bcrypt.compare(body.password, foundedUser.password);
         if (!validPassword) {
            throw new HttpException({ message: 'Password is Wrong' }, 400);
         }
         const refreshToken = await this.jwtService.signAsync(
            { sub: foundedUser.id, jti: randomUUID(), },
            {
               expiresIn: this.configService.getOrThrow("JWT_REFRESH_EXPIRES_IN",),
               secret: this.configService.getOrThrow("JWT_REFRESH_SECRET",),
            },
         );
         const accessToken = await this.jwtService.signAsync(
            { sub: foundedUser.id, jti: randomUUID(), },
            {
               expiresIn: this.configService.getOrThrow("JWT_ACCESS_EXPIRES_IN",),
               secret: this.configService.getOrThrow("JWT_ACCESS_SECRET",),
            },
         );


         await this.prismaService.token.create({ data: { code: refreshToken, userId: foundedUser.id, } });


         const expires = new Date();
         const expiration = Number(this.configService.getOrThrow('JWT_ACCESS_EXPIRES_IN'));
         expires.setMilliseconds(expires.getMilliseconds() + expiration);

         const rf_expires = new Date();
         const rf_expiration = Number(this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN'));
         rf_expires.setMilliseconds(rf_expires.getMilliseconds() + rf_expiration);

         response.cookie(
            'actoken',
            accessToken,
            {
               secure: true,
               httpOnly: true,
               expires: expires,
            }
         )
         response.cookie(
            'rftoken',
            refreshToken,
            {
               secure: true,
               httpOnly: true,
               expires: rf_expires
            }
         )

         const cart_items: { quantity: number, productId: string }[] = body.cart_items && body.cart_items != 'undefined' ? JSON.parse(body.cart_items) : [];
         await this.cartService.findCartAndUpdate({ userId: foundedUser.id, products: cart_items })

         return { message: "Code is true.", redirect: '/profile', };
      }
      catch (error) {
         console.log(error);
         if (error instanceof HttpException) { throw error; }
         throw new HttpException({ message: "error in finding user.", data: {}, }, 500,);
      }
   }

   async checkOtp(body: CheckOTPDTO, response: Response) {
      await this.otpService.CheckOtp(body);
      try {
         const foundedUser = await this.userService.findUser({ phone: body.phone });
         if (!foundedUser) {
            // sign up
            const createdUser = await this.userService.createUser(body);
            const refreshToken = await this.jwtService.signAsync(
               { sub: createdUser.id, jti: randomUUID(), },
               {
                  expiresIn: this.configService.getOrThrow("JWT_REFRESH_EXPIRES_IN",),
                  secret: this.configService.getOrThrow("JWT_REFRESH_SECRET",),
               },
            );
            const accessToken = await this.jwtService.signAsync(
               { sub: createdUser.id, jti: randomUUID(), },
               {
                  expiresIn: this.configService.getOrThrow("JWT_ACCESS_EXPIRES_IN",),
                  secret: this.configService.getOrThrow("JWT_ACCESS_SECRET",),
               },
            );
            await this.prismaService.token.create({ data: { code: refreshToken, userId: createdUser.id, } });


            const expires = new Date();
            const expiration = Number(this.configService.getOrThrow('JWT_ACCESS_EXPIRES_IN'));
            expires.setMilliseconds(expires.getMilliseconds() + expiration);

            const rf_expires = new Date();
            const rf_expiration = Number(this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN'));
            rf_expires.setMilliseconds(rf_expires.getMilliseconds() + rf_expiration);

            response.cookie(
               'actoken',
               accessToken,
               {
                  secure: true,
                  httpOnly: true,
                  expires: expires,
               }
            )
            response.cookie(
               'rftoken',
               refreshToken,
               {
                  secure: true,
                  httpOnly: true,
                  expires: rf_expires
               }
            )
            const cart_items: { quantity: number, productId: string }[] = body.cart_items && body.cart_items != 'undefined' ? JSON.parse(body.cart_items) : [];
            console.log('//////////////////',)
            console.log('accessToken : ', accessToken)
            console.log('refreshToken : ', refreshToken)

            await this.cartService.findCartAndUpdate({ userId: createdUser.id, products: cart_items })

            return { message: "Code is true.", redirect: '/profile/edit-password', };
         }
         else {
            const refreshToken = await this.jwtService.signAsync(
               { sub: foundedUser.id, jti: randomUUID(), },
               {
                  expiresIn: this.configService.getOrThrow("JWT_REFRESH_EXPIRES_IN",),
                  secret: this.configService.getOrThrow("JWT_REFRESH_SECRET",),
               },
            );
            const accessToken = await this.jwtService.signAsync(
               { sub: foundedUser.id, jti: randomUUID(), },
               {
                  expiresIn: this.configService.getOrThrow("JWT_ACCESS_EXPIRES_IN",),
                  secret: this.configService.getOrThrow("JWT_ACCESS_SECRET",),
               },
            );
            await this.prismaService.token.create({ data: { code: refreshToken, userId: foundedUser.id, } });

            const expires = new Date();
            const expiration = Number(this.configService.getOrThrow('JWT_ACCESS_EXPIRES_IN'));
            expires.setMilliseconds(expires.getMilliseconds() + expiration);

            const rf_expires = new Date();
            const rf_expiration = Number(this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN'));
            rf_expires.setMilliseconds(rf_expires.getMilliseconds() + rf_expiration);
            response.cookie(
               'actoken',
               accessToken,
               {
                  secure: true,
                  httpOnly: true,
                  expires: expires,
               }
            )
            response.cookie(
               'rftoken',
               refreshToken,
               {
                  secure: true,
                  httpOnly: true,
                  expires: rf_expires
               }
            )
            const cart_items: { quantity: number, productId: string }[] = body.cart_items && body.cart_items != 'undefined' ? JSON.parse(body.cart_items) : [];
            await this.cartService.findCartAndUpdate({ userId: foundedUser.id, products: cart_items })

            console.log('//////////////////',)
            console.log('accessToken : ', accessToken)
            console.log('refreshToken : ', refreshToken)
            return { message: "Code is true.", redirect: '/profile', };
         }
      }
      catch (error) {
         console.log(error);
         if (error instanceof HttpException) { throw error; }
         throw new HttpException({ message: "error in finding user.", data: {}, }, 500,);
      }
   }

   async removeRfToken(user: CurrentUser, rftoken: string,) {
      try {
         const rftokens = await this.prismaService.token.findMany({ where: { userId: user.id, }, });
         for (const t of rftokens) {
            if (rftoken == t.code) { await this.prismaService.token.delete({ where: { id: t.id, }, }); }
         }
         return { message: "rftoken remvoe", };
      }
      catch (error) {
         console.log(error);
         if (error instanceof HttpException) { throw error; }
         throw new HttpException({ message: "error in finding user.", data: {}, }, 500,);
      }
   }

   async getAcTokenFromOldRfToken(rftoken: string, response: Response) {
      try {
         const payload = await this.jwtService.verifyAsync(rftoken, { secret: this.configService.getOrThrow("JWT_REFRESH_SECRET"), });
         const token = await this.prismaService.token.findFirst({ where: { code: rftoken, }, });

         if (!token) {
            throw new UnauthorizedException();
         }
         const user = await this.prismaService.user.findUnique({ where: { id: payload.sub, }, });
         if (!user) { throw new UnauthorizedException(); }
         await this.prismaService.token.delete({ where: { id: token.id, }, });


         const refreshToken = await this.jwtService.signAsync(
            { sub: user.id, jti: randomUUID(), },
            {
               expiresIn: this.configService.getOrThrow("JWT_REFRESH_EXPIRES_IN",),
               secret: this.configService.getOrThrow("JWT_REFRESH_SECRET",),
            },
         );
         const accessToken = await this.jwtService.signAsync(
            { sub: user.id, jti: randomUUID(), },
            {
               expiresIn: this.configService.getOrThrow("JWT_ACCESS_EXPIRES_IN",),
               secret: this.configService.getOrThrow("JWT_ACCESS_SECRET",),
            },
         );
         await this.prismaService.token.create({ data: { userId: user.id, code: refreshToken, }, });

         const expires = new Date();
         const expiration = Number(this.configService.getOrThrow('JWT_ACCESS_EXPIRES_IN'));
         expires.setMilliseconds(expires.getMilliseconds() + expiration);

         const rf_expires = new Date();
         const rf_expiration = Number(this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN'));
         rf_expires.setMilliseconds(rf_expires.getMilliseconds() + rf_expiration);
         response.cookie(
            'actoken',
            accessToken,
            {
               secure: true,
               httpOnly: true,
               expires: expires,
            }
         )
         response.cookie(
            'rftoken',
            refreshToken,
            {
               secure: true,
               httpOnly: true,
               expires: rf_expires
            }
         )
         return response.status(200).json({ message: "new access token fixed", });
      }
      catch (error) {
         console.log(error);
         if (error instanceof HttpException) { throw error; }
         throw new HttpException({ message: "error in finding user.", data: {}, }, 500,);
      }
   }
}
