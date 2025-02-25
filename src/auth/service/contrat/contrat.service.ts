import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DatabaseService } from "../database.service";
import { Contrat } from "../../model/contrat/contrat.model";
import { ClassificationService } from "./classification.service";
import { ExonerationService } from "./exoneration.service";
import { ClientService } from "../client/client.service";
import { VehiculeService } from "../vehicule/vehicule.service";
import { UserService } from "../auth/user.service";
import { GarantieService } from "./garantie.service";
import { ProcedurePaiementService } from "./procedurePaiement.service";
import { Garantie } from "src/auth/model/contrat/garantie.model";
import { ProcedurePaiement } from "src/auth/model/contrat/procedurePaiement.model";
import { Comparaison } from "src/auth/model/comparaison.model";
import { TypePaiement } from "src/auth/model/contrat/typePaiement.model";
import { Cron } from "@nestjs/schedule";
import { Avenant } from "src/auth/model/contrat/avenant.model";
import { AvenantContrat } from "src/auth/model/contrat/avenantContrat.model";
import { Commission } from "src/auth/model/contrat/commission.model";

@Injectable()
export class ContratService {
    private Contrat: Contrat | null = null;

    constructor(
        private readonly databaseService: DatabaseService,
        private readonly classification: ClassificationService,
        private readonly exoneration: ExonerationService,
        private readonly client: ClientService,
        private readonly vehicule: VehiculeService,
        private readonly garanties: GarantieService,
        private readonly procedurePaiement: ProcedurePaiementService,
        private readonly user: UserService,
    ) { }

    getContrat() {
        return this.Contrat;
    }

    setContrat(Contrat: Contrat) {
        this.Contrat = Contrat;
    }


    @Cron('0 10 * * *') // tous les jours à 10 heures
    async updateContratEchus() {
        const query = `
        UPDATE contrat
        SET status = 1
        WHERE id_contrat IN (
            SELECT id_contrat
            FROM contrat
            WHERE date_echeance <= CURRENT_DATE + interval '7 days'
        );
      `;

        console.log('[CRON] Exécution de la mise à jour des contrats échus...');
        try {
            await this.databaseService.executeQuery(query);
            console.log('[CRON] Mise à jour terminée avec succès.');
        } catch (error) {
            console.error('[CRON] Erreur lors de la mise à jour des contrats échus :', error);
        }
    }


    async getEncaissements(date_debut: Date, date_fin: Date) {
        const query = `select c.numero_police, sum(e.montant) as montant
        from procedure_paiement pp
        left join encaissement e on pp.id_procedure_paiement = e.id_procedure_paiement
        left join contrat c on c.id_contrat = pp.id_contrat
        where (e.status != 0 or e.status is null) and e.date_encaissement > '${date_debut}' and e.date_encaissement <= '${date_fin}'
        group by c.numero_police`;
        console.log(query);
        const resultat = await this.databaseService.executeQuery(query);
        let encaissements = []
        for (let i = 0; i < resultat.length; i++) {
            encaissements.push(new Comparaison(resultat[i]?.numero_police, resultat[i]?.montant));
        }
        return encaissements;
    }

    async getArrieres(date_debut: Date, date_fin: Date) {
        const query = `select c.numero_police, coalesce((((pp.pourcentage * c.montant_total) / 100) - coalesce(sum(e.montant), 0))) as montant
        from procedure_paiement pp
        left join contrat c on c.id_contrat = pp.id_contrat
        left join encaissement e on e.id_procedure_paiement = pp.id_procedure_paiement
        where pp.status != 0 and pp.date_paiement > '${date_debut}' and pp.date_paiement <= '${date_fin}'
        group by c.numero_police, pp.pourcentage, c.montant_total`;
        console.log(query);
        const resultat = await this.databaseService.executeQuery(query);
        let arrieres = []
        for (let i = 0; i < resultat.length; i++) {
            arrieres.push(new Comparaison(resultat[i]?.numero_police, resultat[i]?.montant));
        }
        return arrieres;
    }

    async getAvenantById(idAvenant) {
        const query = 'select * from avenant where id_avenant = ' + idAvenant + ' and status != 0 ';
        const resultat = await this.databaseService.executeQuery(query);
        return new Avenant(resultat[0]?.id_avenant, resultat[0]?.nom, resultat[0]?.status);
    }

    async getAvenantsContrat(idContrat) {
        const query = `select a.id_avenant, av.id_avenant_contrat, av.date_creation, av.status
        from avenant_contrat av
        join avenant a on a.id_avenant = av.id_avenant
        where av.id_contrat = ${idContrat} and av.status != 0`;
        const resultat = await this.databaseService.executeQuery(query);
        let avenants = [];
        for (let i = 0; i < resultat.length; i++) {
            const avenant = await this.getAvenantById(resultat[i]?.id_avenant);
            avenants.push(new AvenantContrat(resultat[i]?.id_avenant_contrat, avenant, resultat[i]?.date_creation, resultat[i]?.status));
        }
        return avenants;
    }

