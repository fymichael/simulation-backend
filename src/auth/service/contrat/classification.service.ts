/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { Classification } from 'src/auth/model/contrat/Classification.model';
import { DatabaseService } from 'src/auth/service/database.service';

@Injectable()
export class ClassificationService {
    private Classification: Classification | null = null;

    constructor(private readonly databaseService: DatabaseService) { }

    getClassification() {
        return this.Classification;
    }

    setClassification(Classification: Classification) {
        this.Classification = Classification;
    }

    async getAllClassifications() {
        const query = 'SELECT * FROM Classification where status != 0';
        return await this.databaseService.executeQuery(query);
    }

    async getClassificationById(idClassification: number){
        const query = 'SELECT * FROM Classification where id_Classification = '+idClassification;
        return await this.databaseService.executeQuery(query);
    }

    async newClassification(nom: string) {
        const query = 'insert into Classification (nom) values (?)';
        return await this.databaseService.executeQuery(query, [nom]);
    }

    async updateClassification(idClassification: number, nom: string) {
        const query = 'update Classification set nom = ? where id_Classification = ?';
        return await this.databaseService.executeQuery(query, [nom, idClassification]);
    }

    async deleteClassification(idClassification: number) {
        const query = 'update Classification set status = 0 where id_Classification = ?';
        return await this.databaseService.executeQuery(query, [idClassification]);
    }
}
