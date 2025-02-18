/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { Marque } from 'src/auth/model/vehicule/Marque.model';
import { DatabaseService } from 'src/auth/service/database.service';

@Injectable()
export class MarqueService {
    private Marque: Marque | null = null;

    constructor(private readonly databaseService: DatabaseService) { }

    getMarque() {
        return this.Marque;
    }

    setMarque(Marque: Marque) {
        this.Marque = Marque;
    }

    async getAllMarques() {
        const query = 'SELECT * FROM marque where status != 0';
        return await this.databaseService.executeQuery(query);
    }

    async getMarqueById(idMarque: number){
        const query = 'SELECT * FROM marque where id_Marque = '+idMarque;
        return await this.databaseService.executeQuery(query);
    }

    async newMarque(nom: string) {
        const query = 'insert into marque (nom) values (?)';
        return await this.databaseService.executeQuery(query, [nom]);
    }

    async updateMarque(idMarque: number, nom: string) {
        const query = 'update marque set nom = ? where id_marque = ?';
        return await this.databaseService.executeQuery(query, [nom, idMarque]);
    }

    async deleteMarque(idMarque: number) {
        const query = 'update marque set status = 0 where id_marque = ?';
        return await this.databaseService.executeQuery(query, [idMarque]);
    }
}
