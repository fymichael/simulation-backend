import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from '../modules/auth/constant';

interface DecodedToken extends jwt.JwtPayload {
  role: number;
  username: string;
  firstname: string;
  departement: string;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<string>('role', context.getHandler());
    if (!requiredRole) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Token manquant');
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, jwtConstants.secret) as DecodedToken;
      const userRole = decoded.role;
      console.log(userRole); 
      return userRole === Number(requiredRole);
    } catch (error) {
      throw new UnauthorizedException('Token invalide');
    }
  }
}