    async addNewAttestation(idContrat, numeroAttestation, date_effets) {
        const query = `insert into attestation (id_contrat, numero_attestation, date_effet) values (${idContrat} ,'${numeroAttestation}', '${date_effets}')`;
        await this.databaseService.executeQuery(query);
    }

    async getNumeroAttestationContrat(id_contrat) {
        const query = "select numero_attestation from attestation where id_contrat = " + id_contrat;
        const resultat = await this.databaseService.executeQuery(query);
        let numeros = [];

        for (let i = 0; i < resultat.length; i++) {
            numeros.push(resultat[i]?.numero_attestation);
        }
        return numeros;
    }

    async addNewContratAvenant(idContrat, idAvenant) {
        const query = `insert into avenant_contrat (id_contrat, id_avenant) values (${idContrat}, ${idAvenant})`;
        console.log(query);
        await this.databaseService.executeQuery(query);
    }

    async annullerAvenant(id_avenant_contrat) {
        const query = `update avenant_contrat set status = 0 where id_avenant_contrat = ${id_avenant_contrat}`;
        console.log(query);
        await this.databaseService.executeQuery(query);
    }

    async getAttestationActifContrat(id_contrat) {
        const query = `select numero_attestation
        from attestation
        where id_contrat = ${id_contrat}
        order by date_effet desc limit 1`;
        const resultat = await this.databaseService.executeQuery(query);
        return resultat[0]?.numero_attestation;
    }

    async getNewContrat(date_debut: Date, date_fin: Date) {
        let newContratsArray = [];

        const query1 = `SELECT * FROM contrat WHERE date_debut <= '${date_debut}'`;
        const resultat1 = await this.databaseService.executeQuery(query1);

        const query2 = `SELECT * FROM contrat WHERE date_debut <= '${date_fin}'`;
        const resultat2 = await this.databaseService.executeQuery(query2);

        const newContrats = resultat2.filter(contrat2 =>
            !resultat1.some(contrat1 => contrat1.id_contrat === contrat2.id_contrat)
        );

        for (let i = 0; i < newContrats.length; i++) {
            try {
                const newContrat = newContrats[i];


                const user = await this.user.getUserById(newContrat.id_utilisateur);
                if (!user) continue;

                const vehicule = await this.vehicule.getVehiculeById(newContrat.id_vehicule);
                if (!vehicule) continue;

                const client = await this.client.getClientById(newContrat.id_client);
                if (!client) continue;

                const exoneration = await this.exoneration.getExonerationById(newContrat.id_exoneration);
                const Classification = await this.classification.getClassificationById(newContrat.id_classification);
                const garanties = await this.garanties.getContratGaranties(newContrat.id_contrat);
                const procedures = await this.procedurePaiement.getContratProcedurePaiement(newContrat.id_contrat)
                const renouvellements = await this.getRenouvellements(newContrat.id_contrat);
                const typePaiement = await this.getTypePaiementById(newContrat?.id_type_paiement);
                const avenants = await this.getAvenantsContrat(newContrat.id_contrat);
                const numeros = await this.getNumeroAttestationContrat(newContrat.id_contrat);


                const contrat = new Contrat(
                    newContrat.id_contrat,
                    newContrat.numero_police,
                    client,
                    vehicule,
                    newContrat.date_debut,
                    newContrat.duree,
                    newContrat.date_echeance,
                    Classification,
                    newContrat.reduction,
                    newContrat.montant_total,
                    newContrat.status,
                    exoneration,
                    user,
                    garanties,
                    procedures,
                    renouvellements,
                    typePaiement,
                    avenants,
                    newContrat.code_apporteur,
                    numeros,
                    newContrat.numero_contrat
                );
                newContratsArray.push(contrat);
            } catch (error) {
                console.error(`Erreur lors de la création du contrat pour l'ID ${newContrats[i]?.id_contrat}:`, error);
            }
        }
        return newContratsArray;
    }
    async allProcedurePaiementByIdContrat(idContrat: number): Promise<Array<ProcedurePaiement>> {
        const query = `select * from procedure_paiement where id_contrat = ${idContrat} and status = 1`;
        console.log(query);
        const resultat = await this.databaseService.executeQuery(query);
        let ProcedurePaiements = [];
        for (let i = 0; i < resultat.length; i++) {
            const pp = new ProcedurePaiement(resultat[i].id_procedure_paiement, resultat[i].date_paiement, resultat[i].pourcentage, resultat[i].status);
            ProcedurePaiements.push(pp);
        }
        return ProcedurePaiements;
    }

