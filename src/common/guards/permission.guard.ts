import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleService } from 'src/mall-service/mall-service-system/role/role.service';
import { UsersRoleService } from 'src/mall-service/mall-service-system/users-role/users-role.service';
import { PERMISSION_KEY } from '../decorators/metadata/permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(RoleService)
  private roleService: RoleService;

  @Inject(UsersRoleService)
  private usersRoleService: UsersRoleService;

  @Inject(Reflector)
  private reflector: Reflector;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      return true;
    }

    const roleIdsResult = await this.usersRoleService.findRolesIdByUserId(
      request.user.user_id,
    );

    const roleResult = await this.roleService.findRolesByRoleIds(
      roleIdsResult.data,
    );

    const roleNames = roleResult.data?.map((role) => role.name);

    console.log('roleNames--->', roleNames);

    const requiredRoles = this.reflector.getAllAndOverride(PERMISSION_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);
    console.log('requiredRoles--->', requiredRoles);

    const isPermit = requiredRoles?.some((role) => roleNames?.includes(role));
    if (isPermit || requiredRoles == undefined) {
      return true;
    } else {
      throw new HttpException(
        "You don't have role permission",
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
