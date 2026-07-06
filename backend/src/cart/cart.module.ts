import { Module } from "@nestjs/common";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { ProductModule } from "src/product/product.module";

@Module({
   imports: [PrismaModule, ProductModule,],
   providers: [CartService],
   controllers: [CartController],
   exports: [CartService],
})

export class CartModule { }