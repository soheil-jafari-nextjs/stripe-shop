import { CanActivate, ExecutionContext, ForbiddenException, HttpException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decoratior/roles.decorator";
import { CurrentUser } from "../strategy/jwt.strategy";
import { Role } from "src/common/enums/role.enum";

@Injectable()
export class RolesGuard implements CanActivate {
   constructor(private reflector: Reflector) { }

   canActivate(context: ExecutionContext): boolean {
      const roles = this.reflector.getAllAndOverride<Role[]>(
         ROLES_KEY,
         [
            context.getHandler(),
            context.getClass(),
         ],
      );
      if (!roles) { return true; }

      const request = context.switchToHttp().getRequest();
      const user = request.user as CurrentUser;
      if (!roles.includes(user.role)) {
         throw new HttpException({ message: 'Permission denied.', data: {}, }, 403,);
      }

      return roles.includes(user.role);
   }
}