    async getTaxesContrat(idContrat: number): Promise<Map<string, number>> {
        const query = "select * from v_montant_contrat where id_contrat = " + idContrat;
        const resultat = await this.databaseService.executeQuery(query);

        const hashMap = new Map<string, number>();

        // Query pour avoir le prime_rc, montant_garanties, et montant total des exonérations
        const query2 = "select * from v_montant_total where id_contrat = " + idContrat;
        const resultat2 = await this.databaseService.executeQuery(query2);

        hashMap.set("tacava", resultat[0].tacava);
        hashMap.set("te", resultat[0].te);
        hashMap.set("tva", resultat[0].tva);
        hashMap.set("imp", resultat[0].imp);
        hashMap.set("montant_exoneration", resultat2[0].montant_exoneration);
        hashMap.set("montant_garanties", resultat2[0].montant_garanties);
        hashMap.set("accessoires", resultat2[0].accessoires);
        return hashMap;

    }

    async getAllContratsSimulation(): Promise<Array<Number>> {
        const query = 'SELECT * FROM contrat where id_client is null';
        let Contrats = [];
        const resultat = await this.databaseService.executeQuery(query);
        for (let i = 0; i < resultat.length; i++) {
            Contrats.push(resultat[i].id_contrat);
        }
        return Contrats;
    }

    async removeSimulationData() {
        const query1 = "delete from vehicule where plaque_immatriculation = '4215DE'";
        await this.databaseService.executeQuery(query1);
        const contratSimulation = await this.getAllContratsSimulation();
        for (let i = 0; i < contratSimulation.length; i++) {
            const queryGaranties = "delete from garantie_contrat where id_contrat = " + contratSimulation[i];
            await this.databaseService.executeQuery(queryGaranties);
            const queryPaiements = "delete from procedure_paiement where id_contrat = " + contratSimulation[i];
            await this.databaseService.executeQuery(queryPaiements);
            const queryContrat = "delete from contrat where id_contrat = " + contratSimulation[i];
            await this.databaseService.executeQuery(queryContrat);
        }
    }

    async getRenouvellements(idContrat: number): Promise<Array<Date>> {
        const query = 'SELECT * FROM renouvellement_contrat where id_contrat = ' + idContrat;
        let renouvellements = [];
        const resultat = await this.databaseService.executeQuery(query);
        for (let i = 0; i < resultat.length; i++) {
            renouvellements.push(resultat[i].date_renouvellement);
        }
        return renouvellements;
    }

    async getTypePaiementById(idTypePaiement: number) {
        const query = `select * from type_paiement where id_type_paiement = ${idTypePaiement}`;
        const resultats = await this.databaseService.executeQuery(query);
        return new TypePaiement(resultats[0]?.id_type_paiement, resultats[0]?.nom, resultats[0]?.status);
    }

    async getDepartementContrats(idDepartement: number): Promise<Array<Contrat>> {
        const query = `select c.*
        from contrat c
        left join utilisateur u
        on c.id_utilisateur = u.id_utilisateur
        where u.id_departement = ${idDepartement}`;
        console.log(query);

        let departementsContrat = [];
        const resultat = await this.databaseService.executeQuery(query);
        for (let i = 0; i < resultat.length; i++) {
            const user = await this.user.getUserById(resultat[i].id_utilisateur);
            const vehicule = await this.vehicule.getVehiculeById(resultat[i].id_vehicule);
            const client = await this.client.getClientById(resultat[i].id_client);
            const exoneration = await this.exoneration.getExonerationById(resultat[i].id_exoneration);
            const Classification = await this.classification.getClassificationById(resultat[i].id_classification);
            const garanties = await this.garanties.getContratGaranties(resultat[i].id_contrat);
            const procedures = await this.procedurePaiement.getContratProcedurePaiement(resultat[i].id_contrat)
            const renouvellements = await this.getRenouvellements(resultat[i].id_contrat);
            const typePaiement = await this.getTypePaiementById(resultat[i]?.id_type_paiement);
            const avenants = await this.getAvenantsContrat(resultat[i]?.id_contrat);
            const numeroAttestation = await this.getNumeroAttestationContrat(resultat[i].id_contrat);
            const contrat = new Contrat(resultat[i].id_contrat, resultat[i].numero_police, client, vehicule, resultat[i].date_debut, resultat[i].duree, resultat[i].date_echeance, Classification, resultat[i].reduction, resultat[i].montant_total, resultat[i].status, exoneration, user, garanties, procedures, renouvellements, typePaiement, avenants, resultat[i].code_apporteur, numeroAttestation, resultat[i].numero_contrat);
            departementsContrat.push(contrat);
        }
        return departementsContrat;
    }

