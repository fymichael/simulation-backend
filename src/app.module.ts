import { Module } from '@nestjs/common';
import { AuthModule } from './auth/modules/auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoleService } from './auth/service/role.service';
import { DepartementService } from './auth/service/departement.service';
import { UserService } from './auth/service/user.service';
import { DatabaseService } from './auth/service/database.service';
import { AuthController } from './auth/controller/auth.controller';
import { DepartementController } from './auth/controller/departement.controller';
import { UtilisateurController } from './auth/controller/utilisateur.controller';

@Module({
  imports: [
    AuthModule,
  ],
  controllers: [AppController, AuthController, DepartementController, UtilisateurController],
  providers: [
    RoleService,
    DepartementService,
    UserService,
    DatabaseService,
    AppService,
  ],
})
export class AppModule {}
