/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { Energie } from 'src/auth/model/vehicule/Energie.model';
import { DatabaseService } from 'src/auth/service/database.service';

@Injectable()
export class EnergieService {
    private Energie: Energie | null = null;

    constructor(private readonly databaseService: DatabaseService) { }

    getEnergie() {
        return this.Energie;
    }

    setEnergie(Energie: Energie) {
        this.Energie = Energie;
    }

    async getAllEnergies() {
        const query = 'SELECT * FROM energie where status != 0';
        return await this.databaseService.executeQuery(query);
    }

    async getEnergieById(idEnergie: number){
        const query = 'SELECT * FROM energie where id_Energie = '+idEnergie;
        return await this.databaseService.executeQuery(query);
    }

    async newEnergie(nom: string) {
        const query = 'insert into energie (nom) values (?)';
        return await this.databaseService.executeQuery(query, [nom]);
    }

    async updateEnergie(idEnergie: number, nom: string) {
        const query = 'update energie set nom = ? where id_energie = ?';
        return await this.databaseService.executeQuery(query, [nom, idEnergie]);
    }

    async deleteEnergie(idEnergie: number) {
        const query = 'update energie set status = 0 where id_energie = ?';
        return await this.databaseService.executeQuery(query, [idEnergie]);
    }
}
