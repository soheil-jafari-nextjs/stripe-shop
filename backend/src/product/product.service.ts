import { HttpException, Injectable } from "@nestjs/common";
import { CreateProductDTO } from "./dto/create-product.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateProductDTO } from "./dto/update-product.dto";
import { ProductsIdsDTO } from "./dto/products-ids";
import { Prisma } from "@prisma/client";

@Injectable()
export class ProductService {

   constructor(private readonly prismaService: PrismaService) { }

   async createProduct(body: CreateProductDTO) {
      try {
         return await this.prismaService.product.create({ data: body })
      }
      catch (error) {
         console.log(error);
         throw new HttpException({ message: "error in product creation.", data: {}, }, 400,);
      }
   }

   async getAllProducts(id?: string) {
      try {
         return await this.prismaService.product.findMany({ where: id ? { id } : {}, orderBy: { createdAt: 'desc', }, });
      }
      catch (error) {
         console.log(error);
         throw new HttpException({ message: "error in finding product.", data: {}, }, 400,);
      }
   }

   async getProductDetails(query: Record<string, string>) {
      try {
         return await this.prismaService.product.findFirst({ where: query, });
      }
      catch (error) {
         console.log(error);
         throw new HttpException({ message: "error in finding product.", data: {}, }, 400,);
      }
   }

   async updateProduct(id: string, body: UpdateProductDTO) {
      try {
         return await this.prismaService.product.update({
            where: { id: id },
            data: body
         })
      }
      catch (error) {
         console.log(error);
         throw new HttpException({ message: "error in product updating.", data: {}, }, 400,);
      }
   }

   async removeProduct(id: string,) {
      try {
         return await this.prismaService.product.delete({
            where: { id: id },
         })
      }
      catch (error) {
         console.log(error);
         throw new HttpException({ message: "error in product remove.", data: {}, }, 400,);
      }
   }

   async getMainPageAllProducts() {
      try {
         return await this.prismaService.product.findMany({ orderBy: { createdAt: 'desc', }, });
      }
      catch (error) {
         console.log(error);
         throw new HttpException({ message: "error in finding product.", data: {}, }, 400,);
      }
   }

   async getProductsByIds(body: ProductsIdsDTO) {
      try {
         const ids = JSON.parse(body.ids);
         return await this.prismaService.product.findMany({ where: { id: { in: ids } }, orderBy: { createdAt: 'desc', }, });
      }
      catch (error) {
         console.log(error);
         throw new HttpException({ message: "error in finding product.", data: {}, }, 400,);
      }
   }

   async decreaseQuantity(productId: string, quantity: number) {
      return this.prismaService.product.update({
         where: { id: productId },
         data: { quantity: { decrement: quantity, }, },
      });
   }
}
