import { ShipStatus } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateShipDTO {
   @IsEnum(ShipStatus, { message: "status is invalid", })
   status!: ShipStatus

   @IsString({ message: 'trackingCode should be string' })
   @IsOptional()
   trackingCode!: string
}