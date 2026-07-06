import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { CreateProductDTO } from "./dto/create-product.dto";
import { ProductService } from "./product.service";
import { UpdateProductDTO } from "./dto/update-product.dto";
import { JwtAuthGuard } from "src/auth/guard/jwt.guard";
import { RolesGuard } from "src/auth/guard/roles.guard";
import { Roles } from "src/auth/decoratior/roles.decorator";
import { Role } from "src/common/enums/role.enum";
import { ProductsIdsDTO } from "./dto/products-ids";

@Controller('product')
export class ProductController {

   constructor(private readonly productService: ProductService) { }

   @Post('new')
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles(Role.ADMIN)
   async createProduct(@Body() body: CreateProductDTO) {
      return await this.productService.createProduct(body);
   }

   @Get('all')
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles(Role.ADMIN)
   async getAllProducts(@Query('id') id?: string) {
      return await this.productService.getAllProducts(id);
   }


   @Get('details/:id',)
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles(Role.ADMIN)
   async getProductDetails(@Param('id') id: string) {
      return await this.productService.getProductDetails({ id: id });
   }

   @Post('update/:id')
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles(Role.ADMIN)
   async updateProduct(@Param('id') id: string, @Body() body: UpdateProductDTO) {
      return await this.productService.updateProduct(id, body);
   }

   @Post('remove/:id')
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles(Role.ADMIN)
   async removeProduct(@Param('id') id: string,) {
      return await this.productService.removeProduct(id,);
   }


   @Get('main-page-all')
   async getMainPageAllProducts() {
      return await this.productService.getAllProducts();
   }


   @Get('details-by-slug/:slug',)
   async getProductDetailsBySlug(@Param('slug') slug: string) {
      return await this.productService.getProductDetails({ slug: slug });
   }

   // for cart page
   @Post('get-products-by-ids')
   async getProductsByIds(@Body() body: ProductsIdsDTO) {
      return await this.productService.getProductsByIds(body);
   }
}