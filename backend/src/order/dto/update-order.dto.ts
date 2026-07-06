import { orderStatus } from "@prisma/client";
import { IsEnum } from "class-validator";

export class UpdateOrderDTO {
   @IsEnum(orderStatus, { message: "status is invalid", })
   status!: orderStatus
}