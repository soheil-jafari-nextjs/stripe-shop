import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { JwtAuthGuard } from "src/auth/guard/jwt.guard";
import { RolesGuard } from "src/auth/guard/roles.guard";
import { UpdateTransactionDTO } from "./dto/update-transaction.dto";

@Controller('transaction')
export class TransactionController {
   constructor(private readonly transactionService: TransactionService) { }

   @Get('all')
   @UseGuards(JwtAuthGuard, RolesGuard)
   async getAllShips(@Query('id') id?: string, @Query('orderId') orderId?: string, @Query('userId') userId?: string) {
      return await this.transactionService.getAllTransactions(id, orderId, userId);
   }


   @Post('remove/:id')
   @UseGuards(JwtAuthGuard, RolesGuard)
   async removeOrderById(@Param('id') id: string) {
      return await this.transactionService.removeTransactionById(id);
   }

   @Post('update/:id')
   @UseGuards(JwtAuthGuard, RolesGuard)
   async update(@Param('id') id: string, @Body() body: UpdateTransactionDTO) {
      return await this.transactionService.update(id, body)
   }
}