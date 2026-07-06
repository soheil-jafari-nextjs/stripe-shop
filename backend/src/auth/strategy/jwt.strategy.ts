import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Role } from "src/common/enums/role.enum";
import { PrismaService } from "src/prisma/prisma.service";

export interface JwtPayload {
   sub: string;
   iat?: number;
   exp?: number;
}

export interface CurrentUser {
   id: string;
   phone: string;
   role: Role;
}


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
   constructor(config: ConfigService, private readonly prisma: PrismaService,) {
      super({
         jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => req.cookies?.actoken]),
         ignoreExpiration: false,
         secretOrKey: config.getOrThrow("JWT_ACCESS_SECRET"),
      });
   }

   async validate(payload: JwtPayload) {
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub, }, });
      return user;
   }
}
