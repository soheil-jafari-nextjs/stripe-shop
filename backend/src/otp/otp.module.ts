import { Module } from "@nestjs/common";
import { OtpController } from "./otp.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { OtpService } from "./otp.service";
import { UserModule } from "src/user/user.module";

@Module({
   imports: [PrismaModule, UserModule,],
   providers: [OtpService],
   controllers: [OtpController],
   exports: [OtpService],
})

export class OtpModule { }