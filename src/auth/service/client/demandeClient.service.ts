/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { ContratService } from '../contrat/contrat.service';
import { DatabaseService } from '../database.service';
import { DemandeClient } from 'src/auth/model/demande/demandeClient.model';

@Injectable()
export class DemandeClientService {

    constructor(private readonly databaseService: DatabaseService, private contratService: ContratService) { }

    async validateDemande(id_demande) {
        const query = "update demande_client set status = 5 where id_demande_client = "+id_demande;
        await this.databaseService.executeQuery(query);
    }

    async deniedDemande(id_demande) {
        const query = "update demande_client set status = 0 where id_demande_client = "+id_demande;
        await this.databaseService.executeQuery(query);
    }

    async addNewDemande(titre: string, objet: string, id_contrat: number, is_renouvellement: number, status: number) {
        const query = `insert into demande_client (titre, objet, id_contrat, is_renouvellement, status) values ('${titre}', '${objet}', ${id_contrat}, ${is_renouvellement}, ${status})`;
        console.log(query);
        await this.databaseService.executeQuery(query);
    }

    async allClientDemandes(id_client) {
        const query = `SELECT dc.* 
        FROM demande_client dc 
        JOIN contrat c ON c.id_contrat = dc.id_contrat 
        WHERE c.id_client = ${id_client} order by dc.date_envoie desc`;
        console.log(query);
        const resultat = await this.databaseService.executeQuery(query);
        let demandes = []
        for (let i = 0; i < resultat.length; i++) {
            const contrat = await this.contratService.getContratById(resultat[i]?.id_contrat);
            const demande = new DemandeClient(resultat[i]?.id_demande_client, resultat[i]?.date_envoie, resultat[i]?.titre, resultat[i]?.objet, resultat[i]?.status, contrat, resultat[i]?.is_renouvellement);
            demandes.push(demande);
        }
        return demandes;
    }

    async allDemandesAgences(prefixe_agence) {
        const query = `SELECT dc.* 
        FROM demande_client dc 
        JOIN contrat c ON c.id_contrat = dc.id_contrat 
        WHERE c.numero_police LIKE '${prefixe_agence}%' order by dc.date_envoie desc
        `;
        console.log(query);
        const resultat = await this.databaseService.executeQuery(query);
        let demandes = []
        for (let i = 0; i < resultat.length; i++) {
            const contrat = await this.contratService.getContratById(resultat[i]?.id_contrat);
            const demande = new DemandeClient(resultat[i]?.id_demande_client, resultat[i]?.date_envoie, resultat[i]?.titre, resultat[i]?.objet, resultat[i]?.status, contrat, resultat[i]?.is_renouvellement);
            demandes.push(demande);
        }
        return demandes;
    }

    async allDemandes() {
        const query = `SELECT * from demande_client order by date_envoie desc`;
        const resultat = await this.databaseService.executeQuery(query);
        let demandes = []
        for (let i = 0; i < resultat.length; i++) {
            const contrat = await this.contratService.getContratById(resultat[i]?.id_contrat);
            const demande = new DemandeClient(resultat[i]?.id_demande_client, resultat[i]?.date_envoie, resultat[i]?.titre, resultat[i]?.objet, resultat[i]?.status, contrat, resultat[i]?.is_renouvellement);
            demandes.push(demande);
        }
        return demandes;
    }

    async allDemandesAgencesNotificationsAdmin() {
        const query = `SELECT dc.* 
        FROM demande_client dc 
        JOIN contrat c ON c.id_contrat = dc.id_contrat 
        WHERE dc.status = 1 order by dc.date_envoie desc limit 4`;
        console.log(query);
        const resultat = await this.databaseService.executeQuery(query);
        let demandes = []
        for (let i = 0; i < resultat.length; i++) {
            const contrat = await this.contratService.getContratById(resultat[i]?.id_contrat);
            const demande = new DemandeClient(resultat[i]?.id_demande_client, resultat[i]?.date_envoie, resultat[i]?.titre, resultat[i]?.objet, resultat[i]?.status, contrat, resultat[i]?.is_renouvellement);
            demandes.push(demande);
        }
        return demandes;
    }

    async allDemandesAgencesNotifications(prefixe_agence) {
        const query = `SELECT dc.* 
        FROM demande_client dc 
        JOIN contrat c ON c.id_contrat = dc.id_contrat 
        WHERE c.numero_police LIKE '${prefixe_agence}%' and dc.status = 1 order by dc.date_envoie desc limit 4`;
        console.log(query);
        const resultat = await this.databaseService.executeQuery(query);
        let demandes = []
        for (let i = 0; i < resultat.length; i++) {
            const contrat = await this.contratService.getContratById(resultat[i]?.id_contrat);
            const demande = new DemandeClient(resultat[i]?.id_demande_client, resultat[i]?.date_envoie, resultat[i]?.titre, resultat[i]?.objet, resultat[i]?.status, contrat, resultat[i]?.is_renouvellement);
            demandes.push(demande);
        }
        return demandes;
    }

    async getDemandesById(id_demande_client: number) {
        const query = 'select * from demande_client where id_demande_client = ' + id_demande_client + ' order by date_envoie desc';
        const resultat = await this.databaseService.executeQuery(query);
        const i = 0;
        const contrat = await this.contratService.getContratById(resultat[i]?.id_contrat);
        return new DemandeClient(resultat[i]?.id_demande_client, resultat[i]?.date_envoie, resultat[i]?.titre, resultat[i]?.objet, resultat[i]?.status, contrat, resultat[i]?.is_renouvellement);
    }
}