    async getContratByPoliceNumberAgence(idDepartement: number, numero_police: string): Promise<Array<Contrat>> {
        const query = `select c.*
        from contrat c
        left join utilisateur u
        on c.id_utilisateur = u.id_utilisateur
        where u.id_departement = ${idDepartement} and c.numero_police like '${numero_police}%'`;
        console.log(query);

        let departementsContrat = [];
        const resultat = await this.databaseService.executeQuery(query);
        for (let i = 0; i < resultat.length; i++) {
            const user = await this.user.getUserById(resultat[i].id_utilisateur);
            const vehicule = await this.vehicule.getVehiculeById(resultat[i].id_vehicule);
            const client = await this.client.getClientById(resultat[i].id_client);
            const exoneration = await this.exoneration.getExonerationById(resultat[i].id_exoneration);
            const Classification = await this.classification.getClassificationById(resultat[i].id_classification);
            const garanties = await this.garanties.getContratGaranties(resultat[i].id_contrat);
            const procedures = await this.procedurePaiement.getContratProcedurePaiement(resultat[i].id_contrat)
            const renouvellements = await this.getRenouvellements(resultat[i].id_contrat);
            const typePaiement = await this.getTypePaiementById(resultat[i]?.id_type_paiement);
            const avenants = await this.getAvenantsContrat(resultat[i]?.id_contrat);
            const numeroAttestation = await this.getNumeroAttestationContrat(resultat[i].id_contrat);
            const contrat = new Contrat(resultat[i].id_contrat, resultat[i].numero_police, client, vehicule, resultat[i].date_debut, resultat[i].duree, resultat[i].date_echeance, Classification, resultat[i].reduction, resultat[i].montant_total, resultat[i].status, exoneration, user, garanties, procedures, renouvellements, typePaiement, avenants, resultat[i].code_apporteur, numeroAttestation, resultat[i].numero_contrat);
            departementsContrat.push(contrat);
        }
        return departementsContrat;
    }

    async getAllContrats(): Promise<Array<Contrat>> {
        const query = 'SELECT * FROM contrat';
        let Contrats = [];
        const resultat = await this.databaseService.executeQuery(query);
        for (let i = 0; i < resultat.length; i++) {
            const user = await this.user.getUserById(resultat[i].id_utilisateur);
            const vehicule = await this.vehicule.getVehiculeById(resultat[i].id_vehicule);
            const client = await this.client.getClientById(resultat[i].id_client);
            const exoneration = await this.exoneration.getExonerationById(resultat[i].id_exoneration);
            const Classification = await this.classification.getClassificationById(resultat[i].id_classification);
            const garanties = await this.garanties.getContratGaranties(resultat[i].id_contrat);
            const procedures = await this.procedurePaiement.getContratProcedurePaiement(resultat[i].id_contrat)
            const renouvellements = await this.getRenouvellements(resultat[i].id_contrat);
            const typePaiement = await this.getTypePaiementById(resultat[i]?.id_type_paiement);
            const avenants = await this.getAvenantsContrat(resultat[i]?.id_contrat);
            const numeroAttestation = await this.getNumeroAttestationContrat(resultat[i].id_contrat);
            const contrat = new Contrat(resultat[i].id_contrat, resultat[i].numero_police, client, vehicule, resultat[i].date_debut, resultat[i].duree, resultat[i].date_echeance, Classification, resultat[i].reduction, resultat[i].montant_total, resultat[i].status, exoneration, user, garanties, procedures, renouvellements, typePaiement, avenants, resultat[i].code_apporteur, numeroAttestation, resultat[i].numero_contrat);
            Contrats.push(contrat);
        }
        return Contrats;
    }

    async getContratById(idContrat: number): Promise<Contrat> {
        const query = 'SELECT * FROM contrat where id_contrat = ' + idContrat;
        console.log(query);
        const resultat = await this.databaseService.executeQuery(query);
        const i = 0;
        const user = await this.user.getUserById(resultat[i].id_utilisateur);
        const vehicule = await this.vehicule.getVehiculeById(resultat[i].id_vehicule);
        const client = await this.client.getClientById(resultat[i].id_client);
        const exoneration = await this.exoneration.getExonerationById(resultat[i].id_exoneration);
        const Classification = await this.classification.getClassificationById(resultat[i].id_classification);
        const garanties = await this.garanties.getContratGaranties(resultat[i].id_contrat);
        const procedures = await this.procedurePaiement.getContratProcedurePaiement(resultat[i].id_contrat);
        const renouvellements = await this.getRenouvellements(resultat[i].id_contrat);
        const typePaiement = await this.getTypePaiementById(resultat[i]?.id_type_paiement);
        const avenants = await this.getAvenantsContrat(resultat[i]?.id_contrat);
        const numeroAttestation = await this.getNumeroAttestationContrat(resultat[i].id_contrat);
        const contrat = new Contrat(resultat[i].id_contrat, resultat[i].numero_police, client, vehicule, resultat[i].date_debut, resultat[i].duree, resultat[i].date_echeance, Classification, resultat[i].reduction, resultat[i].montant_total, resultat[i].status, exoneration, user, garanties, procedures, renouvellements, typePaiement, avenants, resultat[i].code_apporteur, numeroAttestation, resultat[i].numero_contrat);
        return contrat
    }

