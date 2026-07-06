import { HttpException, Injectable } from "@nestjs/common";
import { NewCheckoutDTO } from "./dto/new-checkout.dto";
import { OrderService } from "src/order/order.service";
import Stripe from "stripe";
import { ConfigService } from "@nestjs/config";
import { TransactionService } from "src/transaction/transaction.service";
import { ProductService } from "src/product/product.service";
import { ShipService } from "src/ship/ship.service";

@Injectable()
export class CheckoutService {
   constructor(
      private readonly orderService: OrderService,
      private readonly stripe: Stripe,
      private readonly configService: ConfigService,
      private readonly transactionService: TransactionService,
      private readonly productService: ProductService,
      private readonly shipService: ShipService,
   ) { }

   async newCheckout(body: NewCheckoutDTO) {
      try {
         const foundedOrder = await this.orderService.findOrder({
            where: { id: body.orderId },
            include: { orderItems: { include: { product: true } }, },
         })
         if (!foundedOrder) {
            throw new HttpException({ message: 'order not found!' }, 500);
         }
         if (foundedOrder.status != 'PENDING') {
            throw new HttpException({ message: 'just pending orders can be checked out' }, 500);
         }

         // check products quantity and order products quantity
         let totalPrice = 0;
         for (const item of foundedOrder.orderItems) {
            if (item.quantity > item.product.quantity) {
               throw new HttpException(
                  {
                     message: `${item.product.title} does not have enough quantity. you should make new Order`,
                  },
                  400,
               );
            }
            if (item.price != item.product.price) {
               throw new HttpException(
                  {
                     message: `this product price has changed: ${item.product.title}. you should make new Order`,
                  },
                  400,
               );
            }
            totalPrice += item.price * item.quantity;
         }
         if (totalPrice != foundedOrder.totalPrice) {
            throw new HttpException({ message: 'order total price is wrong. please make new order' }, 500);
         }

         // gateway system
         const createdGateway = await this.stripe.checkout.sessions.create({
            metadata: { orderId: foundedOrder.id },
            line_items: foundedOrder.orderItems.map(item => {
               return {
                  price_data: {
                     currency: 'usd', //means 10$ or 10*100 cents
                     unit_amount: item.price, // site gets products price in cents. so this don't nee *100
                     product_data: {
                        name: item.title,
                        description: item.product.description,
                     },

                  },
                  quantity: item.quantity
               }
            }),
            mode: 'payment',
            success_url: `${this.configService.getOrThrow('WEBSITE_CLIENT_URL')}/profile/order/all?id=${body.orderId}`,
            cancel_url: `${this.configService.getOrThrow('WEBSITE_CLIENT_URL')}/profile/order/all?id=${body.orderId}`,
         })
         // making transaction
         await this.transactionService.createTransaction({
            amount: foundedOrder.totalPrice,
            orderId: foundedOrder.id,
            paymentGateway: 'STRIPE',
            status: 'PENDING',
            userId: foundedOrder.userId,
            gatewayRedirectId: createdGateway.id
         })
         return { redirectUrl: createdGateway.url }
      }
      catch (error) {
         console.log(error);
         if (error instanceof HttpException) { throw error }
         throw new HttpException({ message: 'error in new checkout' }, 500);
      }
   }

   async handleCheckoutWebhook(body: any) {
      try {
         if (body.type != 'checkout.session.completed') { return }

         // now payment is ok. 
         const session = await this.stripe.checkout.sessions.retrieve(body.data.object.id);
         if (!session.metadata || !session.id) { return }

         const foundedOrder = await this.orderService.findOrder({
            where: { id: session.metadata.orderId },
            include: { orderItems: { include: { product: true } }, },
         })
         if (!foundedOrder) { return; }
         if (foundedOrder.status === 'PAID') { return; }

         // decrease order products quantity
         for (const item of foundedOrder.orderItems) {
            await this.productService.decreaseQuantity(item.productId, item.quantity,);
         }
         await this.transactionService.updateTransaction({ where: { gatewayRedirectId: session.id }, data: { status: 'SUCCESS', }, });
         await this.orderService.update(session.metadata.orderId, { status: 'PAID' })

         // making shipping
         await this.shipService.createShip({ orderId: foundedOrder.id })

         return {}
      }
      catch (error) {
         console.log(error);
         if (error instanceof HttpException) { return error }
         throw new HttpException({ message: 'error in completing order payment' }, 500);
      }
   }


}