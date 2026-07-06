import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { AddToCartDTO } from "./dto/add-to-cart.dto";
import { CartService } from "./cart.service";
import { JwtAuthGuard } from "src/auth/guard/jwt.guard";
import type { Request } from "express";
import { CurrentUser } from "src/auth/strategy/jwt.strategy";
import { Roles } from "src/auth/decoratior/roles.decorator";
import { Role } from "src/common/enums/role.enum";
import { RolesGuard } from "src/auth/guard/roles.guard";

@Controller('cart')
export class CartController {

   constructor(private readonly cartService: CartService) { }

   @Post('add')
   @UseGuards(JwtAuthGuard)
   async addToCart(@Body() body: AddToCartDTO, @Req() request: Request) {
      return await this.cartService.addToCart(body, request.user as CurrentUser);
   }


   @Get('get')
   @UseGuards(JwtAuthGuard)
   async findCart(@Req() request: Request) {
      return await this.cartService.getSyncedCart((request.user as CurrentUser).id)
   }


   @Get('all')
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles(Role.ADMIN)
   async getAllCarts(@Query('id') id?: string, @Query('userId') userId?: string) {
      return await this.cartService.getAllCarts(id, userId);
   }


   @Post('remove/:id')
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles(Role.ADMIN)
   async removeProduct(@Param('id') id: string,) {
      return await this.cartService.removeCart(id,);
   }
}