    async getContratByPoliceNumber(numero_police: string) {
        const query = `SELECT * FROM contrat where numero_police like '${numero_police}%'`;
        console.log(query);
        const resultat = await this.databaseService.executeQuery(query);
        let contrats = [];
        for (let i = 0; i < resultat.length; i++) {
            const user = await this.user.getUserById(resultat[i].id_utilisateur);
            const vehicule = await this.vehicule.getVehiculeById(resultat[i].id_vehicule);
            const client = await this.client.getClientById(resultat[i].id_client);
            const exoneration = await this.exoneration.getExonerationById(resultat[i].id_exoneration);
            const Classification = await this.classification.getClassificationById(resultat[i].id_classification);
            const garanties = await this.garanties.getContratGaranties(resultat[i].id_contrat);
            const procedures = await this.procedurePaiement.getContratProcedurePaiement(resultat[i].id_contrat);
            const renouvellements = await this.getRenouvellements(resultat[i].id_contrat);
            const typePaiement = await this.getTypePaiementById(resultat[i]?.id_type_paiement);
            const avenants = await this.getAvenantsContrat(resultat[i]?.id_contrat);
            const numeroAttestation = await this.getNumeroAttestationContrat(resultat[i].id_contrat);
            const contrat = new Contrat(resultat[i].id_contrat, resultat[i].numero_police, client, vehicule, resultat[i].date_debut, resultat[i].duree, resultat[i].date_echeance, Classification, resultat[i].reduction, resultat[i].montant_total, resultat[i].status, exoneration, user, garanties, procedures, renouvellements, typePaiement, avenants, resultat[i].code_apporteur, numeroAttestation, resultat[i].numero_contrat);
            contrats.push(contrat)
        }
        return contrats;
    }

    async getClientContrat(idClient: number): Promise<Array<Contrat>> {
        const query = 'SELECT * FROM contrat where id_client = ' + idClient;
        console.log(query);
        const resultat = await this.databaseService.executeQuery(query);
        let conts = []
        for (let i = 0; i < resultat.length; i++) {
            const user = await this.user.getUserById(resultat[i].id_utilisateur);
            const vehicule = await this.vehicule.getVehiculeById(resultat[i].id_vehicule);
            const client = await this.client.getClientById(resultat[i].id_client);
            const exoneration = await this.exoneration.getExonerationById(resultat[i].id_exoneration);
            const Classification = await this.classification.getClassificationById(resultat[i].id_classification);
            const garanties = await this.garanties.getContratGaranties(resultat[i].id_contrat);
            const procedures = await this.procedurePaiement.getContratProcedurePaiement(resultat[i].id_contrat)
            const renouvellements = await this.getRenouvellements(resultat[i].id_contrat);
            const typePaiement = await this.getTypePaiementById(resultat[i]?.id_type_paiement);
            const avenants = await this.getAvenantsContrat(resultat[i]?.id_contrat);
            const numeroAttestation = await this.getNumeroAttestationContrat(resultat[i].id_contrat);
            const contrat = new Contrat(resultat[i].id_contrat, resultat[i].numero_police, client, vehicule, resultat[i].date_debut, resultat[i].duree, resultat[i].date_echeance, Classification, resultat[i].reduction, resultat[i].montant_total, resultat[i].status, exoneration, user, garanties, procedures, renouvellements, typePaiement, avenants, resultat[i].code_apporteur, numeroAttestation, resultat[i].numero_contrat);
            conts.push(contrat)
        }
        return conts;
    }

    async getLastVal(): Promise<string> {
        const sql = "SELECT last_value FROM contrat_id_contrat_seq";
        const resultat = await this.databaseService.executeQuery(sql);
        const lastVal = resultat?.[0]?.last_value;
        return lastVal.toString();
    }

    async getNumber0(): Promise<string> {
        const len = 5;
        const lenSeq = (await this.getLastVal()).length;
        const numberO = len - lenSeq;
        let O = "";
        for (let i = 0; i < numberO; i++) {
            O += "0";
        }
        return O;
    }

