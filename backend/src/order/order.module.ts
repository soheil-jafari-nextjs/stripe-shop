import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { CartModule } from "src/cart/cart.module";

@Module({
   imports: [PrismaModule, CartModule,],
   providers: [OrderService],
   controllers: [OrderController],
   exports: [OrderService],
})
export class OrderModule { }