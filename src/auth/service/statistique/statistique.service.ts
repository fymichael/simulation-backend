/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { Statistique } from 'src/auth/model/statistiqueModel/statistique.model';
import { SuiviPaiement } from 'src/auth/model/statistiqueModel/suiviPaiement.model';
import { CommissionEmploye } from 'src/auth/model/statistiqueModel/commissionEmploye.model';
import { UserService } from '../auth/user.service';

@Injectable()
export class StatistiqueService {

    constructor(
        private readonly databaseService: DatabaseService,
        private readonly userService: UserService
    ) { }
    formatNombre(number) {
        return number?.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    async getDataCommissionAgence() {
        const query1 = `select  
        coalesce(sum(rc.valeurs), 0) as montant_commission
    from report_commission rc
    left join utilisateur u on u.id_utilisateur = rc.id_utilisateur
    left join departement d on d.id_departement = u.id_departement
    where d.code >= '100'
    group by d.code`

        const resultat1 = await this.databaseService.executeQuery(query1);
        let dataCommissions = []
        for (let i = 0; i < resultat1.length; i++) {
            dataCommissions.push(Math.round(resultat1[i]?.montant_commission));
        }
        return dataCommissions
    }

    async getXAxisLabel() {
        const query1 = `select  
        d.code
    from report_commission rc
    left join utilisateur u on u.id_utilisateur = rc.id_utilisateur
    left join departement d on d.id_departement = u.id_departement
    where d.code >= '100'
    group by d.code;`

        const resultat1 = await this.databaseService.executeQuery(query1);
        let xAxis = []
        for (let i = 0; i < resultat1.length; i++) {
            xAxis.push(resultat1[i]?.code);
        }
        return xAxis;
    }

    async employeAffaire() {
        const query1 = `select u.id_utilisateur, count(rc.*) as valeurs
        from report_commission rc
        join utilisateur u on u.id_utilisateur = rc.id_utilisateur
        group by u.id_utilisateur
        order by count(rc.*) desc limit 1`;
        const resultat1 = await this.databaseService.executeQuery(query1);
        const user = await this.userService.getUserById(resultat1[0]?.id_utilisateur);
        return new CommissionEmploye(user, resultat1[0]?.valeurs);
    }

    async employeCommission() {
        const query1 = `select u.id_utilisateur, sum(rc.valeurs) as valeurs
        from report_commission rc
        join utilisateur u on u.id_utilisateur = rc.id_utilisateur
        group by u.id_utilisateur
        order by sum(rc.valeurs) desc limit 1`;
        const resultat1 = await this.databaseService.executeQuery(query1);
        const user = await this.userService.getUserById(resultat1[0]?.id_utilisateur);
        return new CommissionEmploye(user, resultat1[0]?.valeurs);
    }

    async suiviPaiement(annee) {
        const query = `select * from v_suivi_paiement where extract(year from date) = '${annee}'`;
        const resultat = await this.databaseService.executeQuery(query);
        let suiviPaiements = []
        for (let i = 0; i < resultat.length; i++) {
            const suivi = new SuiviPaiement(resultat[i].numero_police, resultat[i].montant, resultat[i].date, resultat[i].status);
            suiviPaiements.push(suivi);
        }
        const query1 = `select * from v_recouvrement where extract(year from date) = '${annee}'`;
        const resultat1 = await this.databaseService.executeQuery(query1);
        for (let i = 0; i < resultat1.length; i++) {
            const suivi = new SuiviPaiement(resultat1[i].numero_police, resultat1[i].montant, resultat1[i].date, resultat1[i].status);
            suiviPaiements.push(suivi);
        }
        return suiviPaiements;
    }

    async contratRepartition(annee) {
        const hashMap = new Map<string, Array<any>>();
        let contrat_actifs = []
        let contrat_resilier = []

        const query1 = `select mois, total_contrat from v_repartition_contrat_actifs where extract (year from date_debut) = ${annee} or date_debut is null`;
        const resultat1 = await this.databaseService.executeQuery(query1);

        for (let i = 0; i < resultat1.length; i++) {
            contrat_actifs.push(resultat1[i]?.total_contrat);
        }

        const query2 = `select mois, total_contrat from v_repartition_contrat_resilier where extract (year from date_debut) = ${annee} or date_debut is null`;
        const resultat2 = await this.databaseService.executeQuery(query2);

        for (let i = 0; i < resultat2.length; i++) {
            contrat_resilier.push(resultat2[i]?.total_contrat);
        }

        const query3 = `select count(*) as nombre_contrat_actifs from contrat where status = 5 and extract (year from date_debut) = 2025`
        const resultat3 = await this.databaseService.executeQuery(query3);

        const query4 = `select count(*) as nombre_contrat_actifs from contrat where status = 0 and extract (year from date_debut) = 2025`
        const resultat4 = await this.databaseService.executeQuery(query4);

        hashMap.set('repartition_contrat_actifs', contrat_actifs);
        hashMap.set('repartition_contrat_resilier', contrat_resilier);
        hashMap.set('nombre_contrat_actifs', [resultat3[0]?.nombre_contrat_actifs ?? 0]);
        hashMap.set('nombre_contrat_resilier', [resultat4[0]?.nombre_contrat_resilier ?? 0]);

        return hashMap;
    }

    async sinistreRepartition(annee) {
        let sinistre_repartition = [];

        const query4 = `select mois, total_sinistre from v_repartition_sinistre where extract(year from date_heure_incident) = ${annee} or date_heure_incident is null`;
        const resultat4 = await this.databaseService.executeQuery(query4);

        for (let i = 0; i < resultat4.length; i++) {
            sinistre_repartition.push(resultat4[i]?.total_sinistre);
        }
        return sinistre_repartition
    }

    async statSinistre(annee) {
        const hashMap = new Map<string, number>();


        const query1 = `select count (*) as sinistre_declare from sinistre where extract(year from date_heure_incident) = ${annee} `;
        const resultat1 = await this.databaseService.executeQuery(query1);

        const query2 = `select count (*) as sinistre_approuve from sinistre where extract(year from date_heure_incident) = ${annee} and status = 5`;
        const resultat2 = await this.databaseService.executeQuery(query2);

        const query3 = `select count (*) as sinistre_non_approuve from sinistre where extract(year from date_heure_incident) = ${annee} and status = 0`;
        const resultat3 = await this.databaseService.executeQuery(query3);

        hashMap.set('sinistre_declare', resultat1[0]?.sinistre_declare);
        hashMap.set('sinistre_approuve', resultat2[0]?.sinistre_approuve);
        hashMap.set('sinistre_non_approuve', resultat3[0]?.sinistre_non_approuve);

        return hashMap;
    }

    async statAccident(annee) {
        const hashMap = new Map<string, number>();

        const query1 = `select count (*) as accident_corporel from sinistre where id_type_accident = 1 and extract (year from date_heure_incident) = ${annee}`;
        const resultat1 = await this.databaseService.executeQuery(query1);

        const query2 = `select count (*) as accident_corporel_materiel from sinistre where id_type_accident = 2 and extract (year from date_heure_incident) = ${annee}`;
        const resultat2 = await this.databaseService.executeQuery(query2);

        const query3 = `select count (*) as accident_materiel from sinistre where id_type_accident = 3 and extract (year from date_heure_incident) = ${annee}`;
        const resultat3 = await this.databaseService.executeQuery(query3);

        hashMap.set('accident_corporel', resultat1[0]?.accident_corporel);
        hashMap.set('accident_materiel_corporel', resultat2[0]?.accident_corporel_materiel);
        hashMap.set('accident_materiel', resultat3[0]?.accident_materiel);

        return hashMap;
    }

    async ArriereChartData(annee) {

        let dataArrieres = [];

        const query1 = `select mois, sum(montant) as montant from v_data_arriere where extract(year from date_paiement) = ${annee} or date_paiement is null group by mois `;
        console.log(query1);
        const resultat1 = await this.databaseService.executeQuery(query1);

        for (let i = 0; i < resultat1.length; i++) {
            dataArrieres.push(resultat1[i]?.montant);
        }
        return dataArrieres;
    }

    async EncaissementChartData(annee) {
        let dataEncaissements = [];

        const query2 = `select mois, montant from v_data_encaissement where extract(year from date_encaissement) = ${annee} or date_encaissement is null`;
        console.log(query2);
        const resultat2 = await this.databaseService.executeQuery(query2);

        for (let i = 0; i < resultat2.length; i++) {
            dataEncaissements.push(resultat2[i]?.montant);
        }
        return dataEncaissements;
    }

    async statEncaissementArriere(annee) {
        const hashMap = new Map<string, Statistique>();

        // l'agence avec le plus de contrat actifs
        const query1 = `select d.nom as departement, count(c.id_contrat) as nombre_contrat
        from departement d
        join utilisateur u on d.id_departement = u.id_departement
        join contrat c on u.id_utilisateur = c.id_utilisateur and c.status = 5
        where d.status != 0 and extract(year from c.date_debut) = ${annee} 
        group by d.nom
        order by nombre_contrat desc;`
        const resultat1 = await this.databaseService.executeQuery(query1);
        const contratActifsModel = new Statistique(resultat1[0]?.departement, resultat1[0]?.nombre_contrat);

        // l'agence avec le plus de contrat résilier
        const query2 = `select d.nom as departement, count(c.id_contrat) as nombre_contrat
        from departement d
        join utilisateur u on d.id_departement = u.id_departement
        join contrat c on u.id_utilisateur = c.id_utilisateur and c.status = 0
        where d.status != 0 and extract(year from c.date_debut) = ${annee} 
        group by d.nom
        order by nombre_contrat desc;`;

        const resultat2 = await this.databaseService.executeQuery(query2);
        const contratResilierModel = new Statistique(resultat2[0]?.departement, resultat2[0]?.nombre_contrat);

        // l'agence avec le plus d'encaissement
        const query3 = `select d.nom as departement, sum(e.montant) as montant_encaissement
        from encaissement e 
        join procedure_paiement pp on pp.id_procedure_paiement = e.id_procedure_paiement and e.status != 0
        join contrat c on c.id_contrat = pp.id_contrat
        join utilisateur u on u.id_utilisateur = c.id_utilisateur
        join departement d on d.id_departement = u.id_departement and d.status != 0
        where extract (year from e.date_encaissement) = ${annee} 
        group by d.nom
        order by sum(montant) desc limit 1 `;
        const resultat3 = await this.databaseService.executeQuery(query3);
        const encaissementModel = new Statistique(resultat3[0]?.departement, resultat3[0]?.montant_encaissement);

        // l'agence avec le plus d'arriere reçus
        const query4 = `select d.nom as departement, (((c.montant_total * pp.pourcentage)/100) - coalesce(sum(e.montant), 0)) as montant
        from procedure_paiement pp
        left join encaissement e on pp.id_procedure_paiement = e.id_procedure_paiement and e.status != 0
        left join contrat c on c.id_contrat = pp.id_contrat
        left join utilisateur u on u.id_utilisateur = c.id_utilisateur
        left join departement d on d.id_departement = u.id_departement and d.status != 0
        where extract (year from pp.date_paiement) = 2025 
        group by d.nom, pp.id_procedure_paiement, c.montant_total
        order by sum((c.montant_total * pp.pourcentage)/100) - coalesce(sum(e.montant), 0) asc limit 1`;
        const resultat4 = await this.databaseService.executeQuery(query4);
        const arriereModel = new Statistique(resultat4[0]?.departement, resultat4[0]?.montant);


        hashMap.set('agence_actifs', contratActifsModel)
        hashMap.set('agence_resilier', contratResilierModel)
        hashMap.set('agence_encaissement', encaissementModel)
        hashMap.set('agence_arriere', arriereModel)

        return hashMap;
    }

    async getGlobalStat(annee) {
        const hashMap = new Map<string, number>();
        // montant total des encaissements
        const query1 = "select coalesce(sum(montant), 0) as montant from encaissement where status != 0 and extract (YEAR from date_encaissement) = " + annee;
        const resultat1 = await this.databaseService.executeQuery(query1);

        // montants total des arrieres
        const query2 = `select coalesce(sum(arriere_restant), 0) as arrieres from v_arriere_restant where extract (YEAR from date_paiement) = ${annee}`;
        const resultat2 = await this.databaseService.executeQuery(query2);

        // contrats actifs
        const query3 = 'select count (*) as contrats_actifs from contrat where status != 0';
        const resultat3 = await this.databaseService.executeQuery(query3);

        // contrats résilié
        const query4 = 'select count(*) as contrat_resilier from contrat where status = 0';
        const resultat4 = await this.databaseService.executeQuery(query4);

        hashMap.set('montant_encaissement', resultat1[0]?.montant);
        hashMap.set('montant_arriere', resultat2[0]?.arrieres);
        hashMap.set('contrat_actifs', resultat3[0]?.contrats_actifs);
        hashMap.set('contrat_resilier', resultat4[0]?.contrat_resilier);
        return hashMap;
    }
}
