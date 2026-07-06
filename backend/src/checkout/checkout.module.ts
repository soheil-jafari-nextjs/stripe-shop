import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { CheckoutService } from "./checkout.service";
import { CheckoutController } from "./checkout.controller";
import { OrderModule } from "src/order/order.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import Stripe from "stripe";
import { TransactionModule } from "src/transaction/transaction.module";
import { ProductModule } from "src/product/product.module";
import { ShipModule } from "src/ship/ship.module";

@Module({
   imports: [PrismaModule, OrderModule, ConfigModule, TransactionModule, ProductModule, ShipModule,],
   providers: [CheckoutService,
      {
         provide: Stripe,
         useFactory: (configService: ConfigService) => new Stripe(configService.getOrThrow('STRIPE_SECRET_KEY')),
         inject: [ConfigService]
      }
   ],
   controllers: [CheckoutController],
   exports: [CheckoutService],
})
export class CheckoutModule { }