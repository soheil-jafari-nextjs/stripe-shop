import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { CartModule } from "src/cart/cart.module";

@Module({
   imports: [PrismaModule, CartModule],
   providers: [UserService],
   controllers: [UserController],
   exports: [UserService]
})

export class UserModule { }