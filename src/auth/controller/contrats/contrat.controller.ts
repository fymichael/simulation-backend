import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from "@nestjs/common";
import { Role } from "../../annotations/Role.decorator";
import { RolesGuard } from "../../annotations/RolesGuard";
import { ContratService } from "src/auth/service/contrat/contrat.service";
import { GarantieService } from "src/auth/service/contrat/garantie.service";
import { ExonerationService } from "src/auth/service/contrat/exoneration.service";
import { ClassificationService } from "src/auth/service/contrat/classification.service";
import { EncaissementService } from "src/auth/service/contrat/encaissement.service";

@Controller()
@UseGuards(RolesGuard)
@Role('2')
export class ContratController {
  constructor(private encaissementService: EncaissementService, private contratService: ContratService, private garantieService: GarantieService, private exonerationService: ExonerationService, private classificationService: ClassificationService) { }

  @Post('comparaison')
  async getComparaisonResult(@Body() comparaisonDto: Record<string, any>) {
    const arrieres = await this.contratService.getArrieres(comparaisonDto.date_debut, comparaisonDto.date_fin)
    const encaissements = await this.contratService.getEncaissements(comparaisonDto.date_debut, comparaisonDto.date_fin)
    const newContrat = await this.contratService.getNewContrat(comparaisonDto.date_debut, comparaisonDto.date_fin)
    return {
      arrieres: arrieres,
      encaissements: encaissements,
      newContrat: newContrat
    };
  }

  @Get('encaissement/:id_contrat')
  getContratEncaissements(@Param('id_contrat') id_contrat: number) {
    return this.encaissementService.getContratEncaissement(id_contrat);
  }

  @Get('attestation-actif/:id_contrat')
  getActifAttestation(@Param('id_contrat') id_contrat: number) {
    return this.contratService.getAttestationActifContrat(id_contrat);
  }

  @HttpCode(HttpStatus.OK)
  @Post('avenant-contrat')
  newContratAvenant(@Body() avenantDto: Record<string, any>) {
    return this.contratService.addNewContratAvenant(avenantDto.id_contrat, avenantDto.id_avenant);
  } 

  @HttpCode(HttpStatus.OK)
  @Get('avenants/:id_contrat')
  allContratAvenants(@Param('id_contrat') id_contrat: number) {
    return this.contratService.getAvenantsContrat(id_contrat);
  }

  @HttpCode(HttpStatus.OK)
  @Post('encaissement')
  newEncaissement(@Body() encaissementDto: Record<string, any>) {
    return this.encaissementService.newEncaissement(encaissementDto.id_procedure_paiement, encaissementDto.date_encaissement, encaissementDto.montant, encaissementDto.numero_piece);
  }

  @HttpCode(HttpStatus.OK)
  @Put('annuler-avenant/:id_avenant_contrat')
  annulerAvenant(@Param('id_avenant_contrat') id_avenant_contrat: number) {
    return this.contratService.annullerAvenant(id_avenant_contrat);
  }

  @HttpCode(HttpStatus.OK)
  @Put('annuler-encaissement/:id_encaissement')
  annulerEncaissement(@Param('id_encaissement') id_encaissement: number) {
    return this.encaissementService.annulerEncaissement(id_encaissement);
  }

  @HttpCode(HttpStatus.OK)
  @Get('procedures/:id_contrat')
  allProceduresPaiements(@Param('id_contrat') id_contrat: number) {
    return this.contratService.allProcedurePaiementByIdContrat(id_contrat);
  }

  @HttpCode(HttpStatus.OK)
  @Get('type_paiements')
  allTypePaiements() {
    return this.contratService.allTypePaiement();
  }

  @HttpCode(HttpStatus.OK)
  @Get('garanties')
  allGaranties() {
    return this.garantieService.getAllGaranties();
  }

  @HttpCode(HttpStatus.OK)
  @Get('exonerations')
  allExoneration() {
    return this.exonerationService.getAllExonerations();
  }

  @HttpCode(HttpStatus.OK)
  @Get('classifications')
  allClassifications() {
    return this.classificationService.getAllClassifications();
  }

