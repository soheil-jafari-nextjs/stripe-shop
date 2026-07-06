import { HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AddToCartDTO } from "./dto/add-to-cart.dto";
import { CurrentUser } from "src/auth/strategy/jwt.strategy";
import { Prisma } from "@prisma/client";
import { CartCreatorDTO } from "./dto/cart-creatoer.dto";
import { ProductService } from "src/product/product.service";

@Injectable()
export class CartService {
   constructor(
      private readonly prismaService: PrismaService,
      private readonly productService: ProductService,
   ) { }

   async cartCreator(body: CartCreatorDTO) {
      try {
         const createdCart = await this.prismaService.cart.create({ data: { userId: body.userId, }, include: { items: { orderBy: { createdAt: "desc", }, }, }, })
         if (body.products.length > 0) {

            const existingProducts = await this.prismaService.product.findMany({
               where: { id: { in: body.products.map(p => p.productId), }, },
               select: { id: true, },
            });
            const existingIds = new Set(existingProducts.map(p => p.id));

            const newCartItems = body.products
               .filter(p => existingIds.has(p.productId))
               .map(p => ({
                  cartId: createdCart.id,
                  productId: p.productId,
                  quantity: p.quantity,
               }));

            await this.prismaService.cartItem.createMany({ data: newCartItems, });
         }
      }
      catch (error) {
         console.log(error);
         if (error instanceof HttpException) { throw error; }
         throw new HttpException({ message: "error in finding user.", data: {}, }, 500,);
      }
   }

   async findCart<T extends Prisma.CartFindFirstArgs>(args: Prisma.SelectSubset<T, Prisma.CartFindFirstArgs>) {
      try {
         return await this.prismaService.cart.findFirst(args);
      }
      catch (error) {
         console.log(error);
         if (error instanceof HttpException) { throw error; }
         throw new HttpException({ message: "error in finding user.", data: {}, }, 500,);
      }
   }

   async addToCart(body: AddToCartDTO, user: CurrentUser) {
      try {
         const cart = await this.findCart(
            {
               where: { userId: user.id, },
               include: { items: { orderBy: { createdAt: "desc", }, }, },
            }
         );
         const foundedProduct = await this.productService.getProductDetails({ id: body.productId });
         if (!foundedProduct) {
            throw new HttpException({ message: "product not found!", data: {}, }, 400,);
         }

         if (body.situation == 'ADD') {
            if (foundedProduct.quantity < 1) {
               throw new HttpException({ message: 'product quantity is 0', data: {}, }, 400,);
            }

            if (!cart) {
               await this.cartCreator({ userId: user.id, products: [{ quantity: 1, productId: body.productId, }] })
               const cartWithNewData = await this.findCart(
                  {
                     where: { userId: user.id, },
                     include: { items: { orderBy: { createdAt: "desc", }, }, },
                  }
               );
               return cartWithNewData
            }

            const ProductInCartIndex = cart.items.findIndex(item => item.productId == body.productId);
            if (ProductInCartIndex == -1) {
               await this.prismaService.cartItem.create({
                  data: {
                     quantity: 1,
                     productId: body.productId,
                     cartId: cart.id
                  }
               });
               const cartWithNewData = await this.findCart(
                  {
                     where: { userId: user.id, },
                     include: { items: { orderBy: { createdAt: "desc", }, }, },
                  }
               );
               return cartWithNewData
            }


            // check product quantity
            const newQuantity = cart.items[ProductInCartIndex].quantity + 1;
            if (newQuantity > foundedProduct.quantity) {
               throw new HttpException({ message: `you have max quantity of product ${foundedProduct.quantity}`, data: {}, }, 400,);
            }
            await this.prismaService.cartItem.update({
               where: { id: cart.items[ProductInCartIndex].id },
               data: { quantity: newQuantity }
            })
            const cartWithNewData = await this.findCart(
               {
                  where: { userId: user.id, },
                  include: { items: { orderBy: { createdAt: "desc", }, }, },
               }
            );
            return cartWithNewData
         }
         // THIS IS REMOVE
         if (!cart) {
            const cartWithNewData = await this.cartCreator({ userId: user.id, products: [] });
            return cartWithNewData
         }
         const ProductInCartIndex = cart.items.findIndex(item => item.productId == body.productId);
         if (ProductInCartIndex == -1) { return cart }

         const goalCartProductItem = cart.items[ProductInCartIndex]
         if (goalCartProductItem.quantity > 1) {
            await this.prismaService.cartItem.update({
               where: { id: goalCartProductItem.id },
               data: { quantity: goalCartProductItem.quantity - 1 }
            })
            const cartWithNewData = await this.findCart(
               {
                  where: { userId: user.id, },
                  include: { items: { orderBy: { createdAt: "desc", }, }, },
               }
            );
            return cartWithNewData
         }
         else {
            await this.prismaService.cartItem.delete({ where: { id: goalCartProductItem.id } })
            const cartWithNewData = await this.findCart(
               {
                  where: { userId: user.id, },
                  include: { items: { orderBy: { createdAt: "desc", }, }, },
               }
            );
            return cartWithNewData
         }
      }
      catch (error) {
         console.log(error);
         if (error instanceof HttpException) { throw error; }
         throw new HttpException({ message: "error in finding user.", data: {}, }, 500,);
      }
   }

