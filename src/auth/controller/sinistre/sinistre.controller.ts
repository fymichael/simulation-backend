/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { SinistreService } from 'src/auth/service/sinistre/sinistre.service';
import { TypeAccidentService } from 'src/auth/service/sinistre/typeAccident.service';

@Controller()
export class SinistreController {

  constructor(private sinistreService: SinistreService, private typeAccidentService: TypeAccidentService) { }

  @HttpCode(HttpStatus.OK)
  @Get('sinistres')
  allSinistres() {
    return this.sinistreService.getAllSinistres();
  }

  @HttpCode(HttpStatus.OK)
  @Get('typeAccidents')
  allTypesAccident() {
    return this.typeAccidentService.getAllTypeAccidents();
  }

  @HttpCode(HttpStatus.OK)
  @Get('sinistre/:idSinistre')
  sinistreById(@Param('idSinistre') idSinistre: string) {
    return this.sinistreService.getSinistreById(idSinistre);
  }

  @HttpCode(HttpStatus.OK)
  @Get('sinistre-client/:idClient')
  sinistreByIdClient(@Param('idClient') idClient: string) {
    return this.sinistreService.getSinistreByIdClient(idClient);
  }

  @HttpCode(HttpStatus.OK)
  @Get('contrat-sinistre/:idContrat')
  sinistreByIdContrat(@Param('idContrat') idContrat: string) {
    return this.sinistreService.getSinistreByIdContrat(idContrat);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sinistre')
  newSinistre(@Body() contratDto: Record<string, any>) {
    return this.sinistreService.newSinistre(contratDto.id_contrat, contratDto.date_heure_incident, contratDto.lieu_incident, contratDto.description, contratDto.expert, contratDto.id_type_accident, contratDto.liens);
  }

  @HttpCode(HttpStatus.OK)
  @Put('validate-sinistre/:idSinistre')
  validateSinistre(@Param('idSinistre') idSinistre: string) {
    return this.sinistreService.validateSinistre(idSinistre);
  }

  @HttpCode(HttpStatus.OK)
  @Put('annuler-sinistre/:idSinistre')
  annulerSinistre(@Param('idSinistre') idSinistre: string) {
    return this.sinistreService.annulerSinistre(idSinistre);
  }
}

