import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { OtpModule } from './otp/otp.module';
import { ConfigModule } from '@nestjs/config';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { TransactionModule } from './transaction/transaction.module';
import { CheckoutModule } from './checkout/checkout.module';
import { ShipModule } from './ship/ship.module';

@Module({
   imports: [ConfigModule.forRoot({ isGlobal: true, }), PrismaModule, ProductModule, UserModule, AuthModule, OtpModule, CartModule, OrderModule, TransactionModule, CheckoutModule, ShipModule,],
   controllers: [AppController],
   providers: [AppService],
})
export class AppModule { }
