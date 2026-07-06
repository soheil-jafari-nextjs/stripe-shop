import { IsOptional, IsString } from "class-validator";

export class GetMyOrdersDTO {

   @IsString({ message: 'userId must be string' })
   userId!: string

   @IsOptional()
   @IsString({ message: 'id must be string' })
   id?: string
}