    async generatePoliceNumber(idUtilisateur: number): Promise<string> {
        const user = await this.user.getUserById(idUtilisateur);
        const departement = user.getDepartement();
        const code = departement.getCode()
        const number00 = await this.getNumber0();
        const next = await this.getLastVal();

        const police = `${code}${number00}${next}`;
        console.log("Numéro de police généré : ", police);
        return police;
    }


    formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    async getDateEcheance(date: Date, duree: number): Promise<string> {
        const dateDebutObj = typeof date === 'string' ? new Date(date) : date;
        const dateEcheance = new Date(dateDebutObj)
        dateEcheance.setMonth(dateDebutObj.getMonth() + duree);
        dateEcheance.setDate(dateEcheance.getDate() + 1);
        return this.formatDate(dateEcheance)
    }

    async newContrat(
        idClient: number,
        idVehicule: number,
        dateDebut: Date,
        duree: number,
        idClassification: number,
        reduction: number,
        idExoneration: number,
        idUtilisateur: number,
        garanti: Array<Record<string, any>>,
        procedures: Array<Record<string, any>>,
        idTypePaiement: number,
        code_apporteur: string,
        numero_attestation: string,
        numero_contrat: string
    ) {
        const dateEcheance = await this.getDateEcheance(dateDebut, duree);

        const query = `
            INSERT INTO contrat (
                numero_police, id_client, id_vehicule, date_debut, duree, date_echeance, 
                id_classification, reduction, montant_total, id_exoneration, id_utilisateur, status, id_type_paiement, code_apporteur, numero_contrat
            ) 
            VALUES (null, ${idClient}, ${idVehicule}, '${dateDebut}', ${duree}, '${dateEcheance}', 
                ${idClassification}, ${reduction}, 0, ${idExoneration}, ${idUtilisateur}, 5, ${idTypePaiement}, ${code_apporteur}, '${numero_contrat}') 
            RETURNING id_contrat
        `;
        console.log(query);

        const result = await this.databaseService.executeQuery(query);
        const idContrat = result[0]?.id_contrat;

        if (!idContrat) {
            throw new Error("Erreur lors de la création du contrat");
        }

        const garantiesInstances = garanti.map(g => new Garantie(g.id_garantie, g.nom, g.status));
        for (const garantie of garantiesInstances) {

            await this.garanties.newGarantieContrat(garantie.getIdGarantie(), idContrat);
        }

        const proceduresInstances = procedures.map(p => new ProcedurePaiement(p.id_procedure_paiement, p.date_paiement, p.pourcentage, p.status));
        for (const procedure of proceduresInstances) {
            await this.procedurePaiement.newProcedurePaiement(procedure.getDatePaiement(), procedure.getPourcentage(), idContrat);
        }

        const queryMontant = `SELECT 
        SUM(montant_garanties + montant_duree + montant_exoneration + accessoires) - 
             ((SUM(montant_garanties + montant_duree + montant_exoneration + accessoires) * reduction) / 100) AS net_payer
FROM 
    v_montant_total 
WHERE 
    id_contrat = ${idContrat} 
GROUP BY 
    id_contrat, reduction;
`;
        console.log(queryMontant);
        const resultMontant = await this.databaseService.executeQuery(queryMontant);


        const numeroPolice = await this.generatePoliceNumber(idUtilisateur);
        const update = `UPDATE contrat SET numero_police = '${numeroPolice}', montant_total = ${resultMontant[0]?.net_payer} WHERE id_contrat = ${idContrat}`;
        console.log(update);
        await this.databaseService.executeQuery(update);

        await this.addNewAttestation(idContrat, numero_attestation, dateDebut);

        const apporteur = await this.user.getUserByNumeroMatricule(code_apporteur);
        let commission = 0;
        let valeurs = 0;

        if (apporteur.getRole().getIdRole() === 1) {
            commission = 1;
            const comissionObj = await this.getCommissionById(commission);
            valeurs = (comissionObj.getTaux() * resultMontant[0]?.net_payer) / 100;
        } else if (apporteur.getRole().getIdRole() === 2 && !this.user.isAgenceGeneralEmploye(code_apporteur)) {
            commission = 2;
            const comissionObj = await this.getCommissionById(commission);
            valeurs = (comissionObj.getTaux() * resultMontant[0]?.net_payer) / 100;
        } else if (apporteur.getRole().getIdRole() === 2 && this.user.isAgenceGeneralEmploye(code_apporteur)) {
            commission = 3;
            const comissionObj = await this.getCommissionById(commission);
            valeurs = (comissionObj.getTaux() * resultMontant[0]?.net_payer) / 100;
        }

        const queryInsertCommission = `insert into report_commission values (default, ${commission}, ${apporteur.getIdUtilisateur()}, ${valeurs})`;
        console.log(queryInsertCommission)
        await this.databaseService.executeQuery(queryInsertCommission);
    }

