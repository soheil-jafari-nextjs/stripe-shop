import { PaymentGateway, TransactionStatus } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateTransactionDTO {

   @IsNumber({}, { message: 'amount must be a number' })
   amount!: number

   @IsNotEmpty({ message: 'gatewayRedirectId should not be empty' })
   @IsString({ message: 'gatewayRedirectId must be a string' })
   gatewayRedirectId!: string

   @IsEnum(PaymentGateway, { message: 'paymentGateway is wrong' })
   paymentGateway!: PaymentGateway

   @IsEnum(TransactionStatus, { message: 'status is wrong' })
   status!: TransactionStatus

   @IsNotEmpty({ message: 'orderId should not be empty' })
   @IsString({ message: 'orderId must be a string' })
   orderId!: string

   @IsNotEmpty({ message: 'userId should not be empty' })
   @IsString({ message: 'userId must be a string' })
   userId!: string
}