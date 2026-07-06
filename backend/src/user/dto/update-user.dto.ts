
import { IsEnum, } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class UpdateUserDTO {
   @IsEnum(Role, { message: 'role must be ADMIN or USER', })
   role!: Role;
}