
import { Body, Controller, Post, HttpCode, HttpStatus, Get, UseGuards, Param, Put, Delete } from '@nestjs/common';
import { ClientService } from '../../service/client/client.service';
import { Role } from '../../annotations/Role.decorator';
import { RolesGuard } from '../../annotations/RolesGuard';

@Controller()
@UseGuards(RolesGuard)
@Role('2')
export class ClientController {
  constructor(private clientService: ClientService) { }


  @HttpCode(HttpStatus.OK)
  @Put('changeClientPassword/:idClient')
  changeMdpClient(@Body() pass: Record<string, any>, @Param('idClient') idClient: number) {
    return this.clientService.changePassword(pass.password, idClient);
  }

  @HttpCode(HttpStatus.OK)
  @Get('client-profile/:idClient')
  async contrat_facturation(@Param('idClient') idClient: number) {
    const resultat = await this.clientService.getDataProfile(idClient);

    return {
      contratActifs: resultat.get('contratActif'),
      sinistreDeclarer: resultat.get('sinistreDeclarer'),
      coutContrat: resultat.get('coutContrat'),
      echeance: resultat.get('echeance'),
    };
  }

  @HttpCode(HttpStatus.OK)
  @Put('client/:idClient')
  update(@Param('idClient') idClient: number, @Body() clientDto: Record<string, any>) {
    return this.clientService.updateClient(idClient, clientDto.nom, clientDto.prenom, clientDto.date_naissance, clientDto.adresse, clientDto.contact, clientDto.email, clientDto.mdp, clientDto.cin, clientDto.id_genre);
  }

  @HttpCode(HttpStatus.OK)
  @Get('client/:idClient')
  clientById(@Param('idClient') idClient: number) {
    return this.clientService.getClientById(idClient);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('client/:idClient')
  remove(@Param('idClient') idClient: number) {
    return this.clientService.deleteClient(idClient);
  }

  @HttpCode(HttpStatus.OK)
  @Get('clients')
  allGenres() {
    return this.clientService.getAllClients();
  }

  @HttpCode(HttpStatus.OK)
  @Get('last-clients')
  lastCLient() {
    return this.clientService.getLastClient();
  }

  @HttpCode(HttpStatus.OK)
  @Post('client')
  newClient(@Body() clientDto: Record<string, any>) {
    return this.clientService.newClient(clientDto.nom, clientDto.prenom, clientDto.date_naissance, clientDto.adresse, clientDto.contact, clientDto.email, clientDto.mdp, clientDto.cin, clientDto.id_genre);
  }
}
