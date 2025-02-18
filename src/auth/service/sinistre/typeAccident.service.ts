/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { TypeAccident } from 'src/auth/model/Sinistre/TypeAccident.model';
import { DatabaseService } from 'src/auth/service/database.service';

@Injectable()
export class TypeAccidentService {
    private TypeAccident: TypeAccident | null = null;

    constructor(private readonly databaseService: DatabaseService) { }

    getTypeAccident() {
        return this.TypeAccident;
    }

    setTypeAccident(TypeAccident: TypeAccident) {
        this.TypeAccident = TypeAccident;
    }

    async getAllTypeAccidents() {
        const query = 'SELECT * FROM type_accident where status != 0';
        return await this.databaseService.executeQuery(query);
    }

    async getTypeAccidentById(idTypeAccident: number){
        const query = 'SELECT * FROM type_accident where id_type_accident = '+idTypeAccident;
        console.log(query);
        return await this.databaseService.executeQuery(query);
    }

    async newTypeAccident(nom: string) {
        const query = 'insert into type_accident (nom) values (?)';
        return await this.databaseService.executeQuery(query, [nom]);
    }

    async updateTypeAccident(idTypeAccident: number, nom: string) {
        const query = 'update TypeAccident set nom = ? where id_TypeAccident = ?';
        return await this.databaseService.executeQuery(query, [nom, idTypeAccident]);
    }

    async deleteTypeAccident(idTypeAccident: number) {
        const query = 'update TypeAccident set status = 0 where id_TypeAccident = ?';
        return await this.databaseService.executeQuery(query, [idTypeAccident]);
    }
}
