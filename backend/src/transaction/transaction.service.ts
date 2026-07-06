import { HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateTransactionDTO } from "./dto/create-transaction.dto";
import { PrismaClient } from "@prisma/client";
import { UpdateTransactionDTO } from "./dto/update-transaction.dto";
export type UpdateArgs = Parameters<PrismaClient['transaction']['update']>[0];

@Injectable()
export class TransactionService {
   constructor(private readonly prismaService: PrismaService) { }

   async createTransaction(body: CreateTransactionDTO) {
      try {
         return await this.prismaService.transaction.create({
            data: {
               amount: body.amount,
               gatewayRedirectId: body.gatewayRedirectId,
               paymentGateway: 'STRIPE',
               status: "PENDING",
               orderId: body.orderId,
               userId: body.userId,
            }
         })
      }
      catch (error) {
         console.log(error);
         throw new HttpException({ message: 'error in making transaction' }, 500);
      }
   }

   async updateTransaction(args: UpdateArgs) {
      try {
         return await this.prismaService.transaction.update(args);
      }
      catch (error) {
         console.log(error);
         if (error instanceof HttpException) { throw error; }
         throw new HttpException({ message: "error in finding user.", data: {}, }, 500,);
      }
   }

   async getAllTransactions(id?: string, orderId?: string, userId?: string,) {
      try {
         return await this.prismaService.transaction.findMany({
            where: {
               ...(id && { id: id }),
               ...(orderId && { orderId: orderId }),
               ...(userId && { userId }),
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

   async removeTransactionById(id: string) {
      try {
         return await this.prismaService.transaction.delete({ where: { id } });
      }
      catch (error) {
         console.log(error);
         if (error instanceof HttpException) { throw error }
         throw new HttpException({ message: 'error in removing order', data: {} }, 500)
      }
   }

   async update(id: string, body: UpdateTransactionDTO) {
      try {
         return await this.prismaService.transaction.update({
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
}