/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { Exoneration } from 'src/auth/model/contrat/Exoneration.model';
import { DatabaseService } from 'src/auth/service/database.service';

@Injectable()
export class ExonerationService {
    private Exoneration: Exoneration | null = null;

    constructor(private readonly databaseService: DatabaseService) { }

    getExoneration() {
        return this.Exoneration;
    }

    setExoneration(Exoneration: Exoneration) {
        this.Exoneration = Exoneration;
    }

    async getAllExonerations() {
        const query = 'SELECT * FROM exoneration where status != 0';
        return await this.databaseService.executeQuery(query);
    }

    async getExonerationById(idExoneration: number) {
        const query = 'SELECT * FROM exoneration where id_exoneration = '+idExoneration;
        return await this.databaseService.executeQuery(query);
    }

    async newExoneration(nom: string) {
        const query = 'insert into exoneration (nom) values (?)';
        return await this.databaseService.executeQuery(query, [nom]);
    }

    async updateExoneration(idExoneration: number, nom: string) {
        const query = 'update exoneration set nom = ? where id_exoneration = ?';
        return await this.databaseService.executeQuery(query, [nom, idExoneration]);
    }

    async deleteExoneration(idExoneration: number) {
        const query = 'update exoneration set status = 0 where id_exoneration = ?';
        return await this.databaseService.executeQuery(query, [idExoneration]);
    }
}
