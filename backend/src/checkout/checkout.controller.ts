import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CheckoutService } from "./checkout.service";
import { JwtAuthGuard } from "src/auth/guard/jwt.guard";
import { NewCheckoutDTO } from "./dto/new-checkout.dto";

@Controller('checkout')
export class CheckoutController {
   constructor(private readonly checkoutService: CheckoutService) { }

   @Post('new')
   @UseGuards(JwtAuthGuard)
   async newCheckout(@Body() body: NewCheckoutDTO) {
      return await this.checkoutService.newCheckout(body)
   }

   @Post('webhook')
   async handleCheckoutWebhook(@Body() body: any) {
      return await this.checkoutService.handleCheckoutWebhook(body);
   }
}