    async getCommissionById(id_commission: number) {
        const query = 'select * from commission where id_commission = ' + id_commission + ' and status != 0';
        const resultat = await this.databaseService.executeQuery(query);
        return new Commission(resultat[0]?.id_commission, resultat[0]?.nom, resultat[0]?.taux, resultat[0].status);
    }

    /*Concernant la simulation */
    async simulationInfo(idContrat: number): Promise<Map<string, number>> {
        const hashMap = new Map<string, number>();

        // Query pour avoir seulement les exonerations tacava, te, tva, imp
        const query = "select * from v_montant_contrat where id_contrat = " + idContrat;
        const resultat = await this.databaseService.executeQuery(query);

        // Query pour avoir le montant à payer
        const query1 = "select * from contrat where id_contrat = " + idContrat;
        const resultat1 = await this.databaseService.executeQuery(query1);

        // Query pour avoir le prime_rc, montant_garanties, et montant total des exonérations
        const query2 = "select * from v_montant_total where id_contrat = " + idContrat;
        const resultat2 = await this.databaseService.executeQuery(query2);

        hashMap.set("tacava", resultat[0].tacava);
        hashMap.set("te", resultat[0].te);
        hashMap.set("tva", resultat[0].tva);
        hashMap.set("imp", resultat[0].imp);
        hashMap.set("montant_total", resultat1[0].montant_total);
        hashMap.set("montant_exoneration", resultat2[0].montant_exoneration);
        hashMap.set("montant_garanties", resultat2[0].montant_garanties);
        hashMap.set("accessoires", resultat2[0].accessoires);
        return hashMap;
    }

    async newContratSimulation(
        puissance: number,
        id_energie: number,
        valeur_nette: number,
        duree: number,
        idClassification: number,
        reduction: number,
        idExoneration: number,
        garanti: Array<Record<string, any>>
    ): Promise<Map<string, number>> {
        const dateEcheance = await this.getDateEcheance(new Date(), duree);
        await this.vehicule.newVehiculeSimulation(puissance, id_energie, valeur_nette);

        const lastVehicule = await this.vehicule.getLastVehicule();

        const query = `
            INSERT INTO contrat (
                numero_police, id_client, id_vehicule, duree, date_echeance, 
                id_classification, reduction, montant_total, id_exoneration, status
            ) 
            VALUES (null, null, ${lastVehicule.getIdVehicule()}, ${duree}, '${dateEcheance}', 
                ${idClassification}, ${reduction}, 0, ${idExoneration}, 5) 
            RETURNING id_contrat
        `;
        console.log(query);

        const result = await this.databaseService.executeQuery(query);
        const idContrat = result[0]?.id_contrat;

        if (!idContrat) {
            throw new Error("Erreur lors de la création du contrat");
        }

        const garantiesInstances = garanti.map(g => new Garantie(g.id_garantie, g.nom, g.status));
        for (const garantie of garantiesInstances) {

            await this.garanties.newGarantieContrat(garantie.getIdGarantie(), idContrat);
        }

        const queryMontant = `SELECT 
            SUM(montant_garanties + montant_duree + montant_exoneration + accessoires) - 
                 ((SUM(montant_garanties + montant_duree + montant_exoneration + accessoires) * reduction) / 100) AS net_payer
    FROM 
        v_montant_total 
    WHERE 
        id_contrat = ${idContrat} 
    GROUP BY 
        id_contrat, reduction;
    `;
        console.log(queryMontant);
        const resultMontant = await this.databaseService.executeQuery(queryMontant);

        const numeroPolice = await this.generatePoliceNumber(4);
        const update = `UPDATE contrat SET numero_police = '${numeroPolice}', montant_total = ${resultMontant[0]?.net_payer} WHERE id_contrat = ${idContrat}`;
        console.log(update);

        await this.databaseService.executeQuery(update);

        return this.simulationInfo(idContrat);

    }

    differenceEnMois(date1: Date, date2: Date): number {
        return (date2.getFullYear() - date1.getFullYear()) * 12 + (date2.getMonth() - date1.getMonth());
    }

