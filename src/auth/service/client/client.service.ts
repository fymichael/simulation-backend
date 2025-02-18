/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/auth/service/database.service';
import { Genre } from '../../model/client/genre.model';
import { Client } from '../../model/client/client.model';
import { GenreService } from './genre.service';

@Injectable()
export class ClientService {
    private client: Client | null = null;
    private genreService: GenreService;


    constructor(private readonly databaseService: DatabaseService, genreService: GenreService) { 
        this.genreService = genreService
    }

    getClient() {
        return this.client;
    }

    setClient(Client: Client) {
        this.client = Client;
    }
    
    async changePassword(newPassword: string, idClient) {
        const query = `update client set mdp = '${newPassword}' where id_client = ${idClient}`;
        await this.databaseService.executeQuery(query);
    }

    async getDataProfile(idClient): Promise<Map<string, any>> {
        const hashMap = new Map<string, number>();

        const queryContratActif = "select count(*) as contrat_actifs from contrat where id_client = "+idClient+" and status != 0";
        const querySinistreDeclarer = "select count(*) as sinistre_declarer from sinistre where id_contrat in (select id_contrat from contrat where id_client = "+idClient+")";
        const queryCoutContrat = "select sum(montant_total) as cout_contrat from contrat where id_client = "+idClient+" and status != 0";
        const queryEcheance ="select date_echeance from contrat where id_client = "+idClient+" and status != 0 order by date_echeance desc limit 1";
        const result1 = await this.databaseService.executeQuery(queryContratActif);
        const result2 = await this.databaseService.executeQuery(querySinistreDeclarer);
        const result3 = await this.databaseService.executeQuery(queryCoutContrat);
        const result4 = await this.databaseService.executeQuery(queryEcheance);

        hashMap.set("contratActif", result1[0].contrat_actifs);
        hashMap.set("sinistreDeclarer", result2[0].sinistre_declarer);
        hashMap.set("coutContrat", result3[0].cout_contrat);
        hashMap.set("echeance", result4[0].date_echeance);
        
        return hashMap;
    }

    async checkClientAuthentification(email: string, mdp: string) {
        if (!email || email.trim() === "") {
            throw new Error("Email non valide ou null");
        }

        if (!mdp || mdp.trim() === "") {
            throw new Error("Mot de passe invalide ou null");
        }

        const query = `SELECT * FROM client WHERE email = '${email}' AND mdp = '${mdp}'`;

        console.log(query);

        const result = await this.databaseService.executeQuery(query);

        if (result.length === 0) {
            throw new UnauthorizedException();
        }

        const clientGenre = await this.genreService.getGenreById(result[0].id_genre);

        return new Client(
            result[0].id_client, 
            result[0].nom, 
            result[0].prenom, 
            result[0].date_naissance, 
            result[0].adresse, 
            result[0].contact, 
            result[0].email, 
            result[0].mdp, 
            result[0].cin,
            clientGenre,
            result[0].status);
    }

    async getAllClients(): Promise<Array<Client>> {
        const query = 'SELECT * FROM client where status != 0';
        let clients = [];
        const resultat = await this.databaseService.executeQuery(query);
        for (let i = 0; i < resultat.length; i++) {
            const clientGenre = await this.genreService.getGenreById(resultat[i].id_genre);
            const client = new Client(resultat[i].id_client, resultat[i].nom, resultat[i].prenom, resultat[i].date_naissance, resultat[i].adresse, resultat[i].contact, resultat[i].email, resultat[i].mdp, resultat[i].cin, clientGenre, resultat[i].status);
            clients.push(client);
        }
        return clients;
    }

    async getLastClient(): Promise<Client> {
        const query = 'SELECT * FROM client where status != 0 order by id_client desc limit 1';
        const result = await this.databaseService.executeQuery(query);

        if (result.length === 0) {
            throw new Error('Client not found');
        }

        const clientGenre = await this.genreService.getGenreById(result[0].id_genre);

        return new Client(
            result[0].id_client, 
            result[0].nom, 
            result[0].prenom, 
            result[0].date_naissance, 
            result[0].adresse, 
            result[0].contact, 
            result[0].email, 
            result[0].mdp, 
            result[0].cin,
            clientGenre,
            result[0].status);
    }

    async getClientById(idClient: number): Promise<Client> {
        const query = 'SELECT * FROM client where id_client = '+idClient;
        const result = await this.databaseService.executeQuery(query);

        if (result.length === 0) {
            throw new Error('Client not found');
        }

        const clientGenre = await this.genreService.getGenreById(result[0].id_genre);

        return new Client(
            result[0].id_client, 
            result[0].nom, 
            result[0].prenom, 
            result[0].date_naissance, 
            result[0].adresse, 
            result[0].contact, 
            result[0].email, 
            result[0].mdp, 
            result[0].cin,
            clientGenre,
            result[0].status);
    }

    async newClient(nom: string, prenom: string, date_naissance: Date, adresse: string, contact: string, email: string, mdp: string, cin: string, id_genre: Genre) {
        const query = `insert into client (nom, prenom, date_naissance, adresse, contact, email, mdp, cin, id_genre) values ('${nom}', '${prenom}', '${date_naissance}', '${adresse}', '${contact}', '${email}', '${mdp}', '${cin}', '${id_genre}')`;
        console.log(query);
        await this.databaseService.executeQuery(query);
    }

    async updateClient(idClient: number, nom: string, prenom: string, date_naissance: Date, adresse: string, contact: string, email: string, mdp: string, cin: string, id_genre: number) {
        const query = `update client set nom = '${nom}', prenom = '${prenom}', date_naissance = '${date_naissance}', adresse = '${adresse}', contact = '${contact}', email = '${email}', mdp = '${mdp}', id_genre = ${id_genre}, cin = '${cin}' where id_client = `+idClient;
        return await this.databaseService.executeQuery(query);
    }

    async deleteClient(idClient: number) {
        const query = 'update client set status = 0 where id_client = '+idClient;
        return await this.databaseService.executeQuery(query);
    }
}
