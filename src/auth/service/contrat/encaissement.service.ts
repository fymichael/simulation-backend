import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { Encaissement } from 'src/auth/model/contrat/encaissements.model';
import { ProcedurePaiementService } from './procedurePaiement.service';
import { TypePaiement } from 'src/auth/model/contrat/typePaiement.model';

@Injectable()
export class EncaissementService {

    constructor(
        private readonly databaseService: DatabaseService,
        private readonly procedurePaiementService: ProcedurePaiementService,
    ) { }

    async getContratEncaissement(idContrat: number) {
        const query = `select e.* from encaissement e join procedure_paiement pp on pp.id_procedure_paiement = e.id_procedure_paiement where pp.id_contrat = ${idContrat} and e.status != 0`;
        const resultats = await this.databaseService.executeQuery(query);
        let encaissements = []
        for (let i = 0; i < resultats.length; i++) {
            const procedurePaiement = await this.procedurePaiementService.getProcedurePaiementById(resultats[i].id_procedure_paiement);
            encaissements.push(new Encaissement(resultats[i].id_encaissement, procedurePaiement, resultats[i].date_encaissement, resultats[i].montant, resultats[i].status, resultats[i].numero_piece));            
        }
        return encaissements;
    }

    async newEncaissement(idProcedurePaimement: number, date_encaissement: Date, montant: number, numero_pieces) {
        const query1 = `update procedure_paiement set status = 5 where id_procedure_paiement = ${idProcedurePaimement}`;
        await this.databaseService.executeQuery(query1);
        const query = `insert into encaissement values (default, ${idProcedurePaimement}, '${date_encaissement}', ${montant}, 5, '${numero_pieces}')`
        await this.databaseService.executeQuery(query);
    }

    async annulerEncaissement(idEncaissement: number) {
        const query = `update encaissement set status = 0 where id_encaissement = ${idEncaissement}`;
        await this.databaseService.executeQuery(query);
    }
}
