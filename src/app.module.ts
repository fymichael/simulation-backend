import { DemandeClientController } from './auth/controller/client/demandeClient.controller';
import { DemandeClientService } from './auth/service/client/demandeClient.service';
import { StatistiqueController } from './auth/controller/statistique/statistique.controller';
import { StatistiqueService } from './auth/service/statistique/statistique.service';
import { EncaissementService } from './auth/service/contrat/encaissement.service';
import { SinistreController } from './auth/controller/sinistre/sinistre.controller';
import { TypeAccidentService } from './auth/service/sinistre/typeAccident.service';
import { SinistreService } from './auth/service/sinistre/sinistre.service';
import { CsvController } from './auth/controller/csv/csv.controller';
import { CsvService } from './auth/service/csv/csv.service';
import { ProcedurePaiementService } from './auth/service/contrat/procedurePaiement.service';
import { GarantieService } from './auth/service/contrat/garantie.service';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/modules/auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoleService } from './auth/service/auth/role.service';
import { DepartementService } from './auth/service/auth/departement.service';
import { UserService } from './auth/service/auth/user.service';
import { DatabaseService } from './auth/service/database.service';
import { AuthController } from './auth/controller/auth/auth.controller';
import { DepartementController } from './auth/controller/user/departement.controller';
import { UtilisateurController } from './auth/controller/user/utilisateur.controller';
import { ClientController } from './auth/controller/client/client.controller';
import { GenreController } from './auth/controller/user/genre.controller';
import { ClientService } from './auth/service/client/client.service';
import { GenreService } from './auth/service/client/genre.service';
import { ContratController } from './auth/controller/contrats/contrat.controller';
import { ContratService } from './auth/service/contrat/contrat.service';
import { ExonerationService } from './auth/service/contrat/exoneration.service';
import { ClassificationService } from './auth/service/contrat/classification.service';
import { VehiculeService } from './auth/service/vehicule/vehicule.service';
import { MarqueService } from './auth/service/vehicule/marque.service';
import { CarrosserieService } from './auth/service/vehicule/carrosserie.service';
import { EnergieService } from './auth/service/vehicule/energie.service';
import { VehiculeController } from './auth/controller/contrats/vehicule.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    AuthModule,
    ScheduleModule.forRoot()
  ],
  controllers: [
    DemandeClientController,
    StatistiqueController,
    SinistreController,
    CsvController, AppController, VehiculeController, AuthController, DepartementController, UtilisateurController, ClientController, GenreController, ContratController],
  providers: [
    DemandeClientService,
    StatistiqueService,
    EncaissementService,
    TypeAccidentService,
    SinistreService,
    CsvService,
    ProcedurePaiementService,
    GarantieService,
    RoleService,
    DepartementService,
    UserService,
    ClientService,
    GenreService,
    DatabaseService,
    ContratService,
    ExonerationService,
    ClassificationService,
    VehiculeService,
    MarqueService,
    CarrosserieService,
    EnergieService,
    AppService,
  ],
})
export class AppModule { }
