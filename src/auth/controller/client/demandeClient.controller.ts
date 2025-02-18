/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { DemandeClientService } from 'src/auth/service/client/demandeClient.service';

@Controller()
export class DemandeClientController {
    constructor(private demandeClientService: DemandeClientService) { }

    @HttpCode(HttpStatus.OK)
    @Put('validate-demande/:id_demande')
    validate(@Param ('id_demande') id_demande: number) {
        return this.demandeClientService.validateDemande(id_demande);
    }

    @HttpCode(HttpStatus.OK)
    @Put('invalidate-demande/:id_demande')
    denied(@Param ('id_demande') id_demande: number) {
        return this.demandeClientService.deniedDemande(id_demande);
    }

    @HttpCode(HttpStatus.OK)
    @Post('demande')
    newDemande(@Body() demandeDto: Record<string, any>) {
        return this.demandeClientService.addNewDemande(demandeDto.titre, demandeDto.objet, demandeDto.id_contrat, demandeDto.is_renouvellement, demandeDto.status);
    }

    @HttpCode(HttpStatus.OK)
    @Get('demandes/:prefixe_agence')
    allDemandes(@Param ('prefixe_agence') prefixe_agence: string) {
        return this.demandeClientService.allDemandesAgences(prefixe_agence);
    }

    @HttpCode(HttpStatus.OK)
    @Get('demandes')
    allDemandesAdmin() {
        return this.demandeClientService.allDemandes();
    }

    @HttpCode(HttpStatus.OK)
    @Get('demandes-notif-admin')
    allDemandesNotificationsAdmin() {
        return this.demandeClientService.allDemandesAgencesNotificationsAdmin();
    }

    @HttpCode(HttpStatus.OK)
    @Get('demandes-notif/:prefixe_agence')
    allDemandesNotifications(@Param ('prefixe_agence') prefixe_agence: string) {
        return this.demandeClientService.allDemandesAgencesNotifications(prefixe_agence);
    }

    @HttpCode(HttpStatus.OK)
    @Get('demande/:idDemande')
    getDemandeById(@Param('idDemande') idDemande: number) {
        return this.demandeClientService.getDemandesById(idDemande);
    }

    @HttpCode(HttpStatus.OK)
    @Get('demande-client/:idDemande')
    getDemandeClient(@Param('idDemande') idDemande: number) {
        return this.demandeClientService.allClientDemandes(idDemande);
    }
 }
