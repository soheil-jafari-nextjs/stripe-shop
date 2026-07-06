import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ShipService } from "./ship.service";
import { JwtAuthGuard } from "src/auth/guard/jwt.guard";
import { RolesGuard } from "src/auth/guard/roles.guard";
import { UpdateShipDTO } from "./dto/update-ship.dto";

@Controller('ship')
export class ShipController {
   constructor(private readonly shipService: ShipService) { }

   @Get('all')
   @UseGuards(JwtAuthGuard, RolesGuard)
   async getAllShips(@Query('id') id?: string, @Query('orderId') orderId?: string,) {
      return await this.shipService.getAllShips(id, orderId);
   }


   @Post('remove/:id')
   @UseGuards(JwtAuthGuard, RolesGuard)
   async removeOrderById(@Param('id') id: string) {
      return await this.shipService.removeShipById(id);
   }

   @Post('update/:id')
   @UseGuards(JwtAuthGuard, RolesGuard)
   async update(@Param('id') id: string, @Body() body: UpdateShipDTO) {
      return await this.shipService.update(id, body)
   }
}