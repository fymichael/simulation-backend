/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { Departement } from 'src/auth/model/auth/departement.model';
import { DatabaseService } from 'src/auth/service/database.service';

@Injectable()
export class DepartementService {
    private departement: Departement | null = null;

    constructor(private readonly databaseService: DatabaseService) { }

    setDepartement(departement: Departement) {
        this.departement = departement;
    }

    getDepartement() {
        return this.departement;
    }

    async getAllDepartements() {
        const query = 'SELECT * FROM departement where status != 0 order by id_departement asc';
        return await this.databaseService.executeQuery(query);
    }

    async getDepartementById(idDepartment: number) : Promise<Departement> {
        const query = 'SELECT * FROM departement where id_departement = '+idDepartment;
        const result = await this.databaseService.executeQuery(query);
        if(result.length === 0){
            throw new Error("Pas de departement recuperer");
        }

        return new Departement(result[0].id_departement, result[0].nom, result[0].nom_responsable, result[0].contact_responsable, result[0].localisation, result[0].status, result[0].code); 
    }

    async updateDepartment(idDepartement: number, nom: string, nom_responsable: string, contact_responsable: string, localisation: string, code: string): Promise<void> {
        const query = "UPDATE departement SET nom = '"+nom+"', nom_responsable = '"+nom_responsable+"', contact_responsable = '"+contact_responsable+"', localisation = '"+localisation+"', code = '"+code+"' WHERE id_departement = "+idDepartement;
        await this.databaseService.executeQuery(query);
    }
    
    async newDepartment(nom: string, nom_responsable: string, contact_responsable: string, localisation: string, code: string): Promise<void> {
        const query = `INSERT into departement (nom, nom_responsable, contact_responsable, localisation, code) values ('${nom}', '${nom_responsable}', '${contact_responsable}', '${localisation}', '${code}' )`;
        await this.databaseService.executeQuery(query);
    }

    async deleteDepartement(idDepartement: number) {
        const query = 'UPDATE departement set status = 0 WHERE id_departement = '+idDepartement;
        return this.databaseService.executeQuery(query);
    }
}
