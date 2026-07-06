import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { UserModule } from "src/user/user.module";
import { OtpModule } from "src/otp/otp.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtAuthGuard } from "./guard/jwt.guard";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { CartModule } from "src/cart/cart.module";

@Module({
   imports: [PrismaModule, UserModule, OtpModule, CartModule,
      JwtModule.registerAsync({
         useFactory: (configService: ConfigService) => ({
            secret: configService.getOrThrow('JWT_ACCESS_SECRET'),
            signOptions: { expiresIn: configService.getOrThrow('JWT_EXPIRATION') }
         }),
         inject: [ConfigService],
      }),
   ],
   providers: [AuthService, JwtAuthGuard, JwtStrategy],
   controllers: [AuthController],
   exports: [AuthService],
})
export class AuthModule { }