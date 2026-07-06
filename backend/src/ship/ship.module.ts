import { Module } from "@nestjs/common";
import { ShipService } from "./ship.service";
import { ShipController } from "./ship.controller";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
   imports: [PrismaModule,],
   controllers: [ShipController],
   providers: [ShipService],
   exports: [ShipService],
})
export class ShipModule { }