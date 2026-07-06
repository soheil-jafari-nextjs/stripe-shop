import { HttpException, Injectable } from "@nestjs/common";
import { orderStatus, Prisma } from "@prisma/client";
import { CartService } from "src/cart/cart.service";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateOrderDTO } from "./dto/update-order.dto";
import { GetMyOrdersDTO } from "./dto/get-my-orders.dto";

@Injectable()
export class OrderService {
   constructor(
      private readonly prismaService: PrismaService,
      private readonly cartService: CartService,
   ) { }
   async createOrder(userId: string) {
      try {
         const userCart = await this.cartService.findCart({
            where: { userId },
            include: {
               items: {
                  include: { product: true }
               }
            }
         });
         if (!userCart) {
            throw new HttpException({ message: "no carts founded fot this user.", data: {}, }, 500,);
         }

         // check products quantity and cart quantity + make order
         let totalPrice = 0;
         const orderItems: Prisma.OrderItemCreateManyInput[] = [];

         for (const item of userCart.items) {
            if (item.quantity > item.product.quantity) {
               throw new HttpException(
                  {
                     message: `${item.product.title} does not have enough quantity. Please refresh the page.`,
                  },
                  400,
               );
            }
            totalPrice += item.product.price * item.quantity;
            orderItems.push({
               price: item.product.price,
               quantity: item.quantity,
               title: item.product.title,
               productId: item.productId,
               orderId: "",
            });
         }
         const makedOrder = await this.prismaService.order.create({
            data: {
               status: orderStatus.PENDING,
               totalPrice,
               userId,
            },
         });
         await this.prismaService.orderItem.createMany({
            data: orderItems.map(item => ({ ...item, orderId: makedOrder.id, })),
         });

         // empty cart
         const newCart = await this.cartService.emptyCart(userCart.id)

         return { message: 'order created successfully', redirect: makedOrder.id, newCart }
      }
      catch (error) {
         console.log(error);
         if (error instanceof HttpException) { throw error; }
         throw new HttpException({ message: "error in creating order.", data: {}, }, 500,);
      }
   }

   async getAllOrders(id?: string, userId?: string) {
      try {
         console.log(userId)
         return await this.prismaService.order.findMany({
            where: {
               ...(id && { id }),
               ...(userId && { userId }),
            },
            include: {
               user: { omit: { password: true } },
               orderItems: { include: { product: true } }
            },
            orderBy: { createdAt: 'desc', },
         });
      }
      catch (error) {
         console.log(error);
         if (error instanceof HttpException) { throw error; }
         throw new HttpException({ message: "error in finding user.", data: {}, }, 500,);
      }
   }

   async removeOrderById(id: string) {
      try {
         return await this.prismaService.order.delete({ where: { id } });
      }
      catch (error) {
         console.log(error);
         if (error instanceof HttpException) { throw error }
         throw new HttpException({ message: 'error in removing order', data: {} }, 500)
      }
   }

   async update(id: string, body: UpdateOrderDTO) {
      try {
         return await this.prismaService.order.update({
            where: { id },
            data: { status: body.status }
         },);
      }
      catch (error) {
         console.log(error);
         if (error instanceof HttpException) { throw error }
         throw new HttpException({ message: 'error in removing order', data: {} }, 500)
      }
   }

   async getMyAllOrders(body: GetMyOrdersDTO) {
      try {
         return await this.prismaService.order.findMany({
            where: {
               ...({ userId: body.userId }),
               ...(body.id && { id: body.id }),
            },
            include: {
               user: { omit: { password: true } },
               orderItems: { include: { product: true } },
               transactions: true,
               ship: true,
            },
            orderBy: { createdAt: 'desc', },
         });
      }
      catch (error) {
         console.log(error);
         if (error instanceof HttpException) { throw error; }
         throw new HttpException({ message: "error in finding user.", data: {}, }, 500,);
      }
   }

   async findOrder<T extends Prisma.OrderFindFirstArgs>(args: Prisma.SelectSubset<T, Prisma.OrderFindFirstArgs>) {
      try {
         return await this.prismaService.order.findFirst(args);
      }
      catch (error) {
         console.log(error);
         if (error instanceof HttpException) { throw error; }
         throw new HttpException({ message: "error in finding user.", data: {}, }, 500,);
      }
   }
}