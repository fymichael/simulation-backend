import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '../../controller/auth/auth.controller';
import { AuthService } from '../../service/auth/auth.service';
import { UserService } from '../../service/auth/user.service';
import { jwtConstants } from './constant';
import { DatabaseService } from 'src/auth/service/database.service';
import { RoleService } from 'src/auth/service/auth/role.service';
import { DepartementService } from 'src/auth/service/auth/departement.service';
import { GenreService } from 'src/auth/service/client/genre.service';
import { ClientService } from 'src/auth/service/client/client.service';

@Module({
  imports: [
    JwtModule.register({
      global: true, 
      secret: jwtConstants.secret,  
      signOptions: { expiresIn: '1h' }, 
    }),
  ],
  providers: [AuthService, UserService, DatabaseService, RoleService, DepartementService, ClientService, GenreService], 
  controllers: [AuthController],
  exports: [AuthService],  
})
export class AuthModule {}
