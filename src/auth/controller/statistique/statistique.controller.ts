/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Param, Get } from '@nestjs/common';
import { StatistiqueService } from 'src/auth/service/statistique/statistique.service';

@Controller()
export class StatistiqueController {

    constructor(private statistiqueService: StatistiqueService) { }

    @Get('/globaleStat/:annee')
    async getGlobalStatResult(@Param('annee') annee: number) {
        // for row 1
        const resultat1 = await this.statistiqueService.getGlobalStat(annee);
        console.log(resultat1);

        // for row 2
        const resultat2 = await this.statistiqueService.statEncaissementArriere(annee);
        console.log(resultat2);

        // chart Arriere and Encaissement
        const resultat3 = await this.statistiqueService.ArriereChartData(annee);
        const resultat4 = await this.statistiqueService.EncaissementChartData(annee);

        // statistique des accidents
        const resultat5 = await this.statistiqueService.statAccident(annee);

        // statistique global des sinistres
        const resultat6 = await this.statistiqueService.statSinistre(annee);

        // chart sinistres
        const resultat7 = await this.statistiqueService.sinistreRepartition(annee);

        // for last row
        const resultat8 = await this.statistiqueService.contratRepartition(annee);

        return {
            montant_encaissement: resultat1.get('montant_encaissement'),
            montant_arriere: resultat1.get('montant_arriere'),
            contrat_actifs: resultat1.get('contrat_actifs'),
            contrat_resilier: resultat1.get('contrat_resilier'),
            agence_actifs: resultat2.get('agence_actifs'),
            agence_resilier: resultat2.get('agence_resilier'),
            agence_encaissement: resultat2.get('agence_encaissement'),
            agence_arriere: resultat2.get('agence_arriere'),
            arriere_data: resultat3,
            encaissement_data: resultat4,
            accident_corporel: resultat5.get('accident_corporel'),
            accident_materiel_corporel: resultat5.get('accident_materiel_corporel'),
            accident_materiel: resultat5.get('accident_materiel'),
            sinistre_declare: resultat6.get('sinistre_declare'),
            sinistre_approuve: resultat6.get('sinistre_approuve'),
            sinistre_non_approuve: resultat6.get('sinistre_non_approuve'),
            sinistre_repartition: resultat7,
            repartition_contrat_actifs: resultat8.get('repartition_contrat_actifs'),
            repartition_contrat_resilier: resultat8.get('repartition_contrat_resilier'),
            nombre_contrat_actifs: resultat8.get('nombre_contrat_actifs'),
            nombre_contrat_resilier: resultat8.get('nombre_contrat_resilier'),
        };
    }
}
