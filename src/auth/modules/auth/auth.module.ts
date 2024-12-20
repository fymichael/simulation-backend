import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '../../controller/auth.controller';
import { AuthService } from '../../service/auth.service';
import { UserService } from '../../service/user.service';
import { jwtConstants } from './constant';
import { DatabaseService } from 'src/auth/service/database.service';
import { RoleService } from 'src/auth/service/role.service';
import { DepartementService } from 'src/auth/service/departement.service';

@Module({
  imports: [
    JwtModule.register({
      global: true, 
      secret: jwtConstants.secret,  
      signOptions: { expiresIn: '60s' }, 
    }),
  ],
  providers: [AuthService, UserService, DatabaseService, RoleService, DepartementService], 
  controllers: [AuthController],
  exports: [AuthService],  
})
export class AuthModule {}
