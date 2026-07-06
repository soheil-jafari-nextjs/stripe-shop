import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { OrderService } from "./order.service";
import { JwtAuthGuard } from "src/auth/guard/jwt.guard";
import type { Request } from "express";
import { CurrentUser } from "src/auth/strategy/jwt.strategy";
import { RolesGuard } from "src/auth/guard/roles.guard";
import { UpdateOrderDTO } from "./dto/update-order.dto";

@Controller('order')
export class OrderController {
   constructor(private readonly orderService: OrderService) { }

   @Post('new')
   @UseGuards(JwtAuthGuard)
   async createOrder(@Req() request: Request) {
      return await this.orderService.createOrder((request.user as CurrentUser).id)
   }

   @Get('all')
   @UseGuards(JwtAuthGuard, RolesGuard)
   async getAllOrders(@Query('id') id?: string, @Query('userId') userId?: string) {
      return await this.orderService.getAllOrders(id, userId);
   }


   @Post('remove/:id')
   @UseGuards(JwtAuthGuard, RolesGuard)
   async removeOrderById(@Param('id') id: string) {
      return await this.orderService.removeOrderById(id);
   }

   @Post('update/:id')
   @UseGuards(JwtAuthGuard, RolesGuard)
   async update(@Param('id') id: string, @Body() body: UpdateOrderDTO) {
      return await this.orderService.update(id, body)
   }

   @Get('me/all')
   @UseGuards(JwtAuthGuard,)
   async getMyAllOrders(@Req() request: Request, @Query('id') id?: string,) {
      return await this.orderService.getMyAllOrders({ userId: (request.user as CurrentUser).id, id: id, });
   }
}