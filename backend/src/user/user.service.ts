import { HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import { Prisma, PrismaClient } from "@prisma/client";
import { ResetPasswordDTO } from "./dto/reset-password.dto";
import bcrypt from 'bcrypt'
import { CurrentUser } from "src/auth/strategy/jwt.strategy";
import { CartService } from "src/cart/cart.service";
export type UpdateArgs = Parameters<PrismaClient['user']['update']>[0];
@Injectable()


export class UserService {

   constructor(private readonly prismaService: PrismaService, private readonly cartService: CartService,) { };

   async findUser(where: Prisma.UserWhereInput, args?: Omit<Prisma.UserFindFirstArgs, "where">) {
      try {
         return await this.prismaService.user.findFirst({ where, ...args, });
      }
      catch (error) {
         console.log(error);
         if (error instanceof HttpException) { throw error; }
         throw new HttpException({ message: "error inn finding user.", data: {}, }, 500,);
      }
   }
   async findUserWithoutPassword(where: Prisma.UserWhereInput, args?: Omit<Prisma.UserFindFirstArgs, "where">) {
      try {
         return await this.prismaService.user.findFirst({ where, ...args, omit: { password: true, }, });
      }
      catch (error) {
         console.log(error);
         if (error instanceof HttpException) { throw error; }
         throw new HttpException({ message: "error in finding user.", data: {}, }, 500,);
      }
   }

   async createUser(body: CreateUserDTO) {
      try {
         return await this.prismaService.user.create({ data: { phone: body.phone, } })
      }
      catch (error) {
         console.log(error);
         if (error instanceof HttpException) { throw error; }
         throw new HttpException({ message: "error in finding user.", data: {}, }, 500,);
      }
   }
   async updateUser(args: UpdateArgs) {
      try {
         return await this.prismaService.user.update(args);
      }
      catch (error) {
         console.log(error);
         if (error instanceof HttpException) { throw error; }
         throw new HttpException({ message: "error in finding user.", data: {}, }, 500,);
      }
   }

   async getAllUsers(id?: string) {
      try {
         return await this.prismaService.user.findMany({
            where: {
               ...(id && { id: id }),
            },
            include: { tokens: true, }, orderBy: { createdAt: 'desc', },
         });
      }
      catch (error) {
         console.log(error);
         if (error instanceof HttpException) { throw error; }
         throw new HttpException({ message: "error in finding user.", data: {}, }, 500,);
      }
   }

   async removeUser(id: string,) {
      try {
         return await this.prismaService.user.delete({ where: { id: id }, })
      }
      catch (error) {
         console.log(error);
         if (error instanceof HttpException) { throw error; }
         throw new HttpException({ message: "error in finding user.", data: {}, }, 500,);
      }
   }

   async resetPassword(body: ResetPasswordDTO, user: CurrentUser) {
      try {
         const hashedPassword = await bcrypt.hash(body.password, 10);
         return await this.updateUser({ where: { id: user.id }, data: { password: hashedPassword, }, });
      }
      catch (error) {
         console.log(error);
         if (error instanceof HttpException) { throw error; }
         throw new HttpException({ message: "error in finding user.", data: {}, }, 500,);
      }
   }
   async getZData(user: CurrentUser) {
      try {
         await this.cartService.syncCart(user.id);
         return await this.findUserWithoutPassword({ id: user.id, }, { include: { carts: { include: { items: true, }, } }, },);
      }
      catch (error) {
         console.log(error);
         if (error instanceof HttpException) { throw error; }
         throw new HttpException({ message: "error in finding user.", data: {}, }, 500,);
      }
   }
}