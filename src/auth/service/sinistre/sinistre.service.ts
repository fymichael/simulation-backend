/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { Sinistre } from 'src/auth/model/Sinistre/Sinistre.model';
import { DatabaseService } from 'src/auth/service/database.service';
import { TypeAccidentService } from './typeAccident.service';
import { ContratService } from '../contrat/contrat.service';

@Injectable()
export class SinistreService {
    private Sinistre: Sinistre | null = null;

    constructor(private readonly databaseService: DatabaseService, private typeAccident: TypeAccidentService, private contrat: ContratService) { }

    getSinistre() {
        return this.Sinistre;
    }

    setSinistre(Sinistre: Sinistre) {
        this.Sinistre = Sinistre;
    }

    async getSinistreByIdClient(idClient: string) {
        const query = `select sinistre.*
        from contrat
        join sinistre
        on sinistre.id_contrat = contrat.id_contrat
        where contrat.id_client = ${idClient}`;
        console.log(query);
        const result = await this.databaseService.executeQuery(query);
        const sinistres = [];
        for (let i = 0; i < result.length; i++) {
            const typeAccident = await this.typeAccident.getTypeAccidentById(result[i].id_type_accident);
            const contrat = await this.contrat.getContratById(result[i].id_contrat);
            const photos = await this.getSinistrePhoto(result[i].id_sinistre);
            const sinistre = new Sinistre(result[i].id_sinistre, contrat, result[i].date_heure_incident, result[i].lieu_incident, result[i].description, result[i].expert, result[i].status, typeAccident, photos);
            sinistres.push(sinistre);
        }
        return sinistres;
    }

    async getAllSinistres() {
        const query = 'SELECT * FROM sinistre';
        const result = await this.databaseService.executeQuery(query);
        const sinistres = [];
        for (let i = 0; i < result.length; i++) {
            const typeAccident = await this.typeAccident.getTypeAccidentById(result[i].id_type_accident);
            const contrat = await this.contrat.getContratById(result[i].id_contrat);
            const photos = await this.getSinistrePhoto(result[i].id_sinistre);
            const sinistre = new Sinistre(result[i].id_sinistre, contrat, result[i].date_heure_incident, result[i].lieu_incident, result[i].description, result[i].expert, result[i].status, typeAccident, photos);
            sinistres.push(sinistre);
        }
        return sinistres;
    }

    async getSinistrePhoto(idSinistre: string) {
        const query = `SELECT * FROM photo_incident where id_Sinistre = '${idSinistre}'`
        const photos = []
        const resultat = await this.databaseService.executeQuery(query);
        for (let i = 0; i < resultat.length; i++) {
            photos.push(resultat[i].lien_photo);
        }
        return photos;
    }

    async getSinistreByIdContrat(idContrat: string) {
        const query = `SELECT * FROM Sinistre where id_contrat = '${idContrat}'`;
        console.log(query);
        const sinistres = [];
        const result = await this.databaseService.executeQuery(query);
        for (let i = 0; i < result.length; i++) {
            const typeAccident = await this.typeAccident.getTypeAccidentById(result[i].id_type_accident);
            const contrat = await this.contrat.getContratById(result[i].id_contrat);
            const photos = await this.getSinistrePhoto(result[i].id_sinistre);
            const sinistre = new Sinistre(result[i].id_sinistre, contrat, result[i].date_heure_incident, result[i].lieu_incident, result[i].description, result[i].expert, result[i].status, typeAccident, photos);
            sinistres.push(sinistre);
        }
        return sinistres;
    }

    async getSinistreById(idSinistre: string) {
        const query = `SELECT * FROM Sinistre where id_Sinistre = '${idSinistre}'`;
        console.log(query);
        const result = await this.databaseService.executeQuery(query);
        const i = 0;
        console.log(this.typeAccident);
        const typeAccident = await this.typeAccident.getTypeAccidentById(result[i].id_type_accident);
        const contrat = await this.contrat.getContratById(result[i].id_contrat);
        const photos = await this.getSinistrePhoto(result[i].id_sinistre);
        const sinistre = new Sinistre(result[i].id_sinistre, contrat, result[i].date_heure_incident, result[i].lieu_incident, result[i].description, result[i].expert, result[i].status, typeAccident, photos);
        return sinistre;
    }

    async newSinistre(id_contrat: number, date_heure_incident: Date, lieu_incident: string, description: string, expert: number, id_type_accident: number, liens: Array<string>) {
        console.log(liens);
        const query = `insert into Sinistre (id_contrat, date_heure_incident, lieu_incident, description, expert, id_type_accident) values (${id_contrat}, '${date_heure_incident}', '${lieu_incident}', '${description}', ${expert}, ${id_type_accident}) returning id_sinistre`;
        console.log(query);
        const resultat = await this.databaseService.executeQuery(query);
        for (let i = 0; i < liens.length; i++) {
            await this.insertPhotoIncident(resultat[0].id_sinistre, liens[i]);
        }
    }

    async insertPhotoIncident(idSinistre: number, lien: string) {
        const query = `insert into photo_incident (id_sinistre, lien_photo) values ('${idSinistre}', '${lien}')`;
        console.log(query);
        return await this.databaseService.executeQuery(query);
    }

    async validateSinistre(idSinistre: string) {
        const query = `update sinistre set status = 5 where id_Sinistre = '${idSinistre}'`;
        return await this.databaseService.executeQuery(query);
    }

    async annulerSinistre(idSinistre: string) {
        const query = `update sinistre set status = 0 where id_Sinistre = '${idSinistre}'`;
        return await this.databaseService.executeQuery(query);
    }

    async updateSinistre(idSinistre: number, nom: string) {
        const query = 'update Sinistre set nom = ? where id_Sinistre = ?';
        return await this.databaseService.executeQuery(query, [nom, idSinistre]);
    }

    async deleteSinistre(idSinistre: number) {
        const query = 'update Sinistre set status = 0 where id_Sinistre = ?';
        return await this.databaseService.executeQuery(query, [idSinistre]);
    }
}
