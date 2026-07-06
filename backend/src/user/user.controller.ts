import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "src/auth/guard/jwt.guard";
import type { Request } from "express";
import { CurrentUser, } from "src/auth/strategy/jwt.strategy";
import { RolesGuard } from "src/auth/guard/roles.guard";
import { Roles } from "src/auth/decoratior/roles.decorator";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { ResetPasswordDTO } from "./dto/reset-password.dto";
import { Role } from "src/common/enums/role.enum";

@Controller('user')
export class UserController {

   constructor(private readonly userService: UserService) { };

   @Get('all')
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles(Role.ADMIN)
   async getAllProducts(@Query('id') id?: string) {
      return await this.userService.getAllUsers(id);
   }

   @Post('remove/:id')
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles(Role.ADMIN)
   async removeProduct(@Param('id') id: string,) {
      return await this.userService.removeUser(id,);
   }

   @Post('update/:id')
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles(Role.ADMIN)
   async updateProduct(@Param('id') id: string, @Body() body: UpdateUserDTO) {
      return await this.userService.updateUser({ where: { id: id }, data: body });
   }

   @Get('me')
   @UseGuards(JwtAuthGuard)
   async me(@Req() req: Request) {
      return await this.userService.findUserWithoutPassword(
         { id: (req.user as CurrentUser).id },
         { include: { tokens: { orderBy: { createdAt: "desc", }, }, }, },
      );
   }

   @Post('reset-password')
   @UseGuards(JwtAuthGuard)
   async resetPassword(@Req() request: Request, @Body() body: ResetPasswordDTO) {
      return await this.userService.resetPassword(body, request.user as CurrentUser);
   }


   @Get('get-z-data')
   @UseGuards(JwtAuthGuard)
   async getZData(@Req() request: Request) {
      return await this.userService.getZData(request.user as CurrentUser)
   }
}