    async resilierContrat(idContrat: number) {
        const concernedContrat = await this.getContratById(idContrat);
        const queryMontantEncaissement = `
            select coalesce(sum(e.montant), 0) as encaissement
            from encaissement e
            join procedure_paiement pp on pp.id_procedure_paiement = e.id_procedure_paiement
            join contrat c on c.id_contrat = pp.id_contrat
            where pp.status !=0 and c.status !=0 and e.status != 0 and c.id_contrat = ${idContrat}`;
        const resultat = await this.databaseService.executeQuery(queryMontantEncaissement);
        const montant_encaissement = resultat[0]?.encaissement;

        const differenceMois = this.differenceEnMois(new Date(), concernedContrat.getDateEcheance())
        console.log('difference mois', differenceMois);

        let valeurs = 0;
        let typeResiliation = 0;

        let montant_duree = 0;
        if (differenceMois === concernedContrat.getDureeContrat()) {
            montant_duree = concernedContrat.getMontantTotal() / concernedContrat.getDureeContrat()
        } else {
            montant_duree = (concernedContrat.getMontantTotal() * differenceMois) / concernedContrat.getDureeContrat()
        }

        console.log('montant_duree', montant_duree);
        console.log('montant_encaissement', montant_encaissement);

        if (montant_encaissement > montant_duree) {
            // resiliation avec ristourne
            valeurs = montant_encaissement - montant_duree;
            typeResiliation = 5;
            await this.addNewContratAvenant(idContrat, 3);
        } else if (montant_encaissement < montant_duree) {
            // encaissement
            valeurs = montant_duree - montant_encaissement;
            typeResiliation = 0;
            await this.addNewContratAvenant(idContrat, 2);
        } else {
            // resiliation sans ristourne
            valeurs = 0;
            typeResiliation = 0;
            await this.addNewContratAvenant(idContrat, 2);
        }

        const queryInsert = `insert into resiliation_contrat (id_contrat, type_resiliation, montant) values (${idContrat}, ${typeResiliation}, ${valeurs})`
        console.log(queryInsert);
        await this.databaseService.executeQuery(queryInsert);
        const update = `UPDATE contrat SET status = 0 WHERE id_contrat = ${idContrat}`;
        await this.databaseService.executeQuery(update);
    }

    async renouvellerContrat(
        idContrat: number,
        dateDebut: Date,
        duree: number,
        reduction: number,
        idExoneration: number,
        garanti: Array<Record<string, any>>,
        procedures: Array<Record<string, any>>,
        numero_attestation: string,
        numero_contrat: string
    ) {

        const insertRenouvellement = `INSERT INTO renouvellement_contrat (id_contrat, date_renouvellement) values (${idContrat}, '${dateDebut}')`;
        await this.databaseService.executeQuery(insertRenouvellement);

        const deleteEncaissement = `update encaissement set status = 0 where id_procedure_paiement in (select id_procedure_paiement from procedure_paiement where id_contrat = ${idContrat} and (status = 1 or status = 5))`
        console.log(deleteEncaissement);
        await this.databaseService.executeQuery(deleteEncaissement);

        const deleteGarantie = "update garantie_contrat set status = 0 where id_contrat = " + idContrat;
        console.log(deleteGarantie);
        await this.databaseService.executeQuery(deleteGarantie);

        const deletePaiement = "update procedure_paiement set status = 0 where id_contrat = " + idContrat;
        console.log(deletePaiement);
        await this.databaseService.executeQuery(deletePaiement);


        await this.addNewContratAvenant(idContrat, 1);

        // insertion de la nouvelle configuration de garanties et de paiements
        const garantiesInstances = garanti.map(g => new Garantie(g.id_garantie, g.nom, g.status));
        for (const garantie of garantiesInstances) {

            await this.garanties.newGarantieContrat(garantie.getIdGarantie(), idContrat);
        }

        const proceduresInstances = procedures.map(p => new ProcedurePaiement(p.id_procedure_paiement, p.date_paiement, p.pourcentage, p.status));
        for (const procedure of proceduresInstances) {
            await this.procedurePaiement.newProcedurePaiement(procedure.getDatePaiement(), procedure.getPourcentage(), idContrat);
        }

        const dateEcheance = await this.getDateEcheance(dateDebut, duree);

        const queryMontant = `SELECT 
        SUM(montant_garanties + montant_duree + montant_exoneration + accessoires) - 
             ((SUM(montant_garanties + montant_duree + montant_exoneration + accessoires) * reduction) / 100) AS net_payer
FROM 
    v_montant_total 
WHERE 
    id_contrat = ${idContrat} 
GROUP BY 
    id_contrat, reduction;
`;
        console.log(queryMontant);
        const resultMontant = await this.databaseService.executeQuery(queryMontant);

        const queryFinal = `update contrat set date_debut = '${dateDebut}', duree = '${duree}', reduction = ${reduction}, id_exoneration = ${idExoneration}, date_echeance = '${dateEcheance}', montant_total = ${resultMontant[0]?.net_payer}, numero_contrat = '${numero_contrat}', status = 5 where id_contrat = ${idContrat}`;
        console.log(queryFinal);
        await this.databaseService.executeQuery(queryFinal);

        await this.addNewAttestation(idContrat, numero_attestation, dateDebut);
    }

    async allTypePaiement() {
        const query = 'select * from type_paiement where status != 0';
        return await this.databaseService.executeQuery(query);
    }
}