  @HttpCode(HttpStatus.OK)
  @Delete('contrat-simulation')
  contratsSimulation() {
    return this.contratService.removeSimulationData();
  }

  @HttpCode(HttpStatus.OK)
  @Get('contrats')
  allContrats() {
    return this.contratService.getAllContrats();
  }

  @HttpCode(HttpStatus.OK)
  @Get('contrat/:idContrat')
  contratById(@Param('idContrat') idContrat: number) {
    return this.contratService.getContratById(idContrat);
  }

  @HttpCode(HttpStatus.OK)
  @Get('contrat-filter/:numero_police')
  contratByPoliceNumber(@Param('numero_police') numero_police: string) {
    return this.contratService.getContratByPoliceNumber(numero_police);
  }

  @HttpCode(HttpStatus.OK)
  @Post('contrat-filter-agence')
  contratByPNAgence(@Body() contratDto: Record<string, any>) {
    return this.contratService.getContratByPoliceNumberAgence(contratDto.id_departement, contratDto.numero_police);
  }

  @HttpCode(HttpStatus.OK)
  @Get('contrat-departement/:idDepartement')
  contratByIdDepartement(@Param('idDepartement') idDepartement: number) {
    return this.contratService.getDepartementContrats(idDepartement);
  }

  @HttpCode(HttpStatus.OK)
  @Get('client-contrat/:idClient')
  contratClient(@Param('idClient') idClient: number) {
    return this.contratService.getClientContrat(idClient);
  }

  @HttpCode(HttpStatus.OK)
  @Get('contrat-facturation/:idContrat')
  async contrat_facturation(@Param('idContrat') idContrat: number) {
    const resultat = await this.contratService.getTaxesContrat(idContrat);

    return {
      montant_garanties: resultat.get('montant_garanties'),
      montant_exoneration: resultat.get('montant_exoneration'),
      tacava: resultat.get('tacava'),
      te: resultat.get('te'),
      tva: resultat.get('tva'),
      imp: resultat.get('imp'),
      accessoires: resultat.get('accessoires'),

    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('simulation')
  async simulation(@Body() contratDto: Record<string, any>) {
    const resultat = await this.contratService.newContratSimulation(contratDto.puissance, contratDto.id_energie, contratDto.valeur_nette, contratDto.duree, contratDto.id_classification, contratDto.reduction, contratDto.id_exoneration, contratDto.garanties);

    return {
      montant_garanties: resultat.get('montant_garanties'),
      montant_total: resultat.get('montant_total'),
      montant_exoneration: resultat.get('montant_exoneration'),
      tacava: resultat.get('tacava'),
      te: resultat.get('te'),
      tva: resultat.get('tva'),
      imp: resultat.get('imp'),
      accessoires: resultat.get('accessoires'),

    };
  }

  @HttpCode(HttpStatus.OK)
  @Put('update-echus')
  updateContratEchus() {
    return this.contratService.updateContratEchus();
  }

  @HttpCode(HttpStatus.OK)
  @Put('resilier-contrat/:idContrat')
  resilier(@Param('idContrat') idContrat: number) {
    return this.contratService.resilierContrat(idContrat);
  }

  @HttpCode(HttpStatus.OK)
  @Post('renouvellement-contrat/:idContrat')
  renouvellement(@Body() contratDto: Record<string, any>, @Param('idContrat') idContrat: number) {
    return this.contratService.renouvellerContrat(idContrat, contratDto.date_debut, contratDto.duree, contratDto.reduction, contratDto.id_exoneration, contratDto.garanties, contratDto.procedures, contratDto.numero_attestation, contratDto.numero_contrat);
  }

  @HttpCode(HttpStatus.OK)
  @Post('contrat')
  newContrat(@Body() contratDto: Record<string, any>) {
    return this.contratService.newContrat(contratDto.id_client, contratDto.id_vehicule, contratDto.date_debut, contratDto.duree, contratDto.id_classification, contratDto.reduction, contratDto.id_exoneration, contratDto.id_utilisateur, contratDto.garanties, contratDto.procedures, contratDto.id_type_paiement, contratDto.code_apporteur, contratDto.numero_attestation, contratDto.numero_contrat);
  }
}