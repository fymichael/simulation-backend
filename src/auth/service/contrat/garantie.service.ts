/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { Garantie } from 'src/auth/model/contrat/garantie.model';
import { DatabaseService } from '../database.service';

@Injectable()
export class GarantieService {
    private Garantie: Garantie | null = null;

    constructor(private readonly databaseService: DatabaseService) { }

    getGarantie() {
        return this.Garantie;
    }

    setGarantie(Garantie: Garantie) {
        this.Garantie = Garantie;
    }

    async getAllGaranties() {
        const query = 'SELECT * FROM Garantie where status != 0';
        return await this.databaseService.executeQuery(query);
    }

    async getGarantieById(idGarantie: number) {
        const query = 'SELECT * FROM Garantie where id_Garantie = '+idGarantie;
        return await this.databaseService.executeQuery(query);
    }

    async getContratGaranties(idContrat: number) {
        const query = 'SELECT DISTINCT id_garantie FROM garantie_contrat where id_contrat = '+idContrat;
        const result = await this.databaseService.executeQuery(query);
        let garanties = [];
        for (let i = 0; i < result.length; i++) {
            const selectedGaranties = await this.getGarantieById(result[i].id_garantie);
            garanties.push(selectedGaranties);
        }
        return garanties;
    }

    async newGarantie(nom: string) {
        const query = 'insert into Garantie (nom) values (?)';
        return await this.databaseService.executeQuery(query, [nom]);
    }

    async newGarantieContrat(idGarantie: number,idContrat: number) {
        const query = "insert into garantie_contrat (id_garantie, id_contrat) values ("+idGarantie+", "+idContrat+")";
        return await this.databaseService.executeQuery(query);
    }

    async updateGarantie(idGarantie: number, nom: string) {
        const query = 'update Garantie set nom = ? where id_Garantie = ?';
        return await this.databaseService.executeQuery(query, [nom, idGarantie]);
    }

    async deleteGarantie(idGarantie: number) {
        const query = 'update Garantie set status = 0 where id_Garantie = ?';
        return await this.databaseService.executeQuery(query, [idGarantie]);
    }
}
