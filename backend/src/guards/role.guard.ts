import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/decorators';

interface RoleMetaDataItemsShape {
  role: string;
  context: string;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndMerge<
      RoleMetaDataItemsShape[]
    >('roles', [context.getHandler(), context.getClass()]);
    const { user } = context.switchToHttp().getRequest()


    if (!requiredRoles||requiredRoles.length===0||user.roleInfo?.role==='SUPER_ADMIN') {
      return true;
    }   
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    
    return requiredRoles.some(
      (role) =>
        user.roleInfo?.role === role.role &&
        user.roleInfo?.context === role.context,
    );
  }
}
