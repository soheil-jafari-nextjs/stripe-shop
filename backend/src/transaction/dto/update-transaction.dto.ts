import { TransactionStatus } from "@prisma/client";
import { IsEnum } from "class-validator";

export class UpdateTransactionDTO {
   @IsEnum(TransactionStatus, { message: "status is invalid", })
   status!: TransactionStatus
}