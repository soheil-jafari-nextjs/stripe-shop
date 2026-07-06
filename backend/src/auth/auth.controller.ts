import { Body, Controller, Get, HttpException, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CheckPhoneDTO } from "./dto/check-phone.dto";
import { CheckPasswordDTO } from "./dto/check-password.dto";
import { CheckOTPDTO } from "./dto/check-otp.dto";
import type { Request, Response } from "express";
import { JwtAuthGuard } from "./guard/jwt.guard";
import { CurrentUser } from "./strategy/jwt.strategy";

@Controller('auth')
export class AuthController {
   constructor(private readonly authService: AuthService) { }

   @Post('check-phone')
   async checkPhone(@Body() body: CheckPhoneDTO) {
      return await this.authService.checkPhone(body);
   }

   @Post('check-password')
   async checkPassword(@Res({ passthrough: true }) response: Response, @Body() body: CheckPasswordDTO) {
      return await this.authService.checkPassword(body, response);
   }

   @Post('check-pin')
   async checkOtp(@Body() body: CheckOTPDTO, @Res({ passthrough: true }) response: Response) {
      return await this.authService.checkOtp(body, response)
   }

   @Get('logout')
   @UseGuards(JwtAuthGuard)
   async removeRefreshToken(@Req() request: Request) {
      const rftoken: string = request.cookies ? request.cookies.rftoken : undefined;
      if (!rftoken || rftoken.length < 20) {
         throw new HttpException({ message: "rf token is not valid.", data: {}, }, 401,);
      }
      return await this.authService.removeRfToken(request.user as CurrentUser, rftoken)
   }

   @Post('refresh')
   async getAcTokenFromOldRfToken(@Req() request: Request, @Res() response: Response) {
      const rftoken: string = request.cookies ? request.cookies.rftoken : undefined;
      if (!rftoken || rftoken.length < 20) {
         throw new HttpException({ message: "rf token is not valid.", data: {}, }, 401,);
      }
      return await this.authService.getAcTokenFromOldRfToken(rftoken, response)
   }
}