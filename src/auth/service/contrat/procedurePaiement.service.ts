/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { ProcedurePaiement } from 'src/auth/model/contrat/procedurePaiement.model';
import { DatabaseService } from '../database.service';

@Injectable()
export class ProcedurePaiementService {
    private ProcedurePaiement: ProcedurePaiement | null = null;

    constructor(private readonly databaseService: DatabaseService) { }

    getProcedurePaiement() {
        return this.ProcedurePaiement;
    }

    setProcedurePaiement(ProcedurePaiement: ProcedurePaiement) {
        this.ProcedurePaiement = ProcedurePaiement;
    }

    async getAllProcedurePaiements() {
        const query = 'SELECT * FROM Procedure_Paiement where status != 0';
        return await this.databaseService.executeQuery(query);
    }

    async getProcedurePaiementById(idProcedurePaiement: number){
        const query = 'SELECT * FROM Procedure_Paiement where id_procedure_paiement = '+idProcedurePaiement;
        return await this.databaseService.executeQuery(query);
    }

    async getContratProcedurePaiement(idContrat: number){
        const query = 'SELECT * FROM Procedure_Paiement where id_contrat = '+idContrat;
        return await this.databaseService.executeQuery(query);
    }
    

    async newProcedurePaiement( date_paiement: Date, pourcentage: number, idContrat: number) {
        const query = "insert into Procedure_Paiement (date_paiement, pourcentage, id_contrat) values ('"+date_paiement+"', "+pourcentage+", "+idContrat+")";
        await this.databaseService.executeQuery(query);
    }

    async updateProcedurePaiement(idProcedurePaiement: number, nom: string) {
        const query = 'update Procedure_Paiement set nom = ? where id_ProcedurePaiement = ?';
        return await this.databaseService.executeQuery(query, [nom, idProcedurePaiement]);
    }

    async deleteProcedurePaiement(idProcedurePaiement: number) {
        const query = 'update Procedure_Paiement set status = 0 where id_ProcedurePaiement = ?';
        return await this.databaseService.executeQuery(query, [idProcedurePaiement]);
    }
}