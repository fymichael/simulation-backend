import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from "@nestjs/common";
import { Role } from "../../annotations/Role.decorator";
import { RolesGuard } from "../../annotations/RolesGuard";
import { VehiculeService } from "src/auth/service/vehicule/vehicule.service";
import { EnergieService } from "src/auth/service/vehicule/energie.service";
import { CarrosserieService } from "src/auth/service/vehicule/carrosserie.service";
import { MarqueService } from "src/auth/service/vehicule/marque.service";

@Controller()
@UseGuards(RolesGuard)
@Role('2')
export class VehiculeController {
  constructor(private VehiculeService: VehiculeService, private EnergieService: EnergieService, private CarrosserieService: CarrosserieService, private marqueService: MarqueService) { }

  @HttpCode(HttpStatus.OK)
  @Get('vehicules')
  allContrats() {
    return this.VehiculeService.getAllVehicule();
  }

  @HttpCode(HttpStatus.OK)
  @Get('last-vehicules')
  lastContrats() {
    return this.VehiculeService.getLastVehicule();
  }

  @HttpCode(HttpStatus.OK)
  @Get('energies')
  allEnergies() {
    return this.EnergieService.getAllEnergies();
  }

  @HttpCode(HttpStatus.OK)
  @Get('carrosseries')
  allCarrosseries() {
    return this.CarrosserieService.getAllCarrosseries();
  }

  @HttpCode(HttpStatus.OK)
  @Get('marques')
  allMarques() {
    return this.marqueService.getAllMarques();
  }

  @HttpCode(HttpStatus.OK)
  @Get('vehicule/:idVehicule')
  vehiculeById(@Param('idVehicule') idVehicule: number) {
    return this.VehiculeService.getVehiculeById(idVehicule);
  }

  @HttpCode(HttpStatus.OK)
  @Post('vehicule')
  newVehicule(@Body() vehiculeDto: Record<string, any>) {
    return this.VehiculeService.newVehicule(vehiculeDto.id_marque, vehiculeDto.model, vehiculeDto.id_carrosserie, vehiculeDto.numero_chassit, vehiculeDto.puissance, vehiculeDto.numero_moteur, vehiculeDto.nombre_place, vehiculeDto.id_energie, vehiculeDto.plaque_immatriculation, vehiculeDto.date_circulation, vehiculeDto.valeur_nette);
  }
}