   async findCartAndUpdate(body: CartCreatorDTO) {
      try {
         const userOldCart = await this.findCart({
            where: { userId: body.userId },
            include: { items: { orderBy: { createdAt: "desc", }, }, },
         })

         if (!userOldCart) {
            return await this.cartCreator(body)
         }

         const map = new Map(userOldCart.items.map(i => [i.productId, { id: i.id, quantity: i.quantity }]));
         for (const item of body.products) {
            const founded = map.get(item.productId);
            if (founded) { await this.prismaService.cartItem.update({ where: { id: founded.id }, data: { quantity: founded.quantity + item.quantity } }); }
            else { await this.prismaService.cartItem.create({ data: { cartId: userOldCart.id, productId: item.productId, quantity: item.quantity } }); }
         }
         return await this.findCart({ where: { id: userOldCart.id }, include: { items: { include: { product: true } } } });
      }
      catch (error) {
         console.log(error);
         if (error instanceof HttpException) { throw error; }
         throw new HttpException({ message: "error in finding user.", data: {}, }, 500,);
      }
   }

   async syncCart(userId: string) {
      try {
         const cart = await this.findCart({
            where: { userId },
            include: { items: { include: { product: true, }, orderBy: { createdAt: "desc", }, }, },
         });
         if (!cart) { return null; }

         const updates: Prisma.PrismaPromise<any>[] = [];
         for (const item of cart.items) {
            const newQuantity = Math.min(item.quantity, item.product.quantity,);
            if (newQuantity === 0) {
               updates.push(this.prismaService.cartItem.delete({ where: { id: item.id, }, }),);
               continue;
            }
            if (newQuantity !== item.quantity) {
               updates.push(this.prismaService.cartItem.update({ where: { id: item.id, }, data: { quantity: newQuantity, }, }),);
               item.quantity = newQuantity;
            }
         }
         if (updates.length > 0) { await this.prismaService.$transaction(updates); }
         return await this.findCart({
            where: { userId },
            include: { items: { orderBy: { createdAt: "desc", }, include: { product: true, }, }, },
         });
      }
      catch (error) {
         console.log(error);
         if (error instanceof HttpException) { throw error; }
         throw new HttpException({ message: "error in finding user.", data: {}, }, 500,);
      }
   }

   async getSyncedCart(userId: string) {
      try {
         await this.syncCart(userId);
         return await this.findCart({
            where: { userId },
            include: { items: { orderBy: { createdAt: "desc" }, include: { product: true }, }, },
         });
      }
      catch (error) {
         console.log(error);
         if (error instanceof HttpException) { throw error; }
         throw new HttpException({ message: "error in finding user.", data: {}, }, 500,);
      }
   }

   async getAllCarts(id?: string, userId?: string) {
      try {
         return await this.prismaService.cart.findMany({
            where: {
               ...(id && { id }),
               ...(userId && { userId }),
            },
            include: {
               user: { omit: { password: true } },
               items: { include: { product: true } }
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

   async removeCart(id: string,) {
      try {
         return await this.prismaService.cart.delete({ where: { id: id }, })
      }
      catch (error) {
         console.log(error);
         if (error instanceof HttpException) { throw error; }
         throw new HttpException({ message: "error in finding user.", data: {}, }, 500,);
      }
   }

   async emptyCart(cartId: string) {
      try {
         return await this.prismaService.cartItem.deleteMany({ where: { cartId }, })
      }
      catch (error) {
         console.log(error);
         if (error instanceof HttpException) { throw error; }
         throw new HttpException({ message: "error in finding user.", data: {}, }, 500,);
      }
   }

}