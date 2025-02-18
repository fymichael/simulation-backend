/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { Carrosserie } from 'src/auth/model/vehicule/carrosserie.model';
import { DatabaseService } from 'src/auth/service/database.service';

@Injectable()
export class CarrosserieService {
    private Carrosserie: Carrosserie | null = null;

    constructor(private readonly databaseService: DatabaseService) { }

    getCarrosserie() {
        return this.Carrosserie;
    }

    setCarrosserie(Carrosserie: Carrosserie) {
        this.Carrosserie = Carrosserie;
    }

    async getAllCarrosseries() {
        const query = 'SELECT * FROM Carrosserie where status != 0';
        return await this.databaseService.executeQuery(query);
    }

    async getCarrosserieById(idCarrosserie: number) {
        const query = 'SELECT * FROM Carrosserie where id_Carrosserie = '+idCarrosserie;
        return await this.databaseService.executeQuery(query);
    }

    async newCarrosserie(nom: string) {
        const query = 'insert into Carrosserie (nom) values (?)';
        return await this.databaseService.executeQuery(query, [nom]);
    }

    async updateCarrosserie(idCarrosserie: number, nom: string) {
        const query = 'update Carrosserie set nom = ? where id_carrosserie = ?';
        return await this.databaseService.executeQuery(query, [nom, idCarrosserie]);
    }

    async deleteCarrosserie(idCarrosserie: number) {
        const query = 'update Carrosserie set status = 0 where id_carrosserie = ?';
        return await this.databaseService.executeQuery(query, [idCarrosserie]);
    }
}
