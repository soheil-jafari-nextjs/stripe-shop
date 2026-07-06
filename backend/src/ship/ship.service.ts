import { HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateShipDTO } from "./dto/create-ship.dto";
import { UpdateShipDTO } from "./dto/update-ship.dto";

@Injectable()
export class ShipService {
   constructor(private readonly prismaService: PrismaService) { }

   async createShip(body: CreateShipDTO) {
      return await this.prismaService.ship.create({
         data: {
            orderId: body.orderId,
            status: 'PENDING'
         }
      })
   }

   async getAllShips(id?: string, orderId?: string,) {
      try {
         return await this.prismaService.ship.findMany({
            where: {
               ...(id && { id: id }),
               ...(orderId && { orderId: orderId }),
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

   async removeShipById(id: string) {
      try {
         return await this.prismaService.ship.delete({ where: { id } });
      }
      catch (error) {
         console.log(error);
         if (error instanceof HttpException) { throw error }
         throw new HttpException({ message: 'error in removing order', data: {} }, 500)
      }
   }

   async update(id: string, body: UpdateShipDTO) {
      try {
         return await this.prismaService.ship.update({
            where: { id },
            data: { status: body.status, trackingCode: body.trackingCode }
         },);
      }
      catch (error) {
         console.log(error);
         if (error instanceof HttpException) { throw error }
         throw new HttpException({ message: 'error in removing order', data: {} }, 500)
      }
   }
}